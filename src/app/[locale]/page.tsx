import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Bento } from "@/components/home/Bento";
import { Hero } from "@/components/home/Hero";
import { LatestPosts } from "@/components/home/LatestPosts";
import { ProjectShowcase } from "@/components/home/ProjectShowcase";
import { ServicesSection } from "@/components/home/ServicesSection";
import { Testimonials } from "@/components/home/Testimonials";
import { Container } from "@/components/layout/Container";
import {
  getChangelog,
  getPosts,
  getProfile,
  getProjects,
  getServices,
  getTestimonials,
} from "@/content/load";
import { isEnabledLocale } from "@/i18n/config";
import { getTerminalFeed } from "@/lib/terminal-feed";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isEnabledLocale(locale)) notFound();
  setRequestLocale(locale);
  const [profile, projects, changelog, services, testimonials, posts, t] = await Promise.all([
    getProfile(locale),
    getProjects(locale),
    getChangelog(locale),
    getServices(locale),
    getTestimonials(locale),
    getPosts(locale),
    getTranslations({ locale, namespace: "Contact" }),
  ]);
  const terminalLines = await getTerminalFeed(changelog);

  return (
    <>
      <Hero profile={profile} />
      <ProjectShowcase projects={projects} />
      <Bento profile={profile} terminalLines={terminalLines} />
      <ServicesSection services={services} />
      <Testimonials items={testimonials} />
      <LatestPosts posts={posts} />
      <section id="contact" aria-labelledby="contact-title" className="scroll-mt-12 py-24 md:py-32">
        <Container className="flex flex-col items-center text-center">
          <h2 id="contact-title" className="text-display font-semibold text-gradient">
            {t("title")}
          </h2>
          <p className="mt-6 max-w-[34rem] text-lg text-muted">{t("intro")}</p>
        </Container>
      </section>
    </>
  );
}
