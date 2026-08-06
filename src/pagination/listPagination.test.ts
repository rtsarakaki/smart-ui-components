import { describe, expect, it } from "vitest";
import {
  clampListPage,
  paginateItems,
  totalListPages,
  visibleListPages,
} from "./listPagination.js";

describe("listPagination", () => {
  it("computes total pages", () => {
    expect(totalListPages(25, 10)).toBe(3);
    expect(totalListPages(0, 10)).toBe(1);
  });

  it("clamps page into range", () => {
    expect(clampListPage(0, 5)).toBe(1);
    expect(clampListPage(9, 5)).toBe(5);
  });

  it("slices items for the current page", () => {
    const items = [1, 2, 3, 4, 5];
    expect(paginateItems(items, 2, 2)).toEqual([3, 4]);
  });

  it("builds a compact page window", () => {
    expect(visibleListPages(1, 3)).toEqual([1, 2, 3]);
    expect(visibleListPages(5, 10)).toEqual([3, 4, 5, 6, 7]);
  });
});
