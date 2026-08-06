import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { DataGrid } from "./DataGrid.js";
import type { DataGridColumn, ListPaginationLabels } from "./types.js";

afterEach(() => {
  cleanup();
});

type Row = { id: string; title: string; kind: string };

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
  { id: "1", title: "Zeta", kind: "rule" },
  { id: "2", title: "Alpha", kind: "skill" },
  { id: "3", title: "Beta", kind: "template" },
];

describe("DataGrid", () => {
  it("sorts by column when the header button is clicked", () => {
    render(
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        ariaLabel="Artifacts"
        actionLabels={{
          editAriaLabel: (row) => `Edit ${row.title}`,
          deleteAriaLabel: (row) => `Delete ${row.title}`,
          editTitle: "Edit",
          deleteTitle: "Delete",
        }}
        paginationLabels={paginationLabels}
        defaultPageSize={10}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Sort by Title" }));

    const listItems = screen.getAllByRole("listitem");
    expect(listItems[0]?.textContent ?? "").toContain("Alpha");
    expect(listItems[1]?.textContent ?? "").toContain("Beta");
    expect(listItems[2]?.textContent ?? "").toContain("Zeta");
  });

  it("paginates rows and invokes edit/delete actions", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        ariaLabel="Artifacts"
        actionLabels={{
          editAriaLabel: (row) => `Edit ${row.title}`,
          deleteAriaLabel: (row) => `Delete ${row.title}`,
          editTitle: "Edit",
          deleteTitle: "Delete",
        }}
        paginationLabels={paginationLabels}
        defaultPageSize={2}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText("1-2 of 3")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Edit Zeta" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete Zeta" }));
    expect(onEdit).toHaveBeenCalledWith(rows[0]);
    expect(onDelete).toHaveBeenCalledWith(rows[0]);
  });
});
