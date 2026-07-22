import Image from "next/image";
import { TOWN_CREST } from "@/data/config";
import { DOW_FULL, MONTHS } from "@/lib/i18n";
import { isOptimizableImageHost } from "@/lib/imageHosts";

export function LinkArrowIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="event-name-link-icon"
    >
      <path d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CoverPlaceholder({ town }: { town: string }) {
  const crest = TOWN_CREST[town];
  if (crest) {
    // SVG crests are already tiny (vector data) and next/image refuses to
    // optimize SVG sources without dangerouslyAllowSVG, so only route the
    // large raster (.png) crests through the optimizer.
    if (crest.endsWith(".svg")) {
      return <img src={crest} alt="" className="event-cover-crest" loading="lazy" />;
    }
    return (
      <Image
        src={crest}
        alt=""
        width={42}
        height={42}
        className="event-cover-crest"
        loading="lazy"
        unoptimized={!isOptimizableImageHost(crest)}
      />
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="event-cover-icon">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="9.5" r="1.6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function dateFromISO(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatDate(d: Date, lang: "it" | "en") {
  if (lang === "en") {
    return `${DOW_FULL.en[d.getDay()]}, ${MONTHS.en[d.getMonth()]} ${d.getDate()}`;
  }
  return `${DOW_FULL.it[d.getDay()]} ${d.getDate()} ${MONTHS.it[d.getMonth()]}`;
}

