export type OrderStatus = "paye" | "echec" | "annule" | "attente";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  paye: "Paiement confirmé",
  echec: "Paiement échoué",
  annule: "Paiement annulé",
  attente: "En attente",
};

export const ORDER_STATUS_TONES: Record<OrderStatus, "success" | "danger" | "warning"> = {
  paye: "success",
  echec: "danger",
  annule: "danger",
  attente: "warning",
};

export function isOrderStatus(value: unknown): value is OrderStatus {
  return value === "paye" || value === "echec" || value === "annule" || value === "attente";
}
