"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { EventItem, CATEGORIES, CATEGORIES_EN, TOWN_CREST, translateTime } from "@/data/config";
import EditDescForm from "@/components/EditDescForm";
import { useLang } from "@/components/LanguageProvider";
import { DOW_FULL, MONTHS, eventsCountLabel } from "@/lib/i18n";

// Pulls in the Vercel Blob client-upload bundle, only needed once someone
// actually opens the form — not worth it in every visitor's initial load.
const AddCoverForm = dynamic(() => import("@/components/AddCoverForm"), { ssr: false });

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

function dateFromISO(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function formatDate(d: Date, lang: "it" | "en") {
  if (lang === "en") {
    return `${DOW_FULL.en[d.getDay()]}, ${MONTHS.en[d.getMonth()]} ${d.getDate()}`;
  }
  return `${DOW_FULL.it[d.getDay()]} ${d.getDate()} ${MONTHS.it[d.getMonth()]}`;
}

const DOMAIN_RE = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;

function SourceLine({ src, label }: { src: string; label: string }) {
  if (DOMAIN_RE.test(src.trim())) {
    const href = src.trim().startsWith("http") ? src.trim() : `https://${src.trim()}`;
    return (
      <>
        {label}{" "}
        <a href={href} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
          {src}
        </a>
      </>
    );
  }
  return <>{label} {src}</>;
}

export default function EventList({
  selectedDate,
  events,
  selectedId,
  onSelect,
  canEdit,
  canDelete,
  onCoverSaved,
  onDescSaved,
  onDeleted,
}: {
  selectedDate: string;
  events: EventItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
  onCoverSaved: () => void;
  onDescSaved: () => void;
  onDeleted: () => void;
}) {
  const { lang, t } = useLang();
  const [coverTarget, setCoverTarget] = useState<EventItem | null>(null);
  const [descTarget, setDescTarget] = useState<EventItem | null>(null);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<Set<string>>(new Set());
  const d = dateFromISO(selectedDate);
  const sorted = [...events].sort((a, b) => {
    if (a.cat === "market" && b.cat !== "market") return 1;
    if (a.cat !== "market" && b.cat === "market") return -1;
    return a.time.localeCompare(b.time);
  });

  const handleDelete = async (e: EventItem) => {
    if (!window.confirm(t("confirmDeleteEvent"))) return;
    setDeleting((prev) => new Set(prev).add(e.id));
    try {
      const res = await fetch("/api/events/hide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: e.date, town: e.town, title: e.title }),
      });
      if (res.ok) onDeleted();
    } finally {
      setDeleting((prev) => {
        const next = new Set(prev);
        next.delete(e.id);
        return next;
      });
    }
  };

  return (
    <div className="list-col">
      <div className="date-heading">
        {formatDate(d, lang)} · {eventsCountLabel(sorted.length, lang)}
      </div>

      {sorted.length === 0 && (
        <div className="empty-state">
          <div className="glyph">〜</div>
          <p>
            {t("emptyStateLine1")}
            <br />
            {t("emptyStateLine2")}
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
                canEdit ? (
                  <button
                    type="button"
                    className="event-cover-btn"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setCoverTarget(e);
                    }}
                    aria-label={t("ariaChangeCover")}
                  >
                    <img
                      src={e.image}
                      alt=""
                      className="event-cover"
                      loading="lazy"
                      onError={() => {
                        setBrokenImages((prev) => new Set(prev).add(e.id));
                      }}
                    />
                    <span className="event-cover-edit-overlay">{t("editLink")}</span>
                  </button>
                ) : (
                  <img
                    src={e.image}
                    alt=""
                    className="event-cover"
                    loading="lazy"
                    onError={() => {
                      setBrokenImages((prev) => new Set(prev).add(e.id));
                    }}
                  />
                )
              ) : canEdit ? (
                <button
                  type="button"
                  className="event-cover-placeholder clickable"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setCoverTarget(e);
                  }}
                  aria-label={t("ariaAddCover")}
                >
                  <CoverPlaceholder town={e.town} />
                  <span className="event-cover-add-label">{t("addCoverLabel")}</span>
                </button>
              ) : (
                <div className="event-cover-placeholder" aria-hidden="true">
                  <CoverPlaceholder town={e.town} />
                </div>
              )}
              <div className={`event-cat event-cat-mobile cat-${e.cat}`}>
                {lang === "en" ? CATEGORIES_EN[e.cat] : CATEGORIES[e.cat]}
              </div>
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
                        {lang === "en" ? e.titleEn ?? e.title : e.title}
                        <LinkArrowIcon />
                      </a>
                    ) : lang === "en" ? (
                      e.titleEn ?? e.title
                    ) : (
                      e.title
                    )}
                  </p>
                  <div className="event-meta">{e.town} · {translateTime(e.time, lang)}</div>
                </div>
                <div className={`event-cat event-cat-desktop cat-${e.cat}`}>
                  {lang === "en" ? CATEGORIES_EN[e.cat] : CATEGORIES[e.cat]}
                </div>
              </div>
              <div className="event-desc">
                {lang === "en" ? e.descEn ?? e.desc : e.desc}
                {canEdit && (
                  <>
                    <button
                      type="button"
                      className="event-edit-link"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setDescTarget(e);
                      }}
                    >
                      {t("editLink")}
                    </button>
                    {canDelete && (
                      <button
                        type="button"
                        className="event-edit-link event-delete-link"
                        disabled={deleting.has(e.id)}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          handleDelete(e);
                        }}
                      >
                        {t("deleteLink")}
                      </button>
                    )}
                  </>
                )}
              </div>
              {!e.url && e.src && <div className="event-src"><SourceLine src={e.src} label={t("sourceLabel")} /></div>}
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
