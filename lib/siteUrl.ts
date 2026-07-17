// Server-only: canonical URLs, sitemap.xml, robots.txt, and Open Graph tags
// all need an absolute site origin.
//
// `NEXT_PUBLIC_SITE_URL` is the intended long-term source (set it once a
// real domain is live). Until then, `VERCEL_PROJECT_PRODUCTION_URL` is a
// Vercel system env var set automatically on every deployment — it's the
// project's stable production alias (e.g. "garda-app.vercel.app"), unlike
// `VERCEL_URL` which changes with every deployment. Falling back to that
// instead of a bare "localhost" default means production never serves a
// localhost canonical/OG URL just because the env var hasn't been set yet.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  "http://localhost:3000";
