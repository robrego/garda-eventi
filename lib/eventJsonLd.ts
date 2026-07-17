import { EventItem, TOWN_COORDS } from "@/data/config";
import type { Lang } from "@/lib/i18n";

const TIME_PREFIX_RE = /^(\d{2}):(\d{2})/;

// Most curated events have an "HH:MM–HH:MM" time; a handful use a
// descriptive label instead (see translateTime in data/config.ts) — those
// fall back to a date-only startDate, which schema.org's Event also allows.
function startDateFor(e: EventItem): string {
  const m = e.time.match(TIME_PREFIX_RE);
  if (!m) return e.date;
  return `${e.date}T${m[1]}:${m[2]}:00`;
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
