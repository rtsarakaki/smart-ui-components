import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { DatasetPicker } from "./DatasetPicker.js";
import type { DatasetPickerItem, DatasetPickerLabels } from "./datasetPickerModel.js";

afterEach(() => {
  cleanup();
});

const items: ReadonlyArray<DatasetPickerItem> = [
  {
    id: "p-partner",
    label: "Alex Partner",
    description: "Architect",
    type: "partner",
  },
  {
    id: "p-stakeholder",
    label: "Blair Stakeholder",
    description: "Analyst",
    type: "stakeholder",
  },
];

const labels: DatasetPickerLabels = {
  chooseButton: "Choose…",
  dialogTitle: "Choose item",
  dialogAriaLabel: ({ fieldLabel }) => `Choose for ${fieldLabel}`,
  descriptionFilterLabel: "Search",
  descriptionFilterPlaceholder: "Type to filter",
  listAriaLabel: "Items",
  emptySelectionLabel: "Not selected",
  noMatchesLabel: "No matches",
  cancelLabel: "Cancel",
  notSelectedLabel: "Not selected",
  typeFilterLabel: "Filter by type",
  typeFilterAria: "Filter by type",
  allTypesLabel: "All types",
  hint: "Pick one item",
};

describe("DatasetPicker", () => {
  it("shows the selected item label in the trigger", () => {
    render(
      <DatasetPicker
        fieldLabel="Responsible"
        value="p-partner"
        onChange={vi.fn()}
        items={items}
        labels={labels}
      />
    );

    expect(screen.getByText("Alex Partner")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Choose…" })).toBeTruthy();
  });

  it("hides type filter when typeOptions are omitted", () => {
    render(
      <DatasetPicker
        fieldLabel="Responsible"
        value=""
        onChange={vi.fn()}
        items={items}
        labels={labels}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Choose…" }));
    expect(screen.getByLabelText("Search")).toBeTruthy();
    expect(screen.queryByLabelText("Filter by type")).toBeNull();
  });

  it("shows type filter when typeOptions are provided", () => {
    render(
      <DatasetPicker
        fieldLabel="Responsible"
        value=""
        onChange={vi.fn()}
        items={items}
        labels={labels}
        typeOptions={[
          { value: "partner", label: "Partner" },
          { value: "stakeholder", label: "Stakeholder" },
        ]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Choose…" }));
    expect(screen.getByLabelText("Search")).toBeTruthy();
    expect(screen.getByLabelText("Filter by type")).toBeTruthy();
  });

  it("filters by type and description then selects an item", () => {
    const onChange = vi.fn();
    render(
      <DatasetPicker
        fieldLabel="Responsible"
        value=""
        onChange={onChange}
        items={items}
        labels={labels}
        typeOptions={[
          { value: "partner", label: "Partner" },
          { value: "stakeholder", label: "Stakeholder" },
        ]}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Choose…" }));
    expect(screen.getByRole("option", { name: /Alex Partner/i })).toBeTruthy();
    expect(screen.getByRole("option", { name: /Blair Stakeholder/i })).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Filter by type"), {
      target: { value: "partner" },
    });
    expect(screen.getByRole("option", { name: /Alex Partner/i })).toBeTruthy();
    expect(screen.queryByRole("option", { name: /Blair Stakeholder/i })).toBeNull();

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: "architect" },
    });
    fireEvent.click(screen.getByRole("option", { name: /Alex Partner/i }));
    expect(onChange).toHaveBeenCalledWith("p-partner");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("allows clearing the selection when allowEmpty is true", () => {
    const onChange = vi.fn();
    render(
      <DatasetPicker
        fieldLabel="Responsible"
        value="p-partner"
        onChange={onChange}
        items={items}
        labels={labels}
        allowEmpty
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Choose…" }));
    fireEvent.click(screen.getByRole("option", { name: "Not selected" }));
    expect(onChange).toHaveBeenCalledWith("");
  });
});
