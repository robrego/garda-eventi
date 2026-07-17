"use client";

import { useState } from "react";
import Link from "next/link";
import { Bus, CalendarDays, MapPin } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import BurgerIcon from "@/components/BurgerIcon";
import { translate, type Lang } from "@/lib/i18n";

// Same interactive header as AppHeader (3-line burger + dropdown on mobile,
// inline nav row on desktop, via the shared .header-actions/.menu-toggle/
// .header-menu CSS) so the static/SEO town pages look identical to the rest
// of the app. This is the only client-side piece of these otherwise static
// pages — the event list and JSON-LD below it stay server-rendered.
// `siblingHref` is this same page's URL in the other language — the
// language links are real navigations (server-rendered, fixed-locale
// routes), not the interactive app's localStorage-driven client toggle
// (see components/LanguageProvider.tsx). These pages are always "città"
// pages, so that nav link is always the active one.
export default function SeoPageHeader({
  lang,
  siblingHref,
  mapHref,
  townsIndexHref,
}: {
  lang: Lang;
  siblingHref: string;
  mapHref: string;
  townsIndexHref: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

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
          <Link href={townsIndexHref} className="auth-link header-menu-link active">
            <MapPin size={18} strokeWidth={1.75} />
            {translate("citiesNav", lang)}
          </Link>

          <span className="menu-divider" aria-hidden="true" />

          <div className="seo-lang-toggle">
            {lang === "it" ? <span className="active">IT</span> : <Link href={siblingHref}>IT</Link>}
            {lang === "en" ? <span className="active">EN</span> : <Link href={siblingHref}>EN</Link>}
          </div>
        </div>
      </div>
    </header>
  );
}
