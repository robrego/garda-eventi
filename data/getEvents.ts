import { get } from "@vercel/blob";
import rawEvents from "./events.json";
import { MARKET_DAYS, EventItem } from "./config";

export const SCRAPED_BLOB_PATHNAME = "garda-scraped-events.json";

export type RawEvent = Omit<EventItem, "id">;

function iso(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function addDays(d: Date, n: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

function marketEvents(): RawEvent[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const events: RawEvent[] = [];
  for (let i = -3; i < 32; i++) {
    const d = addDays(today, i);
    const towns = MARKET_DAYS[d.getDay()];
    if (!towns) continue;
    towns.forEach((town) => {
      events.push({
        date: iso(d),
        town,
        title: "Mercato settimanale",
        cat: "market",
        time: "08:00–13:00",
        desc: `Bancarelle di prodotti locali, frutta e verdura, formaggi e articoli vari nel centro di ${town}.`,
        src: "Calendario mercati settimanali Lago di Garda",
      });
    });
  }
  return events;
}

function dedupe(events: RawEvent[]): RawEvent[] {
  const seen = new Set<string>();
  const out: RawEvent[] = [];
  for (const e of events) {
    const key = `${e.date}|${e.town}|${e.title.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(e);
  }
  return out;
}

/**
 * Reads the weekly scraper's output from Vercel Blob. Isolated behind a
 * try/catch: if Blob isn't configured (no token) or the cron hasn't run
 * yet, we fall back to the static curated list rather than breaking the
 * page.
 */
async function fetchScrapedEvents(): Promise<RawEvent[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  try {
    const result = await get(SCRAPED_BLOB_PATHNAME, { access: "private" });
    if (!result?.stream) return [];
    const text = await new Response(result.stream).text();
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/**
 * Returns the full event list: curated events from events.json, plus
 * whatever the weekly scraper found in Blob storage, plus generated
 * weekly market entries. `hasLiveData` tells the UI whether any
 * automated source actually contributed events this run.
 */
export async function getAllEvents(): Promise<{ events: EventItem[]; hasLiveData: boolean }> {
  const scraped = await fetchScrapedEvents();
  const curated = dedupe([...(rawEvents as RawEvent[]), ...scraped]);

  const events: EventItem[] = curated.map((e, i) => ({ id: `ev${i}`, ...e }));

  let idCounter = events.length;
  for (const m of marketEvents()) {
    events.push({ id: `market${idCounter++}`, ...m });
  }

  return { events, hasLiveData: scraped.length > 0 };
}
