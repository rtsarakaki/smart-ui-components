export type DatasetPickerItem = {
  id: string;
  /** Primary text shown in the trigger and list. */
  label: string;
  /** Always searchable; also shown as secondary text when present. */
  description?: string;
  /** Used by the optional type filter. */
  type?: string;
  /** Optional leading image URL (avatar-style). */
  imageUrl?: string;
};

export type DatasetPickerTypeOption = {
  value: string;
  label: string;
};

export type DatasetPickerLabels = {
  chooseButton: string;
  dialogTitle: string;
  dialogAriaLabel: (params: { fieldLabel: string }) => string;
  descriptionFilterLabel: string;
  descriptionFilterPlaceholder: string;
  listAriaLabel: string;
  emptySelectionLabel: string;
  noMatchesLabel: string;
  cancelLabel: string;
  /** Shown when value is set but no item matches. */
  unknownSelectionLabel?: (params: { id: string }) => string;
  /** Empty trigger text when nothing is selected. */
  notSelectedLabel: string;
  typeFilterLabel?: string;
  typeFilterAria?: string;
  allTypesLabel?: string;
  hint?: string;
};

export type DatasetPickerClassNames = {
  field: string;
  fieldLabel: string;
  fieldLabelRow: string;
  fieldLabelInfoHint: string;
  fieldLabelInfoBtn: string;
  fieldLabelInfoIcon: string;
  fieldLabelInfoTooltip: string;
  fieldHint: string;
  trigger: string;
  triggerValue: string;
  triggerLabel: string;
  triggerLabelEmpty: string;
  dialog: string;
  dialogCard: string;
  dialogTitle: string;
  dialogHint: string;
  filters: string;
  list: string;
  row: string;
  rowLabel: string;
  empty: string;
  actions: string;
  avatar: string;
  avatarImage: string;
  avatarPlaceholder: string;
};

/** True when a hint should be rendered (non-empty string or any React node). */
export function hasVisibleHint(hint: unknown): boolean {
  if (hint == null || hint === false) return false;
  if (typeof hint === "string") return hint.trim().length > 0;
  if (typeof hint === "number") return true;
  return true;
}

export function filterDatasetPickerItems(
  items: ReadonlyArray<DatasetPickerItem>,
  descriptionQuery: string,
  typeFilter: string
): DatasetPickerItem[] {
  const query = descriptionQuery.trim().toLowerCase();
  const type = typeFilter.trim();

  return items.filter((item) => {
    if (type.length > 0 && (item.type ?? "").trim() !== type) return false;
    if (query.length === 0) return true;

    const haystack = [item.label, item.description ?? ""]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });
}

export function findDatasetPickerItem(
  items: ReadonlyArray<DatasetPickerItem>,
  id: string
): DatasetPickerItem | null {
  const trimmed = id.trim();
  if (trimmed.length === 0) return null;
  return items.find((item) => item.id === trimmed) ?? null;
}

export function initialsFromLabel(label: string): string {
  const trimmed = label.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const first = parts[0]?.[0];
    const last = parts[parts.length - 1]?.[0];
    if (first && last) return (first + last).toUpperCase();
  }
  if (trimmed.length >= 2) return trimmed.slice(0, 2).toUpperCase();
  return (trimmed[0] + trimmed[0]).toUpperCase();
}

export function formatDatasetPickerRowLabel(item: DatasetPickerItem): string {
  const label = item.label.trim() || item.id;
  const description = item.description?.trim() ?? "";
  if (description.length === 0) return label;
  return `${label} · ${description}`;
}
