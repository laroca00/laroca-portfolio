import "server-only";
import { cacheLife } from "next/cache";
import type { ChangelogEntry } from "@/content/schema";
import { getTerminalLines } from "./github";

export const GITHUB_USERNAME = "laroca00";

/** Cached for an hour so the GitHub API is hit at most hourly per deployment. */
export async function getTerminalFeed(fallback: ChangelogEntry[]) {
  "use cache";
  cacheLife("hours");
  return getTerminalLines({ username: GITHUB_USERNAME, fallback });
}
