import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Project } from "@/content/schema";
import { Link } from "@/i18n/routing";
import { ACCENT_CLASSES } from "../accent";
import { Container } from "../layout/Container";
import { Reveal } from "../motion/Reveal";

export function ProjectShowcase({ projects }: { projects: Project[] }) {
  const t = useTranslations("Showcase");
  const featured = projects.filter((p) => p.featured);

  return (
    <div id="work" className="scroll-mt-12">
      {featured.map((p) => {
        const accent = ACCENT_CLASSES[p.accent];
        const titleId = `project-${p.slug}`;
        return (
          <section key={p.slug} aria-labelledby={titleId} className="overflow-hidden py-24 md:py-32">
            <Container className="flex flex-col items-center text-center">
              <p className={`text-sm font-medium md:text-base ${accent.text}`}>{p.label}</p>
              <h2 id={titleId} className="mt-3 scroll-mt-24 text-headline font-semibold">
                {p.title}
              </h2>
              <p className="mt-4 max-w-[38rem] text-lg text-muted md:text-xl">{p.tagline}</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-base md:text-lg">
                <Link href={`/projects/${p.slug}`} className="text-link hover:underline">
                  {t("readCase")} <span aria-hidden="true">›</span>
                </Link>
                {p.liveUrl && (
                  <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-link hover:underline">
                    {t("visit")} <span aria-hidden="true">↗</span>
                  </a>
                )}
                {p.storeUrl && (
                  <a href={p.storeUrl} target="_blank" rel="noopener noreferrer" className="text-link hover:underline">
                    {t("store")} <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
              <Reveal variant="scale" className="mt-14 w-full max-w-[980px]">
                <div
                  data-testid="project-cover"
                  className={`relative aspect-[16/10] overflow-hidden rounded-[28px] border border-border bg-surface shadow-[0_30px_120px_-20px] ${accent.glow}`}
                >
                  {p.cover && (
                    <Image
                      src={p.cover}
                      alt={t("coverAlt", { title: p.title })}
                      fill
                      sizes="(min-width: 1024px) 980px, 100vw"
                      className="object-cover"
                    />
                  )}
                </div>
              </Reveal>
            </Container>
          </section>
        );
      })}
    </div>
  );
}
