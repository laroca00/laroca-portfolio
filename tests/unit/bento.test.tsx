import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { expect, test, vi } from "vitest";
import messages from "../../messages/tr.json";
import { Bento } from "@/components/home/Bento";
import type { Profile } from "@/content/schema";

vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  usePathname: () => "/tr",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useParams: () => ({ locale: "tr" }),
}));

const profile: Profile = {
  name: "Tuğberk Emre Akkurt",
  handle: "LaRoca",
  tagline: "t",
  bio: "Kısa biyografi.",
  email: "a@b.co",
  location: "Türkiye",
  openToWork: true,
  socials: [],
  stats: [{ value: "7", label: "partner ülke" }],
  stack: ["React Native", "Next.js"],
};
const lines = [
  { date: "2026-10-01", message: "pisti: fix deal order", source: "github" as const },
  { date: "2026-09-20", message: "empower-eu: yayında", source: "changelog" as const },
];

function renderBento(p: Profile) {
  return render(
    <NextIntlClientProvider locale="tr" messages={messages}>
      <Bento profile={p} terminalLines={lines} />
    </NextIntlClientProvider>,
  );
}

test("renders bio, stack, stats and every terminal line", () => {
  renderBento(profile);
  expect(screen.getByText("Kısa biyografi.")).toBeInTheDocument();
  expect(screen.getByText("React Native")).toBeInTheDocument();
  expect(screen.getByText("partner ülke")).toBeInTheDocument();
  for (const l of lines) expect(screen.getByText(l.message)).toBeInTheDocument();
  expect(screen.getByText(/git log --oneline/)).toBeInTheDocument();
});

test("open-to-work badge only when openToWork", () => {
  renderBento(profile);
  expect(screen.getByText("Yeni projelere açığım")).toBeInTheDocument();
  renderBento({ ...profile, openToWork: false });
  expect(screen.getAllByText("Yeni projelere açığım")).toHaveLength(1);
});

test("contribution calendar renders one cell per day with its total", () => {
  render(
    <NextIntlClientProvider locale="tr" messages={messages}>
      <Bento
        profile={profile}
        terminalLines={lines}
        calendar={{
          total: 59,
          weeks: [
            [{ date: "2026-10-04", count: 0, level: 0 }],
            [
              { date: "2026-10-11", count: 3, level: 3 },
              { date: "2026-10-12", count: null, level: 1 },
            ],
          ],
        }}
      />
    </NextIntlClientProvider>,
  );
  const grid = screen.getByRole("img", { name: "Son 12 ayda 59 katkı" });
  expect(grid.querySelectorAll(".contrib-cell")).toHaveLength(3);
  expect(grid.querySelector('[title="11 Ekim 2026: 3 katkı"]')).not.toBeNull();
});
