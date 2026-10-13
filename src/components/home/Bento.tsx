import { useTranslations } from "next-intl";
import type { Profile } from "@/content/schema";
import { Link } from "@/i18n/routing";
import type { TerminalLine } from "@/lib/github";
import { Container } from "../layout/Container";
import { TerminalCard } from "./TerminalCard";

export function Bento({ profile, terminalLines }: { profile: Profile; terminalLines: TerminalLine[] }) {
  const t = useTranslations("Bento");

  return (
    <section aria-labelledby="bento-title" className="py-24 md:py-32">
      <Container>
        <h2 id="bento-title" className="text-center text-headline font-semibold">
          {t("title")}
        </h2>
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-4">
          <article className="flex flex-col rounded-[28px] border border-border bg-surface p-7 md:col-span-2 md:min-h-[22rem]">
            <p className="text-sm text-muted">{profile.name}</p>
            <p className="mt-4 text-xl leading-snug md:text-2xl">{profile.bio}</p>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
              {profile.openToWork && (
                <p className="inline-flex items-center gap-2 text-sm text-accent-green">
                  <span className="size-2 rounded-full bg-accent-green" />
                  {t("openToWork")}
                </p>
              )}
              <Link href="/about" className="text-link hover:underline">
                {t("more")} <span aria-hidden="true">›</span>
              </Link>
            </div>
          </article>

          <TerminalCard lines={terminalLines} className="md:col-span-2 md:min-h-[22rem]" />

          {profile.stats.map((s) => (
            <article key={s.label} className="flex min-h-[10rem] flex-col justify-end rounded-[20px] border border-border bg-surface p-6">
              <p className="text-5xl font-semibold tracking-tight">{s.value}</p>
              <p className="mt-1 text-muted">{s.label}</p>
            </article>
          ))}

          <article className="rounded-[20px] border border-border bg-surface p-6 md:col-span-4">
            <h3 className="text-sm text-muted">{t("stack")}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {profile.stack.map((s) => (
                <li key={s} className="rounded-full border border-border bg-surface-2 px-3.5 py-1.5 text-sm">
                  {s}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </Container>
    </section>
  );
}
