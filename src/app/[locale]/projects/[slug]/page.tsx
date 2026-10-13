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

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  if (!isEnabledLocale(params.locale)) return [];
  return (await getProjects(params.locale)).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isEnabledLocale(locale)) return {};
  const project = await getProject(locale, slug);
  return project ? { title: project.title, description: project.tagline } : {};
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
    <article>
      <header className="pt-20 pb-12 text-center md:pt-28">
        <Container className="flex flex-col items-center">
          <p className={`text-sm font-medium md:text-base ${accent.text}`}>{project.label}</p>
          <h1 className="mt-3 text-display font-semibold">{project.title}</h1>
          <p className="mt-6 max-w-[38rem] text-lg text-muted md:text-xl">{project.tagline}</p>
          <ul aria-label={t("stack")} className="mt-8 flex flex-wrap justify-center gap-2">
            {project.stack.map((s) => (
              <li key={s} className="rounded-full border border-border px-3 py-1 text-sm text-muted">
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-lg">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-link hover:underline">
                {t("visit")} <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.storeUrl && (
              <a
                href={project.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link hover:underline"
              >
                {t("store")} <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-link hover:underline">
                {t("repo")} <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </Container>
      </header>

      {project.cover && (
        <Container>
          <div
            className={`relative mx-auto aspect-[16/10] max-w-[980px] overflow-hidden rounded-[28px] border border-border shadow-[0_30px_120px_-20px] ${accent.glow}`}
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
          className="mx-auto grid max-w-[46rem] gap-4 border-t border-border pt-8 sm:grid-cols-2"
        >
          {prev ? (
            <Link href={`/projects/${prev.slug}`} className="group">
              <span className="text-sm text-muted">{t("previous")}</span>
              <span className="block text-lg font-semibold group-hover:text-link">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/projects/${next.slug}`} className="group sm:text-right">
              <span className="text-sm text-muted">{t("next")}</span>
              <span className="block text-lg font-semibold group-hover:text-link">{next.title}</span>
            </Link>
          )}
        </nav>
      </Container>
    </article>
  );
}
