"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { TOWNS, CATEGORIES, CATEGORIES_EN } from "@/data/config";
import { useLang } from "@/components/LanguageProvider";
import { uploadImage } from "@/lib/uploadImage";

export default function AddEventForm({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const { lang, t } = useLang();
  const [date, setDate] = useState("");
  const [town, setTown] = useState(TOWNS[0]);
  const [title, setTitle] = useState("");
  const [cat, setCat] = useState("cultura");
  const [time, setTime] = useState("");
  const [desc, setDesc] = useState("");
  const [src, setSrc] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [website, setWebsite] = useState(""); // honeypot: left empty by real users, hidden via CSS
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      const res = await fetch("/api/events/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, town, title, cat, time, desc, src, image, url, website }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("errorRetry"));
        setBusy(false);
        return;
      }
      setSubmitted(true);
      setBusy(false);
    } catch {
      setError(t("errorConnection"));
      setBusy(false);
    }
  };

  const categories = lang === "en" ? CATEGORIES_EN : CATEGORIES;

  if (submitted) {
    return createPortal(
      <div className="modal-backdrop" onClick={onSaved}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <h2>{t("addEventTitle")}</h2>
          <p className="modal-subtitle">{t("eventPendingNotice")}</p>
          <div className="modal-actions">
            <button type="button" className="modal-primary" onClick={onSaved}>
              {t("closeModal")}
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>{t("addEventTitle")}</h2>

        <label className="hp-field" aria-hidden="true">
          Sito web
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>

        <label className="form-field">
          {t("fieldDate")}
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>

        <label className="form-field">
          {t("fieldTown")}
          <select value={town} onChange={(e) => setTown(e.target.value)}>
            {[...TOWNS].sort((a, b) => a.localeCompare(b, "it")).map((tn) => (
              <option key={tn} value={tn}>{tn}</option>
            ))}
          </select>
        </label>

        <label className="form-field">
          {t("fieldTitle")}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            placeholder={t("placeholderEventName")}
          />
        </label>

        <label className="form-field">
          {t("fieldCategory")}
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            {Object.entries(categories).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </label>

        <label className="form-field">
          {t("fieldTime")}
          <input type="text" placeholder={t("placeholderTime")} value={time} onChange={(e) => setTime(e.target.value)} />
        </label>

        <label className="form-field">
          {t("fieldDescription")}
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} maxLength={500} rows={4} />
        </label>

        <label className="form-field">
          {t("fieldSource")}
          <input
            type="text"
            placeholder={t("placeholderSource")}
            value={src}
            onChange={(e) => setSrc(e.target.value)}
          />
        </label>

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
          {t("fieldImageUrlOptional")}
          <input
            type="url"
            placeholder="https://..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </label>

        {uploading && <p className="modal-subtitle">{t("uploading")}</p>}

        <label className="form-field">
          {t("fieldEventUrlOptional")}
          <input
            type="url"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="modal-primary" onClick={submit} disabled={busy || uploading || !date || !title}>
            {t("saveEvent")}
          </button>
          <button type="button" className="modal-close" onClick={onClose}>
            {t("authCancel")}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
