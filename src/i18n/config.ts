export const LOCALES = ["tr", "en", "de", "it"] as const;
export type Locale = (typeof LOCALES)[number];

/**
 * The one switch for publishing a language. Turn a locale on only after
 * `messages/<locale>.json` and `content/<locale>/` are translated
 * (`npm run check:content` lists what is missing).
 */
export const LOCALE_ENABLED: Record<Locale, boolean> = {
  tr: true,
  en: false,
  de: false,
  it: false,
};

export const LOCALE_LABELS: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  de: "Deutsch",
  it: "Italiano",
};

export function enabledLocales(flags: Record<Locale, boolean> = LOCALE_ENABLED): Locale[] {
  return LOCALES.filter((l) => flags[l]);
}

export function resolveFallbackLocale(flags: Record<Locale, boolean> = LOCALE_ENABLED): Locale {
  if (flags.en) return "en";
  const [first] = enabledLocales(flags);
  if (!first) throw new Error("No locale enabled in LOCALE_ENABLED");
  return first;
}

export function isEnabledLocale(value: string, flags: Record<Locale, boolean> = LOCALE_ENABLED): value is Locale {
  return (LOCALES as readonly string[]).includes(value) && flags[value as Locale];
}
