import { useLocale, useTranslations } from "next-intl";
import type { ExperienceItem } from "@/content/schema";
import { formatMonth } from "@/lib/format";

export function Timeline({ items }: { items: ExperienceItem[] }) {
  const t = useTranslations("About");
  const locale = useLocale();

  return (
    <ol aria-label={t("timeline")} className="relative ml-2 border-l border-border">
      {items.map((item) => (
        <li key={`${item.start}-${item.title}`} className="relative pb-12 pl-8 last:pb-0">
          <span
            aria-hidden="true"
            className={`absolute -left-[5px] top-2 size-[9px] rounded-full ${
              item.kind === "work" ? "bg-link" : "bg-accent-amber"
            }`}
          />
          <p className="text-sm text-muted">
            {formatMonth(item.start, locale)} – {item.end ? formatMonth(item.end, locale) : t("present")}
            <span className="ml-3 rounded-full border border-border px-2 py-0.5 text-xs">
              {item.kind === "work" ? t("work") : t("education")}
            </span>
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight">{item.title}</h3>
          <p className="text-muted">{item.org}</p>
          <p className="mt-3 max-w-[40rem]">{item.description}</p>
        </li>
      ))}
    </ol>
  );
}
