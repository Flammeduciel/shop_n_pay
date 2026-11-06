"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clampQuantity,
  MAX_QUANTITY_PER_LINE,
  type CartInput,
} from "@/lib/cart";

const STORAGE_KEY = "shoppay.cart.v1";

type CartContextValue = {
  ready: boolean;
  lines: CartInput[];
  itemCount: number;
  add: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartInput[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (line): line is CartInput =>
        Boolean(line) &&
        typeof line === "object" &&
        typeof (line as CartInput).slug === "string" &&
        typeof (line as CartInput).quantity === "number",
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartInput[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLines(readStoredCart());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Le stockage local peut être indisponible en navigation privée.
    }
  }, [lines, ready]);

  const add = useCallback((slug: string, quantity = 1) => {
    setLines((current) => {
      const existing = current.find((line) => line.slug === slug);

      if (existing) {
        return current.map((line) =>
          line.slug === slug
            ? {
                ...line,
                quantity: Math.min(
                  line.quantity + clampQuantity(quantity),
                  MAX_QUANTITY_PER_LINE,
                ),
              }
            : line,
        );
      }

      return [...current, { slug, quantity: clampQuantity(quantity) }];
    });
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setLines((current) =>
      current.map((line) =>
        line.slug === slug
          ? { ...line, quantity: clampQuantity(quantity) }
          : line,
      ),
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((current) => current.filter((line) => line.slug !== slug));
  }, []);

  const clear = useCallback(() => {
    setLines([]);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = lines.reduce((total, line) => total + line.quantity, 0);

    return { ready, lines, itemCount, add, setQuantity, remove, clear };
  }, [ready, lines, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé dans un CartProvider.");
  }

  return context;
}
