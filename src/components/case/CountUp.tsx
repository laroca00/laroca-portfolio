"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 1400;

/**
 * Counts the number inside a value like "120+" or "%36" up from zero once it
 * scrolls into view. The server renders the final value, so it reads
 * correctly without JS and under reduced motion.
 */
export function CountUp({ value }: { value: string }) {
  const match = /^(\D*)([\d.,]+)(.*)$/.exec(value);
  const target = match ? Number(match[2].replace(/[.,]/g, "")) : NaN;
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !Number.isFinite(target) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / DURATION);
          setShown(Math.round(target * (1 - (1 - p) ** 3)));
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target]);

  if (!match || shown === null) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {match[1]}
      {shown}
      {match[3]}
    </span>
  );
}
