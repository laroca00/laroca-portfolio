const TR: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" };

/** URL-safe id for a heading, Turkish letters folded to ASCII ("Teknik detaylar" → "teknik-detaylar"). */
export function slugify(text: string) {
  return text
    .toLocaleLowerCase("tr")
    .replace(/[çğıöşü]/g, (c) => TR[c])
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-");
}
