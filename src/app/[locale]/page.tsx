import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { ProjectShowcase } from "@/components/home/ProjectShowcase";
import { getProfile, getProjects } from "@/content/load";
import { isEnabledLocale } from "@/i18n/config";
import { notFound } from "next/navigation";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isEnabledLocale(locale)) notFound();
  setRequestLocale(locale);
  const [profile, projects] = await Promise.all([getProfile(locale), getProjects(locale)]);

  return (
    <>
      <Hero profile={profile} />
      <ProjectShowcase projects={projects} />
    </>
  );
}
