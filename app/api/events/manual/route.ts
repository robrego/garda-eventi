import { NextRequest, NextResponse } from "next/server";
import { getSessionEmail } from "@/lib/auth";
import { addManualEvent } from "@/lib/manualEvents";
import { TOWNS, CATEGORIES } from "@/data/config";

export const dynamic = "force-dynamic";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function POST(req: NextRequest) {
  const email = await getSessionEmail();
  if (!email) {
    return NextResponse.json({ error: "Devi accedere per aggiungere un evento" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const date = typeof body?.date === "string" ? body.date : "";
  const town = typeof body?.town === "string" ? body.town : "";
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const cat = typeof body?.cat === "string" ? body.cat : "";
  const time = typeof body?.time === "string" ? body.time.trim() : "";
  const desc = typeof body?.desc === "string" ? body.desc.trim() : "";
  const src = typeof body?.src === "string" ? body.src.trim() : "";
  const image = typeof body?.image === "string" ? body.image.trim() : "";
  const url = typeof body?.url === "string" ? body.url.trim() : "";

  if (!DATE_RE.test(date)) {
    return NextResponse.json({ error: "Data non valida" }, { status: 400 });
  }
  if (!TOWNS.includes(town)) {
    return NextResponse.json({ error: "Città non valida" }, { status: 400 });
  }
  if (!Object.keys(CATEGORIES).includes(cat)) {
    return NextResponse.json({ error: "Categoria non valida" }, { status: 400 });
  }
  if (!title || title.length > 200) {
    return NextResponse.json({ error: "Titolo mancante o troppo lungo" }, { status: 400 });
  }
  if (image && !/^(https?:\/\/|\/api\/cover\/)/.test(image)) {
    return NextResponse.json({ error: "L'immagine deve essere un URL http(s)" }, { status: 400 });
  }
  if (url && !/^https?:\/\//.test(url)) {
    return NextResponse.json({ error: "Il link deve essere un URL http(s)" }, { status: 400 });
  }

  await addManualEvent({
    date,
    town,
    title,
    cat,
    time: time || "Vedi descrizione",
    desc: desc.slice(0, 500),
    src: src || `Aggiunto da ${email}`,
    ...(image ? { image } : {}),
    ...(url ? { url } : {}),
    addedBy: email,
  });

  return NextResponse.json({ ok: true });
}
