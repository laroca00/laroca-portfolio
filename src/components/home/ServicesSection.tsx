import { useTranslations } from "next-intl";
import type { Service } from "@/content/schema";
import { Doodle, isDoodleName } from "../Doodle";
import { Container } from "../layout/Container";

export function ServicesSection({ services, headingLevel = 2 }: { services: Service[]; headingLevel?: 1 | 2 }) {
  const t = useTranslations("Services");
  if (!services.length) return null;
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const ItemHeading = headingLevel === 1 ? "h2" : "h3";

  return (
    <section aria-labelledby="services-title" className="py-24 md:py-32">
      <Container>
        <Heading id="services-title" className="max-w-[18ch] text-headline font-extrabold">
          {t("title")}
        </Heading>
        <p className="mt-4 max-w-[40rem] text-lg text-muted">{t("intro")}</p>
        <ul className="mt-14 grid gap-x-14 md:grid-cols-2">
          {services.map((s, i) => (
            <li key={s.title} className="group reveal flex gap-5 border-t-2 border-dashed border-border py-8">
              <Doodle
                name={isDoodleName(s.icon) ? s.icon : "code"}
                draw
                className="doodle-wiggle size-12 shrink-0"
              />
              <div>
                <p className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</p>
                <ItemHeading className="mt-1 text-xl font-bold tracking-tight">{s.title}</ItemHeading>
                <p className="mt-2 max-w-[34rem] text-muted">{s.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
