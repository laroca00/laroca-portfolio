import { expect, test, vi } from "vitest";
import { getTerminalLines } from "@/lib/github";

const FALLBACK = [
  { date: "2026-09-20", message: "empower-eu: yayında" },
  { date: "2026-08-15", message: "green-future-balcony: hesaplayıcı" },
];

const json = (body: unknown, status = 200) =>
  vi.fn(async () => new Response(typeof body === "string" ? body : JSON.stringify(body), { status }));

function pushEvent(repo: string, message: string, createdAt = "2026-10-01T10:00:00Z", isPublic = true) {
  return { type: "PushEvent", public: isPublic, repo: { name: repo }, created_at: createdAt, payload: { commits: [{ message }] } };
}

test("maps public PushEvents to lines with the repo short name and first message line", async () => {
  const lines = await getTerminalLines({
    username: "laroca00",
    fallback: FALLBACK,
    fetchImpl: json([pushEvent("laroca00/pisti", "fix: deal order\n\nlong body")]),
  });
  expect(lines[0]).toEqual({ date: "2026-10-01", message: "pisti: fix: deal order", source: "github" });
});

test("requests the public events endpoint for the user", async () => {
  const f = json([]);
  await getTerminalLines({ username: "laroca00", fallback: FALLBACK, fetchImpl: f });
  expect(f).toHaveBeenCalledWith(
    "https://api.github.com/users/laroca00/events/public?per_page=30",
    expect.objectContaining({ headers: expect.objectContaining({ Accept: "application/vnd.github+json" }) }),
  );
});

test("empty events → changelog fallback", async () => {
  const lines = await getTerminalLines({ username: "laroca00", fallback: FALLBACK, fetchImpl: json([]) });
  expect(lines).toEqual(FALLBACK.map((f) => ({ ...f, source: "changelog" })));
});

test("non-public and non-push events are ignored", async () => {
  const lines = await getTerminalLines({
    username: "laroca00",
    fallback: FALLBACK,
    fetchImpl: json([pushEvent("laroca00/secret", "x", undefined, false), { type: "WatchEvent", public: true }]),
  });
  expect(lines.every((l) => l.source === "changelog")).toBe(true);
});

test.each([
  ["403 rate limit", json({ message: "rate limit" }, 403)],
  ["network error", vi.fn(async () => Promise.reject(new Error("offline")))],
  ["invalid json", json("not-json")],
  ["unexpected shape", json({ not: "an array" })],
])("%s → fallback, never throws", async (_, fetchImpl) => {
  await expect(getTerminalLines({ username: "laroca00", fallback: FALLBACK, fetchImpl })).resolves.toHaveLength(
    FALLBACK.length,
  );
});

test("respects limit and truncates long messages to 72 chars", async () => {
  const events = Array.from({ length: 10 }, (_, i) => pushEvent("laroca00/app", `${"x".repeat(100)}${i}`));
  const lines = await getTerminalLines({ username: "laroca00", fallback: FALLBACK, fetchImpl: json(events) });
  expect(lines).toHaveLength(5);
  expect(lines[0].message.length).toBeLessThanOrEqual(72);
  expect(lines[0].message.endsWith("…")).toBe(true);
});
