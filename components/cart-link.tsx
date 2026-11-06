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
    <Link href="/panier" className="icon-button cart-button" aria-label={label}>
      <CartIcon />
      <span>Panier</span>
      {ready && itemCount > 0 ? (
        <span className="cart-count" aria-hidden="true">
          {itemCount}
        </span>
      ) : null}
    </Link>
  );
}
