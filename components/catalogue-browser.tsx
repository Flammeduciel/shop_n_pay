"use client";

import { useMemo, useState } from "react";
import { categories, type CategorySlug, type Product } from "@/lib/products";
import { ProductCard } from "./product-card";

type SortKey = "selection" | "prix-asc" | "prix-desc" | "nom";

const sortLabels: Record<SortKey, string> = {
  selection: "Sélection",
  "prix-asc": "Prix croissant",
  "prix-desc": "Prix décroissant",
  nom: "Nom, A à Z",
};

export function CatalogueBrowser({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<CategorySlug | "tous">("tous");
  const [sort, setSort] = useState<SortKey>("selection");

  const visibleProducts = useMemo(() => {
    const filtered =
      category === "tous"
        ? [...products]
        : products.filter((product) => product.category === category);

    switch (sort) {
      case "prix-asc":
        return filtered.sort((a, b) => a.price - b.price);
      case "prix-desc":
        return filtered.sort((a, b) => b.price - a.price);
      case "nom":
        return filtered.sort((a, b) => a.name.localeCompare(b.name, "fr"));
      default:
        return filtered;
    }
  }, [products, category, sort]);

  return (
    <div className="catalogue-browser">
      <div className="catalogue-toolbar">
        <div className="filter-group" role="group" aria-label="Filtrer par catégorie">
          <button
            type="button"
            className={`filter-chip ${category === "tous" ? "is-active" : ""}`}
            aria-pressed={category === "tous"}
            onClick={() => setCategory("tous")}
          >
            Tout
          </button>
          {categories.map((item) => (
            <button
              key={item.slug}
              type="button"
              className={`filter-chip ${category === item.slug ? "is-active" : ""}`}
              aria-pressed={category === item.slug}
              onClick={() => setCategory(item.slug)}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="sort-field">
          <label htmlFor="catalogue-sort" className="field-label">
            Trier par
          </label>
          <select
            id="catalogue-sort"
            className="field-input field-input--select"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
          >
            {Object.entries(sortLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="result-count" aria-live="polite">
        {visibleProducts.length}{" "}
        {visibleProducts.length > 1 ? "produits affichés" : "produit affiché"}
      </p>

      <div className="product-grid">
        {visibleProducts.map((product, index) => (
          <ProductCard key={product.slug} product={product} priority={index < 4} />
        ))}
      </div>
    </div>
  );
}
