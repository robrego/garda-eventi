import { NextRequest, NextResponse } from "next/server";
import { getSessionEmail } from "@/lib/auth";
import { addImageOverride } from "@/lib/imageOverrides";

export const dynamic = "force-dynamic";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function POST(req: NextRequest) {
  const email = await getSessionEmail();
  if (!email) {
    return NextResponse.json({ error: "Devi accedere per aggiungere una copertina" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const date = typeof body?.date === "string" ? body.date : "";
  const town = typeof body?.town === "string" ? body.town : "";
  const title = typeof body?.title === "string" ? body.title : "";
  const image = typeof body?.image === "string" ? body.image.trim() : "";

  if (!DATE_RE.test(date) || !town || !title) {
    return NextResponse.json({ error: "Evento non valido" }, { status: 400 });
  }
  if (!/^(https?:\/\/|\/api\/cover\/)/.test(image)) {
    return NextResponse.json({ error: "L'immagine deve essere un URL http(s)" }, { status: 400 });
  }

  await addImageOverride({ date, town, title, image, addedBy: email });

  return NextResponse.json({ ok: true });
}
