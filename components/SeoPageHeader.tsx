"use client";

import { useState } from "react";
import Link from "next/link";
import { Bus, CalendarDays } from "lucide-react";
import AuthWidget from "@/components/AuthWidget";
import BrandMark from "@/components/BrandMark";
import BurgerIcon from "@/components/BurgerIcon";
import ChevronDownIcon from "@/components/ChevronDownIcon";
import { translate, type Lang } from "@/lib/i18n";
import { useAuthUser } from "@/lib/useAuthUser";

// Same interactive header as AppHeader (3-line burger + dropdown on mobile,
// inline nav row on desktop, via the shared .header-actions/.menu-toggle/
// .header-menu CSS) so the static/SEO town pages look identical to the rest
// of the app, including the IT/EN switcher and the login/+Evento widget.
// This is the only client-side piece of these otherwise static pages — the
// event list and JSON-LD below it stay server-rendered.
// `siblingHref` is this same page's URL in the other language — the
// language links are real navigations (server-rendered, fixed-locale
// routes), not the interactive app's localStorage-driven client toggle
// (see components/LanguageProvider.tsx), so IT/EN render as <Link>s here
// instead of state-setting buttons, just styled identically. No "Città"
// nav link here (or in AppHeader) — these town pages exist for SEO, not
// as a user-facing nav destination; in-page back-links handle navigation.
export default function SeoPageHeader({
  lang,
  siblingHref,
  mapHref,
}: {
  lang: Lang;
  siblingHref: string;
  mapHref: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { email, handleEmailChange } = useAuthUser();

  return (
    <header className="top">
      <Link href="/" className="seo-brand-link">
        <BrandMark as="p" />
      </Link>
      <div className="header-actions">
        <Link href="/info" className="transport-shortcut" aria-label={translate("usefulInfoNav", lang)}>
          <Bus size={20} strokeWidth={1.75} />
        </Link>
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-label={translate("ariaMenu", lang)}
        >
          <BurgerIcon />
        </button>
        {menuOpen && <div className="menu-scrim" onClick={() => setMenuOpen(false)} />}
        <div className={`header-menu${menuOpen ? " open" : ""}`}>
          <Link href={mapHref} className="auth-link header-menu-link">
            <CalendarDays size={18} strokeWidth={1.75} />
            {translate("eventsNav", lang)}
          </Link>
          <Link href="/info" className="auth-link header-menu-link">
            <Bus size={18} strokeWidth={1.75} />
            {translate("usefulInfoNav", lang)}
          </Link>

          <span className="menu-divider" aria-hidden="true" />

          <div className="lang-toggle">
            {lang === "it" ? (
              <span className="active">IT</span>
            ) : (
              <Link href={siblingHref}>IT</Link>
            )}
            {lang === "en" ? (
              <span className="active">EN</span>
            ) : (
              <Link href={siblingHref}>EN</Link>
            )}
          </div>
          <div className="lang-select">
            <button
              type="button"
              className="lang-select-btn"
              onClick={() => setLangMenuOpen((o) => !o)}
              aria-label={translate("ariaLangToggle", lang)}
              aria-expanded={langMenuOpen}
            >
              <span>{lang.toUpperCase()}</span>
              <ChevronDownIcon />
            </button>
            {langMenuOpen && (
              <>
                <div className="menu-scrim" onClick={() => setLangMenuOpen(false)} />
                <div className="lang-select-menu">
                  {lang === "it" ? (
                    <button type="button" className="active">
                      Italiano
                    </button>
                  ) : (
                    <Link href={siblingHref}>Italiano</Link>
                  )}
                  {lang === "en" ? (
                    <button type="button" className="active">
                      English
                    </button>
                  ) : (
                    <Link href={siblingHref}>English</Link>
                  )}
                </div>
              </>
            )}
          </div>

          <AuthWidget email={email} onEmailChange={handleEmailChange} />
        </div>
      </div>
    </header>
  );
}
