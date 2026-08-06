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

export type DataGridRowActionTone = "default" | "danger";

/**
 * Declarative extra action button in the row actions cell
 * (in addition to native edit/delete).
 */
export type DataGridRowAction<T> = {
  id: string;
  /** Accessible name (and default title). */
  label: string | ((row: T) => string);
  /** Optional visible caption next to the icon. */
  shortLabel?: string | ((row: T) => string);
  icon?: ReactNode | ((row: T) => ReactNode);
  onClick: (row: T) => void;
  visible?: boolean | ((row: T) => boolean);
  disabled?: boolean | ((row: T) => boolean);
  tone?: DataGridRowActionTone | ((row: T) => DataGridRowActionTone);
  title?: string | ((row: T) => string);
};

export type DataGridRowActionsPlacement = "before-native" | "after-native";

export type DataGridClassNames = {
  root: string;
  head: string;
  list: string;
  row: string;
  rowClickable: string;
  rowSelected: string;
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
  extraAction: string;
  extraActionDanger: string;
  extraActionLabel: string;
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
  editAriaLabel?: (row: T) => string;
  deleteAriaLabel?: (row: T) => string;
  editTitle?: string;
  deleteTitle?: string;
  actionsHeader?: ReactNode;
  rowNumberHeader?: ReactNode;
};
