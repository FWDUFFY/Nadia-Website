// Visitor counter (private — the number is not shown on the site).
//   GET  /api/visits?key=VISITS_KEY -> { count }   (403 without the right key)
//   POST /api/visits                -> counts this visitor once per day, returns { ok }
//
// Privacy: nothing identifying is stored. De-duplication uses a SHA-256 hash of
// (IP + user agent + date + secret salt); the hash is deleted after two days and
// cannot be reversed into an IP address. No cookies are set.
//
// Hardening: bot user agents are not counted; POST is accepted only from the
// site's own origin; any storage failure returns 503 (the page ignores it);
// responses are never cached.
//
// Set VISITS_SALT and VISITS_KEY to long random strings in Netlify (Site
// configuration > Environment variables). Blobs credentials are injected automatically on
// Netlify; BLOBS_SITE_ID / BLOBS_TOKEN are only for running outside it.
import { getStore } from "@netlify/blobs";
import { createHash } from "node:crypto";

const BOT_RE = /bot|crawl|spider|slurp|preview|lighthouse|headless|curl|wget|python|java\/|go-http|fetch|monitor|uptime|facebookexternalhit|whatsapp|telegram|discord|embedly|pinterest|skype/i;
// Origins allowed to POST: the production URL plus this deploy's own URL (deploy previews / branch deploys).
const ORIGINS = [process.env.URL, process.env.DEPLOY_PRIME_URL, process.env.DEPLOY_URL]
  .filter(Boolean).map((u) => u.replace(/\/$/, ""));
const DEV = process.env.CONTEXT === "dev";                   // `netlify dev`
const DAY = 86_400_000;

const json = (body, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });

function store() {
  const opts = { name: "site-stats", consistency: "strong" };
  if (process.env.BLOBS_SITE_ID && process.env.BLOBS_TOKEN) {
    Object.assign(opts, { siteID: process.env.BLOBS_SITE_ID, token: process.env.BLOBS_TOKEN });
  }
  return getStore(opts);
}

const dayKey = (offset = 0) => new Date(Date.now() - offset * DAY).toISOString().slice(0, 10);

export default async (req, context) => {
  if (req.method !== "GET" && req.method !== "POST") return json({ error: "method" }, 405);
  // Same-origin only: browsers always send Origin on a cross-document POST.
  if (req.method === "POST" && ORIGINS.length && !DEV && !ORIGINS.includes(req.headers.get("origin"))) return json({ error: "origin" }, 403);

  try {
    const s = store();
    const current = Number(await s.get("visits")) || 0;
    if (req.method === "GET") {
      const key = new URL(req.url).searchParams.get("key");
      if (!process.env.VISITS_KEY || key !== process.env.VISITS_KEY) return json({ error: "forbidden" }, 403);
      return json({ count: current });
    }

    const ua = req.headers.get("user-agent") || "";
    if (!ua || BOT_RE.test(ua)) return json({ ok: true });

    const ip = context?.ip || req.headers.get("x-nf-client-connection-ip") || "0";
    const salt = process.env.VISITS_SALT || "change-me";
    const today = dayKey();
    const key = `seen/${today}/` + createHash("sha256").update(`${ip}|${ua}|${today}|${salt}`).digest("hex").slice(0, 32);
    if (await s.getMetadata(key)) return json({ ok: true });
    await s.set(key, "1", { metadata: { t: Date.now() } });

    // Blobs has no atomic increment; re-read right before writing to keep the race
    // window tiny. Losing the odd count on a vanity counter is acceptable.
    const next = (Number(await s.get("visits")) || 0) + 1;
    await s.set("visits", String(next));

    // Housekeeping once a day: delete the de-duplication keys from two days ago.
    if ((await s.get("cleaned")) !== today) {
      await s.set("cleaned", today);
      const { blobs } = await s.list({ prefix: `seen/${dayKey(2)}/` });
      await Promise.all(blobs.map((b) => s.delete(b.key)));
    }
    return json({ ok: true });
  } catch (err) {
    console.error("visits:", err?.message || err);
    return json({ error: "unavailable" }, 503);   // the page ignores failures
  }
};

export const config = { path: "/api/visits" };
