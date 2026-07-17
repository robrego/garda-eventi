"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bus, CalendarDays } from "lucide-react";
import AuthWidget from "@/components/AuthWidget";
import BrandMark from "@/components/BrandMark";
import BurgerIcon from "@/components/BurgerIcon";
import ChevronDownIcon from "@/components/ChevronDownIcon";
import { useLang } from "@/components/LanguageProvider";

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
        <Link
          href="/info"
          className={`transport-shortcut${pathname === "/info" ? " active" : ""}`}
          aria-label={t("usefulInfoNav")}
        >
          <Bus size={20} strokeWidth={1.75} />
        </Link>
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-label={t("ariaMenu")}
        >
          <BurgerIcon />
        </button>
        {menuOpen && <div className="menu-scrim" onClick={() => setMenuOpen(false)} />}
        <div className={`header-menu${menuOpen ? " open" : ""}`}>
          <Link href="/" className={`auth-link header-menu-link${pathname === "/" ? " active" : ""}`}>
            <CalendarDays size={18} strokeWidth={1.75} />
            {t("eventsNav")}
          </Link>
          <Link href="/info" className={`auth-link header-menu-link${pathname === "/info" ? " active" : ""}`}>
            <Bus size={18} strokeWidth={1.75} />
            {t("usefulInfoNav")}
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
