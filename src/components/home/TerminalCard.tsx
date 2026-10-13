import { useTranslations } from "next-intl";
import type { TerminalLine } from "@/lib/github";

export function TerminalCard({ lines, className = "" }: { lines: TerminalLine[]; className?: string }) {
  const t = useTranslations("Terminal");
  return (
    <figure
      className={`flex flex-col overflow-hidden rounded-[28px] border border-terminal/15 bg-[#050806] font-mono text-[13px] leading-relaxed ${className}`}
    >
      <figcaption className="flex items-center gap-2 border-b border-white/5 px-5 py-3 text-xs text-muted">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
        </span>
        <span className="ml-2">{t("title")}</span>
      </figcaption>
      <div className="flex-1 px-5 py-4">
        <p className="text-muted">
          ~/laroca $ <span className="text-text">{t("command")}</span>
        </p>
        <ol className="mt-2 space-y-1">
          {lines.map((l, i) => (
            <li key={`${l.date}-${i}`} className="flex gap-3">
              <time dateTime={l.date} className="shrink-0 text-muted/70">
                {l.date}
              </time>
              <span className="min-w-0 break-words text-terminal">{l.message}</span>
            </li>
          ))}
        </ol>
        <p aria-hidden="true" className="mt-2 text-muted">
          ~/laroca $ <span className="typed-caret text-terminal">▍</span>
        </p>
      </div>
    </figure>
  );
}
