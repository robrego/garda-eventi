export const TOWN_COORDS: Record<string, [number, number]> = {
  // Sponda est / penisola
  Peschiera:  [45.4406, 10.6866],
  Sirmione:   [45.4930, 10.6067],
  // Sponda ovest, da sud a nord
  Desenzano:  [45.4695, 10.5397],
  Padenghe:   [45.5011, 10.4958],
  Moniga:     [45.5189, 10.4967],
  Manerba:    [45.5567, 10.5594],
  "San Felice": [45.5789, 10.5422],
  Salò:       [45.6072, 10.5197],
  Gardone:    [45.6261, 10.5650],
  Toscolano:  [45.6456, 10.6028],
  Gargnano:   [45.6886, 10.6600],
  Tignale:    [45.7300, 10.6317],
  Tremosine:  [45.7700, 10.6678],
  Limone:     [45.8092, 10.7900],
};

export const TOWNS = Object.keys(TOWN_COORDS);

export const CATEGORIES: Record<string, string> = {
  market:  "Mercato",
  festival: "Festa",
  concert: "Concerto",
  sagra:   "Sagra",
  sport:   "Sport",
  art:     "Arte e cultura",
  cultura: "Cultura",
  teatro:  "Teatro",
};

// Giorno della settimana (0 = domenica) -> città con mercato settimanale
export const MARKET_DAYS: Record<number, string[]> = {
  1: ["Sirmione", "Peschiera", "Gardone", "Toscolano"],
  2: ["Desenzano", "Salò", "Manerba"],
  3: ["Gargnano", "San Felice"],
  4: ["Limone", "Padenghe"],
  5: ["Moniga"],
};

export type EventItem = {
  id: string;
  date: string; // YYYY-MM-DD
  town: string;
  title: string;
  cat: string;
  time: string;
  desc: string;
  src: string;
};
