/*
 * IFSHHE — page behaviour (no dependencies).
 * Everything here is progressive enhancement: the page reads fine without it.
 * Order: helpers → header/nav → language menu → drawer → reveal → gallery →
 * dynamic content (partners, members, stats, Instagram) → contact form →
 * floating CTA → visitor counter → year.
 */
document.documentElement.classList.add("js");

(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const t = (key, vars) => (typeof window.t === "function" ? window.t(key, vars) : key);
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const mobileMQ = matchMedia("(max-width: 959.98px)");
  const lang = (document.documentElement.lang || "en").slice(0, 2);
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';

  /* ---------- Header: scrolled state + real height as a CSS variable ---------- */
  const header = $("#site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    const setHeight = () => document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
    if ("ResizeObserver" in window) new ResizeObserver(setHeight).observe(header); else setHeight();
  }

  /* ---------- Hero: arc underline under the last word of the H1 ---------- */
  const h1 = $("#hero-title");
  if (h1 && h1.childElementCount === 0) {
    const words = h1.textContent.trim().split(/\s+/);
    const last = words.pop();
    const span = document.createElement("span");
    span.className = "u-arc";
    span.textContent = last;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 220 14");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M3 10 C 60 2, 160 2, 217 9");
    svg.append(path);
    span.append(svg);
    h1.textContent = words.length ? words.join(" ") + " " : "";
    h1.append(span);
  }

  /* ---------- Nav: aria-current follows the section in view ---------- */
  const navLinks = $$(".nav-list a[href^='#']");
  if (navLinks.length && "IntersectionObserver" in window) {
    const byId = new Map(navLinks.map((a) => [a.getAttribute("href").slice(1), a]));
    const sections = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
    // #contact is the CTA, not a nav link; watching it clears the highlight at the bottom.
    const contact = $("#contact");
    if (contact) sections.push(contact);
    const visible = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
      let best = null, ratio = 0;
      visible.forEach((r, id) => { if (r > ratio) { ratio = r; best = id; } });
      navLinks.forEach((a) => {
        if (a.getAttribute("href") === "#" + best) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    }, { rootMargin: "-35% 0px -45% 0px", threshold: [0, .1, .25, .5] });
    sections.forEach((s) => io.observe(s));
  }

  /* ---------- Language menu (button + popover of links) ---------- */
  const langButton = $("#lang-button");
  const langMenu = $("#lang-menu");
  const langCode = $("#lang-code");
  if (langCode) langCode.textContent = lang.toUpperCase();
  if (langButton && langMenu) {
    const items = $$("a", langMenu);
    const setOpen = (open, focusItem) => {
      langMenu.hidden = !open;
      langButton.setAttribute("aria-expanded", String(open));
      if (open && focusItem !== false) (items.find((a) => a.getAttribute("aria-current") === "true") || items[0]).focus();
    };
    langButton.addEventListener("click", () => setOpen(langMenu.hidden));
    langButton.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); setOpen(true); if (e.key === "ArrowUp") items[items.length - 1].focus(); }
    });
    langMenu.addEventListener("keydown", (e) => {
      const i = items.indexOf(document.activeElement);
      const go = (n) => { e.preventDefault(); items[(n + items.length) % items.length].focus(); };
      if (e.key === "ArrowDown") go(i + 1);
      else if (e.key === "ArrowUp") go(i - 1);
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(items.length - 1);
      else if (e.key === "Escape") { setOpen(false); langButton.focus(); }
    });
    // Tab-out and click-outside both close the menu.
    langMenu.parentElement.addEventListener("focusout", (e) => {
      if (!langMenu.parentElement.contains(e.relatedTarget)) setOpen(false, false);
    });
    document.addEventListener("click", (e) => { if (!langMenu.hidden && !e.target.closest(".lang")) setOpen(false, false); });
  }

  /* ---------- Mobile drawer ---------- */
  const nav = $("#site-nav");
  const toggle = $("#menu-toggle");
  const backdrop = $("#drawer-backdrop");
  const drawerClose = $("#drawer-close");
  let drawerOpen = false;
  const inertTargets = () => ["main", ".site-footer", ".brand", ".header-tools", ".float-cta"].map((s) => $(s)).filter(Boolean);

  function setDrawer(open) {
    if (!nav || !toggle || open === drawerOpen) return;
    drawerOpen = open;
    nav.classList.toggle("is-open", open);
    backdrop && backdrop.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".visually-hidden").textContent = t(open ? "nav.close" : "nav.menu");
    document.body.classList.toggle("is-locked", open);
    inertTargets().forEach((el) => { if (open) el.setAttribute("inert", ""); else el.removeAttribute("inert"); });
    if (open) {
      (drawerClose || $$(FOCUSABLE, nav)[0]).focus();
    } else {
      toggle.focus({ preventScroll: true });
    }
    updateFloat();
  }
  if (nav && toggle) {
    // The toggle and close controls are links (#site-nav / #top) so the drawer also
    // works without JavaScript via :target; with JavaScript we take over the click.
    toggle.addEventListener("click", (e) => { e.preventDefault(); setDrawer(!drawerOpen); });
    drawerClose && drawerClose.addEventListener("click", (e) => { e.preventDefault(); setDrawer(false); });
    backdrop && backdrop.addEventListener("click", () => setDrawer(false));
    nav.addEventListener("click", (e) => { if (e.target.closest("a[href^='#']") && !e.target.closest("#drawer-close")) setDrawer(false); });
    if (location.hash === "#site-nav") history.replaceState(null, "", location.pathname + location.search);
    nav.addEventListener("keydown", (e) => {
      if (!drawerOpen) return;
      if (e.key === "Escape") { e.preventDefault(); setDrawer(false); return; }
      if (e.key !== "Tab") return;
      const f = $$(FOCUSABLE, nav).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    mobileMQ.addEventListener("change", (e) => { if (!e.matches) setDrawer(false); });
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && drawerOpen) setDrawer(false); });

  /* ---------- Scroll reveal with sibling stagger ---------- */
  const revealEls = $$("[data-reveal]");
  if (revealEls.length) {
    // Delay = position among revealable siblings × 80ms, capped at 4 steps.
    revealEls.forEach((el) => {
      const sibs = [...el.parentElement.children].filter((c) => c.hasAttribute("data-reveal"));
      const i = Math.min(sibs.indexOf(el), 4);
      if (i > 0 && !reduceMotion.matches) el.style.transitionDelay = (i * 80) + "ms";
    });
    $$(".hero [data-reveal]").forEach((el) => el.classList.add("is-visible")); // hero shows on load
    if ("IntersectionObserver" in window && !reduceMotion.matches) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
      }, { threshold: .15, rootMargin: "0px 0px -5% 0px" });
      revealEls.forEach((el) => { if (!el.classList.contains("is-visible")) io.observe(el); });
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }
  }

  /* ---------- Gallery lightbox (native <dialog>) ---------- */
  const lightbox = $("#lightbox");
  if (lightbox && typeof lightbox.showModal === "function") {
    const img = $("#lightbox-img"), cap = $("#lightbox-cap");
    let opener = null;
    $$("[data-lightbox]").forEach((btn) => btn.addEventListener("click", () => {
      const src = btn.querySelector("img");
      img.src = btn.dataset.full || src.currentSrc || src.src;
      img.alt = src.alt;
      const figcap = btn.parentElement.querySelector("figcaption");
      cap.textContent = figcap ? figcap.textContent : "";
      opener = btn;
      lightbox.showModal();
    }));
    $("#lightbox-close").addEventListener("click", () => lightbox.close());
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });
    lightbox.addEventListener("close", () => { img.removeAttribute("src"); if (opener) opener.focus(); });
  }

  /* ---------- Partners strip from content.js (static HTML is the no-JS fallback) ---------- */
  const partnerList = $("#partner-list");
  const partners = window.IFSHHE_PARTNERS;
  if (partnerList && Array.isArray(partners) && partners.length) {
    partnerList.replaceChildren(...partners.map((p) => {
      const li = document.createElement("li"); li.className = "partner";
      const name = document.createElement("span"); name.className = "partner-name"; name.textContent = p.name;
      li.append(name);
      if (p.country) { const place = document.createElement("span"); place.className = "partner-place"; place.textContent = t("country." + p.country + ".name"); li.append(place); }
      return li;
    }));
  }

  /* ---------- Members (only when real names exist) ---------- */
  const members = window.IFSHHE_MEMBERS;
  const peopleGrid = $("#people-grid"), joinCard = $("#people-join"), placeholder = $("#people-placeholder");
  if (peopleGrid && Array.isArray(members) && members.length) {
    placeholder && placeholder.remove();
    members.forEach((m) => {
      const card = document.createElement("article"); card.className = "card member";
      const avatar = document.createElement("div"); avatar.className = "avatar"; avatar.setAttribute("aria-hidden", "true");
      if (m.photo) { const im = document.createElement("img"); im.src = m.photo; im.alt = ""; im.loading = "lazy"; im.width = 112; im.height = 112; avatar.append(im); }
      else avatar.textContent = m.name.split(/\s+/).filter((w) => /^[A-Z]/.test(w) && !/^(Dr|Mr|Mrs|Ms|Prof)\.?$/.test(w)).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
      const name = document.createElement("h3"); name.textContent = m.name;
      const role = document.createElement("p"); role.textContent = (m.roleTranslations && m.roleTranslations[lang]) || m.role || "";
      card.append(avatar, name, role);
      if (m.link) {
        const a = document.createElement("a"); a.className = "text-link"; a.href = m.link; a.target = "_blank"; a.rel = "noopener";
        a.textContent = "Profile "; const sr = document.createElement("span"); sr.className = "visually-hidden"; sr.textContent = t("a11y.newTab"); a.append(sr);
        card.append(a);
      }
      peopleGrid.insertBefore(card, joinCard);
    });
  }

  /* ---------- Stats row (only when numbers are confirmed) ---------- */
  const stats = window.IFSHHE_STATS;
  const statsEl = $("#stats");
  if (statsEl && Array.isArray(stats) && stats.length) {
    stats.forEach((s) => {
      const item = document.createElement("div"); item.className = "stat";
      const num = document.createElement("span"); num.className = "stat-number"; num.dataset.value = s.value; num.dataset.suffix = s.suffix || "";
      num.textContent = (reduceMotion.matches ? Number(s.value).toLocaleString(lang) : "0") + (s.suffix || "");
      const label = document.createElement("span"); label.className = "stat-label"; label.textContent = (s.labelTranslations && s.labelTranslations[lang]) || s.label;
      item.append(num, label); statsEl.append(item);
    });
    statsEl.hidden = false;
    const countUp = (el) => {
      const end = Number(el.dataset.value) || 0, suffix = el.dataset.suffix, start = performance.now(), dur = 900;
      const tick = (now) => {
        const p = Math.min(1, (now - start) / dur), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * eased).toLocaleString(lang) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (!reduceMotion.matches && "IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { countUp(e.target); io.unobserve(e.target); } }), { threshold: .5 });
      $$(".stat-number", statsEl).forEach((el) => io.observe(el));
    }
  }

  /* ---------- Instagram link (activated once a URL is set in content.js) ---------- */
  const insta = window.IFSHHE_SOCIAL && window.IFSHHE_SOCIAL.instagram;
  const instaItem = $("#insta-item");
  if (insta && instaItem) {
    const a = document.createElement("a");
    a.href = insta; a.target = "_blank"; a.rel = "noopener me";
    const icon = instaItem.querySelector("svg");
    const label = document.createElement("span"); label.textContent = t("footer.insta");
    const sr = document.createElement("span"); sr.className = "visually-hidden"; sr.textContent = " " + t("a11y.newTab");
    a.append(icon, label, sr);
    instaItem.replaceChildren(a);
  }

  /* ---------- Contact form ---------- */
  const form = $("#contact-form");
  if (form) {
    form.setAttribute("novalidate", "");
    const fields = {
      name: $("#f-name"), email: $("#f-email"), interest: $("#f-interest"), message: $("#f-message"),
    };
    const errs = { name: $("#err-name"), email: $("#err-email"), interest: $("#err-interest"), message: $("#err-message") };
    const summary = $("#form-summary"), summaryTitle = $("#form-summary-title"), summaryList = $("#form-summary-list");
    const okBox = $("#form-ok"), failBox = $("#form-fail"), submit = $("#form-submit"), submitLabel = $("#form-submit-label");
    const touched = new Set();
    $("#f-lang").value = lang;

    const check = (key) => {
      const el = fields[key], v = el.value.trim();
      if (!v) return t("form.err." + key);
      if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return t("form.err.emailFormat");
      if (key === "message" && v.length < 10) return t("form.err.messageShort");
      return "";
    };
    const show = (key, msg) => {
      const el = fields[key], err = errs[key];
      err.textContent = msg; err.hidden = !msg;
      if (msg) { el.setAttribute("aria-invalid", "true"); el.setAttribute("aria-describedby", [el.id === "f-email" ? "help-email" : "", err.id].filter(Boolean).join(" ")); }
      else { el.removeAttribute("aria-invalid"); if (el.id === "f-email") el.setAttribute("aria-describedby", "help-email"); else el.removeAttribute("aria-describedby"); }
    };
    Object.keys(fields).forEach((key) => {
      const re = () => { if (touched.has(key)) show(key, check(key)); };
      fields[key].addEventListener("input", re);
      fields[key].addEventListener("blur", re);
    });
    const validate = () => {
      const bad = Object.keys(fields).filter((key) => { const m = check(key); show(key, m); if (m) touched.add(key); return m; });
      if (!bad.length) { summary.hidden = true; return true; }
      summaryTitle.textContent = bad.length === 1 ? t("form.err.summaryOne") : t("form.err.summaryMany", { n: bad.length });
      summaryList.replaceChildren(...bad.map((key) => {
        const li = document.createElement("li"), a = document.createElement("a");
        a.href = "#" + fields[key].id; a.textContent = errs[key].textContent;
        a.addEventListener("click", (e) => { e.preventDefault(); fields[key].focus(); });
        li.append(a); return li;
      }));
      summary.hidden = false; summary.focus();
      return false;
    };
    const setBusy = (busy) => { submit.disabled = busy; submitLabel.textContent = t(busy ? "form.sending" : "form.send"); };
    const showForm = () => { form.hidden = false; okBox.hidden = true; failBox.hidden = true; };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validate()) return;
      setBusy(true);
      try {
        const res = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(new FormData(form)) });
        if (!res.ok) throw new Error("HTTP " + res.status);
        $("#form-ok-title").textContent = t("form.ok.t", { name: fields.name.value.trim().split(/\s+/)[0] });
        $("#form-ok-body").textContent = t("form.ok.d", { email: fields.email.value.trim() });
        form.hidden = true; failBox.hidden = true; okBox.hidden = false;
        $("#form-ok-title").focus();
        form.reset(); touched.clear(); Object.keys(fields).forEach((k) => show(k, ""));
      } catch {
        form.hidden = true; failBox.hidden = false; $("#form-fail-title").focus();
      } finally { setBusy(false); }
    });
    $("#form-retry").addEventListener("click", () => { showForm(); submit.focus(); });
    $("#form-again").addEventListener("click", () => { showForm(); fields.name.focus(); });

    // Pre-fill from Get-involved / country CTAs and from deep links (#contact?interest=…&country=…).
    const prefill = (interest, country, focus) => {
      if (interest && [...fields.interest.options].some((o) => o.value === interest)) fields.interest.value = interest;
      $("#f-country").value = country || "";
      if (focus) setTimeout(() => fields.name.focus({ preventScroll: true }), 450);
    };
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[data-interest]");
      if (a) prefill(a.dataset.interest, a.dataset.country, true);
    });
    const hashQuery = location.hash.includes("?") ? new URLSearchParams(location.hash.split("?")[1]) : new URLSearchParams(location.search);
    if (hashQuery.get("interest") || hashQuery.get("country")) {
      prefill(hashQuery.get("interest"), hashQuery.get("country"), false);
      if (location.hash.startsWith("#contact")) $("#contact").scrollIntoView();
    }
  }

  /* ---------- Floating "Get in touch" pill (mobile) ---------- */
  const floatCta = $("#float-cta");
  const hero = $("#top"), contactSection = $("#contact");
  let heroGone = false, contactSeen = false, inputFocused = false;
  function updateFloat() {
    if (!floatCta) return;
    floatCta.classList.toggle("is-visible", heroGone && !contactSeen && !drawerOpen && !inputFocused && mobileMQ.matches);
  }
  if (floatCta && "IntersectionObserver" in window) {
    if (hero) new IntersectionObserver(([e]) => { heroGone = !e.isIntersecting; updateFloat(); }, { threshold: 0 }).observe(hero);
    if (contactSection) new IntersectionObserver(([e]) => { contactSeen = e.isIntersecting; updateFloat(); }, { threshold: .1 }).observe(contactSection);
    document.addEventListener("focusin", (e) => { inputFocused = e.target.matches("input, select, textarea"); updateFloat(); });
    document.addEventListener("focusout", () => { inputFocused = false; updateFloat(); });
    mobileMQ.addEventListener("change", updateFloat);
  }

  /* ---------- Visitor counter: count once per session, hide if unavailable ---------- */
  (async function visits() {
    const box = $("#visits"), out = $("#visit-count");
    if (!box || !out) return;
    const KEY = "ifshhe_counted";
    let counted = false;
    try { counted = sessionStorage.getItem(KEY) === "1"; } catch {}
    try {
      const res = await fetch("/api/visits", { method: counted ? "GET" : "POST", headers: { Accept: "application/json" } });
      if (!res.ok) return;
      const { count } = await res.json();
      if (typeof count !== "number") return;
      try { sessionStorage.setItem(KEY, "1"); } catch {}
      out.textContent = count.toLocaleString(document.documentElement.lang || "en");
      box.hidden = false;
    } catch {}
  })();

  /* ---------- Year ---------- */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
