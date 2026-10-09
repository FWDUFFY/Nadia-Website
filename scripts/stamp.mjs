// Cache-busting: rewrites `?v=<hash>` on every local /css/*.css and /js/*.js
// reference in each HTML file under the dist folder, using a short content
// hash of the file it points at. Runs as the last build step so that
// netlify.toml can cache /css/* and /js/* as immutable.
// Usage: node scripts/stamp.mjs [distDir=dist]
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

process.chdir(fileURLToPath(new URL("..", import.meta.url)));
const DIST = process.argv[2] || "dist";
const hashes = new Map();
const hash = (p) => {
  if (!hashes.has(p)) hashes.set(p, createHash("sha256").update(readFileSync(p)).digest("hex").slice(0, 8));
  return hashes.get(p);
};
const pages = readdirSync(DIST, { recursive: true }).filter((f) => f.endsWith(".html"));
let total = 0;
for (const page of pages) {
  const file = join(DIST, page);
  let n = 0;
  const html = readFileSync(file, "utf8").replace(
    /((?:href|src)=")(\/(?:css|js)\/[\w./-]+\.(?:css|js))(\?v=\w+)?(")/g,
    (m, pre, asset, _v, post) => {
      const local = join(DIST, asset);
      if (!existsSync(local)) { console.warn(`  ! ${page}: ${asset} not in ${DIST}`); return m; }
      n++;
      return `${pre}${asset}?v=${hash(local)}${post}`;
    });
  writeFileSync(file, html);
  total += n;
  console.log(`${page}: stamped ${n} asset(s)`);
}
console.log(`stamped ${total} reference(s) in ${pages.length} page(s)`);
