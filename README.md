# Lago di Garda e Dintorni – Eventi

Prototipo Next.js: mappa + lista + calendario per gli eventi sul Lago di
Garda, sponda lombarda e veneta, entro circa 50 km da Desenzano del Garda.

## Avvio rapido

```bash
npm install
npm run dev
```

Apri http://localhost:3000

Comandi utili:

```bash
npm run build   # build di produzione
npm run start   # avvia la build di produzione
npm run lint    # eslint
npx tsc --noEmit   # controllo tipi senza emettere file
```

## Struttura

```
app/
  layout.tsx              # font, metadata
  page.tsx                # entry point server: legge getAllEvents(), monta EventsApp
  globals.css             # tutti gli stili
  api/
    auth/{login,register,logout,me}/route.ts   # sessione via cookie JWT
    events/{manual,image,desc}/route.ts        # submission utenti autenticati
    cron/scrape/route.ts                       # cron scraper (vedi sotto)
components/
  EventsApp.tsx           # stato principale (data, filtri, vista, menu mobile)
  DateRibbon.tsx          # nastro dei 7 giorni + navigazione settimana
  Filters.tsx             # data picker + filtro città + selettore vista + IT/EN
  EventList.tsx           # lista eventi del giorno
  EventMap.tsx            # mappa Leaflet (client-only, dynamic import in EventsApp)
  AuthWidget.tsx           # login/registrazione/logout, apre AddEventForm
  AddEventForm.tsx         # submission manuale di un evento (utenti loggati)
  EditDescForm.tsx         # override della descrizione di un evento esistente
  AddCoverForm.tsx         # override dell'immagine di copertina di un evento
  LanguageProvider.tsx     # contesto IT/EN, persistito in localStorage
data/
  events.json             # eventi reali raccolti a mano da fonti ufficiali
  config.ts               # coordinate città, categorie (IT/EN), giorni di mercato
  getEvents.ts            # unisce curati + manuali + scraped + mercati ricorrenti
  scrapers/
    index.ts              # elenco scraper attivi (SCRAPERS)
    municipium.ts          # parser generico per comuni sul CMS Municipium
lib/
  auth.ts, users.ts       # sessione JWT (cookie) + utenti su Vercel Blob
  manualEvents.ts         # eventi inviati a mano dagli utenti loggati (Blob)
  imageOverrides.ts       # override di copertina per evento esistente (Blob)
  descOverrides.ts        # override di descrizione per evento esistente (Blob)
  i18n.ts                 # dizionario stringhe IT/EN + nomi giorni/mesi
vercel.json               # cron dello scraper
```

## Architettura

- **Next.js App Router**: `app/page.tsx` è un server component che chiama
  `getAllEvents()` e monta `EventsApp` (client component) dentro
  `LanguageProvider`. Tutto lo stato di navigazione (data selezionata, filtro
  città, vista mappa/lista, menu mobile) vive in `useState` in `EventsApp`.
- **Sorgenti degli eventi**, unite da `getAllEvents()` in `data/getEvents.ts`,
  in ordine di priorità: eventi inviati a mano dagli utenti loggati (Blob),
  eventi scaricati dallo scraper automatico (Blob), eventi curati in
  `data/events.json`, più le occorrenze generate dei mercati settimanali
  ricorrenti. Gli override di immagine/descrizione (anch'essi su Blob) si
  applicano sopra qualunque fonte, per evento.
- **Autenticazione**: sessione via cookie JWT (`lib/auth.ts`), utenti salvati
  su Vercel Blob (`lib/users.ts`). Serve solo a distinguere chi può inviare
  eventi/correzioni — non c'è un ruolo admin, chiunque si registra può farlo.
- **Scraper automatico**: `data/scrapers/` contiene i parser (uno per fonte
  confermata funzionante — vedi sotto), eseguiti dalla cron
  `app/api/cron/scrape/route.ts` e salvati su Vercel Blob. `vercel.json`
  attiva la cron ogni settimana, ma la route esegue lo scraping vero solo una
  settimana sì e una no (parità della settimana dall'epoch — la sintassi cron
  standard non può esprimere "ogni 2 settimane" senza sfasarsi tra un mese e
  l'altro). Per forzare un'esecuzione fuori programma: `GET
  /api/cron/scrape?force=1` con header `Authorization: Bearer $CRON_SECRET`.
- **i18n**: toggle IT/EN (`components/LanguageProvider.tsx` +
  `lib/i18n.ts`), scelta persistita in `localStorage`. Le stringhe
  dell'interfaccia sono tradotte; gli eventi curati in `events.json` hanno
  anche `titleEn`/`descEn`. Gli eventi inviati a mano o scaricati dallo
  scraper non hanno una versione inglese e restano nella lingua originale
  anche col toggle su EN.
- **Mappa client-only**: Leaflet richiede `window`, quindi `EventMap.tsx` è
  importato con `dynamic(..., { ssr: false })` in `EventsApp.tsx`. Tile
  leggeri CARTO Positron (nessuna API key richiesta) per uno stile minimale
  che lascia risaltare i marker degli eventi.
- **Nessun database relazionale**: tutto ciò che è dinamico (utenti, eventi
  manuali, override, cache dello scraper) vive su Vercel Blob come JSON. Il
  prossimo passo naturale resta sostituire `events.json` con Supabase (schema
  suggerito più sotto) se la mole di dati/scritture dovesse crescere.

### Aggiungere una nuova fonte allo scraper

`data/scrapers/index.ts` elenca solo fonti verificate — prima di aggiungerne
una, controllare se espone un feed RSS/JSON stabile (come i comuni sul CMS
Municipium, es. Peschiera e Garda: `/it/eventi/feed`). Se la fonte espone
solo HTML statico con una struttura scrapabile (es. una tabella con
intestazioni di mese), scrivere un nuovo parser in `data/scrapers/` seguendo
lo stesso pattern di `municipium.ts` (try/catch che ritorna `[]` in caso di
errore, mai un'eccezione che blocchi le altre fonti), poi aggiungerlo
all'array `SCRAPERS`. Ricordarsi di filtrare per le sole città in scope
(vedi `TOWN_COORDS` in `data/config.ts`) se la fonte copre un'area più ampia
del lago.

## Vincoli di design (vedi anche CLAUDE.md)

- **Pubblico target**: generazione più anziana → testo grande, contrasto alto,
  aree cliccabili larghe. Non ridurre i font senza motivo.
- **Palette**: niente arancione/corallo. Verde (`--green`) per gli accenti,
  teal (`--lake-deep`) per navigazione/stati attivi.
- **Stroke minimali**: bordi a 1px in tutta l'interfaccia (chip, card, mappa),
  coerenti con lo stile leggero della mappa CARTO.
- **Font**: Bricolage Grotesque (titoli), Work Sans (corpo testo).

## Dati

Gli eventi in `data/events.json` coprono tutto il lago entro circa 50 km da
Desenzano, sponda lombarda e veneta, raccolti manualmente da siti ufficiali di
comuni, uffici turistici e organizzatori (non è un feed live — le date possono
cambiare):
- Comune di Desenzano del Garda / lagodigardaeventi.it
- Visit Sirmione (visitsirmione.com)
- Comune di Peschiera del Garda (comune.peschieradelgarda.vr.it)
- Garda Festival, Garda Lombardia
- Uffici turistici e comuni della sponda lombarda: Padenghe, Moniga, Manerba,
  San Felice del Benaco, Salò, Gardone Riviera, Toscolano-Maderno, Gargnano,
  Tignale, Tremosine, Limone sul Garda
- Uffici turistici e comuni della sponda veneta: Lazise, Bardolino, Garda,
  Torri del Benaco, Malcesine
- Sponda trentina, a nord del lago: Riva del Garda, Torbole (gardatrentino.it)

Fuori scope: le città dell'entroterra (Verona, Brescia, Mantova). L'elenco
aggiornato di città e coordinate è sempre in `data/config.ts` →
`TOWN_COORDS`.

I link "Fonte" nelle card evento puntano al sito sorgente solo quando il campo
`src` assomiglia a un dominio (es. `visitsirmione.com`); nomi descrittivi
restano testo semplice, per non inventare URL che non abbiamo verificato.

### Aggiungere un evento o una città

- **Nuovo evento**: aggiungi una riga a `data/events.json` con lo stesso
  formato delle altre (`date`, `town`, `title`, `cat`, `time`, `desc`, `src`).
  `titleEn`/`descEn` sono opzionali — se mancano, la versione inglese del
  sito mostra semplicemente il testo italiano.
- **Nuova città**: aggiungi le coordinate a `TOWN_COORDS`, il giorno di mercato
  a `MARKET_DAYS` (se noto) e l'area di appartenenza a `TOWN_AREAS` in
  `data/config.ts` (più `AREA_LABELS_EN` se l'area è nuova). Il filtro a
  tendina e la mappa la raccolgono automaticamente, non serve toccare i
  componenti.

## Prossimi passi suggeriti

1. Sostituire `events.json` con una tabella Supabase (schema qui sotto) così
   l'app può essere aggiornata senza un nuovo deploy — gli utenti loggati
   possono già farlo parzialmente oggi tramite Blob (eventi manuali e
   override), ma resta un JSON piatto senza query/indici.
2. Verificare se gardaclick.com (tabella statica di eventi/fiere/mercati per
   l'intera zona del Garda, non solo il nostro sottoinsieme di città) è una
   fonte abbastanza stabile da aggiungere come nuovo scraper — richiede un
   parser dedicato (formato a tabella con intestazioni di mese, non un feed)
   e un filtro sulle sole città in scope.

### Schema Supabase suggerito

```sql
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  town text not null,
  lat numeric not null,
  lng numeric not null,
  category text not null,
  event_date date not null,
  start_time text,
  description text,
  source text,
  source_url text,
  created_at timestamptz default now()
);
```
