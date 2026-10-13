"use client";

import { useTranslations } from "next-intl";
import { LOCALE_LABELS, type Locale } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/routing";

/** Hidden until a second language is enabled in LOCALE_ENABLED. */
export function LanguageSwitcher({ locales, current }: { locales: Locale[]; current: Locale }) {
  const t = useTranslations("Nav");
  const router = useRouter();
  const pathname = usePathname();
  if (locales.length < 2) return null;

  return (
    <select
      aria-label={t("language")}
      value={current}
      onChange={(e) => router.replace(pathname, { locale: e.target.value as Locale })}
      className="rounded-lg border border-border bg-bg px-2 py-1 text-xs text-muted hover:text-text"
    >
      {locales.map((l) => (
        <option key={l} value={l}>
          {LOCALE_LABELS[l]}
        </option>
      ))}
    </select>
  );
}
