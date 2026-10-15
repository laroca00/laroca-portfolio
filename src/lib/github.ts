import type { ChangelogEntry } from "@/content/schema";

export type TerminalLine = { date: string; message: string; source: "github" | "changelog" };
export type ContributionLevel = 0 | 1 | 2 | 3 | 4;
export type ContributionDay = { date: string; count: number | null; level: ContributionLevel };
export type ContributionCalendar = { total: number; weeks: ContributionDay[][] };
export type GithubActivity = { lines: TerminalLine[]; calendar: ContributionCalendar | null };

type Options = {
  username: string;
  fallback: ChangelogEntry[];
  /** With a token, private repos and private contribution counts are included (GraphQL). */
  token?: string;
  limit?: number;
  fetchImpl?: typeof fetch;
};

const MAX_MESSAGE = 72;
const API_HEADERS = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };

const truncate = (s: string) => (s.length > MAX_MESSAGE ? `${s.slice(0, MAX_MESSAGE - 1)}…` : s);
const line = (repo: string, headline: string, date: string): TerminalLine => ({
  date: date.slice(0, 10),
  message: truncate(`${repo}: ${headline.split("\n")[0]}`),
  source: "github",
});
const newestFirst = (a: TerminalLine, b: TerminalLine) => b.date.localeCompare(a.date);

const GRAPHQL_LEVELS: Record<string, ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const ACTIVITY_QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
    repositories(first: 6, orderBy: { field: PUSHED_AT, direction: DESC }, ownerAffiliations: OWNER) {
      nodes {
        name
        defaultBranchRef { target { ... on Commit { history(first: 5) { nodes { messageHeadline committedDate } } } } }
      }
    }
  }
}`;

type GraphqlUser = {
  contributionsCollection: {
    contributionCalendar: {
      totalContributions: number;
      weeks: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }[];
    };
  };
  repositories: {
    nodes: {
      name: string;
      defaultBranchRef: {
        target: { history?: { nodes: { messageHeadline: string; committedDate: string }[] } };
      } | null;
    }[];
  };
};

/** Everything (private repos included) through the token holder's GraphQL view. */
async function fromGraphql(username: string, token: string, limit: number, fetchImpl: typeof fetch) {
  const res = await fetchImpl("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: ACTIVITY_QUERY, variables: { login: username } }),
  });
  if (!res.ok) throw new Error(`GitHub GraphQL ${res.status}`);
  const user = ((await res.json()) as { data?: { user?: GraphqlUser } }).data?.user;
  if (!user) throw new Error("GitHub GraphQL: no user");

  const cal = user.contributionsCollection.contributionCalendar;
  const calendar: ContributionCalendar = {
    total: cal.totalContributions,
    weeks: cal.weeks.map((w) =>
      w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: GRAPHQL_LEVELS[d.contributionLevel] ?? 0,
      })),
    ),
  };
  const lines = user.repositories.nodes
    .flatMap((r) =>
      (r.defaultBranchRef?.target.history?.nodes ?? []).map((c) => line(r.name, c.messageHeadline, c.committedDate)),
    )
    .sort(newestFirst)
    .slice(0, limit);
  return { lines, calendar };
}

/** Latest commits of the user's most recently pushed public repos (REST, no token). */
async function publicLines(username: string, limit: number, fetchImpl: typeof fetch) {
  const res = await fetchImpl(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=5`, {
    headers: API_HEADERS,
  });
  if (!res.ok) throw new Error(`GitHub repos ${res.status}`);
  const repos = (await res.json()) as { name: string; full_name: string; fork: boolean }[];
  if (!Array.isArray(repos)) throw new Error("GitHub repos: unexpected shape");

  const perRepo = await Promise.all(
    repos
      .filter((r) => !r.fork)
      .slice(0, 3)
      .map(async (r) => {
        const c = await fetchImpl(`https://api.github.com/repos/${r.full_name}/commits?per_page=${limit}`, {
          headers: API_HEADERS,
        });
        if (!c.ok) return [];
        const commits = (await c.json()) as { commit: { message: string; committer: { date: string } } }[];
        return Array.isArray(commits)
          ? commits.map((x) => line(r.name, x.commit.message, x.commit.committer.date))
          : [];
      }),
  );
  return perRepo.flat().sort(newestFirst).slice(0, limit);
}

/**
 * The public contribution calendar from the profile page fragment. Cells come
 * row-major (one row per weekday) with ids `contribution-day-component-<row>-<col>`.
 */
export function parseContributionsHtml(html: string): ContributionCalendar | null {
  const weeks: ContributionDay[][] = [];
  for (const [tag] of html.matchAll(/<td\b[^>]*data-date="[^"]*"[^>]*>/g)) {
    const date = /data-date="([\d-]+)"/.exec(tag)?.[1];
    const level = Number(/data-level="(\d)"/.exec(tag)?.[1]);
    const pos = /contribution-day-component-(\d+)-(\d+)/.exec(tag);
    if (!date || !pos || !(level >= 0 && level <= 4)) continue;
    const [row, col] = [Number(pos[1]), Number(pos[2])];
    (weeks[col] ??= [])[row] = { date, count: null, level: level as ContributionLevel };
  }
  const total = Number(/([\d,]+)\s+contributions?\s+in the last year/.exec(html)?.[1].replace(/,/g, ""));
  const filled = weeks.filter(Boolean).map((w) => w.filter(Boolean));
  return filled.length ? { total: Number.isFinite(total) ? total : 0, weeks: filled } : null;
}

async function publicCalendar(username: string, fetchImpl: typeof fetch) {
  const res = await fetchImpl(`https://github.com/users/${username}/contributions`);
  if (!res.ok) throw new Error(`GitHub contributions ${res.status}`);
  return parseContributionsHtml(await res.text());
}

/**
 * Recent commits as terminal lines plus the contribution calendar. Uses the
 * GraphQL API when a token is given, public endpoints otherwise. Each half
 * degrades on its own: no commits → the hand-written changelog, no calendar
 * → null. Never throws.
 */
export async function getGithubActivity({
  username,
  fallback,
  token,
  limit = 5,
  fetchImpl = fetch,
}: Options): Promise<GithubActivity> {
  const fromChangelog = (): TerminalLine[] => fallback.slice(0, limit).map((f) => ({ ...f, source: "changelog" }));

  if (token) {
    try {
      const { lines, calendar } = await fromGraphql(username, token, limit, fetchImpl);
      return { lines: lines.length ? lines : fromChangelog(), calendar };
    } catch {
      // fall through to the public endpoints
    }
  }

  const [lines, calendar] = await Promise.all([
    publicLines(username, limit, fetchImpl).catch(() => []),
    publicCalendar(username, fetchImpl).catch(() => null),
  ]);
  return { lines: lines.length ? lines : fromChangelog(), calendar };
}
