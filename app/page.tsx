import type { Metadata } from "next";
import EventsApp from "@/components/EventsApp";
import { LanguageProvider } from "@/components/LanguageProvider";
import { getAllEvents } from "@/data/getEvents";
import { jsonLdScriptProps } from "@/lib/eventJsonLd";
import { SITE_URL } from "@/lib/siteUrl";

// The @vercel/blob SDK wraps its own fetch, opaque to Next's fetch cache,
// so a plain `revalidate` here wouldn't reliably pick up a fresh scrape.
// Traffic is low enough that rendering fresh every request is fine.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Lago di Garda e Dintorni",
  url: SITE_URL,
  description:
    "Eventi, sagre, mercati e concerti sul Lago di Garda, giorno per giorno, sulle sponde lombarda, veneta e trentina.",
  inLanguage: ["it", "en"],
};

export default async function Home() {
  const { events } = await getAllEvents();
  return (
    <LanguageProvider>
      <EventsApp events={events} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScriptProps(websiteJsonLd)} />
    </LanguageProvider>
  );
}
