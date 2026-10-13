"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { OPEN_COMMAND_PALETTE } from "@/lib/site";
import { Container } from "./Container";

const LINKS = [
  { key: "projects", href: "/projects" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "blog", href: "/blog" },
] as const;

export function Nav({ languageSwitcher }: { languageSwitcher?: ReactNode }) {
  const t = useTranslations("Nav");
  const openPalette = () => window.dispatchEvent(new Event(OPEN_COMMAND_PALETTE));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/72 backdrop-blur-xl backdrop-saturate-150">
      <Container className="flex h-12 items-center gap-6 text-sm">
        <Link href="/" className="font-semibold tracking-tight text-text">
          LaRoca
        </Link>
        <nav aria-label={t("label")} className="ml-auto hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <Link key={l.key} href={l.href} className="text-muted transition-colors hover:text-text">
              {t(l.key)}
            </Link>
          ))}
          <Link href={{ pathname: "/", hash: "contact" }} className="text-muted transition-colors hover:text-text">
            {t("contact")}
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-3 md:ml-0">
          {languageSwitcher}
          <button
            type="button"
            onClick={openPalette}
            aria-label={t("palette")}
            className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-white/25 hover:text-text"
          >
            <span className="md:hidden">{t("menu")}</span>
            <kbd className="hidden font-mono md:inline">⌘K</kbd>
          </button>
        </div>
      </Container>
    </header>
  );
}
