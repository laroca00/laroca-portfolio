import { z } from "zod";

export const ACCENTS = ["green", "teal", "blue", "violet", "red", "amber"] as const;
export type Accent = (typeof ACCENTS)[number];

const isoDay = /^\d{4}-\d{2}-\d{2}$/;
const isoMonth = /^\d{4}-\d{2}$/;

/** gray-matter turns unquoted YAML dates into Date objects; accept both. */
const dateField = z
  .union([z.date(), z.string().regex(isoDay, "YYYY-MM-DD bekleniyor")])
  .transform((v) => (v instanceof Date ? v : new Date(`${v}T00:00:00Z`)));

export const projectFrontmatter = z.object({
  title: z.string().min(1),
  tagline: z.string().min(1),
  label: z.string().min(1),
  category: z.enum(["web", "mobile", "game", "backend"]),
  stack: z.array(z.string()),
  accent: z.enum(ACCENTS),
  featured: z.boolean(),
  order: z.number().int(),
  year: z.number().int(),
  liveUrl: z.url().optional(),
  storeUrl: z.url().optional(),
  repoUrl: z.url().optional(),
  cover: z.string().optional(),
});

export const postFrontmatter = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: dateField,
  tags: z.array(z.string()),
  draft: z.boolean(),
});

export const profileSchema = z.object({
  name: z.string().min(1),
  handle: z.literal("LaRoca"),
  tagline: z.string(),
  bio: z.string(),
  email: z.email(),
  location: z.string(),
  openToWork: z.boolean(),
  socials: z.array(z.object({ label: z.string(), url: z.url() })),
  stats: z.array(z.object({ value: z.string(), label: z.string() })),
  stack: z.array(z.string()),
});

export const serviceSchema = z.object({ title: z.string(), description: z.string(), icon: z.string() });
export const testimonialSchema = z.object({
  quote: z.string(),
  author: z.string(),
  role: z.string(),
  org: z.string(),
});
export const experienceSchema = z.object({
  start: z.string().regex(isoMonth, "YYYY-MM bekleniyor"),
  end: z.string().regex(isoMonth, "YYYY-MM bekleniyor").optional(),
  title: z.string(),
  org: z.string(),
  description: z.string(),
  kind: z.enum(["work", "education"]),
});
export const changelogSchema = z.object({
  date: z.string().regex(isoDay, "YYYY-MM-DD bekleniyor"),
  message: z.string(),
});

export type Project = z.infer<typeof projectFrontmatter> & { slug: string; body: string };
export type Post = z.infer<typeof postFrontmatter> & { slug: string; body: string; readingMinutes: number };
export type Profile = z.infer<typeof profileSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type ExperienceItem = z.infer<typeof experienceSchema>;
export type ChangelogEntry = z.infer<typeof changelogSchema>;
