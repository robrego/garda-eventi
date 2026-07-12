import { get, put } from "@vercel/blob";

export const IMAGE_OVERRIDES_BLOB_PATHNAME = "garda-image-overrides.json";

export type ImageOverride = { date: string; town: string; title: string; image: string; addedBy: string; createdAt: string };

function key(o: { date: string; town: string; title: string }): string {
  return `${o.date}|${o.town}|${o.title.toLowerCase()}`;
}

export async function readImageOverrides(): Promise<ImageOverride[]> {
  try {
    const result = await get(IMAGE_OVERRIDES_BLOB_PATHNAME, { access: "private" });
    if (!result?.stream) return [];
    const text = await new Response(result.stream).text();
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// Keyed the same way as getEvents.ts' dedupe, so an override always lands
// on the right event regardless of which source (curated/scraped/manual)
// it came from. A resubmission for the same event replaces the old one.
export async function addImageOverride(override: Omit<ImageOverride, "createdAt">): Promise<void> {
  const overrides = await readImageOverrides();
  const filtered = overrides.filter((o) => key(o) !== key(override));
  filtered.push({ ...override, createdAt: new Date().toISOString() });
  await put(IMAGE_OVERRIDES_BLOB_PATHNAME, JSON.stringify(filtered), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

// Used by the admin dashboard to revert a cover back to whatever the
// underlying event (curated/scraped/manual) had before the override.
export async function removeImageOverride(target: { date: string; town: string; title: string }): Promise<void> {
  const overrides = await readImageOverrides();
  const filtered = overrides.filter((o) => key(o) !== key(target));
  await put(IMAGE_OVERRIDES_BLOB_PATHNAME, JSON.stringify(filtered), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export function imageOverrideKey(o: { date: string; town: string; title: string }): string {
  return key(o);
}
