import "server-only";
import type { Locale } from "@/i18n/config";
import {
  DEFAULT_CONTENT_ROOT,
  readChangelog,
  readExperience,
  readPosts,
  readProfile,
  readProjects,
  readServices,
  readTestimonials,
} from "./parse";

export { ContentError } from "./parse";
export type * from "./schema";

export async function getProjects(locale: Locale, root = DEFAULT_CONTENT_ROOT) {
  return readProjects(locale, root);
}

export async function getProject(locale: Locale, slug: string, root = DEFAULT_CONTENT_ROOT) {
  return readProjects(locale, root).find((p) => p.slug === slug) ?? null;
}

export async function getPosts(locale: Locale, root = DEFAULT_CONTENT_ROOT) {
  return readPosts(locale, root);
}

export async function getPost(locale: Locale, slug: string, root = DEFAULT_CONTENT_ROOT) {
  return readPosts(locale, root).find((p) => p.slug === slug) ?? null;
}

export const getProfile = async (locale: Locale, root = DEFAULT_CONTENT_ROOT) => readProfile(locale, root);
export const getServices = async (locale: Locale, root = DEFAULT_CONTENT_ROOT) => readServices(locale, root);
export const getTestimonials = async (locale: Locale, root = DEFAULT_CONTENT_ROOT) =>
  readTestimonials(locale, root);
export const getExperience = async (locale: Locale, root = DEFAULT_CONTENT_ROOT) => readExperience(locale, root);
export const getChangelog = async (locale: Locale, root = DEFAULT_CONTENT_ROOT) => readChangelog(locale, root);
