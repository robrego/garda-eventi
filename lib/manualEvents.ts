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

// New submissions default to 'pending': they need a moderator's approval
// before showing up on the public site (see /admin and /api/admin/approve).
export async function addManualEvent(event: RawEvent): Promise<void> {
  const events = await readManualEvents();
  events.push({ ...event, source: "user", status: "pending", createdAt: new Date().toISOString() });
  await put(MANUAL_EVENTS_BLOB_PATHNAME, JSON.stringify(events), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

// Used by the moderation page to publish a pending submission.
export async function approveManualEvent(target: { date: string; town: string; title: string }): Promise<void> {
  const events = await readManualEvents();
  const updated = events.map((e) =>
    e.date === target.date && e.town === target.town && e.title.toLowerCase() === target.title.toLowerCase()
      ? { ...e, status: "approved" as const }
      : e
  );
  await put(MANUAL_EVENTS_BLOB_PATHNAME, JSON.stringify(updated), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

// Used by the admin dashboard to undo a submission entirely, rather than
// just hiding it (a manual event has no other source to fall back to).
export async function removeManualEvent(target: { date: string; town: string; title: string }): Promise<void> {
  const events = await readManualEvents();
  const filtered = events.filter(
    (e) => !(e.date === target.date && e.town === target.town && e.title.toLowerCase() === target.title.toLowerCase())
  );
  await put(MANUAL_EVENTS_BLOB_PATHNAME, JSON.stringify(filtered), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}
