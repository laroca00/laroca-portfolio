import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = [
  "/tr",
  "/tr/projects",
  "/tr/projects/green-future-balcony",
  "/tr/blog",
  "/tr/blog/react-native-ve-next-js",
  "/tr/about",
  "/tr/services",
  "/tr/does-not-exist",
];

for (const path of PAGES) {
  test(`${path} has no serious or critical axe violations`, async ({ page }) => {
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page }).analyze();
    const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });

  test(`${path} has no horizontal overflow`, async ({ page }) => {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("keyboard users reach the contact submit button without a focus trap", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium");
  await page.goto("/tr");
  const submit = page.getByRole("button", { name: "Mesajı gönder" });
  for (let i = 0; i < 80; i++) {
    await page.keyboard.press("Tab");
    if (await submit.evaluate((el) => el === document.activeElement)) return;
  }
  throw new Error("submit button never received focus");
});
