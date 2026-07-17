import { EventItem, TOWN_COORDS } from "@/data/config";
import type { Lang } from "@/lib/i18n";

const TIME_PREFIX_RE = /^(\d{2}):(\d{2})/;

// A handful of curated events use a descriptive time (see TIME_LABELS_EN in
// data/config.ts) instead of an "HH:MM–HH:MM" range. Google's Event
// rich-result eligibility wants a real startDate with a time, so these get
// a reasonable default clock time rather than a date-only value.
const DEFAULT_TIME_FOR_LABEL: Record<string, string> = {
  "giornata intera": "09:00",
  "in giornata": "09:00",
  "in serata": "20:00",
  "mattina": "09:00",
  "pomeriggio": "15:00",
};
const DEFAULT_TIME_FALLBACK = "09:00";

// EU DST (last Sunday of March to last Sunday of October) via Intl's own
// Europe/Rome data, so this stays correct without a hand-maintained table.
function utcOffsetFor(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Rome",
    timeZoneName: "shortOffset",
  }).formatToParts(date);
  const tzName = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+1";
  const hours = parseInt(tzName.replace("GMT", ""), 10) || 0;
  return `${hours >= 0 ? "+" : "-"}${String(Math.abs(hours)).padStart(2, "0")}:00`;
}

function startDateFor(e: EventItem): string {
  const m = e.time.match(TIME_PREFIX_RE);
  const hm = m ? `${m[1]}:${m[2]}` : DEFAULT_TIME_FOR_LABEL[e.time] ?? DEFAULT_TIME_FALLBACK;
  const offset = utcOffsetFor(new Date(`${e.date}T00:00:00Z`));
  return `${e.date}T${hm}:00${offset}`;
}

export function buildEventJsonLd(events: EventItem[], town: string, lang: Lang, pageUrl: string) {
  const coords = TOWN_COORDS[town];
  const graph = events.map((e) => ({
    "@type": "Event",
    "@id": `${pageUrl}#${e.id}`,
    name: lang === "en" ? e.titleEn ?? e.title : e.title,
    description: lang === "en" ? e.descEn ?? e.desc : e.desc,
    startDate: startDateFor(e),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: town,
      address: { "@type": "PostalAddress", addressLocality: town, addressCountry: "IT" },
      ...(coords ? { geo: { "@type": "GeoCoordinates", latitude: coords[0], longitude: coords[1] } } : {}),
    },
    ...(e.url ? { url: e.url } : {}),
    ...(e.image ? { image: [e.image] } : {}),
  }));

  return { "@context": "https://schema.org", "@graph": graph };
}

// `<` is escaped so a `</script>` (or similar) inside an event description
// can't break out of the JSON-LD <script> tag it's embedded in.
export function jsonLdScriptProps(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
