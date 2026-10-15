import type { CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { ContributionCalendar, TerminalLine } from "@/lib/github";

const LEVEL_CLASS = ["bg-surface-2", "bg-terminal/30", "bg-terminal/55", "bg-terminal/80", "bg-terminal"];
/** On narrow screens only the latest half-year fits. */
const MOBILE_WEEKS = 26;

type TerminalCardProps = { lines: TerminalLine[]; calendar?: ContributionCalendar | null; className?: string };

export function TerminalCard({ lines, calendar = null, className = "" }: TerminalCardProps) {
  const t = useTranslations("Terminal");
  const locale = useLocale();
  const day = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  return (
    <figure
      className={`theme-night flex flex-col overflow-hidden rounded-2xl border-2 border-ink bg-grid font-mono text-[13px] leading-relaxed shadow-[6px_6px_0] shadow-ink ${className}`}
    >
      <figcaption className="flex items-center gap-2 border-b border-border bg-surface px-5 py-3 text-xs text-muted">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-tint-rose" />
          <span className="size-2.5 rounded-full bg-tint-sun" />
          <span className="size-2.5 rounded-full bg-tint-leaf" />
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
              <time dateTime={l.date} className="shrink-0 text-muted">
                {l.date}
              </time>
              <span className="min-w-0 break-words text-terminal">{l.message}</span>
            </li>
          ))}
        </ol>

        {calendar && (
          <div className="mt-5">
            <p className="text-muted">
              ~/laroca $ <span className="text-text">{t("calendarCommand")}</span>
            </p>
            <div role="img" aria-label={t("calendarTotal", { total: calendar.total })} className="mt-3 flex gap-[3px]">
              {calendar.weeks.map((week, w) => (
                <div
                  key={week[0]?.date ?? w}
                  className={`flex flex-1 flex-col gap-[3px] ${w === 0 ? "justify-end" : ""} ${w < calendar.weeks.length - MOBILE_WEEKS ? "max-sm:hidden" : ""}`}
                >
                  {week.map((d) => (
                    <span
                      key={d.date}
                      title={
                        d.count === null
                          ? day.format(new Date(d.date))
                          : t("calendarDay", { date: day.format(new Date(d.date)), count: d.count })
                      }
                      className={`contrib-cell aspect-square rounded-[2px] ${LEVEL_CLASS[d.level]}`}
                      style={{ "--week": w } as CSSProperties}
                    />
                  ))}
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">{t("calendarTotal", { total: calendar.total })}</p>
          </div>
        )}

        <p aria-hidden="true" className="mt-3 text-muted">
          ~/laroca $ <span className="typed-caret text-terminal">▍</span>
        </p>
      </div>
    </figure>
  );
}
