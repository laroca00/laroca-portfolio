import "server-only";
import { cacheLife } from "next/cache";
import type { ChangelogEntry } from "@/content/schema";
import { getGithubActivity } from "./github";

export const GITHUB_USERNAME = "laroca00";

/**
 * Cached for an hour so GitHub is hit at most hourly per deployment. Set
 * GITHUB_TOKEN to include private repos and private contribution counts.
 */
export async function getGithubFeed(fallback: ChangelogEntry[]) {
  "use cache";
  cacheLife("hours");
  return getGithubActivity({ username: GITHUB_USERNAME, fallback, token: process.env.GITHUB_TOKEN });
}
