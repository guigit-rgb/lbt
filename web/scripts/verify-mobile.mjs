import { webkit, devices } from "playwright";

const BASE = process.argv[2] || "http://localhost:3000";
const outDir = process.argv[3] || "/tmp/lbt-shots";

import { mkdirSync } from "node:fs";
mkdirSync(outDir, { recursive: true });

const browser = await webkit.launch();

async function shot(name, { device, colorScheme, width, height, path }) {
  const context = await browser.newContext({
    ...(device || {}),
    ...(width ? { viewport: { width, height: height || 900 } } : {}),
    colorScheme: colorScheme || "light",
  });
  const page = await context.newPage();
  await page.goto(BASE + (path || "/"), { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const scrollInfo = await page.evaluate(() => ({
    docScrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  const catband = await page.$(".catband .wrap");
  let catbandInfo = null;
  if (catband) {
    catbandInfo = await catband.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      childCount: el.children.length,
      rectHeight: el.getBoundingClientRect().height,
      overflowX: getComputedStyle(el).overflowX,
    }));
  }
  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: false });
  console.log(JSON.stringify({ name, bg, scrollInfo, catbandInfo }, null, 2));
  await context.close();
}

await shot("iphone-home", { device: devices["iPhone 14"], path: "/" });
await shot("iphone-home-dark-emulated", { device: devices["iPhone 14"], colorScheme: "dark", path: "/" });
await shot("iphone-connexion", { device: devices["iPhone 14"], path: "/compte/connexion" });
await shot("desktop-home", { width: 1440, height: 1000, path: "/" });

await browser.close();
