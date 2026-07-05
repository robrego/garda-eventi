"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import DateRibbon from "@/components/DateRibbon";
import Filters, { ViewMode } from "@/components/Filters";
import EventList from "@/components/EventList";
import { EventItem } from "@/data/config";

// Leaflet touches `window`, so the map must be client-only with SSR disabled.
const EventMap = dynamic(() => import("@/components/EventMap"), {
  ssr: false,
  loading: () => <div className="map-loading">Caricamento mappa…</div>,
});

function iso(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dateFromISO(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export default function EventsApp({ events: allEvents }: { events: EventItem[] }) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const todayISO = iso(today);

  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [weekAnchor, setWeekAnchor] = useState(today);
  const [townFilter, setTownFilter] = useState("all");
  const [view, setView] = useState<ViewMode>("split");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const datesWithEvents = useMemo(() => new Set(allEvents.map((e) => e.date)), [allEvents]);

  const selectedDateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "short", year: "numeric" }).format(
        dateFromISO(selectedDate)
      ),
    [selectedDate]
  );

  const dayEvents = useMemo(() => {
    let list = allEvents.filter((e) => e.date === selectedDate);
    if (townFilter !== "all") list = list.filter((e) => e.town === townFilter);
    return list;
  }, [allEvents, selectedDate, townFilter]);

  const layoutClass = ["layout", view === "list" ? "list-only" : "", view === "map" ? "map-only" : ""]
    .filter(Boolean)
    .join(" ");

  const handleDatePick = (value: string) => {
    if (!value) return;
    setSelectedDate(value);
    const [y, m, d] = value.split("-").map(Number);
    setWeekAnchor(new Date(y, m - 1, d));
  };

  const dateInputRef = useRef<HTMLInputElement>(null);
  const openDatePicker = () => {
    const input = dateInputRef.current;
    if (!input) return;
    if (typeof input.showPicker === "function") {
      input.showPicker();
    } else {
      input.focus();
      input.click();
    }
  };

  return (
    <div className="app">
      <header className="top">
        <div className="brand-mark">
          <svg width="42" height="42" viewBox="0 0 38 38" fill="none">
            <circle cx="19" cy="19" r="19" fill="#2c6a72" />
            <path d="M6 22c3-2 5.5-2 8 0s5.5 2 8 0 5.5-2 8 0" stroke="#e2eeec" strokeWidth="1" fill="none" />
            <path d="M6 17c3-2 5.5-2 8 0s5.5 2 8 0 5.5-2 8 0" stroke="#3f9d5f" strokeWidth="1" fill="none" opacity="0.9" />
            <circle cx="14" cy="12" r="2.2" fill="#faf6ec" />
          </svg>
          <h1>Lago di Garda</h1>
        </div>
        <div
          className="date-picker-wrap"
          role="button"
          tabIndex={0}
          aria-label="Scegli una data"
          onClick={() => openDatePicker()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openDatePicker();
            }
          }}
        >
          <span className="date-picker-label">{selectedDateLabel}</span>
          <input
            ref={dateInputRef}
            type="date"
            className="date-picker-input"
            value={selectedDate}
            onChange={(e) => handleDatePick(e.target.value)}
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>
      </header>

      <DateRibbon
        weekAnchor={weekAnchor}
        setWeekAnchor={setWeekAnchor}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        todayISO={todayISO}
        datesWithEvents={datesWithEvents}
      />

      <Filters townFilter={townFilter} setTownFilter={setTownFilter} view={view} setView={setView} />

      <div className={layoutClass}>
        <div className="map-pane">
          <div id="map">
            <EventMap events={dayEvents} onSelect={setSelectedId} />
          </div>
        </div>
        <EventList
          selectedDate={selectedDate}
          events={dayEvents}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
    </div>
  );
}
