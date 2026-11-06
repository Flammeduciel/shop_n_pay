import { readFileSync } from "node:fs";
import postgres from "postgres";

try { process.loadEnvFile(".env.local"); } catch {}

const url = (process.env.DATABASE_URL ?? "").trim();
if (!url) {
  console.error("DATABASE_URL manquant. Renseignez-le dans .env.local puis relancez.");
  process.exit(1);
}

const sslMode = (process.env.DATABASE_SSL ?? "prefer").toLowerCase();
const ssl =
  sslMode === "disable" ? false : sslMode === "require" ? "require" : "prefer";

const sql = postgres(url, { ssl });

async function main() {
  const seed = readFileSync(new URL("../db/seed.sql", import.meta.url), "utf8");
  console.log("Insertion des données initiales...");
  await sql.unsafe(seed);
  console.log("Terminé.");
  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});