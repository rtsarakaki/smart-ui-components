import { describe, expect, it } from "vitest";
import {
  filterDatasetPickerItems,
  findDatasetPickerItem,
  formatDatasetPickerRowLabel,
  initialsFromLabel,
  type DatasetPickerItem,
} from "./datasetPickerModel.js";

const items: ReadonlyArray<DatasetPickerItem> = [
  {
    id: "1",
    label: "Alex Partner",
    description: "Architect · Platform",
    type: "partner",
  },
  {
    id: "2",
    label: "Blair Stakeholder",
    description: "Analyst · Finance",
    type: "stakeholder",
  },
  {
    id: "3",
    label: "Casey",
    type: "partner",
  },
];

describe("datasetPickerModel", () => {
  it("filters by description query across label and description", () => {
    expect(filterDatasetPickerItems(items, "finance", "").map((item) => item.id)).toEqual([
      "2",
    ]);
    expect(filterDatasetPickerItems(items, "alex", "").map((item) => item.id)).toEqual(["1"]);
  });

  it("filters by type when provided", () => {
    expect(filterDatasetPickerItems(items, "", "partner").map((item) => item.id)).toEqual([
      "1",
      "3",
    ]);
  });

  it("combines description and type filters", () => {
    expect(filterDatasetPickerItems(items, "architect", "partner").map((item) => item.id)).toEqual([
      "1",
    ]);
    expect(filterDatasetPickerItems(items, "finance", "partner")).toEqual([]);
  });

  it("finds items and formats row labels", () => {
    expect(findDatasetPickerItem(items, "2")?.label).toBe("Blair Stakeholder");
    expect(findDatasetPickerItem(items, "")).toBeNull();
    expect(formatDatasetPickerRowLabel(items[0]!)).toBe(
      "Alex Partner · Architect · Platform"
    );
    expect(formatDatasetPickerRowLabel(items[2]!)).toBe("Casey");
  });

  it("builds initials from labels", () => {
    expect(initialsFromLabel("Ana Carolina")).toBe("AC");
    expect(initialsFromLabel("Jo")).toBe("JO");
    expect(initialsFromLabel("")).toBe("?");
  });
});
