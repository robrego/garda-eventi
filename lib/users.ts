import { get, put } from "@vercel/blob";

const USERS_BLOB_PATHNAME = "garda-users.json";

export type StoredUser = {
  email: string;
  passwordHash: string;
  createdAt: string;
};

async function readUsers(): Promise<StoredUser[]> {
  try {
    const result = await get(USERS_BLOB_PATHNAME, { access: "private" });
    if (!result?.stream) return [];
    const text = await new Response(result.stream).text();
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeUsers(users: StoredUser[]): Promise<void> {
  await put(USERS_BLOB_PATHNAME, JSON.stringify(users), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function findUser(email: string): Promise<StoredUser | null> {
  const users = await readUsers();
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email === normalized) ?? null;
}

/**
 * Not safe against a true race (two signups for the same email at the
 * exact same instant) — Blob has no atomic read-modify-write. Acceptable
 * at this app's scale (a handful of known contributors).
 */
export async function createUser(email: string, passwordHash: string): Promise<StoredUser> {
  const users = await readUsers();
  const normalized = email.trim().toLowerCase();
  if (users.some((u) => u.email === normalized)) {
    throw new Error("EMAIL_TAKEN");
  }
  const user: StoredUser = { email: normalized, passwordHash, createdAt: new Date().toISOString() };
  users.push(user);
  await writeUsers(users);
  return user;
}
