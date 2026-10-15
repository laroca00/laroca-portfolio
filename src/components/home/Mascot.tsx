"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const EYES = [
  { cx: 108, cy: 104 },
  { cx: 152, cy: 104 },
];
const PUPIL_TRAVEL = 4.5;

/**
 * "Bit", a little hand-drawn terminal. Its eyes follow the pointer and a tap
 * makes it say the next line. Purely decorative for screen readers except for
 * the button and its polite live region.
 */
export function Mascot({ className = "" }: { className?: string }) {
  const t = useTranslations("Mascot");
  const lines = t.raw("lines") as string[];
  const [line, setLine] = useState(-1);
  const svgRef = useRef<SVGSVGElement>(null);
  const pupils = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const box = svg.getBoundingClientRect();
      const scale = box.width / 260;
      EYES.forEach((eye, i) => {
        const dx = e.clientX - (box.left + eye.cx * scale);
        const dy = e.clientY - (box.top + eye.cy * scale);
        const angle = Math.atan2(dy, dx);
        const reach = Math.min(1, Math.hypot(dx, dy) / 200) * PUPIL_TRAVEL;
        pupils.current[i]?.setAttribute(
          "transform",
          `translate(${(Math.cos(angle) * reach).toFixed(2)} ${(Math.sin(angle) * reach).toFixed(2)})`,
        );
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <p
        aria-live="polite"
        className={`absolute -top-2 left-0 z-10 max-w-[15rem] rounded-2xl rounded-bl-none border-2 border-ink bg-paper px-4 py-2.5 font-mono text-[13px] leading-snug text-ink shadow-[4px_4px_0] shadow-ink transition-all duration-300 md:-left-6 ${
          line < 0 ? "pointer-events-none scale-90 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {line >= 0 ? lines[line] : ""}
      </p>
      <button
        type="button"
        onClick={() => setLine((l) => (l + 1) % lines.length)}
        aria-label={t("label")}
        className="group block w-full cursor-pointer rounded-3xl"
      >
        <svg ref={svgRef} viewBox="0 0 260 240" aria-hidden="true" className="w-full overflow-visible">
          <ellipse cx="132" cy="132" rx="108" ry="94" fill="var(--color-tint-sun)" opacity="0.6" />
          <g className="float" style={{ "--float-delay": "-2s" } as CSSProperties}>
            <path d="M221 52c3 6 3 12 0 18M232 44c6 10 7 22 1 33" stroke="var(--link)" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
          <g
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="origin-[130px_220px] transition-transform duration-300 group-hover:-rotate-2 group-active:scale-95"
          >
            <path d="M128 60c-2-11 0-20 5-27" />
            <circle cx="135" cy="28" r="6" fill="var(--color-tint-rose)" />
            <path
              d="M52 60c52-5 106-5 156 1 5 32 5 66 1 98-52 5-104 5-156 0-5-33-5-66-1-99z"
              fill="var(--color-paper)"
            />
            <path
              d="M68 76c41-3 83-3 124 0 3 22 3 45 0 67-41 3-83 3-124 0-3-22-3-45 0-67z"
              fill="var(--color-ink)"
            />
            <g className="mascot-eyes">
              {EYES.map((eye, i) => (
                <g key={eye.cx}>
                  <ellipse cx={eye.cx} cy={eye.cy} rx="10" ry="12" fill="var(--color-paper)" stroke="none" />
                  <circle
                    ref={(el) => {
                      pupils.current[i] = el;
                    }}
                    cx={eye.cx}
                    cy={eye.cy + 1}
                    r="5"
                    fill="var(--color-ink)"
                    stroke="none"
                  />
                </g>
              ))}
            </g>
            <ellipse cx="92" cy="124" rx="7" ry="4" fill="var(--color-tint-rose)" stroke="none" opacity="0.7" />
            <ellipse cx="168" cy="124" rx="7" ry="4" fill="var(--color-tint-rose)" stroke="none" opacity="0.7" />
            <path d="M118 124l8 5-8 5" stroke="#7ee787" strokeWidth="2.5" />
            <rect x="130" y="131" width="11" height="3" fill="#7ee787" stroke="none" className="blink" />
            <path d="M116 162c-1 7-1 13 0 19M144 162c1 7 1 13 0 19" />
            <path
              d="M58 190c48-4 98-4 146 0 3 8 3 15 0 22-48 4-98 4-146 0-3-7-3-14 0-22z"
              fill="var(--color-tint-sky)"
            />
            <path d="M74 201h8M92 201h8M110 201h8M128 201h8M146 201h8M164 201h8M182 201h4" strokeWidth="2.5" />
            <path
              d="M208 116c12-3 20-11 24-24"
              className="origin-[208px_116px] transition-transform duration-300 group-hover:rotate-[-18deg]"
            />
          </g>
        </svg>
      </button>
    </div>
  );
}
