import { get, put } from "@vercel/blob";
import { RawEvent } from "@/data/getEvents";

export const MANUAL_EVENTS_BLOB_PATHNAME = "garda-manual-events.json";

export async function readManualEvents(): Promise<RawEvent[]> {
  try {
    const result = await get(MANUAL_EVENTS_BLOB_PATHNAME, { access: "private" });
    if (!result?.stream) return [];
    const text = await new Response(result.stream).text();
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function addManualEvent(event: RawEvent): Promise<void> {
  const events = await readManualEvents();
  events.push(event);
  await put(MANUAL_EVENTS_BLOB_PATHNAME, JSON.stringify(events), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}
