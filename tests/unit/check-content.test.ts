import path from "node:path";
import { expect, test } from "vitest";
import { checkContent } from "@/content/check";

const ROOT = path.join(process.cwd(), "tests/fixtures/check/partial-en");

test("warns about missing keys and projects for enabled non-tr locale", () => {
  const { warnings } = checkContent(ROOT, { tr: true, en: true, de: false, it: false });
  expect(warnings).toContain('en: missing message key "Hero.title"');
  expect(warnings).toContain('en: missing project "beta"');
  expect(warnings).toContain('en: missing content file "changelog.json"');
  expect(warnings.some((w) => w.startsWith("de:"))).toBe(false);
  expect(warnings.some((w) => w.includes("blog"))).toBe(false);
});

test("no warnings when only tr is enabled", () => {
  expect(checkContent(ROOT, { tr: true, en: false, de: false, it: false }).warnings).toEqual([]);
});
