"use client";

import { useId, type ReactElement } from "react";

export type FieldLabelWithHintClassNames = {
  label: string;
  labelRow: string;
  infoHint: string;
  infoBtn: string;
  infoIcon: string;
  infoTooltip: string;
};

const DEFAULT_CLASS_NAMES: FieldLabelWithHintClassNames = {
  label: "suc-field-label",
  labelRow: "suc-field-label-row",
  infoHint: "suc-field-info-hint",
  infoBtn: "suc-field-info-btn",
  infoIcon: "suc-field-info-icon",
  infoTooltip: "suc-field-info-tooltip",
};

export type FieldLabelWithHintProps = {
  label: string;
  /** When empty/absent, only the plain label is shown. */
  hint?: string;
  infoAria?: string;
  classNames?: Partial<FieldLabelWithHintClassNames>;
  hostClassNames?: Partial<FieldLabelWithHintClassNames>;
};

function InfoIcon({ className }: { className: string }): ReactElement {
  return (
    <svg className={className} viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM11 11h2v7h-2v-7z"
        fill="currentColor"
      />
    </svg>
  );
}

export function FieldLabelWithHint({
  label,
  hint,
  infoAria = "More information",
  classNames,
  hostClassNames,
}: FieldLabelWithHintProps): ReactElement {
  const tooltipId = useId();
  const styles: FieldLabelWithHintClassNames = {
    ...DEFAULT_CLASS_NAMES,
    ...classNames,
    ...hostClassNames,
  };
  const trimmedHint = hint?.trim() ?? "";

  if (trimmedHint.length === 0) {
    return <span className={styles.label}>{label}</span>;
  }

  return (
    <span className={styles.labelRow}>
      <span className={styles.label}>{label}</span>
      <span className={styles.infoHint}>
        <button
          type="button"
          className={styles.infoBtn}
          aria-label={infoAria}
          aria-describedby={tooltipId}
        >
          <InfoIcon className={styles.infoIcon} />
        </button>
        <span id={tooltipId} role="tooltip" className={styles.infoTooltip}>
          {trimmedHint}
        </span>
      </span>
    </span>
  );
}
