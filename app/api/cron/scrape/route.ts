import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { SCRAPERS } from "@/data/scrapers";
import { SCRAPED_BLOB_PATHNAME } from "@/data/getEvents";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  if (process.env.CRON_SECRET) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  // One failing scraper must never take down the others.
  const results = await Promise.allSettled(SCRAPERS.map((scrape) => scrape()));
  const events = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));

  await put(SCRAPED_BLOB_PATHNAME, JSON.stringify(events), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  return NextResponse.json({ ok: true, count: events.length, scrapers: SCRAPERS.length });
}
