// Simple visitor counter stored in Netlify Blobs.
// POST /api/visits increments and returns the count; GET just returns it.
import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("site-stats");
  let count = Number(await store.get("visits")) || 0;

  if (req.method === "POST") {
    count += 1;
    await store.set("visits", String(count));
  }

  return Response.json({ count }, { headers: { "Cache-Control": "no-store" } });
};

export const config = { path: "/api/visits" };
