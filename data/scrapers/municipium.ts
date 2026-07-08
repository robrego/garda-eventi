import { XMLParser } from "fast-xml-parser";
import { RawEvent } from "../getEvents";

const MONTHS: Record<string, string> = {
  gennaio: "01", febbraio: "02", marzo: "03", aprile: "04",
  maggio: "05", giugno: "06", luglio: "07", agosto: "08",
  settembre: "09", ottobre: "10", novembre: "11", dicembre: "12",
};

// Dates in these feeds appear as free Italian text, often without a
// year: "Il 4 e 5 Luglio", "Dal 20 al 22 luglio", "4 luglio 2026". We
// take the first day+month found and infer the year from the item's
// pubDate (the announcement date), pushing forward a year if the
// parsed date would otherwise fall clearly before the announcement.
function extractDate(text: string, referenceDate: Date): string | null {
  const withYear = text.match(/(\d{1,2})\s+(?:e\s+\d{1,2}\s+)?(\w+)\s+(\d{4})/i);
  if (withYear) {
    const month = MONTHS[withYear[2].toLowerCase()];
    if (month) return `${withYear[3]}-${month}-${withYear[1].padStart(2, "0")}`;
  }

  const noYear = text.match(/(\d{1,2})\s+(?:e\s+\d{1,2}\s+)?(\w+)\b/i);
  if (!noYear) return null;
  const month = MONTHS[noYear[2].toLowerCase()];
  if (!month) return null;

  let year = referenceDate.getFullYear();
  const candidate = new Date(year, Number(month) - 1, Number(noYear[1]));
  const twoMonthsMs = 60 * 24 * 3600 * 1000;
  if (candidate.getTime() < referenceDate.getTime() - twoMonthsMs) year += 1;
  return `${year}-${month}-${noYear[1].padStart(2, "0")}`;
}

function extractTime(text: string): string | null {
  const match = text.match(/(?:alle\s+(?:ore\s+)?)(\d{1,2})[.:](\d{2})/i);
  if (!match) return null;
  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

export function guessCategory(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("mercat")) return "market";
  if (t.includes("concerto") || t.includes("musica")) return "concert";
  if (t.includes("teatro")) return "teatro";
  if (t.includes("cinema") || t.includes("film")) return "cultura";
  if (t.includes("mostra") || t.includes("arte")) return "art";
  if (t.includes("sagra")) return "sagra";
  if (t.includes("sport") || t.includes("corsa") || t.includes("gara")) return "sport";
  if (t.includes("festa") || t.includes("festival")) return "festival";
  return "cultura";
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&agrave;/g, "à").replace(/&egrave;/g, "è").replace(/&igrave;/g, "ì")
    .replace(/&ograve;/g, "ò").replace(/&ugrave;/g, "ù").replace(/&amp;/g, "&")
    .trim();
}

// Fetches the event's own page and pulls its og:image, if any. Each
// feed only carries ~5 items, so this is a handful of extra requests
// per town — cheap enough for a weekly cron. Isolated behind its own
// try/catch + timeout: a slow or image-less page just means no cover,
// never a broken scrape.
async function fetchOgImage(pageUrl: string): Promise<string | undefined> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(pageUrl, {
      headers: { "User-Agent": "GardaEventiBot/1.0" },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return undefined;
    const html = await res.text();
    const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    const url = match?.[1];
    // Municipium falls back to the comune's crest/logo when a page has
    // no dedicated photo — that's not an event cover, skip it.
    if (url && /stemma/i.test(url)) return undefined;
    return url;
  } catch {
    return undefined;
  }
}

/**
 * Municipium is a CMS used by several Italian comuni (Peschiera, Garda
 * both confirmed) that exposes an `/it/eventi/feed` RSS endpoint (the
 * English `/it/events/feed` path exists too but only serves an HTML
 * meta-refresh redirect, which `fetch()` won't follow — use the
 * Italian path directly). One parser covers any comune running it.
 *
 * Isolated behind try/catch: any failure (feed down, format change)
 * returns [] instead of throwing, so one broken source never blocks
 * the others or the site.
 */
export function createMunicipiumScraper(town: string, feedUrl: string, srcName: string) {
  return async function scrape(): Promise<RawEvent[]> {
    try {
      const res = await fetch(feedUrl, { headers: { "User-Agent": "GardaEventiBot/1.0" } });
      if (!res.ok) return [];
      const xml = await res.text();
      const parsed = new XMLParser({ ignoreAttributes: false }).parse(xml);
      const rawItems = parsed?.rss?.channel?.item;
      if (!rawItems) return [];
      const items = Array.isArray(rawItems) ? rawItems : [rawItems];

      const events: RawEvent[] = [];
      for (const item of items) {
        const title = String(item.title ?? "").trim();
        const body = stripHtml(String(item["content:encoded"] ?? item.description ?? ""));
        if (!title) continue;

        const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
        const referenceDate = Number.isNaN(pubDate.getTime()) ? new Date() : pubDate;

        const date = extractDate(body, referenceDate) ?? extractDate(title, referenceDate);
        if (!date) continue;

        const link = typeof item.link === "string" ? item.link : undefined;
        const image = link ? await fetchOgImage(link) : undefined;

        events.push({
          date,
          town,
          title,
          cat: guessCategory(title),
          time: extractTime(body) ?? "Vedi il sito per l'orario",
          desc: body.slice(0, 300) || title,
          src: srcName,
          ...(image ? { image } : {}),
          ...(link ? { url: link } : {}),
        });
      }
      return events;
    } catch {
      return [];
    }
  };
}
