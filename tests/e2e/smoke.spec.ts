import { expect, test } from "@playwright/test";

test("home responds", async ({ request }) => {
  const res = await request.get("/");
  expect(res.status()).toBeLessThan(400);
});
