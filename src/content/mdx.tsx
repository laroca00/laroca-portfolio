import "server-only";
import type { ComponentPropsWithoutRef, ReactElement } from "react";
import { cacheLife } from "next/cache";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";

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

/** Cached: MDX compilation reads the clock, which prerendering forbids outside a cache scope. */
export async function renderMdx(source: string): Promise<ReactElement> {
  "use cache";
  cacheLife("max");
  const { content } = await compileMDX({
    source,
    components: { a: MdxLink, img: MdxImage },
    options: {
      mdxOptions: {
        rehypePlugins: [[rehypePrettyCode, { theme: "github-dark-dimmed", keepBackground: true }]],
      },
    },
  });
  return content;
}
