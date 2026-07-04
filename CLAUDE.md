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
- **Font**: Bricolage Grotesque per i titoli, Work Sans per il corpo del testo.
- **Zona geografica**: tutta la sponda lombarda del lago, da Peschiera del
  Garda a Limone sul Garda (Peschiera, Sirmione, Desenzano, Padenghe, Moniga,
  Manerba, San Felice, Salò, Gardone, Toscolano, Gargnano, Tignale, Tremosine,
  Limone). Niente sponda veneta/trentina. Se si aggiungono città, aggiornare
  `data/config.ts` (TOWN_COORDS, MARKET_DAYS) e `data/events.json`.
- **Mappa**: Leaflet + OpenStreetMap (nessuna API key). Il componente
  `EventMap.tsx` è client-only ed è importato con `dynamic(..., { ssr: false })`
  in `page.tsx` perché Leaflet richiede `window`.
- **Dati eventi**: raccolti manualmente in `data/events.json`, non è un feed
  live. I mercati settimanali sono generati proceduralmente in
  `data/getEvents.ts` invece di essere elencati uno per uno.

## Task tipici

- "Aggiungi un evento" → aggiungere una riga a `data/events.json` con lo
  stesso formato delle altre (date, town, title, cat, time, desc, src).
- "Aggiungi una città" → aggiornare `TOWN_COORDS` e `MARKET_DAYS` in
  `data/config.ts`, poi aggiungere il bottone filtro in `components/Filters.tsx`.
- "Collega un database" → sostituire `getAllEvents()` in `data/getEvents.ts`
  con una chiamata a Supabase (schema suggerito in README.md), mantenendo lo
  stesso tipo `EventItem` in uscita così i componenti non cambiano.
