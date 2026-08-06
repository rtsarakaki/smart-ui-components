export function resolveRowFlag<T>(
  value: boolean | ((row: T) => boolean) | undefined,
  row: T,
  defaultValue: boolean
): boolean {
  if (value === undefined) return defaultValue;
  if (typeof value === "function") return value(row);
  return value;
}

export function resolveRowText<T>(
  value: string | ((row: T) => string) | undefined,
  row: T,
  fallback = ""
): string {
  if (value === undefined) return fallback;
  if (typeof value === "function") return value(row);
  return value;
}
