/**
 * Hand-drawn icon set. Each doodle is a wobbly ink outline over a flat colour
 * blob printed slightly off-register, so no two shapes look machine-perfect.
 * Outlines use `currentColor` and can draw themselves in (see globals.css).
 */

type Tint = "sun" | "sky" | "rose" | "leaf" | "lilac" | "none";

type Shape = { tint: Tint; fill: string[]; lines: string[] };

const TINTS: Record<Tint, string> = {
  sun: "var(--color-tint-sun)",
  sky: "var(--color-tint-sky)",
  rose: "var(--color-tint-rose)",
  leaf: "var(--color-tint-leaf)",
  lilac: "var(--color-tint-lilac)",
  none: "none",
};

const GLOBE = "M16 4.6c6.4-.2 11.4 5 11.3 11.5-.1 6.3-5.2 11.2-11.4 11.2C9.6 27.2 4.6 22 4.8 15.8 5 9.6 9.8 4.8 16 4.6z";
const PHONE = "M9.6 3.8c4.4-.4 8.6-.3 12.8.1.6 8 .5 16.2 0 24.2-4.3.4-8.6.4-12.8 0-.5-8.1-.5-16.2 0-24.3z";
const ROOF = "M4.6 12.4C8.4 9.8 12.2 7.4 16 5c3.9 2.4 7.8 4.8 11.6 7.3-7.7.2-15.3.2-23 .1z";
const RACK_TOP = "M5.6 6c7-.4 14-.4 20.9 0 .3 2.6.3 5.1 0 7.6-7 .4-13.9.4-20.9 0-.3-2.5-.3-5 0-7.6z";
const RACK_BOTTOM = "M5.6 18.4c7-.4 14-.4 20.9 0 .3 2.6.3 5.1 0 7.6-7 .4-13.9.4-20.9 0-.3-2.5-.3-5 0-7.6z";
const WINDOW = "M5 6.2c7.4-.6 14.8-.5 22.1 0 .5 6.6.5 13.1 0 19.6-7.3.6-14.7.6-22.1 0-.5-6.5-.5-13 0-19.6z";
const CARD = "M7.2 9.6l9.6-3.2 5.4 16.8-9.7 3.1z";
const LEAF_L = "M15.6 16.2C10 16.8 6.4 13.4 6 8c5.4-.4 9.2 2.8 9.6 8.2z";
const LEAF_R = "M16.2 13.4c.8-5 4.4-7.6 9.6-7.2-.2 5.2-3.8 8-9.6 7.2z";
const BOOK =
  "M4.4 7.6c4.2-1.6 8.6-1.2 11.6 1.2 3-2.4 7.4-2.8 11.6-1.3l-.2 16.6c-4.2-1.4-8.4-1-11.4 1.4-3-2.3-7.2-2.7-11.4-1.3z";
const HEAD = "M16.2 5.2c2.8 0 4.8 2.2 4.7 5-.1 2.6-2.2 4.6-4.8 4.6-2.7 0-4.7-2.2-4.6-4.9.1-2.6 2.1-4.7 4.7-4.7z";
const ENVELOPE = "M4.6 8.4c7.6-.6 15.2-.6 22.8 0 .4 5.2.4 10.4 0 15.6-7.6.6-15.2.6-22.8 0-.4-5.2-.4-10.4 0-15.6z";
const FOLDER = "M4.4 9c0-1.2.6-1.8 1.8-1.8h6.6l2.4 2.6h10.6c1.2 0 1.8.6 1.8 1.8l-.3 13c-7.4.5-14.9.5-22.4 0z";
const SPARK = "M16 4.5c.6 4.6 2.6 7.1 7.4 7.8-4.6.9-6.8 3.2-7.4 8-.8-4.8-3-7.2-7.6-8 4.8-.7 7-3.2 7.6-7.8z";
const BRIEFCASE = "M4.8 11c7.4-.5 14.9-.5 22.4 0 .4 4.6.4 9.2 0 13.8-7.5.5-14.9.5-22.4 0-.4-4.6-.4-9.2 0-13.8z";

const SHAPES = {
  globe: {
    tint: "sky",
    fill: [GLOBE],
    lines: [
      GLOBE,
      "M5.2 13.2c7.2 1.3 14.4 1.2 21.6-.2",
      "M5.6 19.6c7 1 13.9 1 20.8-.3",
      "M15.6 4.8c-4.4 6.6-4.6 15.6-.2 22.3",
      "M16.4 4.7c4 6.8 4.1 15.4.3 22.5",
    ],
  },
  smartphone: {
    tint: "sun",
    fill: [PHONE],
    lines: [PHONE, "M14 7.1h4.2", "M14.6 24.4c1-.1 2-.1 3 0"],
  },
  landmark: {
    tint: "rose",
    fill: [ROOF],
    lines: [ROOF, "M8 15.2v9.4", "M13.2 15.4v9.2", "M18.6 15.2v9.4", "M24 15.4v9.2", "M4 27.6c8-.5 16-.5 24 .1"],
  },
  server: {
    tint: "lilac",
    fill: [RACK_TOP, RACK_BOTTOM],
    lines: [
      RACK_TOP,
      RACK_BOTTOM,
      "M10 9.8h.1",
      "M10 22.2h.1",
      "M16 9.8c2.4-.1 4.8 0 7 .1",
      "M16 22.2c2.4-.1 4.8 0 7 .1",
    ],
  },
  code: {
    tint: "leaf",
    fill: [WINDOW],
    lines: [WINDOW, "M11.6 12.2l-3.4 3.9 3.5 3.8", "M20.4 12.2l3.4 3.9-3.5 3.8", "M17.4 10.6l-2.8 11"],
  },
  terminal: {
    tint: "leaf",
    fill: [WINDOW],
    lines: [WINDOW, "M9.6 12.6l4 3.4-4 3.2", "M16.6 20.2c2-.1 4-.1 6 .1"],
  },
  cards: {
    tint: "rose",
    fill: [CARD],
    lines: [
      CARD,
      "M12.6 7.4l9.3-1 2.2 17.4",
      "M13 14.4c.8-1.4 2.4-1.2 2.6.2.3 1.3-1.2 2.6-2.2 3.8-1.4-.8-3.2-1.6-3-3.1.2-1.4 1.8-1.7 2.6-.9z",
    ],
  },
  sprout: {
    tint: "leaf",
    fill: [LEAF_L, LEAF_R],
    lines: [LEAF_L, LEAF_R, "M16 27.4c.3-6 0-11.3-.5-15.8", "M10.6 27.6c3.6-.4 7.3-.4 11 .1"],
  },
  book: { tint: "sky", fill: [BOOK], lines: [BOOK, "M16 8.8v16.6"] },
  person: {
    tint: "rose",
    fill: [HEAD],
    lines: [HEAD, "M6.6 27c1.2-5.4 5.2-8.2 9.6-8.1 4.4.1 8.2 3 9.2 8.2"],
  },
  mail: {
    tint: "sun",
    fill: [ENVELOPE],
    lines: [ENVELOPE, "M5 9c3.6 3 7.2 5.6 11 7.8 3.8-2.2 7.4-4.8 11-7.8"],
  },
  folder: { tint: "sun", fill: [FOLDER], lines: [FOLDER] },
  briefcase: {
    tint: "lilac",
    fill: [BRIEFCASE],
    lines: [BRIEFCASE, "M12 10.8c-.1-1.6 0-3.2.4-4.6 2.4-.3 4.8-.3 7.2 0 .4 1.4.5 3 .4 4.6", "M5 16.6c7.2 1.4 14.6 1.4 22 0"],
  },
  spark: { tint: "sun", fill: [SPARK], lines: [SPARK] },
  arrow: {
    tint: "none",
    fill: [],
    lines: ["M5 16.4c6.8-.6 13.8-.6 21 .2", "M19.6 9.6c2.6 2.4 4.6 4.6 6.6 7-2.2 2.2-4.4 4.4-6.8 6.6"],
  },
  squiggle: {
    tint: "none",
    fill: [],
    lines: ["M2 18c3-6 5-6 7 0s4 6 7 0 5-6 7 0 4 6 7 0"],
  },
} satisfies Record<string, Shape>;

export type DoodleName = keyof typeof SHAPES;

export function isDoodleName(name: string): name is DoodleName {
  return name in SHAPES;
}

type DoodleProps = {
  name: DoodleName;
  className?: string;
  tint?: Tint;
  /** Outline draws itself as it scrolls into view. */
  draw?: boolean;
  strokeWidth?: number;
};

export function Doodle({ name, className = "size-8", tint, draw = false, strokeWidth = 1.8 }: DoodleProps) {
  const shape: Shape = SHAPES[name];
  const fill = TINTS[tint ?? shape.tint];
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={`doodle overflow-visible ${draw ? "doodle-draw" : ""} ${className}`}
    >
      {fill !== "none" && (
        <g transform="translate(1.6 1.4)" fill={fill}>
          {shape.fill.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      )}
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {shape.lines.map((d) => (
          <path key={d} d={d} pathLength={1} className="doodle-line" />
        ))}
      </g>
    </svg>
  );
}
