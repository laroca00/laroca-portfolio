import fs from "node:fs";
import path from "node:path";
import { LOCALE_ENABLED, LOCALES, type Locale } from "@/i18n/config";
import {
  JSON_CONTENT_FILES,
  readChangelog,
  readExperience,
  readPosts,
  readProfile,
  readProjects,
  readServices,
  readTestimonials,
} from "./parse";

const BASE: Locale = "tr";

function messageKeys(obj: unknown, prefix = ""): string[] {
  if (obj === null || typeof obj !== "object") return [prefix];
  return Object.entries(obj).flatMap(([k, v]) => messageKeys(v, prefix ? `${prefix}.${k}` : k));
}

function readMessages(root: string, locale: Locale): Record<string, unknown> | null {
  const file = path.join(root, "messages", `${locale}.json`);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null;
}

/**
 * Validates every enabled locale (throws ContentError on an invalid file) and
 * lists what each enabled locale is missing compared to Turkish. Blog posts
 * are exempt: a post may exist in only some languages.
 */
export function checkContent(root: string, flags: Record<Locale, boolean> = LOCALE_ENABLED) {
  const contentRoot = path.join(root, "content");
  const warnings: string[] = [];
  const enabled = LOCALES.filter((l) => flags[l]);

  for (const locale of enabled) {
    readProfile(locale, contentRoot);
    readServices(locale, contentRoot);
    readTestimonials(locale, contentRoot);
    readExperience(locale, contentRoot);
    readChangelog(locale, contentRoot);
    readPosts(locale, contentRoot);
    readProjects(locale, contentRoot);
  }

  const baseKeys = messageKeys(readMessages(root, BASE) ?? {});
  const baseProjects = readProjects(BASE, contentRoot).map((p) => p.slug);
  const baseFiles = JSON_CONTENT_FILES.filter((f) => fs.existsSync(path.join(contentRoot, BASE, f)));

  for (const locale of enabled.filter((l) => l !== BASE)) {
    const keys = new Set(messageKeys(readMessages(root, locale) ?? {}));
    for (const k of baseKeys) if (!keys.has(k)) warnings.push(`${locale}: missing message key "${k}"`);
    const projects = new Set(readProjects(locale, contentRoot).map((p) => p.slug));
    for (const s of baseProjects) if (!projects.has(s)) warnings.push(`${locale}: missing project "${s}"`);
    for (const f of baseFiles) {
      if (!fs.existsSync(path.join(contentRoot, locale, f))) {
        warnings.push(`${locale}: missing content file "${f}"`);
      }
    }
  }
  return { warnings };
}
