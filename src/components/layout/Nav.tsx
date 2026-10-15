"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { OPEN_COMMAND_PALETTE } from "@/lib/site";
import { Doodle } from "../Doodle";

const LINKS = [
  { key: "projects", href: "/projects" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "blog", href: "/blog" },
] as const;

const linkClass = "rounded-full px-3 py-1.5 text-paper/75 transition-colors hover:bg-paper/10 hover:text-paper";

/** Floating ink pill: reads the same over the day half and the night half. */
export function Nav({ languageSwitcher }: { languageSwitcher?: ReactNode }) {
  const t = useTranslations("Nav");
  const openPalette = () => window.dispatchEvent(new Event(OPEN_COMMAND_PALETTE));

  return (
    // Zero-height in flow so each page's own background (day or night) runs up behind the pill.
    <header className="pointer-events-none sticky top-0 z-40 -mb-20 h-20 px-4 pt-3 md:pt-4">
      <div className="pointer-events-auto mx-auto flex h-12 max-w-[1200px] items-center gap-2 rounded-full bg-ink pr-2 pl-4 text-sm text-paper shadow-[4px_4px_0] shadow-ink/25 ring-1 ring-paper/15">
        <Link href="/" className="group flex items-center gap-2 font-mono font-semibold tracking-tight">
          <Doodle name="terminal" className="doodle-wiggle size-6 text-paper" />
          laroca<span className="text-tint-sun">.dev</span>
        </Link>
        <nav aria-label={t("label")} className="ml-auto hidden items-center md:flex">
          {LINKS.map((l) => (
            <Link key={l.key} href={l.href} className={linkClass}>
              {t(l.key)}
            </Link>
          ))}
          <Link href={{ pathname: "/", hash: "contact" }} className={linkClass}>
            {t("contact")}
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2 md:ml-2">
          {languageSwitcher}
          <button
            type="button"
            onClick={openPalette}
            aria-label={t("palette")}
            className="flex items-center gap-2 rounded-full bg-tint-sun px-3 py-1.5 font-mono text-xs font-semibold text-ink transition-transform hover:-rotate-2"
          >
            <span className="md:hidden">{t("menu")}</span>
            <kbd className="hidden font-mono md:inline">⌘K</kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
