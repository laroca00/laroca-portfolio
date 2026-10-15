import Image from "next/image";
import { IPhone } from "../devices/IPhone";

/**
 * Every app screen side by side in iPhone frames, staggered like a store
 * listing. On phones it becomes a horizontal snap scroller.
 */
export function PhoneGallery({ screens, title }: { screens: { src: string; caption: string }[]; title: string }) {
  return (
    <ul className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pt-4 pb-10 md:mx-0 md:grid md:grid-cols-4 md:gap-8 md:overflow-visible md:px-0">
      {screens.map((s, i) => (
        <li
          key={s.src}
          className={`reveal flex w-[58%] shrink-0 snap-center flex-col items-center sm:w-[40%] md:w-auto ${i % 2 ? "md:translate-y-12" : ""}`}
        >
          <IPhone className="w-full">
            <Image
              src={s.src}
              alt={`${title} — ${s.caption}`}
              fill
              sizes="(min-width: 768px) 260px, 58vw"
              className="object-cover"
            />
          </IPhone>
          <p className="mt-5 font-mono text-sm text-muted">
            <span className="text-link">{String(i + 1).padStart(2, "0")}</span> {s.caption}
          </p>
        </li>
      ))}
    </ul>
  );
}
