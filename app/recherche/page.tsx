import type { Metadata } from "next";
import Link from "next/link";
import { Alert } from "@/components/alert";
import { Breadcrumb } from "@/components/breadcrumb";
import { ProductCard } from "@/components/product-card";
import { searchProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Recherche",
  description: "Recherchez un produit dans le catalogue Shop&Pay.",
  robots: { index: false, follow: true },
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

const suggestions = ["casque", "lampe", "carnet", "audio", "bureau"];

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const rawQuery = params.q;
  const query = (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery ?? "").trim();
  const results = query ? searchProducts(query) : [];

  return (
    <div className="container page">
      <Breadcrumb items={[{ label: "Recherche" }]} />

      <header className="page-header page-header--compact">
        <p className="eyebrow">Recherche</p>
        <h1>Que cherchez-vous ?</h1>
        <p className="page-header__lead">
          Un nom, un usage ou une catégorie. La recherche parcourt le catalogue
          complet.
        </p>
      </header>

      <form action="/recherche" method="get" role="search" className="search-page-form">
        <label htmlFor="search-page-input" className="field-label">
          Mot-clé
        </label>
        <div className="search-page-form__row">
          <input
            id="search-page-input"
            name="q"
            type="search"
            className="field-input"
            defaultValue={query}
            placeholder="Par exemple : casque, lampe, carnet"
            autoComplete="off"
          />
          <button type="submit" className="button button--accent">
            Rechercher
          </button>
        </div>
      </form>

      {!query ? (
        <div className="search-empty">
          <p className="text-muted">Quelques recherches fréquentes :</p>
          <ul className="suggestion-list">
            {suggestions.map((suggestion) => (
              <li key={suggestion}>
                <Link href={`/recherche?q=${encodeURIComponent(suggestion)}`}>
                  {suggestion}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <section className="search-results" aria-live="polite">
          <div className="search-results__header">
            <p className="result-count">
              {results.length}{" "}
              {results.length > 1 ? "résultats" : "résultat"} pour « {query} »
            </p>
            <Link href="/catalogue" className="link-arrow">
              Voir tout le catalogue
            </Link>
          </div>

          {results.length === 0 ? (
            <Alert tone="info" title="Aucun produit trouvé">
              Essayez un mot plus court ou parcourez le catalogue par catégorie.
            </Alert>
          ) : (
            <div className="product-grid">
              {results.map((product, index) => (
                <ProductCard key={product.slug} product={product} priority={index < 4} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
