// Builds the logo files, favicons, app icons and the Open Graph image from
// images/src/logo-transparent.png (the real logo, with a true alpha channel).
//
//   images/logo.png       trimmed copy at the original size (header/footer)
//   images/logo-400.png   400px wide copy (2x-safe for a ~200px header logo)
//   favicon-32.png, icon-192.png, icon-512.png   the globe+S mark on transparent
//   apple-touch-icon.png  180px, the mark on cream (Apple ignores transparency)
//   favicon.ico           PNG-in-ICO, one 48px image (all current browsers accept it)
//   favicon.svg           SVG wrapper around the 192px PNG (same mark in every browser)
//   images/og.jpg         1200x630 Open Graph card: logo + headline on cream
//
// The mark is cut out of the logo: the globe with the S / arrow / cross symbol.
// Pixels of the flat aqua oval around it are keyed to transparent, the "H" and
// the oval outline that intrude into the crop are masked, and the stem + bar of
// the female symbol (which in the logo runs through the tagline) are redrawn as
// crisp vector shapes in the logo's navy.
// Usage: node scripts/build-icons.mjs
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

process.chdir(fileURLToPath(new URL("..", import.meta.url)));

const LOGO = "images/src/logo-transparent.png";
const CREAM = "#fbf6ee";
const NAVY = "#17324d";
const TEXT = "#1f2a33";
const TERRACOTTA = "#b04a21";
const LOGO_NAVY = "#003048";                     // the navy actually used in the logo artwork
mkdirSync("images", { recursive: true });

// ---------------------------------------------------------------------------
// 1. Logo copies
const logo = sharp(LOGO).trim({ threshold: 8 });
const logoMeta = await logo.clone().png().toBuffer({ resolveWithObject: true });
await logo.clone().png({ compressionLevel: 9, palette: true, quality: 90 }).toFile("images/logo.png");
await logo.clone().resize({ width: 400 }).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile("images/logo-400.png");
// Small header/footer variants: the logo displays at ~130px wide, so 160 (1x) and 320 (2x) are plenty.
// WebP keeps the alpha channel at roughly a third of the PNG size; PNG stays as the fallback.
for (const w of [160, 320]) {
  await logo.clone().resize({ width: w }).webp({ quality: 88, alphaQuality: 95 }).toFile(`images/logo-${w}.webp`);
  await logo.clone().resize({ width: w }).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(`images/logo-${w}.png`);
}
console.log(`images/logo.png ${logoMeta.info.width}x${logoMeta.info.height}, images/logo-400.png, logo-160/320 .png/.webp`);

// ---------------------------------------------------------------------------
// 2. The mark: cut the globe + S + arrow out of the (untrimmed) logo.
// Coordinates below are pixels in the 726x375 source.
const R = { left: 232, top: 0, width: 236, height: 264 };          // globe, S and arrow (stem starts below)
const BG = [105, 207, 210];                                         // flat aqua of the oval
const GLOBE = { cx: 343 - R.left, cy: 155 - R.top, r: 96 };         // never key inside the globe
const { data, info } = await sharp(LOGO).extract(R).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 4;
    const X = x + R.left, Y = y + R.top;
    const hide = (X >= 441 && Y >= 62)            // the "H" to the right of the globe
      || (Y < 44 && X < 392)                      // oval outline, top left of the S
      || Y < 2 || X > 457;                        // oval hairline over the arrow head
    if (hide) { data[i + 3] = 0; continue; }
    const inGlobe = (x - GLOBE.cx) ** 2 + (y - GLOBE.cy) ** 2 <= GLOBE.r ** 2;
    if (inGlobe) continue;
    const d = Math.abs(data[i] - BG[0]) + Math.abs(data[i + 1] - BG[1]) + Math.abs(data[i + 2] - BG[2]);
    if (d < 36) { data[i + 3] = 0; continue; }
    if (d < 72) {                                 // soft edge: un-blend from the aqua
      const a = (d - 36) / 36;
      for (let c = 0; c < 3; c++) data[i + c] = Math.max(0, Math.min(255, Math.round((data[i + c] - BG[c] * (1 - a)) / a)));
      data[i + 3] = Math.round(data[i + 3] * a);
    }
  }
}
const cutout = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();

// Mark geometry in source pixels: arrow tip top y=2, x up to 456; S left edge x=249;
// stem x 321..335 continues from the S (y~262) down; "for" box is the bar in the logo.
const STEM = { x: 321, w: 14, y0: 258, y1: 372 };
const BAR = { x: 299, w: 58, y: 338, h: 14 };
const bbox = { x0: 249, y0: 2, x1: 457, y1: STEM.y1 };
const mh = bbox.y1 - bbox.y0, mw = bbox.x1 - bbox.x0;
const side = Math.ceil(mh * 1.12);                                   // 6% padding each side
const ox = Math.round((side - mw) / 2) - bbox.x0, oy = Math.round((side - mh) / 2) - bbox.y0;
const markSvg = (size) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="0 0 ${side} ${side}">
  <image x="${R.left + ox}" y="${R.top + oy}" width="${info.width}" height="${info.height}" xlink:href="data:image/png;base64,${cutout.toString("base64")}"/>
  <rect x="${STEM.x + ox}" y="${STEM.y0 + oy}" width="${STEM.w}" height="${STEM.y1 - STEM.y0}" fill="${LOGO_NAVY}"/>
  <rect x="${BAR.x + ox}" y="${BAR.y + oy}" width="${BAR.w}" height="${BAR.h}" rx="1" fill="${LOGO_NAVY}"/>
</svg>`);
const mark = (size) => sharp(markSvg(size), { density: 300 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();
const markOn = async (size, bgSize, background) =>
  sharp({ create: { width: bgSize, height: bgSize, channels: 4, background } })
    .composite([{ input: await mark(size), gravity: "centre" }]).png({ compressionLevel: 9 }).toBuffer();

writeFileSync("favicon-32.png", await mark(32));
writeFileSync("icon-192.png", await mark(192));
writeFileSync("icon-512.png", await mark(512));
writeFileSync("apple-touch-icon.png", await markOn(Math.round(180 * 0.76), 180, CREAM));   // 12% padding

// favicon.ico: ICO container around one 48px PNG
const png48 = await mark(48);
const h = Buffer.alloc(22);
h.writeUInt16LE(0, 0); h.writeUInt16LE(1, 2); h.writeUInt16LE(1, 4);      // reserved, type=icon, count=1
h[6] = 48; h[7] = 48; h[8] = 0; h[9] = 0;                                 // w, h, palette, reserved
h.writeUInt16LE(1, 10); h.writeUInt16LE(32, 12);                          // planes, bpp
h.writeUInt32LE(png48.length, 14); h.writeUInt32LE(22, 18);               // size, offset
writeFileSync("favicon.ico", Buffer.concat([h, png48]));

// favicon.svg: wraps a PNG so every browser shows the same real mark (no vector redraw to drift).
const svgIcon = (png, size) => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><image width="${size}" height="${size}" xlink:href="data:image/png;base64,${png.toString("base64")}"/></svg>\n`;
let faviconSvg = svgIcon(await mark(192), 192);
if (Buffer.byteLength(faviconSvg) > 25 * 1024) faviconSvg = svgIcon(await mark(128), 128);
writeFileSync("favicon.svg", faviconSvg);

// ---------------------------------------------------------------------------
// 3. Open Graph image 1200x630: full logo on the left, headline on the right.
const OG_W = 1200, OG_H = 630, LOGO_W = 520;
const logoPng = await logo.clone().resize({ width: LOGO_W }).png().toBuffer();
const lm = await sharp(logoPng).metadata();
const logoLeft = 64, logoTop = Math.round((OG_H - lm.height) / 2);
const tx = logoLeft + LOGO_W + 56;                                  // text column
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const text = Buffer.from(`<svg width="${OG_W}" height="${OG_H}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .h{font-family:Georgia,'Times New Roman',serif;font-weight:700;font-size:56px;fill:${NAVY}}
    .s{font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:28px;fill:${TEXT}}
  </style>
  <text x="${tx}" y="218" class="h">Sexual health</text>
  <text x="${tx}" y="284" class="h">education</text>
  <text x="${tx}" y="350" class="h">that lasts.</text>
  <rect x="${tx + 2}" y="378" width="72" height="6" rx="3" fill="${TERRACOTTA}"/>
  <text x="${tx}" y="432" class="s">${esc("International Foundation for")}</text>
  <text x="${tx}" y="470" class="s">${esc("Sexual Health and HIV Education")}</text>
</svg>`);
await sharp({ create: { width: OG_W, height: OG_H, channels: 4, background: CREAM } })
  .composite([{ input: logoPng, left: logoLeft, top: logoTop }, { input: text }])
  .flatten({ background: CREAM }).jpeg({ quality: 86, mozjpeg: true }).toFile("images/og.jpg");

console.log(`mark ${side}x${side} source px -> favicon-32.png, icon-192.png, icon-512.png, apple-touch-icon.png, favicon.ico, favicon.svg (${(Buffer.byteLength(faviconSvg) / 1024).toFixed(1)} KB), images/og.jpg`);
