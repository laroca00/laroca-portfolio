import { useTranslations } from "next-intl";
import type { Testimonial } from "@/content/schema";
import { Container } from "../layout/Container";

export function Testimonials({ items }: { items: Testimonial[] }) {
  const t = useTranslations("Testimonials");
  if (!items.length) return null;

  return (
    <section aria-labelledby="testimonials-title" className="py-24 md:py-32">
      <Container>
        <h2 id="testimonials-title" className="text-center text-headline font-semibold">
          {t("title")}
        </h2>
        <ul
          tabIndex={0}
          aria-labelledby="testimonials-title"
          className="-mx-4 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0"
        >
          {items.map((item, i) => (
            <li key={i} className="w-[85%] shrink-0 snap-center md:w-auto">
              <figure className="flex h-full flex-col rounded-[28px] bg-surface p-8">
                <blockquote className="text-xl leading-snug before:content-['“'] after:content-['”'] md:text-2xl">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-auto pt-8 text-sm">
                  <span className="font-medium">{item.author}</span>
                  <span className="block text-muted">
                    {item.role}, {item.org}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
