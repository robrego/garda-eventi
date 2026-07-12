import { NextRequest, NextResponse } from "next/server";
import { getSessionEmail, isAdminEmail } from "@/lib/auth";
import { addHiddenEvent } from "@/lib/hiddenEvents";

export const dynamic = "force-dynamic";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Deleting is restricted to the admin allowlist, unlike adding/correcting
// events which stays open to any registered user — removal is the one
// action that isn't easily discoverable/undoable by a normal visitor.
export async function POST(req: NextRequest) {
  const email = await getSessionEmail();
  if (!isAdminEmail(email)) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const date = typeof body?.date === "string" ? body.date : "";
  const town = typeof body?.town === "string" ? body.town : "";
  const title = typeof body?.title === "string" ? body.title : "";

  if (!DATE_RE.test(date) || !town || !title) {
    return NextResponse.json({ error: "Evento non valido" }, { status: 400 });
  }

  await addHiddenEvent({ date, town, title, hiddenBy: email });

  return NextResponse.json({ ok: true });
}
