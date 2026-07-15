export type UsefulLinkIcon = "bus" | "ferry" | "cablecar" | "bike";

export type UsefulLink = {
  id: string;
  title: string;
  titleEn: string;
  area: string;
  areaEn: string;
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
    area: "Tremosine sul Garda",
    areaEn: "Tremosine sul Garda",
    desc: "Prenota dall'app fino a 30' prima, 2€ a corsa. Lun-sab 7:30-19:00 (4 lug - 31 ago 2026).",
    descEn: "Book via the app up to 30 min ahead, €2 per ride. Mon-Sat 7:30 AM-7:00 PM (Jul 4 - Aug 31, 2026).",
    url: "https://hellobus.tremosinesulgarda.it/",
    icon: "bus",
  },
  {
    id: "alto-garda-bus-and-go",
    title: "Minibus a chiamata nell'Alto Garda trentino",
    titleEn: "On-demand minibus, Alto Garda (Trentino)",
    area: "Alto Garda trentino",
    areaEn: "Alto Garda (Trentino)",
    desc: "Minibus a chiamata su rete pubblica: prenota dall'app, 2€ a corsa (gratis con Garda Guest Card). 29 mag - 31 dic, 9:00-13:00 e 14:00-1:00.",
    descEn: "On-demand minibus on the public network: book via the app, €2 per ride (free with Garda Guest Card). May 29 - Dec 31, 9 AM-1 PM and 2 PM-1 AM.",
    url: "https://www.gardatrentino.it/en/plan-your-trip/local-mobility/Bus-and-Go",
    icon: "bus",
  },
  {
    id: "navigazione-laghi-garda-timetables",
    title: "Traghetti e battelli",
    titleEn: "Ferries and hydrofoils",
    area: "Tutto il lago",
    areaEn: "Whole lake",
    desc: "Orari battelli (Desenzano-Peschiera-Riva) e traghetto auto Maderno-Torri del Benaco. Cambiano per stagione.",
    descEn: "Timetables for hydrofoils (Desenzano-Peschiera-Riva) and the Maderno-Torri del Benaco car ferry. Change by season.",
    url: "https://www.navigazionelaghi.it/en/tickets-and-timetables-lake-garda/",
    icon: "ferry",
  },
  {
    id: "arriva-brescia-lake-garda-bus",
    title: "Autobus sponda bresciana",
    titleEn: "Buses, Lombardy shore",
    area: "Sponda bresciana",
    areaEn: "Lombardy shore",
    desc: "Da Brescia/Desenzano a Limone e Riva del Garda, fermate lungo tutta la sponda. R-Link 202 e 204 ogni 30'.",
    descEn: "From Brescia/Desenzano to Limone and Riva del Garda, stops all along the shore. R-Link 202 and 204 every 30 min.",
    url: "https://brescia.arriva.it/en/garda-lake/",
    icon: "bus",
  },
  {
    id: "atv-verona-lake-garda-bus",
    title: "Autobus sponda veneta",
    titleEn: "Buses, Veneto shore",
    area: "Sponda veneta",
    areaEn: "Veneto shore",
    desc: "Da Verona/Peschiera a Malcesine e Riva del Garda, fermate lungo tutta la sponda. Orari variano per linea e stagione.",
    descEn: "From Verona/Peschiera to Malcesine and Riva del Garda, stops all along the shore. Timetables vary by line and season.",
    url: "https://www.atv.verona.it/en/LineeLago",
    icon: "bus",
  },
  {
    id: "sirmione-shuttlebus",
    title: "Sirmione, navetta per il centro storico",
    titleEn: "Sirmione, shuttle to the historic center",
    area: "Sirmione",
    areaEn: "Sirmione",
    desc: "Da Colombare al centro storico, per evitare il traffico estivo: 2€ a corsa, ogni 15-20'. 10:00-00:40 (28 mar - 27 set 2026).",
    descEn: "From Colombare to the historic center, to skip summer traffic: €2 per ride, every 15-20 min. 10 AM-12:40 AM (Mar 28 - Sep 27, 2026).",
    url: "https://brescia.arriva.it/en/shuttlebus-sirmione/",
    icon: "bus",
  },
  {
    id: "malcesine-monte-baldo-cablecar",
    title: "Malcesine, funivia per il Monte Baldo",
    titleEn: "Malcesine, Monte Baldo cable car",
    area: "Malcesine",
    areaEn: "Malcesine",
    desc: "Ogni 30 min, 8:15-18:00 (ultima salita). Attiva 4 apr - 1 nov. A/R 30€ (28€ online).",
    descEn: "Every 30 min, 8:15 AM-6 PM (last ascent). Runs Apr 4 - Nov 1. Round trip €30 (€28 online).",
    url: "https://www.funiviedelbaldo.it/en/timetables-and-fares-malcesine-monte-baldo-cable-cars",
    icon: "cablecar",
  },
  {
    id: "limone-ciclopedonale-sospesa",
    title: "Limone, ciclopedonale a sbalzo sul lago",
    titleEn: "Limone, suspended lakeside cycle path",
    area: "Limone sul Garda",
    areaEn: "Limone sul Garda",
    desc: "Da Limone a Capo Reamol e al confine trentino, ultimi 2 km a sbalzo sul lago. Gratuita, illuminata di notte.",
    descEn: "From Limone to Capo Reamol and the Trentino border, last 2 km cantilevered over the lake. Free, lit at night.",
    url: "https://www.visitlimonesulgarda.com/en/garda-cycle-path.htm",
    icon: "bike",
  },
];
