import postgres from "postgres";

const connectionString = (process.env.DATABASE_URL ?? "").trim();

const sslMode = (process.env.DATABASE_SSL ?? "prefer").toLowerCase();
const ssl =
  sslMode === "disable"
    ? false
    : sslMode === "require"
      ? "require"
      : "prefer";

export const db = connectionString ? postgres(connectionString, { ssl }) : null;

export function hasDatabase(): boolean {
  return db !== null;
}