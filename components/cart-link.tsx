"use client";

import Link from "next/link";
import { useCart } from "./cart-provider";
import { CartIcon } from "./icons";

export function CartLink() {
  const { itemCount, ready } = useCart();
  const label =
    ready && itemCount > 0
      ? `Panier, ${itemCount} ${itemCount > 1 ? "articles" : "article"}`
      : "Panier";

  return (
    <Link href="/panier" className="cart-link" aria-label={label}>
      <span className="cart-link__icon">
        <CartIcon />
        {ready && itemCount > 0 ? (
          <span className="cart-count" aria-hidden="true">
            {itemCount}
          </span>
        ) : null}
      </span>
      <span className="cart-link__label">Panier</span>
    </Link>
  );
}
