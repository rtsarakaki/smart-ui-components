import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MarkdownEditor } from "./MarkdownEditor.js";

afterEach(() => {
  cleanup();
});

const writeText = vi.fn(async () => undefined);
Object.assign(navigator, { clipboard: { writeText } });

const baseProps = {
  value: "Hello **world**",
  onChange: vi.fn(),
  label: <span>Description</span>,
  fieldAriaLabel: "Description",
  previewEmptyMessage: "Nothing to preview",
  editModeAria: "Edit",
  previewModeAria: "Preview",
  expandLabel: "Expand editor",
  collapseLabel: "Show all fields",
  renderPreview: (content: string) => <div data-testid="markdown-preview">{content}</div>,
  exportActions: {
    copyLabel: "Copy markdown",
    downloadLabel: "Download .md",
    downloadFilename: "notes.md",
    onCopySuccess: vi.fn(),
    onCopyError: vi.fn(),
  },
};

describe("MarkdownEditor", () => {
  it("opens in preview when content exists and switches to edit", () => {
    render(<MarkdownEditor {...baseProps} />);

    expect(screen.getByTestId("markdown-preview").textContent).toBe("Hello **world**");
    expect(screen.queryByRole("textbox", { name: "Description" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(screen.getByRole("textbox", { name: "Description" })).toBeTruthy();
  });

  it("opens in edit when content is empty", () => {
    render(<MarkdownEditor {...baseProps} value="" resetKey="empty" />);

    expect(screen.getByRole("textbox", { name: "Description" })).toBeTruthy();
    expect(screen.queryByTestId("markdown-preview")).toBeNull();
  });

  it("switches between edit and preview modes", () => {
    render(<MarkdownEditor {...baseProps} initialMode="edit" resetKey="forced-edit" />);

    expect(screen.getByRole("textbox", { name: "Description" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Preview" }));
    expect(screen.getByTestId("markdown-preview").textContent).toBe("Hello **world**");
    expect(screen.queryByRole("textbox", { name: "Description" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(screen.getByRole("textbox", { name: "Description" })).toBeTruthy();
  });

  it("renders preview only when readOnly", () => {
    render(<MarkdownEditor {...baseProps} readOnly />);

    expect(screen.getByTestId("markdown-preview").textContent).toBe("Hello **world**");
    expect(screen.queryByRole("button", { name: "Preview" })).toBeNull();
    expect(screen.queryByRole("textbox", { name: "Description" })).toBeNull();
    expect(screen.getByRole("button", { name: "Copy markdown" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Download .md" })).toBeTruthy();
  });

  it("copies markdown from the toolbar", async () => {
    render(<MarkdownEditor {...baseProps} readOnly />);

    fireEvent.click(screen.getByRole("button", { name: "Copy markdown" }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("Hello **world**");
      expect(baseProps.exportActions.onCopySuccess).toHaveBeenCalled();
    });
  });

  it("toggles expanded state from the toolbar", () => {
    const onExpandedChange = vi.fn();
    render(
      <MarkdownEditor {...baseProps} expanded={false} onExpandedChange={onExpandedChange} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Expand editor" }));
    expect(onExpandedChange).toHaveBeenCalledWith(true);
  });

  it("shows contextual hints for edit and preview modes", () => {
    render(
      <MarkdownEditor
        {...baseProps}
        editHint="Edit hint"
        previewHint="Preview hint"
        initialMode="edit"
        resetKey="contextual-hints"
      />
    );

    expect(screen.getByText("Edit hint")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Preview" }));
    expect(screen.getByText("Preview hint")).toBeTruthy();
    expect(screen.queryByText("Edit hint")).toBeNull();
  });

  it("hides hint when none is provided", () => {
    const { container } = render(<MarkdownEditor {...baseProps} />);
    expect(container.querySelector(".suc-markdown-editor__hint")).toBeNull();
  });
});
