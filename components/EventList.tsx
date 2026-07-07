"use client";

import { useState } from "react";
import { EventItem, CATEGORIES, TOWN_CREST } from "@/data/config";
import AddCoverForm from "@/components/AddCoverForm";
import EditDescForm from "@/components/EditDescForm";

function LinkArrowIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="event-name-link-icon"
    >
      <path d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CoverPlaceholder({ town }: { town: string }) {
  const crest = TOWN_CREST[town];
  if (crest) {
    return <img src={crest} alt="" className="event-cover-crest" loading="lazy" />;
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="event-cover-icon">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="9.5" r="1.6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
  canEdit,
  onCoverSaved,
  onDescSaved,
}: {
  selectedDate: string;
  events: EventItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  canEdit: boolean;
  onCoverSaved: () => void;
  onDescSaved: () => void;
}) {
  const [coverTarget, setCoverTarget] = useState<EventItem | null>(null);
  const [descTarget, setDescTarget] = useState<EventItem | null>(null);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
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
          <div className="event-card-body">
            <div className="event-cover-col">
              {e.image && !brokenImages.has(e.id) ? (
                <img
                  src={e.image}
                  alt=""
                  className="event-cover"
                  loading="lazy"
                  onError={() => {
                    setBrokenImages((prev) => new Set(prev).add(e.id));
                  }}
                />
              ) : canEdit ? (
                <button
                  type="button"
                  className="event-cover-placeholder clickable"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setCoverTarget(e);
                  }}
                  aria-label="Aggiungi una copertina per questo evento"
                >
                  <CoverPlaceholder town={e.town} />
                  <span className="event-cover-add-label">+ copertina</span>
                </button>
              ) : (
                <div className="event-cover-placeholder" aria-hidden="true">
                  <CoverPlaceholder town={e.town} />
                </div>
              )}
              <div className="event-cat event-cat-mobile">{CATEGORIES[e.cat]}</div>
            </div>
            <div className="event-main">
              <div className="event-top">
                <div>
                  <p className="event-name">
                    {e.url ? (
                      <a
                        href={e.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(ev) => ev.stopPropagation()}
                      >
                        {e.title}
                        <LinkArrowIcon />
                      </a>
                    ) : (
                      e.title
                    )}
                  </p>
                  <div className="event-meta">{e.town} · {e.time}</div>
                </div>
                <div className="event-cat event-cat-desktop">{CATEGORIES[e.cat]}</div>
              </div>
              <div className="event-desc">
                {e.desc}
                {canEdit && (
                  <button
                    type="button"
                    className="event-edit-link"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setDescTarget(e);
                    }}
                  >
                    Modifica
                  </button>
                )}
              </div>
              {!e.url && <div className="event-src"><SourceLine src={e.src} /></div>}
            </div>
          </div>
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

      {descTarget && (
        <EditDescForm
          event={descTarget}
          onClose={() => setDescTarget(null)}
          onSaved={() => {
            setDescTarget(null);
            onDescSaved();
          }}
        />
      )}
    </div>
  );
}
