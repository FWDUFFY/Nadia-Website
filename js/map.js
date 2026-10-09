/*
 * "Where we work" map: highlights the countries in IFSHHE_COUNTRIES and shows
 * their details in the side panel. Hovering any country outlines it and shows
 * its name. The country buttons above the map do the same as clicking, so it
 * still works on small screens or if the map fails to load.
 */
(function () {
  const countries = window.IFSHHE_COUNTRIES;
  const byId = new Map(countries.map((c) => [c.id, c]));
  const tabs = document.getElementById("country-tabs");
  const detail = document.getElementById("country-detail");
  const svg = document.getElementById("world-map");
  const frame = svg.parentElement;
  const tooltip = document.getElementById("map-tooltip");
  let selected = countries[0].code;

  // Area shown on the map: [west, south] to [east, north] in degrees.
  // Covers the UK down to Tanzania; widen it if countries further afield are added.
  const VIEW = [[-30, -22], [75, 64]];

  function renderTabs() {
    tabs.innerHTML = "";
    for (const c of countries) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.role = "tab";
      btn.textContent = t(`country.${c.code}.name`);
      btn.setAttribute("aria-selected", String(c.code === selected));
      btn.addEventListener("click", () => select(c.code));
      tabs.append(btn);
    }
  }

  function renderDetail() {
    const k = `country.${selected}`;
    detail.innerHTML = "";
    const h = document.createElement("h3");
    h.textContent = t(`${k}.name`);
    const meta = document.createElement("p");
    meta.className = "meta";
    meta.textContent = t(`${k}.meta`);
    const summary = document.createElement("p");
    summary.textContent = t(`${k}.summary`);
    detail.append(h, meta, summary);
  }

  function select(code) {
    selected = code;
    renderTabs();
    renderDetail();
    svg.querySelectorAll(".land.active").forEach((el) => {
      el.classList.toggle("selected", el.dataset.code === code);
    });
  }

  function countryName(f) {
    const c = byId.get(f.id);
    return c ? t(`country.${c.code}.name`) : f.properties.name;
  }

  function showTooltip(text, x, y) {
    tooltip.textContent = text;
    tooltip.hidden = false;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  }

  async function drawMap() {
    if (!window.d3 || !window.topojson) throw new Error("map libraries missing");

    const width = 960, height = 680;
    const world = await d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json");
    const land = topojson.feature(world, world.objects.countries).features;

    const [[w, s], [e, n]] = VIEW;
    const viewArea = {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [[[w, s], [w, n], [e, n], [e, s], [w, s]]] },
    };
    const projection = d3.geoNaturalEarth1().fitSize([width, height], viewArea);
    const path = d3.geoPath(projection);

    const root = d3.select(svg).attr("viewBox", `0 0 ${width} ${height}`);
    const g = root.append("g");
    // Hover outline sits above every country so the whole border shows.
    const outline = root.append("path").attr("class", "hover-outline");

    g.selectAll("path")
      .data(land)
      .join("path")
      .attr("d", path)
      .attr("class", (f) => (byId.has(f.id) ? "land active" : "land"))
      .each(function (f) {
        const c = byId.get(f.id);
        this.addEventListener("mouseenter", () => outline.attr("d", this.getAttribute("d")));
        this.addEventListener("mousemove", (ev) => {
          const r = frame.getBoundingClientRect();
          showTooltip(countryName(f), ev.clientX - r.left, ev.clientY - r.top);
        });
        this.addEventListener("mouseleave", () => { tooltip.hidden = true; outline.attr("d", null); });
        if (!c) return;

        this.dataset.code = c.code;
        this.setAttribute("tabindex", "0");
        this.setAttribute("role", "button");
        this.setAttribute("aria-label", countryName(f));
        this.addEventListener("click", () => select(c.code));
        this.addEventListener("keydown", (ev) => {
          if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); select(c.code); }
        });
        this.addEventListener("focus", () => {
          outline.attr("d", this.getAttribute("d"));
          const [cx, cy] = path.centroid(f);
          const scale = frame.clientWidth / width;
          showTooltip(countryName(f), cx * scale, cy * scale);
        });
        this.addEventListener("blur", () => { tooltip.hidden = true; outline.attr("d", null); });
      });
  }

  document.addEventListener("langchange", () => {
    renderTabs();
    renderDetail();
    svg.querySelectorAll(".land.active").forEach((el) => {
      el.setAttribute("aria-label", t(`country.${el.dataset.code}.name`));
    });
  });

  renderTabs();
  renderDetail();
  drawMap()
    .then(() => select(selected))
    .catch(() => {
      svg.hidden = true;
      document.querySelector(".map-fallback").hidden = false;
    });
})();
