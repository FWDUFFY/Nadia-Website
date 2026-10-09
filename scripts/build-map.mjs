// Pre-renders the world map to compact SVG path strings so the browser needs
// no d3/topojson at runtime. Reads the active countries from js/content.js,
// fits a Natural Earth projection around them (padded, and never tighter than
// a UK-to-southern-Africa frame) and writes
//   data/world.json  { width, height, view, countries: [{ id, name, d, c }], pins: { code: [x, y] } }
//   data/world.svg   the same outlines as a plain SVG (debugging / fallback)
// Usage: node scripts/build-map.mjs [distDir]   (default: the repo root -> data/)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";

process.chdir(fileURLToPath(new URL("..", import.meta.url)));
const DATA = join(process.argv[2] || ".", "data");
const require = createRequire(import.meta.url);
const topo = require("world-atlas/countries-110m.json"); // 108 KB, ISC licence

const WIDTH = 960, HEIGHT = 680;
const PAD_LON = 8, PAD_LAT = 6;
const MIN_FRAME = [[-25, -36], [60, 62]];          // [west, south] -> [east, north]: UK to southern Africa
const WORLD_IF_WIDER_THAN = 150;                   // degrees of longitude
// Marker positions used when js/content.js has no lat/lon yet (keyed by `code`).
const FALLBACK = { sd: [15.5, 30.5], ng: [9.1, 8.7], tz: [-6.4, 35.0], gb: [54.0, -2.5] };

// --- Read the active countries from js/content.js (a browser script: give it a window stub).
let countries = [];
try {
  const window = {};
  new Function("window", "document", readFileSync("js/content.js", "utf8"))(window, { documentElement: { lang: "en" } });
  countries = window.IFSHHE_COUNTRIES || [];
} catch (err) {
  console.warn(`! could not evaluate js/content.js (${err.message}); using built-in country list`);
}
if (!countries.length) countries = [{ id: "729", code: "sd" }, { id: "566", code: "ng" }, { id: "834", code: "tz" }, { id: "826", code: "gb" }];
const active = countries.map((c) => {
  let { lat, lon } = c;
  if (typeof lat !== "number" || typeof lon !== "number") {
    if (!FALLBACK[c.code]) throw new Error(`country ${c.code} (${c.id}) has no lat/lon in js/content.js`);
    [lat, lon] = FALLBACK[c.code];
    console.warn(`! ${c.code}: no lat/lon in js/content.js, using fallback ${lat},${lon}`);
  }
  return { ...c, lat, lon };
});

// --- Fit the view: bbox of the markers, padded, clamped to the minimum frame.
const lons = active.map((c) => c.lon), lats = active.map((c) => c.lat);
let view = [
  [Math.min(...lons) - PAD_LON, Math.min(...lats) - PAD_LAT],
  [Math.max(...lons) + PAD_LON, Math.max(...lats) + PAD_LAT],
];
view = [
  [Math.max(-180, Math.min(view[0][0], MIN_FRAME[0][0])), Math.max(-90, Math.min(view[0][1], MIN_FRAME[0][1]))],
  [Math.min(180, Math.max(view[1][0], MIN_FRAME[1][0])), Math.min(90, Math.max(view[1][1], MIN_FRAME[1][1]))],
];
const whole = view[1][0] - view[0][0] > WORLD_IF_WIDER_THAN;
if (whole) view = [[-180, -90], [180, 90]];
const [[w, s], [e, n]] = view;
const fitTo = whole ? { type: "Sphere" } : { type: "Polygon", coordinates: [[[w, s], [w, n], [e, n], [e, s], [w, s]]] };
const projection = geoNaturalEarth1().fitSize([WIDTH, HEIGHT], fitTo);
const path = geoPath(projection).digits(1);
const r1 = (v) => Math.round(v * 10) / 10;

// --- Country outlines inside the viewBox (50px margin).
const features = feature(topo, topo.objects.countries).features;
const shapes = [];
for (const f of features) {
  const d = path(f);
  if (!d) continue;
  const [[x0, y0], [x1, y1]] = path.bounds(f);
  if (x1 < -50 || y1 < -50 || x0 > WIDTH + 50 || y0 > HEIGHT + 50) continue;
  const [cx, cy] = path.centroid(f);
  shapes.push({ id: String(f.id), name: f.properties.name, d, c: [r1(cx), r1(cy)] });
}
const ids = new Set(shapes.map((s) => s.id));
for (const c of active) if (!ids.has(String(c.id))) console.warn(`! ${c.code}: shape id ${c.id} not found inside the view`);

// --- Pins: projected marker positions.
const pins = {};
for (const c of active) {
  const [x, y] = projection([c.lon, c.lat]);
  pins[c.code] = [r1(x), r1(y)];
}

mkdirSync(DATA, { recursive: true });
const json = { width: WIDTH, height: HEIGHT, view, countries: shapes, pins };
const jsonText = JSON.stringify(json);
writeFileSync(join(DATA, "world.json"), jsonText);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}">` +
  `<rect width="${WIDTH}" height="${HEIGHT}" fill="#fff"/>` +
  shapes.map((c) => `<path class="land" data-id="${c.id}" fill="${ids.has(c.id) && active.some((a) => String(a.id) === c.id) ? "#237f86" : "#e4d6bf"}" stroke="#fff" stroke-width="0.6" d="${c.d}"><title>${esc(c.name)}</title></path>`).join("") +
  Object.entries(pins).map(([code, [x, y]]) => `<circle cx="${x}" cy="${y}" r="6" fill="#17324d" stroke="#fff" stroke-width="2"><title>${code}</title></circle>`).join("") +
  `</svg>\n`;
writeFileSync(join(DATA, "world.svg"), svg);

const kb = (t) => (Buffer.byteLength(t) / 1024).toFixed(1) + " KB";
console.log(`view ${JSON.stringify(view)}${whole ? " (whole world)" : ""}`);
console.log(`pins ${Object.entries(pins).map(([k, v]) => `${k}=[${v}]`).join(" ")}`);
console.log(`${DATA}/world.json ${kb(jsonText)} (${Buffer.byteLength(jsonText)} bytes), world.svg ${kb(svg)}, ${shapes.length} countries`);
