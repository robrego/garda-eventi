# Contesto per Claude Code

Questo è "Lago di Garda e Dintorni" — un'app Next.js (App Router, no Tailwind,
CSS semplice in `app/globals.css`) che mostra eventi locali su mappa + lista,
con navigazione a calendario.

## Cose da sapere prima di modificare

- **Pubblico target**: generazione più anziana. Testo grande, contrasto alto,
  aree cliccabili larghe. Non ridurre le dimensioni dei font senza motivo.
- **Palette**: niente arancione/corallo. Verde (`--green`) per gli accenti,
  teal (`--lake-deep`) per la navigazione/stati attivi. Vedi le custom
  properties in `app/globals.css`.
- **Stroke**: bordi a 1px in tutta l'interfaccia (era 2px), stile minimale.
  Mappa con tile CARTO Positron (chiara, senza API key) invece degli OSM
  standard, per uno sfondo pulito che fa risaltare i marker.
- **Font**: Bricolage Grotesque per i titoli, Work Sans per il corpo del testo.
- **Zona geografica**: tutto il lago entro circa 50 km da Desenzano, sponda
  lombarda e veneta. Sponda lombarda, da sud a nord: Peschiera, Sirmione,
  Desenzano, Padenghe, Moniga, Manerba, San Felice, Salò, Gardone, Toscolano,
  Gargnano, Tignale, Tremosine, Limone. Sponda veneta, da sud a nord: Lazise,
  Bardolino, Garda, Torri del Benaco, Malcesine. Fuori scope: sponda trentina
  (Riva del Garda, Torbole — oltre i 50 km) e le città dell'entroterra (Verona,
  Brescia, Mantova). Se si aggiungono città, aggiornare `data/config.ts`
  (TOWN_COORDS, MARKET_DAYS, TOWN_AREAS) e `data/events.json`.
- **Mappa**: Leaflet + tile CARTO Positron (nessuna API key). Il componente
  `EventMap.tsx` è client-only ed è importato con `dynamic(..., { ssr: false })`
  in `page.tsx` perché Leaflet richiede `window`. I bounds si calcolano
  automaticamente da `TOWN_COORDS`, non serve aggiornare centro/zoom a mano.
- **Dati eventi**: raccolti manualmente in `data/events.json`, non è un feed
  live. I mercati settimanali sono generati proceduralmente in
  `data/getEvents.ts` invece di essere elencati uno per uno. Il campo `src`
  è linkato automaticamente in `EventList.tsx` solo se assomiglia a un dominio
  (es. `visitsirmione.com`); nomi descrittivi (es. "Garda Lombardia") restano
  testo semplice.

## Task tipici

- "Aggiungi un evento" → aggiungere una riga a `data/events.json` con lo
  stesso formato delle altre (date, town, title, cat, time, desc, src).
- "Aggiungi una città" → aggiornare `TOWN_COORDS`, `MARKET_DAYS` e
  `TOWN_AREAS` in `data/config.ts`. Il filtro a tendina in `Filters.tsx` e la
  mappa la raccolgono automaticamente, non serve toccare i componenti.
- "Collega un database" → sostituire `getAllEvents()` in `data/getEvents.ts`
  con una chiamata a Supabase (schema suggerito in README.md), mantenendo lo
  stesso tipo `EventItem` in uscita così i componenti non cambiano.
