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
  // Sponda veneta, da sud a nord
  Lazise:         [45.4949, 10.7371],
  Bardolino:      [45.5497, 10.7205],
  Garda:          [45.5762, 10.6975],
  "Torri del Benaco": [45.6136, 10.6873],
  "Brenzone sul Garda": [45.7000, 10.7667],
  Malcesine:      [45.7669, 10.8095],
  // Sponda trentina, a nord
  Riva:           [45.8858, 10.8412],
  Torbole:        [45.8527, 10.8812],
  // Entroterra, entro 10-15 km dalla costa (vedi CLAUDE.md)
  "Lonato del Garda":      [45.4657, 10.4749],
  "Castelnuovo del Garda": [45.4333, 10.7667],
  "Polpenazze del Garda":  [45.5522, 10.5075],
  Affi:                    [45.5500, 10.7667],
  "Cavaion Veronese":      [45.5401, 10.7705],
  "Costermano sul Garda":  [45.5857, 10.7400],
  "San Zeno di Montagna":  [45.6333, 10.7333],
  Bussolengo:              [45.4667, 10.8500],
  "Valeggio sul Mincio":   [45.3500, 10.7333],
  Arco:                    [45.9192, 10.8862],
  "Soiano del Lago":       [45.5278, 10.5127],
  "Puegnago del Garda":    [45.5667, 10.5100],
  Muscoline:               [45.5667, 10.4667],
  "Calvagese della Riviera": [45.5342, 10.4425],
  Bedizzole:               [45.5167, 10.4167],
  Gavardo:                 [45.5875, 10.4389],
  Prevalle:                [45.5500, 10.4167],
  Pastrengo:               [45.5000, 10.8000],
  Tenno:                   [45.9194, 10.8322],
  Dro:                     [45.9667, 10.9167],
};

export const TOWNS = Object.keys(TOWN_COORDS);

// Raggruppamento delle città per il filtro a tendina, per regione
// amministrativa (non per sponda) — include costa ed entroterra insieme.
export const AREA_ORDER = ["Lombardia", "Veneto", "Trentino"];

export const AREA_LABELS_EN: Record<string, string> = {
  "Lombardia": "Lombardy",
  "Veneto": "Veneto",
  "Trentino": "Trentino",
};

export const TOWN_AREAS: Record<string, string> = {
  // Lombardia (provincia di Brescia)
  Sirmione: "Lombardia",
  Desenzano: "Lombardia",
  Padenghe: "Lombardia",
  Moniga: "Lombardia",
  Manerba: "Lombardia",
  "San Felice": "Lombardia",
  Salò: "Lombardia",
  Gardone: "Lombardia",
  Toscolano: "Lombardia",
  Gargnano: "Lombardia",
  Tignale: "Lombardia",
  Tremosine: "Lombardia",
  Limone: "Lombardia",
  "Lonato del Garda": "Lombardia",
  "Polpenazze del Garda": "Lombardia",
  "Soiano del Lago": "Lombardia",
  "Puegnago del Garda": "Lombardia",
  Muscoline: "Lombardia",
  "Calvagese della Riviera": "Lombardia",
  Bedizzole: "Lombardia",
  Gavardo: "Lombardia",
  Prevalle: "Lombardia",
  // Veneto (provincia di Verona)
  Peschiera: "Veneto",
  Lazise: "Veneto",
  Bardolino: "Veneto",
  Garda: "Veneto",
  "Torri del Benaco": "Veneto",
  "Brenzone sul Garda": "Veneto",
  Malcesine: "Veneto",
  "Castelnuovo del Garda": "Veneto",
  Affi: "Veneto",
  "Cavaion Veronese": "Veneto",
  "Costermano sul Garda": "Veneto",
  "San Zeno di Montagna": "Veneto",
  Bussolengo: "Veneto",
  "Valeggio sul Mincio": "Veneto",
  Pastrengo: "Veneto",
  // Trentino (provincia di Trento)
  Riva: "Trentino",
  Torbole: "Trentino",
  Arco: "Trentino",
  Tenno: "Trentino",
  Dro: "Trentino",
};

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

export const CATEGORIES_EN: Record<string, string> = {
  market:  "Market",
  festival: "Festival",
  concert: "Concert",
  sagra:   "Food festival",
  sport:   "Sport",
  art:     "Art & culture",
  cultura: "Culture",
  teatro:  "Theatre",
};

// Giorno della settimana (0 = domenica) -> città con mercato settimanale
export const MARKET_DAYS: Record<number, string[]> = {
  1: ["Sirmione", "Peschiera", "Gardone", "Toscolano", "Torri del Benaco"],
  2: ["Desenzano", "Salò", "Manerba"],
  3: ["Gargnano", "San Felice", "Lazise", "Riva"],
  4: ["Limone", "Padenghe", "Bardolino"],
  5: ["Moniga", "Garda"],
  6: ["Malcesine"],
};

// Comune crest (stemma) image, used as the cover placeholder for events
// that don't have a real photo/poster yet.
export const TOWN_CREST: Partial<Record<string, string>> = {
  Peschiera: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Peschiera_del_Garda-Stemma.svg",
  Sirmione: "https://upload.wikimedia.org/wikipedia/commons/4/42/Sirmione-Stemma.svg",
  Desenzano: "https://upload.wikimedia.org/wikipedia/commons/d/df/Desenzano_del_Garda-Stemma.svg",
  Padenghe: "https://upload.wikimedia.org/wikipedia/it/2/24/Padenghe_sul_Garda-Stemma.png",
  Moniga: "https://upload.wikimedia.org/wikipedia/it/5/55/Moniga_del_Garda-Stemma.png",
  Manerba: "https://upload.wikimedia.org/wikipedia/it/6/68/Manerba_del_Garda-Stemma.png",
  "San Felice": "https://upload.wikimedia.org/wikipedia/it/3/39/San_Felice_del_Benaco-Stemma.png",
  Salò: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Sal%C3%B2-Stemma.svg",
  Gardone: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Gardone_Riviera-Stemma.svg",
  Toscolano: "https://upload.wikimedia.org/wikipedia/it/c/c0/Toscolano_Maderno-Stemma.png",
  Gargnano: "https://upload.wikimedia.org/wikipedia/it/f/fa/Gargnano-Stemma.png",
  Tignale: "https://upload.wikimedia.org/wikipedia/it/1/19/Tignale-Stemma.png",
  Tremosine: "https://upload.wikimedia.org/wikipedia/it/9/9c/Tremosine_sul_Garda-Stemma.png",
  Limone: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Limone_sul_Garda-Stemma.svg",
  Lazise: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Lazise-Stemma.svg",
  Bardolino: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Bardolino-Stemma.svg",
  Garda: "https://upload.wikimedia.org/wikipedia/it/6/69/Garda-Stemma.png",
  "Torri del Benaco": "https://upload.wikimedia.org/wikipedia/it/3/3d/Torri_del_Benaco-Stemma.png",
  Malcesine: "https://upload.wikimedia.org/wikipedia/it/8/8d/Malcesine-Stemma.png",
  Riva: "https://upload.wikimedia.org/wikipedia/commons/4/42/Riva_del_Garda-Stemma.svg",
  Torbole: "https://upload.wikimedia.org/wikipedia/it/a/ab/Nago-Torbole-Stemma.png",
};

export type EventItem = {
  id: string;
  date: string; // YYYY-MM-DD
  town: string;
  title: string;
  titleEn?: string;
  cat: string;
  time: string;
  desc: string;
  descEn?: string;
  src: string;
  image?: string;
  url?: string; // direct link to the event's own page, if known
  addedBy?: string; // email of the user who submitted it manually, if any
};

// A handful of curated events use a descriptive (non-clock) time instead of
// an HH:MM range; those are the only "time" values that need translating.
const TIME_LABELS_EN: Record<string, string> = {
  "giornata intera": "all day",
  "in giornata": "during the day",
  "in serata": "in the evening",
  "mattina": "morning",
  "pomeriggio": "afternoon",
};

export function translateTime(time: string, lang: "it" | "en"): string {
  if (lang !== "en") return time;
  return TIME_LABELS_EN[time] ?? time;
}
