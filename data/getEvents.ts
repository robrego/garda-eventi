import rawEvents from "./events.json";
import { MARKET_DAYS, EventItem } from "./config";

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}
function addDays(d: Date, n: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

/**
 * Returns the full event list: curated real events from events.json plus
 * generated weekly market entries for a rolling window around today.
 */
export function getAllEvents(): EventItem[] {
  const events: EventItem[] = rawEvents.map((e, i) => ({ id: `ev${i}`, ...e }));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let idCounter = events.length;
  for (let i = -3; i < 32; i++) {
    const d = addDays(today, i);
    const dow = d.getDay();
    const towns = MARKET_DAYS[dow];
    if (!towns) continue;
    towns.forEach((town) => {
      events.push({
        id: `market${idCounter++}`,
        date: iso(d),
        town,
        title: "Mercato settimanale",
        cat: "market",
        time: "08:00–13:00",
        desc: `Bancarelle di prodotti locali, frutta e verdura, formaggi e articoli vari nel centro di ${town}.`,
        src: "Calendario mercati settimanali Lago di Garda",
      });
    });
  }

  return events;
}
