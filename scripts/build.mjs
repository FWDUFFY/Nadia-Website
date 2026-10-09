// Full site build -> dist/ (what Netlify publishes).
//   1. copy static files (css is combined: fonts.css + placeholders.css + styles.css)
//   2. one page per language              3. cache-bust css/js references
// (data/world.json is regenerated from js/content.js first, so pins always match)
// Generated images, fonts and icons are committed (run `npm run images` /
// `npm run fonts` locally when photos or fonts change), so this takes seconds.
// Usage: node scripts/build.mjs
import { rmSync, mkdirSync, cpSync, existsSync, readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

process.chdir(fileURLToPath(new URL("..", import.meta.url)));
const DIST = "dist";
const STATIC = ["js", "fonts", "images", "data", "robots.txt", "sitemap.xml", "site.webmanifest",
  "favicon.ico", "favicon.svg", "favicon-32.png", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
const SKIP = (src) => !/(^|\/)images\/src(\/|$)/.test(src) && !src.endsWith(".DS_Store") && !src.endsWith("manifest.json") && !src.endsWith("LICENSE.txt") && !src.endsWith("world.svg");
const run = (script, ...args) => execFileSync(process.execPath, [`scripts/${script}`, ...args], { stdio: "inherit" });

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST);

// 0. Map data: regenerated into data/ from js/content.js so the committed file and the pins always match.
run("build-map.mjs");

// 1. Static files
for (const f of STATIC) {
  if (!existsSync(f)) { console.warn(`skip (missing): ${f}`); continue; }
  cpSync(f, join(DIST, f), { recursive: true, filter: SKIP });
}
// CSS: one combined stylesheet; map.css and anything else copied as is.
mkdirSync(join(DIST, "css"), { recursive: true });
const PREPEND = ["css/fonts.css", "css/placeholders.css"];
const combined = [...PREPEND, "css/styles.css"].filter((f) => existsSync(f) || (console.warn(`skip (missing): ${f}`), false))
  .map((f) => `/* ---- ${f} ---- */\n${readFileSync(f, "utf8").trim()}\n`).join("\n");
writeFileSync(join(DIST, "css/styles.css"), combined);
for (const f of readdirSync("css")) {
  if (!f.endsWith(".css") || f === "styles.css" || PREPEND.includes(`css/${f}`)) continue;
  cpSync(join("css", f), join(DIST, "css", f));
}

// 2-3. Pages, then cache-busting.
run("build-pages.mjs", DIST);
run("stamp.mjs", DIST);

// Summary
let total = 0, files = 0;
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); const s = statSync(p); if (s.isDirectory()) walk(p); else { total += s.size; files++; } } };
walk(DIST);
console.log(`build complete -> ${DIST}/  (${files} files, ${(total / 1024).toFixed(0)} KB)`);
