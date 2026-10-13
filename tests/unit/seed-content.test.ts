import { expect, test } from "vitest";
import {
  getChangelog,
  getExperience,
  getPosts,
  getProfile,
  getProjects,
  getServices,
  getTestimonials,
} from "@/content/load";
import { checkContent } from "@/content/check";

test("seed content is valid and complete", async () => {
  const projects = await getProjects("tr");
  expect(projects).toHaveLength(6);
  expect(projects.filter((p) => p.featured).map((p) => p.slug)).toEqual([
    "green-future-balcony",
    "empower-eu",
    "online-pisti",
    "sirpca-ogren",
  ]);
  expect(projects.find((p) => p.slug === "green-future-balcony")?.liveUrl).toBe("https://greenfuturebalcony.com");
  expect(projects.find((p) => p.slug === "empower-eu")?.liveUrl).toBe("https://empoweringadultswithdisabilities.com");
  const profile = await getProfile("tr");
  expect(profile.email).toBe("tugberkakkrt@gmail.com");
  expect(profile.name).toBe("Tuğberk Emre Akkurt");
  expect(profile.socials).toContainEqual({ label: "GitHub", url: "https://github.com/laroca00" });
  expect((await getChangelog("tr")).length).toBeGreaterThanOrEqual(5);
  expect(await getPosts("tr")).toHaveLength(2);
  expect((await getServices("tr")).length).toBeGreaterThan(0);
  expect((await getTestimonials("tr")).length).toBeGreaterThan(0);
  expect((await getExperience("tr")).length).toBeGreaterThan(0);
});

test("repository content passes the content check with no warnings", () => {
  expect(checkContent(process.cwd()).warnings).toEqual([]);
});
