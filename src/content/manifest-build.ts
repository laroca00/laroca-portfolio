import { LOCALES, type Locale } from "@/i18n/config";
import type { ContentManifest } from "./manifest";
import { readPosts, readProjects } from "./parse";

/** Build-time list of every content slug per enabled locale (see scripts/check-content.ts). */
export function buildManifest(contentRoot: string, flags: Record<Locale, boolean>): ContentManifest {
  const manifest: ContentManifest = {};
  for (const locale of LOCALES.filter((l) => flags[l])) {
    manifest[locale] = {
      projects: readProjects(locale, contentRoot).map((p) => ({ slug: p.slug, draft: false })),
      blog: readPosts(locale, contentRoot, true).map((p) => ({ slug: p.slug, draft: p.draft })),
    };
  }
  return manifest;
}
