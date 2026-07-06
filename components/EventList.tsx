"use client";

import { useState } from "react";
import { EventItem, CATEGORIES } from "@/data/config";
import AddCoverForm from "@/components/AddCoverForm";

const DOW_FULL = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
const MONTHS = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];

function dateFromISO(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function formatItalianDate(d: Date) {
  return `${DOW_FULL[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

const DOMAIN_RE = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;

function SourceLine({ src }: { src: string }) {
  if (DOMAIN_RE.test(src.trim())) {
    const href = src.trim().startsWith("http") ? src.trim() : `https://${src.trim()}`;
    return (
      <>
        Fonte:{" "}
        <a href={href} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
          {src}
        </a>
      </>
    );
  }
  return <>Fonte: {src}</>;
}

export default function EventList({
  selectedDate,
  events,
  selectedId,
  onSelect,
  canAddCover,
  onCoverSaved,
}: {
  selectedDate: string;
  events: EventItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  canAddCover: boolean;
  onCoverSaved: () => void;
}) {
  const [coverTarget, setCoverTarget] = useState<EventItem | null>(null);
  const d = dateFromISO(selectedDate);
  const sorted = [...events].sort((a, b) => {
    if (a.cat === "market" && b.cat !== "market") return 1;
    if (a.cat !== "market" && b.cat === "market") return -1;
    return a.time.localeCompare(b.time);
  });

  return (
    <div className="list-col">
      <div className="date-heading">
        {formatItalianDate(d)} · {sorted.length} event{sorted.length === 1 ? "o" : "i"}
      </div>

      {sorted.length === 0 && (
        <div className="empty-state">
          <div className="glyph">〜</div>
          <p>
            Nessun evento registrato per questo giorno.
            <br />
            Prova un&apos;altra data o rimuovi il filtro per città.
          </p>
        </div>
      )}

      {sorted.map((e) => (
        <div
          key={e.id}
          id={`card-${e.id}`}
          className={`event-card${selectedId === e.id ? " selected" : ""}`}
          role="button"
          tabIndex={0}
          aria-pressed={selectedId === e.id}
          onClick={() => onSelect(e.id)}
          onKeyDown={(ev) => {
            if (ev.key === "Enter" || ev.key === " ") {
              ev.preventDefault();
              onSelect(e.id);
            }
          }}
        >
          {e.image && (
            <img
              src={e.image}
              alt=""
              className="event-cover"
              loading="lazy"
              onError={(ev) => {
                (ev.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          {!e.image && canAddCover && (
            <button
              type="button"
              className="event-add-cover"
              onClick={(ev) => {
                ev.stopPropagation();
                setCoverTarget(e);
              }}
            >
              + Copertina
            </button>
          )}
          <div className="event-top">
            <div>
              <p className="event-name">{e.title}</p>
              <div className="event-meta">{e.town} · {e.time}</div>
            </div>
            <div className="event-cat">{CATEGORIES[e.cat]}</div>
          </div>
          <div className="event-desc">{e.desc}</div>
          <div className="event-src"><SourceLine src={e.src} /></div>
        </div>
      ))}

      {coverTarget && (
        <AddCoverForm
          event={coverTarget}
          onClose={() => setCoverTarget(null)}
          onSaved={() => {
            setCoverTarget(null);
            onCoverSaved();
          }}
        />
      )}
    </div>
  );
}
