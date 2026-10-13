import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, expect, test, vi } from "vitest";
import messages from "../../messages/tr.json";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import type { Locale } from "@/i18n/config";

const replace = vi.fn();
vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  usePathname: () => "/tr/projects",
  useRouter: () => ({ push: vi.fn(), replace, prefetch: vi.fn() }),
  useParams: () => ({ locale: "tr" }),
}));

beforeEach(() => replace.mockReset());

function renderSwitcher(locales: Locale[]) {
  return render(
    <NextIntlClientProvider locale="tr" messages={messages}>
      <LanguageSwitcher locales={locales} current="tr" />
    </NextIntlClientProvider>,
  );
}

test("renders nothing when only one locale is enabled", () => {
  const { container } = renderSwitcher(["tr"]);
  expect(container).toBeEmptyDOMElement();
});

test("switches to the same page in the chosen locale", async () => {
  renderSwitcher(["tr", "en"]);
  await userEvent.selectOptions(screen.getByRole("combobox", { name: "Dil" }), "en");
  expect(replace).toHaveBeenCalledTimes(1);
  expect(replace.mock.calls[0][0]).toBe("/en/projects");
});
