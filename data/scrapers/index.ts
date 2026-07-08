import { createMunicipiumScraper } from "./municipium";
import { scrapeGardaClick } from "./gardaclick";

// Confirmed working feeds only — see README for what was checked and
// ruled out. Add more here once a new source is verified, not before.
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
  scrapeGardaClick,
];
