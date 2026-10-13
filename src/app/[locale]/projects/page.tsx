import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ACCENT_CLASSES } from "@/components/accent";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { getProjects } from "@/content/load";
import { isEnabledLocale } from "@/i18n/config";
import { Link } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/projects">): Promise<Metadata> {
  const { locale } = await params;
  if (!isEnabledLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "Projects" });
  return { title: t("title"), description: t("intro"), alternates: alternatesFor(locale, "/projects") };
}

export default async function ProjectsPage({ params }: PageProps<"/[locale]/projects">) {
  const { locale } = await params;
  if (!isEnabledLocale(locale)) notFound();
  setRequestLocale(locale);
  const [projects, t] = await Promise.all([getProjects(locale), getTranslations({ locale, namespace: "Projects" })]);
  const ordered = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)];

  return (
    <>
      <PageHeader title={t("title")} intro={t("intro")} />
      <Container className="pb-24">
        <ul className="grid gap-x-6 gap-y-14 md:grid-cols-2">
          {ordered.map((p) => (
            <li key={p.slug}>
              <Link href={`/projects/${p.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] border border-border bg-surface">
                  {p.cover && (
                    <Image
                      src={p.cover}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 576px, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                    />
                  )}
                </div>
                <p className={`mt-5 text-sm font-medium ${ACCENT_CLASSES[p.accent].text}`}>{p.label}</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight group-hover:text-link">{p.title}</h2>
                <p className="mt-2 max-w-[34rem] text-muted">{p.tagline}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
