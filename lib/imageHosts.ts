// Mirrors next.config.mjs `images.remotePatterns`. next/image throws at
// render time for a src whose host isn't allow-listed there — since the
// Municipium scraper (data/scrapers/municipium.ts) pulls each comune's own
// og:image, new hosts show up over time without warning. Components use
// this to fall back to `unoptimized` for anything not (yet) in the list,
// so an unrecognized host degrades to a plain <img> instead of crashing.
const MUNICIPIUM_SUFFIX = ".municipiumapp.it";

const ALLOWED_HOSTS = new Set([
  "api.gdb.atexcloud.io",
  "citynews-bresciatoday.stgy.ovh",
  "gardatoday.it",
  "mycity.s3.sbg.io.cloud.ovh.net",
  "visitmanerba.it",
  "visitsirmione.com",
  "www.anfiteatrodelvittoriale.it",
  "www.comune.salo.bs.it",
  "www.garda-outdoors.com",
  "www.gardanotizie.it",
  "www.gardapost.it",
  "www.gardatrentino.it",
  "www.jazzontheroad.net",
  "www.leonessaopenwater.com",
  "www.modaestyle.it",
  "www.musicajazz.it",
  "www.panesalamina.com",
  "www.rettore.com",
  "www.visitlimonesulgarda.com",
  "upload.wikimedia.org",
]);

export function isOptimizableImageHost(src: string): boolean {
  try {
    const { hostname } = new URL(src);
    return hostname.endsWith(MUNICIPIUM_SUFFIX) || ALLOWED_HOSTS.has(hostname);
  } catch {
    return false;
  }
}
