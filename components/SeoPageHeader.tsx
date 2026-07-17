import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import type { Lang } from "@/lib/i18n";

// Minimal header for the static/SEO town pages: no auth widget, no burger
// menu, no client-side language toggle. `siblingHref` is this same page's
// URL in the other language — the language links are real navigations
// (server-rendered, fixed-locale routes), not the interactive app's
// localStorage-driven client toggle (see components/LanguageProvider.tsx).
export default function SeoPageHeader({ lang, siblingHref }: { lang: Lang; siblingHref: string }) {
  return (
    <header className="top">
      <Link href="/" className="seo-brand-link">
        <BrandMark as="p" />
      </Link>
      <div className="seo-lang-toggle">
        {lang === "it" ? <span className="active">IT</span> : <Link href={siblingHref}>IT</Link>}
        {lang === "en" ? <span className="active">EN</span> : <Link href={siblingHref}>EN</Link>}
      </div>
    </header>
  );
}
