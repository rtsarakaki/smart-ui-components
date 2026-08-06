import { describe, expect, it } from "vitest";
import { nextSortState, sortRows } from "./sortRows.js";
import type { DataGridColumn } from "./types.js";

type Row = { id: string; title: string; kind: string };

const columns: ReadonlyArray<DataGridColumn<Row>> = [
  {
    id: "title",
    header: "Title",
    sortable: true,
    getSortValue: (row) => row.title,
    render: (row) => row.title,
  },
  {
    id: "kind",
    header: "Kind",
    sortable: true,
    getSortValue: (row) => row.kind,
    render: (row) => row.kind,
  },
];

const rows: ReadonlyArray<Row> = [
  { id: "1", title: "Charlie", kind: "skill" },
  { id: "2", title: "Alpha", kind: "rule" },
  { id: "3", title: "Bravo", kind: "template" },
];

describe("sortRows", () => {
  it("returns a copy when sort is null", () => {
    const result = sortRows(rows, columns, null);
    expect(result).toEqual(rows);
    expect(result).not.toBe(rows);
  });

  it("sorts ascending by title", () => {
    const result = sortRows(rows, columns, { columnId: "title", direction: "asc" });
    expect(result.map((row) => row.title)).toEqual(["Alpha", "Bravo", "Charlie"]);
  });

  it("sorts descending by title", () => {
    const result = sortRows(rows, columns, { columnId: "title", direction: "desc" });
    expect(result.map((row) => row.title)).toEqual(["Charlie", "Bravo", "Alpha"]);
  });
});

describe("nextSortState", () => {
  it("starts ascending for a new column", () => {
    expect(nextSortState(null, "title")).toEqual({ columnId: "title", direction: "asc" });
  });

  it("toggles asc to desc on same column", () => {
    expect(nextSortState({ columnId: "title", direction: "asc" }, "title")).toEqual({
      columnId: "title",
      direction: "desc",
    });
  });

  it("toggles desc back to asc on same column", () => {
    expect(nextSortState({ columnId: "title", direction: "desc" }, "title")).toEqual({
      columnId: "title",
      direction: "asc",
    });
  });
});
