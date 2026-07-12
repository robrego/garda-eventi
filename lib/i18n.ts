export type Lang = "it" | "en";

const STRINGS = {
  authAddEvent: { it: "+ Evento", en: "+ Event" },
  authLogout: { it: "Esci", en: "Log out" },
  authRegister: { it: "Registrati", en: "Sign up" },
  authLogin: { it: "Accedi", en: "Log in" },
  authCreateAccount: { it: "Crea account", en: "Create account" },
  authCancel: { it: "Annulla", en: "Cancel" },
  authSwitchToRegister: { it: "Non hai un account? Registrati", en: "Don't have an account? Sign up" },
  authSwitchToLogin: { it: "Hai già un account? Accedi", en: "Already have an account? Log in" },
  fieldEmail: { it: "Email", en: "Email" },
  fieldPassword: { it: "Password", en: "Password" },
  errorGeneric: { it: "Errore", en: "Error" },
  errorConnection: { it: "Errore di connessione", en: "Connection error" },
  errorRetry: { it: "Errore, riprova", en: "Error, try again" },

  addEventTitle: { it: "Aggiungi un evento", en: "Add an event" },
  fieldDate: { it: "Data", en: "Date" },
  fieldTown: { it: "Città", en: "Town" },
  fieldTitle: { it: "Titolo", en: "Title" },
  placeholderEventName: { it: "Nome dell'evento", en: "Event name" },
  fieldCategory: { it: "Categoria", en: "Category" },
  fieldTime: { it: "Orario", en: "Time" },
  placeholderTime: { it: "es. 21:00", en: "e.g. 9:00 PM" },
  fieldDescription: { it: "Descrizione", en: "Description" },
  fieldSource: { it: "Fonte", en: "Source" },
  placeholderSource: { it: "es. sito del comune", en: "e.g. town council website" },
  fieldImageUrlOptional: { it: "Immagine (URL, opzionale)", en: "Image (URL, optional)" },
  fieldEventUrlOptional: { it: "Link alla pagina dell'evento (opzionale)", en: "Link to the event's page (optional)" },
  saveEvent: { it: "Salva evento", en: "Save event" },

  editDescTitle: { it: "Modifica descrizione", en: "Edit description" },
  saveDesc: { it: "Salva descrizione", en: "Save description" },

  addCoverTitle: { it: "Aggiungi copertina", en: "Add cover" },
  changeCoverTitle: { it: "Cambia copertina", en: "Change cover" },
  fieldImageUrl: { it: "URL immagine", en: "Image URL" },
  saveCover: { it: "Salva copertina", en: "Save cover" },
  uploadImageLabel: { it: "Carica un file", en: "Upload a file" },
  orDivider: { it: "oppure", en: "or" },
  uploading: { it: "Caricamento in corso…", en: "Uploading…" },
  errorUpload: { it: "Caricamento non riuscito, riprova", en: "Upload failed, try again" },

  deleteLink: { it: "Elimina", en: "Delete" },
  confirmDeleteEvent: {
    it: "Eliminare questo evento? Non sarà più visibile a nessuno.",
    en: "Delete this event? It will no longer be visible to anyone.",
  },
  ariaChangeCover: { it: "Cambia la copertina di questo evento", en: "Change this event's cover" },

  allTowns: { it: "Tutte le città", en: "All towns" },
  viewSplit: { it: "Mappa + lista", en: "Map + list" },
  viewList: { it: "Lista", en: "List" },
  viewMap: { it: "Mappa", en: "Map" },
  ariaChooseDate: { it: "Scegli una data", en: "Choose a date" },
  ariaFilterTown: { it: "Filtra per città", en: "Filter by town" },
  ariaLangToggle: { it: "Cambia lingua", en: "Change language" },
  ariaMenu: { it: "Menu", en: "Menu" },
  ariaViewSelect: { it: "Cambia visualizzazione", en: "Change view" },

  ariaPrevDays: { it: "Giorni precedenti", en: "Previous days" },
  ariaNextDays: { it: "Giorni successivi", en: "Next days" },

  eventSingular: { it: "evento", en: "event" },
  eventPlural: { it: "eventi", en: "events" },
  emptyStateLine1: { it: "Nessun evento registrato per questo giorno.", en: "No events recorded for this day." },
  emptyStateLine2: {
    it: "Prova un'altra data o rimuovi il filtro per città.",
    en: "Try another date or remove the town filter.",
  },
  addCoverLabel: { it: "+ copertina", en: "+ cover" },
  ariaAddCover: { it: "Aggiungi una copertina per questo evento", en: "Add a cover for this event" },
  editLink: { it: "Modifica", en: "Edit" },
  sourceLabel: { it: "Fonte:", en: "Source:" },

  centerMapButton: { it: "Centra sugli eventi", en: "Center on events" },
  ariaCenterMap: { it: "Centra la mappa sugli eventi del giorno", en: "Center the map on today's events" },

  doneButton: { it: "Fatto", en: "Done" },
} satisfies Record<string, Record<Lang, string>>;

export type StringKey = keyof typeof STRINGS;

export function translate(key: StringKey, lang: Lang): string {
  return STRINGS[key][lang];
}

export const DOW_SHORT: Record<Lang, string[]> = {
  it: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

export const DOW_FULL: Record<Lang, string[]> = {
  it: ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

export const MONTHS: Record<Lang, string[]> = {
  it: [
    "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
    "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
  ],
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
};

export function eventsCountLabel(n: number, lang: Lang): string {
  const noun = n === 1 ? STRINGS.eventSingular[lang] : STRINGS.eventPlural[lang];
  return `${n} ${noun}`;
}

export function townsSelectedLabel(n: number, lang: Lang): string {
  if (lang === "en") return `${n} town${n === 1 ? "" : "s"} selected`;
  return `${n} città selezionat${n === 1 ? "a" : "e"}`;
}
