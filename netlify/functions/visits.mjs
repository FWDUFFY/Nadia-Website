// Visitor counter.   GET /api/visits -> { count }
//                    POST /api/visits -> counts this visitor once per day, returns { count, counted }
//
// Privacy: nothing identifying is stored. De-duplication uses a SHA-256 hash of
// (IP + user agent + date + secret salt); the hash is deleted after two days and
// cannot be reversed into an IP address. No cookies are set.
//
// Hardening: bot user agents are not counted; POST is accepted only from the
// site's own origin; any storage failure returns 503 (the page then hides the
// counter); responses are never cached.
//
// Set VISITS_SALT to a long random string in Netlify (Site configuration >
// Environment variables). Blobs credentials are injected automatically on
// Netlify; BLOBS_SITE_ID / BLOBS_TOKEN are only for running outside it.
import { getStore } from "@netlify/blobs";
import { createHash } from "node:crypto";

const BOT_RE = /bot|crawl|spider|slurp|preview|lighthouse|headless|curl|wget|python|java\/|go-http|fetch|monitor|uptime|facebookexternalhit|whatsapp|telegram|discord|embedly|pinterest|skype/i;
const SITE = (process.env.URL || "").replace(/\/$/, "");   // https://ifshhe.com in production
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
  if (req.method === "POST" && SITE && !DEV && req.headers.get("origin") !== SITE) return json({ error: "origin" }, 403);

  try {
    const s = store();
    const current = Number(await s.get("visits")) || 0;
    if (req.method === "GET") return json({ count: current });

    const ua = req.headers.get("user-agent") || "";
    if (!ua || BOT_RE.test(ua)) return json({ count: current, counted: false });

    const ip = context?.ip || req.headers.get("x-nf-client-connection-ip") || "0";
    const salt = process.env.VISITS_SALT || "change-me";
    const today = dayKey();
    const key = `seen/${today}/` + createHash("sha256").update(`${ip}|${ua}|${today}|${salt}`).digest("hex").slice(0, 32);
    if (await s.getMetadata(key)) return json({ count: current, counted: false });
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
    return json({ count: next, counted: true });
  } catch (err) {
    console.error("visits:", err?.message || err);
    return json({ error: "unavailable" }, 503);   // the page hides the counter
  }
};

export const config = { path: "/api/visits" };
