import fs from "node:fs";
import path from "node:path";
import { checkContent } from "../src/content/check";
import { buildManifest } from "../src/content/manifest-build";
import { LOCALE_ENABLED } from "../src/i18n/config";
import { ContentError } from "../src/content/parse";

try {
  const { warnings } = checkContent(process.cwd());
  const manifestFile = path.join(process.cwd(), "src/generated/content-manifest.json");
  fs.mkdirSync(path.dirname(manifestFile), { recursive: true });
  const manifest = buildManifest(path.join(process.cwd(), "content"), LOCALE_ENABLED);
  fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
  for (const w of warnings) console.warn(`⚠ ${w}`);
  console.log(warnings.length ? `İçerik geçerli, ${warnings.length} uyarı.` : "İçerik geçerli, eksik çeviri yok.");
} catch (e) {
  if (e instanceof ContentError) {
    console.error(`✖ Geçersiz içerik — ${e.message}`);
    process.exit(1);
  }
  throw e;
}
