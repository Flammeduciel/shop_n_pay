import fs from "node:fs";
import path from "node:path";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const url = process.env.LIGHTHOUSE_URL ?? "http://localhost:3000/";
const outputDir = path.resolve("docs/lighthouse");
const chromePath = process.env.CHROME_PATH || undefined;

fs.mkdirSync(outputDir, { recursive: true });

const chrome = await chromeLauncher.launch({
  chromePath,
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
});

try {
  const result = await lighthouse(url, {
    port: chrome.port,
    output: ["html", "json"],
    logLevel: "error",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    formFactor: "mobile",
    screenEmulation: {
      mobile: true,
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      disabled: false,
    },
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
    },
  });

  if (!result) {
    throw new Error("Lighthouse n'a renvoyé aucun résultat.");
  }

  const [html, json] = result.report;
  fs.writeFileSync(path.join(outputDir, "rapport-mobile.html"), html);
  fs.writeFileSync(path.join(outputDir, "rapport-mobile.json"), json);

  const categories = result.lhr.categories;
  for (const key of ["performance", "accessibility", "best-practices", "seo"]) {
    console.log(`${key}: ${Math.round((categories[key]?.score ?? 0) * 100)}`);
  }
} finally {
  await chrome.kill();
}
