import type { MouseEvent } from "react";
import { TOWN_CREST } from "@/data/config";
import { DOW_FULL, MONTHS } from "@/lib/i18n";

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
    return <img src={crest} alt="" className="event-cover-crest" loading="lazy" />;
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

export const DOMAIN_RE = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;

// `onLinkClick` is optional so this also works from a Server Component
// (e.g. the static town pages) — a Server Component can't hand a plain
// function down as a prop across the client boundary, but `undefined` is
// fine since no `onClick` attribute ends up on the element at all.
export function SourceLine({
  src,
  label,
  onLinkClick,
}: {
  src: string;
  label: string;
  onLinkClick?: (e: MouseEvent) => void;
}) {
  if (DOMAIN_RE.test(src.trim())) {
    const href = src.trim().startsWith("http") ? src.trim() : `https://${src.trim()}`;
    return (
      <>
        {label}{" "}
        <a href={href} target="_blank" rel="noopener noreferrer" onClick={onLinkClick}>
          {src}
        </a>
      </>
    );
  }
  return <>{label} {src}</>;
}
