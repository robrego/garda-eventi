import { del, put } from "@vercel/blob";
import { readImageOverrides, IMAGE_OVERRIDES_BLOB_PATHNAME } from "@/lib/imageOverrides";
import { readManualEvents, MANUAL_EVENTS_BLOB_PATHNAME } from "@/lib/manualEvents";

const COVER_PREFIX = "/api/cover/";

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function blobPathname(image: string): string | null {
  return image.startsWith(COVER_PREFIX) ? image.slice(COVER_PREFIX.length) : null;
}

// Covers only earn their keep while the event is still upcoming — once the
// date has passed nobody browses to it anymore, so we reclaim the Blob
// storage rather than let uploads accumulate forever. Runs as a step in the
// scrape cron (see app/api/cron/scrape/route.ts), which already ticks
// weekly, so a same-week lag before cleanup is fine.
export async function cleanupPastCovers(): Promise<{ deleted: number }> {
  const today = todayISO();
  const pathnamesToDelete: string[] = [];

  const overrides = await readImageOverrides();
  const keptOverrides = overrides.filter((o) => {
    if (o.date >= today) return true;
    const pathname = blobPathname(o.image);
    if (pathname) pathnamesToDelete.push(pathname);
    return false;
  });
  if (keptOverrides.length !== overrides.length) {
    await put(IMAGE_OVERRIDES_BLOB_PATHNAME, JSON.stringify(keptOverrides), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  }

  const manualEvents = await readManualEvents();
  let manualChanged = false;
  const prunedManualEvents = manualEvents.map((e) => {
    if (!e.image || e.date >= today) return e;
    const pathname = blobPathname(e.image);
    if (pathname) pathnamesToDelete.push(pathname);
    manualChanged = true;
    const { image: _image, ...rest } = e;
    return rest;
  });
  if (manualChanged) {
    await put(MANUAL_EVENTS_BLOB_PATHNAME, JSON.stringify(prunedManualEvents), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  }

  if (pathnamesToDelete.length > 0) {
    await del(pathnamesToDelete);
  }

  return { deleted: pathnamesToDelete.length };
}
