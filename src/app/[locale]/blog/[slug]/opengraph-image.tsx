import { getPost } from "@/content/load";
import { isEnabledLocale, resolveFallbackLocale } from "@/i18n/config";
import { OG_SIZE, renderOg } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "LaRoca blog yazısı kartı";

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = isEnabledLocale(raw) ? raw : resolveFallbackLocale();
  const post = await getPost(locale, slug);
  return renderOg({ title: post?.title ?? "LaRoca", subtitle: "blog" });
}
