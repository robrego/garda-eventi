export type TownPartner = {
  name: string;
  desc: string;
  descEn: string;
  url: string;
};

// Hand-picked, not scraped: a single relevant local business per town (e.g.
// a place to stay), shown as a small card on that town's SEO page only.
// Copy is sourced from the partner's own site, not invented.
export const TOWN_PARTNERS: Partial<Record<string, TownPartner>> = {
  "Puegnago del Garda": {
    name: "Il Nido Bed & Breakfast",
    desc: "Piccolo B&B a conduzione familiare tra uliveti e vigneti, nella tranquilla Raffa di Puegnago.",
    descEn:
      "A small family-run guest house nestled among olive groves and vineyards in the peaceful village of Raffa di Puegnago.",
    url: "https://www.ilnidobedbreakfast.it",
  },
};
