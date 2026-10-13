import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "@/content/load";
import { enabledLocales, type Locale } from "@/i18n/config";
import { buildSitemap, type SitemapEntry } from "@/lib/seo";

const STATIC_PATHS = ["", "/projects", "/about", "/services", "/blog"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = enabledLocales();
  const entries: SitemapEntry[] = STATIC_PATHS.map((path) => ({ path, locales }));

  const bySlug = new Map<string, { locales: Locale[]; lastModified?: Date }>();
  for (const locale of locales) {
    for (const p of await getProjects(locale)) {
      const key = `/projects/${p.slug}`;
      bySlug.set(key, { locales: [...(bySlug.get(key)?.locales ?? []), locale] });
    }
    for (const p of await getPosts(locale)) {
      const key = `/blog/${p.slug}`;
      bySlug.set(key, { locales: [...(bySlug.get(key)?.locales ?? []), locale], lastModified: p.date });
    }
  }
  for (const [path, v] of bySlug) entries.push({ path, ...v });

  return buildSitemap(entries);
}
