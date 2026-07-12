import { get, put } from "@vercel/blob";

export const HIDDEN_EVENTS_BLOB_PATHNAME = "garda-hidden-events.json";

export type HiddenEvent = { date: string; town: string; title: string; hiddenBy: string; createdAt: string };

function key(o: { date: string; town: string; title: string }): string {
  return `${o.date}|${o.town}|${o.title.toLowerCase()}`;
}

export async function readHiddenEvents(): Promise<HiddenEvent[]> {
  try {
    const result = await get(HIDDEN_EVENTS_BLOB_PATHNAME, { access: "private" });
    if (!result?.stream) return [];
    const text = await new Response(result.stream).text();
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// Keyed the same way as getEvents.ts' dedupe, so a deletion always lands on
// the right event regardless of which source (curated/scraped/manual) it
// came from. Non-destructive: this is an overlay filtered out at read time,
// same mechanism as descOverrides/imageOverrides, so nothing in
// events.json or the scraper cache is ever actually touched.
export async function addHiddenEvent(entry: Omit<HiddenEvent, "createdAt">): Promise<void> {
  const hidden = await readHiddenEvents();
  const filtered = hidden.filter((o) => key(o) !== key(entry));
  filtered.push({ ...entry, createdAt: new Date().toISOString() });
  await put(HIDDEN_EVENTS_BLOB_PATHNAME, JSON.stringify(filtered), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

// Used by the admin dashboard to restore a deleted event.
export async function removeHiddenEvent(target: { date: string; town: string; title: string }): Promise<void> {
  const hidden = await readHiddenEvents();
  const filtered = hidden.filter((o) => key(o) !== key(target));
  await put(HIDDEN_EVENTS_BLOB_PATHNAME, JSON.stringify(filtered), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export function hiddenEventKey(o: { date: string; town: string; title: string }): string {
  return key(o);
}
