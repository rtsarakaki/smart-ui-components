"use client";

import { useMemo, type ReactElement } from "react";
import {
  DEFAULT_LIST_PAGE_SIZE,
  LIST_PAGE_SIZE_OPTIONS,
  clampListPage,
  totalListPages,
  visibleListPages,
} from "./listPageMath.js";
import type { ListPaginationLabels } from "../dataGrid/types.js";

export type ListPaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  labels: ListPaginationLabels;
  pageSizeOptions?: ReadonlyArray<number>;
  className?: string;
};

export function ListPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  labels,
  pageSizeOptions = LIST_PAGE_SIZE_OPTIONS,
  className = "suc-list-pagination",
}: ListPaginationProps): ReactElement | null {
  const totalPages = totalListPages(totalItems, pageSize);
  const safePage = clampListPage(page, totalPages);
  const rangeStart = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = totalItems === 0 ? 0 : Math.min(safePage * pageSize, totalItems);
  const pageNumbers = useMemo(
    () => visibleListPages(safePage, totalPages),
    [safePage, totalPages]
  );

  if (totalItems === 0) return null;

  return (
    <nav className={className} aria-label={labels.ariaLabel}>
      <p className={`${className}__summary`}>
        {labels.showingRange({ from: rangeStart, to: rangeEnd, total: totalItems })}
      </p>

      <div className={`${className}__controls`}>
        <div className={`${className}__pages`} role="group" aria-label={labels.pagesAria}>
          <button
            type="button"
            className={`${className}__page-btn ${className}__page-btn--nav`}
            onClick={() => onPageChange(safePage - 1)}
            disabled={safePage <= 1}
            aria-label={labels.previousPage}
          >
            ‹
          </button>
          {pageNumbers.map((pageNumber) => {
            const isActive = pageNumber === safePage;
            return (
              <button
                key={pageNumber}
                type="button"
                className={`${className}__page-btn${isActive ? ` ${className}__page-btn--active` : ""}`}
                onClick={() => onPageChange(pageNumber)}
                aria-label={labels.pageNumber({ page: pageNumber })}
                aria-current={isActive ? "page" : undefined}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            type="button"
            className={`${className}__page-btn ${className}__page-btn--nav`}
            onClick={() => onPageChange(safePage + 1)}
            disabled={safePage >= totalPages}
            aria-label={labels.nextPage}
          >
            ›
          </button>
        </div>

        <label className={`${className}__page-size`}>
          <span className={`${className}__page-size-label`}>{labels.perPageLabel}</span>
          <select
            className={`field__input ${className}__page-size-select`}
            value={pageSize || DEFAULT_LIST_PAGE_SIZE}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            aria-label={labels.perPageAria}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {labels.perPageOption({ count: option })}
              </option>
            ))}
          </select>
        </label>
      </div>
    </nav>
  );
}
