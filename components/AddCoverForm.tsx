"use client";

import { useState } from "react";
import { EventItem } from "@/data/config";
import { useLang } from "@/components/LanguageProvider";

export default function AddCoverForm({
  event,
  onClose,
  onSaved,
}: {
  event: EventItem;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useLang();
  const [image, setImage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/events/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: event.date, town: event.town, title: event.title, image }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("errorRetry"));
        setBusy(false);
        return;
      }
      onSaved();
    } catch {
      setError(t("errorConnection"));
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>{t("addCoverTitle")}</h2>
        <p className="modal-subtitle">{event.title}</p>

        <label className="form-field">
          {t("fieldImageUrl")}
          <input
            type="url"
            placeholder="https://..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
            autoFocus
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="modal-primary" onClick={submit} disabled={busy || !image}>
            {t("saveCover")}
          </button>
          <button type="button" className="modal-close" onClick={onClose}>
            {t("authCancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
