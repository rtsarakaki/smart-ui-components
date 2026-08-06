export const LIST_PAGE_SIZE_OPTIONS = [8, 10, 25, 50] as const;
export const DEFAULT_LIST_PAGE_SIZE = 10;

export function totalListPages(totalItems: number, pageSize: number): number {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

export function clampListPage(page: number, totalPages: number): number {
  return Math.min(Math.max(page, 1), totalPages);
}

export function paginateItems<T>(
  items: ReadonlyArray<T>,
  page: number,
  pageSize: number
): T[] {
  const pages = totalListPages(items.length, pageSize);
  const safePage = clampListPage(page, pages);
  const start = (safePage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function visibleListPages(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 1) return totalPages === 1 ? [1] : [];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
