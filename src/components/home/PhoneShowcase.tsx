"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type Screen = { src: string; caption: string };

/** Edge buttons as a share of body height: Action + volume on the left, side button + Camera Control on the right. */
const SIDE_BUTTONS: { side: "left" | "right"; top: number; height: number; className?: string }[] = [
  { side: "left", top: 20, height: 4.7 },
  { side: "left", top: 30, height: 8 },
  { side: "left", top: 40.7, height: 8 },
  { side: "right", top: 32.7, height: 12.6 },
  { side: "right", top: 61.3, height: 8, className: "bg-[linear-gradient(180deg,#2a2b2f,#55575c_50%,#2a2b2f)]" },
];

/**
 * A hand-drawn phone that flips through app screens as it scrolls past the
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
        {/* iPhone 18 Pro, front view, to scale: 71.9 × 150 mm body; all lengths in cqw of the body width. */}
        <div className="relative w-[15rem] [container-type:inline-size] md:w-[17.5rem]">
          {SIDE_BUTTONS.map((b) => (
            <span
              key={`${b.side}-${b.top}`}
              aria-hidden="true"
              className={`absolute w-[1.4cqw] ${b.side === "left" ? "-left-[0.9cqw] rounded-l-[1cqw]" : "-right-[0.9cqw] rounded-r-[1cqw]"} ${b.className ?? "bg-[linear-gradient(180deg,#5b5d63,#a3a5ab_50%,#5b5d63)]"}`}
              style={{ top: `${b.top}%`, height: `${b.height}%` }}
            />
          ))}
          <div className="relative aspect-[71.9/150] rounded-[15cqw] bg-[linear-gradient(135deg,#9a9ca2,#4b4d52_18%,#2e2f33_50%,#4b4d52_82%,#9a9ca2)] p-[0.9cqw] shadow-[0_40px_80px_-24px_rgb(0_0_0/0.85),inset_0_0_0_0.3cqw_rgb(255_255_255/0.18)]">
            <div className="h-full rounded-[14.1cqw] bg-black p-[1.7cqw]">
              <div className="relative h-full overflow-hidden rounded-[12.4cqw] bg-black">
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
                <span
                  aria-hidden="true"
                  className="absolute top-[2.65cqw] left-1/2 z-10 h-[7.6cqw] w-[19cqw] -translate-x-1/2 rounded-full bg-black"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.08),transparent_35%)]"
                />
              </div>
            </div>
          </div>
        </div>
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
