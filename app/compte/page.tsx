import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { logoutAction } from "@/app/actions/auth";
import { Breadcrumb } from "@/components/breadcrumb";
import { formatDate, formatPrice } from "@/lib/format";
import { getOrders } from "@/lib/orders";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONES } from "@/lib/status";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mon compte",
  description: "Consultez vos informations et vos dernières commandes.",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/connexion?callbackUrl=/compte");
  }

  const orders = await getOrders();
  const displayName = session.user.name ?? "Client";

  return (
    <div className="container page">
      <Breadcrumb items={[{ label: "Mon compte" }]} />

      <header className="page-header page-header--compact account-header">
        <div>
          <p className="eyebrow">Compte</p>
          <h1>Bonjour, {displayName}</h1>
          <p className="page-header__lead">
            Retrouvez vos informations et l'historique de vos commandes.
          </p>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="button button--secondary">
            Se déconnecter
          </button>
        </form>
      </header>

      <div className="account-layout">
        <div className="account-main">
          <section aria-labelledby="orders-title">
            <div className="section-heading section-heading--compact">
              <div className="section-heading__text">
                <h2 id="orders-title">Commandes récentes</h2>
              </div>
              <Link href="/catalogue" className="link-arrow">
                Nouvelle commande
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="account-empty">
                <p>Aucune commande enregistrée pour le moment.</p>
                <Link href="/catalogue" className="button button--accent">
                  Parcourir le catalogue
                </Link>
              </div>
            ) : (
              <ul className="order-list">
                {orders.map((order) => {
                  const tone = ORDER_STATUS_TONES[order.status];

                  return (
                    <li key={order.ref} className="order-row">
                      <div className="order-row__main">
                        <p className="order-row__ref">{order.ref}</p>
                        <p className="text-muted">
                          {formatDate(order.createdAt)} · {order.items.length}{" "}
                          {order.items.length > 1 ? "articles" : "article"}
                        </p>
                      </div>
                      <p className="order-row__amount">{formatPrice(order.total)}</p>
                      <span className={`badge badge--${tone}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                      <Link
                        href={`/paiement/confirmation?ref=${encodeURIComponent(order.ref)}&statut=${order.status}`}
                        className="link-arrow order-row__link"
                      >
                        Détails
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="account-panel" aria-labelledby="infos-title">
            <h2 id="infos-title">Informations du compte</h2>
            <dl className="account-details">
              <div>
                <dt>Nom</dt>
                <dd>{session.user.name ?? "Client démo"}</dd>
              </div>
              <div>
                <dt>Adresse e-mail</dt>
                <dd>{session.user.email}</dd>
              </div>
              <div>
                <dt>Rôle</dt>
                <dd>Client</dd>
              </div>
              <div>
                <dt>Session</dt>
                <dd>Connexion sécurisée, valable 30 jours</dd>
              </div>
            </dl>
            <p className="account-note">
              Ce compte est un compte de démonstration. L'historique est conservé
              dans un cookie pendant 30 jours, sur ce navigateur uniquement.
            </p>
          </section>
        </div>

        <aside className="account-aside" aria-label="Raccourcis">
          <div className="account-card">
            <h2>Accès rapides</h2>
            <ul className="footer-list">
              <li>
                <Link href="/catalogue">Catalogue</Link>
              </li>
              <li>
                <Link href="/panier">Panier</Link>
              </li>
              <li>
                <Link href="/livraison">Livraison et paiement</Link>
              </li>
            </ul>
          </div>

          <div className="account-card">
            <h2>Assistance</h2>
            <p className="text-muted">
              Une question sur une commande ? Écrivez à bonjour@shoppay.cm en
              précisant la référence.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
