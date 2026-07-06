import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/users";
import { createSession, hashPassword, isValidEmail } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Email non valida" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "La password deve avere almeno 8 caratteri" }, { status: 400 });
  }

  try {
    const passwordHash = await hashPassword(password);
    await createUser(email, passwordHash);
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_TAKEN") {
      return NextResponse.json({ error: "Esiste già un account con questa email" }, { status: 409 });
    }
    return NextResponse.json({ error: "Errore durante la registrazione" }, { status: 500 });
  }

  await createSession(email.toLowerCase());
  return NextResponse.json({ ok: true, email: email.toLowerCase() });
}
