import { NextRequest, NextResponse } from "next/server";
import { getSessionEmail } from "@/lib/auth";
import { addDescOverride } from "@/lib/descOverrides";

export const dynamic = "force-dynamic";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function POST(req: NextRequest) {
  const email = await getSessionEmail();
  if (!email) {
    return NextResponse.json({ error: "Devi accedere per modificare la descrizione" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const date = typeof body?.date === "string" ? body.date : "";
  const town = typeof body?.town === "string" ? body.town : "";
  const title = typeof body?.title === "string" ? body.title : "";
  const desc = typeof body?.desc === "string" ? body.desc.trim() : "";

  if (!DATE_RE.test(date) || !town || !title) {
    return NextResponse.json({ error: "Evento non valido" }, { status: 400 });
  }
  if (!desc) {
    return NextResponse.json({ error: "La descrizione non può essere vuota" }, { status: 400 });
  }

  await addDescOverride({ date, town, title, desc: desc.slice(0, 500), addedBy: email });

  return NextResponse.json({ ok: true });
}
