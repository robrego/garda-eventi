"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import AppHeader from "@/components/AppHeader";
import DateRibbon from "@/components/DateRibbon";
import Filters, { ViewMode } from "@/components/Filters";
import EventList from "@/components/EventList";
import { EventItem } from "@/data/config";
import { useLang } from "@/components/LanguageProvider";
import { useAuthUser } from "@/lib/useAuthUser";
import { formatDate } from "@/components/EventDisplay";
import { eventsCountLabel } from "@/lib/i18n";

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
  const router = useRouter();
  const { lang } = useLang();
  const { email, isAdmin, handleEmailChange } = useAuthUser();
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const todayISO = iso(today);

  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [weekAnchor, setWeekAnchor] = useState(today);
  const [selectedTowns, setSelectedTowns] = useState<string[]>([]);
  const [view, setView] = useState<ViewMode>("split");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const datesWithEvents = useMemo(() => new Set(allEvents.map((e) => e.date)), [allEvents]);

  const selectedDateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "it-IT", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(dateFromISO(selectedDate)),
    [selectedDate, lang]
  );

  const dayEvents = useMemo(() => {
    let list = allEvents.filter((e) => e.date === selectedDate);
    if (selectedTowns.length > 0) list = list.filter((e) => selectedTowns.includes(e.town));
    return list;
  }, [allEvents, selectedDate, selectedTowns]);

  const layoutClass = ["layout", view === "list" ? "list-only" : "", view === "map" ? "map-only" : ""]
    .filter(Boolean)
    .join(" ");

  const dateHeading = `${formatDate(dateFromISO(selectedDate), lang)} · ${eventsCountLabel(dayEvents.length, lang)}`;

  const handleDatePick = (value: string) => {
    if (!value) return;
    setSelectedDate(value);
    const [y, m, d] = value.split("-").map(Number);
    setWeekAnchor(new Date(y, m - 1, d));
  };

  return (
    <div className="app">
      <AppHeader email={email} onEmailChange={handleEmailChange} />

      <DateRibbon
        weekAnchor={weekAnchor}
        setWeekAnchor={setWeekAnchor}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        todayISO={todayISO}
        datesWithEvents={datesWithEvents}
      />

      <Filters
        selectedTowns={selectedTowns}
        setSelectedTowns={setSelectedTowns}
        selectedDateLabel={selectedDateLabel}
        selectedDate={selectedDate}
        onDatePick={handleDatePick}
        dateHeading={dateHeading}
      />

      <div className={layoutClass}>
        <div className="map-pane">
          <div id="map">
            <EventMap events={dayEvents} selectedId={selectedId} onSelect={setSelectedId} />
          </div>
        </div>
        <EventList
          events={dayEvents}
          selectedId={selectedId}
          onSelect={setSelectedId}
          canEdit={!!email}
          canDelete={isAdmin}
          onCoverSaved={() => router.refresh()}
          onDescSaved={() => router.refresh()}
          onDeleted={() => router.refresh()}
        />
      </div>
    </div>
  );
}
