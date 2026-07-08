# Contesto per Claude Code

Questo è "Lago di Garda e Dintorni" — un'app Next.js (App Router, no Tailwind,
CSS semplice in `app/globals.css`) che mostra eventi locali su mappa + lista,
con navigazione a calendario, toggle di lingua IT/EN, login utenti per
inviare/correggere eventi, e uno scraper automatico che integra i dati curati
a mano. Vedi anche README.md per l'architettura completa.

## Cose da sapere prima di modificare

- **Pubblico target**: generazione più anziana. Testo grande, contrasto alto,
  aree cliccabili larghe. Non ridurre le dimensioni dei font senza motivo.
- **Palette**: niente arancione/corallo. Verde (`--green`) per gli accenti,
  teal (`--lake-deep`) per la navigazione/stati attivi. Vedi le custom
  properties in `app/globals.css`.
- **Stroke**: bordi a 1px in tutta l'interfaccia, stile minimale. Mappa con
  tile CARTO Positron (chiara, senza API key) invece degli OSM standard, per
  uno sfondo pulito che fa risaltare i marker.
- **Font**: Bricolage Grotesque per i titoli, Work Sans per il corpo del testo.
- **Effetto vetro sui controlli pill**: i toggle/pulsanti principali (IT/EN,
  Registrati/+Evento, Mappa+lista, day-chip attivo) usano un look
  glassmorphism — sfondo semi-trasparente + `backdrop-filter: blur(...)` +
  bordo chiaro sottile + ombra morbida. Gli stati "attivi/selezionati" usano
  un verde/teal più scuro e più opaco (~0.9) apposta, non lo stesso verde
  chiaro trasparente usato altrove — con opacità bassa il testo bianco sopra
  non si legge bene. Non "semplificare" questi stili togliendo blur/bordo
  pensando siano ridondanti: è una scelta estetica esplicita.
- **Pattern mobile/desktop**: diversi componenti renderizzano DUE versioni
  dello stesso elemento (una mobile, una desktop) e usano `display:none` nei
  media query per alternarle, invece di logica JS/matchMedia — es. il pill
  categoria evento (`.event-cat-mobile`/`.event-cat-desktop` in
  `EventList.tsx`), il selettore vista (`.view-select` dropdown su mobile vs
  `.view-toggle` a tre bottoni su desktop, in `Filters.tsx`), il menu header
  (`.menu-toggle`/`.header-menu` a burger su mobile vs inline su desktop, in
  `EventsApp.tsx`). Segui lo stesso pattern per nuovi controlli che devono
  comportarsi diversamente in base allo schermo: più semplice e senza rischi
  di hydration mismatch rispetto a `useState` + `matchMedia`.
- **Zona geografica**: tutto il lago entro circa 50 km da Desenzano, sponda
  lombarda, veneta e trentina, più l'entroterra entro 10-15 km dalla costa
  (soglia di distanza scelta esplicitamente, non un limite amministrativo).
  Sponda lombarda, da sud a nord: Peschiera, Sirmione, Desenzano, Padenghe,
  Moniga, Manerba, San Felice, Salò, Gardone, Toscolano, Gargnano, Tignale,
  Tremosine, Limone. Sponda veneta, da sud a nord: Lazise, Bardolino, Garda,
  Torri del Benaco, Brenzone sul Garda, Malcesine. Sponda trentina, a nord:
  Riva del Garda, Torbole. Entroterra (gruppo "Entroterra" in `TOWN_AREAS`,
  tutte entro 3.5-10.7 km dalla città costiera più vicina — distanze
  verificate, non stimate): Lonato del Garda, Castelnuovo del Garda,
  Polpenazze del Garda, Affi, Cavaion Veronese, Costermano sul Garda, San
  Zeno di Montagna, Bussolengo, Valeggio sul Mincio (lato lombardo/veneto),
  Arco (lato trentino). Fuori scope: Verona città, Brescia, Mantova, e le
  fiere in quota a un polo espositivo lontano dal lago (Fiera di Verona,
  Fiera di Montichiari — vedi `data/scrapers/gardaclick.ts`). Se si
  aggiungono città, aggiornare `data/config.ts` (TOWN_COORDS, MARKET_DAYS,
  TOWN_AREAS, e `AREA_LABELS_EN` se l'area è nuova) e `data/events.json`.
  Verificare sempre le coordinate reali (es. da Wikipedia) invece di
  stimarle a memoria — è una mappa, un pin nel posto sbagliato è un bug
  visibile.
- **Mappa**: Leaflet + tile CARTO Positron (nessuna API key). Il componente
  `EventMap.tsx` è client-only ed è importato con `dynamic(..., { ssr: false })`
  in `EventsApp.tsx` perché Leaflet richiede `window`. I bounds si calcolano
  automaticamente da `TOWN_COORDS`, non serve aggiornare centro/zoom a mano.
  I controlli di zoom +/- sono restilizzati in `globals.css`
  (`.leaflet-control-zoom`) per assomigliare al pulsante "Centra sugli eventi"
  (`.map-refit`) invece dello stile Leaflet di default.
- **Dati eventi**: la fonte primaria è `data/events.json` (curato a mano),
  unito a runtime in `data/getEvents.ts` con eventi inviati dagli utenti
  loggati, eventi scaricati dallo scraper automatico e mercati settimanali
  generati proceduralmente (mai elencati uno per uno). Il campo `src` è
  linkato automaticamente in `EventList.tsx` solo se assomiglia a un dominio
  (es. `visitsirmione.com`); nomi descrittivi (es. "Garda Lombardia") restano
  testo semplice.

## Autenticazione e contributi utente

- Login/registrazione con sessione via cookie JWT (`lib/auth.ts`), utenti
  salvati su Vercel Blob (`lib/users.ts`) — non c'è un ruolo admin, chiunque
  si registra può inviare eventi o correggere quelli esistenti.
- Un utente loggato può: aggiungere un evento manuale (`AddEventForm.tsx` →
  `lib/manualEvents.ts`), correggere la descrizione di un evento esistente
  (`EditDescForm.tsx` → `lib/descOverrides.ts`), aggiungere una copertina
  (`AddCoverForm.tsx` → `lib/imageOverrides.ts`). Tutto su Vercel Blob, niente
  database.
- Gli eventi manuali/scraped e le correzioni non hanno una versione inglese
  (`titleEn`/`descEn`) — restano nella lingua originale anche con il toggle
  su EN. È un limite noto, non un bug.

## Traduzione IT/EN

- Toggle persistito in `localStorage` via `LanguageProvider.tsx` (contesto
  React, hook `useLang()`). Stringhe UI in `lib/i18n.ts` (dizionario piatto
  `it`/`en`, più `DOW_SHORT`/`DOW_FULL`/`MONTHS` per le date). Categorie
  (`CATEGORIES_EN`), etichette d'area (`AREA_LABELS_EN`) e time-label
  descrittivi (`translateTime`, per le ~5 fasce come "in serata") vivono in
  `data/config.ts`.
- Gli eventi curati in `events.json` hanno `titleEn`/`descEn` opzionali; se
  mancanti il rendering fa fallback su `title`/`desc` italiani (vedi limite
  sopra per eventi manuali/scraped).
- Quando aggiungi una stringa hardcoded in un componente, aggiungila al
  dizionario in `lib/i18n.ts` e usa `t("chiave")` — non lasciare testo
  italiano fisso nel JSX.

## Scraper automatico

- `data/scrapers/` contiene i parser (uno per fonte confermata funzionante,
  vedi commento in `data/scrapers/index.ts`), eseguiti da
  `app/api/cron/scrape/route.ts` e salvati su Vercel Blob
  (`SCRAPED_BLOB_PATHNAME`).
- `vercel.json` attiva la cron ogni settimana, ma la route esegue lo scraping
  vero una settimana sì e una no (parità della settimana dall'epoch — la
  sintassi cron standard non può esprimere "ogni 2 settimane" senza
  sfasarsi). `GET /api/cron/scrape?force=1` con `Authorization: Bearer
  $CRON_SECRET` forza un'esecuzione immediata per test/debug.
- Fonti attive: `municipium.ts` (feed RSS, comuni sul CMS Municipium:
  Peschiera, Garda) e `gardaclick.ts` (HTML statico, una tabella per stagione
  raggruppata per mese, copre tutta l'area del Garda — il parser filtra per
  sottostringa contro `TOWNS`, con un caso speciale a match esatto per
  "Garda" per non matchare i tanti "X del/sul Garda" fuori scope).
- Prima di aggiungere una fonte, verificare che abbia un feed RSS/JSON
  stabile (pattern preferito, vedi `municipium.ts`). Se la fonte è solo HTML
  statico scrapabile (vedi `gardaclick.ts`), serve un parser dedicato che
  filtri per le sole città in scope (`TOWNS`/`TOWN_COORDS`) dato che queste
  fonti spesso coprono un'area più ampia del lago (Verona, Brescia,
  entroterra). Ogni scraper deve avere il proprio try/catch e non lanciare
  mai un'eccezione che blocchi le altre fonti.

## Task tipici

- "Aggiungi un evento" → aggiungere una riga a `data/events.json` con lo
  stesso formato delle altre (date, town, title, cat, time, desc, src);
  `titleEn`/`descEn` opzionali.
- "Aggiungi una città" → aggiornare `TOWN_COORDS`, `MARKET_DAYS` e
  `TOWN_AREAS` in `data/config.ts`. Il filtro a tendina in `Filters.tsx` e la
  mappa la raccolgono automaticamente, non serve toccare i componenti.
- "Aggiungi una fonte allo scraper" → vedi sezione "Scraper automatico" sopra
  e il README per i dettagli tecnici.
- "Aggiungi/traduci una stringa" → vedi sezione "Traduzione IT/EN" sopra.
- "Collega un database" → sostituire `getAllEvents()` in `data/getEvents.ts`
  con una chiamata a Supabase (schema suggerito in README.md), mantenendo lo
  stesso tipo `EventItem` in uscita così i componenti non cambiano. Nota che
  utenti/override/cache scraper sono già su Vercel Blob, non serve
  migrare quelli per primi.
