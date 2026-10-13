import { render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { expect, test, vi } from "vitest";
import messages from "../../messages/tr.json";
import { ProjectShowcase } from "@/components/home/ProjectShowcase";
import type { Project } from "@/content/schema";

vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  usePathname: () => "/tr",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useParams: () => ({ locale: "tr" }),
}));

const base = { category: "web" as const, stack: [], year: 2025, body: "", label: "Etiket", tagline: "Kısa" };
const projects: Project[] = [
  { ...base, slug: "green-future-balcony", title: "Green Future Balcony", accent: "green", featured: true, order: 1, liveUrl: "https://greenfuturebalcony.com", cover: "/projects/green-future-balcony/cover.webp" },
  { ...base, slug: "empower-eu", title: "EmpowerEU", accent: "violet", featured: true, order: 2, liveUrl: "https://empoweringadultswithdisabilities.com" },
  { ...base, slug: "online-pisti", title: "Online Pişti", accent: "red", featured: true, order: 3, storeUrl: "https://play.google.com/store/apps/details?id=x" },
  { ...base, slug: "sirpca-ogren", title: "Sırpça Öğren", accent: "blue", featured: true, order: 4 },
  { ...base, slug: "akgun", title: "Akgün", accent: "amber", featured: false, order: 5 },
];

function renderShowcase() {
  return render(
    <NextIntlClientProvider locale="tr" messages={messages}>
      <ProjectShowcase projects={projects} />
    </NextIntlClientProvider>,
  );
}

test("renders only featured projects, in order", () => {
  renderShowcase();
  expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
    "Green Future Balcony",
    "EmpowerEU",
    "Online Pişti",
    "Sırpça Öğren",
  ]);
  expect(screen.queryByText("Akgün")).toBeNull();
});

test("case study and external links", () => {
  renderShowcase();
  const gfb = within(screen.getByRole("region", { name: "Green Future Balcony" }));
  expect(gfb.getByRole("link", { name: /Vaka çalışmasını oku/ })).toHaveAttribute(
    "href",
    "/tr/projects/green-future-balcony",
  );
  const live = gfb.getByRole("link", { name: /Siteye git/ });
  expect(live).toHaveAttribute("href", "https://greenfuturebalcony.com");
  expect(live).toHaveAttribute("target", "_blank");
  expect(live.getAttribute("rel")).toContain("noopener");

  const pisti = within(screen.getByRole("region", { name: "Online Pişti" }));
  expect(pisti.getByRole("link", { name: /Play Store/ })).toHaveAttribute(
    "href",
    "https://play.google.com/store/apps/details?id=x",
  );

  const serbian = within(screen.getByRole("region", { name: "Sırpça Öğren" }));
  expect(serbian.getAllByRole("link")).toHaveLength(1);
});
