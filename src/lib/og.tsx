import { ImageResponse } from "next/og";
import type { Accent } from "@/content/schema";

export const OG_SIZE = { width: 1200, height: 630 };

const ACCENT_HEX: Record<Accent | "brand", string> = {
  brand: "#2997ff",
  green: "#30d158",
  teal: "#40c8e0",
  blue: "#0a84ff",
  violet: "#bf5af2",
  red: "#ff453a",
  amber: "#ffb340",
};

/** Shared social card: black, gradient title, terminal subtitle, accent glow. */
export function renderOg({
  title,
  subtitle,
  accent = "brand",
}: {
  title: string;
  subtitle: string;
  accent?: Accent | "brand";
}) {
  const glow = ACCENT_HEX[accent];
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: `radial-gradient(ellipse 70% 60% at 50% 110%, ${glow}55, #000 70%)`,
        color: "#f5f5f7",
      }}
    >
      <div style={{ display: "flex", fontSize: 30, fontWeight: 600 }}>LaRoca</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 40 ? 64 : 84,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            backgroundImage: "linear-gradient(180deg, #ffffff 30%, #8e8e93 100%)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#7cff9b", fontFamily: "monospace" }}>
          ~/laroca $ {subtitle}
        </div>
      </div>
    </div>,
    OG_SIZE,
  );
}
