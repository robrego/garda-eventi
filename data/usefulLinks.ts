export type UsefulLink = {
  id: string;
  title: string;
  titleEn: string;
  desc: string;
  descEn: string;
  url: string;
};

// Hand-curated practical info (transport, services, tips) — not date-bound,
// so it lives outside the event model entirely. Add new entries here.
export const USEFUL_LINKS: UsefulLink[] = [
  {
    id: "tremosine-hello-bus",
    title: "HelloBus: trasporto pubblico a chiamata a Tremosine",
    titleEn: "HelloBus: on-demand public transport in Tremosine",
    desc: "Servizio a chiamata per muoversi tra le frazioni di Tremosine sul Garda e raggiungere Limone senza auto: si prenota dall'app fino a 30 minuti prima, 2€ a corsa. Attivo lun-sab 7:30-19:00 (4 luglio - 31 agosto 2026).",
    descEn: "On-demand service to get around Tremosine sul Garda's villages and reach Limone without a car: book via the app up to 30 minutes ahead, €2 per ride. Runs Mon-Sat 7:30 AM-7:00 PM (July 4 - August 31, 2026).",
    url: "https://hellobus.tremosinesulgarda.it/",
  },
];
