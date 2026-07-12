import { get, put } from "@vercel/blob";

export const DESC_OVERRIDES_BLOB_PATHNAME = "garda-desc-overrides.json";

export type DescOverride = { date: string; town: string; title: string; desc: string; addedBy: string; createdAt: string };

function key(o: { date: string; town: string; title: string }): string {
  return `${o.date}|${o.town}|${o.title.toLowerCase()}`;
}

export async function readDescOverrides(): Promise<DescOverride[]> {
  try {
    const result = await get(DESC_OVERRIDES_BLOB_PATHNAME, { access: "private" });
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
export async function addDescOverride(override: Omit<DescOverride, "createdAt">): Promise<void> {
  const overrides = await readDescOverrides();
  const filtered = overrides.filter((o) => key(o) !== key(override));
  filtered.push({ ...override, createdAt: new Date().toISOString() });
  await put(DESC_OVERRIDES_BLOB_PATHNAME, JSON.stringify(filtered), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

// Used by the admin dashboard to revert a description back to whatever the
// underlying event (curated/scraped/manual) had before the correction.
export async function removeDescOverride(target: { date: string; town: string; title: string }): Promise<void> {
  const overrides = await readDescOverrides();
  const filtered = overrides.filter((o) => key(o) !== key(target));
  await put(DESC_OVERRIDES_BLOB_PATHNAME, JSON.stringify(filtered), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export function descOverrideKey(o: { date: string; town: string; title: string }): string {
  return key(o);
}
