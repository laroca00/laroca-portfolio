import path from "node:path";
import { expect, test } from "vitest";
import { ContentError, getChangelog, getPosts, getProfile, getProject, getProjects } from "@/content/load";

const VALID = path.join(process.cwd(), "tests/fixtures/content/valid");
const INVALID = path.join(process.cwd(), "tests/fixtures/content/invalid");

test("loads and sorts projects by order", async () => {
  const p = await getProjects("tr", VALID);
  expect(p.map((x) => x.slug)).toEqual(["alpha", "beta"]);
  expect(p[0].accent).toBe("green");
  expect(p[0].body).toContain("## Problem");
});

test("getProject returns null for unknown slug", async () => {
  expect(await getProject("tr", "nope", VALID)).toBeNull();
});

test("invalid frontmatter throws ContentError naming file and field", async () => {
  const err = await getProjects("tr", INVALID).catch((e: unknown) => e);
  expect(err).toBeInstanceOf(ContentError);
  expect((err as ContentError).message).toMatch(/projects[\/]broken\.mdx: accent/);
});

test("reading time is ceil(words/200), min 1", async () => {
  const [post] = await getPosts("tr", VALID);
  expect(post.slug).toBe("ilk-yazi");
  expect(post.readingMinutes).toBe(2);
  expect(post.date).toBeInstanceOf(Date);
  expect(post.date.toISOString().slice(0, 10)).toBe("2026-09-01");
});

test("json loaders validate and missing list files yield []", async () => {
  expect((await getProfile("tr", VALID)).email).toBe("a@b.co");
  expect(await getChangelog("tr", VALID)).toEqual([{ date: "2026-09-01", message: "ilk kayıt" }]);
  await expect(getProfile("tr", INVALID)).rejects.toBeInstanceOf(ContentError);
});
