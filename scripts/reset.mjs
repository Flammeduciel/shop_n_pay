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
  console.log("Suppression des tables...");
  await sql.unsafe(`
    DROP TABLE IF EXISTS orders CASCADE;
    DROP TABLE IF EXISTS products CASCADE;
    DROP TABLE IF EXISTS categories CASCADE;
  `);

  const schema = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8");
  console.log("Application du schéma...");
  await sql.unsafe(schema);

  const seed = readFileSync(new URL("../db/seed.sql", import.meta.url), "utf8");
  console.log("Insertion des données initiales...");
  await sql.unsafe(seed);

  console.log("Réinitialisation terminée.");
  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});