import { RawEvent } from "../getEvents";
import { TOWNS } from "../config";
import { guessCategory } from "./municipium";

const EVENTS_URL = "https://www.gardaclick.com/eventi-fiere-mercati-lago-di-garda";

const MONTHS_IT = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];

// GardaClick lists events for the whole Garda area, including plenty of
// towns well outside our scope (Verona, Fiera di Montichiari, comuni we
// don't cover — our scope now reaches ~10-15 km inland, see TOWN_AREAS'
// "Entroterra" group, but not that far). Matching is a substring check
// against TOWNS — the table's location text is usually longer than our key
// ("Desenzano del Garda", "Torbole sul Garda", "Bogliaco di Gargnano") —
// except for "Garda" itself, which needs an exact match: as a substring it
// would wrongly match every out-of-scope "X del/sul Garda" entry
// ("Garda Trentino", any future comune we still don't cover).
//
// A couple of entries (the "1000 Miglia" rally, "Lago di Garda in Love")
// are tagged with the whole lake rather than one town — genuinely
// lake-wide events, not a scope technicality like the exhibition-center
// fairs ("Fiera di Verona"/"Fiera di Montichiari", still excluded below).
// We pin those at Desenzano, this app's reference town, rather than
// inventing a new non-town map entry for two events a year.
function matchTown(locationText: string): string | null {
  const normalized = locationText.trim().toLowerCase();
  if (normalized === "lago di garda") return "Desenzano";
  for (const town of TOWNS) {
    if (town === "Garda") continue;
    if (normalized.includes(town.toLowerCase())) return town;
  }
  return normalized === "garda" ? "Garda" : null;
}

// Day-of-month cells look like "18" (single day), "10-11" (same-month
// range), "15 & 17" (two separate days), or "30-3/02" (cross-month range,
// end month after the slash) — one row on the site has a literal "\"
// instead of "/" for that last case, normalized away below. We only need
// the first day to place the event on the calendar; the rest becomes a
// human-readable range mentioned in the description.
function parseDaySpec(daySpec: string, monthName: string): { day: number; rangeLabel: string | null } | null {
  const normalized = daySpec.replace(/\\/g, "/").trim();

  let m = normalized.match(/^(\d{1,2})-(\d{1,2})\/(\d{1,2})$/);
  if (m) {
    const endMonth = MONTHS_IT[Number(m[3]) - 1];
    return {
      day: Number(m[1]),
      rangeLabel: endMonth ? `dal ${m[1]} ${monthName} al ${m[2]} ${endMonth}` : null,
    };
  }

  m = normalized.match(/^(\d{1,2})\s*&\s*(\d{1,2})$/);
  if (m) return { day: Number(m[1]), rangeLabel: `il ${m[1]} e il ${m[2]} ${monthName}` };

  m = normalized.match(/^(\d{1,2})-(\d{1,2})$/);
  if (m) return { day: Number(m[1]), rangeLabel: `dal ${m[1]} al ${m[2]} ${monthName}` };

  m = normalized.match(/^(\d{1,2})$/);
  if (m) return { day: Number(m[1]), rangeLabel: null };

  return null;
}

function extractSeasonYear(html: string, fallback: number): number {
  const match = html.match(/stagione\s+(\d{4})/i);
  return match ? Number(match[1]) : fallback;
}

// Matches both the month-header rows (`<tr class="table-primary">...`) and
// the event rows, in document order, so a single pass can track "which
// month are we currently under" — the table has no other way to associate
// a row with its month.
const ROW_RE =
  /<tr class="table-primary"><td class="intestazione-tabella" colspan="3">([^<]+)<\/td><\/tr>|<tr><td class="text-nowrap"><i class="icon-calendar"><\/i>([^<]*)<\/td><td><i class="icon-location"><\/i>([^<]*)<\/td><td><a href="([^"]*)"[^>]*title="([^"]*)">/g;

/**
 * GardaClick has no feed: one static page per season, a single big table
 * grouped by month. Isolated behind its own try/catch: a redesign or
 * outage just means no events from this source this run, never a broken
 * scrape.
 */
export async function scrapeGardaClick(): Promise<RawEvent[]> {
  try {
    const res = await fetch(EVENTS_URL, { headers: { "User-Agent": "GardaEventiBot/1.0" } });
    if (!res.ok) return [];
    const html = await res.text();
    const year = extractSeasonYear(html, new Date().getFullYear());

    const events: RawEvent[] = [];
    let monthIndex = -1;
    let match: RegExpExecArray | null;
    while ((match = ROW_RE.exec(html))) {
      const [, monthHeader, daySpec, locationText, href, rawTitle] = match;
      if (monthHeader) {
        monthIndex = MONTHS_IT.indexOf(monthHeader.trim().toLowerCase());
        continue;
      }
      if (monthIndex < 0) continue;

      const town = matchTown(locationText);
      if (!town) continue;

      const title = rawTitle.trim();
      if (!title) continue;

      const parsed = parseDaySpec(daySpec, MONTHS_IT[monthIndex]);
      if (!parsed || parsed.day < 1 || parsed.day > 31) continue;

      const date = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(parsed.day).padStart(2, "0")}`;
      const isLakeWide = locationText.trim().toLowerCase() === "lago di garda";
      const intro = isLakeWide ? "Evento che coinvolge tutto il Lago di Garda" : `Evento a ${town}`;
      const desc = parsed.rangeLabel
        ? `${intro} (${parsed.rangeLabel}). Consulta il sito dell'organizzatore per orari e dettagli.`
        : `${intro}. Consulta il sito dell'organizzatore per orari e dettagli.`;

      events.push({
        date,
        town,
        title,
        cat: guessCategory(title),
        time: "Vedi il sito per l'orario",
        desc,
        src: "gardaclick.com",
        ...(href ? { url: href } : {}),
      });
    }
    return events;
  } catch {
    return [];
  }
}
