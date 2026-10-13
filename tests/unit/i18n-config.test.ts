import { expect, test } from "vitest";
import { enabledLocales, isEnabledLocale, resolveFallbackLocale } from "@/i18n/config";

test("only enabled locales are returned, in LOCALES order", () => {
  expect(enabledLocales({ tr: true, en: false, de: true, it: false })).toEqual(["tr", "de"]);
});

test("fallback prefers en when enabled", () => {
  expect(resolveFallbackLocale({ tr: true, en: true, de: false, it: false })).toBe("en");
});

test("fallback is first enabled when en disabled", () => {
  expect(resolveFallbackLocale({ tr: true, en: false, de: false, it: false })).toBe("tr");
});

test("throws when no locale enabled", () => {
  expect(() => resolveFallbackLocale({ tr: false, en: false, de: false, it: false })).toThrow(/no locale enabled/i);
});

test("isEnabledLocale rejects disabled and unknown locales", () => {
  expect(isEnabledLocale("tr", { tr: true, en: false, de: false, it: false })).toBe(true);
  expect(isEnabledLocale("de", { tr: true, en: false, de: false, it: false })).toBe(false);
  expect(isEnabledLocale("xx")).toBe(false);
});
