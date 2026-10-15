"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";

type CompareProps = { before: string; after: string; beforeLabel: string; afterLabel: string; alt: string };

/**
 * Before/after slider for MDX. A full-size, invisible range input does the
 * dragging, so it works with mouse, touch and arrow keys alike.
 */
export function Compare({ before, after, beforeLabel, afterLabel, alt }: CompareProps) {
  const t = useTranslations("Case");
  const [pos, setPos] = useState(50);

  return (
    <figure className="my-10">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[14px] border border-border bg-surface select-none">
        <Image
          src={after}
          alt={`${alt} — ${afterLabel}`}
          fill
          sizes="(min-width: 768px) 736px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image
            src={before}
            alt={`${alt} — ${beforeLabel}`}
            fill
            sizes="(min-width: 768px) 736px, 100vw"
            className="object-cover"
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-paper"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute top-1/2 left-1/2 grid size-10 -translate-1/2 place-items-center rounded-full border-2 border-ink bg-paper font-mono text-sm font-semibold text-ink shadow-[3px_3px_0] shadow-ink">
            ↔
          </span>
        </div>
        <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-ink/85 px-2.5 py-1 font-mono text-[11px] text-paper">
          {beforeLabel}
        </span>
        <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-ink/85 px-2.5 py-1 font-mono text-[11px] text-paper">
          {afterLabel}
        </span>

        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={t("compare", { before: beforeLabel, after: afterLabel })}
          className="absolute inset-0 size-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-3 font-mono text-xs text-muted">{t("compareHint")}</figcaption>
    </figure>
  );
}
