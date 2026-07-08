import { get } from "@vercel/blob";
import rawEvents from "./events.json";
import { MARKET_DAYS, EventItem } from "./config";
import { readManualEvents } from "@/lib/manualEvents";
import { readImageOverrides, imageOverrideKey } from "@/lib/imageOverrides";
import { readDescOverrides, descOverrideKey } from "@/lib/descOverrides";

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
        titleEn: "Weekly market",
        cat: "market",
        time: "08:00–13:00",
        desc: `Bancarelle di prodotti locali, frutta e verdura, formaggi e articoli vari nel centro di ${town}.`,
        descEn: `Stalls of local produce, fruit and vegetables, cheeses and other goods in the center of ${town}.`,
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
 * Reads the fortnightly scraper's output from Vercel Blob. Isolated behind a
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
 * Returns the full event list: manually-submitted events (highest
 * priority — a person deliberately added or corrected these), then the
 * fortnightly scraper's output from Blob, then curated events.json, plus
 * generated weekly market entries. `hasLiveData` tells the UI whether
 * any automated source actually contributed events this run.
 */
export async function getAllEvents(): Promise<{ events: EventItem[]; hasLiveData: boolean }> {
  const [manual, scraped, imageOverrides, descOverrides] = await Promise.all([
    readManualEvents(),
    fetchScrapedEvents(),
    readImageOverrides(),
    readDescOverrides(),
  ]);
  const curated = dedupe([...manual, ...scraped, ...(rawEvents as RawEvent[])]);
  const imageOverrideMap = new Map(imageOverrides.map((o) => [imageOverrideKey(o), o.image]));
  const descOverrideMap = new Map(descOverrides.map((o) => [descOverrideKey(o), o.desc]));

  const events: EventItem[] = curated.map((e, i) => {
    const image = imageOverrideMap.get(imageOverrideKey(e));
    const desc = descOverrideMap.get(descOverrideKey(e));
    return { id: `ev${i}`, ...e, ...(image ? { image } : {}), ...(desc ? { desc } : {}) };
  });

  let idCounter = events.length;
  for (const m of marketEvents()) {
    events.push({ id: `market${idCounter++}`, ...m });
  }

  return { events, hasLiveData: scraped.length > 0 };
}
