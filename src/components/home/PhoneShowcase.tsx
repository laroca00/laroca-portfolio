"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { IPhone } from "../devices/IPhone";

type Screen = { src: string; caption: string };

/**
 * An iPhone that flips through app screens as it scrolls past the
 * viewport. The dots below also pick a screen directly. Without JS the first
 * screen simply stays put.
 */
export function PhoneShowcase({ screens, title }: { screens: Screen[]; title: string }) {
  const t = useTranslations("Showcase");
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const box = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the phone's top enters the bottom edge, 1 when its bottom leaves the top edge.
      const progress = (vh - box.top) / (vh + box.height);
      const inner = Math.min(0.999, Math.max(0, (progress - 0.2) / 0.6));
      setActive(Math.floor(inner * screens.length));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [screens.length]);

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute top-[12%] -left-[18%] size-[120%] rounded-full bg-tint-sun/15 blur-2xl"
        />
        <IPhone className="w-[15rem] md:w-[17.5rem]">
          {screens.map((s, i) => (
            <Image
              key={s.src}
              src={s.src}
              alt={`${title} — ${s.caption}`}
              fill
              sizes="(min-width: 768px) 280px, 240px"
              className={`object-cover transition-[opacity,scale] duration-500 motion-reduce:transition-none ${
                i === active ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"
              }`}
            />
          ))}
        </IPhone>
      </div>

      <p className="mt-8 font-mono text-sm text-muted">
        <span className="text-text">{String(active + 1).padStart(2, "0")}</span>
        {` / ${String(screens.length).padStart(2, "0")} · ${screens[active].caption}`}
      </p>
      <div className="mt-1 flex">
        {screens.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={t("screen", { n: i + 1, caption: s.caption })}
            aria-pressed={i === active}
            className="group/dot grid h-8 min-w-6 place-items-center px-1"
          >
            <span
              className={`h-2 rounded-full transition-all ${
                i === active ? "w-6 bg-link" : "w-2 bg-border group-hover/dot:bg-muted"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
