import { expect, test } from "@playwright/test";

test("Ctrl+K lazy-loads and opens the palette, then navigates", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard shortcut is a desktop affordance");
  await page.goto("/tr", { waitUntil: "networkidle" });
  await page.keyboard.press("Control+k");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.type("empower");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/tr\/projects\/empower-eu$/);
});

test("the nav button opens the palette (mobile menu)", async ({ page }) => {
  await page.goto("/tr");
  await page.getByRole("button", { name: "Komut paletini aç" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("option", { name: "Projeler" })).toBeVisible();
});
