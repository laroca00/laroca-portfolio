"use client";

import { Command } from "cmdk";
import { useRouter as useNextRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LOCALE_LABELS, type Locale } from "@/i18n/config";
import { getPathname, usePathname, useRouter } from "@/i18n/routing";
import { OPEN_COMMAND_PALETTE } from "@/lib/site";
import { GITHUB_URL } from "@/lib/links";

type Props = { projects: { slug: string; title: string }[]; email: string; locales: Locale[] };

const PAGES = [
  { key: "home", href: "/" },
  { key: "projects", href: "/projects" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "blog", href: "/blog" },
] as const;

const itemClass =
  "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted data-[selected=true]:bg-surface-2 data-[selected=true]:text-text";
const groupClass =
  "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-muted/70";

export function CommandPalette({ projects, email, locales }: Props) {
  const t = useTranslations("Command");
  const tNav = useTranslations("Nav");
  const locale = useLocale();
  const router = useRouter();
  const nextRouter = useNextRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_COMMAND_PALETTE, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_COMMAND_PALETTE, onOpen);
    };
  }, []);

  const run = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setCopied(false);
      }}
      label={t("label")}
      overlayClassName="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      contentClassName="fixed left-1/2 top-[12vh] z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-[22px] border border-border bg-surface font-mono shadow-2xl"
    >
      <div className="flex items-center gap-2 border-b border-border px-4">
        <span aria-hidden="true" className="text-sm text-terminal">
          ~/laroca $
        </span>
        <Command.Input
          placeholder={t("placeholder")}
          className="h-14 flex-1 bg-transparent text-sm text-text placeholder:text-muted/70 focus:outline-none"
        />
      </div>
      <Command.List className="max-h-[min(60vh,26rem)] overflow-y-auto p-2">
        <Command.Empty className="px-3 py-6 text-center text-sm text-muted">{t("empty")}</Command.Empty>

        <Command.Group heading={t("go")} className={groupClass}>
          {PAGES.map((p) => (
            <Command.Item key={p.key} className={itemClass} onSelect={() => run(() => router.push(p.href))}>
              {p.key === "home" ? t("home") : tNav(p.key)}
            </Command.Item>
          ))}
          <Command.Item
            value={tNav("contact")}
            className={itemClass}
            onSelect={() => run(() => nextRouter.push(`${getPathname({ href: "/", locale })}#contact`))}
          >
            {tNav("contact")}
          </Command.Item>
        </Command.Group>

        <Command.Group heading={tNav("projects")} className={groupClass}>
          {projects.map((p) => (
            <Command.Item
              key={p.slug}
              value={p.title}
              className={itemClass}
              onSelect={() => run(() => router.push(`/projects/${p.slug}`))}
            >
              {p.title}
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading={t("actions")} className={groupClass}>
          <Command.Item value={t("copyEmail")} className={itemClass} onSelect={copyEmail}>
            {copied ? t("copied") : t("copyEmail")}
          </Command.Item>
          <Command.Item
            value={t("downloadCv")}
            className={itemClass}
            onSelect={() => run(() => window.open(`/cv/${locale}.pdf`, "_blank", "noopener"))}
          >
            {t("downloadCv")}
          </Command.Item>
          <Command.Item
            value={t("github")}
            className={itemClass}
            onSelect={() => run(() => window.open(GITHUB_URL, "_blank", "noopener"))}
          >
            {t("github")}
          </Command.Item>
        </Command.Group>

        {locales.length > 1 && (
          <Command.Group heading={t("language")} className={groupClass}>
            {locales.map((l) => (
              <Command.Item
                key={l}
                value={LOCALE_LABELS[l]}
                className={itemClass}
                onSelect={() => run(() => router.replace(pathname, { locale: l }))}
              >
                {LOCALE_LABELS[l]}
              </Command.Item>
            ))}
          </Command.Group>
        )}
      </Command.List>
    </Command.Dialog>
  );
}
