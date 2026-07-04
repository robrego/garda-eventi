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
  layout.tsx        # font, metadata
  page.tsx           # pagina principale, stato (data selezionata, filtri, vista)
  globals.css         # tutti gli stili
components/
  DateRibbon.tsx      # nastro dei 7 giorni + navigazione settimana + mini calendario
  Filters.tsx          # filtro città + toggle mappa/lista
  EventList.tsx        # lista eventi del giorno
  EventMap.tsx          # mappa Leaflet (client-only, dynamic import in page.tsx)
data/
  events.json           # eventi reali raccolti da fonti ufficiali
  config.ts               # coordinate città, categorie, giorni di mercato
  getEvents.ts              # unisce eventi fissi + mercati settimanali ricorrenti
```

## Architettura

- **Next.js App Router**, un'unica route (`app/page.tsx`), nessun backend: tutto
  lo stato (data selezionata, filtro città, vista mappa/lista) vive in `useState`
  nel componente pagina.
- **Dati statici**: `getAllEvents()` in `data/getEvents.ts` legge
  `data/events.json` (eventi curati a mano) e genera in più le occorrenze dei
  mercati settimanali per una finestra mobile di qualche settimana, invece di
  elencarle una per una nel JSON.
- **Mappa client-only**: Leaflet richiede `window`, quindi `EventMap.tsx` è
  importato con `dynamic(..., { ssr: false })` in `page.tsx`. Tile leggeri
  CARTO Positron (nessuna API key richiesta) per uno stile minimale che lascia
  risaltare i marker degli eventi.
- **Nessun database**: il prossimo passo naturale è sostituire `events.json`
  con Supabase (schema suggerito più sotto) per aggiornare i dati senza un
  nuovo deploy.

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

Fuori scope: sponda trentina (Riva del Garda, Torbole sono oltre i 50 km) e le
città dell'entroterra (Verona, Brescia, Mantova). L'elenco aggiornato di città
e coordinate è sempre in `data/config.ts` → `TOWN_COORDS`.

I link "Fonte" nelle card evento puntano al sito sorgente solo quando il campo
`src` assomiglia a un dominio (es. `visitsirmione.com`); nomi descrittivi
restano testo semplice, per non inventare URL che non abbiamo verificato.

### Aggiungere un evento o una città

- **Nuovo evento**: aggiungi una riga a `data/events.json` con lo stesso
  formato delle altre (`date`, `town`, `title`, `cat`, `time`, `desc`, `src`).
- **Nuova città**: aggiungi le coordinate a `TOWN_COORDS`, il giorno di mercato
  a `MARKET_DAYS` (se noto) e l'area di appartenenza a `TOWN_AREAS` in
  `data/config.ts`. Il filtro a tendina e la mappa la raccolgono
  automaticamente, non serve toccare i componenti.

## Prossimi passi suggeriti

1. Sostituire `events.json` con una tabella Supabase (schema qui sotto) così
   l'app può essere aggiornata senza un nuovo deploy.
2. Costruire uno script che scarica periodicamente gli eventi dai siti sopra
   (RSS dove disponibile, altrimenti scraping mirato) e li normalizza nello
   stesso formato di `EventItem`.

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
