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
  {
    id: "alto-garda-bus-and-go",
    title: "Bus&Go: minibus a chiamata nell'Alto Garda trentino",
    titleEn: "Bus&Go: on-demand minibus in the Alto Garda (Trentino)",
    desc: "Servizio di trasporto a chiamata integrato con la rete pubblica di Riva del Garda, Arco e Nago-Torbole: si prenota dall'app indicando partenza e arrivo, il minibus arriva alla fermata più vicina. 2€ a corsa (gratis con Garda Guest Card), attivo dal 29 maggio al 31 dicembre, 9:00-13:00 e 14:00-1:00.",
    descEn: "On-demand minibus service integrated with the public transport network in Riva del Garda, Arco and Nago-Torbole: book via the app with your pickup and destination, the minibus meets you at the nearest stop. €2 per ride (free with a Garda Guest Card), running May 29 - December 31, 9:00 AM-1:00 PM and 2:00 PM-1:00 AM.",
    url: "https://www.gardatrentino.it/en/plan-your-trip/local-mobility/Bus-and-Go",
  },
  {
    id: "navigazione-laghi-garda-timetables",
    title: "Orari traghetti e battelli sul Lago di Garda",
    titleEn: "Lake Garda ferry and hydrofoil timetables",
    desc: "Pagina ufficiale di Navigazione Laghi con gli orari aggiornati di battelli passeggeri (Desenzano-Peschiera-Riva) e del traghetto per auto Maderno-Torri del Benaco. Gli orari cambiano per stagione (primavera/estate), quindi conviene controllare quello in vigore.",
    descEn: "Official Navigazione Laghi page with up-to-date timetables for passenger hydrofoils (Desenzano-Peschiera-Riva) and the Maderno-Torri del Benaco car ferry. Schedules change by season (spring/summer), so check the one currently in effect.",
    url: "https://www.navigazionelaghi.it/en/tickets-and-timetables-lake-garda/",
  },
];
