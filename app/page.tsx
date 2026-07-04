"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import DateRibbon from "@/components/DateRibbon";
import Filters, { ViewMode } from "@/components/Filters";
import EventList from "@/components/EventList";
import { getAllEvents } from "@/data/getEvents";

// Leaflet touches `window`, so the map must be client-only with SSR disabled.
const EventMap = dynamic(() => import("@/components/EventMap"), { ssr: false });

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

const DOW_FULL = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
const MONTHS = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];

export default function Home() {
  const allEvents = useMemo(() => getAllEvents(), []);

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

  const dayEvents = useMemo(() => {
    let list = allEvents.filter((e) => e.date === selectedDate);
    if (townFilter !== "all") list = list.filter((e) => e.town === townFilter);
    return list;
  }, [allEvents, selectedDate, townFilter]);

  const layoutClass = ["layout", view === "list" ? "list-only" : "", view === "map" ? "map-only" : ""]
    .filter(Boolean)
    .join(" ");

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
          <div>
            <h1>Lago di Garda e Dintorni</h1>
            <div className="brand-sub">Eventi da Peschiera a Limone</div>
          </div>
        </div>
        <div className="today-pill">
          Oggi è <strong>{DOW_FULL[today.getDay()]} {today.getDate()} {MONTHS[today.getMonth()]}</strong>
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
