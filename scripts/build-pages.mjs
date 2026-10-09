// Pre-renders one static page per language from index.html / thank-you.html and
// the dictionaries in js/i18n.js, so search engines and no-JS visitors get real
// Arabic / Swahili / Hausa HTML with the right <html lang dir>, <title>, meta
// description, canonical and hreflang tags:
//   dist/index.html (en)   dist/ar/index.html   dist/sw/index.html   dist/ha/index.html
//   dist/thank-you.html    dist/ar/thank-you.html ...
//   dist/404.html          copied once, in English
// It understands the same attributes the runtime uses:
//   data-i18n="key"                       element text
//   data-i18n-alt="key"                   alt attribute
//   data-i18n-attr="attr:key;attr:key"    any other attributes
// A key missing from a language falls back to English; a key missing from
// English too is reported and the inline text is left as it is.
// Usage: node scripts/build-pages.mjs [distDir=dist]
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

process.chdir(fileURLToPath(new URL("..", import.meta.url)));
const DIST = process.argv[2] || "dist";
const SITE = "https://ifshhe.com";
const OG_LOCALE = { en: "en_GB", ar: "ar_AR", sw: "sw_KE", ha: "ha_NG" };
const ARABIC_FONT = "/fonts/noto-naskh-arabic-400-600-arabic.woff2";
const LATIN_DISPLAY_FONT = "/fonts/fraunces-500-600-latin.woff2";

// --- Dictionaries: evaluate the browser-style i18n file with a stub window.
const window = {};
const document = { documentElement: { lang: "en" } };
new Function("window", "document", readFileSync("js/i18n.js", "utf8"))(window, document);
const dict = window.IFSHHE_I18N;
if (!dict?.en) throw new Error("js/i18n.js did not define window.IFSHHE_I18N.en");
const rtl = window.IFSHHE_RTL || ["ar"];
const names = window.IFSHHE_LANG_NAMES || {};
const langs = ["en", ...Object.keys(dict).filter((l) => l !== "en")];
const pathFor = (lang) => (lang === "en" ? "/" : `/${lang}/`);

const missing = new Map();                      // key -> Set(lang) for keys absent from a language
const absent = new Set();                       // keys absent from English as well
function t(key, lang) {
  const v = dict[lang]?.[key];
  if (typeof v === "string") return v;
  if (typeof dict.en[key] === "string") {
    if (lang !== "en") { if (!missing.has(key)) missing.set(key, new Set()); missing.get(key).add(lang); }
    return dict.en[key];
  }
  absent.add(key);
  return null;
}
const has = (key) => typeof dict.en[key] === "string";

function render(source, page, lang) {
  const $ = cheerio.load(source);
  const dir = rtl.includes(lang) ? "rtl" : "ltr";
  const pagePath = pathFor(lang) + (page === "index.html" ? "" : page);
  $("html").attr("lang", lang).attr("dir", dir);

  // Text, alt and other attributes.
  $("[data-i18n]").each((_, el) => {
    const v = t($(el).attr("data-i18n"), lang);
    if (v === null) return;
    if ($(el).children().length) console.warn(`  ! <${el.tagName} data-i18n="${$(el).attr("data-i18n")}"> has child elements; its text is replaced wholesale`);
    $(el).text(v);
  });
  $("[data-i18n-alt]").each((_, el) => { const v = t($(el).attr("data-i18n-alt"), lang); if (v !== null) $(el).attr("alt", v); });
  $("[data-i18n-attr]").each((_, el) => {
    for (const pair of $(el).attr("data-i18n-attr").split(";")) {
      const i = pair.indexOf(":");
      if (i < 0) continue;
      const attr = pair.slice(0, i).trim(), key = pair.slice(i + 1).trim();
      const v = t(key, lang);
      if (v !== null && attr) $(el).attr(attr, v);
    }
  });

  // Head: title / description / Open Graph / canonical / hreflang.
  const titleKey = page === "index.html" ? "meta.title" : `meta.${page.replace(/\.html$/, "").replace(/-([a-z])/g, (_, c) => c.toUpperCase())}.title`;
  const descKey = titleKey.replace(/\.title$/, ".description");
  const title = has(titleKey) ? t(titleKey, lang) : null;
  const desc = has(descKey) ? t(descKey, lang) : null;
  const $title = $("head > title");                 // not <svg><title>
  if (title && !$title.attr("data-i18n")) $title.text(title);
  if (desc) $('meta[name="description"]').attr("content", desc);
  const finalTitle = $title.text().trim(), finalDesc = $('meta[name="description"]').attr("content");
  if ($('meta[property="og:title"]').length) $('meta[property="og:title"]').attr("content", finalTitle);
  if ($('meta[property="og:description"]').length && finalDesc) $('meta[property="og:description"]').attr("content", finalDesc);
  if ($('meta[name="twitter:title"]').length) $('meta[name="twitter:title"]').attr("content", finalTitle);
  if ($('meta[name="twitter:description"]').length && finalDesc) $('meta[name="twitter:description"]').attr("content", finalDesc);
  $('meta[property="og:url"]').attr("content", SITE + pagePath);
  $('meta[property="og:locale"]').attr("content", OG_LOCALE[lang] || lang);
  $('meta[property="og:locale:alternate"]').remove();
  if ($('meta[property="og:locale"]').length) {
    const alt = langs.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${OG_LOCALE[l] || l}">`).join("\n  ");
    $('meta[property="og:locale"]').after(`\n  ${alt}`);
  }
  if (!$('link[rel="canonical"]').length) $("head").append('\n  <link rel="canonical" href="">');
  $('link[rel="canonical"]').attr("href", SITE + pagePath);
  $('link[rel="alternate"][hreflang]').remove();
  if (page === "index.html") {
    const alts = langs.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE}${pathFor(l)}">`).join("\n  ");
    $('link[rel="canonical"]').after(`\n  ${alts}\n  <link rel="alternate" hreflang="x-default" href="${SITE}/">`);
  } else if (!$('meta[name="robots"]').length) {
    $("head").append('\n  <meta name="robots" content="noindex">');  // thank-you pages are never indexed
  }
  // Arabic: preload the Arabic text face instead of the Latin display face.
  if (lang === "ar") $(`link[rel="preload"][href="${LATIN_DISPLAY_FONT}"]`).attr("href", ARABIC_FONT);

  // Forms: tag the language and land on the matching thank-you page.
  $('input[name="lang"]').attr("value", lang);
  $('form[name="contact"], form[data-netlify]').each((_, f) => {
    const action = $(f).attr("action") || "/thank-you.html";
    if (/thank-you\.html$/.test(action)) $(f).attr("action", `${pathFor(lang)}thank-you.html`);
  });

  // Language menu: plain links, current language marked.
  if (names[lang]) $("#lang-current").text(names[lang]);
  $("[data-lang]").each((_, el) => {
    const l = $(el).attr("data-lang");
    if (el.tagName === "a") {
      $(el).attr("href", pathFor(l));
      if (!$(el).attr("hreflang")) $(el).attr("hreflang", l);
      if (!$(el).attr("lang")) $(el).attr("lang", l);
    }
    if (l === lang) $(el).attr("aria-current", "true"); else $(el).removeAttr("aria-current");
  });
  // Pages live at /ar/ etc., so every asset URL must be root-relative.
  const rel = source.match(/(?:href|src)="(?:css|js|images|fonts|data)\//g);
  if (rel && lang === "en") console.warn(`  ! ${page}: ${rel.length} relative asset URL(s) (${rel[0]}…) - they break under /ar/ etc.; use /css/… /js/… /images/…`);
  return $.html();
}

let written = 0;
for (const page of ["index.html", "thank-you.html"]) {
  if (!existsSync(page)) { console.warn(`! ${page} not found, skipped`); continue; }
  const source = readFileSync(page, "utf8");
  for (const lang of langs) {
    const outDir = join(DIST, pathFor(lang));
    mkdirSync(outDir, { recursive: true });
    const html = render(source, page, lang);
    writeFileSync(join(outDir, page), html);
    written++;
    console.log(`${pathFor(lang)}${page === "index.html" ? "" : page}  (${lang}, ${rtl.includes(lang) ? "rtl" : "ltr"}, ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB)`);
  }
}
if (existsSync("404.html")) { copyFileSync("404.html", join(DIST, "404.html")); console.log("/404.html  (en, copied)"); }
else console.warn("! 404.html not found, skipped");

if (absent.size) console.warn(`! ${absent.size} key(s) missing from the English dictionary (inline text kept): ${[...absent].join(", ")}`);
if (missing.size) {
  const byLang = {};
  for (const [key, set] of missing) for (const l of set) (byLang[l] ||= []).push(key);
  for (const [l, keys] of Object.entries(byLang)) console.warn(`  ${l}: ${keys.length} key(s) fell back to English${keys.length <= 12 ? ": " + keys.join(", ") : ""}`);
}
console.log(`${written} page(s) written to ${DIST}/`);
