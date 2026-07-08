import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { SCRAPERS } from "@/data/scrapers";
import { SCRAPED_BLOB_PATHNAME } from "@/data/getEvents";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Cron syntax can't express "every 2 weeks" without drifting across month/year
// boundaries, so Vercel still triggers this weekly (see vercel.json) and we
// skip every other invocation here instead. Epoch-week parity never resets,
// unlike ISO week numbers, so the cadence stays exactly 14 days forever.
function isScheduledFortnight(now: Date): boolean {
  const epochWeeks = Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000));
  return epochWeeks % 2 === 0;
}

export async function GET(req: NextRequest) {
  if (process.env.CRON_SECRET) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const force = req.nextUrl.searchParams.get("force") === "1";
  if (!force && !isScheduledFortnight(new Date())) {
    return NextResponse.json({ ok: true, skipped: true, reason: "off week (runs every 2 weeks)" });
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
