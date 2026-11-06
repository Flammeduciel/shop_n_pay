export function formatPrice(amount: number): string {
  const value = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(amount);

  return `${value} FCFA`;
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
