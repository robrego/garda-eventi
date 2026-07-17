"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthWidget from "@/components/AuthWidget";
import BrandMark from "@/components/BrandMark";
import ChevronDownIcon from "@/components/ChevronDownIcon";
import { useLang } from "@/components/LanguageProvider";

function BurgerIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" width="20" height="20">
      <path d="M3 5.5h14M3 10h14M3 14.5h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function AppHeader({
  email,
  onEmailChange,
}: {
  email: string | null | undefined;
  onEmailChange: (email: string | null) => void;
}) {
  const { lang, setLang, t } = useLang();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  return (
    <header className="top">
      <BrandMark />
      <div className="header-actions">
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={t("ariaMenu")}
          aria-expanded={menuOpen}
        >
          <BurgerIcon />
        </button>
        {menuOpen && <div className="menu-scrim" onClick={() => setMenuOpen(false)} />}
        <div className={`header-menu${menuOpen ? " open" : ""}`}>
          <Link href="/" className={`auth-link${pathname === "/" ? " active" : ""}`}>
            {t("eventsNav")}
          </Link>
          <Link href="/info" className={`auth-link${pathname === "/info" ? " active" : ""}`}>
            {t("usefulInfoNav")}
          </Link>
          <Link
            href={lang === "en" ? "/en/events" : "/eventi"}
            className={`auth-link${pathname.startsWith("/eventi") || pathname.startsWith("/en/events") ? " active" : ""}`}
          >
            {t("citiesNav")}
          </Link>

          <span className="menu-divider" aria-hidden="true" />

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
          <div className="lang-select">
            <button
              type="button"
              className="lang-select-btn"
              onClick={() => setLangMenuOpen((o) => !o)}
              aria-label={t("ariaLangToggle")}
              aria-expanded={langMenuOpen}
            >
              <span>{lang.toUpperCase()}</span>
              <ChevronDownIcon />
            </button>
            {langMenuOpen && (
              <>
                <div className="menu-scrim" onClick={() => setLangMenuOpen(false)} />
                <div className="lang-select-menu">
                  <button
                    type="button"
                    className={lang === "it" ? "active" : ""}
                    onClick={() => {
                      setLang("it");
                      setLangMenuOpen(false);
                    }}
                  >
                    Italiano
                  </button>
                  <button
                    type="button"
                    className={lang === "en" ? "active" : ""}
                    onClick={() => {
                      setLang("en");
                      setLangMenuOpen(false);
                    }}
                  >
                    English
                  </button>
                </div>
              </>
            )}
          </div>

          <AuthWidget email={email} onEmailChange={onEmailChange} />
        </div>
      </div>
    </header>
  );
}
