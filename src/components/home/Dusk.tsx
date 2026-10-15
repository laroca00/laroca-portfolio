import { useTranslations } from "next-intl";
import { Doodle } from "../Doodle";

const STARS = [
  { left: "8%", top: "42%", size: "size-4" },
  { left: "36%", top: "30%", size: "size-3" },
  { left: "56%", top: "48%", size: "size-5" },
  { left: "90%", top: "18%", size: "size-3" },
  { left: "70%", top: "8%", size: "size-3" },
];

/**
 * Decorative divider between the day half and the night half of the home
 * page: as it scrolls past, the sun sinks behind the hills and the moon rises.
 */
export function Dusk() {
  const t = useTranslations("Dusk");
  return (
    <div
      aria-hidden="true"
      className="relative h-[70vh] min-h-[26rem] overflow-hidden bg-[linear-gradient(180deg,#f6f1e4_0%,#f7c59f_28%,#d7748b_50%,#4b3a6b_72%,#0d1117_100%)]"
    >
      <div className="dusk-sun absolute top-[18%] left-[18%] size-28 rounded-full border-[3px] border-ink bg-tint-sun md:size-36" />
      <div className="dusk-moon absolute top-[30%] right-[16%] size-20 md:size-24">
        <svg viewBox="0 0 64 64" className="size-full overflow-visible">
          <path
            d="M40 6C26 8 16 20 17 34s13 25 27 24c5 0 9-2 13-4-15 1-27-10-28-25-1-10 4-19 11-23z"
            fill="#f6f1e4"
            stroke="#1d1b16"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="dusk-stars absolute inset-0">
        {STARS.map((s, i) => (
          <span key={s.left} className="absolute" style={{ left: s.left, top: s.top }}>
            <Doodle
              name="spark"
              className={`float block text-paper ${s.size}`}
              strokeWidth={2}
              tint={i % 2 ? "sun" : "none"}
            />
          </span>
        ))}
      </div>
      <svg
        viewBox="0 0 1200 160"
        preserveAspectRatio="none"
        className="doodle-draw absolute inset-x-0 bottom-0 h-[38%] w-full"
      >
        <path
          d="M0 120c80-40 160-70 260-50s150 60 250 40 160-90 280-80 180 70 260 60 150-30 150-30V160H0z"
          fill="#0d1117"
        />
        <path
          d="M0 120c80-40 160-70 260-50s150 60 250 40 160-90 280-80 180 70 260 60 150-30 150-30"
          pathLength={1}
          className="doodle-line"
          fill="none"
          stroke="#f6f1e4"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <p className="absolute inset-x-0 bottom-6 text-center font-mono text-sm text-[#e6edf3]">
        <span className="text-[#7ee787]">~/laroca $</span> {t("line")}
        <span className="blink text-[#7ee787]">▍</span>
      </p>
    </div>
  );
}
