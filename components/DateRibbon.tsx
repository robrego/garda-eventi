"use client";

import { useMemo } from "react";

const DOW = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
const MONTHS = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
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
  const days = useMemo(() => {
    const start = new Date(weekAnchor);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [weekAnchor]);

  return (
    <div className="ribbon-wrap">
      <div className="ribbon-header">
        <div className="month">
          {MONTHS[weekAnchor.getMonth()]} {weekAnchor.getFullYear()}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div className="ribbon-nav">
            <button aria-label="Settimana precedente" onClick={() => setWeekAnchor(addDays(weekAnchor, -7))}>
              &larr;
            </button>
            <button aria-label="Settimana successiva" onClick={() => setWeekAnchor(addDays(weekAnchor, 7))}>
              &rarr;
            </button>
          </div>
        </div>
      </div>
      <div className="ribbon-track">
        {days.map((d) => {
          const dISO = iso(d);
          const classes = [
            "day-chip",
            dISO === selectedDate ? "active" : "",
            dISO === todayISO ? "is-today" : "",
            datesWithEvents.has(dISO) ? "has-events" : "",
          ].filter(Boolean).join(" ");
          return (
            <div key={dISO} className={classes} onClick={() => setSelectedDate(dISO)}>
              <div className="dow">{DOW[d.getDay()]}</div>
              <div className="num">{d.getDate()}</div>
              <div className="dot" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
