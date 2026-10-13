import type { Locale } from "@/i18n/config";

export type Entry = { slug: string; draft: boolean };
export type ContentManifest = Partial<Record<Locale, { projects: Entry[]; blog: Entry[] }>>;

const CONTENT_PATH = /^\/([a-z]{2})\/(projects|blog)\/([^/]+)\/?$/;

/**
 * True when the path is a project/post URL whose slug does not exist. Lets the
 * proxy answer with a real 404 before streaming starts (with Partial
 * Prefetching, a notFound() inside the page arrives after a 200 shell).
 */
export function isUnknownContentPath(
  pathname: string,
  manifest: ContentManifest,
  { includeDrafts }: { includeDrafts: boolean },
): boolean {
  const match = CONTENT_PATH.exec(pathname);
  if (!match) return false;
  const [, locale, kind, rawSlug] = match;
  const entries = manifest[locale as Locale]?.[kind as "projects" | "blog"];
  if (!entries) return false;
  const slug = decodeURIComponent(rawSlug);
  return !entries.some((e) => e.slug === slug && (includeDrafts || !e.draft));
}
