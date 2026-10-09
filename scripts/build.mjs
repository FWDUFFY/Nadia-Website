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
import { transformSync } from "esbuild";

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
// CSS: ONE stylesheet for the whole site (fonts + placeholders + styles + map),
// minified. The source pages link /css/styles.css and /css/map.css separately so
// the un-built root still works; the map.css <link> is removed from the built
// pages below. Anything else in css/ is copied (minified) as is.
mkdirSync(join(DIST, "css"), { recursive: true });
const CSS_ORDER = ["css/fonts.css", "css/placeholders.css", "css/styles.css", "css/map.css"];
const combined = CSS_ORDER.filter((f) => existsSync(f) || (console.warn(`skip (missing): ${f}`), false))
  .map((f) => `/* ---- ${f} ---- */\n${readFileSync(f, "utf8").trim()}\n`).join("\n");
writeFileSync(join(DIST, "css/styles.css"), minify(combined, "css"));
for (const f of readdirSync("css")) {
  if (!f.endsWith(".css") || CSS_ORDER.includes(`css/${f}`)) continue;
  writeFileSync(join(DIST, "css", f), minify(readFileSync(join("css", f), "utf8"), "css"));
}
// JS: minified copies (comments are for editors of the source, not visitors).
for (const f of readdirSync(join(DIST, "js"))) {
  if (!f.endsWith(".js")) continue;
  const p = join(DIST, "js", f);
  writeFileSync(p, minify(readFileSync(p, "utf8"), "js"));
}

// Translations: one small file per language (English + that language) instead of
// shipping all four dictionaries to every visitor. The helper (window.t) is copied
// verbatim from the end of js/i18n.js.
const i18nSource = readFileSync("js/i18n.js", "utf8");
const i18nWindow = {};
new Function("window", "document", i18nSource)(i18nWindow, { documentElement: { lang: "en" } });
const helperStart = i18nSource.indexOf("window.t = function");
if (helperStart < 0) throw new Error("js/i18n.js: window.t helper not found");
const helper = i18nSource.slice(helperStart);
const langs = Object.keys(i18nWindow.IFSHHE_I18N);
for (const lang of langs) {
  const dict = lang === "en" ? { en: i18nWindow.IFSHHE_I18N.en } : { en: i18nWindow.IFSHHE_I18N.en, [lang]: i18nWindow.IFSHHE_I18N[lang] };
  const code = `window.IFSHHE_I18N=${JSON.stringify(dict)};window.IFSHHE_RTL=${JSON.stringify(i18nWindow.IFSHHE_RTL)};window.IFSHHE_LANG_NAMES=${JSON.stringify(i18nWindow.IFSHHE_LANG_NAMES)};\n${helper}`;
  writeFileSync(join(DIST, "js", `i18n.${lang}.js`), minify(code, "js"));
}
rmSync(join(DIST, "js", "i18n.js"), { force: true });

// 2-3. Pages, then cache-busting.
run("build-pages.mjs", DIST);
// Per-page fix-ups: drop the separate map.css <link> (its rules are inside
// styles.css now) and point each page at its own language's translation file.
for (const page of readdirSync(DIST, { recursive: true }).filter((f) => f.endsWith(".html"))) {
  const p = join(DIST, page);
  let html = readFileSync(p, "utf8").replace(/\n?[ \t]*<link[^>]+href="\/css\/map\.css"[^>]*>/g, "");
  const lang = (html.match(/<html[^>]*\blang="([a-z]{2})/i) || [, "en"])[1];
  html = html.replace(/src="\/js\/i18n\.js(\?[^"]*)?"/g, `src="/js/i18n.${langs.includes(lang) ? lang : "en"}.js"`);
  writeFileSync(p, html);
}
run("stamp.mjs", DIST);

function minify(source, loader) {
  try {
    return transformSync(source, { loader, minify: true, legalComments: "none", target: "es2020" }).code;
  } catch (err) {
    console.warn(`minify (${loader}) failed, shipping unminified: ${err.message}`);
    return source;
  }
}

// Summary
let total = 0, files = 0;
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); const s = statSync(p); if (s.isDirectory()) walk(p); else { total += s.size; files++; } } };
walk(DIST);
console.log(`build complete -> ${DIST}/  (${files} files, ${(total / 1024).toFixed(0)} KB)`);
