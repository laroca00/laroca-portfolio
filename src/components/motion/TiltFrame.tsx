"use client";

import type { PointerEvent, ReactNode } from "react";

const MAX_DEG = 5;

/** Tilts its child towards the pointer (CSS `.tilt`, off under reduced motion). */
export function TiltFrame({ className = "", children }: { className?: string; children: ReactNode }) {
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const box = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width - 0.5;
    const y = (e.clientY - box.top) / box.height - 0.5;
    e.currentTarget.style.setProperty("--ry", `${(x * MAX_DEG * 2).toFixed(2)}deg`);
    e.currentTarget.style.setProperty("--rx", `${(-y * MAX_DEG * 2).toFixed(2)}deg`);
  };
  const onLeave = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.removeProperty("--rx");
    e.currentTarget.style.removeProperty("--ry");
  };

  return (
    <div onPointerMove={onMove} onPointerLeave={onLeave} className={`tilt ${className}`}>
      {children}
    </div>
  );
}
