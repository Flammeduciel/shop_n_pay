"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "./cart-provider";

type AddToCartProps = {
  slug: string;
  name: string;
  quantity?: number;
  disabled?: boolean;
  small?: boolean;
};

export function AddToCart({
  slug,
  name,
  quantity = 1,
  disabled = false,
  small = false,
}: AddToCartProps) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function handleClick() {
    add(slug, quantity);
    setAdded(true);

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button
      type="button"
      className={`button button--accent${small ? " button--small" : ""}`}
      onClick={handleClick}
      disabled={disabled}
      aria-label={disabled ? `${name} est épuisé` : `Ajouter ${name} au panier`}
    >
      {disabled ? "Épuisé" : added ? "Ajouté" : "Ajouter"}
      <span className="visually-hidden" role="status">
        {added ? `${name} a été ajouté au panier.` : ""}
      </span>
    </button>
  );
}
