import type { CSSProperties } from "react";

type TypedLineProps = { text: string; prompt?: string; speedMs?: number; className?: string };

/**
 * A terminal line that types itself out. Pure CSS (steps() over `ch` widths in
 * a monospace face): the full text is in the server HTML, so it reads fine
 * without JS and stays fully shown under reduced motion.
 */
export function TypedLine({ text, prompt = "$", speedMs = 45, className = "" }: TypedLineProps) {
  const chars = Array.from(text).length;
  const style = {
    "--typed-chars": String(chars),
    "--typed-duration": `${chars * speedMs}ms`,
  } as CSSProperties;

  return (
    <p data-testid="typed-line" aria-label={`${prompt} ${text}`} className={`font-mono ${className}`}>
      <span aria-hidden="true" className="text-muted">
        {prompt}{" "}
      </span>
      <span aria-hidden="true" data-testid="typed-text" className="typed text-terminal" style={style}>
        {text}
      </span>
      <span aria-hidden="true" className="typed-caret text-terminal">
        ▍
      </span>
    </p>
  );
}
