import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { townFromSlug } from "@/lib/townSlugs";
import { getUpcomingTownEvents } from "@/lib/townPageData";
import { townMetaTitle, townMetaDescription } from "@/lib/i18n";
import TownPageBody from "@/components/TownPageBody";
import { SITE_URL } from "@/lib/siteUrl";

// Blob-backed manual/scraped events bypass Next's fetch cache — same
// rationale as app/page.tsx, so this can't be safely statically generated.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { town: string } }): Promise<Metadata> {
  const town = townFromSlug(params.town);
  if (!town) return {};

  const title = townMetaTitle(town, "en");
  const description = townMetaDescription(town, "en");
  const itPath = `/eventi/${params.town}`;
  const enPath = `/en/events/${params.town}`;

  return {
    title,
    description,
    alternates: {
      canonical: enPath,
      languages: { it: itPath, en: enPath, "x-default": itPath },
    },
    openGraph: { title, description, url: enPath, locale: "en_US", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function TownPageEn({ params }: { params: { town: string } }) {
  const town = townFromSlug(params.town);
  if (!town) notFound();

  const events = await getUpcomingTownEvents(town);

  return (
    <TownPageBody
      town={town}
      lang="en"
      events={events}
      siblingHref={`/eventi/${params.town}`}
      indexHref="/en/events"
      mapHref="/"
      pageUrl={`${SITE_URL}/en/events/${params.town}`}
    />
  );
}
