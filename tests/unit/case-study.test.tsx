import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { expect, test } from "vitest";
import messages from "../../messages/tr.json";
import { CaseToc } from "@/components/case/CaseToc";
import { Compare } from "@/components/case/Compare";
import { Metrics } from "@/components/case/Metrics";
import { mdxSections } from "@/content/mdx";
import { slugify } from "@/lib/slug";

const wrap = (ui: React.ReactNode) =>
  render(
    <NextIntlClientProvider locale="tr" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );

test("slugify folds Turkish letters into URL-safe ids", () => {
  expect(slugify("Çözüm")).toBe("cozum");
  expect(slugify("Teknik detaylar")).toBe("teknik-detaylar");
  expect(slugify("Işık, Gölge & Şehir")).toBe("isik-golge-sehir");
});

test("mdxSections lists ## headings in order and ignores deeper ones", () => {
  expect(mdxSections("intro\n\n## Problem\ntext\n### Alt\n## Çözüm\n")).toEqual([
    { id: "problem", title: "Problem" },
    { id: "cozum", title: "Çözüm" },
  ]);
});

test("table of contents links every section", () => {
  wrap(
    <CaseToc
      items={[
        { id: "problem", title: "Problem" },
        { id: "cozum", title: "Çözüm" },
      ]}
    />,
  );
  expect(screen.getByRole("link", { name: /Problem/ })).toHaveAttribute("href", "#problem");
  expect(screen.getByRole("link", { name: /Çözüm/ })).toHaveAttribute("href", "#cozum");
});

test("metrics render their final values (counted up only in the browser)", () => {
  wrap(<Metrics label="Rakamlarla" items={[{ value: "120+", label: "katılımcı" }]} />);
  expect(screen.getByRole("region", { name: "Rakamlarla" })).toHaveTextContent("katılımcı120+");
});

test("compare slider reveals more or less of the before image", () => {
  const { container } = wrap(
    <Compare before="/a.webp" after="/b.webp" beforeLabel="Aydınlık" afterLabel="Karanlık" alt="Site" />,
  );
  const slider = screen.getByRole("slider", { name: "Aydınlık ile Karanlık karşılaştırması" });
  const clip = () => (container.querySelector("[style*='clip-path']") as HTMLElement).style.clipPath;
  expect(clip()).toBe("inset(0 50% 0 0)");
  fireEvent.change(slider, { target: { value: "20" } });
  expect(clip()).toBe("inset(0 80% 0 0)");
  expect(screen.getAllByRole("img").map((i) => i.getAttribute("alt"))).toEqual(["Site — Karanlık", "Site — Aydınlık"]);
});
