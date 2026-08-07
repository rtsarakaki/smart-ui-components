import { describe, expect, it, vi } from "vitest";
import { copyMarkdownToClipboard, downloadMarkdownFile } from "./markdownExport.js";

describe("markdownExport", () => {
  it("copies markdown to the clipboard when supported", async () => {
    const writeText = vi.fn(async () => undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    await expect(copyMarkdownToClipboard("# Title")).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("# Title");
  });

  it("returns false when clipboard API is unavailable", async () => {
    Object.assign(navigator, { clipboard: undefined });
    await expect(copyMarkdownToClipboard("# Title")).resolves.toBe(false);
  });

  it("downloads markdown as a file", () => {
    const click = vi.fn();
    const anchor = { href: "", download: "", click } as unknown as HTMLAnchorElement;
    const createElement = vi.spyOn(document, "createElement").mockReturnValue(anchor);
    const createObjectURL = vi.fn(() => "blob:test");
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("URL", {
      createObjectURL,
      revokeObjectURL,
    });

    downloadMarkdownFile("notes.md", "# Notes");

    expect(createElement).toHaveBeenCalledWith("a");
    expect(anchor.download).toBe("notes.md");
    expect(createObjectURL).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:test");

    createElement.mockRestore();
    vi.unstubAllGlobals();
  });
});
