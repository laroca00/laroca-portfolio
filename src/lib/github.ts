import type { ChangelogEntry } from "@/content/schema";

export type TerminalLine = { date: string; message: string; source: "github" | "changelog" };

type Options = {
  username: string;
  fallback: ChangelogEntry[];
  limit?: number;
  fetchImpl?: typeof fetch;
};

const MAX_MESSAGE = 72;

const truncate = (s: string) => (s.length > MAX_MESSAGE ? `${s.slice(0, MAX_MESSAGE - 1)}…` : s);

type PushEvent = {
  type: "PushEvent";
  public: boolean;
  repo: { name: string };
  created_at: string;
  payload: { commits?: { message: string }[] };
};

function isPublicPush(e: unknown): e is PushEvent {
  const ev = e as Partial<PushEvent> | null;
  return !!ev && ev.type === "PushEvent" && ev.public === true && typeof ev.repo?.name === "string";
}

/**
 * Recent public commits as terminal lines. The public events API only ever
 * returns public activity; anything unexpected (rate limit, network, bad JSON,
 * no events) falls back to the hand-written changelog. Never throws.
 */
export async function getTerminalLines({ username, fallback, limit = 5, fetchImpl = fetch }: Options) {
  const fromChangelog = (): TerminalLine[] =>
    fallback.slice(0, limit).map((f) => ({ ...f, source: "changelog" }));

  try {
    const res = await fetchImpl(`https://api.github.com/users/${username}/events/public?per_page=30`, {
      headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
    });
    if (!res.ok) return fromChangelog();
    const events: unknown = await res.json();
    if (!Array.isArray(events)) return fromChangelog();

    const lines: TerminalLine[] = events.filter(isPublicPush).flatMap((e) => {
      const repo = e.repo.name.split("/").pop()!;
      return (e.payload.commits ?? []).map((c) => ({
        date: e.created_at.slice(0, 10),
        message: truncate(`${repo}: ${c.message.split("\n")[0]}`),
        source: "github" as const,
      }));
    });
    return lines.length ? lines.slice(0, limit) : fromChangelog();
  } catch {
    return fromChangelog();
  }
}
