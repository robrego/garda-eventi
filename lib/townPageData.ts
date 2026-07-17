import { getAllEvents } from "@/data/getEvents";
import { EventItem } from "@/data/config";

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function getUpcomingTownEvents(town: string): Promise<EventItem[]> {
  const { events } = await getAllEvents();
  const today = todayISO();
  return events
    .filter((e) => e.town === town && e.date >= today)
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      if (!!a.url !== !!b.url) return a.url ? -1 : 1;
      return a.time.localeCompare(b.time);
    });
}

export function groupEventsByDate(events: EventItem[]): { date: string; events: EventItem[] }[] {
  const groups: { date: string; events: EventItem[] }[] = [];
  for (const e of events) {
    const last = groups[groups.length - 1];
    if (last && last.date === e.date) last.events.push(e);
    else groups.push({ date: e.date, events: [e] });
  }
  return groups;
}
