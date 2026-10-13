import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, expect, test, vi } from "vitest";
import messages from "../../messages/tr.json";
import { CommandPalette } from "@/components/command/CommandPalette";
import type { Locale } from "@/i18n/config";

const push = vi.fn();
vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  usePathname: () => "/tr",
  useRouter: () => ({ push, replace: vi.fn(), prefetch: vi.fn() }),
  useParams: () => ({ locale: "tr" }),
}));

const projects = [
  { slug: "online-pisti", title: "Online Pişti" },
  { slug: "empower-eu", title: "EmpowerEU" },
];

function renderPalette(locales: Locale[] = ["tr"]) {
  return render(
    <NextIntlClientProvider locale="tr" messages={messages}>
      <CommandPalette projects={projects} email="tugberkakkrt@gmail.com" locales={locales} />
    </NextIntlClientProvider>,
  );
}

beforeEach(() => push.mockReset());

test("Ctrl+K opens the palette and Escape closes it", async () => {
  const user = userEvent.setup();
  renderPalette();
  expect(screen.queryByRole("dialog")).toBeNull();
  await user.keyboard("{Control>}k{/Control}");
  expect(await screen.findByRole("dialog")).toBeInTheDocument();
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).toBeNull();
});

test("the nav button event opens the palette", async () => {
  renderPalette();
  act(() => {
    window.dispatchEvent(new Event("open-command-palette"));
  });
  expect(await screen.findByRole("dialog")).toBeInTheDocument();
});

test("typing filters to matching items and selecting navigates", async () => {
  const user = userEvent.setup();
  renderPalette();
  await user.keyboard("{Control>}k{/Control}");
  await user.keyboard("pişti");
  expect(screen.getByRole("option", { name: /Online Pişti/ })).toBeInTheDocument();
  expect(screen.queryByRole("option", { name: /EmpowerEU/ })).toBeNull();
  await user.keyboard("{Enter}");
  expect(push).toHaveBeenCalledWith("/tr/projects/online-pisti");
});

test("copy email action writes to the clipboard", async () => {
  const user = userEvent.setup();
  const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
  renderPalette();
  await user.keyboard("{Control>}k{/Control}");
  await user.click(screen.getByRole("option", { name: /E-postayı kopyala/ }));
  expect(writeText).toHaveBeenCalledWith("tugberkakkrt@gmail.com");
});

test("language group only appears when more than one locale is enabled", async () => {
  const user = userEvent.setup();
  const { unmount } = renderPalette(["tr"]);
  await user.keyboard("{Control>}k{/Control}");
  expect(screen.queryByText("Dil")).toBeNull();
  unmount();
  renderPalette(["tr", "en"]);
  await user.keyboard("{Control>}k{/Control}");
  expect(screen.getByRole("option", { name: /English/ })).toBeInTheDocument();
});
