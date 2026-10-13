import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import type { Locale } from "@/i18n/config";
import {
  changelogSchema,
  experienceSchema,
  postFrontmatter,
  profileSchema,
  projectFrontmatter,
  serviceSchema,
  testimonialSchema,
  type Post,
  type Project,
} from "./schema";

export class ContentError extends Error {
  constructor(
    public readonly file: string,
    detail: string,
  ) {
    super(`${file}: ${detail}`);
    this.name = "ContentError";
  }
}

export const DEFAULT_CONTENT_ROOT = path.join(process.cwd(), "content");

function validate<T>(schema: z.ZodType<T>, data: unknown, root: string, file: string): T {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  const issue = result.error.issues[0];
  const where = issue.path.length ? issue.path.join(".") : "(root)";
  throw new ContentError(rel(root, file), `${where}: ${issue.message}`);
}

function mdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => path.join(dir, f));
}

/** Root-relative path with forward slashes on every OS. */
const rel = (root: string, file: string) => path.relative(root, file).split(path.sep).join("/");

const slugOf = (file: string) => path.basename(file, ".mdx");

export function readProjects(locale: Locale, root = DEFAULT_CONTENT_ROOT): Project[] {
  return mdxFiles(path.join(root, locale, "projects"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(file, "utf8"));
      return { ...validate(projectFrontmatter, data, root, file), slug: slugOf(file), body: content };
    })
    .sort((a, b) => a.order - b.order);
}

export function readPosts(
  locale: Locale,
  root = DEFAULT_CONTENT_ROOT,
  includeDrafts = process.env.NODE_ENV !== "production",
): Post[] {
  return mdxFiles(path.join(root, locale, "blog"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(file, "utf8"));
      const words = content.split(/\s+/).filter(Boolean).length;
      return {
        ...validate(postFrontmatter, data, root, file),
        slug: slugOf(file),
        body: content,
        readingMinutes: Math.max(1, Math.ceil(words / 200)),
      };
    })
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

function readJson<T>(
  schema: z.ZodType<T>,
  locale: Locale,
  name: string,
  root: string,
  required: boolean,
): T | undefined {
  const file = path.join(root, locale, name);
  if (!fs.existsSync(file)) {
    if (required) throw new ContentError(rel(root, file), "(file): dosya bulunamadı");
    return undefined;
  }
  let data: unknown;
  try {
    data = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    throw new ContentError(rel(root, file), `(json): ${(e as Error).message}`);
  }
  return validate(schema, data, root, file);
}

export const readProfile = (locale: Locale, root = DEFAULT_CONTENT_ROOT) =>
  readJson(profileSchema, locale, "profile.json", root, true)!;
export const readServices = (locale: Locale, root = DEFAULT_CONTENT_ROOT) =>
  readJson(z.array(serviceSchema), locale, "services.json", root, false) ?? [];
export const readTestimonials = (locale: Locale, root = DEFAULT_CONTENT_ROOT) =>
  readJson(z.array(testimonialSchema), locale, "testimonials.json", root, false) ?? [];
export const readExperience = (locale: Locale, root = DEFAULT_CONTENT_ROOT) =>
  (readJson(z.array(experienceSchema), locale, "experience.json", root, false) ?? []).sort((a, b) =>
    b.start.localeCompare(a.start),
  );
export const readChangelog = (locale: Locale, root = DEFAULT_CONTENT_ROOT) =>
  (readJson(z.array(changelogSchema), locale, "changelog.json", root, false) ?? []).sort((a, b) =>
    b.date.localeCompare(a.date),
  );

export const JSON_CONTENT_FILES = [
  "profile.json",
  "services.json",
  "testimonials.json",
  "experience.json",
  "changelog.json",
] as const;
