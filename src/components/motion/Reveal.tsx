import type { ElementType, ReactNode } from "react";

type RevealProps = {
  as?: ElementType;
  variant?: "fade" | "scale";
  className?: string;
  children: ReactNode;
};

/** Scroll-linked entrance driven by CSS view timelines (see globals.css). */
export function Reveal({ as: Tag = "div", variant = "fade", className = "", children }: RevealProps) {
  return <Tag className={`${variant === "scale" ? "reveal-scale" : "reveal"} ${className}`}>{children}</Tag>;
}
