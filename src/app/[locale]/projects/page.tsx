import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ACCENT_CLASSES } from "@/components/accent";
import { Doodle } from "@/components/Doodle";
import { CATEGORY_DOODLE } from "@/components/home/ProjectShowcase";
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
    <div className="theme-night flex-1 bg-grid">
      <PageHeader title={t("title")} intro={t("intro")} doodle="folder" />
      <Container className="pb-24">
        <ul className="border-b border-dashed border-border">
          {ordered.map((p, i) => (
            <li key={p.slug} className="reveal border-t border-dashed border-border">
              <Link
                href={`/projects/${p.slug}`}
                className="group grid items-center gap-5 py-8 md:grid-cols-[4rem_1fr_15rem] md:gap-8"
              >
                <span className={`font-mono text-sm ${ACCENT_CLASSES[p.accent].text}`}>
                  P-{String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex gap-4">
                  <Doodle
                    name={CATEGORY_DOODLE[p.category]}
                    className="doodle-wiggle mt-1 hidden size-9 shrink-0 sm:block"
                  />
                  <div>
                    <h2 className="text-2xl font-extrabold tracking-tight transition-colors group-hover:text-link md:text-4xl">
                      {p.title}
                    </h2>
                    <p className="mt-2 max-w-[36rem] text-muted">{p.tagline}</p>
                    <p className="mt-3 font-mono text-xs text-muted">
                      {p.label} · {p.year}
                    </p>
                  </div>
                </div>
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-surface transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-105 motion-reduce:transition-none">
                  {p.cover && (
                    <Image src={p.cover} alt="" fill sizes="(min-width: 768px) 240px, 100vw" className="object-cover" />
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
