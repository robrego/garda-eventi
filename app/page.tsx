import EventsApp from "@/components/EventsApp";
import { LanguageProvider } from "@/components/LanguageProvider";
import { getAllEvents } from "@/data/getEvents";

// The @vercel/blob SDK wraps its own fetch, opaque to Next's fetch cache,
// so a plain `revalidate` here wouldn't reliably pick up a fresh scrape.
// Traffic is low enough that rendering fresh every request is fine.
export const dynamic = "force-dynamic";

export default async function Home() {
  const { events } = await getAllEvents();
  return (
    <LanguageProvider>
      <EventsApp events={events} />
    </LanguageProvider>
  );
}
