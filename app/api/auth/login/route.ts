import { NextRequest, NextResponse } from "next/server";
import { findUser } from "@/lib/users";
import { createSession, verifyPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

const GENERIC_ERROR = "Email o password non corretti";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const user = await findUser(email);
  if (!user) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  await createSession(user.email);
  return NextResponse.json({ ok: true, email: user.email });
}
