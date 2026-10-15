import { expect, test, vi } from "vitest";
import { getGithubActivity, parseContributionsHtml } from "@/lib/github";

const FALLBACK = [
  { date: "2026-09-20", message: "empower-eu: yayında" },
  { date: "2026-08-15", message: "green-future-balcony: hesaplayıcı" },
];
const FROM_CHANGELOG = FALLBACK.map((f) => ({ ...f, source: "changelog" }));

const CONTRIB_HTML = `
  <h2>59 contributions in the last year</h2>
  <td tabindex="0" data-ix="0" data-date="2025-10-12" id="contribution-day-component-0-0" data-level="0" class="day"></td>
  <td tabindex="0" data-ix="1" data-date="2025-10-19" id="contribution-day-component-0-1" data-level="2" class="day"></td>
  <td tabindex="0" data-ix="0" data-date="2025-10-13" id="contribution-day-component-1-0" data-level="4" class="day"></td>`;

/** Routes requests by URL so each endpoint can succeed or fail on its own. */
function router(routes: Record<string, () => Response | Promise<Response>>) {
  return vi.fn(async (input: string | URL | Request) => {
    const url = String(input);
    const key = Object.keys(routes).find((k) => url.includes(k));
    if (!key) throw new Error(`unexpected request ${url}`);
    return routes[key]();
  });
}
const json =
  (body: unknown, status = 200) =>
  () =>
    new Response(JSON.stringify(body), { status });
const html =
  (body: string, status = 200) =>
  () =>
    new Response(body, { status });

const graphqlUser = {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: 42,
          weeks: [
            { contributionDays: [{ date: "2026-10-11", contributionCount: 3, contributionLevel: "THIRD_QUARTILE" }] },
          ],
        },
      },
      repositories: {
        nodes: [
          {
            name: "onlinepisti",
            defaultBranchRef: {
              target: {
                history: { nodes: [{ messageHeadline: "deal order", committedDate: "2026-10-10T09:00:00Z" }] },
              },
            },
          },
          {
            name: "srpski-jezik",
            defaultBranchRef: {
              target: { history: { nodes: [{ messageHeadline: "ilk sürüm", committedDate: "2026-10-12T09:00:00Z" }] } },
            },
          },
          { name: "empty", defaultBranchRef: null },
        ],
      },
    },
  },
};

test("parses the public contribution calendar into week columns", () => {
  expect(parseContributionsHtml(CONTRIB_HTML)).toEqual({
    total: 59,
    weeks: [
      [
        { date: "2025-10-12", count: null, level: 0 },
        { date: "2025-10-13", count: null, level: 4 },
      ],
      [{ date: "2025-10-19", count: null, level: 2 }],
    ],
  });
  expect(parseContributionsHtml("<p>nothing here</p>")).toBeNull();
});

test("with a token, uses GraphQL for private repos and counts, newest commits first", async () => {
  const fetchImpl = router({ "/graphql": json(graphqlUser) });
  const activity = await getGithubActivity({ username: "laroca00", fallback: FALLBACK, token: "t", fetchImpl });

  expect(activity.lines).toEqual([
    { date: "2026-10-12", message: "srpski-jezik: ilk sürüm", source: "github" },
    { date: "2026-10-10", message: "onlinepisti: deal order", source: "github" },
  ]);
  expect(activity.calendar).toEqual({ total: 42, weeks: [[{ date: "2026-10-11", count: 3, level: 3 }]] });
  const [, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
  expect((init.headers as Record<string, string>).Authorization).toBe("bearer t");
});

test("without a token, reads public repo commits and the public calendar", async () => {
  const fetchImpl = router({
    "/users/laroca00/repos": json([
      { name: "laroca-portfolio", full_name: "laroca00/laroca-portfolio", fork: false },
      { name: "some-fork", full_name: "laroca00/some-fork", fork: true },
    ]),
    "/repos/laroca00/laroca-portfolio/commits": json([
      { commit: { message: "feat: redesign\n\nbody", committer: { date: "2026-10-15T10:00:00Z" } } },
    ]),
    "/users/laroca00/contributions": html(CONTRIB_HTML),
  });
  const activity = await getGithubActivity({ username: "laroca00", fallback: FALLBACK, fetchImpl });

  expect(activity.lines).toEqual([
    { date: "2026-10-15", message: "laroca-portfolio: feat: redesign", source: "github" },
  ]);
  expect(activity.calendar?.total).toBe(59);
  expect(fetchImpl.mock.calls.some(([u]) => String(u).includes("some-fork"))).toBe(false);
});

test("a failing token falls back to the public endpoints", async () => {
  const fetchImpl = router({
    "/graphql": json({ message: "Bad credentials" }, 401),
    "/users/laroca00/repos": json([]),
    "/users/laroca00/contributions": html(CONTRIB_HTML),
  });
  const activity = await getGithubActivity({ username: "laroca00", fallback: FALLBACK, token: "bad", fetchImpl });
  expect(activity.lines).toEqual(FROM_CHANGELOG);
  expect(activity.calendar?.total).toBe(59);
});

test("commits and calendar degrade independently and never throw", async () => {
  const fetchImpl = router({
    "/users/laroca00/repos": json({ message: "rate limit" }, 403),
    "/users/laroca00/contributions": () => Promise.reject(new Error("offline")),
  });
  await expect(getGithubActivity({ username: "laroca00", fallback: FALLBACK, fetchImpl })).resolves.toEqual({
    lines: FROM_CHANGELOG,
    calendar: null,
  });
});

test("long commit messages are truncated", async () => {
  const fetchImpl = router({
    "/users/laroca00/repos": json([{ name: "r", full_name: "laroca00/r", fork: false }]),
    "/repos/laroca00/r/commits": json([
      { commit: { message: "x".repeat(200), committer: { date: "2026-10-01T00:00:00Z" } } },
    ]),
    "/users/laroca00/contributions": html(""),
  });
  const { lines } = await getGithubActivity({ username: "laroca00", fallback: FALLBACK, fetchImpl });
  expect(lines[0].message.length).toBe(72);
  expect(lines[0].message.endsWith("…")).toBe(true);
});
