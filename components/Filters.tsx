"use client";

import { AREA_ORDER, TOWN_AREAS, TOWNS } from "@/data/config";

export type ViewMode = "split" | "list" | "map";

export default function Filters({
  townFilter,
  setTownFilter,
  view,
  setView,
  selectedDateLabel,
  selectedDate,
  onDatePick,
}: {
  townFilter: string;
  setTownFilter: (t: string) => void;
  view: ViewMode;
  setView: (v: ViewMode) => void;
  selectedDateLabel: string;
  selectedDate: string;
  onDatePick: (value: string) => void;
}) {
  const townsByArea = AREA_ORDER.map((area) => ({
    area,
    towns: TOWNS.filter((town) => TOWN_AREAS[town] === area),
  }));

  return (
    <div className="filters">
      <div className="date-picker-wrap">
        <input
          type="date"
          className="date-picker-input"
          value={selectedDate}
          onChange={(e) => onDatePick(e.target.value)}
          aria-label="Scegli una data"
        />
        <span className="date-picker-label" aria-hidden="true">
          {selectedDateLabel}
        </span>
      </div>
      <select
        className="town-select"
        aria-label="Filtra per città"
        value={townFilter}
        onChange={(e) => setTownFilter(e.target.value)}
      >
        <option value="all">Tutte le città</option>
        {townsByArea.map(({ area, towns }) => (
          <optgroup key={area} label={area}>
            {towns.map((town) => (
              <option key={town} value={town}>
                {town}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      <div className="view-toggle">
        <button className={view === "split" ? "active" : ""} onClick={() => setView("split")}>
          Mappa + lista
        </button>
        <button className={view === "list" ? "active" : ""} onClick={() => setView("list")}>
          Lista
        </button>
        <button className={view === "map" ? "active" : ""} onClick={() => setView("map")}>
          Mappa
        </button>
      </div>
    </div>
  );
}
