import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Alert } from "@/components/alert";
import { Breadcrumb } from "@/components/breadcrumb";
import { formatDate, formatPrice } from "@/lib/format";
import { isDemoMode } from "@/lib/monetbil";
import { getPendingOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Paiement de démonstration",
  robots: { index: false, follow: false },
};

type SimulationPageProps = {
  searchParams: Promise<{ ref?: string }>;
};

export default async function SimulationPage({ searchParams }: SimulationPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/connexion?callbackUrl=/paiement");
  }

  if (!isDemoMode()) {
    redirect("/paiement");
  }

  const pending = await getPendingOrder();
  if (!pending) {
    redirect("/panier");
  }

  const { ref } = await searchParams;
  if (ref && ref !== pending.ref) {
    redirect("/panier");
  }

  return (
    <div className="container page page--narrow">
      <Breadcrumb
        items={[
          { label: "Panier", href: "/panier" },
          { label: "Commande", href: "/paiement" },
          { label: "Simulation" },
        ]}
      />

      <header className="page-header page-header--compact">
        <p className="eyebrow">Mobile Money</p>
        <h1>Paiement de démonstration</h1>
        <p className="page-header__lead">
          Les clés Monetbil ne sont pas configurées. Cet écran permet de vérifier
          le parcours de commande sans mouvement d'argent.
        </p>
      </header>

      <Alert tone="warning" title="Mode démonstration">
        Aucune somme n'est débitée. Pour activer le paiement réel, renseignez
        MONETBIL_SERVICE_KEY et MONETBIL_SERVICE_SECRET, puis passez
        MONETBIL_DEMO à false.
      </Alert>

      <section className="payment-panel" aria-labelledby="simulation-recap">
        <div className="payment-panel__header">
          <div>
            <p className="eyebrow">Commande</p>
            <h2 id="simulation-recap">{pending.ref}</h2>
            <p className="text-muted">Créée le {formatDate(pending.createdAt)}</p>
          </div>
          <p className="payment-panel__amount">{formatPrice(pending.total)}</p>
        </div>

        <ul className="summary__items">
          {pending.items.map((item) => (
            <li key={item.slug}>
              <span>
                {item.name} <span className="summary__qty">× {item.quantity}</span>
              </span>
              <span>{formatPrice(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <dl className="summary__rows">
          <div>
            <dt>Sous-total</dt>
            <dd>{formatPrice(pending.subtotal)}</dd>
          </div>
          <div>
            <dt>Livraison</dt>
            <dd>{pending.shipping === 0 ? "Offerte" : formatPrice(pending.shipping)}</dd>
          </div>
          <div className="summary__total">
            <dt>Total</dt>
            <dd>{formatPrice(pending.total)}</dd>
          </div>
        </dl>

        <div className="payment-panel__address">
          <h3>Livraison</h3>
          <p>
            {pending.customer.firstName} {pending.customer.lastName}
            <br />
            {pending.customer.address}, {pending.customer.city}
            <br />
            {pending.customer.phone}
          </p>
        </div>

        <form action="/api/paiement/simulation" method="post" className="payment-panel__actions">
          <input type="hidden" name="ref" value={pending.ref} />
          <button
            type="submit"
            name="decision"
            value="succes"
            className="button button--accent"
          >
            Simuler un paiement réussi
          </button>
          <button
            type="submit"
            name="decision"
            value="echec"
            className="button button--secondary"
          >
            Simuler un échec
          </button>
        </form>

        <Link href="/panier" className="link-arrow">
          Revenir au panier
        </Link>
      </section>
    </div>
  );
}
