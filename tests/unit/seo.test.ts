import { beforeEach, expect, test, vi } from "vitest";
import { alternatesFor, buildSitemap, personJsonLd } from "@/lib/seo";

const SITE = "https://laroca.studio";
const TR_ONLY = { tr: true, en: false, de: false, it: false };
const TR_EN = { tr: true, en: true, de: false, it: false };

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", SITE);
});

test("only tr enabled: canonical + tr + x-default", () => {
  expect(alternatesFor("tr", "/projects", TR_ONLY)).toEqual({
    canonical: `${SITE}/tr/projects`,
    languages: { tr: `${SITE}/tr/projects`, "x-default": `${SITE}/tr/projects` },
  });
});

test("tr and en enabled: x-default points at en", () => {
  const a = alternatesFor("tr", "/projects", TR_EN);
  expect(a.languages).toEqual({
    tr: `${SITE}/tr/projects`,
    en: `${SITE}/en/projects`,
    "x-default": `${SITE}/en/projects`,
  });
});

test("home path has no trailing slash", () => {
  expect(alternatesFor("tr", "", TR_ONLY).canonical).toBe(`${SITE}/tr`);
});

test("sitemap only lists enabled locales and the locales an entry exists in", () => {
  const sitemap = buildSitemap(
    [
      { path: "/projects/empower-eu", locales: ["tr", "en"] },
      { path: "/blog/only-tr", locales: ["tr"] },
      { path: "/blog/only-de", locales: ["de"] },
    ],
    TR_EN,
  );
  const urls = sitemap.map((e) => e.url);
  expect(urls).toEqual([`${SITE}/tr/projects/empower-eu`, `${SITE}/en/projects/empower-eu`, `${SITE}/tr/blog/only-tr`]);
  expect(urls.some((u) => u.includes("/de/"))).toBe(false);
  expect(sitemap[0].alternates?.languages).toEqual({
    tr: `${SITE}/tr/projects/empower-eu`,
    en: `${SITE}/en/projects/empower-eu`,
  });
});

test("person JSON-LD", () => {
  const ld = personJsonLd({
    name: "Tuğberk Emre Akkurt",
    email: "tugberkakkrt@gmail.com",
    socials: [{ label: "GitHub", url: "https://github.com/laroca00" }],
  });
  expect(ld).toMatchObject({
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Tuğberk Emre Akkurt",
    alternateName: "LaRoca",
    url: SITE,
    sameAs: ["https://github.com/laroca00"],
    email: "mailto:tugberkakkrt@gmail.com",
  });
});
