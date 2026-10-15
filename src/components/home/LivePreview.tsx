"use client";

import Image from "next/image";
import { type PointerEvent, useState } from "react";
import { useTranslations } from "next-intl";

/** Width the live site is rendered at before being scaled down into the card. */
const SITE_WIDTH = 1440;

type LivePreviewProps = { src: string; url: string; title: string };

/**
 * A tall screenshot of the live site that scrolls inside the card as the page
 * scrolls (CSS, see `.live-scroll`). Hovering with a mouse swaps in the real
 * site in a scaled-down iframe; touch devices only ever load the screenshot.
 */
export function LivePreview({ src, url, title }: LivePreviewProps) {
  const t = useTranslations("Showcase");
  const [frame, setFrame] = useState<{ scale: number; height: number } | null>(null);
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const onEnter = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const { clientWidth, clientHeight } = e.currentTarget;
    const scale = clientWidth / SITE_WIDTH;
    setFrame({ scale, height: clientHeight / scale });
    setHovered(true);
  };

  const live = hovered && loaded;

  return (
    <div
      onPointerEnter={onEnter}
      onPointerLeave={() => setHovered(false)}
      className="live-frame relative aspect-[16/10] overflow-hidden bg-surface-2 [container-type:size]"
    >
      <Image
        src={src}
        alt={t("coverAlt", { title })}
        width={SITE_WIDTH}
        height={3600}
        sizes="(min-width: 1024px) 680px, 100vw"
        className="live-scroll absolute inset-x-0 top-0 h-auto w-full"
      />
      {frame && (
        <iframe
          src={url}
          title={t("liveTitle", { title })}
          tabIndex={-1}
          sandbox="allow-scripts allow-same-origin"
          onLoad={() => setLoaded(true)}
          className={`pointer-events-none absolute top-0 left-0 origin-top-left border-0 bg-white transition-opacity duration-500 ${
            live ? "opacity-100" : "opacity-0"
          }`}
          style={{ width: SITE_WIDTH, height: frame.height, transform: `scale(${frame.scale})` }}
        />
      )}
      <span
        aria-hidden="true"
        className="absolute top-3 right-3 hidden items-center gap-1.5 rounded-full bg-ink/85 px-2.5 py-1 font-mono text-[11px] text-paper backdrop-blur-sm [@media(hover:hover)]:inline-flex"
      >
        <span className={`size-1.5 rounded-full ${live ? "blink bg-[#7ee787]" : "bg-paper/50"}`} />
        {live ? t("live") : hovered ? t("liveLoading") : t("liveHint")}
      </span>
    </div>
  );
}
