import { NextRequest, NextResponse } from "next/server";
import { getSessionEmail, isAdminEmail } from "@/lib/auth";
import { removeManualEvent } from "@/lib/manualEvents";
import { removeHiddenEvent } from "@/lib/hiddenEvents";
import { removeImageOverride } from "@/lib/imageOverrides";
import { removeDescOverride } from "@/lib/descOverrides";

export const dynamic = "force-dynamic";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TYPES = ["manual", "hidden", "image", "desc"] as const;

export async function POST(req: NextRequest) {
  const email = await getSessionEmail();
  if (!isAdminEmail(email)) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const type = TYPES.includes(body?.type) ? (body.type as (typeof TYPES)[number]) : null;
  const date = typeof body?.date === "string" ? body.date : "";
  const town = typeof body?.town === "string" ? body.town : "";
  const title = typeof body?.title === "string" ? body.title : "";

  if (!type || !DATE_RE.test(date) || !town || !title) {
    return NextResponse.json({ error: "Richiesta non valida" }, { status: 400 });
  }

  const target = { date, town, title };
  if (type === "manual") await removeManualEvent(target);
  else if (type === "hidden") await removeHiddenEvent(target);
  else if (type === "image") await removeImageOverride(target);
  else if (type === "desc") await removeDescOverride(target);

  return NextResponse.json({ ok: true });
}
