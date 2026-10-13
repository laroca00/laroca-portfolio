import { expect, test } from "vitest";
import { createRateLimiter } from "@/lib/rate-limit";

test("allows `limit` hits per window, then blocks until the window passes", () => {
  let now = 0;
  const limiter = createRateLimiter({ limit: 5, windowMs: 600_000, now: () => now });
  for (let i = 0; i < 5; i++) expect(limiter.hit("1.2.3.4")).toBe(true);
  expect(limiter.hit("1.2.3.4")).toBe(false);
  expect(limiter.hit("5.6.7.8")).toBe(true);
  now = 600_001;
  expect(limiter.hit("1.2.3.4")).toBe(true);
});
