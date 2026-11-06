import { readFileSync } from "node:fs";
import postgres from "postgres";

const url = (process.env.DATABASE_URL ?? "").trim();
if (!url) {
  console.error("DATABASE_URL manquant. Renseignez-le dans .env.local puis relancez.");
  process.exit(1);
}

const sql = postgres(url, { ssl: process.env.DATABASE_SSL === "disable" ? false : "prefer" });

const schema = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8");
const seed = readFileSync(new URL("../db/seed.sql", import.meta.url), "utf8");

async function main() {
  console.log("Application du schéma...");
  await sql.unsafe(schema);
  console.log("Insertion des données initiales...");
  await sql.unsafe(seed);
  console.log("Terminé.");
  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});