import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { TypedLine } from "@/components/home/TypedLine";

const TEXT = "mobile · web · backend · games";

test("full text is in the markup from the first render (no-JS / reduced motion safe)", () => {
  render(<TypedLine text={TEXT} />);
  const line = screen.getByTestId("typed-line");
  expect(line).toHaveTextContent(TEXT);
  expect(line).toHaveAttribute("aria-label", `$ ${TEXT}`);
});

test("typing animation is sized to the text and its speed", () => {
  render(<TypedLine text={TEXT} speedMs={50} prompt="~/laroca $" />);
  const typed = screen.getByTestId("typed-text");
  const chars = Array.from(TEXT).length;
  expect(typed.style.getPropertyValue("--typed-chars")).toBe(String(chars));
  expect(typed.style.getPropertyValue("--typed-duration")).toBe(`${chars * 50}ms`);
  expect(screen.getByTestId("typed-line")).toHaveAttribute("aria-label", `~/laroca $ ${TEXT}`);
});
