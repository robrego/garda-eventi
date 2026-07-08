# Context for Claude Code

This is "Lago di Garda e Dintorni" — a Next.js app (App Router, no Tailwind,
plain CSS in `app/globals.css`) that shows local events on a map + list, with
calendar navigation, an IT/EN language toggle, user login to submit/correct
events, and an automatic scraper that merges in hand-curated data. See also
README.md for the full architecture.

## Things to know before making changes

- **Target audience**: older generation. Large text, high contrast, wide
  clickable areas. Don't shrink font sizes without a reason.
- **Palette**: no orange/coral. Green (`--green`) for accents, teal
  (`--lake-deep`) for navigation/active states. See the custom properties in
  `app/globals.css`.
- **Stroke**: 1px borders throughout the UI, minimal style. Map uses CARTO
  Positron tiles (light, no API key) instead of standard OSM, for a clean
  background that makes the markers stand out.
- **Font**: Bricolage Grotesque for headings, Work Sans for body text.
- **Glass effect on pill controls**: the main toggles/buttons (IT/EN,
  Registrati/+Evento, Mappa+lista, active day-chip) use a glassmorphism
  look — semi-transparent background + `backdrop-filter: blur(...)` + thin
  light border + soft shadow. "Active/selected" states deliberately use a
  darker, more opaque (~0.9) green/teal, not the same light transparent
  green used elsewhere — at low opacity the white text on top isn't legible.
  Don't "simplify" these styles by stripping the blur/border thinking
  they're redundant: it's a deliberate aesthetic choice.
- **Mobile/desktop pattern**: several components render TWO versions of the
  same element (one mobile, one desktop) and use `display:none` in media
  queries to switch between them, instead of JS/matchMedia logic — e.g. the
  event category pill (`.event-cat-mobile`/`.event-cat-desktop` in
  `EventList.tsx`), the view selector (`.view-select` dropdown on mobile vs
  `.view-toggle` three-button bar on desktop, in `Filters.tsx`), the header
  menu (`.menu-toggle`/`.header-menu` as a burger on mobile vs inline on
  desktop, in `EventsApp.tsx`). Follow the same pattern for new controls
  that need to behave differently by screen size: simpler and free of the
  hydration-mismatch risk that comes with `useState` + `matchMedia`.
- **Geographic area**: the whole lake within ~50 km of Desenzano, Lombardy,
  Veneto and Trentino shores, plus the hinterland within 10-15 km of the
  coast (an explicitly chosen distance threshold, not an administrative
  boundary). Lombardy shore, south to north: Peschiera, Sirmione, Desenzano,
  Padenghe, Moniga, Manerba, San Felice, Salò, Gardone, Toscolano, Gargnano,
  Tignale, Tremosine, Limone. Veneto shore, south to north: Lazise,
  Bardolino, Garda, Torri del Benaco, Brenzone sul Garda, Malcesine.
  Trentino shore, to the north: Riva del Garda, Torbole. Hinterland
  ("Entroterra" group in `TOWN_AREAS`, all within 3.5-10.7 km of the nearest
  coastal town — verified distances, not estimates): Lonato del Garda,
  Castelnuovo del Garda, Polpenazze del Garda, Affi, Cavaion Veronese,
  Costermano sul Garda, San Zeno di Montagna, Bussolengo, Valeggio sul
  Mincio (Lombardy/Veneto side), Arco (Trentino side). Out of scope: Verona
  city, Brescia, Mantova, and fairs hosted at an exhibition center far from
  the lake (Fiera di Verona, Fiera di Montichiari — see
  `data/scrapers/gardaclick.ts`). When adding towns, update
  `data/config.ts` (TOWN_COORDS, MARKET_DAYS, TOWN_AREAS, and
  `AREA_LABELS_EN` if the area is new) and `data/events.json`. Always
  verify real coordinates (e.g. from Wikipedia) instead of estimating from
  memory — this is a map, a pin in the wrong place is a visible bug.
- **Map**: Leaflet + CARTO Positron tiles (no API key). `EventMap.tsx` is
  client-only and imported with `dynamic(..., { ssr: false })` in
  `EventsApp.tsx` because Leaflet requires `window`. Bounds are computed
  automatically from `TOWN_COORDS`, no need to update center/zoom by hand.
  The +/- zoom controls are restyled in `globals.css`
  (`.leaflet-control-zoom`) to match the "Centra sugli eventi" button
  (`.map-refit`) instead of Leaflet's default look.
- **Event data**: the primary source is `data/events.json` (hand-curated),
  merged at runtime in `data/getEvents.ts` with events submitted by logged-in
  users, events downloaded by the automatic scraper, and procedurally
  generated weekly markets (never listed one by one). The `src` field is
  auto-linked in `EventList.tsx` only if it looks like a domain (e.g.
  `visitsirmione.com`); descriptive names (e.g. "Garda Lombardia") stay as
  plain text.

## Authentication and user contributions

- Login/registration with a JWT cookie session (`lib/auth.ts`), users stored
  on Vercel Blob (`lib/users.ts`) — there's no admin role, anyone who
  registers can submit events or correct existing ones.
- A logged-in user can: add a manual event (`AddEventForm.tsx` →
  `lib/manualEvents.ts`), correct an existing event's description
  (`EditDescForm.tsx` → `lib/descOverrides.ts`), add a cover image
  (`AddCoverForm.tsx` → `lib/imageOverrides.ts`). All on Vercel Blob, no
  database.
- Manual/scraped events and corrections have no English version
  (`titleEn`/`descEn`) — they stay in their original language even with the
  toggle set to EN. This is a known limitation, not a bug.

## IT/EN translation

- Toggle persisted in `localStorage` via `LanguageProvider.tsx` (React
  context, `useLang()` hook). UI strings live in `lib/i18n.ts` (flat
  `it`/`en` dictionary, plus `DOW_SHORT`/`DOW_FULL`/`MONTHS` for dates).
  Categories (`CATEGORIES_EN`), area labels (`AREA_LABELS_EN`), and
  descriptive time labels (`translateTime`, for the ~5 phrases like "in
  serata") live in `data/config.ts`.
- Curated events in `events.json` have optional `titleEn`/`descEn`; if
  missing, rendering falls back to the Italian `title`/`desc` (see the
  limitation above for manual/scraped events).
- When adding a hardcoded string in a component, add it to the dictionary in
  `lib/i18n.ts` and use `t("key")` — don't leave fixed Italian text in JSX.

## Automatic scraper

- `data/scrapers/` contains the parsers (one per confirmed-working source,
  see the comment in `data/scrapers/index.ts`), run by
  `app/api/cron/scrape/route.ts` and saved to Vercel Blob
  (`SCRAPED_BLOB_PATHNAME`).
- `vercel.json` triggers the cron weekly, but the route only actually
  scrapes every other week (epoch-week parity — standard cron syntax can't
  express "every 2 weeks" without drifting). `GET
  /api/cron/scrape?force=1` with `Authorization: Bearer $CRON_SECRET` forces
  an immediate run for testing/debugging.
- Active sources: `municipium.ts` (RSS feed, comuni on the Municipium CMS:
  Peschiera, Garda) and `gardaclick.ts` (static HTML, one table per season
  grouped by month, covers the whole Garda area — the parser filters by
  substring against `TOWNS`, with a special exact-match case for "Garda" so
  it doesn't match the many out-of-scope "X del/sul Garda" entries).
- Before adding a source, check whether it has a stable RSS/JSON feed
  (preferred pattern, see `municipium.ts`). If the source is only scrapable
  static HTML (see `gardaclick.ts`), it needs a dedicated parser that
  filters to in-scope towns only (`TOWNS`/`TOWN_COORDS`), since these
  sources often cover a much wider area than the lake (Verona, Brescia,
  the hinterland). Every scraper needs its own try/catch and must never
  throw an exception that blocks the other sources.

## Typical tasks

- "Add an event" → add a row to `data/events.json` in the same format as the
  others (date, town, title, cat, time, desc, src); `titleEn`/`descEn` are
  optional.
- "Add a town" → update `TOWN_COORDS`, `MARKET_DAYS`, and `TOWN_AREAS` in
  `data/config.ts`. The dropdown filter in `Filters.tsx` and the map pick it
  up automatically, no need to touch the components.
- "Add a scraper source" → see the "Automatic scraper" section above and
  the README for technical details.
- "Add/translate a string" → see the "IT/EN translation" section above.
- "Hook up a database" → replace `getAllEvents()` in `data/getEvents.ts`
  with a Supabase call (suggested schema in README.md), keeping the same
  `EventItem` output type so the components don't change. Note that
  users/overrides/scraper cache are already on Vercel Blob — no need to
  migrate those first.


# Preferred libraries

When a task falls into one of these areas, use the library instead of writing it
from scratch, and install it if it isn't already in the project:

- Animations, transitions, gestures: Motion (import from "motion/react"; this is
  the current package, formerly called "framer-motion")
- Smooth, premium scroll feel: Lenis
- Scroll-triggered / timeline animation: GSAP with ScrollTrigger
- 3D scenes: React Three Fiber with Drei helpers
- Charts and data viz: Recharts (Visx or Nivo for custom work)
- Icons: Lucide
- Command palette (Cmd+K): cmdk
- Toasts / notifications: Sonner
- Drag and drop: dnd-kit
- Sortable, filterable tables: TanStack Table (formerly React Table)
- Dates: date-fns
- Confetti / celebratory moments: canvas-confetti

Always use the current version of a library's syntax. If you're unsure of the
current API, check the library's docs before writing rather than relying on an
older version you might remember.

# Guardrails

- Don't add a library when the platform already does the job well. A simple fade
  or hover is native CSS (opacity and transform), not a dependency.
- Match the tool to the size of the job. A one-off transition doesn't justify a
  30-50KB animation runtime.
- Prefer libraries that are actively maintained and widely used.
- For performance, only animate transform, opacity, and filter. Avoid animating
  width, height, or margin.
- Respect prefers-reduced-motion in every animation.
- Tell me which library you're using, and why, before installing anything new.
