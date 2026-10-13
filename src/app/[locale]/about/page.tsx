import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Timeline } from "@/components/about/Timeline";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { getExperience, getProfile } from "@/content/load";
import { isEnabledLocale } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  if (!isEnabledLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "About" });
  return { title: t("title") };
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!isEnabledLocale(locale)) notFound();
  setRequestLocale(locale);
  const [profile, experience, t] = await Promise.all([
    getProfile(locale),
    getExperience(locale),
    getTranslations({ locale, namespace: "About" }),
  ]);

  return (
    <>
      <PageHeader title={t("title")} intro={profile.bio}>
        <a
          href={`/cv/${locale}.pdf`}
          download={`Tugberk-Emre-Akkurt-CV-${locale}.pdf`}
          className="mt-8 inline-flex rounded-full bg-text px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-85"
        >
          {t("cv")}
        </a>
      </PageHeader>
      <Container className="grid gap-16 pb-24 md:grid-cols-[1fr_18rem]">
        <section aria-labelledby="timeline-title">
          <h2 id="timeline-title" className="mb-10 text-2xl font-semibold tracking-tight">
            {t("timeline")}
          </h2>
          <Timeline items={experience} />
        </section>
        <section aria-labelledby="stack-title">
          <h2 id="stack-title" className="mb-6 text-2xl font-semibold tracking-tight">
            {t("stack")}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {profile.stack.map((s) => (
              <li key={s} className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm">
                {s}
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
