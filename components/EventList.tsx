"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { EventItem, CATEGORIES, CATEGORIES_EN, translateTime } from "@/data/config";
import EditDescForm from "@/components/EditDescForm";
import { LinkArrowIcon, CoverPlaceholder, dateFromISO, formatDate } from "@/components/EventDisplay";
import { useLang } from "@/components/LanguageProvider";
import { eventsCountLabel } from "@/lib/i18n";

// Pulls in the Vercel Blob client-upload bundle, only needed once someone
// actually opens the form — not worth it in every visitor's initial load.
const AddCoverForm = dynamic(() => import("@/components/AddCoverForm"), { ssr: false });

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
    if (!!a.url !== !!b.url) return a.url ? -1 : 1;
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
                      alt={lang === "en" ? e.titleEn ?? e.title : e.title}
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
                    alt={lang === "en" ? e.titleEn ?? e.title : e.title}
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
