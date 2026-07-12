"use client";

import { useState } from "react";
import { EventItem } from "@/data/config";
import { useLang } from "@/components/LanguageProvider";
import { uploadImage } from "@/lib/uploadImage";

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
  const [image, setImage] = useState(event.image ?? "");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      setImage(await uploadImage(file));
    } catch {
      setError(t("errorUpload"));
    }
    setUploading(false);
  };

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
        <h2>{event.image ? t("changeCoverTitle") : t("addCoverTitle")}</h2>
        <p className="modal-subtitle">{event.title}</p>

        {image && <img src={image} alt="" className="cover-preview" />}

        <label className="form-field">
          {t("uploadImageLabel")}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>

        <p className="form-divider">{t("orDivider")}</p>

        <label className="form-field">
          {t("fieldImageUrl")}
          <input
            type="url"
            placeholder="https://..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </label>

        {uploading && <p className="modal-subtitle">{t("uploading")}</p>}
        {error && <p className="form-error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="modal-primary" onClick={submit} disabled={busy || uploading || !image}>
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
