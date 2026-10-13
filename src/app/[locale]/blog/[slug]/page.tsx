import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { getPost, getPosts } from "@/content/load";
import { renderMdx } from "@/content/mdx";
import { isEnabledLocale } from "@/i18n/config";
import { Link } from "@/i18n/routing";
import { formatDate } from "@/lib/format";

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  if (!isEnabledLocale(params.locale)) return [];
  return (await getPosts(params.locale)).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isEnabledLocale(locale)) return {};
  const post = await getPost(locale, slug);
  return post
    ? {
        title: post.title,
        description: post.description,
        openGraph: { type: "article", publishedTime: post.date.toISOString() },
      }
    : {};
}

export default async function PostPage({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  if (!isEnabledLocale(locale)) notFound();
  setRequestLocale(locale);
  const post = await getPost(locale, slug);
  if (!post) notFound();
  const [body, t, tp] = await Promise.all([
    renderMdx(post.body),
    getTranslations({ locale, namespace: "Blog" }),
    getTranslations({ locale, namespace: "LatestPosts" }),
  ]);

  return (
    <article className="pb-24">
      <header className="pt-20 pb-12 md:pt-28">
        <Container>
          <div className="mx-auto max-w-[46rem]">
            <Link href="/blog" className="text-sm text-link hover:underline">
              <span aria-hidden="true">‹</span> {t("back")}
            </Link>
            <h1 className="mt-6 text-headline font-semibold">{post.title}</h1>
            <p className="mt-5 text-lg text-muted">{post.description}</p>
            <p className="mt-6 flex flex-wrap gap-x-4 text-sm text-muted">
              <time dateTime={post.date.toISOString().slice(0, 10)}>{formatDate(post.date, locale)}</time>
              <span>{tp("readingTime", { minutes: post.readingMinutes })}</span>
            </p>
            {post.tags.length > 0 && (
              <ul aria-label={t("tags")} className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag} className="rounded-full border border-border px-3 py-1 text-xs text-muted">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Container>
      </header>
      <Container>
        <div className="prose-laroca mx-auto">{body}</div>
      </Container>
    </article>
  );
}
