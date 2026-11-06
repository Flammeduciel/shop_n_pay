import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { CatalogueBrowser } from "@/components/catalogue-browser";
import { getProducts } from "@/lib/products-server";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "Audio, mobilité, maison et bureau. Parcourez la sélection Shop&Pay et payez par Mobile Money.",
};

export default async function CataloguePage() {
  const products = await getProducts();

  return (
    <div className="container page">
      <Breadcrumb items={[{ label: "Catalogue" }]} />

      <header className="page-header">
        <p className="eyebrow">Catalogue</p>
        <h1>Des objets choisis pour leur usage</h1>
        <p className="page-header__lead">
          Douze références, quatre familles. Les prix sont affichés en FCFA et
          incluent la préparation de la commande.
        </p>
      </header>

      <CatalogueBrowser products={products} />
    </div>
  );
}
