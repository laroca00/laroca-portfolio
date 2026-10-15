import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { getPosts } from "@/content/load";
import { isEnabledLocale } from "@/i18n/config";
import { Link } from "@/i18n/routing";
import { formatDate } from "@/lib/format";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/blog">): Promise<Metadata> {
  const { locale } = await params;
  if (!isEnabledLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "Blog" });
  return { title: t("title"), description: t("intro"), alternates: alternatesFor(locale, "/blog") };
}

export default async function BlogPage({ params }: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  if (!isEnabledLocale(locale)) notFound();
  setRequestLocale(locale);
  const [posts, t, tp] = await Promise.all([
    getPosts(locale),
    getTranslations({ locale, namespace: "Blog" }),
    getTranslations({ locale, namespace: "LatestPosts" }),
  ]);

  return (
    <>
      <PageHeader title={t("title")} intro={t("intro")} doodle="book" />
      <Container className="pb-24">
        {posts.length === 0 ? (
          <p className="text-muted">{t("empty")}</p>
        ) : (
          <div className="max-w-[46rem]">
            {posts.map((p) => (
              <article key={p.slug} className="border-t border-dashed border-border py-10">
                <time dateTime={p.date.toISOString().slice(0, 10)} className="font-mono text-sm text-muted">
                  {formatDate(p.date, locale)}
                </time>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
                  <Link href={`/blog/${p.slug}`} className="hover:text-link">
                    {p.title}
                  </Link>
                </h2>
                <p className="mt-3 text-muted">{p.description}</p>
                <p className="mt-3 text-sm text-muted">{tp("readingTime", { minutes: p.readingMinutes })}</p>
              </article>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
