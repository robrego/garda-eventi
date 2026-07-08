"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { DOW_SHORT } from "@/lib/i18n";

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

export default function DateRibbon({
  weekAnchor,
  setWeekAnchor,
  selectedDate,
  setSelectedDate,
  todayISO,
  datesWithEvents,
}: {
  weekAnchor: Date;
  setWeekAnchor: (d: Date) => void;
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  todayISO: string;
  datesWithEvents: Set<string>;
}) {
  const { lang, t } = useLang();
  const trackRef = useRef<HTMLDivElement>(null);
  const [numDays, setNumDays] = useState(7);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const recalc = () => {
      const chip = el.querySelector<HTMLElement>(".day-chip");
      const gap = 8;
      const chipWidth = chip ? chip.offsetWidth : 58;
      const paddingRight = parseFloat(getComputedStyle(el).paddingRight) || 0;
      const available = el.clientWidth - paddingRight;
      const fit = Math.floor((available + gap) / (chipWidth + gap));
      setNumDays(Math.max(3, fit));
    };
    recalc();
    const ro = new ResizeObserver(recalc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const days = useMemo(() => {
    const start = new Date(weekAnchor);
    return Array.from({ length: numDays }, (_, i) => addDays(start, i));
  }, [weekAnchor, numDays]);

  return (
    <div className="ribbon-wrap">
      <div className="ribbon-nav">
        <button aria-label={t("ariaPrevDays")} onClick={() => setWeekAnchor(addDays(weekAnchor, -numDays))}>
          &larr;
        </button>
        <button aria-label={t("ariaNextDays")} onClick={() => setWeekAnchor(addDays(weekAnchor, numDays))}>
          &rarr;
        </button>
      </div>
      <div className="ribbon-track" ref={trackRef}>
        {days.map((d) => {
          const dISO = iso(d);
          const classes = [
            "day-chip",
            dISO === selectedDate ? "active" : "",
            dISO === todayISO ? "is-today" : "",
            datesWithEvents.has(dISO) ? "has-events" : "",
          ].filter(Boolean).join(" ");
          return (
            <button
              key={dISO}
              type="button"
              className={classes}
              aria-pressed={dISO === selectedDate}
              onClick={() => setSelectedDate(dISO)}
            >
              <div className="dow">{DOW_SHORT[lang][d.getDay()]}</div>
              <div className="num">{d.getDate()}</div>
              <div className="dot" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
