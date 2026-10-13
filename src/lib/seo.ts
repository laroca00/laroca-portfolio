import type { MetadataRoute } from "next";
import { LOCALE_ENABLED, LOCALES, resolveFallbackLocale, type Locale } from "@/i18n/config";
import { absoluteUrl, siteUrl } from "./site";

type Flags = Record<Locale, boolean>;

const localized = (locale: Locale, path: string) => absoluteUrl(`/${locale}${path}`);

/** canonical + hreflang alternates for a path that exists in every enabled locale. */
export function alternatesFor(locale: Locale, path: string, flags: Flags = LOCALE_ENABLED) {
  const languages: Record<string, string> = {};
  for (const l of LOCALES.filter((x) => flags[x])) languages[l] = localized(l, path);
  languages["x-default"] = localized(resolveFallbackLocale(flags), path);
  return { canonical: localized(locale, path), languages };
}

export type SitemapEntry = { path: string; locales: Locale[]; lastModified?: Date };

export function buildSitemap(entries: SitemapEntry[], flags: Flags = LOCALE_ENABLED): MetadataRoute.Sitemap {
  return entries.flatMap(({ path, locales, lastModified }) => {
    const live = LOCALES.filter((l) => flags[l] && locales.includes(l));
    const languages = Object.fromEntries(live.map((l) => [l, localized(l, path)]));
    return live.map((l) => ({ url: localized(l, path), lastModified, alternates: { languages } }));
  });
}

export function personJsonLd(profile: { name: string; email: string; socials: { label?: string; url: string }[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: "LaRoca",
    url: siteUrl(),
    jobTitle: "Full-stack Developer",
    email: `mailto:${profile.email}`,
    sameAs: profile.socials.map((s) => s.url),
  };
}
