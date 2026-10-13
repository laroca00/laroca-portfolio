import { expect, test, type Page } from "@playwright/test";

const TITLES = ["Green Future Balcony", "EmpowerEU", "Online Pişti", "Sırpça Öğren"];

async function expectAllContentVisible(page: Page) {
  await page.goto("/tr");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByTestId("typed-line")).toContainText("mobile · web · backend · games");
  for (const title of TITLES) {
    const section = page.getByRole("region", { name: title });
    const cover = section.getByTestId("project-cover");
    await cover.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await expect(section.getByRole("heading", { level: 2 })).toBeVisible();
    await expect.poll(() => cover.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  }
}

test("everything is visible with reduced motion", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  await expectAllContentVisible(await ctx.newPage());
  await ctx.close();
});

test("everything is visible without JavaScript", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  await expectAllContentVisible(await ctx.newPage());
  await ctx.close();
});
