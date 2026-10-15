"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/** Sticky "## section" list for a case study; highlights the section being read. */
export function CaseToc({ items }: { items: { id: string; title: string }[] }) {
  const t = useTranslations("Case");
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    // The section being read is the last one whose heading has passed the upper third of the screen.
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight / 3;
      let current = items[0]?.id;
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav aria-label={t("toc")} className="font-mono text-sm">
      <p className="text-muted">{`// ${t("toc")}`}</p>
      <ol className="mt-4 space-y-1 border-l border-border">
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={item.id === active ? "location" : undefined}
              className={`-ml-px block border-l-2 py-1 pl-4 transition-colors ${
                item.id === active ? "border-link text-text" : "border-transparent text-muted hover:text-text"
              }`}
            >
              <span className="text-link">{String(i + 1).padStart(2, "0")}</span> {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
