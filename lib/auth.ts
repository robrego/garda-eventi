import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const SESSION_COOKIE = "garda_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 90; // 90 days

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(email: string) {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secretKey());

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export function clearSession() {
  cookies().delete(SESSION_COOKIE);
}

export async function getSessionEmail(): Promise<string | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return typeof payload.email === "string" ? payload.email : null;
  } catch {
    return null;
  }
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Gate for the /admin moderation dashboard and for deleting events.
// Comma-separated allowlist in the ADMIN_EMAILS env var — not a "role"
// stored per-user, since there's no admin role in the data model, just a
// short trusted list.
export function isAdminEmail(email: string | null): email is string {
  if (!email) return false;
  const allowlist = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowlist.includes(email.toLowerCase());
}

// Trusted collaborators (e.g. a tourism-office contact) whose event
// submissions publish immediately instead of sitting in the /admin
// moderation queue — same allowlist pattern as isAdminEmail, but without
// admin/delete rights.
export function isTrustedSubmitterEmail(email: string | null): email is string {
  if (!email) return false;
  const allowlist = (process.env.TRUSTED_SUBMITTER_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowlist.includes(email.toLowerCase());
}
