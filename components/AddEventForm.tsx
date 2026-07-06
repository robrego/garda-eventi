"use client";

import { useState } from "react";
import { TOWNS, CATEGORIES } from "@/data/config";

export default function AddEventForm({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const [date, setDate] = useState("");
  const [town, setTown] = useState(TOWNS[0]);
  const [title, setTitle] = useState("");
  const [cat, setCat] = useState("cultura");
  const [time, setTime] = useState("");
  const [desc, setDesc] = useState("");
  const [src, setSrc] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/events/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, town, title, cat, time, desc, src, image }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Errore, riprova");
        setBusy(false);
        return;
      }
      onSaved();
    } catch {
      setError("Errore di connessione");
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>Aggiungi un evento</h2>

        <label className="form-field">
          Data
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>

        <label className="form-field">
          Città
          <select value={town} onChange={(e) => setTown(e.target.value)}>
            {TOWNS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>

        <label className="form-field">
          Titolo
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            placeholder="Nome dell'evento"
          />
        </label>

        <label className="form-field">
          Categoria
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            {Object.entries(CATEGORIES).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </label>

        <label className="form-field">
          Orario
          <input type="text" placeholder="es. 21:00" value={time} onChange={(e) => setTime(e.target.value)} />
        </label>

        <label className="form-field">
          Descrizione
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} maxLength={500} rows={4} />
        </label>

        <label className="form-field">
          Fonte
          <input
            type="text"
            placeholder="es. sito del comune"
            value={src}
            onChange={(e) => setSrc(e.target.value)}
          />
        </label>

        <label className="form-field">
          Immagine (URL, opzionale)
          <input
            type="url"
            placeholder="https://..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="modal-primary" onClick={submit} disabled={busy || !date || !title}>
            Salva evento
          </button>
          <button type="button" className="modal-close" onClick={onClose}>
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
}
