import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { db, hasDatabase } from "./db";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const computed = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (computed.length !== expected.length) return false;
  return timingSafeEqual(computed, expected);
}

export async function findUserByEmail(email: string): Promise<
  | { id: string; name: string; email: string; passwordHash: string }
  | null
> {
  if (!hasDatabase() || !db) return null;

  const rows = await db<
    { id: string; name: string; email: string; password_hash: string }[]
  >`
    SELECT id, name, email, password_hash
    FROM users
    WHERE email = ${email.trim().toLowerCase()}
    LIMIT 1
  `;

  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
  };
}

export async function createUser(
  name: string,
  email: string,
  password: string,
): Promise<AppUser> {
  if (!hasDatabase() || !db) {
    throw new Error("Base de données indisponible.");
  }

  const id = `user-${Date.now()}`;
  const passwordHash = hashPassword(password);

  await db`
    INSERT INTO users (id, name, email, password_hash)
    VALUES (${id}, ${name.trim()}, ${email.trim().toLowerCase()}, ${passwordHash})
  `;

  return {
    id,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role: "client",
  };
}

export { verifyPassword };