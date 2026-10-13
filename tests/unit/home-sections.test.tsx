import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { expect, test, vi } from "vitest";
import messages from "../../messages/tr.json";
import { LatestPosts } from "@/components/home/LatestPosts";
import { ServicesSection } from "@/components/home/ServicesSection";
import { Testimonials } from "@/components/home/Testimonials";
import type { Post } from "@/content/schema";

vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  usePathname: () => "/tr",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useParams: () => ({ locale: "tr" }),
}));

const wrap = (ui: ReactNode) =>
  render(
    <NextIntlClientProvider locale="tr" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );

const post = (slug: string, day: number): Post => ({
  slug,
  title: `Yazı ${slug}`,
  description: "Açıklama",
  date: new Date(Date.UTC(2026, 8, day)),
  tags: [],
  draft: false,
  body: "",
  readingMinutes: 3,
});

test("services render every item", () => {
  wrap(<ServicesSection services={[{ title: "Mobil", description: "RN", icon: "smartphone" }, { title: "Web", description: "Next", icon: "globe" }]} />);
  expect(screen.getByRole("heading", { name: "Mobil" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Web" })).toBeInTheDocument();
});

test("testimonials render quotes with attribution", () => {
  wrap(<Testimonials items={[{ quote: "Harika iş.", author: "Ayşe", role: "Koordinatör", org: "Kurum" }]} />);
  expect(screen.getByText("Harika iş.").closest("blockquote")).not.toBeNull();
  expect(screen.getByText(/Ayşe/)).toBeInTheDocument();
});

test("latest posts shows at most 3, links and reading time", () => {
  wrap(<LatestPosts posts={[post("a", 4), post("b", 3), post("c", 2), post("d", 1)]} />);
  const links = screen.getAllByRole("link").filter((l) => l.getAttribute("href")?.startsWith("/tr/blog/"));
  expect(links.map((l) => l.getAttribute("href"))).toEqual(["/tr/blog/a", "/tr/blog/b", "/tr/blog/c"]);
  expect(screen.getAllByText("3 dk okuma")).toHaveLength(3);
  expect(screen.getByText("4 Eylül 2026")).toBeInTheDocument();
});

test("empty lists render nothing", () => {
  const { container } = wrap(
    <>
      <ServicesSection services={[]} />
      <Testimonials items={[]} />
      <LatestPosts posts={[]} />
    </>,
  );
  expect(container).toBeEmptyDOMElement();
});
