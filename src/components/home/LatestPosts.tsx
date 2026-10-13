import { useLocale, useTranslations } from "next-intl";
import type { Post } from "@/content/schema";
import { Link } from "@/i18n/routing";
import { formatDate } from "@/lib/format";
import { Container } from "../layout/Container";

export function LatestPosts({ posts, limit = 3 }: { posts: Post[]; limit?: number }) {
  const t = useTranslations("LatestPosts");
  const locale = useLocale();
  if (!posts.length) return null;

  return (
    <section aria-labelledby="posts-title" className="py-24 md:py-32">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <h2 id="posts-title" className="text-headline font-semibold">
            {t("title")}
          </h2>
          <Link href="/blog" className="shrink-0 text-link hover:underline">
            {t("all")} <span aria-hidden="true">›</span>
          </Link>
        </div>
        <ul className="mt-12">
          {posts.slice(0, limit).map((p) => (
            <li key={p.slug} className="border-t border-border">
              <Link
                href={`/blog/${p.slug}`}
                className="group grid gap-2 py-7 md:grid-cols-[12rem_1fr_auto] md:items-baseline md:gap-8"
              >
                <time dateTime={p.date.toISOString().slice(0, 10)} className="text-sm text-muted">
                  {formatDate(p.date, locale)}
                </time>
                <span className="text-xl font-semibold tracking-tight group-hover:text-link">{p.title}</span>
                <span className="text-sm text-muted">{t("readingTime", { minutes: p.readingMinutes })}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
