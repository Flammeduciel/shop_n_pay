export function safeCallbackPath(value: string | null | undefined): string {
  if (!value) return "/compte";
  if (!value.startsWith("/") || value.startsWith("//")) return "/compte";
  if (value.includes("\\")) return "/compte";

  return value;
}
