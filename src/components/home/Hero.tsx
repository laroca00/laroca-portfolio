import { getTranslations } from "next-intl/server";
import type { Profile } from "@/content/schema";
import { Link } from "@/i18n/routing";
import { Container } from "../layout/Container";
import { TypedLine } from "./TypedLine";

export async function Hero({ profile }: { profile: Profile }) {
  const t = await getTranslations("Hero");
  const [line1, line2] = t("title").split("\n");

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[-20%] -z-10 mx-auto h-[70vh] max-w-4xl rounded-full bg-[radial-gradient(closest-side,rgb(41_151_255/0.16),transparent)] blur-2xl"
      />
      <Container className="flex min-h-[calc(100svh-3rem)] flex-col items-center justify-center py-24 text-center">
        {profile.openToWork && (
          <p className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3.5 py-1.5 text-sm text-muted">
            <span className="size-2 rounded-full bg-accent-green shadow-[0_0_10px] shadow-accent-green" />
            {t("openToWork")}
          </p>
        )}
        <h1 id="hero-title" className="text-gradient text-display font-semibold">
          {line1}
          <br />
          {line2}
        </h1>
        <p className="mt-6 max-w-[34rem] text-lg text-muted md:text-xl">{t("subtitle")}</p>
        <TypedLine text={t("terminal")} prompt="~/laroca $" className="mt-8 text-sm md:text-base" />
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={{ pathname: "/", hash: "work" }}
            className="rounded-full bg-text px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-85"
          >
            {t("ctaProjects")}
          </Link>
          <Link
            href={{ pathname: "/", hash: "contact" }}
            className="rounded-full px-6 py-3 text-sm font-medium text-link hover:underline"
          >
            {t("ctaContact")}
          </Link>
        </div>
      </Container>
    </section>
  );
}
