"use client";

import { useState } from "react";
import { AREA_ORDER, AREA_LABELS_EN, TOWN_AREAS, TOWNS } from "@/data/config";
import { useLang } from "@/components/LanguageProvider";
import { townsSelectedLabel } from "@/lib/i18n";

export type ViewMode = "split" | "list" | "map";

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="chevron-icon">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Filters({
  selectedTowns,
  setSelectedTowns,
  view,
  setView,
  selectedDateLabel,
  selectedDate,
  onDatePick,
}: {
  selectedTowns: string[];
  setSelectedTowns: (towns: string[]) => void;
  view: ViewMode;
  setView: (v: ViewMode) => void;
  selectedDateLabel: string;
  selectedDate: string;
  onDatePick: (value: string) => void;
}) {
  const { lang, t } = useLang();
  const [viewMenuOpen, setViewMenuOpen] = useState(false);
  const [townMenuOpen, setTownMenuOpen] = useState(false);
  const townsByArea = AREA_ORDER.map((area) => ({
    area: lang === "en" ? AREA_LABELS_EN[area] : area,
    towns: TOWNS.filter((town) => TOWN_AREAS[town] === area).sort((a, b) => a.localeCompare(b, "it")),
  }));

  const viewLabel = view === "split" ? t("viewSplit") : view === "list" ? t("viewList") : t("viewMap");
  const townLabel =
    selectedTowns.length === 0
      ? t("allTowns")
      : selectedTowns.length === 1
        ? selectedTowns[0]
        : townsSelectedLabel(selectedTowns.length, lang);

  const toggleTown = (town: string) => {
    setSelectedTowns(
      selectedTowns.includes(town) ? selectedTowns.filter((tn) => tn !== town) : [...selectedTowns, town]
    );
  };

  return (
    <div className="filters">
      <div className="date-picker-wrap">
        <input
          type="date"
          className="date-picker-input"
          value={selectedDate}
          onChange={(e) => onDatePick(e.target.value)}
          aria-label={t("ariaChooseDate")}
        />
        <span className="date-picker-label" aria-hidden="true">
          {selectedDateLabel}
          <ChevronDownIcon />
        </span>
      </div>
      <div className="town-filter">
        <button
          type="button"
          className="town-select"
          onClick={() => setTownMenuOpen((o) => !o)}
          aria-label={t("ariaFilterTown")}
          aria-expanded={townMenuOpen}
        >
          <span>{townLabel}</span>
          <ChevronDownIcon />
        </button>
        {townMenuOpen && (
          <>
            <div className="menu-scrim" onClick={() => setTownMenuOpen(false)} />
            <div className="town-filter-menu">
              <label className="town-filter-option town-filter-all">
                <input
                  type="checkbox"
                  checked={selectedTowns.length === 0}
                  onChange={() => setSelectedTowns([])}
                />
                {t("allTowns")}
              </label>
              <div className="town-filter-list">
                {townsByArea.map(({ area, towns }) => (
                  <div key={area} className="town-filter-group">
                    <div className="town-filter-area">{area}</div>
                    {towns.map((town) => (
                      <label key={town} className="town-filter-option">
                        <input
                          type="checkbox"
                          checked={selectedTowns.includes(town)}
                          onChange={() => toggleTown(town)}
                        />
                        {town}
                      </label>
                    ))}
                  </div>
                ))}
              </div>
              <button type="button" className="town-filter-done" onClick={() => setTownMenuOpen(false)}>
                {t("doneButton")}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="view-select">
        <button
          type="button"
          className="view-select-btn"
          onClick={() => setViewMenuOpen((o) => !o)}
          aria-label={t("ariaViewSelect")}
          aria-expanded={viewMenuOpen}
        >
          <span>{viewLabel}</span>
          <ChevronDownIcon />
        </button>
        {viewMenuOpen && (
          <>
            <div className="menu-scrim" onClick={() => setViewMenuOpen(false)} />
            <div className="view-select-menu">
              <button
                type="button"
                className={view === "split" ? "active" : ""}
                onClick={() => {
                  setView("split");
                  setViewMenuOpen(false);
                }}
              >
                {t("viewSplit")}
              </button>
              <button
                type="button"
                className={view === "list" ? "active" : ""}
                onClick={() => {
                  setView("list");
                  setViewMenuOpen(false);
                }}
              >
                {t("viewList")}
              </button>
              <button
                type="button"
                className={view === "map" ? "active" : ""}
                onClick={() => {
                  setView("map");
                  setViewMenuOpen(false);
                }}
              >
                {t("viewMap")}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="view-toggle">
        <button className={view === "split" ? "active" : ""} onClick={() => setView("split")}>
          {t("viewSplit")}
        </button>
        <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>
          {t("viewList")}
        </button>
        <button className={view === "map" ? "active" : ""} onClick={() => setView("map")}>
          {t("viewMap")}
        </button>
      </div>
    </div>
  );
}
