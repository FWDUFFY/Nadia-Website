# IFSHHE website

Static site for the International Foundation for Sexual Health and HIV Education (ifshhe.com).
Plain HTML/CSS/JS, no build step. Hosted on Netlify (free tier) under IFSHHE's own account.

## Editing content

| What | Where |
| --- | --- |
| Page text (all languages) | `js/i18n.js`. English is the source; other languages fall back to English for any missing key |
| Countries on the map | `js/content.js` (`IFSHHE_COUNTRIES`) plus `country.<code>.*` text in `js/i18n.js` |
| Members | `js/content.js` (`IFSHHE_MEMBERS`); put photos in `images/members/` |
| Photos | `images/`, referenced from `index.html` |
| Colours and fonts | top of `css/styles.css` |

Languages: English, Arabic (right to left), Kiswahili and Hausa. Link to a language directly with `?lang=ar`.

## Run locally

    python3 -m http.server 8000   # then open http://localhost:8000

The visitor counter only appears when the site is deployed to Netlify, or locally with `npx netlify dev`.

## Deploy (one-off setup)

1. Create a Netlify account with the IFSHHE email address so the organisation owns it.
2. Deploy the folder: connect a Git repo, or run `npx netlify deploy --prod`.
3. **Forms:** Netlify detects the `contact` form automatically. Under Site configuration > Notifications > Form submission notifications, add an email notification to infoifshhe@gmail.com.
4. **Domain:** in Netlify, go to Domain management > Add domain and enter `ifshhe.com`. Then in Wix (Domains > ifshhe.com > Manage DNS records), set the records Netlify shows: an `A` record for `@` pointing to Netlify's load balancer IP, and a `CNAME` for `www` pointing to `<site>.netlify.app`. HTTPS is issued automatically once DNS propagates.
5. After the domain is moved, cancel the Wix premium site plan, but keep the domain registration.

## Visitor counter

`netlify/functions/visits.mjs` keeps a single count in Netlify Blobs. The browser adds one visit per session.
