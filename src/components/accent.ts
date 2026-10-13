import type { Accent } from "@/content/schema";

/** Literal class names per accent so Tailwind can see them. */
export const ACCENT_CLASSES: Record<Accent, { text: string; glow: string; bg: string }> = {
  green: { text: "text-accent-green", glow: "shadow-accent-green/30", bg: "bg-accent-green" },
  teal: { text: "text-accent-teal", glow: "shadow-accent-teal/30", bg: "bg-accent-teal" },
  blue: { text: "text-accent-blue", glow: "shadow-accent-blue/30", bg: "bg-accent-blue" },
  violet: { text: "text-accent-violet", glow: "shadow-accent-violet/30", bg: "bg-accent-violet" },
  red: { text: "text-accent-red", glow: "shadow-accent-red/30", bg: "bg-accent-red" },
  amber: { text: "text-accent-amber", glow: "shadow-accent-amber/30", bg: "bg-accent-amber" },
};
