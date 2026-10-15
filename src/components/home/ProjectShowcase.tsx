import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Project } from "@/content/schema";
import { Link } from "@/i18n/routing";
import { ACCENT_CLASSES } from "../accent";
import { Doodle, type DoodleName } from "../Doodle";
import { Container } from "../layout/Container";
import { TiltFrame } from "../motion/TiltFrame";
import { LivePreview } from "./LivePreview";
import { PhoneShowcase } from "./PhoneShowcase";

export const CATEGORY_DOODLE: Record<Project["category"], DoodleName> = {
  web: "globe",
  mobile: "smartphone",
  game: "cards",
  backend: "server",
};

const linkClass =
  "group inline-flex items-center gap-1.5 font-semibold text-link underline decoration-wavy decoration-1 underline-offset-[6px] hover:text-text";

export function ProjectShowcase({ projects }: { projects: Project[] }) {
  const t = useTranslations("Showcase");
  const featured = projects.filter((p) => p.featured);

  return (
    <div id="work" className="scroll-mt-20 bg-grid pt-16 md:pt-24">
      <Container>
        <p className="font-mono text-sm text-muted md:text-base">
          <span className="text-terminal">~/laroca $</span> <span className="text-text">{t("command")}</span>
        </p>
      </Container>
      {featured.map((p, i) => {
        const accent = ACCENT_CLASSES[p.accent];
        const titleId = `project-${p.slug}`;
        const flip = i % 2 === 1;
        return (
          <section key={p.slug} aria-labelledby={titleId} className="py-16 md:py-24">
            <Container className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
              <div className={`reveal md:col-span-5 ${flip ? "md:order-2" : ""}`}>
                <p className="flex items-center gap-3 font-mono text-sm text-muted">
                  <span className={accent.text}>P-{String(i + 1).padStart(2, "0")}</span>
                  <span aria-hidden="true" className="h-px w-10 bg-border" />
                  {p.year}
                </p>
                <p className={`mt-6 flex items-center gap-2 font-mono text-sm ${accent.text}`}>
                  <Doodle name={CATEGORY_DOODLE[p.category]} className="doodle-wiggle size-7 text-text" />
                  {p.label}
                </p>
                <h2 id={titleId} className="mt-3 scroll-mt-24 text-headline font-extrabold">
                  {p.title}
                </h2>
                <p className="mt-4 max-w-[30rem] text-lg text-muted">{p.tagline}</p>
                {p.stack.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-2 font-mono text-xs text-muted">
                    {p.stack.map((s) => (
                      <li key={s} className="rounded-md border border-border bg-surface px-2 py-1">
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
                  <Link href={`/projects/${p.slug}`} className={linkClass}>
                    {t("readCase")}
                    <Doodle name="arrow" className="doodle-wiggle size-5" />
                  </Link>
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {t("visit")} <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  {p.storeUrl && (
                    <a href={p.storeUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {t("store")} <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </div>

              {p.screens?.length ? (
                <div data-testid="project-cover" className={`reveal md:col-span-7 ${flip ? "md:order-1" : ""}`}>
                  <PhoneShowcase screens={p.screens} title={p.title} />
                </div>
              ) : (
                <TiltFrame className={`md:col-span-7 ${flip ? "md:order-1" : ""}`}>
                  <div
                    data-testid="project-cover"
                    className="reveal-wipe overflow-hidden rounded-[14px] border border-border bg-surface shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)]"
                  >
                    <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 font-mono text-xs text-muted">
                      <span aria-hidden="true" className="flex gap-1.5">
                        <span className="size-2.5 rounded-full bg-tint-rose" />
                        <span className="size-2.5 rounded-full bg-tint-sun" />
                        <span className="size-2.5 rounded-full bg-tint-leaf" />
                      </span>
                      <span className="ml-2 truncate">~/projeler/{p.slug}</span>
                    </div>
                    {p.preview && p.liveUrl ? (
                      <LivePreview src={p.preview} url={p.liveUrl} title={p.title} />
                    ) : (
                      <div className="relative aspect-[16/10] bg-surface-2">
                        {p.cover && (
                          <Image
                            src={p.cover}
                            alt={t("coverAlt", { title: p.title })}
                            fill
                            sizes="(min-width: 1024px) 680px, 100vw"
                            className="object-cover"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </TiltFrame>
              )}
            </Container>
          </section>
        );
      })}
    </div>
  );
}
