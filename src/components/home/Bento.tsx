import { useTranslations } from "next-intl";
import type { Profile } from "@/content/schema";
import { Link } from "@/i18n/routing";
import type { TerminalLine } from "@/lib/github";
import { Doodle } from "../Doodle";
import { Container } from "../layout/Container";
import { TerminalCard } from "./TerminalCard";

const STICKER_TINTS = ["bg-tint-sun", "bg-tint-sky", "bg-tint-rose", "bg-tint-leaf", "bg-tint-lilac"];
const STICKER_TILTS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

export function Bento({ profile, terminalLines }: { profile: Profile; terminalLines: TerminalLine[] }) {
  const t = useTranslations("Bento");

  return (
    <section aria-labelledby="bento-title" className="bg-paper py-24 md:py-32">
      <Container className="grid gap-14 md:grid-cols-[1.1fr_1fr] md:gap-16">
        <div className="reveal">
          <h2 id="bento-title" className="flex items-center gap-3 text-headline font-extrabold">
            <Doodle name="person" draw className="size-11 shrink-0 md:size-14" />
            {t("title")}
          </h2>
          <p className="mt-8 text-xl leading-snug md:text-2xl">{profile.bio}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            {profile.openToWork && (
              <p className="inline-flex items-center gap-2 font-mono text-sm text-accent-green">
                <span className="blink size-2 rounded-full bg-accent-green" />
                {t("openToWork")}
              </p>
            )}
            <Link
              href="/about"
              className="group inline-flex items-center gap-1.5 font-semibold text-link underline decoration-wavy decoration-1 underline-offset-[6px]"
            >
              {t("more")}
              <Doodle name="arrow" className="doodle-wiggle size-5" />
            </Link>
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {profile.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="mt-2 text-sm leading-tight text-muted">{s.label}</dt>
                <dd className="relative w-fit px-2 text-5xl font-extrabold tracking-tight">
                  <svg
                    viewBox="0 0 80 56"
                    aria-hidden="true"
                    className="doodle-draw absolute -inset-x-2 -inset-y-1 h-[calc(100%+0.5rem)] w-[calc(100%+1rem)] overflow-visible text-link"
                  >
                    <path
                      d="M44 4C20 2 3 13 4 29s20 24 40 23 33-10 32-25S58 2 30 7"
                      pathLength={1}
                      className="doodle-line"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="relative">{s.value}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-col gap-12">
          <TerminalCard lines={terminalLines} className="reveal md:rotate-1" />
          <div className="reveal">
            <h3 className="font-mono text-sm text-muted">{`// ${t("stack")}`}</h3>
            <ul className="mt-5 flex flex-wrap gap-3">
              {profile.stack.map((s, i) => (
                <li
                  key={s}
                  className={`rounded-lg border-2 border-ink px-3 py-1 text-sm font-semibold text-ink shadow-[2px_2px_0] shadow-ink transition-transform hover:-translate-y-1 hover:rotate-0 ${STICKER_TINTS[i % STICKER_TINTS.length]} ${STICKER_TILTS[i % STICKER_TILTS.length]}`}
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
