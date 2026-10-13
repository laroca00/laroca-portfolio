import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { getProfile } from "@/content/load";
import { isEnabledLocale } from "@/i18n/config";
import { notFound } from "next/navigation";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isEnabledLocale(locale)) notFound();
  setRequestLocale(locale);
  const profile = await getProfile(locale);

  return <Hero profile={profile} />;
}
