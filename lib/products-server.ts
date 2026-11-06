import "server-only";
import { db, hasDatabase } from "./db";
import {
  type Product,
  type CategorySlug,
  products as staticProducts,
  normalizeText,
} from "./products";

type ProductRow = {
  slug: string;
  name: string;
  category: CategorySlug;
  price: number | string;
  summary: string;
  description: string;
  details: string[] | null;
  image: string;
  image_alt: string;
  stock: number | string;
  featured: boolean;
  badge: string | null;
};

async function loadProducts(): Promise<Product[]> {
  if (!hasDatabase() || !db) return staticProducts;

  const rows = await db<ProductRow[]>`
    SELECT slug, name, category, price, summary, description, details, image, image_alt, stock, featured, badge
    FROM products
  `;

  return rows.map((row) => ({
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    summary: row.summary,
    description: row.description,
    details: row.details ?? [],
    image: row.image,
    imageAlt: row.image_alt,
    stock: Number(row.stock),
    featured: row.featured,
    badge: row.badge ?? undefined,
  }));
}

export async function getProducts(): Promise<Product[]> {
  return loadProducts();
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const all = await loadProducts();
  return all.find((product) => product.slug === slug);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const all = await loadProducts();
  return all.filter((product) => product.featured).slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
  const all = await loadProducts();
  const sameCategory = all.filter(
    (candidate) => candidate.category === product.category && candidate.slug !== product.slug,
  );
  const others = all.filter(
    (candidate) => candidate.category !== product.category && candidate.slug !== product.slug,
  );

  return [...sameCategory, ...others].slice(0, limit);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const term = normalizeText(query);
  if (!term) return [];

  const all = await loadProducts();
  return all.filter((product) => {
    const haystack = normalizeText(
      [
        product.name,
        product.summary,
        product.description,
        product.category,
      ].join(" "),
    );
    return haystack.includes(term);
  });
}

export { categories, getCategoryName } from "./products";
