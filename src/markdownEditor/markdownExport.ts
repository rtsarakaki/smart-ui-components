export function downloadMarkdownFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function copyMarkdownToClipboard(content: string): Promise<boolean> {
  if (!navigator.clipboard?.writeText) return false;
  await navigator.clipboard.writeText(content);
  return true;
}
