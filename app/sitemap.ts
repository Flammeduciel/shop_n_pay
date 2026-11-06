import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products-server";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/catalogue"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/a-propos"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/livraison"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const allProducts = await getProducts();
  const productRoutes: MetadataRoute.Sitemap = allProducts.map((product) => ({
    url: absoluteUrl(`/produit/${product.slug}`),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
