"use client";

import Image from "next/image";
import Link from "next/link";
import { FREE_SHIPPING_THRESHOLD, resolveCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { getCategoryName } from "@/lib/products";
import { useCart } from "./cart-provider";
import { EmptyState } from "./empty-state";
import { LockIcon, TrashIcon } from "./icons";
import { QuantityStepper } from "./quantity-stepper";

export function CartView() {
  const { lines, ready, setQuantity, remove } = useCart();
  const totals = resolveCart(lines);

  if (!ready) {
    return (
      <p className="cart-loading" aria-busy="true">
        Chargement du panier…
      </p>
    );
  }

  if (totals.lines.length === 0) {
    return (
      <EmptyState
        title="Votre panier est vide"
        description="Parcourez le catalogue et ajoutez les articles qui vous intéressent."
        action={
          <Link href="/catalogue" className="button button--accent">
            Voir le catalogue
          </Link>
        }
      />
    );
  }

  return (
    <div className="cart-layout">
      <div className="cart-main">
        <ul className="cart-lines">
          {totals.lines.map((line) => (
            <li key={line.product.slug} className="cart-line">
              <Link
                href={`/produit/${line.product.slug}`}
                className="cart-line__media"
                tabIndex={-1}
                aria-hidden="true"
              >
                <Image
                  src={line.product.image}
                  alt={line.product.imageAlt}
                  width={160}
                  height={160}
                  sizes="96px"
                />
              </Link>

              <div className="cart-line__content">
                <div>
                  <p className="cart-line__category">
                    {getCategoryName(line.product.category)}
                  </p>
                  <h2 className="cart-line__title">
                    <Link href={`/produit/${line.product.slug}`}>
                      {line.product.name}
                    </Link>
                  </h2>
                  <p className="cart-line__unit">{formatPrice(line.product.price)} l'unité</p>
                </div>

                <div className="cart-line__controls">
                  <QuantityStepper
                    value={line.quantity}
                    onChange={(quantity) => setQuantity(line.product.slug, quantity)}
                    label={line.product.name}
                  />
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => remove(line.product.slug)}
                  >
                    <TrashIcon size={16} />
                    Retirer
                  </button>
                </div>
              </div>

              <p className="cart-line__total">{formatPrice(line.lineTotal)}</p>
            </li>
          ))}
        </ul>

        <div className="cart-continue">
          <Link href="/catalogue" className="link-arrow">
            Continuer les achats
          </Link>
        </div>
      </div>

      <aside className="summary" aria-label="Résumé du panier">
        <h2 className="summary__title">Résumé</h2>

        <dl className="summary__rows">
          <div>
            <dt>Sous-total</dt>
            <dd>{formatPrice(totals.subtotal)}</dd>
          </div>
          <div>
            <dt>Livraison</dt>
            <dd>{totals.shipping === 0 ? "Offerte" : formatPrice(totals.shipping)}</dd>
          </div>
          <div className="summary__total">
            <dt>Total</dt>
            <dd>{formatPrice(totals.total)}</dd>
          </div>
        </dl>

        {totals.freeShippingRemaining > 0 ? (
          <div className="shipping-note">
            <p>
              Encore {formatPrice(totals.freeShippingRemaining)} pour la livraison
              offerte.
            </p>
            <progress
              className="shipping-progress"
              max={FREE_SHIPPING_THRESHOLD}
              value={totals.subtotal}
              aria-label="Progression vers la livraison offerte"
            >
              {totals.subtotal} sur {FREE_SHIPPING_THRESHOLD}
            </progress>
          </div>
        ) : null}

        <Link href="/paiement" className="button button--accent button--block">
          Passer la commande
        </Link>

        <p className="summary__note">
          <LockIcon size={16} />
          Paiement par Mobile Money. Vous serez redirigé vers le guichet Mobile Money.
        </p>
      </aside>
    </div>
  );
}
