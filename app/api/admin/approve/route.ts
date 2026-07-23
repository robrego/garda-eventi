import { NextRequest, NextResponse } from "next/server";
import { getSessionEmail, isAdminEmail } from "@/lib/auth";
import { approveManualEvent } from "@/lib/manualEvents";

export const dynamic = "force-dynamic";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Publishes a pending user submission. Same admin gate as /api/events/hide
// and /api/admin/revert — no separate moderator role in the data model.
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

  await approveManualEvent({ date, town, title });

  return NextResponse.json({ ok: true });
}
