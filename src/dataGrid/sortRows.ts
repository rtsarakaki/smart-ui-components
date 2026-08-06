import type { DataGridColumn, DataGridSortState, SortDirection } from "./types.js";

const compareSortValues = (
  left: string | number | boolean | null | undefined,
  right: string | number | boolean | null | undefined,
  direction: SortDirection
): number => {
  if (left == null && right == null) return 0;
  if (left == null) return direction === "asc" ? 1 : -1;
  if (right == null) return direction === "asc" ? -1 : 1;

  if (typeof left === "number" && typeof right === "number") {
    return direction === "asc" ? left - right : right - left;
  }

  const leftText = String(left);
  const rightText = String(right);
  const comparison = leftText.localeCompare(rightText, undefined, {
    sensitivity: "base",
    numeric: true,
  });
  return direction === "asc" ? comparison : -comparison;
};

export const sortRows = <T>(
  rows: ReadonlyArray<T>,
  columns: ReadonlyArray<DataGridColumn<T>>,
  sort: DataGridSortState | null
): T[] => {
  if (!sort) return [...rows];

  const column = columns.find((entry) => entry.id === sort.columnId);
  if (!column?.sortable || !column.getSortValue) return [...rows];

  return [...rows].sort((left, right) =>
    compareSortValues(column.getSortValue?.(left), column.getSortValue?.(right), sort.direction)
  );
};

export const nextSortState = (
  current: DataGridSortState | null,
  columnId: string
): DataGridSortState => {
  if (!current || current.columnId !== columnId) {
    return { columnId, direction: "asc" };
  }
  if (current.direction === "asc") {
    return { columnId, direction: "desc" };
  }
  return { columnId, direction: "asc" };
};
