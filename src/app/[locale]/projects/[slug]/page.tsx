import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ACCENT_CLASSES } from "@/components/accent";
import { Container } from "@/components/layout/Container";
import { getProject, getProjects } from "@/content/load";
import { renderMdx } from "@/content/mdx";
import { isEnabledLocale } from "@/i18n/config";
import { Link } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo";

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  if (!isEnabledLocale(params.locale)) return [];
  return (await getProjects(params.locale)).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isEnabledLocale(locale)) return {};
  const project = await getProject(locale, slug);
  return project
    ? { title: project.title, description: project.tagline, alternates: alternatesFor(locale, `/projects/${slug}`) }
    : {};
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  if (!isEnabledLocale(locale)) notFound();
  setRequestLocale(locale);
  const [projects, t] = await Promise.all([getProjects(locale), getTranslations({ locale, namespace: "Project" })]);
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const prev = projects[index - 1];
  const next = projects[index + 1];
  const body = await renderMdx(project.body);
  const accent = ACCENT_CLASSES[project.accent];

  return (
    <article className="theme-night flex-1 bg-grid">
      <header className="pt-32 pb-12 md:pt-40">
        <Container>
          <p className={`font-mono text-sm ${accent.text}`}>~/projeler/{project.slug} · {project.label} · {project.year}</p>
          <h1 className="mt-4 text-display font-extrabold">{project.title}</h1>
          <p className="mt-6 max-w-[38rem] text-lg text-muted md:text-xl">{project.tagline}</p>
          <ul aria-label={t("stack")} className="mt-8 flex flex-wrap gap-2 font-mono">
            {project.stack.map((s) => (
              <li key={s} className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-muted">
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-lg font-semibold">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-link underline decoration-wavy decoration-1 underline-offset-[6px] hover:text-text">
                {t("visit")} <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.storeUrl && (
              <a
                href={project.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link underline decoration-wavy decoration-1 underline-offset-[6px] hover:text-text"
              >
                {t("store")} <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-link underline decoration-wavy decoration-1 underline-offset-[6px] hover:text-text">
                {t("repo")} <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </Container>
      </header>

      {project.cover && (
        <Container>
          <div
            className={`relative aspect-[16/10] overflow-hidden rounded-[14px] border border-border shadow-[0_30px_120px_-20px] ${accent.glow}`}
          >
            <Image
              src={project.cover}
              alt={t("coverAlt", { title: project.title })}
              fill
              priority
              sizes="(min-width: 1024px) 980px, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      )}

      <Container className="py-20">
        <div className="prose-laroca mx-auto">{body}</div>
      </Container>

      <Container className="pb-24">
        <nav
          aria-label={t("pagination")}
          className="mx-auto grid max-w-[46rem] gap-4 border-t border-dashed border-border pt-8 sm:grid-cols-2"
        >
          {prev ? (
            <Link href={`/projects/${prev.slug}`} className="group">
              <span className="font-mono text-sm text-muted">← {t("previous")}</span>
              <span className="block text-lg font-bold group-hover:text-link">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/projects/${next.slug}`} className="group sm:text-right">
              <span className="font-mono text-sm text-muted">{t("next")} →</span>
              <span className="block text-lg font-bold group-hover:text-link">{next.title}</span>
            </Link>
          )}
        </nav>
      </Container>
    </article>
  );
}
