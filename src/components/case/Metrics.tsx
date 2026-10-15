import { CountUp } from "./CountUp";

/** Big counted-up numbers with hand-drawn underlines. */
export function Metrics({ items, label }: { items: { value: string; label: string }[]; label: string }) {
  return (
    <section aria-label={label}>
      <dl className="grid grid-cols-2 gap-x-8 gap-y-10 border-y border-dashed border-border py-10 md:grid-cols-4">
        {items.map((m) => (
          <div key={m.label} className="flex flex-col-reverse">
            <dt className="mt-3 font-mono text-sm text-muted">{m.label}</dt>
            <dd className="relative w-fit text-5xl font-extrabold tracking-tight md:text-6xl">
              <CountUp value={m.value} />
              <svg
                viewBox="0 0 120 12"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="doodle-draw absolute -bottom-2 left-0 h-2.5 w-full overflow-visible text-link"
              >
                <path
                  d="M2 8c20-5 45-6 70-4s32 4 46 1"
                  pathLength={1}
                  className="doodle-line"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
