import { scryptSync, timingSafeEqual } from "node:crypto";

const SALT = "shoppay-demo-2026";

function hash(value: string): Buffer {
  return scryptSync(value, SALT, 32);
}

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export function verifyDemoCredentials(
  email: string,
  password: string,
): DemoUser | null {
  const expectedEmail = (process.env.AUTH_DEMO_EMAIL ?? "demo@shoppay.cm").trim().toLowerCase();
  const expectedPassword = process.env.AUTH_DEMO_PASSWORD ?? "Demo1234!";

  if (email.trim().toLowerCase() !== expectedEmail) return null;
  if (!password) return null;

  const provided = hash(password);
  const expected = hash(expectedPassword);

  if (provided.length !== expected.length) return null;
  if (!timingSafeEqual(provided, expected)) return null;

  return {
    id: "demo-client",
    name: "Client démo",
    email: expectedEmail,
    role: "client",
  };
}
