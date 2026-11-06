import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { CartView } from "@/components/cart-view";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Panier",
  description: "Vérifiez votre panier avant de passer au paiement Mobile Money.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <div className="container page">
      <Breadcrumb items={[{ label: "Panier" }]} />

      <header className="page-header page-header--compact">
        <p className="eyebrow">Panier</p>
        <h1>Votre sélection</h1>
        <p className="page-header__lead">
          La livraison est offerte dès 50 000 FCFA. Vous pouvez modifier les
          quantités avant le paiement.
        </p>
      </header>

      <CartView />
    </div>
  );
}
