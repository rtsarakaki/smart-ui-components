import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ListPagination } from "./ListPagination.js";
import type { ListPaginationLabels } from "../dataGrid/types.js";

afterEach(() => {
  cleanup();
});

const labels: ListPaginationLabels = {
  ariaLabel: "Pagination",
  showingRange: ({ from, to, total }) => `${from}-${to} of ${total}`,
  pagesAria: "Pages",
  previousPage: "Previous",
  nextPage: "Next",
  pageNumber: ({ page }) => `Page ${page}`,
  perPageLabel: "Per page",
  perPageAria: "Rows per page",
  perPageOption: ({ count }) => `${count}`,
};

describe("ListPagination", () => {
  it("returns null when there are no items", () => {
    const { container } = render(
      <ListPagination
        page={1}
        pageSize={10}
        totalItems={0}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
        labels={labels}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("navigates pages and changes page size", () => {
    const onPageChange = vi.fn();
    const onPageSizeChange = vi.fn();

    render(
      <ListPagination
        page={2}
        pageSize={10}
        totalItems={25}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        labels={labels}
        className="participants-list-pagination"
      />
    );

    expect(screen.getByText("11-20 of 25")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(onPageChange).toHaveBeenCalledWith(1);
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    fireEvent.click(screen.getByRole("button", { name: "Page 1" }));
    expect(onPageChange).toHaveBeenCalledWith(1);
    fireEvent.change(screen.getByLabelText("Rows per page"), {
      target: { value: "25" },
    });
    expect(onPageSizeChange).toHaveBeenCalledWith(25);
  });
});
