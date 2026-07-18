"use client";

import { useState } from "react";
import { groupTownsByArea } from "@/data/config";
import { useLang } from "@/components/LanguageProvider";
import { townsSelectedLabel } from "@/lib/i18n";
import ChevronDownIcon from "@/components/ChevronDownIcon";

export type ViewMode = "split" | "list" | "map";

export default function Filters({
  selectedTowns,
  setSelectedTowns,
  selectedDateLabel,
  selectedDate,
  onDatePick,
  dateHeading,
}: {
  selectedTowns: string[];
  setSelectedTowns: (towns: string[]) => void;
  selectedDateLabel: string;
  selectedDate: string;
  onDatePick: (value: string) => void;
  dateHeading: string;
}) {
  const { lang, t } = useLang();
  const [townMenuOpen, setTownMenuOpen] = useState(false);
  const townsByArea = groupTownsByArea(lang);

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

      <div className="filters-date-heading">{dateHeading}</div>
    </div>
  );
}
