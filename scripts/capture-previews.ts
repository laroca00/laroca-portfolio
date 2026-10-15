/**
 * Captures a tall screenshot of every project's live site into
 * public/projects/<slug>/preview.jpg. Re-run whenever a live site changes:
 *
 *   npm run capture:previews              # every project with a liveUrl
 *   npm run capture:previews -- akgun     # only the given slugs
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import matter from "gray-matter";

const WIDTH = 1440;
const MAX_HEIGHT = 3600;

const projectsDir = path.join(process.cwd(), "content/tr/projects");
const only = process.argv.slice(2);

const targets = fs
  .readdirSync(projectsDir)
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => ({ slug: f.replace(/\.mdx$/, ""), liveUrl: matter.read(path.join(projectsDir, f)).data.liveUrl }))
  .filter((p): p is { slug: string; liveUrl: string } => typeof p.liveUrl === "string")
  .filter((p) => only.length === 0 || only.includes(p.slug));

async function main() {
  const browser = await chromium.launch();
  for (const { slug, liveUrl } of targets) {
    const page = await browser.newPage({ viewport: { width: WIDTH, height: 900 }, reducedMotion: "reduce" });
    await page.goto(liveUrl, { waitUntil: "load", timeout: 60_000 });
    await page.waitForTimeout(3000);
    // Dismiss cookie banners with the most privacy-preserving choice so they don't end up in the shot.
    const decline = page.getByRole("button", { name: /essential only|reject|decline|reddet|yalnızca gerekli/i });
    if (await decline.first().isVisible()) await decline.first().click();
    // Walk down the page so lazy-loaded images and scroll reveals fire, then return to the top.
    for (let y = 0; y < MAX_HEIGHT; y += 600) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(250);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    const height = Math.min(MAX_HEIGHT, await page.evaluate(() => document.documentElement.scrollHeight));
    const file = path.join(process.cwd(), "public/projects", slug, "preview.jpg");
    fs.mkdirSync(path.dirname(file), { recursive: true });
    await page.screenshot({
      path: file,
      type: "jpeg",
      quality: 72,
      fullPage: true,
      clip: { x: 0, y: 0, width: WIDTH, height },
    });
    console.log(`✓ ${slug} → ${path.relative(process.cwd(), file)} (${WIDTH}×${height})`);
    await page.close();
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
