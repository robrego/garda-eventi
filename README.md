# Lago di Garda e Dintorni – Events

Next.js prototype: map + list + calendar for events on Lake Garda, Lombardy,
Veneto and Trentino shores plus the hinterland, within about 50 km of
Desenzano del Garda.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000

Canonical URLs, `sitemap.xml`, `robots.txt`, and Open Graph tags (see "SEO
town pages" below) are built from `lib/siteUrl.ts`, which tries
`NEXT_PUBLIC_SITE_URL` first, then Vercel's own
`VERCEL_PROJECT_PRODUCTION_URL` (set automatically on every deployment —
e.g. `garda-app.vercel.app`), then falls back to `http://localhost:3000`
for local dev. Production domain is `https://www.gardaday.com` — set
`NEXT_PUBLIC_SITE_URL=https://www.gardaday.com` in the Vercel project's
environment variables (Production) so canonical/OG/sitemap URLs resolve to
it instead of the `.vercel.app` alias.

Useful commands:

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # eslint
npx tsc --noEmit   # type-check without emitting files
```

## Structure

```
app/
  layout.tsx              # fonts, metadata (metadataBase, default OG/Twitter)
  page.tsx                # server entry point: calls getAllEvents(), mounts EventsApp
  globals.css             # all styles
  sitemap.ts              # MetadataRoute.Sitemap: homepage, /info, town directories + pages
  robots.ts               # MetadataRoute.Robots, points at sitemap.ts
  manifest.ts              # MetadataRoute.Manifest, add-to-home-screen metadata
  opengraph-image.tsx      # default OG/Twitter share image (next/og), inherited by all routes
  info/page.tsx            # "Trasporti" useful-info page
  eventi/                 # IT SEO town pages (see "SEO town pages" below)
    page.tsx               # town directory, grouped by region
    [town]/page.tsx         # one town's upcoming events + Event JSON-LD
  en/events/               # English mirror of app/eventi/, same structure
  api/
    auth/{login,register,logout,me}/route.ts   # session via JWT cookie
    events/{manual,image,desc}/route.ts        # submissions from authenticated users
    cron/scrape/route.ts                       # scraper cron (see below)
components/
  EventsApp.tsx           # main state (date, filters, view, mobile menu)
  DateRibbon.tsx          # 7-day ribbon + week navigation
  Filters.tsx             # date picker + town filter + view selector + IT/EN
  EventList.tsx           # the day's event list (interactive: select/edit/delete)
  EventDisplay.tsx        # presentational pieces shared by EventList and the
                            # static SEO cards: icons, cover placeholder,
                            # source-link detection, date formatting
  EventMap.tsx            # Leaflet map (client-only, dynamic import in EventsApp)
  AuthWidget.tsx           # login/register/logout, opens AddEventForm
  AddEventForm.tsx         # manual event submission (logged-in users)
  EditDescForm.tsx         # override an existing event's description
  AddCoverForm.tsx         # override an existing event's cover image
  LanguageProvider.tsx     # IT/EN context, persisted to localStorage (interactive app only)
  AppHeader.tsx            # header for the interactive app: nav, IT/EN toggle, auth
  SeoPageHeader.tsx        # minimal header for the SEO pages: fixed-locale, no client state
  TownDirectoryBody.tsx    # town-directory page body, reused by app/eventi and app/en/events
  TownPageBody.tsx         # town landing-page body: date-grouped events + JSON-LD script tag
  TownEventCard.tsx        # read-only event card for the SEO pages (no edit/delete/select)
data/
  events.json             # real events collected by hand from official sources
  config.ts               # town coordinates, categories (IT/EN), market days, area grouping
  getEvents.ts            # merges curated + manual + scraped + recurring markets
  scrapers/
    index.ts              # list of active scrapers (SCRAPERS)
    municipium.ts          # generic parser for comuni on the Municipium CMS
lib/
  auth.ts, users.ts       # JWT session (cookie) + users on Vercel Blob
  manualEvents.ts         # events submitted by logged-in users (Blob)
  imageOverrides.ts       # cover-image override for an existing event (Blob)
  descOverrides.ts        # description override for an existing event (Blob)
  i18n.ts                 # IT/EN string dictionary + day/month names
  townSlugs.ts            # town name <-> URL slug (accent-stripped), for the SEO pages
  townPageData.ts         # fetches + filters + groups a town's upcoming events by date
  eventJsonLd.ts           # builds the schema.org Event JSON-LD for a town page
  siteUrl.ts               # resolves the absolute site origin (see "Quick start" above)
vercel.json               # scraper cron schedule
```

## Architecture

- **Next.js App Router**: `app/page.tsx` is a server component that calls
  `getAllEvents()` and mounts `EventsApp` (client component) inside
  `LanguageProvider`. All navigation state (selected date, town filter,
  map/list view, mobile menu) lives in `useState` in `EventsApp`.
- **Event sources**, merged by `getAllEvents()` in `data/getEvents.ts`, in
  priority order: events submitted by hand by logged-in users (Blob),
  events downloaded by the automatic scraper (Blob), curated events in
  `data/events.json`, plus the generated occurrences of recurring weekly
  markets. Image/description overrides (also on Blob) apply on top of any
  source, per event.
- **Authentication**: session via JWT cookie (`lib/auth.ts`), users stored
  on Vercel Blob (`lib/users.ts`). It only exists to tell who can submit
  events/corrections — there's no admin role, anyone who registers can do it.
- **Automatic scraper**: `data/scrapers/` contains the parsers (one per
  confirmed-working source — see below), run by the
  `app/api/cron/scrape/route.ts` cron and saved to Vercel Blob.
  `vercel.json` triggers the cron weekly, but the route only actually
  scrapes every other week (epoch-week parity — standard cron syntax can't
  express "every 2 weeks" without drifting across month boundaries). To
  force an out-of-schedule run: `GET /api/cron/scrape?force=1` with header
  `Authorization: Bearer $CRON_SECRET`.
- **i18n**: IT/EN toggle (`components/LanguageProvider.tsx` +
  `lib/i18n.ts`), choice persisted in `localStorage`. UI strings are
  translated; curated events in `events.json` also have
  `titleEn`/`descEn`. Events submitted by hand or downloaded by the scraper
  have no English version and stay in their original language even with
  the toggle set to EN.
- **Client-only map**: Leaflet requires `window`, so `EventMap.tsx` is
  imported with `dynamic(..., { ssr: false })` in `EventsApp.tsx`.
  Lightweight CARTO Positron tiles (no API key required) for a minimal
  style that makes the event markers stand out.
- **No relational database**: everything dynamic (users, manual events,
  overrides, scraper cache) lives on Vercel Blob as JSON. The natural next
  step remains replacing `events.json` with Supabase (suggested schema
  below) if the volume of data/writes grows.

### SEO town pages

The interactive app (`app/page.tsx`) is a single client-rendered page with
no URL-driven state, so it's effectively one page for Google to index. To
give town-specific searches ("eventi Salò") something to rank,
`app/eventi/[town]/page.tsx` and its English mirror
`app/en/events/[town]/page.tsx` are separate, statically-linked server
pages — one per town, in both languages (`lib/townSlugs.ts` derives the
URL slug from the town name, so a new town added to `TOWN_COORDS` gets a
page automatically, no separate slug list to maintain).

Each town page (`components/TownPageBody.tsx`) fetches that town's
upcoming events via `lib/townPageData.ts` (same `getAllEvents()` used by
the interactive app), renders them read-only
(`components/TownEventCard.tsx` — no select/edit/delete, so no client JS
ships for that), and exports `generateMetadata` with a canonical URL,
`hreflang` alternates linking the IT/EN twin, Open Graph/Twitter tags, and
an embedded `Event` JSON-LD script (`lib/eventJsonLd.ts`). Language on
these pages is fixed by the route, not the interactive app's
`localStorage`-driven toggle (see `SeoPageHeader.tsx` — its language
switch is a real link to the sibling URL). `app/eventi/page.tsx` /
`app/en/events/page.tsx` are directory pages linking every town, grouped by
region (`groupTownsByArea` in `data/config.ts`). `app/sitemap.ts` lists all
of it; `app/robots.ts` points at the sitemap and blocks `/api/` and
`/admin`.

These pages read live Blob-backed data (manual submissions, scraper
output) like the homepage, so they're `force-dynamic` rather than
statically generated at build time — same rationale as `app/page.tsx`.

### Active scraper sources

- **Municipium** (`municipium.ts`): generic parser for comuni on the
  Municipium CMS, which exposes an `/it/eventi/feed` RSS feed — active for
  Peschiera, Garda, Bussolengo, Calvagese della Riviera, Cavaion Veronese,
  Costermano sul Garda, Affi, Brenzone sul Garda (its real domain is
  `comune.brenzone.vr.it`, not the more obvious
  `comune.brenzonesulgarda.vr.it` — always verify the actual domain, don't
  assume the "sul/del Garda" pattern holds), Montichiari, Carpenedolo,
  Brentino Belluno, and Dolcè (the last two confirmed via their
  `*-api.municipiumapp.it` image CDN domain and a structurally valid, if
  currently empty, RSS feed — both feeds and Montichiari/Carpenedolo's
  return HTTP 403 to requests from this dev sandbox, almost certainly a
  Cloudflare/WAF block on the sandbox's IP rather than the towns not
  actually running Municipium; verify the feed is populating from the
  production cron before trusting it fully).

Checked every other town without curated events for a scrapable source on
its own site — none of these have a feed/API, only a real events page as
static HTML, which would need a bespoke, fragile parser per site instead of
one reusable pattern (and breaks the first time the town redesigns its
site), so they're left for hand curation for now:
- **Castelnuovo del Garda, Pastrengo**: WordPress, but no dedicated events
  post type or REST endpoint — checked `/wp-json/wp/v2/types` and
  `/categories` on both, nothing "eventi"-shaped.
- **Muscoline, Bedizzole, Gavardo**: SecovalWEB ("Modello Comuni"), a
  template common among small Brescia-province comuni. Muscoline has a
  static `/pagina*_eventi.html` page; no feed.
- **Lonato del Garda**: Drupal 9, no RSS/JSON:API feed found.
- **Polpenazze del Garda, Prevalle, Puegnago del Garda, Valeggio sul
  Mincio, Tignale, San Zeno di Montagna, Soiano del Lago, Tenno, Dro,
  Arco**: no feed found, CMS not identified beyond that.
- **Roè Volciano, Vobarno, Valvestino, Magasa, Paitone, Nuvolento, Vallio
  Terme, Odolo, Preseglie, Barghe**: same SecovalWEB template as
  Muscoline/Bedizzole/Gavardo (confirms it's common across small
  Brescia-province comuni), `/it/eventi/feed` 404s on all of them, no
  other feed found. Roè Volciano, Vobarno, Paitone, Valvestino and Magasa
  had hand-curatable events on their own site or on `visitvalvestino.it`
  (the shared Alto Garda Bresciano tourism portal for Valvestino/Magasa);
  Nuvolento, Odolo, Preseglie, Barghe had none confirmed for 2026 as of
  2026-07-17.
- **Pozzolengo, Ponti sul Mincio, Monzambano, Volta Mantovana, Rivoli
  Veronese, Ferrara di Monte Baldo, Caprino Veronese, Sant'Ambrogio di
  Valpolicella, Sona, Fumane, Sommacampagna, Drena**: no feed on the
  comune site (mix of MyCity, AGID/Bootstrap-Italia, Magnolia CMS,
  OpenCity Italia, or a WordPress install whose `/it/eventi/feed` is real
  RSS but permanently empty). Ferrara di Monte Baldo, Monzambano, Sona,
  Fumane, Sommacampagna and Drena had hand-curatable events with a primary
  source (comune site or official tourism board); the rest had only
  secondary-press coverage (bresciatoday.it, mantovanotizie.com,
  veronaoggi.it, radiopico.it) or no confirmed 2026 date, so nothing was
  added for them yet.

### Sourcing policy: primary sources only

A scraper (or a manually curated event's `src` citation) must point to the
comune, the tourism board, or the event's own organizer — never a secondary
aggregator that just republishes other people's listings. We briefly had a
GardaClick scraper (`gardaclick.com`, a static HTML table with no feed,
covering the whole Garda area including plenty of out-of-scope towns) and
deliberately removed it: no accountability for an aggregator's accuracy,
and it isn't our data to re-scrape. `panesalamina.com` is excluded for the
same reason. When curating an event by hand, prefer the town's own official
site (e.g. `visitsirmione.com`, `visitmanerba.it`) over a generic listing
site.

### Adding a new source

`data/scrapers/index.ts` only lists verified, primary sources — before
adding one, check whether it exposes a stable RSS/JSON feed (preferred
pattern, see Municipium) and that it's the comune/organizer's own site, not
an aggregator. If it's only scrapable static HTML, write a new parser
following the same pattern (try/catch that returns `[]` on error, never an
exception that blocks the other sources), then add it to the `SCRAPERS`
array. Remember to filter to in-scope towns only (`TOWNS`/`TOWN_COORDS` in
`data/config.ts`) if the source covers a wider area than the lake.

## Design constraints (see also CLAUDE.md)

- **Target audience**: older generation → large text, high contrast, wide
  clickable areas. Don't shrink fonts without a reason.
- **Palette**: no orange/coral. Green (`--green`) for accents, teal
  (`--lake-deep`) for navigation/active states.
- **Minimal strokes**: 1px borders throughout the UI (chips, cards, map),
  consistent with the CARTO map's light style.
- **Font**: Bricolage Grotesque (headings), Work Sans (body text).

## Data

Events in `data/events.json` cover the whole lake within about 50 km of
Desenzano — Lombardy, Veneto and Trentino shores, plus the hinterland —
collected by hand from official sites of comuni, tourist offices and
organizers (not a live feed — dates can change). 50 towns total
(`data/config.ts` → `TOWN_COORDS`), grouped by region in the town filter
(`TOWN_AREAS`/`AREA_ORDER` — region, not shore, since e.g. Peschiera is
administratively Veneto despite sitting at the lake's southern tip):
Lombardia 30, Veneto 15, Trentino 5 towns — see `TOWN_AREAS` in
`data/config.ts` for the full, current list rather than duplicating it
here, since it grows over time. Hinterland towns are within ~1.6-12.1 km of
the nearest coastal town, found by checking each existing town's bordering
comuni on Wikipedia and verifying distance — never estimated from memory,
since a wrong pin is a visible bug on a map.

Out of scope: Verona city, Brescia, Mantova, and fairs hosted at an
exhibition center far from the lake (Fiera di Verona, Fiera di
Montichiari). The up-to-date list of towns and coordinates is always in
`data/config.ts` → `TOWN_COORDS`.

"Fonte" (source) links on event cards point to the source site only when
the `src` field looks like a domain (e.g. `visitsirmione.com`); descriptive
names stay as plain text, so we never invent a URL we haven't verified.

### Adding an event or a town

- **New event**: add a row to `data/events.json` in the same format as the
  others (`date`, `town`, `title`, `cat`, `time`, `desc`, `src`).
  `titleEn`/`descEn` are optional — if missing, the English version of the
  site simply shows the Italian text.
- **New town**: add its coordinates to `TOWN_COORDS`, its market day to
  `MARKET_DAYS` (if known), and its region to `TOWN_AREAS` in
  `data/config.ts` (plus `AREA_LABELS_EN` only if adding a 4th region). The
  dropdown filter, the map, and the SEO town directory/pages (see above)
  all pick it up automatically, no need to touch the components.

## Suggested next steps

1. Replace `events.json` with a Supabase table (schema below) so the app
   can be updated without a new deploy — logged-in users can already do
   this partially today via Blob (manual events and overrides), but it
   stays a flat JSON with no queries/indexes.

### Suggested Supabase schema

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
