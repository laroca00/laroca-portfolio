import fs from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";
import { isUnknownContentPath, type ContentManifest } from "@/content/manifest";
import { buildManifest } from "@/content/manifest-build";
import { LOCALE_ENABLED } from "@/i18n/config";

const manifest: ContentManifest = {
  tr: {
    projects: [{ slug: "empower-eu", draft: false }],
    blog: [
      { slug: "yayinda", draft: false },
      { slug: "taslak", draft: true },
    ],
  },
};

test.each([
  ["/tr/projects/empower-eu", false],
  ["/tr/projects/unknown", true],
  ["/tr/blog/yayinda", false],
  ["/tr/blog/nope", true],
  ["/tr/projects", false],
  ["/tr/about", false],
  ["/tr", false],
  ["/en/projects/empower-eu", false],
])("%s unknown=%s", (pathname, expected) => {
  expect(isUnknownContentPath(pathname, manifest, { includeDrafts: false })).toBe(expected);
});

test("drafts are known only when drafts are included", () => {
  expect(isUnknownContentPath("/tr/blog/taslak", manifest, { includeDrafts: false })).toBe(true);
  expect(isUnknownContentPath("/tr/blog/taslak", manifest, { includeDrafts: true })).toBe(false);
});

test("committed manifest is in sync with content", () => {
  const committed = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "src/generated/content-manifest.json"), "utf8"),
  );
  expect(committed).toEqual(buildManifest(path.join(process.cwd(), "content"), LOCALE_ENABLED));
});
