/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Domains event cover photos are actually hosted on today (scraped
    // sources + hand-curated `image` fields in data/events.json), plus the
    // Municipium CDN wildcard. The Municipium scraper (data/scrapers/
    // municipium.ts) pulls each comune's own og:image, so this list grows
    // whenever a new source is added — see the `unoptimized` fallback in
    // lib/imageHosts.ts for what happens to an image whose host isn't here
    // yet (falls back to a plain unoptimized <img>, doesn't break the page).
    remotePatterns: [
      { protocol: "https", hostname: "**.municipiumapp.it" },
      { protocol: "https", hostname: "api.gdb.atexcloud.io" },
      { protocol: "https", hostname: "citynews-bresciatoday.stgy.ovh" },
      { protocol: "https", hostname: "gardatoday.it" },
      { protocol: "https", hostname: "mycity.s3.sbg.io.cloud.ovh.net" },
      { protocol: "https", hostname: "visitmanerba.it" },
      { protocol: "https", hostname: "visitsirmione.com" },
      { protocol: "https", hostname: "www.anfiteatrodelvittoriale.it" },
      { protocol: "https", hostname: "www.comune.salo.bs.it" },
      { protocol: "https", hostname: "www.garda-outdoors.com" },
      { protocol: "https", hostname: "www.gardanotizie.it" },
      { protocol: "https", hostname: "www.gardapost.it" },
      { protocol: "https", hostname: "www.gardatrentino.it" },
      { protocol: "https", hostname: "www.jazzontheroad.net" },
      { protocol: "https", hostname: "www.leonessaopenwater.com" },
      { protocol: "https", hostname: "www.modaestyle.it" },
      { protocol: "https", hostname: "www.musicajazz.it" },
      { protocol: "https", hostname: "www.panesalamina.com" },
      { protocol: "https", hostname: "www.rettore.com" },
      { protocol: "https", hostname: "www.visitlimonesulgarda.com" },
    ],
  },
};
export default nextConfig;
