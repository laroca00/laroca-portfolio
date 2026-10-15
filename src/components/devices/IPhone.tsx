import type { ReactNode } from "react";

/** Edge buttons as a share of body height: Action + volume on the left, side button + Camera Control on the right. */
const SIDE_BUTTONS: { side: "left" | "right"; top: number; height: number; className?: string }[] = [
  { side: "left", top: 20, height: 4.7 },
  { side: "left", top: 30, height: 8 },
  { side: "left", top: 40.7, height: 8 },
  { side: "right", top: 32.7, height: 12.6 },
  { side: "right", top: 61.3, height: 8, className: "bg-[linear-gradient(180deg,#2a2b2f,#55575c_50%,#2a2b2f)]" },
];

/**
 * iPhone 18 Pro, front view, to scale: 71.9 × 150 mm body. Every length is in
 * cqw of the body width, so the frame keeps its proportions at any size; set
 * the width with `className`. Children fill the screen (1206 × 2622 content).
 */
export function IPhone({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`relative [container-type:inline-size] ${className}`}>
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
            {children}
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
  );
}
