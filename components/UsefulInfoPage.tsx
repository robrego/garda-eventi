"use client";

import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import { BusIcon, FerryIcon } from "@/components/InfoIcons";
import { useLang } from "@/components/LanguageProvider";
import { USEFUL_LINKS } from "@/data/usefulLinks";

const ICONS = { bus: BusIcon, ferry: FerryIcon };

export default function UsefulInfoPage() {
  const { lang, setLang, t } = useLang();

  return (
    <div className="app">
      <header className="top">
        <BrandMark />
        <div className="lang-toggle">
          <button
            type="button"
            className={lang === "it" ? "active" : ""}
            onClick={() => setLang("it")}
            aria-label={t("ariaLangToggle")}
          >
            IT
          </button>
          <button
            type="button"
            className={lang === "en" ? "active" : ""}
            onClick={() => setLang("en")}
            aria-label={t("ariaLangToggle")}
          >
            EN
          </button>
        </div>
      </header>

      <Link href="/" className="info-back-link">
        {t("backToMap")}
      </Link>

      <h2 className="info-page-title">{t("usefulInfoTitle")}</h2>
      <p className="info-page-subtitle">{t("usefulInfoSubtitle")}</p>

      <div className="info-list">
        {USEFUL_LINKS.map((link) => {
          const Icon = ICONS[link.icon];
          return (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="info-card">
              <div className="info-card-icon" aria-hidden="true">
                <Icon />
              </div>
              <div className="info-card-body">
                <h3>{lang === "en" ? link.titleEn : link.title}</h3>
                <p>{lang === "en" ? link.descEn : link.desc}</p>
                <span className="info-card-link">{link.url.replace(/^https?:\/\//, "")}</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
