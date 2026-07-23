"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RawEvent } from "@/data/getEvents";
import { HiddenEvent } from "@/lib/hiddenEvents";
import { ImageOverride } from "@/lib/imageOverrides";
import { DescOverride } from "@/lib/descOverrides";

type RevertType = "manual" | "hidden" | "image" | "desc";

function formatWhen(iso: string | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("it-IT", { dateStyle: "medium", timeStyle: "short" });
}

function sortByCreatedAtDesc<T extends { createdAt?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
}

export default function AdminDashboard({
  pending,
  manual,
  hidden,
  images,
  descs,
}: {
  pending: RawEvent[];
  manual: RawEvent[];
  hidden: HiddenEvent[];
  images: ImageOverride[];
  descs: DescOverride[];
}) {
  const router = useRouter();
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const revert = async (type: RevertType, target: { date: string; town: string; title: string }) => {
    const busy = `${type}|${target.date}|${target.town}|${target.title}`;
    setBusyKey(busy);
    try {
      const res = await fetch("/api/admin/revert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...target }),
      });
      if (res.ok) router.refresh();
    } finally {
      setBusyKey(null);
    }
  };

  const approve = async (target: { date: string; town: string; title: string }) => {
    const busy = `approve|${target.date}|${target.town}|${target.title}`;
    setBusyKey(busy);
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(target),
      });
      if (res.ok) router.refresh();
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="app admin-page">
      <h1>Moderazione</h1>
      <p className="admin-subtitle">
        Aggiunte, correzioni e cancellazioni fatte dagli utenti registrati. &quot;Annulla&quot; rimuove
        solo la modifica: l&apos;evento originale (se esisteva) torna visibile come prima.
      </p>

      <section className="admin-section">
        <h2>In attesa di approvazione ({pending.length})</h2>
        {pending.length === 0 && <p className="admin-empty">Nessuno.</p>}
        {sortByCreatedAtDesc(pending).map((p) => (
          <div className="admin-row admin-row-pending" key={`pending|${p.date}|${p.town}|${p.title}`}>
            <div className="admin-row-main">
              <strong>{p.title}</strong>
              <span>{p.town} · {p.date} · {p.cat} · {p.time}</span>
              <p className="admin-desc-preview">{p.desc}</p>
              <span className="admin-meta">proposto da {p.addedBy || "?"} · {formatWhen(p.createdAt)}</span>
            </div>
            <div className="admin-row-actions">
              <button
                type="button"
                className="admin-approve"
                disabled={busyKey === `approve|${p.date}|${p.town}|${p.title}`}
                onClick={() => approve(p)}
              >
                Approva
              </button>
              <button
                type="button"
                className="admin-reject"
                disabled={busyKey === `manual|${p.date}|${p.town}|${p.title}`}
                onClick={() => revert("manual", p)}
              >
                Rifiuta
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="admin-section">
        <h2>Eventi eliminati ({hidden.length})</h2>
        {hidden.length === 0 && <p className="admin-empty">Nessuno.</p>}
        {sortByCreatedAtDesc(hidden).map((h) => (
          <div className="admin-row" key={`hidden|${h.date}|${h.town}|${h.title}`}>
            <div className="admin-row-main">
              <strong>{h.title}</strong>
              <span>{h.town} · {h.date}</span>
              <span className="admin-meta">eliminato da {h.hiddenBy} · {formatWhen(h.createdAt)}</span>
            </div>
            <button
              type="button"
              className="admin-undo"
              disabled={busyKey === `hidden|${h.date}|${h.town}|${h.title}`}
              onClick={() => revert("hidden", h)}
            >
              Ripristina
            </button>
          </div>
        ))}
      </section>

      <section className="admin-section">
        <h2>Eventi aggiunti manualmente ({manual.length})</h2>
        {manual.length === 0 && <p className="admin-empty">Nessuno.</p>}
        {sortByCreatedAtDesc(manual).map((m) => (
          <div className="admin-row" key={`manual|${m.date}|${m.town}|${m.title}`}>
            <div className="admin-row-main">
              <strong>{m.title}</strong>
              <span>{m.town} · {m.date} · {m.cat}</span>
              <span className="admin-meta">aggiunto da {m.addedBy || "?"} · {formatWhen(m.createdAt)}</span>
            </div>
            <button
              type="button"
              className="admin-undo"
              disabled={busyKey === `manual|${m.date}|${m.town}|${m.title}`}
              onClick={() => revert("manual", m)}
            >
              Elimina
            </button>
          </div>
        ))}
      </section>

      <section className="admin-section">
        <h2>Copertine aggiunte ({images.length})</h2>
        {images.length === 0 && <p className="admin-empty">Nessuna.</p>}
        {sortByCreatedAtDesc(images).map((o) => (
          <div className="admin-row" key={`image|${o.date}|${o.town}|${o.title}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={o.image} alt="" className="admin-thumb" />
            <div className="admin-row-main">
              <strong>{o.title}</strong>
              <span>{o.town} · {o.date}</span>
              <span className="admin-meta">aggiunta da {o.addedBy} · {formatWhen(o.createdAt)}</span>
            </div>
            <button
              type="button"
              className="admin-undo"
              disabled={busyKey === `image|${o.date}|${o.town}|${o.title}`}
              onClick={() => revert("image", o)}
            >
              Rimuovi
            </button>
          </div>
        ))}
      </section>

      <section className="admin-section">
        <h2>Descrizioni corrette ({descs.length})</h2>
        {descs.length === 0 && <p className="admin-empty">Nessuna.</p>}
        {sortByCreatedAtDesc(descs).map((o) => (
          <div className="admin-row" key={`desc|${o.date}|${o.town}|${o.title}`}>
            <div className="admin-row-main">
              <strong>{o.title}</strong>
              <span>{o.town} · {o.date}</span>
              <p className="admin-desc-preview">{o.desc}</p>
              <span className="admin-meta">corretta da {o.addedBy} · {formatWhen(o.createdAt)}</span>
            </div>
            <button
              type="button"
              className="admin-undo"
              disabled={busyKey === `desc|${o.date}|${o.town}|${o.title}`}
              onClick={() => revert("desc", o)}
            >
              Rimuovi
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
