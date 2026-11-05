"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { resolveCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { useCart } from "./cart-provider";
import { EmptyState } from "./empty-state";
import { LockIcon } from "./icons";

type CheckoutFormProps = {
  defaultEmail: string;
  defaultName: string;
};

export function CheckoutForm({ defaultEmail, defaultName }: CheckoutFormProps) {
  const { lines, ready } = useCart();
  const totals = resolveCart(lines);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const nameParts = defaultName.trim().split(/\s+/);
  const defaultFirstName = nameParts[0] ?? "";
  const defaultLastName = nameParts.slice(1).join(" ");

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
        title="Aucun article à commander"
        description="Ajoutez au moins un produit au panier avant de passer la commande."
        action={
          <Link href="/catalogue" className="button button--accent">
            Voir le catalogue
          </Link>
        }
      />
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const customer = {
      firstName: String(formData.get("firstName") ?? "").trim(),
      lastName: String(formData.get("lastName") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim(),
      note: String(formData.get("note") ?? "").trim(),
    };

    if (!customer.firstName || !customer.lastName || !customer.phone || !customer.address) {
      setError("Complétez les champs obligatoires avant de continuer.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/paiement/initier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((line) => ({ slug: line.slug, quantity: line.quantity })),
          customer,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { paymentUrl?: string; error?: string }
        | null;

      if (response.status === 401) {
        window.location.assign("/connexion?callbackUrl=/paiement");
        return;
      }

      if (!response.ok || !payload?.paymentUrl) {
        setError(payload?.error ?? "Le paiement n'a pas pu être initialisé.");
        setSubmitting(false);
        return;
      }

      window.location.assign(payload.paymentUrl);
    } catch {
      setError("La connexion au service de paiement a échoué. Réessayez.");
      setSubmitting(false);
    }
  }

  return (
    <div className="checkout-layout">
      <form className="form checkout-form" onSubmit={handleSubmit}>
        <section className="form-section" aria-labelledby="coordonnees-title">
          <h2 id="coordonnees-title" className="form-section__title">
            Coordonnées
          </h2>
          <p className="form-section__intro">
            Ces informations servent uniquement à préparer et livrer la commande.
          </p>

          <div className="form-row">
            <div className="field">
              <label htmlFor="firstName" className="field-label">
                Prénom
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                className="field-input"
                autoComplete="given-name"
                defaultValue={defaultFirstName}
                required
                maxLength={60}
              />
            </div>
            <div className="field">
              <label htmlFor="lastName" className="field-label">
                Nom
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className="field-input"
                autoComplete="family-name"
                defaultValue={defaultLastName}
                required
                maxLength={60}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="email" className="field-label">
              Adresse e-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="field-input"
              autoComplete="email"
              defaultValue={defaultEmail}
              required
              readOnly
            />
            <p className="field-hint">Adresse liée au compte connecté.</p>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="phone" className="field-label">
                Téléphone Mobile Money
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="field-input"
                autoComplete="tel"
                inputMode="tel"
                placeholder="6 90 00 00 00"
                pattern="[0-9+\s().-]{9,20}"
                aria-describedby="phone-hint"
                required
              />
              <p id="phone-hint" className="field-hint">
                Numéro camerounais, avec ou sans l'indicatif 237.
              </p>
            </div>
            <div className="field">
              <label htmlFor="city" className="field-label">
                Ville
              </label>
              <select
                id="city"
                name="city"
                className="field-input field-input--select"
                defaultValue="Douala"
                required
              >
                <option value="Douala">Douala</option>
                <option value="Yaoundé">Yaoundé</option>
                <option value="Bafoussam">Bafoussam</option>
                <option value="Garoua">Garoua</option>
                <option value="Bertoua">Bertoua</option>
                <option value="Autre">Autre ville</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="address" className="field-label">
              Adresse de livraison
            </label>
            <input
              id="address"
              name="address"
              type="text"
              className="field-input"
              autoComplete="street-address"
              placeholder="Quartier, rue, point de repère"
              required
              maxLength={160}
            />
          </div>

          <div className="field">
            <label htmlFor="note" className="field-label">
              Précisions (facultatif)
            </label>
            <textarea
              id="note"
              name="note"
              className="field-input field-input--textarea"
              rows={3}
              maxLength={500}
              placeholder="Un détail utile pour la livraison."
            />
          </div>
        </section>

        <section className="form-section" aria-labelledby="paiement-title">
          <h2 id="paiement-title" className="form-section__title">
            Paiement
          </h2>
          <div className="payment-method">
            <LockIcon size={22} />
            <div>
              <p className="payment-method__title">Mobile Money</p>
              <p className="payment-method__text">
                MTN Mobile Money, Orange Money et autres opérateurs pris en charge
                par Monetbil. Vous validerez le paiement sur le guichet sécurisé.
              </p>
            </div>
          </div>
        </section>

        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="button button--accent button--block"
          disabled={submitting}
          aria-busy={submitting}
        >
          {submitting
            ? "Redirection vers Mobile Money…"
            : `Payer ${formatPrice(totals.total)}`}
        </button>
      </form>

      <aside className="summary" aria-label="Récapitulatif de la commande">
        <h2 className="summary__title">Votre commande</h2>

        <ul className="summary__items">
          {totals.lines.map((line) => (
            <li key={line.product.slug}>
              <span>
                {line.product.name} <span className="summary__qty">× {line.quantity}</span>
              </span>
              <span>{formatPrice(line.lineTotal)}</span>
            </li>
          ))}
        </ul>

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

        <Link href="/panier" className="link-arrow summary__edit">
          Modifier le panier
        </Link>
      </aside>
    </div>
  );
}
