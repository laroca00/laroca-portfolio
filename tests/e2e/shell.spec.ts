import { expect, test } from "@playwright/test";

test("no horizontal scroll at 360px", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto("/tr");
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(360);
});

test("skip link is the first tab stop and focuses main", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium");
  await page.goto("/tr");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "İçeriğe geç" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});

test("page background is warm paper", async ({ page }) => {
  await page.goto("/tr");
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe("rgb(246, 241, 228)");
});
