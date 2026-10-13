import { expect, test } from "@playwright/test";

test("invalid input shows field errors", async ({ page }) => {
  await page.goto("/tr#contact");
  await page.getByLabel("Adın").fill("Ayşe");
  await page.getByLabel("E-posta adresin").fill("gecersiz");
  await page.getByLabel("Mesajın").fill("Merhaba, bir projem var.");
  await page.getByRole("button", { name: "Mesajı gönder" }).click();
  await expect(page.getByText("Geçerli bir e-posta adresi yaz.")).toBeVisible();
  await expect(page.getByLabel("E-posta adresin")).toHaveAttribute("aria-invalid", "true");
});

test("without an email provider key the form fails gracefully with a mailto fallback", async ({ page }) => {
  test.skip(!!process.env.RESEND_API_KEY, "a real key would send an email");
  await page.goto("/tr#contact");
  await page.getByLabel("Adın").fill("Ayşe");
  await page.getByLabel("E-posta adresin").fill("ayse@example.com");
  await page.getByLabel("Mesajın").fill("Merhaba, bir projem var.");
  await page.getByRole("button", { name: "Mesajı gönder" }).click();
  await expect(page.getByText("Mesaj gönderilemedi.", { exact: false })).toBeVisible();
  await expect(page.getByRole("link", { name: "tugberkakkrt@gmail.com" }).first()).toHaveAttribute(
    "href",
    "mailto:tugberkakkrt@gmail.com",
  );
});
