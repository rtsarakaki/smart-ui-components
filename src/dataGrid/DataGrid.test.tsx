import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { DataGrid } from "./DataGrid.js";
import type { DataGridColumn, ListPaginationLabels } from "./types.js";

afterEach(() => {
  cleanup();
});

type Row = { id: string; title: string; kind: string; score?: number | null };

const paginationLabels: ListPaginationLabels = {
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

const actionLabels = {
  editAriaLabel: (row: Row) => `Edit ${row.title}`,
  deleteAriaLabel: (row: Row) => `Delete ${row.title}`,
  editTitle: "Edit",
  deleteTitle: "Delete",
  actionsHeader: "Actions",
};

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
  {
    id: "fixed",
    header: "Fixed",
    render: () => "—",
  },
];

const rows: ReadonlyArray<Row> = [
  { id: "1", title: "Zeta", kind: "rule" },
  { id: "2", title: "Alpha", kind: "skill" },
  { id: "3", title: "Beta", kind: "template" },
];

const renderGrid = (props: Partial<ComponentProps<typeof DataGrid<Row>>> = {}) =>
  render(
    <DataGrid
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      ariaLabel="Artifacts"
      actionLabels={actionLabels}
      paginationLabels={paginationLabels}
      defaultPageSize={10}
      onEdit={vi.fn()}
      onDelete={vi.fn()}
      {...props}
    />
  );

describe("DataGrid", () => {
  it("sorts by column when the header button is clicked", () => {
    renderGrid();
    fireEvent.click(screen.getByRole("button", { name: "Sort by Title" }));
    const listItems = screen.getAllByRole("listitem");
    expect(listItems[0]?.textContent ?? "").toContain("Alpha");
    expect(listItems[1]?.textContent ?? "").toContain("Beta");
    expect(listItems[2]?.textContent ?? "").toContain("Zeta");
  });

  it("toggles sort direction on repeated header clicks", () => {
    renderGrid();
    const sortButton = screen.getByRole("button", { name: "Sort by Title" });
    fireEvent.click(sortButton);
    fireEvent.click(sortButton);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems[0]?.textContent ?? "").toContain("Zeta");
  });

  it("paginates rows and invokes edit/delete actions", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    renderGrid({ defaultPageSize: 2, onEdit, onDelete });

    expect(screen.getByText("1-2 of 3")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Edit Zeta" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete Zeta" }));
    expect(onEdit).toHaveBeenCalledWith(rows[0]);
    expect(onDelete).toHaveBeenCalledWith(rows[0]);
  });

  it("shows loading and empty states", () => {
    const { rerender } = renderGrid({
      rows: [],
      isLoading: true,
      loadingMessage: "Loading…",
      emptyMessage: "No items",
    });
    expect(screen.getByText("Loading…")).toBeTruthy();

    rerender(
      <DataGrid
        rows={[]}
        columns={columns}
        getRowId={(row) => row.id}
        ariaLabel="Artifacts"
        actionLabels={actionLabels}
        paginationLabels={paginationLabels}
        isLoading={false}
        emptyMessage="No items"
      />
    );
    expect(screen.getByText("No items")).toBeTruthy();
  });

  it("activates a row via click and keyboard", () => {
    const onRowActivate = vi.fn();
    renderGrid({ onRowActivate });
    const clickableRows = screen
      .getAllByRole("button")
      .filter((element) => element.tagName === "LI");
    const row = clickableRows.find((element) => element.textContent?.includes("Zeta"));
    expect(row).toBeTruthy();
    fireEvent.click(row!);
    expect(onRowActivate).toHaveBeenCalledWith(rows[0]);

    fireEvent.keyDown(row!, { key: "Enter" });
    fireEvent.keyDown(row!, { key: " " });
    expect(onRowActivate).toHaveBeenCalledTimes(3);
  });

  it("hides delete when canDelete is false and when showDeleteAction is false", () => {
    renderGrid({ canDelete: false });
    expect(screen.queryByRole("button", { name: "Delete Zeta" })).toBeNull();
    cleanup();

    renderGrid({ showDeleteAction: false, canDelete: (row) => row.kind === "rule" });
    expect(screen.queryByRole("button", { name: "Delete Zeta" })).toBeNull();
  });

  it("uses canDelete predicate per row", () => {
    const onDelete = vi.fn();
    renderGrid({
      canDelete: (row) => row.kind === "rule",
      onDelete,
    });
    expect(screen.getByRole("button", { name: "Delete Zeta" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Delete Alpha" })).toBeNull();
  });

  it("applies hostClassNames and changes page size", () => {
    renderGrid({
      hostClassNames: { root: "host-grid" },
      paginationClassName: "host-pagination",
      defaultPageSize: 8,
    });
    expect(document.querySelector(".host-grid")).toBeTruthy();
    expect(document.querySelector(".host-pagination")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Rows per page"), {
      target: { value: "10" },
    });
    expect(screen.getByText("1-3 of 3")).toBeTruthy();
  });
});
