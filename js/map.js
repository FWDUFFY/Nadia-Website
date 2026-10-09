/*
 * "Where we work" map and country panels.
 *
 * Reads window.IFSHHE_COUNTRIES (id, code, lat, lon, home) and window.t.
 * Scripts the static chips (#country-chips), panels (#country-panels) and the
 * map frame (#map-stage). The world outlines are fetched lazily from
 * /data/world.json (built by scripts/build-map.mjs) and drawn as <path>s.
 * Pins are <button>s and the accessible way to pick a country on the map;
 * the country paths are decorative hover/click affordances.
 *
 * Only global: window.IFSHHE_selectCountry(code, { focus })
 */
(function () {
  "use strict";

  var doc = document;
  var countries = Array.isArray(window.IFSHHE_COUNTRIES) ? window.IFSHHE_COUNTRIES : [];
  var byCode = {};
  var byId = {};
  countries.forEach(function (c) { if (c && c.code) { byCode[c.code] = c; byId[String(c.id)] = c; } });

  var where = doc.getElementById("where");
  var chipsBox = doc.getElementById("country-chips");
  var panelsBox = doc.getElementById("country-panels");
  var stage = doc.getElementById("map-stage");
  var svg = doc.getElementById("world-map");
  var pinsBox = doc.getElementById("map-pins");
  var tooltip = doc.getElementById("map-tooltip");
  var fallback = doc.getElementById("map-fallback");

  var chips = chipsBox ? toArray(chipsBox.querySelectorAll("a.chip[data-country]")) : [];
  var panels = panelsBox ? toArray(panelsBox.querySelectorAll(".country-panel[data-country]")) : [];

  var SVG_NS = "http://www.w3.org/2000/svg";
  var MOBILE_MQ = "(max-width: 699.98px)";
  var reduceMotion = matches("(prefers-reduced-motion: reduce)");
  var coarsePointer = matches("(hover: none), (pointer: coarse)");

  var selected = null;
  var world = null;          // parsed world.json
  var view = null;           // current viewBox {x, y, w, h}
  var paths = {};            // code -> <path class="land is-active">
  var pins = {};             // code -> <button class="map-pin">
  var outline = null;        // top-layer hover outline <path>
  var mapState = "idle";     // idle | loading | ready | failed

  function toArray(list) { return Array.prototype.slice.call(list || []); }
  function matches(q) { try { return window.matchMedia(q).matches; } catch (e) { return false; } }
  function tr(key, vars) {
    var fn = window.t;
    if (typeof fn !== "function") return key;
    try { return fn(key, vars); } catch (e) { return key; }
  }
  function countryName(code) {
    var key = "country." + code + ".name";
    var name = tr(key);
    if (name && name !== key) return name;
    var chip = chipFor(code);
    if (chip && chip.textContent.trim()) return chip.textContent.trim();
    for (var i = 0; world && i < world.countries.length; i++) {
      if (String(world.countries[i].id) === String(byCode[code].id)) return world.countries[i].name;
    }
    return code.toUpperCase();
  }
  function partnerName(code) {
    var key = "country." + code + ".partner";
    var p = tr(key);
    if (p && p !== key) return p;
    var el = panelFor(code) && panelFor(code).querySelector(".country-partner [data-i18n$='.partner']");
    return el ? el.textContent.trim() : "";
  }
  function selectedSuffix() {
    var key = "where.selected";
    var s = tr(key);
    if (!s || s === key) s = "selected";
    return /^[\s,،]/.test(s) ? s : ", " + s;
  }
  function chipFor(code) {
    for (var i = 0; i < chips.length; i++) if (chips[i].getAttribute("data-country") === code) return chips[i];
    return null;
  }
  function panelFor(code) {
    for (var i = 0; i < panels.length; i++) if (panels[i].getAttribute("data-country") === code) return panels[i];
    return null;
  }
  function codeFromHash() {
    var m = /^#country-([a-z]{2})$/i.exec(window.location.hash || "");
    return m && byCode[m[1].toLowerCase()] ? m[1].toLowerCase() : null;
  }

  /* ---------- Selection ---------- */

  function select(code, opts) {
    opts = opts || {};
    if (!byCode[code] || !panelFor(code)) return false;   // needs a chip + panel in index.html
    var changed = code !== selected;
    selected = code;

    chips.forEach(function (a) {
      if (a.getAttribute("data-country") === code) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });

    panels.forEach(function (p) {
      var on = p.getAttribute("data-country") === code;
      if (on && changed && !reduceMotion && doc.documentElement.classList.contains("js")) {
        p.classList.add("is-entering");
        p.classList.add("is-active");
        void p.offsetWidth; // flush so the transition runs from the entering state
        p.classList.remove("is-entering");
      } else {
        p.classList.toggle("is-active", on);
        p.classList.remove("is-entering");
      }
    });

    Object.keys(paths).forEach(function (c) { paths[c].classList.toggle("is-selected", c === code); });
    Object.keys(pins).forEach(function (c) {
      var btn = pins[c];
      var on = c === code;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.setAttribute("aria-label", countryName(c) + (on ? selectedSuffix() : ""));
    });

    if (changed && opts.updateHash !== false) {
      try { window.history.replaceState(window.history.state, "", "#country-" + code); } catch (e) { /* ignore */ }
    }
    if (changed && opts.scrollChip !== false) revealChip(code);

    if (opts.focus) {
      var panel = panelFor(code);
      var heading = panel && panel.querySelector("h3[tabindex='-1']");
      if (heading) heading.focus({ preventScroll: !!opts.preventScroll });
    }
    return true;
  }

  function revealChip(code) {
    var chip = chipFor(code);
    if (!chip || !chipsBox || chipsBox.scrollWidth <= chipsBox.clientWidth) return;
    var cr = chip.getBoundingClientRect();
    var br = chipsBox.getBoundingClientRect();
    var dx = cr.left < br.left + 24 ? cr.left - br.left - 24 : cr.right > br.right - 24 ? cr.right - br.right + 24 : 0;
    if (!dx) return;
    try { chipsBox.scrollBy({ left: dx, behavior: reduceMotion ? "auto" : "smooth" }); }
    catch (e) { chipsBox.scrollLeft += dx; }
  }

  /* ---------- Chips ---------- */

  chips.forEach(function (a) {
    a.addEventListener("click", function (ev) {
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button) return;
      ev.preventDefault();
      select(a.getAttribute("data-country"), { focus: ev.detail === 0 });
    });
  });

  /* ---------- Map ---------- */

  function ns(tag) { return doc.createElementNS(SVG_NS, tag); }

  function loadMap() {
    if (mapState !== "idle" || !svg || !stage) return;
    mapState = "loading";
    if (typeof window.fetch !== "function") { failMap(); return; }
    window.fetch("/data/world.json", { credentials: "same-origin" })
      .then(function (res) { if (!res.ok) throw new Error("HTTP " + res.status); return res.json(); })
      .then(drawMap)
      .catch(failMap);
  }

  function failMap() {
    mapState = "failed";
    if (stage) stage.hidden = true;
    if (fallback) fallback.hidden = false;
  }

  function drawMap(json) {
    if (!json || !json.countries || !json.width || !json.height) throw new Error("bad world.json");
    world = json;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var frag = doc.createDocumentFragment();
    json.countries.forEach(function (c) {
      var p = ns("path");
      var country = byId[String(c.id)];
      p.setAttribute("d", c.d);
      p.setAttribute("data-id", String(c.id));
      p.setAttribute("class", country ? "land is-active" : "land");
      if (country) { p.setAttribute("data-country", country.code); paths[country.code] = p; }
      frag.appendChild(p);
    });
    outline = ns("path");
    outline.setAttribute("class", "land-outline");
    frag.appendChild(outline);
    svg.appendChild(frag);

    if (pinsBox) {
      while (pinsBox.firstChild) pinsBox.removeChild(pinsBox.firstChild);
      var i = 0;
      countries.forEach(function (c) {
        var xy = json.pins && json.pins[c.code];
        if (!xy || !panelFor(c.code)) return;   // no panel in the HTML yet: no pin
        var btn = doc.createElement("button");
        btn.type = "button";
        btn.className = "map-pin" + (c.home ? " map-pin--home" : "");
        btn.setAttribute("data-country", c.code);
        btn.setAttribute("aria-pressed", "false");
        btn.style.setProperty("--i", String(i++));
        var halo = doc.createElement("span"); halo.className = "map-pin__halo"; halo.setAttribute("aria-hidden", "true");
        var dot = doc.createElement("span"); dot.className = "map-pin__dot"; dot.setAttribute("aria-hidden", "true");
        var label = doc.createElement("span"); label.className = "map-pin__label"; label.textContent = countryName(c.code);
        btn.appendChild(halo); btn.appendChild(dot); btn.appendChild(label);
        pinsBox.appendChild(btn);
        pins[c.code] = btn;
      });
    }

    mapState = "ready";
    applyView();
    if (selected) select(selected, { updateHash: false, scrollChip: false });
    bindMapEvents();
  }

  /* View box: full map on wide screens; a tight crop around the active countries on phones. */
  function applyView() {
    if (mapState !== "ready" || !world) return;
    var W = world.width, H = world.height;
    var next = { x: 0, y: 0, w: W, h: H };
    if (matches(MOBILE_MQ)) {
      var box = activeBBox();
      if (box) {
        var padX = box.w * 0.12, padY = box.h * 0.12;
        var cx = box.x + box.w / 2, cy = box.y + box.h / 2;
        var w = box.w + padX * 2, h = box.h + padY * 2;
        var aspect = stage.clientHeight > 0 ? stage.clientWidth / stage.clientHeight : 1;
        if (w / h < aspect) w = h * aspect; else h = w / aspect;
        var x = cx - w / 2, y = cy - h / 2;
        if (w < W) x = Math.min(Math.max(x, 0), W - w); else x = (W - w) / 2;
        if (h < H) y = Math.min(Math.max(y, 0), H - h); else y = (H - h) / 2;
        next = { x: x, y: y, w: w, h: h };
      }
    }
    view = next;
    svg.setAttribute("viewBox", [r1(view.x), r1(view.y), r1(view.w), r1(view.h)].join(" "));
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    Object.keys(pins).forEach(function (code) {
      var xy = world.pins[code];
      pins[code].style.left = ((xy[0] - view.x) / view.w * 100).toFixed(3) + "%";
      pins[code].style.top = ((xy[1] - view.y) / view.h * 100).toFixed(3) + "%";
    });
  }
  function r1(n) { return Math.round(n * 10) / 10; }

  function activeBBox() {
    var box = null;
    Object.keys(paths).forEach(function (code) {
      var b;
      try { b = paths[code].getBBox(); } catch (e) { return; }
      if (!b || !(b.width > 0)) return;
      if (!box) box = { x: b.x, y: b.y, w: b.width, h: b.height };
      else {
        var x0 = Math.min(box.x, b.x), y0 = Math.min(box.y, b.y);
        var x1 = Math.max(box.x + box.w, b.x + b.width), y1 = Math.max(box.y + box.h, b.y + b.height);
        box = { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
      }
    });
    return box;
  }

  var resizeTimer = 0;
  function onResize() {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(applyView, 150);
  }

  /* ---------- Hover outline, tooltip, clicks, keyboard ---------- */

  function activePathFrom(target) {
    var el = target;
    while (el && el !== svg) {
      if (el.nodeType === 1 && el.getAttribute("data-country") && el.classList.contains("land")) return el;
      el = el.parentNode;
    }
    return null;
  }
  var hovered = null;
  function setHover(path) {
    if (hovered === path) return;
    if (hovered) hovered.classList.remove("is-hover");
    hovered = path;
    if (path) {
      path.classList.add("is-hover");
      outline.setAttribute("d", path.getAttribute("d"));
    } else {
      outline.removeAttribute("d");
      hideTooltip();
    }
  }
  function showTooltip(code, clientX, clientY) {
    if (!tooltip || coarsePointer) return;
    if (tooltip.getAttribute("data-country") !== code) {
      while (tooltip.firstChild) tooltip.removeChild(tooltip.firstChild);
      var name = doc.createElement("span"); name.className = "map-tooltip__name"; name.textContent = countryName(code);
      tooltip.appendChild(name);
      var partner = partnerName(code);
      if (partner) {
        var p = doc.createElement("span"); p.className = "map-tooltip__partner"; p.textContent = partner;
        tooltip.appendChild(p);
      }
      tooltip.setAttribute("data-country", code);
    }
    tooltip.hidden = false;
    var r = stage.getBoundingClientRect();
    var half = tooltip.offsetWidth / 2 + 4;
    var x = Math.min(Math.max(clientX - r.left, half), r.width - half);
    tooltip.style.left = x.toFixed(1) + "px";
    tooltip.style.top = (clientY - r.top).toFixed(1) + "px";
  }
  function hideTooltip() {
    if (tooltip) tooltip.hidden = true;
  }

  function bindMapEvents() {
    svg.addEventListener("pointermove", function (ev) {
      if (ev.pointerType === "touch") return;
      var path = activePathFrom(ev.target);
      setHover(path);
      if (path) showTooltip(path.getAttribute("data-country"), ev.clientX, ev.clientY);
    });
    svg.addEventListener("pointerleave", function () { setHover(null); });
    svg.addEventListener("click", function (ev) {
      var path = activePathFrom(ev.target);
      if (path) select(path.getAttribute("data-country"), { focus: false });
    });

    pinsBox.addEventListener("click", function (ev) {
      var btn = ev.target.closest ? ev.target.closest(".map-pin") : null;
      if (!btn) return;
      select(btn.getAttribute("data-country"), { focus: ev.detail === 0 });
    });
    pinsBox.addEventListener("keydown", function (ev) {
      var btn = ev.target.closest ? ev.target.closest(".map-pin") : null;
      if (!btn) return;
      var list = toArray(pinsBox.querySelectorAll(".map-pin"));
      var i = list.indexOf(btn);
      var next = -1;
      switch (ev.key) {
        case "ArrowRight": case "ArrowDown": next = (i + 1) % list.length; break;
        case "ArrowLeft": case "ArrowUp": next = (i - 1 + list.length) % list.length; break;
        case "Home": next = 0; break;
        case "End": next = list.length - 1; break;
        default: return; // Enter/Space fall through to the native click (detail === 0)
      }
      ev.preventDefault();
      list[next].focus();
    });

    window.addEventListener("resize", onResize);
    try { window.matchMedia(MOBILE_MQ).addEventListener("change", onResize); } catch (e) { /* old Safari */ }
  }

  /* ---------- Boot ---------- */

  if (chips.length || panels.length) {
    var initial = codeFromHash();
    var fromHash = !!initial;
    if (!initial) {
      var current = chips.filter(function (a) { return a.getAttribute("aria-current") === "true"; })[0];
      initial = current ? current.getAttribute("data-country") : (countries[0] && countries[0].code);
    }
    if (initial) select(initial, { updateHash: false, scrollChip: fromHash });
    if (fromHash && where) {
      // The panel may have moved once main.js switched the layout; land on the section.
      window.requestAnimationFrame(function () {
        try { where.scrollIntoView({ block: "start", behavior: "instant" }); } catch (e) { where.scrollIntoView(); }
      });
    }
    window.addEventListener("hashchange", function () {
      var code = codeFromHash();
      if (code && code !== selected) select(code, { focus: true, updateHash: false });
    });
  }

  if (where && svg && stage) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); loadMap(); }
      }, { rootMargin: "600px 0px" });
      io.observe(where);
    } else {
      loadMap();
    }
  }

  window.IFSHHE_selectCountry = function (code, opts) {
    return select(String(code || "").toLowerCase(), opts || {});
  };
})();
