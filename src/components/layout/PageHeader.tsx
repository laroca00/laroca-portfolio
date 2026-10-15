import type { ReactNode } from "react";
import { Doodle, type DoodleName } from "../Doodle";
import { Container } from "./Container";

type PageHeaderProps = { title: string; intro?: string; doodle?: DoodleName; children?: ReactNode };

export function PageHeader({ title, intro, doodle, children }: PageHeaderProps) {
  return (
    <header className="pt-32 pb-12 md:pt-40 md:pb-16">
      <Container>
        {doodle && <Doodle name={doodle} draw className="doodle-wiggle mb-6 size-14 md:size-16" />}
        <h1 className="max-w-[20ch] text-display font-extrabold">{title}</h1>
        {intro && <p className="mt-6 max-w-[40rem] text-lg text-muted md:text-xl">{intro}</p>}
        {children}
      </Container>
    </header>
  );
}
