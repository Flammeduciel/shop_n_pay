export function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export function normalizePhone(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const digits = value.replace(/\D/g, "");
  if (digits.length === 9) return `237${digits}`;
  if (digits.length === 12 && digits.startsWith("237")) return digits;
  if (digits.length === 13 && digits.startsWith("00237")) return digits.slice(2);

  return null;
}

export function isCartPayload(value: unknown): value is { slug: string; quantity: number }[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 20) return false;

  return value.every(
    (line) =>
      line &&
      typeof line === "object" &&
      typeof (line as { slug?: unknown }).slug === "string" &&
      typeof (line as { quantity?: unknown }).quantity === "number",
  );
}
