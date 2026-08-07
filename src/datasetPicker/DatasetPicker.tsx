"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  filterDatasetPickerItems,
  findDatasetPickerItem,
  formatDatasetPickerRowLabel,
  hasVisibleHint,
  initialsFromLabel,
  type DatasetPickerClassNames,
  type DatasetPickerItem,
  type DatasetPickerLabels,
  type DatasetPickerTypeOption,
} from "./datasetPickerModel.js";
import { FieldLabelWithHint } from "../fieldLabel/FieldLabelWithHint.js";

const DEFAULT_CLASS_NAMES: DatasetPickerClassNames = {
  field: "suc-dataset-picker",
  fieldLabel: "suc-dataset-picker__label",
  fieldLabelRow: "suc-dataset-picker__label-row",
  fieldLabelInfoHint: "suc-dataset-picker__label-info",
  fieldLabelInfoBtn: "suc-dataset-picker__label-info-btn",
  fieldLabelInfoIcon: "suc-dataset-picker__label-info-icon",
  fieldLabelInfoTooltip: "suc-dataset-picker__label-info-tooltip",
  fieldHint: "suc-dataset-picker__field-hint",
  trigger: "suc-dataset-picker__trigger",
  triggerValue: "suc-dataset-picker__trigger-value",
  triggerLabel: "suc-dataset-picker__trigger-label",
  triggerLabelEmpty: "suc-dataset-picker__trigger-label--empty",
  dialog: "suc-dataset-picker__dialog",
  dialogCard: "suc-dataset-picker__dialog-card",
  dialogTitle: "suc-dataset-picker__dialog-title",
  dialogHint: "suc-dataset-picker__hint",
  filters: "suc-dataset-picker__filters",
  list: "suc-dataset-picker__list",
  row: "suc-dataset-picker__row",
  rowLabel: "suc-dataset-picker__row-label",
  empty: "suc-dataset-picker__empty",
  actions: "suc-dataset-picker__actions",
  avatar: "suc-dataset-picker__avatar",
  avatarImage: "suc-dataset-picker__avatar--image",
  avatarPlaceholder: "suc-dataset-picker__avatar--placeholder",
};

function DatasetPickerAvatar({
  label,
  imageUrl,
  size = 32,
  styles,
}: {
  label: string;
  imageUrl?: string;
  size?: number;
  styles: DatasetPickerClassNames;
}): ReactElement {
  const [failed, setFailed] = useState(false);
  const url = imageUrl?.trim() ?? "";

  if (url.length > 0 && !failed) {
    return (
      <img
        src={url}
        alt=""
        width={size}
        height={size}
        className={`${styles.avatar} ${styles.avatarImage}`}
        onError={() => setFailed(true)}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <span
      className={`${styles.avatar} ${styles.avatarPlaceholder}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden
    >
      {initialsFromLabel(label)}
    </span>
  );
}

export type DatasetPickerProps = {
  fieldLabel: string;
  value: string;
  onChange: (id: string) => void;
  items: ReadonlyArray<DatasetPickerItem>;
  labels: DatasetPickerLabels;
  /** When provided and non-empty, shows the optional type filter. */
  typeOptions?: ReadonlyArray<DatasetPickerTypeOption>;
  allowEmpty?: boolean;
  disabled?: boolean;
  showLeadingVisual?: boolean;
  /** Info tooltip next to the field label — shown only when non-empty. */
  labelHint?: string;
  labelInfoAria?: string;
  /** Helper text under the trigger — shown only when non-empty. */
  hint?: ReactNode;
  classNames?: Partial<DatasetPickerClassNames>;
  hostClassNames?: Partial<DatasetPickerClassNames>;
};

export function DatasetPicker({
  fieldLabel,
  value,
  onChange,
  items,
  labels,
  typeOptions = [],
  allowEmpty = true,
  disabled = false,
  showLeadingVisual = true,
  labelHint,
  labelInfoAria,
  hint,
  classNames,
  hostClassNames,
}: DatasetPickerProps): ReactElement {
  const listId = useId().replace(/:/g, "");
  const rootRef = useRef<HTMLDivElement>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [descriptionQuery, setDescriptionQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const styles: DatasetPickerClassNames = {
    ...DEFAULT_CLASS_NAMES,
    ...classNames,
    ...hostClassNames,
  };

  const showTypeFilter = typeOptions.length > 0;

  const filteredItems = useMemo(
    () => filterDatasetPickerItems(items, descriptionQuery, showTypeFilter ? typeFilter : ""),
    [descriptionQuery, items, showTypeFilter, typeFilter]
  );

  const selectedItem = useMemo(() => findDatasetPickerItem(items, value), [items, value]);

  const closePicker = useCallback(() => {
    setPickerOpen(false);
    setDescriptionQuery("");
    setTypeFilter("");
  }, []);

  const openPicker = useCallback(() => {
    if (disabled) return;
    setDescriptionQuery("");
    setTypeFilter("");
    setPickerOpen(true);
  }, [disabled]);

  const pickItem = useCallback(
    (nextId: string) => {
      onChange(nextId);
      closePicker();
    },
    [closePicker, onChange]
  );

  useEffect(() => {
    if (!pickerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closePicker();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closePicker, pickerOpen]);

  useEffect(() => {
    if (!pickerOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (rootRef.current?.contains(target)) return;
      closePicker();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [closePicker, pickerOpen]);

  const unknownLabel =
    labels.unknownSelectionLabel?.({ id: value.trim().slice(0, 8) }) ?? value.trim();

  return (
    <>
      <div className={styles.field}>
        <FieldLabelWithHint
          label={fieldLabel}
          hint={labelHint}
          infoAria={labelInfoAria}
          hostClassNames={{
            label: styles.fieldLabel,
            labelRow: styles.fieldLabelRow,
            infoHint: styles.fieldLabelInfoHint,
            infoBtn: styles.fieldLabelInfoBtn,
            infoIcon: styles.fieldLabelInfoIcon,
            infoTooltip: styles.fieldLabelInfoTooltip,
          }}
        />
        <div className={styles.trigger}>
          <span className={styles.triggerValue}>
            {selectedItem ? (
              <>
                {showLeadingVisual ? (
                  <DatasetPickerAvatar
                    label={selectedItem.label}
                    imageUrl={selectedItem.imageUrl}
                    size={28}
                    styles={styles}
                  />
                ) : null}
                <span className={styles.triggerLabel}>
                  {selectedItem.label.trim() || selectedItem.id}
                </span>
              </>
            ) : (
              <span className={`${styles.triggerLabel} ${styles.triggerLabelEmpty}`}>
                {value.trim().length > 0 ? unknownLabel : labels.notSelectedLabel}
              </span>
            )}
          </span>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            disabled={disabled}
            onClick={openPicker}
          >
            {labels.chooseButton}
          </button>
        </div>
        {hasVisibleHint(hint) ? <span className={styles.fieldHint}>{hint}</span> : null}
      </div>

      {pickerOpen && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={rootRef}
              className={styles.dialog}
              role="dialog"
              aria-modal="true"
              aria-label={labels.dialogAriaLabel({ fieldLabel })}
              onPointerDown={(event) => {
                if (event.target === event.currentTarget) closePicker();
              }}
            >
              <div
                className={styles.dialogCard}
                onPointerDown={(event) => event.stopPropagation()}
              >
                <h2 className={styles.dialogTitle}>{labels.dialogTitle}</h2>
                {hasVisibleHint(labels.hint) ? (
                  <p className={styles.dialogHint}>{labels.hint}</p>
                ) : null}
                <div className={styles.filters}>
                  {showTypeFilter ? (
                    <label className="field">
                      <span className="field__label">
                        {labels.typeFilterLabel ?? "Type"}
                      </span>
                      <select
                        className="field__input"
                        value={typeFilter}
                        aria-label={labels.typeFilterAria ?? labels.typeFilterLabel ?? "Type"}
                        onChange={(event) => setTypeFilter(event.target.value)}
                      >
                        <option value="">{labels.allTypesLabel ?? "All types"}</option>
                        {typeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : null}
                  <label className="field">
                    <span className="field__label">{labels.descriptionFilterLabel}</span>
                    <input
                      className="field__input"
                      value={descriptionQuery}
                      onChange={(event) => setDescriptionQuery(event.target.value)}
                      placeholder={labels.descriptionFilterPlaceholder}
                      autoFocus
                      aria-controls={listId}
                    />
                  </label>
                </div>
                <div
                  id={listId}
                  className={styles.list}
                  role="listbox"
                  aria-label={labels.listAriaLabel}
                >
                  {allowEmpty ? (
                    <button
                      type="button"
                      role="option"
                      className={styles.row}
                      aria-selected={value.trim() === ""}
                      onClick={() => pickItem("")}
                    >
                      {labels.emptySelectionLabel}
                    </button>
                  ) : null}
                  {filteredItems.length === 0 ? (
                    <p className={styles.empty}>{labels.noMatchesLabel}</p>
                  ) : (
                    filteredItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        role="option"
                        className={styles.row}
                        aria-selected={value === item.id}
                        onClick={() => pickItem(item.id)}
                      >
                        {showLeadingVisual ? (
                          <DatasetPickerAvatar
                            label={item.label}
                            imageUrl={item.imageUrl}
                            styles={styles}
                          />
                        ) : null}
                        <span className={styles.rowLabel}>
                          {formatDatasetPickerRowLabel(item)}
                        </span>
                      </button>
                    ))
                  )}
                </div>
                <div className={styles.actions}>
                  <button type="button" className="btn btn--ghost" onClick={closePicker}>
                    {labels.cancelLabel}
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
