export type UsefulLinkIcon = "bus" | "ferry";

export type UsefulLink = {
  id: string;
  title: string;
  titleEn: string;
  desc: string;
  descEn: string;
  url: string;
  icon: UsefulLinkIcon;
};

// Hand-curated practical info (transport, services, tips) — not date-bound,
// so it lives outside the event model entirely. Add new entries here.
export const USEFUL_LINKS: UsefulLink[] = [
  {
    id: "tremosine-hello-bus",
    title: "Tremosine, trasporto a chiamata",
    titleEn: "Tremosine, on-demand transport",
    desc: "Trasporto a chiamata tra le frazioni di Tremosine sul Garda e Limone: si prenota dall'app fino a 30 minuti prima, 2€ a corsa. Attivo lun-sab 7:30-19:00 (4 luglio - 31 agosto 2026).",
    descEn: "On-demand transport between Tremosine sul Garda's villages and Limone: book via the app up to 30 minutes ahead, €2 per ride. Runs Mon-Sat 7:30 AM-7:00 PM (July 4 - August 31, 2026).",
    url: "https://hellobus.tremosinesulgarda.it/",
    icon: "bus",
  },
  {
    id: "alto-garda-bus-and-go",
    title: "Minibus a chiamata nell'Alto Garda trentino",
    titleEn: "On-demand minibus, Alto Garda (Trentino)",
    desc: "Minibus a chiamata integrato con la rete pubblica di Riva del Garda, Arco e Nago-Torbole: si prenota dall'app, arriva alla fermata più vicina. 2€ a corsa (gratis con Garda Guest Card), attivo 29 maggio - 31 dicembre, 9:00-13:00 e 14:00-1:00.",
    descEn: "On-demand minibus integrated with the public transport network in Riva del Garda, Arco and Nago-Torbole: book via the app, it meets you at the nearest stop. €2 per ride (free with a Garda Guest Card), running May 29 - Dec 31, 9:00 AM-1:00 PM and 2:00 PM-1:00 AM.",
    url: "https://www.gardatrentino.it/en/plan-your-trip/local-mobility/Bus-and-Go",
    icon: "bus",
  },
  {
    id: "navigazione-laghi-garda-timetables",
    title: "Traghetti e battelli",
    titleEn: "Ferries and hydrofoils",
    desc: "Pagina ufficiale di Navigazione Laghi con gli orari di battelli passeggeri (Desenzano-Peschiera-Riva) e traghetto auto Maderno-Torri del Benaco. Gli orari cambiano per stagione, controlla quello in vigore.",
    descEn: "Official Navigazione Laghi page with timetables for passenger hydrofoils (Desenzano-Peschiera-Riva) and the Maderno-Torri del Benaco car ferry. Schedules change by season, check the one currently in effect.",
    url: "https://www.navigazionelaghi.it/en/tickets-and-timetables-lake-garda/",
    icon: "ferry",
  },
  {
    id: "arriva-brescia-lake-garda-bus",
    title: "Autobus sponda bresciana",
    titleEn: "Buses, Lombardy shore",
    desc: "Linee da Brescia e Desenzano fino a Limone e Riva del Garda, con fermate a Salò, Gardone Riviera, Toscolano-Maderno e Gargnano. R-Link 202 ogni 30' nei feriali, R-Link 204 Desenzano-Salò ogni 30' tutti i giorni.",
    descEn: "Bus lines from Brescia and Desenzano up to Limone and Riva del Garda, stopping in Salò, Gardone Riviera, Toscolano-Maderno and Gargnano. R-Link 202 runs every 30 min on weekdays, R-Link 204 Desenzano-Salò every 30 min daily.",
    url: "https://brescia.arriva.it/en/garda-lake/",
    icon: "bus",
  },
  {
    id: "atv-verona-lake-garda-bus",
    title: "Autobus sponda veneta",
    titleEn: "Buses, Veneto shore",
    desc: "Linee da Verona e Peschiera fino a Malcesine e Riva del Garda, con fermate a Lazise, Bardolino, Garda, Torri del Benaco e Brenzone. Orari e frequenza variano per linea e stagione, controlla il sito ufficiale.",
    descEn: "Bus lines from Verona and Peschiera up to Malcesine and Riva del Garda, stopping in Lazise, Bardolino, Garda, Torri del Benaco and Brenzone. Timetables and frequency vary by line and season, check the official site.",
    url: "https://www.atv.verona.it/en/LineeLago",
    icon: "bus",
  },
  {
    id: "sirmione-shuttlebus",
    title: "Sirmione, navetta per il centro storico",
    titleEn: "Sirmione, shuttle to the historic center",
    desc: "Navetta tra i parcheggi di Colombare e il centro storico di Sirmione, utile per evitare il traffico estivo: 2€ a corsa, ogni 15-20 minuti, 10:00-00:40 (28 marzo - 27 settembre 2026).",
    descEn: "Shuttle between the Colombare parking areas and Sirmione's historic center, handy for avoiding summer traffic: €2 per ride, every 15-20 minutes, 10:00 AM-12:40 AM (March 28 - September 27, 2026).",
    url: "https://brescia.arriva.it/en/shuttlebus-sirmione/",
    icon: "bus",
  },
];
