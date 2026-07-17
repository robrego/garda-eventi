import type { MetadataRoute } from "next";
import { TOWNS } from "@/data/config";
import { slugifyTown } from "@/lib/townSlugs";
import { SITE_URL } from "@/lib/siteUrl";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/info`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/eventi`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/en/events`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const townEntries: MetadataRoute.Sitemap = TOWNS.flatMap((town) => {
    const slug = slugifyTown(town);
    return [
      { url: `${SITE_URL}/eventi/${slug}`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
      { url: `${SITE_URL}/en/events/${slug}`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    ];
  });

  return [...staticEntries, ...townEntries];
}
