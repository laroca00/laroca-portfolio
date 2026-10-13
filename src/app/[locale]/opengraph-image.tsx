import { getTranslations } from "next-intl/server";
import { isEnabledLocale, resolveFallbackLocale } from "@/i18n/config";
import { OG_SIZE, renderOg } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Tuğberk Emre Akkurt · LaRoca";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isEnabledLocale(raw) ? raw : resolveFallbackLocale();
  const t = await getTranslations({ locale, namespace: "Hero" });
  return renderOg({ title: t("title").replace("\n", " "), subtitle: t("terminal") });
}
