import { type Product, products } from "./products";

export const SHIPPING_FEE = 2500;
export const FREE_SHIPPING_THRESHOLD = 50000;
export const MAX_QUANTITY_PER_LINE = 10;

export type CartInput = {
  slug: string;
  quantity: number;
};

export type ResolvedCartLine = {
  product: Product;
  quantity: number;
  lineTotal: number;
};

export type CartTotals = {
  lines: ResolvedCartLine[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  freeShippingRemaining: number;
};

export function clampQuantity(value: unknown): number {
  const quantity = Math.trunc(Number(value));
  if (!Number.isFinite(quantity) || quantity < 1) return 1;
  return Math.min(quantity, MAX_QUANTITY_PER_LINE);
}

export function resolveCart(input: CartInput[]): CartTotals {
  const lines: ResolvedCartLine[] = [];

  for (const line of input) {
    if (!line || typeof line.slug !== "string") continue;

    const product = products.find((item) => item.slug === line.slug);
    if (!product) continue;

    const quantity = clampQuantity(line.quantity);
    const existing = lines.find((item) => item.product.slug === product.slug);

    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, MAX_QUANTITY_PER_LINE);
      existing.lineTotal = existing.product.price * existing.quantity;
    } else {
      lines.push({
        product,
        quantity,
        lineTotal: product.price * quantity,
      });
    }
  }

  const itemCount = lines.reduce((total, line) => total + line.quantity, 0);
  const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0);
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return {
    lines,
    itemCount,
    subtotal,
    shipping,
    total: subtotal + shipping,
    freeShippingRemaining,
  };
}
