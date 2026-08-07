import { describe, expect, it } from "vitest";
import { resolveMarkdownEditorInitialMode } from "./markdownEditorModel.js";

describe("resolveMarkdownEditorInitialMode", () => {
  it("forces preview when readOnly", () => {
    expect(resolveMarkdownEditorInitialMode("", true, "edit")).toBe("preview");
  });

  it("honors explicit initialMode when editable", () => {
    expect(resolveMarkdownEditorInitialMode("x", false, "edit")).toBe("edit");
    expect(resolveMarkdownEditorInitialMode("", false, "preview")).toBe("preview");
  });

  it("defaults to preview when there is content", () => {
    expect(resolveMarkdownEditorInitialMode("hello", false)).toBe("preview");
  });

  it("defaults to edit when content is empty", () => {
    expect(resolveMarkdownEditorInitialMode("   ", false)).toBe("edit");
  });
});
