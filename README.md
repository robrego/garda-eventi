# Lago di Garda e Dintorni – Eventi

Prototipo Next.js: mappa + lista + calendario per gli eventi sulla sponda lombarda
del lago, da Peschiera a Limone.

## Avvio rapido

```bash
npm install
npm run dev
```

Apri http://localhost:3000

## Struttura

```
app/
  layout.tsx        # font, metadata
  page.tsx           # pagina principale, stato (data selezionata, filtri, vista)
  globals.css         # tutti gli stili
components/
  DateRibbon.tsx      # nastro dei 7 giorni + navigazione settimana
  Filters.tsx          # filtro città + toggle mappa/lista
  EventList.tsx        # lista eventi del giorno
  EventMap.tsx          # mappa Leaflet (client-only, dynamic import in page.tsx)
data/
  events.json           # eventi reali raccolti da fonti ufficiali (luglio 2026)
  config.ts               # coordinate città, categorie, giorni di mercato
  getEvents.ts              # unisce eventi fissi + mercati settimanali ricorrenti
```

## Dati

Gli eventi in `data/events.json` coprono l'intera sponda lombarda del lago, da
Peschiera del Garda a Limone sul Garda, raccolti manualmente da:
- Comune di Desenzano del Garda / lagodigardaeventi.it
- Visit Sirmione (visitsirmione.com)
- Comune di Peschiera del Garda (comune.peschieradelgarda.vr.it)
- Garda Festival 2026 (gardafestival.com)
- Garda Lombardia (gardalombardia.com)
- Comuni e uffici turistici di Padenghe, Moniga, Manerba, San Felice del
  Benaco, Salò, Gardone Riviera, Toscolano-Maderno, Gargnano, Tignale,
  Tremosine e Limone sul Garda

**Non è una fonte live**: le date possono cambiare, e nuovi eventi vengono pubblicati
di continuo. Prossimo passo naturale è uno scraper/importer che tenga il file
aggiornato — vedi CLAUDE.md per un punto di partenza.

## Prossimi passi suggeriti

1. Sostituire `events.json` con una tabella Supabase (schema in fondo a questo file)
   così l'app può essere aggiornata senza un nuovo deploy.
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
