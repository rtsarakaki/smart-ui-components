import { describe, expect, it } from "vitest";
import { resolveRowFlag, resolveRowText } from "./rowActionHelpers.js";

type Row = { id: string; owned: boolean };

describe("rowActionHelpers", () => {
  it("resolves boolean flags and predicates", () => {
    const row: Row = { id: "1", owned: true };
    expect(resolveRowFlag(undefined, row, true)).toBe(true);
    expect(resolveRowFlag(false, row, true)).toBe(false);
    expect(resolveRowFlag((item) => item.owned, row, false)).toBe(true);
  });

  it("resolves text labels and functions", () => {
    const row: Row = { id: "1", owned: false };
    expect(resolveRowText(undefined, row, "fallback")).toBe("fallback");
    expect(resolveRowText("Static", row)).toBe("Static");
    expect(resolveRowText((item) => `Row ${item.id}`, row)).toBe("Row 1");
  });
});
