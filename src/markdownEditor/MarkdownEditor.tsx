"use client";

import { useEffect, useId, useState, type ReactElement, type ReactNode } from "react";
import {
  resolveMarkdownEditorInitialMode,
  type MarkdownEditorClassNames,
  type MarkdownEditorExportActions,
  type MarkdownEditorMode,
} from "./markdownEditorModel.js";
import { copyMarkdownToClipboard, downloadMarkdownFile } from "./markdownExport.js";

const DEFAULT_CLASS_NAMES: MarkdownEditorClassNames = {
  root: "suc-markdown-editor",
  rootExpanded: "suc-markdown-editor suc-markdown-editor--expanded",
  head: "suc-markdown-editor__head",
  toolbar: "suc-markdown-editor__toolbar",
  modeToggle: "suc-markdown-editor__mode-toggle",
  exportBtn: "suc-markdown-editor__export-btn",
  expandBtn: "suc-markdown-editor__expand-btn",
  expandGlyph: "suc-markdown-editor__expand-glyph",
  textarea: "suc-markdown-editor__textarea",
  preview: "suc-markdown-editor__preview",
  previewEmpty: "suc-markdown-editor__preview-empty",
  hint: "suc-markdown-editor__hint",
  icon: "suc-markdown-editor__icon",
};

function PreviewToggleIcon({
  mode,
  iconClassName,
}: {
  mode: MarkdownEditorMode;
  iconClassName: string;
}): ReactElement {
  if (mode === "edit") {
    return (
      <svg className={iconClassName} viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 11a4 4 0 110-8 4 4 0 010 8zm0-2.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg className={iconClassName} viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        d="M16.7 3.3a1 1 0 011.4 0l2.6 2.6a1 1 0 010 1.4l-11 11L6 19l.7-3.7 11-11zM5 20h14v2H5z"
        fill="currentColor"
      />
    </svg>
  );
}

function DownloadIcon({ iconClassName }: { iconClassName: string }): ReactElement {
  return (
    <svg className={iconClassName} viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        d="M12 3v10.2l3.1-3.1 1.4 1.4L12 17l-4.5-4.5 1.4-1.4 3.1 3.1V3h2zm-7 16h14v2H5v-2z"
        fill="currentColor"
      />
    </svg>
  );
}

function CopyIcon({ iconClassName }: { iconClassName: string }): ReactElement {
  return (
    <svg className={iconClassName} viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        d="M8 7a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2h-2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2V7zm2 0v2H6v12h10v-2H10a2 2 0 01-2-2V7zm2 2h8v10h-8V9z"
        fill="currentColor"
      />
    </svg>
  );
}

function ExpandIcon({
  expanded,
  glyphClassName,
}: {
  expanded: boolean;
  glyphClassName: string;
}): ReactElement {
  return (
    <span className={glyphClassName} aria-hidden="true">
      {expanded ? "⤡" : "⤢"}
    </span>
  );
}

function resolveClassNames(
  classNames?: Partial<MarkdownEditorClassNames>,
  hostClassNames?: Partial<MarkdownEditorClassNames>
): MarkdownEditorClassNames {
  return {
    ...DEFAULT_CLASS_NAMES,
    ...classNames,
    ...hostClassNames,
  };
}

export type MarkdownEditorProps = {
  value: string;
  onChange?: (value: string) => void;
  /** Field label content (string or custom node such as a host label-with-hint). */
  label: ReactNode;
  /** Accessible name for the textarea when label is not a plain string. */
  fieldAriaLabel: string;
  previewEmptyMessage: string;
  editModeAria: string;
  previewModeAria: string;
  /** Host renders markdown preview (keeps markdown engines out of the lib). */
  renderPreview: (content: string) => ReactNode;
  hint?: ReactNode;
  editHint?: ReactNode;
  previewHint?: ReactNode;
  placeholder?: string;
  rows?: number;
  expandedRows?: number;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  expandLabel?: string;
  collapseLabel?: string;
  readOnly?: boolean;
  textareaId?: string;
  initialMode?: MarkdownEditorMode;
  resetKey?: string | number | boolean;
  exportActions?: MarkdownEditorExportActions;
  classNames?: Partial<MarkdownEditorClassNames>;
  hostClassNames?: Partial<MarkdownEditorClassNames>;
};

export function MarkdownEditor({
  value,
  onChange,
  label,
  fieldAriaLabel,
  previewEmptyMessage,
  editModeAria,
  previewModeAria,
  renderPreview,
  hint,
  editHint,
  previewHint,
  placeholder,
  rows = 4,
  expandedRows = 14,
  expanded = false,
  onExpandedChange,
  expandLabel = "Expand editor",
  collapseLabel = "Show all fields",
  readOnly = false,
  textareaId,
  initialMode,
  resetKey,
  exportActions,
  classNames,
  hostClassNames,
}: MarkdownEditorProps): ReactElement {
  const generatedId = useId();
  const resolvedTextareaId = textareaId ?? generatedId;
  const styles = resolveClassNames(classNames, hostClassNames);
  const [mode, setMode] = useState<MarkdownEditorMode>(() =>
    resolveMarkdownEditorInitialMode(value, readOnly, initialMode)
  );

  useEffect(() => {
    setMode(resolveMarkdownEditorInitialMode(value, readOnly, initialMode));
  }, [initialMode, readOnly, resetKey]);

  const textareaRows = expanded ? expandedRows : rows;
  const showModeToggle = !readOnly;
  const showExpandToggle = Boolean(onExpandedChange);
  const resolvedHint =
    mode === "edit" && !readOnly ? (editHint ?? hint) : (previewHint ?? hint);
  const rootClassName = expanded ? styles.rootExpanded : styles.root;

  const handleCopy = async (): Promise<void> => {
    if (!exportActions) return;
    const copied = await copyMarkdownToClipboard(value).catch(() => false);
    if (!copied) {
      exportActions.onCopyError?.();
      return;
    }
    exportActions.onCopySuccess?.();
  };

  const handleDownload = (): void => {
    if (!exportActions) return;
    downloadMarkdownFile(exportActions.downloadFilename, value);
  };

  return (
    <div className={rootClassName}>
      <div className={styles.head}>
        {label}
        <div className={styles.toolbar}>
          {showModeToggle ? (
            mode === "edit" ? (
              <button
                type="button"
                className={styles.modeToggle}
                onClick={() => setMode("preview")}
                aria-label={previewModeAria}
                title={previewModeAria}
              >
                <PreviewToggleIcon mode="edit" iconClassName={styles.icon} />
              </button>
            ) : (
              <button
                type="button"
                className={styles.modeToggle}
                onClick={() => setMode("edit")}
                aria-label={editModeAria}
                title={editModeAria}
              >
                <PreviewToggleIcon mode="preview" iconClassName={styles.icon} />
              </button>
            )
          ) : null}
          {exportActions ? (
            <>
              <button
                type="button"
                className={styles.exportBtn}
                onClick={() => void handleCopy()}
                aria-label={exportActions.copyLabel}
                title={exportActions.copyLabel}
              >
                <CopyIcon iconClassName={styles.icon} />
              </button>
              <button
                type="button"
                className={styles.exportBtn}
                onClick={handleDownload}
                aria-label={exportActions.downloadLabel}
                title={exportActions.downloadLabel}
              >
                <DownloadIcon iconClassName={styles.icon} />
              </button>
            </>
          ) : null}
          {showExpandToggle ? (
            <button
              type="button"
              className={styles.expandBtn}
              onClick={() => onExpandedChange?.(!expanded)}
              aria-label={expanded ? collapseLabel : expandLabel}
              title={expanded ? collapseLabel : expandLabel}
            >
              <ExpandIcon expanded={expanded} glyphClassName={styles.expandGlyph} />
            </button>
          ) : null}
        </div>
      </div>

      {mode === "edit" && !readOnly ? (
        <textarea
          id={resolvedTextareaId}
          className={styles.textarea}
          rows={textareaRows}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          aria-label={fieldAriaLabel}
        />
      ) : (
        <div className={styles.preview} aria-label={previewModeAria}>
          {value.trim().length > 0 ? (
            renderPreview(value)
          ) : (
            <p className={styles.previewEmpty}>{previewEmptyMessage}</p>
          )}
        </div>
      )}

      {resolvedHint ? <span className={styles.hint}>{resolvedHint}</span> : null}
    </div>
  );
}
