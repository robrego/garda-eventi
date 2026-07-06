import { NextResponse } from "next/server";
import { getSessionEmail } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const email = await getSessionEmail();
  return NextResponse.json({ email });
}
