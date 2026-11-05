"use client";

import { useState } from "react";
import { MAX_QUANTITY_PER_LINE } from "@/lib/cart";
import { useCart } from "./cart-provider";
import { CheckIcon, MinusIcon, PlusIcon } from "./icons";

type ProductPurchaseProps = {
  slug: string;
  name: string;
  stock: number;
};

export function ProductPurchase({ slug, name, stock }: ProductPurchaseProps) {
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const max = Math.min(stock, MAX_QUANTITY_PER_LINE);
  const unavailable = stock < 1;

  function handleAdd() {
    add(slug, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="purchase">
      <div className="purchase__quantity">
        <span id="quantite-label" className="field-label">
          Quantité
        </span>
        <div className="stepper" role="group" aria-labelledby="quantite-label">
          <button
            type="button"
            className="stepper__button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            disabled={quantity <= 1}
            aria-label="Diminuer la quantité"
          >
            <MinusIcon size={16} />
          </button>
          <span className="stepper__value" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            className="stepper__button"
            onClick={() => setQuantity((value) => Math.min(max, value + 1))}
            disabled={quantity >= max}
            aria-label="Augmenter la quantité"
          >
            <PlusIcon size={16} />
          </button>
        </div>
      </div>

      <button
        type="button"
        className="button button--accent purchase__button"
        onClick={handleAdd}
        disabled={unavailable}
      >
        {unavailable ? "Épuisé" : added ? "Ajouté au panier" : "Ajouter au panier"}
        {added ? <CheckIcon size={18} /> : null}
      </button>

      <p className={`stock ${stock <= 6 ? "stock--low" : ""}`}>
        {unavailable
          ? "Produit momentanément indisponible."
          : stock <= 6
            ? `Dernières pièces : ${stock} en stock.`
            : "En stock, expédié sous 24 heures."}
      </p>

      <span className="visually-hidden" role="status" aria-live="polite">
        {added ? `${name} a été ajouté au panier.` : ""}
      </span>
    </div>
  );
}
