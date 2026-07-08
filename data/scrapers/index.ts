import { createMunicipiumScraper } from "./municipium";

// Confirmed working feeds only — see README for what was checked and
// ruled out. Add more here once a new source is verified, not before.
//
// Primary sources only: official comune feeds, tourism board sites
// (visitsirmione.com, visitmanerba.it, etc.), or an event's own
// organizer site. Never a secondary aggregator that just republishes
// other people's listings (gardaclick.com, panesalamina.com) — no
// accountability for accuracy, and it's not our data to re-scrape.
export const SCRAPERS = [
  createMunicipiumScraper(
    "Peschiera",
    "https://www.comune.peschieradelgarda.vr.it/it/eventi/feed",
    "comune.peschieradelgarda.vr.it"
  ),
  createMunicipiumScraper(
    "Garda",
    "https://www.comune.garda.vr.it/it/eventi/feed",
    "comune.garda.vr.it"
  ),
  createMunicipiumScraper(
    "Bussolengo",
    "https://www.comune.bussolengo.vr.it/it/eventi/feed",
    "comune.bussolengo.vr.it"
  ),
  createMunicipiumScraper(
    "Calvagese della Riviera",
    "https://www.comune.calvagesedellariviera.bs.it/it/eventi/feed",
    "comune.calvagesedellariviera.bs.it"
  ),
  createMunicipiumScraper(
    "Cavaion Veronese",
    "https://www.comune.cavaionveronese.vr.it/it/eventi/feed",
    "comune.cavaionveronese.vr.it"
  ),
  createMunicipiumScraper(
    "Costermano sul Garda",
    "https://www.comune.costermanosulgarda.vr.it/it/eventi/feed",
    "comune.costermanosulgarda.vr.it"
  ),
  createMunicipiumScraper(
    "Affi",
    "https://www.comune.affi.vr.it/it/eventi/feed",
    "comune.affi.vr.it"
  ),
];
