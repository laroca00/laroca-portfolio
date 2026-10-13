import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { expect, test, vi } from "vitest";
import messages from "../../messages/tr.json";
import { Nav } from "@/components/layout/Nav";

vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  usePathname: () => "/tr",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useParams: () => ({ locale: "tr" }),
}));

function renderNav() {
  return render(
    <NextIntlClientProvider locale="tr" messages={messages}>
      <Nav />
    </NextIntlClientProvider>,
  );
}

test("renders localized links", () => {
  renderNav();
  const expected: [string, string][] = [
    ["Projeler", "/tr/projects"],
    ["Hakkımda", "/tr/about"],
    ["Hizmetler", "/tr/services"],
    ["Blog", "/tr/blog"],
    ["İletişim", "/tr#contact"],
  ];
  for (const [name, href] of expected) {
    expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
  }
});

test("command palette button dispatches the open event", async () => {
  const listener = vi.fn();
  window.addEventListener("open-command-palette", listener);
  renderNav();
  await userEvent.click(screen.getByRole("button", { name: /komut paleti/i }));
  expect(listener).toHaveBeenCalledTimes(1);
});
