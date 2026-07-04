"use client";

import { TOWNS } from "@/data/config";

export type ViewMode = "split" | "list" | "map";

export default function Filters({
  townFilter,
  setTownFilter,
  view,
  setView,
}: {
  townFilter: string;
  setTownFilter: (t: string) => void;
  view: ViewMode;
  setView: (v: ViewMode) => void;
}) {
  return (
    <div className="filters">
      <button
        className={`filter-chip${townFilter === "all" ? " active" : ""}`}
        onClick={() => setTownFilter("all")}
      >
        Tutte
      </button>
      {TOWNS.map((town) => (
        <button
          key={town}
          className={`filter-chip${townFilter === town ? " active" : ""}`}
          onClick={() => setTownFilter(town)}
        >
          {town}
        </button>
      ))}

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
