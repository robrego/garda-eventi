import Link from "next/link";
import { Bus, CalendarDays, MapPin } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import { translate, type Lang } from "@/lib/i18n";

// Minimal header for the static/SEO town pages: no auth widget, no burger
// menu, no client-side language toggle. `siblingHref` is this same page's
// URL in the other language — the language links are real navigations
// (server-rendered, fixed-locale routes), not the interactive app's
// localStorage-driven client toggle (see components/LanguageProvider.tsx).
// The Eventi/Trasporti/Città nav mirrors AppHeader's, always shown inline
// (no burger collapse) since this header ships no client JS — these pages
// are always "città" pages, so that link is always the active one.
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
  return (
    <header className="top">
      <Link href="/" className="seo-brand-link">
        <BrandMark as="p" />
      </Link>
      <div className="seo-header-actions">
        <nav className="seo-nav">
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
        </nav>
        <div className="seo-lang-toggle">
          {lang === "it" ? <span className="active">IT</span> : <Link href={siblingHref}>IT</Link>}
          {lang === "en" ? <span className="active">EN</span> : <Link href={siblingHref}>EN</Link>}
        </div>
      </div>
    </header>
  );
}
