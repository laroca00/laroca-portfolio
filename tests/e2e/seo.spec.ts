import { expect, test } from "@playwright/test";

test("sitemap lists localized pages and projects only for enabled locales", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  const xml = await res.text();
  expect(xml).toContain("/tr/projects/green-future-balcony");
  expect(xml).toContain("/tr/blog/react-native-ve-next-js");
  expect(xml).not.toMatch(/\/(en|de|it)\//);
});

test("robots.txt references the sitemap", async ({ request }) => {
  const txt = await (await request.get("/robots.txt")).text();
  expect(txt).toMatch(/Sitemap: .*\/sitemap\.xml/);
});

test("home has hreflang, a working og:image and Person JSON-LD", async ({ page, request }) => {
  await page.goto("/tr");
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/tr$/);

  const og = await page.locator('meta[property="og:image"]').first().getAttribute("content");
  expect(og).toBeTruthy();
  const img = await request.get(new URL(og!).pathname + new URL(og!).search);
  expect(img.status()).toBe(200);
  expect(img.headers()["content-type"]).toContain("image/png");

  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
  expect(ld["@type"]).toBe("Person");
  expect(ld.name).toBe("Tuğberk Emre Akkurt");
});

test("project page title uses the template and has its own og:image", async ({ page, request }) => {
  await page.goto("/tr/projects/online-pisti");
  await expect(page).toHaveTitle("Online Pişti · LaRoca");
  const og = await page.locator('meta[property="og:image"]').first().getAttribute("content");
  const img = await request.get(new URL(og!).pathname);
  expect(img.status()).toBe(200);
});
