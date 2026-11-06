import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Alert } from "@/components/alert";
import { Breadcrumb } from "@/components/breadcrumb";
import { ClearCart } from "@/components/clear-cart";
import { EmptyState } from "@/components/empty-state";
import { formatDate, formatPrice } from "@/lib/format";
import { getOrders, getPendingOrder, type OrderRecord } from "@/lib/orders";
import {
  isOrderStatus,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_TONES,
  type OrderStatus,
} from "@/lib/status";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Confirmation de commande",
  robots: { index: false, follow: false },
};

type ConfirmationPageProps = {
  searchParams: Promise<{ ref?: string; statut?: string }>;
};

const statusMessages: Record<OrderStatus, string> = {
  paye: "Le paiement est confirmé et la commande est enregistrée. Nous préparons la livraison.",
  echec: "Le paiement n'a pas abouti. Aucun montant n'a été débité par la boutique.",
  annule: "Le paiement a été annulé. Vous pouvez reprendre la commande depuis le panier.",
  attente: "Le guichet n'a pas encore confirmé le paiement. Actualisez la page dans quelques instants.",
};

export default async function ConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/connexion?callbackUrl=/compte");
  }

  const params = await searchParams;
  const reference = (params.ref ?? "").trim();
  const orders = await getOrders();
  const savedOrder = orders.find((order) => order.ref === reference);
  const pending = savedOrder ? null : await getPendingOrder();

  let order: OrderRecord | null = savedOrder ?? null;

  if (!order && pending && pending.ref === reference) {
    order = {
      ...pending,
      status: isOrderStatus(params.statut) ? params.statut : "attente",
    };
  }

  if (!order) {
    return (
      <div className="container page page--narrow">
        <Breadcrumb items={[{ label: "Confirmation" }]} />
        <EmptyState
          title="Commande introuvable"
          description="Cette référence ne correspond à aucune commande enregistrée dans ce navigateur."
          action={
            <Link href="/catalogue" className="button button--accent">
              Retour au catalogue
            </Link>
          }
        />
      </div>
    );
  }

  const status = order.status;
  const tone = ORDER_STATUS_TONES[status];

  return (
    <div className="container page page--narrow">
      <Breadcrumb items={[{ label: "Confirmation" }]} />

      {status === "paye" ? <ClearCart /> : null}

      <header className="page-header page-header--compact">
        <p className="eyebrow">Confirmation</p>
        <h1>Commande {order.ref}</h1>
        <p className="page-header__lead">
          Un récapitulatif reste disponible dans votre compte.
        </p>
      </header>

      <Alert tone={tone} title={ORDER_STATUS_LABELS[status]}>
        {statusMessages[status]}
      </Alert>

      <section className="confirmation-card" aria-labelledby="recap-title">
        <div className="confirmation-card__header">
          <div>
            <h2 id="recap-title">Récapitulatif</h2>
            <p className="text-muted">Commande créée le {formatDate(order.createdAt)}</p>
          </div>
          <p className="confirmation-card__amount">{formatPrice(order.total)}</p>
        </div>

        <ul className="summary__items">
          {order.items.map((item) => (
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
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          <div>
            <dt>Livraison</dt>
            <dd>{order.shipping === 0 ? "Offerte" : formatPrice(order.shipping)}</dd>
          </div>
          <div className="summary__total">
            <dt>Total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>

        <div className="confirmation-card__address">
          <h3>Adresse de livraison</h3>
          <p>
            {order.customer.firstName} {order.customer.lastName}
            <br />
            {order.customer.address}, {order.customer.city}
            <br />
            {order.customer.phone}
          </p>
        </div>
      </section>

      <div className="confirmation-actions">
        <Link href="/compte" className="button button--accent">
          Voir mes commandes
        </Link>
        <Link href="/catalogue" className="button button--secondary">
          Continuer les achats
        </Link>
      </div>
    </div>
  );
}
