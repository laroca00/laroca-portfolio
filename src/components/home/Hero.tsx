import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import type { Profile } from "@/content/schema";
import { Link } from "@/i18n/routing";
import { Doodle } from "../Doodle";
import { Container } from "../layout/Container";
import { Mascot } from "./Mascot";
import { TypedLine } from "./TypedLine";

const delay = (ms: number) => ({ "--rise-delay": `${ms}ms` }) as CSSProperties;

export async function Hero({ profile }: { profile: Profile }) {
  const t = await getTranslations("Hero");
  const [line1, line2] = t("title").split("\n");

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-paper">
      <Doodle
        name="spark"
        className="float absolute top-28 left-[6%] -z-10 hidden size-9 text-ink md:block"
      />
      <Doodle
        name="squiggle"
        className="float absolute right-[8%] bottom-16 -z-10 hidden w-24 text-link md:block"
        tint="none"
      />
      <Container className="grid min-h-svh items-center gap-12 pt-28 pb-20 md:grid-cols-[1.6fr_1fr] md:pt-32 md:pb-24">
        <div>
          {profile.openToWork && (
            <p className="rise mb-8 inline-flex items-center gap-2.5 rounded-full border-2 border-ink bg-tint-leaf px-3.5 py-1 font-mono text-xs font-semibold text-ink shadow-[3px_3px_0] shadow-ink">
              <span className="blink size-2 rounded-full bg-ink" />
              {t("openToWork")}
            </p>
          )}
          <h1
            id="hero-title"
            className="text-[clamp(2.6rem,7vw,5.25rem)] leading-[0.98] font-extrabold tracking-[-0.04em]"
          >
            <span className="rise block" style={delay(80)}>
              {line1}
            </span>
            <span className="rise relative inline-block font-serif font-normal text-link" style={delay(200)}>
              {line2}
              <svg
                viewBox="0 0 300 16"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="draw-on-load absolute -bottom-2 left-0 h-3 w-full overflow-visible"
              >
                <path
                  d="M3 11c40-6 90-9 140-7s100 6 154 1"
                  pathLength={1}
                  className="doodle-line"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          <p className="rise mt-8 max-w-[34rem] text-lg text-muted md:text-xl" style={delay(320)}>
            {t("subtitle")}
          </p>
          <TypedLine text={t("terminal")} prompt="~/laroca $" className="mt-6 text-sm md:text-base" />
          <div className="rise mt-10 flex flex-wrap items-center gap-5" style={delay(440)}>
            <Link
              href={{ pathname: "/", hash: "work" }}
              className="group inline-flex items-center gap-2 rounded-full border-2 border-ink bg-ink px-6 py-3 text-sm font-semibold text-paper shadow-[4px_4px_0] shadow-link transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
            >
              {t("ctaProjects")}
              <Doodle name="arrow" className="doodle-wiggle size-5 rotate-90" />
            </Link>
            <Link
              href={{ pathname: "/", hash: "contact" }}
              className="group inline-flex items-center gap-2 text-sm font-semibold underline decoration-link decoration-wavy decoration-1 underline-offset-[6px] hover:text-link"
            >
              <Doodle name="mail" className="doodle-wiggle size-6" />
              {t("ctaContact")}
            </Link>
          </div>
        </div>
        <Mascot className="rise mx-auto w-full max-w-[22rem] md:max-w-[26rem]" />
      </Container>
    </section>
  );
}
