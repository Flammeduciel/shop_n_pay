import { cookies } from "next/headers";
import type { OrderStatus } from "./status";

export type OrderItem = {
  slug: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

export type Customer = {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  address: string;
  note: string;
};

export type PendingOrder = {
  ref: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: Customer;
};

export type OrderRecord = PendingOrder & {
  status: OrderStatus;
};

const ORDERS_COOKIE = "shoppay_orders";
const PENDING_COOKIE = "shoppay_pending";
const ORDERS_MAX_AGE = 60 * 60 * 24 * 30;
const PENDING_MAX_AGE = 60 * 30;
const MAX_ORDERS = 4;

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

function encode(value: unknown): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

function decode<T>(value: string | undefined): T | null {
  if (!value) return null;

  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

export async function getOrders(): Promise<OrderRecord[]> {
  const store = await cookies();
  const orders = decode<OrderRecord[]>(store.get(ORDERS_COOKIE)?.value);
  if (!Array.isArray(orders)) return [];

  return orders.filter(
    (order) =>
      order && typeof order.ref === "string" && Array.isArray(order.items),
  );
}

export async function saveOrder(order: OrderRecord): Promise<void> {
  const store = await cookies();
  const existing = await getOrders();
  const next = [order, ...existing.filter((item) => item.ref !== order.ref)].slice(
    0,
    MAX_ORDERS,
  );

  store.set(ORDERS_COOKIE, encode(next), cookieOptions(ORDERS_MAX_AGE));
}

export async function getPendingOrder(): Promise<PendingOrder | null> {
  const store = await cookies();
  return decode<PendingOrder>(store.get(PENDING_COOKIE)?.value);
}

export async function setPendingOrder(order: PendingOrder): Promise<void> {
  const store = await cookies();
  store.set(PENDING_COOKIE, encode(order), cookieOptions(PENDING_MAX_AGE));
}

export async function clearPendingOrder(): Promise<void> {
  const store = await cookies();
  store.set(PENDING_COOKIE, "", cookieOptions(0));
}
