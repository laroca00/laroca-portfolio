import { expect, test } from "@playwright/test";

test.describe("locale routing", () => {
  test("German browser falls back to /tr while de is disabled", async ({ browser }) => {
    const ctx = await browser.newContext({ locale: "de-DE", extraHTTPHeaders: { "Accept-Language": "de-DE,de;q=0.9" } });
    const page = await ctx.newPage();
    const res = await page.goto("/");
    expect(res?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe("/tr");
    await ctx.close();
  });

  test("Turkish browser lands on /tr", async ({ browser }) => {
    const ctx = await browser.newContext({ extraHTTPHeaders: { "Accept-Language": "tr-TR" } });
    const page = await ctx.newPage();
    await page.goto("/");
    expect(new URL(page.url()).pathname).toBe("/tr");
    await ctx.close();
  });

  for (const path of ["/de", "/en/projects", "/it/blog/x"]) {
    test(`disabled locale ${path} is 404`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(404);
    });
  }

  test("unknown Turkish page shows Turkish 404", async ({ page }) => {
    const res = await page.goto("/tr/does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Sayfa bulunamadı" })).toBeVisible();
  });

  test("html lang is tr", async ({ page }) => {
    await page.goto("/tr");
    await expect(page.locator("html")).toHaveAttribute("lang", "tr");
  });
});
