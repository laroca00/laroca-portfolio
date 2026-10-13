import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Bento } from "@/components/home/Bento";
import { Hero } from "@/components/home/Hero";
import { ProjectShowcase } from "@/components/home/ProjectShowcase";
import { getChangelog, getProfile, getProjects } from "@/content/load";
import { isEnabledLocale } from "@/i18n/config";
import { getTerminalFeed } from "@/lib/terminal-feed";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isEnabledLocale(locale)) notFound();
  setRequestLocale(locale);
  const [profile, projects, changelog] = await Promise.all([
    getProfile(locale),
    getProjects(locale),
    getChangelog(locale),
  ]);
  const terminalLines = await getTerminalFeed(changelog);

  return (
    <>
      <Hero profile={profile} />
      <ProjectShowcase projects={projects} />
      <Bento profile={profile} terminalLines={terminalLines} />
    </>
  );
}
