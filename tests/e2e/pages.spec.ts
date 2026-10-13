import { expect, test } from "@playwright/test";

const ALL_PROJECTS = ["Green Future Balcony", "EmpowerEU", "Online Pişti", "Sırpça Öğren", "Akgün", "3DCare"];

test("projects index lists all six projects", async ({ page }) => {
  await page.goto("/tr/projects");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  for (const title of ALL_PROJECTS) {
    await expect(page.getByRole("heading", { level: 2, name: title })).toBeVisible();
  }
});

test("project page renders the case study with a live link", async ({ page }) => {
  await page.goto("/tr/projects/empower-eu");
  await expect(page.getByRole("heading", { level: 1, name: "EmpowerEU" })).toBeVisible();
  const live = page.getByRole("link", { name: /Siteye git/ });
  await expect(live).toHaveAttribute("href", "https://empoweringadultswithdisabilities.com");
  await expect(page.getByRole("heading", { level: 2, name: "Çözüm" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Sonraki proje/ })).toBeVisible();
});

test("unknown project is 404", async ({ page }) => {
  const res = await page.goto("/tr/projects/unknown");
  expect(res?.status()).toBe(404);
});

test("blog lists posts and a post renders date and highlighted code", async ({ page }) => {
  await page.goto("/tr/blog");
  const posts = page.getByRole("article");
  await expect(posts).toHaveCount(2);
  await page.getByRole("link", { name: /React Native ve Next.js/ }).click();
  await expect(page).toHaveURL(/\/tr\/blog\/react-native-ve-next-js$/);
  await expect(page.locator("time[datetime='2026-09-28']").first()).toBeVisible();
  await expect(page.locator("pre[data-language='ts']")).toBeVisible();
});

test("unknown blog post is 404", async ({ page }) => {
  const res = await page.goto("/tr/blog/unknown");
  expect(res?.status()).toBe(404);
});

test("about page has timeline and downloadable CV", async ({ page, request }) => {
  await page.goto("/tr/about");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("list", { name: "Deneyim ve eğitim" }).getByRole("listitem")).toHaveCount(3);
  const cv = page.getByRole("link", { name: /CV indir/ });
  await expect(cv).toHaveAttribute("href", "/cv/tr.pdf");
  await expect(cv).toHaveAttribute("download", /.*/);
  const res = await request.get("/cv/tr.pdf");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("application/pdf");
});

test("services page lists all services", async ({ page }) => {
  await page.goto("/tr/services");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  for (const name of [
    "Web siteleri ve web uygulamaları",
    "Mobil uygulamalar",
    "Proje ve kurum siteleri",
    "Backend ve API",
  ]) {
    await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
  }
});
