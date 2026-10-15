import "server-only";
import type { ComponentPropsWithoutRef, ReactElement } from "react";
import { cacheLife } from "next/cache";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { Compare } from "@/components/case/Compare";
import { slugify } from "@/lib/slug";

function MdxLink({ href = "", ...props }: ComponentPropsWithoutRef<"a">) {
  const external = /^https?:\/\//.test(href);
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
  ) : (
    <a href={href} {...props} />
  );
}

/** MDX images have no known dimensions, so they stay plain lazy <img>. */
function MdxImage({ alt = "", ...props }: ComponentPropsWithoutRef<"img">) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} loading="lazy" decoding="async" {...props} />;
}

/** Sections get ids so the case-study table of contents can link to them. */
function MdxH2({ children, ...props }: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2 id={typeof children === "string" ? slugify(children) : undefined} className="scroll-mt-28" {...props}>
      {children}
    </h2>
  );
}

/** `## Heading` lines of an MDX body, in order (for the table of contents). */
export function mdxSections(source: string) {
  return [...source.matchAll(/^## (.+)$/gm)].map(([, title]) => ({ id: slugify(title.trim()), title: title.trim() }));
}

/** Cached: MDX compilation reads the clock, which prerendering forbids outside a cache scope. */
export async function renderMdx(source: string): Promise<ReactElement> {
  "use cache";
  cacheLife("max");
  const { content } = await compileMDX({
    source,
    components: { a: MdxLink, img: MdxImage, h2: MdxH2, Compare },
    options: {
      mdxOptions: {
        rehypePlugins: [[rehypePrettyCode, { theme: "github-dark-dimmed", keepBackground: true }]],
      },
    },
  });
  return content;
}
