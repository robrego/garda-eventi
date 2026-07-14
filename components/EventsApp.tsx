"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import DateRibbon from "@/components/DateRibbon";
import Filters, { ViewMode } from "@/components/Filters";
import EventList from "@/components/EventList";
import { EventItem } from "@/data/config";
import AuthWidget from "@/components/AuthWidget";
import BrandMark from "@/components/BrandMark";
import ChevronDownIcon from "@/components/ChevronDownIcon";
import { useLang } from "@/components/LanguageProvider";
import Link from "next/link";

// Leaflet touches `window`, so the map must be client-only with SSR disabled.
const EventMap = dynamic(() => import("@/components/EventMap"), {
  ssr: false,
  loading: () => <div className="map-loading">Caricamento mappa…</div>,
});

function BurgerIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" width="20" height="20">
      <path d="M3 5.5h14M3 10h14M3 14.5h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

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
  const { lang, setLang, t } = useLang();
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
  const [email, setEmail] = useState<string | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        setEmail(d.email);
        setIsAdmin(!!d.isAdmin);
      })
      .catch(() => setEmail(null));
  }, []);

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

  const handleEmailChange = (newEmail: string | null) => {
    setEmail(newEmail);
    if (!newEmail) {
      setIsAdmin(false);
      return;
    }
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setIsAdmin(!!d.isAdmin))
      .catch(() => setIsAdmin(false));
  };

  const handleDatePick = (value: string) => {
    if (!value) return;
    setSelectedDate(value);
    const [y, m, d] = value.split("-").map(Number);
    setWeekAnchor(new Date(y, m - 1, d));
  };

  return (
    <div className="app">
      <header className="top">
        <BrandMark />
        <div className="header-actions">
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={t("ariaMenu")}
            aria-expanded={menuOpen}
          >
            <BurgerIcon />
          </button>
          {menuOpen && <div className="menu-scrim" onClick={() => setMenuOpen(false)} />}
          <div className={`header-menu${menuOpen ? " open" : ""}`}>
            <Link href="/info" className="auth-link">
              {t("usefulInfoNav")}
            </Link>

            <div className="lang-toggle">
              <button
                type="button"
                className={lang === "it" ? "active" : ""}
                onClick={() => setLang("it")}
                aria-label={t("ariaLangToggle")}
              >
                IT
              </button>
              <button
                type="button"
                className={lang === "en" ? "active" : ""}
                onClick={() => setLang("en")}
                aria-label={t("ariaLangToggle")}
              >
                EN
              </button>
            </div>
            <div className="lang-select">
              <button
                type="button"
                className="lang-select-btn"
                onClick={() => setLangMenuOpen((o) => !o)}
                aria-label={t("ariaLangToggle")}
                aria-expanded={langMenuOpen}
              >
                <span>{lang.toUpperCase()}</span>
                <ChevronDownIcon />
              </button>
              {langMenuOpen && (
                <>
                  <div className="menu-scrim" onClick={() => setLangMenuOpen(false)} />
                  <div className="lang-select-menu">
                    <button
                      type="button"
                      className={lang === "it" ? "active" : ""}
                      onClick={() => {
                        setLang("it");
                        setLangMenuOpen(false);
                      }}
                    >
                      Italiano
                    </button>
                    <button
                      type="button"
                      className={lang === "en" ? "active" : ""}
                      onClick={() => {
                        setLang("en");
                        setLangMenuOpen(false);
                      }}
                    >
                      English
                    </button>
                  </div>
                </>
              )}
            </div>

            <AuthWidget email={email} onEmailChange={handleEmailChange} />
          </div>
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

      <Filters
        selectedTowns={selectedTowns}
        setSelectedTowns={setSelectedTowns}
        view={view}
        setView={setView}
        selectedDateLabel={selectedDateLabel}
        selectedDate={selectedDate}
        onDatePick={handleDatePick}
      />

      <div className={layoutClass}>
        <div className="map-pane">
          <div id="map">
            <EventMap events={dayEvents} selectedId={selectedId} onSelect={setSelectedId} />
          </div>
        </div>
        <EventList
          selectedDate={selectedDate}
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
