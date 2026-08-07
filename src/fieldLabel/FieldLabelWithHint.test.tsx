import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { FieldLabelWithHint } from "./FieldLabelWithHint.js";

afterEach(() => {
  cleanup();
});

describe("FieldLabelWithHint", () => {
  it("renders a plain label when hint is empty", () => {
    const { container } = render(<FieldLabelWithHint label="Requester" hint="   " />);
    expect(screen.getByText("Requester")).toBeTruthy();
    expect(container.querySelector(".suc-field-info-btn")).toBeNull();
  });

  it("shows the info control when hint has text", () => {
    render(
      <FieldLabelWithHint label="Requester" hint="Who asked for this" infoAria="More info" />
    );
    expect(screen.getByRole("button", { name: "More info" })).toBeTruthy();
    expect(screen.getByRole("tooltip").textContent).toBe("Who asked for this");
  });
});
