# IFSHHE website — ifshhe.com

The website of the International Foundation for Sexual Health and HIV Education.
One page, in four languages (English, Arabic, Kiswahili and Hausa), hosted for free on
Netlify, with the code kept on GitHub and the domain registered at Wix.

The first half of this file is for Nadia and whoever looks after the site day to day.
The second half, **For developers**, is for anyone who needs to change how it is built.

---

## Part 1 — Looking after the site

### What you have

| Thing | Where it lives | What it is for |
| --- | --- | --- |
| The website files | GitHub (this repository) | Every word, photo and colour. Change a file here and the live site updates itself within about two minutes. |
| Hosting | Netlify (free plan) | Publishes the site, receives contact-form messages, runs the visitor counter. |
| The domain `ifshhe.com` | Wix (Domains section of your Wix account) | The address. Keep it renewed every year; the Wix *site* plan can be cancelled, the *domain* must not lapse. |
| The contact inbox | infoifshhe@gmail.com | Where contact-form messages arrive. |

If something goes wrong and you are not sure what to do, contact Fintan. For anything on Netlify,
the one-click fix for most problems is **Deploys → pick the last deploy that worked → Publish deploy**.

### Changing the words on the page

All of the text, in all four languages, is in one file: **`js/i18n.js`**.

1. Open the repository on GitHub, click `js`, then `i18n.js`.
2. Click the pencil icon (top right of the file) to edit.
3. Use *Ctrl+F* (or *Cmd+F*) to find the English sentence you want to change. Each line looks like
   `"about.p1": "The International Foundation for …",` — the part before the colon is the *key*,
   the part after is the text. Change only the text, keep the quotes and the comma at the end.
4. Scroll down: the same key appears again under `ar:` (Arabic), `sw:` (Kiswahili) and `ha:`
   (Hausa). Change those too if you have translations; if you leave one out, that language shows
   the English for that sentence.
5. Click **Commit changes** (top right), then **Commit changes** again in the box that appears.

Two things to watch: a double quote inside a sentence needs a backslash before it (`\"like this\"`),
and an apostrophe is fine as it is. If you make a typing mistake that breaks the file, the site does
not go down — the last good version stays online and Netlify shows a red "failed" deploy. Open the
file again, find the line and fix it (or ask Fintan).

### Adding a country to the map

1. In `js/content.js`, add one line to `IFSHHE_COUNTRIES`, copying the pattern of the others:
   `{ id: "404", code: "ke", year: "", lat: 0.5, lon: 37.9 },` — `id` is the country's three-digit
   ISO number (search "ISO 3166-1 numeric Kenya"), `code` its two-letter code, `lat`/`lon` roughly
   its centre (any map website shows these).
2. In `js/i18n.js`, add the country's text in each language, using the existing countries as a
   template: `country.ke.name`, `country.ke.partner`, `country.ke.summary`, `country.ke.b1` … and
   `country.ke.outcome`, `country.ke.cta`.
3. Ask Fintan to add the matching country panel to `index.html` (it is a copy of an existing one
   with the key names changed). The map zooms to fit the countries automatically.

### Adding a member

In `js/content.js`, add an entry to `IFSHHE_MEMBERS` (name, role, optional photo file name). The
"coming soon" card disappears as soon as the list has one real person in it. Member photos are
handled exactly like other photos (next section) — use the `-480` file in the member entry.

### Adding or changing photos

Photos need a small amount of preparation (they are converted into several sizes and modern
formats so the site stays fast), so this is a two-step job:

1. Put the original photo, as big as you have it, into `images/src/` with a short descriptive
   name in lower case with hyphens, for example `images/src/nairobi-workshop.jpg`.
2. Someone with the developer tools installed runs `npm run images`, then commits the generated
   files. The command prints a ready-made `<picture>` block to paste into `index.html`, where the
   `alt` text (a one-sentence description for people who cannot see the image) is written.

Fintan can do step 2 in a few minutes; the originals in `images/src/` are kept in the repository so
nothing is ever lost.

### Languages

Each language has its own address: `ifshhe.com/` (English), `ifshhe.com/ar/`, `ifshhe.com/sw/`,
`ifshhe.com/ha/`. The old `?lang=ar` style links still work. To add a fifth language, a developer
adds a block to `js/i18n.js` and its name to `IFSHHE_LANG_NAMES` (and to `IFSHHE_RTL` if it is
written right to left); the pages, sitemap and language menu follow automatically.

### Contact form

Messages arrive by email at infoifshhe@gmail.com and are also listed in Netlify under **Forms →
contact** (check the *Spam* tab there if something seems to be missing). The free plan allows 100
messages a month. Each message says which language the visitor was using.

### Visitor counter

The number in the footer counts people, once per day each — not page views — and stores no personal
data (a one-way scrambled code that is deleted within 48 hours). You can read the current number at
`ifshhe.com/api/visits`.

### Instagram

Until the account exists the footer shows "Instagram — coming soon". When it does, put the full
address into `IFSHHE_SOCIAL.instagram` in `js/content.js` (for example
`"https://www.instagram.com/ifshhe"`) and the text becomes a link.

### Domain renewal

Wix account → **Domains** → `ifshhe.com` → make sure **auto-renew** is on and the card on file is
valid. The domain is the one thing that cannot be recovered quickly if it lapses.

### Accounts checklist

- **GitHub** — owner: the IFSHHE email address. Fintan as collaborator.
- **Netlify** — owner: the IFSHHE email address. Fintan as collaborator.
- **Wix** — domain registration only.
- **UptimeRobot** (optional, free) — emails you if the site is ever down.

Keep passwords in a password manager and switch on two-factor authentication on all of them.

### If something breaks

1. Netlify → **Deploys**. A red deploy means the latest change could not be built; the previous
   version is still live. Click it to read the error, or click an older green deploy and choose
   **Publish deploy** to roll back with one click.
2. If the site is up but looks wrong, the same **Publish deploy** on an older deploy restores it.
3. Otherwise contact Fintan with a screenshot and the address of the page.

---

## Part 2 — For developers

### Stack

Static HTML/CSS/JS, no framework, no client-side templating. A small Node build renders the four
language versions, bundles and minifies the stylesheet and scripts (esbuild), splits the
translations into one small file per language, and stamps cache-busting hashes. Netlify serves `dist/`,
hosts the contact form (Netlify Forms) and runs one function (`netlify/functions/visits.mjs`,
Netlify Blobs) for the visitor counter. Node ≥ 22.12 (Netlify builds on 22; see `netlify.toml`).

```
npm ci              install (uses package-lock.json)
npm run build       render dist/  (static copy + map data + pages + cache-bust)
npm run serve       build, then serve dist/ at http://localhost:8000
npm run lint        html-validate over dist/**/*.html
npm run images      images/src/* -> images/*-{480,800,1200,1600}.{avif,webp,jpg}, manifest, placeholders.css; then icons + OG image
npm run fonts       re-download the woff2 subsets from Google Fonts -> fonts/, css/fonts.css
npm run map         regenerate data/world.json from js/content.js (also done by every build)
npm run lhci        build + Lighthouse CI against lighthouserc.json
```

Generated images, fonts, icons and `data/world.json` are **committed**, so a Netlify build is just
`npm ci && npm run build` (seconds) and deploy previews are instant. Run `npm run images` /
`npm run fonts` locally when photos or fonts change and commit the output.

### Layout

```
index.html, thank-you.html, 404.html   source pages (English inline + data-i18n keys)
css/styles.css, css/map.css            styles (map.css is the map section only; merged into styles.css in dist/)
css/fonts.css, css/placeholders.css    generated; prepended to styles.css in dist/
js/content.js                          editable data: countries, members, partners, social links
js/i18n.js                             dictionaries + window.t(key, vars)  (dist/ gets js/i18n.<lang>.js, English + one language each)
js/map.js, js/main.js                  behaviour (classic deferred scripts, globals)
images/src/                            original photos + logo-transparent.png (committed)
images/, fonts/, data/, favicon*, icon-*.png, apple-touch-icon.png   generated, committed
scripts/                               build-images, build-icons, fetch-fonts, build-map, build-pages, stamp, build
netlify/functions/visits.mjs           visitor counter
netlify.toml                           publish dir, headers (CSP), caching, redirects
```

### How pre-rendering and i18n work

`scripts/build-pages.mjs` loads `index.html` and `thank-you.html` with cheerio, evaluates
`js/i18n.js` with a stub `window`, and writes one copy per language: `/`, `/ar/`, `/sw/`, `/ha/`
(`404.html` is copied once, in English). For each page it:

- sets `<html lang dir>` (RTL for the languages in `IFSHHE_RTL`);
- replaces the text of every `[data-i18n="key"]`, the `alt` of `[data-i18n-alt]`, and the
  attributes listed in `data-i18n-attr="attr:key;attr:key"`;
- fills `<title>`, meta description, `og:*`, canonical, `hreflang` alternates and `og:locale`
  from `meta.title` / `meta.description` (thank-you: `meta.thankYou.*` if defined);
- sets `input[name="lang"]`, points the contact form `action` at the language's thank-you page,
  turns the language menu `a[data-lang]` into real links with `aria-current` on the active one;
- on `/ar/`, swaps the Fraunces font preload for the Arabic face (and preloads its Latin subset).

`scripts/build.mjs` then merges `css/fonts.css + css/placeholders.css + css/styles.css + css/map.css`
into one minified `dist/css/styles.css` (the `map.css` link is removed from the built pages), minifies
`js/*.js`, and writes `dist/js/i18n.<lang>.js` (English plus that language, with `window.t`) so each
page only downloads its own dictionary; the pages' `/js/i18n.js` reference is rewritten to match.

A key missing from a language falls back to English; a key missing from English too is reported
and the inline text is kept. Language switching is plain navigation between these pages — there is
no client-side re-translation. `window.t()` is used only for strings JS creates at runtime.

`scripts/stamp.mjs` rewrites every `/css/*.css` and `/js/*.js` reference as `?v=<content hash>`,
which is what allows `netlify.toml` to cache those paths as immutable. Asset URLs must be
root-relative (`/css/…`, `/images/…`) because pages live in sub-folders.

### Content Security Policy

`netlify.toml` sends `script-src 'self'; style-src 'self'` (no `unsafe-inline`). That means:

- **no `style="…"` attributes** and no `<style>` blocks in HTML — use classes; image placeholder
  colours come from the generated `.ph-<name>` classes in `css/placeholders.css`;
- **no inline `<script>`** (JSON-LD `type="application/ld+json"` is fine) and no third-party
  scripts, fonts or CDNs; JS may set styles through the CSSOM (`el.style.left = …`);
- images only from the site itself plus `data:` URIs; `connect-src 'self'` covers `/api/visits`.

`npm run lint` fails on inline styles so this cannot regress unnoticed.

### Map

`scripts/build-map.mjs` reads `IFSHHE_COUNTRIES` from `js/content.js`, projects the world-atlas
110m countries with `geoNaturalEarth1` fitted to the countries' marker bbox (padded 8° / 6°, never
tighter than `[[-25,-36],[60,62]]`, whole world if wider than 150° of longitude) into a 960×680
viewBox, and writes `data/world.json` (`{ width, height, view, countries: [{ id, name, d, c }],
pins: { code: [x, y] } }`) plus `data/world.svg` for eyeballing. The browser fetches the JSON
lazily and draws `<path>`s itself; no d3 at runtime.

### Adding things

- **Country:** one line in `IFSHHE_COUNTRIES` (ISO numeric `id`, `code`, `lat`, `lon`), the
  `country.<code>.*` keys in `js/i18n.js`, a chip and a panel in `index.html` following the
  existing ones. The map refits on the next build.
- **Member:** `IFSHHE_MEMBERS` in `js/content.js`; photo through the image pipeline, use the
  `-480` variant.
- **Photo:** drop the original in `images/src/`, `npm run images`, paste the printed `<picture>`
  snippet (adjust `sizes`, `alt`, `loading`/`fetchpriority`), commit the generated files.
- **Language:** new block in `IFSHHE_I18N`, name in `IFSHHE_LANG_NAMES` (+ `IFSHHE_RTL` if RTL),
  a `[lang="xx"]` font stack in `css/styles.css` if the script needs one, a `?lang=` redirect in
  `netlify.toml` and a `<url>` block in `sitemap.xml`.

### Lighthouse and CI

`.github/workflows/ci.yml` runs on every push and pull request: `npm ci`, `npm run build`,
`html-validate`, then Lighthouse CI (`lighthouserc.json`: desktop preset, `/` and `/ar/`, three
runs; performance ≥ 0.95, accessibility / best practices / SEO = 1, scripts ≤ 60 KB). Locally:
`npm run lhci` (reports land in `.lighthouseci/`), or a one-off
`npx -y lighthouse http://localhost:8000/ --view` against `npm run serve`.

### Netlify setup (one-off)

1. **Site:** Netlify → Add new site → Import from Git → this repository. Build command and publish
   directory are read from `netlify.toml`. Leave deploy previews on for pull requests.
2. **Forms:** after the first deploy Netlify lists the `contact` form. Site configuration →
   Notifications → Form submission notifications → Add notification → Email → `infoifshhe@gmail.com`,
   form `contact`. Spam filtering is on by default.
3. **Visitor counter:** Site configuration → Environment variables → add `VISITS_SALT` with a long
   random string (for example the output of `openssl rand -hex 24`). Netlify Blobs needs no setup.
   To seed the count from the old site: `npx netlify blobs:set site-stats visits 1234`.
4. **Domain:** Domain management → Add domain → `ifshhe.com`. Then at Wix (Domains → ifshhe.com →
   Manage DNS records) either point the nameservers at the ones Netlify shows (simplest; Netlify
   then manages apex, www and certificates) or add the records Netlify lists: an `A` record for `@`
   to Netlify's load balancer and a `CNAME` for `www` to `<site>.netlify.app`. HTTPS is issued
   automatically once DNS has propagated; the `www` → apex redirect is in `netlify.toml`.
5. **Search Console:** add the property for `ifshhe.com` (DNS TXT record at Wix) and submit
   `https://ifshhe.com/sitemap.xml`.
6. After the move, cancel the Wix *site* plan, not the domain.

### Fonts

Self-hosted woff2 subsets (SIL OFL 1.1, `fonts/LICENSE.txt`): Fraunces 500–600 (opsz + SOFT axes),
Nunito Sans 400–700, Noto Naskh Arabic 400–600 (latin / latin-ext / arabic subsets, loaded per
`unicode-range`), plus 5 KB Noto Sans / Noto Serif subsets holding only the Hausa hooked letters.
`index.html` preloads exactly `/fonts/fraunces-500-600-latin.woff2` and
`/fonts/nunito-sans-400-700-latin.woff2`; keep those names if you re-run `npm run fonts`.
