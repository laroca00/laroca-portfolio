"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type ComponentProps } from "react";
import { OPEN_COMMAND_PALETTE } from "@/lib/site";
import type { CommandPalette as Palette } from "./CommandPalette";

const CommandPalette = dynamic(() => import("./CommandPalette").then((m) => m.CommandPalette), { ssr: false });

/**
 * Keeps cmdk/Radix out of the initial bundle: the palette chunk loads on the
 * first ⌘K / Ctrl+K or "Menü" press, then opens itself.
 */
export function CommandPaletteLauncher(props: ComponentProps<typeof Palette>) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setLoaded(true);
      }
    };
    const onOpen = () => setLoaded(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_COMMAND_PALETTE, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_COMMAND_PALETTE, onOpen);
    };
  }, [loaded]);

  return loaded ? <CommandPalette {...props} defaultOpen /> : null;
}
