export type MarkdownEditorMode = "edit" | "preview";

export type MarkdownEditorExportActions = {
  copyLabel: string;
  downloadLabel: string;
  downloadFilename: string;
  onCopySuccess?: () => void;
  onCopyError?: () => void;
};

export type MarkdownEditorClassNames = {
  root: string;
  rootExpanded: string;
  head: string;
  toolbar: string;
  modeToggle: string;
  exportBtn: string;
  expandBtn: string;
  expandGlyph: string;
  textarea: string;
  preview: string;
  previewEmpty: string;
  hint: string;
  icon: string;
};

export function resolveMarkdownEditorInitialMode(
  value: string,
  readOnly = false,
  initialMode?: MarkdownEditorMode
): MarkdownEditorMode {
  if (readOnly) return "preview";
  if (initialMode) return initialMode;
  return value.trim().length > 0 ? "preview" : "edit";
}
