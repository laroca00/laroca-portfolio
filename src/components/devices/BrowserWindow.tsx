import type { ComponentPropsWithoutRef } from "react";

type BrowserWindowProps = ComponentPropsWithoutRef<"div"> & { path: string };

/** Terminal-ish browser window: traffic lights, a path bar, and the content below. */
export function BrowserWindow({ path, className = "", children, ...props }: BrowserWindowProps) {
  return (
    <div
      className={`overflow-hidden rounded-[14px] border border-border bg-surface shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] ${className}`}
      {...props}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 font-mono text-xs text-muted">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-tint-rose" />
          <span className="size-2.5 rounded-full bg-tint-sun" />
          <span className="size-2.5 rounded-full bg-tint-leaf" />
        </span>
        <span className="ml-2 truncate">{path}</span>
      </div>
      {children}
    </div>
  );
}
