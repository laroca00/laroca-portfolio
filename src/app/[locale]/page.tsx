import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact/ContactForm";
import { Doodle } from "@/components/Doodle";
import { Bento } from "@/components/home/Bento";
import { Dusk } from "@/components/home/Dusk";
import { Hero } from "@/components/home/Hero";
import { LatestPosts } from "@/components/home/LatestPosts";
import { ProjectShowcase } from "@/components/home/ProjectShowcase";
import { ServicesSection } from "@/components/home/ServicesSection";
import { Testimonials } from "@/components/home/Testimonials";
import { Container } from "@/components/layout/Container";
import { getChangelog, getPosts, getProfile, getProjects, getServices, getTestimonials } from "@/content/load";
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
      <Bento profile={profile} terminalLines={terminalLines} />
      <Dusk />
      <div className="theme-night">
        <ProjectShowcase projects={projects} />
        <ServicesSection services={services} />
        <Testimonials items={testimonials} />
        <LatestPosts posts={posts} />
        <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20 bg-grid py-24 md:py-32">
          <Container className="grid gap-14 md:grid-cols-[1fr_1.2fr] md:gap-20">
            <div>
              <Doodle name="mail" draw className="doodle-wiggle size-16" />
              <h2 id="contact-title" className="mt-6 text-headline font-extrabold">
                {t("title")}
              </h2>
              <p className="mt-6 max-w-[30rem] text-lg text-muted">{t("intro")}</p>
            </div>
            <div className="w-full">
              <ContactForm email={profile.email} />
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}
