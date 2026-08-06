import type { ReactNode } from "react";

export type SortDirection = "asc" | "desc";

export type DataGridSortState = {
  columnId: string;
  direction: SortDirection;
};

export type DataGridColumn<T> = {
  id: string;
  header: ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  getSortValue?: (row: T) => string | number | boolean | null | undefined;
  render: (row: T, absoluteIndex: number) => ReactNode;
};

export type DataGridClassNames = {
  root: string;
  head: string;
  list: string;
  row: string;
  rowClickable: string;
  cell: string;
  cellId: string;
  cellActions: string;
  col: string;
  colId: string;
  colActions: string;
  colSortable: string;
  sortButton: string;
  empty: string;
  iconButton: string;
  deleteButton: string;
  icon: string;
};

export type ListPaginationLabels = {
  ariaLabel: string;
  showingRange: (params: { from: number; to: number; total: number }) => string;
  pagesAria: string;
  previousPage: string;
  nextPage: string;
  pageNumber: (params: { page: number }) => string;
  perPageLabel: string;
  perPageAria: string;
  perPageOption: (params: { count: number }) => string;
};

export type DataGridActionLabels<T> = {
  editAriaLabel: (row: T) => string;
  deleteAriaLabel: (row: T) => string;
  editTitle?: string;
  deleteTitle?: string;
  actionsHeader?: ReactNode;
  rowNumberHeader?: ReactNode;
};
