import type { ReactNode } from "react";
import { Container } from "./Container";

export function PageHeader({ title, intro, children }: { title: string; intro?: string; children?: ReactNode }) {
  return (
    <header className="pt-20 pb-12 md:pt-28 md:pb-16">
      <Container>
        <h1 className="max-w-[20ch] text-display font-semibold text-gradient">{title}</h1>
        {intro && <p className="mt-6 max-w-[40rem] text-lg text-muted md:text-xl">{intro}</p>}
        {children}
      </Container>
    </header>
  );
}
