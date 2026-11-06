import postgres from "postgres";

const connectionString = (process.env.DATABASE_URL ?? "").trim();

export const db = connectionString
  ? postgres(connectionString, { ssl: process.env.DATABASE_SSL === "disable" ? false : "prefer" })
  : null;

export function hasDatabase(): boolean {
  return db !== null;
}