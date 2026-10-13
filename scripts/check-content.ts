import { checkContent } from "../src/content/check";
import { ContentError } from "../src/content/parse";

try {
  const { warnings } = checkContent(process.cwd());
  for (const w of warnings) console.warn(`⚠ ${w}`);
  console.log(warnings.length ? `İçerik geçerli, ${warnings.length} uyarı.` : "İçerik geçerli, eksik çeviri yok.");
} catch (e) {
  if (e instanceof ContentError) {
    console.error(`✖ Geçersiz içerik — ${e.message}`);
    process.exit(1);
  }
  throw e;
}
