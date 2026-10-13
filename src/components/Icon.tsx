const PATHS: Record<string, string> = {
  globe:
    "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0c2.5 2.4 3.8 5.4 3.8 9s-1.3 6.6-3.8 9m0-18C9.5 5.4 8.2 8.4 8.2 12s1.3 6.6 3.8 9M3.5 9h17M3.5 15h17",
  smartphone:
    "M8 2.5h8a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 20V4A1.5 1.5 0 0 1 8 2.5ZM11 18.5h2",
  landmark: "M3 21h18M5 21V10m4 11V10m6 11V10m4 11V10M2.5 10 12 3.5l9.5 6.5",
  server: "M4 4h16v6H4zM4 14h16v6H4zM7.5 7h.01M7.5 17h.01",
  code: "m8 7-5 5 5 5m8-10 5 5-5 5M13.5 4l-3 16",
};

export function Icon({ name, className = "size-6" }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={PATHS[name] ?? PATHS.code} />
    </svg>
  );
}
