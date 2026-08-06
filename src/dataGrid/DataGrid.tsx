"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import { DeleteIcon, EditIcon } from "../icons/ActionIcons.js";
import {
  DEFAULT_LIST_PAGE_SIZE,
  LIST_PAGE_SIZE_OPTIONS,
  paginateItems,
} from "../pagination/listPageMath.js";
import { ListPagination } from "../pagination/ListPagination.js";
import { resolveRowFlag, resolveRowText } from "./rowActionHelpers.js";
import { nextSortState, sortRows } from "./sortRows.js";
import type {
  DataGridActionLabels,
  DataGridClassNames,
  DataGridColumn,
  DataGridRowAction,
  DataGridRowActionsPlacement,
  DataGridSortState,
  ListPaginationLabels,
} from "./types.js";

const DEFAULT_CLASS_NAMES: DataGridClassNames = {
  root: "suc-data-grid",
  head: "suc-data-grid__head",
  list: "suc-data-grid__list",
  row: "suc-data-grid__row",
  rowClickable: "suc-data-grid__row--clickable",
  rowSelected: "suc-data-grid__row--selected",
  cell: "suc-data-grid__cell",
  cellId: "suc-data-grid__cell--id",
  cellActions: "suc-data-grid__cell--actions",
  col: "suc-data-grid__col",
  colId: "suc-data-grid__col--id",
  colActions: "suc-data-grid__col--actions",
  colSortable: "suc-data-grid__col--sortable",
  sortButton: "suc-data-grid__sort-button",
  empty: "suc-data-grid__empty",
  iconButton: "suc-data-grid__icon-btn",
  deleteButton: "suc-data-grid__delete",
  icon: "suc-data-grid__icon",
  extraAction: "suc-data-grid__extra-action",
  extraActionDanger: "suc-data-grid__extra-action--danger",
  extraActionLabel: "suc-data-grid__extra-action-label",
};

const stopRowActivation = (event: SyntheticEvent) => {
  event.stopPropagation();
};

export type DataGridProps<T> = {
  rows: ReadonlyArray<T>;
  columns: ReadonlyArray<DataGridColumn<T>>;
  getRowId: (row: T) => string;
  ariaLabel: string;
  isLoading?: boolean;
  emptyMessage?: ReactNode;
  loadingMessage?: ReactNode;
  showRowNumber?: boolean;
  showEditAction?: boolean;
  showDeleteAction?: boolean;
  canDelete?: boolean | ((row: T) => boolean);
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onRowActivate?: (row: T) => void;
  /** Declarative buttons beyond native edit/delete. */
  extraActions?: ReadonlyArray<DataGridRowAction<T>>;
  /** Freeform actions slot (e.g. host-specific inline action bar). */
  renderRowActions?: (row: T) => ReactNode;
  /** Where custom/extra actions sit relative to edit/delete. Default: before-native. */
  rowActionsPlacement?: DataGridRowActionsPlacement;
  /** Extra class names per row (selection, ownership, etc.). */
  getRowClassName?: (row: T) => string | undefined;
  /** Convenience: applies `rowSelected` class when ids match. */
  selectedRowId?: string | null;
  actionLabels?: DataGridActionLabels<T>;
  paginationLabels: ListPaginationLabels;
  pageSizeOptions?: ReadonlyArray<number>;
  defaultPageSize?: number;
  classNames?: Partial<DataGridClassNames>;
  paginationClassName?: string;
  /** Host CSS class aliases (e.g. Archsphere wbs-home__*) */
  hostClassNames?: Partial<DataGridClassNames>;
};

function ExtraActionButtons<T>({
  row,
  actions,
  styles,
}: {
  row: T;
  actions: ReadonlyArray<DataGridRowAction<T>>;
  styles: DataGridClassNames;
}): ReactElement {
  return (
    <>
      {actions.map((action) => {
        if (!resolveRowFlag(action.visible, row, true)) return null;

        const label = resolveRowText(action.label, row);
        const shortLabel = resolveRowText(action.shortLabel, row);
        const title = resolveRowText(action.title, row, label);
        const disabled = resolveRowFlag(action.disabled, row, false);
        const tone =
          typeof action.tone === "function" ? action.tone(row) : (action.tone ?? "default");
        const icon =
          typeof action.icon === "function" ? action.icon(row) : (action.icon ?? null);
        const className = [
          `btn btn--ghost btn--sm ${styles.iconButton} ${styles.extraAction}`,
          tone === "danger" ? styles.extraActionDanger : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <button
            key={action.id}
            type="button"
            className={className}
            aria-label={label}
            title={title}
            disabled={disabled}
            onClick={() => action.onClick(row)}
          >
            {icon}
            {shortLabel ? (
              <span className={styles.extraActionLabel}>{shortLabel}</span>
            ) : null}
          </button>
        );
      })}
    </>
  );
}

export function DataGrid<T>({
  rows,
  columns,
  getRowId,
  ariaLabel,
  isLoading = false,
  emptyMessage = "No items",
  loadingMessage = "Loading…",
  showRowNumber = true,
  showEditAction = true,
  showDeleteAction = true,
  canDelete = true,
  onEdit,
  onDelete,
  onRowActivate,
  extraActions = [],
  renderRowActions,
  rowActionsPlacement = "before-native",
  getRowClassName,
  selectedRowId = null,
  actionLabels = {},
  paginationLabels,
  pageSizeOptions = LIST_PAGE_SIZE_OPTIONS,
  defaultPageSize = DEFAULT_LIST_PAGE_SIZE,
  classNames,
  paginationClassName,
  hostClassNames,
}: DataGridProps<T>): ReactElement {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sort, setSort] = useState<DataGridSortState | null>(null);

  const styles: DataGridClassNames = {
    ...DEFAULT_CLASS_NAMES,
    ...classNames,
    ...hostClassNames,
  };

  const sortedRows = useMemo(() => sortRows(rows, columns, sort), [rows, columns, sort]);
  const pageRows = useMemo(
    () => paginateItems(sortedRows, page, pageSize),
    [sortedRows, page, pageSize]
  );

  useEffect(() => {
    setPage(1);
  }, [rows, pageSize, sort?.columnId, sort?.direction]);

  const resolveCanDelete = (row: T): boolean => resolveRowFlag(canDelete, row, true);

  const hasExtraActions = extraActions.length > 0;
  const hasCustomActionsSlot = typeof renderRowActions === "function";
  const showNativeEdit = Boolean(showEditAction && onEdit);
  const showNativeDelete = Boolean(showDeleteAction && onDelete);
  const showActions =
    showNativeEdit || showNativeDelete || hasExtraActions || hasCustomActionsSlot;

  const renderCustomActions = (row: T): ReactNode => (
    <>
      {hasCustomActionsSlot ? renderRowActions?.(row) : null}
      {hasExtraActions ? (
        <ExtraActionButtons row={row} actions={extraActions} styles={styles} />
      ) : null}
    </>
  );

  const renderNativeActions = (row: T): ReactNode => (
    <>
      {showNativeEdit ? (
        <button
          type="button"
          className={`btn btn--ghost btn--sm ${styles.iconButton}`}
          aria-label={actionLabels.editAriaLabel?.(row) ?? "Edit"}
          title={actionLabels.editTitle}
          onClick={() => onEdit?.(row)}
        >
          <EditIcon className={styles.icon} />
        </button>
      ) : null}
      {showNativeDelete && resolveCanDelete(row) ? (
        <button
          type="button"
          className={`btn btn--ghost btn--sm ${styles.deleteButton} ${styles.iconButton}`}
          aria-label={actionLabels.deleteAriaLabel?.(row) ?? "Delete"}
          title={actionLabels.deleteTitle}
          onClick={() => onDelete?.(row)}
        >
          <DeleteIcon className={styles.icon} />
        </button>
      ) : null}
    </>
  );

  return (
    <>
      <div className={styles.root} role="table" aria-label={ariaLabel}>
        <div className={styles.head} role="row">
          {showRowNumber ? (
            <span className={`${styles.col} ${styles.colId}`}>
              {actionLabels.rowNumberHeader ?? "#"}
            </span>
          ) : null}
          {columns.map((column) => {
            if (!column.sortable) {
              return (
                <span
                  key={column.id}
                  className={`${styles.col}${column.headerClassName ? ` ${column.headerClassName}` : ""}`}
                >
                  {column.header}
                </span>
              );
            }

            const isActive = sort?.columnId === column.id;
            const indicator = !isActive
              ? ""
              : sort?.direction === "asc"
                ? " ↑"
                : " ↓";

            return (
              <span
                key={column.id}
                className={`${styles.col} ${styles.colSortable}${column.headerClassName ? ` ${column.headerClassName}` : ""}`}
              >
                <button
                  type="button"
                  className={styles.sortButton}
                  onClick={() => setSort((current) => nextSortState(current, column.id))}
                  aria-label={`Sort by ${String(column.header)}`}
                >
                  {column.header}
                  {indicator}
                </button>
              </span>
            );
          })}
          {showActions ? (
            <span className={`${styles.col} ${styles.colActions}`}>
              {actionLabels.actionsHeader ?? "Actions"}
            </span>
          ) : null}
        </div>

        <ul className={styles.list} role="list">
          {isLoading ? <p className={styles.empty}>{loadingMessage}</p> : null}
          {!isLoading && rows.length === 0 ? (
            <p className={styles.empty}>{emptyMessage}</p>
          ) : null}
          {!isLoading
            ? pageRows.map((row, index) => {
                const absoluteIndex = (page - 1) * pageSize + index;
                const rowId = getRowId(row);
                const isClickable = Boolean(onRowActivate);
                const isSelected = selectedRowId !== null && selectedRowId === rowId;
                const hostRowClassName = getRowClassName?.(row);
                const rowClassName = [
                  styles.row,
                  isClickable ? styles.rowClickable : "",
                  isSelected ? styles.rowSelected : "",
                  hostRowClassName ?? "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <li
                    key={rowId}
                    className={rowClassName}
                    role={isClickable ? "button" : "listitem"}
                    tabIndex={isClickable ? 0 : undefined}
                    aria-selected={isSelected ? true : undefined}
                    onClick={isClickable ? () => onRowActivate?.(row) : undefined}
                    onKeyDown={
                      isClickable
                        ? (event) => {
                            if (event.key !== "Enter" && event.key !== " ") return;
                            event.preventDefault();
                            onRowActivate?.(row);
                          }
                        : undefined
                    }
                  >
                    {showRowNumber ? (
                      <span className={`${styles.cell} ${styles.cellId}`}>
                        {absoluteIndex + 1}
                      </span>
                    ) : null}
                    {columns.map((column) => (
                      <span
                        key={column.id}
                        className={`${styles.cell}${column.className ? ` ${column.className}` : ""}`}
                      >
                        {column.render(row, absoluteIndex)}
                      </span>
                    ))}
                    {showActions ? (
                      <div
                        className={`${styles.cell} ${styles.cellActions}`}
                        onClick={stopRowActivation}
                        onKeyDown={stopRowActivation}
                      >
                        {rowActionsPlacement === "before-native" ? (
                          <>
                            {renderCustomActions(row)}
                            {renderNativeActions(row)}
                          </>
                        ) : (
                          <>
                            {renderNativeActions(row)}
                            {renderCustomActions(row)}
                          </>
                        )}
                      </div>
                    ) : null}
                  </li>
                );
              })
            : null}
        </ul>
      </div>

      <ListPagination
        page={page}
        pageSize={pageSize}
        totalItems={sortedRows.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        labels={paginationLabels}
        pageSizeOptions={pageSizeOptions}
        className={paginationClassName ?? "suc-list-pagination"}
      />
    </>
  );
}
