import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Breadcrumb } from "@/components/breadcrumb";
import { CheckoutForm } from "@/components/checkout-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Finaliser la commande",
  description: "Renseignez la livraison et payez par Mobile Money.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/connexion?callbackUrl=/paiement");
  }

  return (
    <div className="container page">
      <Breadcrumb items={[{ label: "Panier", href: "/panier" }, { label: "Commande" }]} />

      <header className="page-header page-header--compact">
        <p className="eyebrow">Commande</p>
        <h1>Finaliser la commande</h1>
        <p className="page-header__lead">
          Vérifiez vos coordonnées, puis validez le paiement sur le guichet
          Mobile Money.
        </p>
      </header>

      <ol className="checkout-steps" aria-label="Étapes de la commande">
        <li className="is-complete">
          <span>1</span> Panier
        </li>
        <li className="is-current">
          <span>2</span> Livraison
        </li>
        <li>
          <span>3</span> Paiement
        </li>
      </ol>

      <CheckoutForm
        defaultEmail={session.user.email ?? ""}
        defaultName={session.user.name ?? ""}
      />
    </div>
  );
}
