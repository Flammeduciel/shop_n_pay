import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { getCategoryName, type Product } from "@/lib/products";
import { AddToCart } from "./add-to-cart";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const available = product.stock > 0;

  return (
    <article className="product-card">
      <div className="product-media">
        <Link href={`/produit/${product.slug}`} tabIndex={-1} aria-hidden="true">
          <Image
            src={product.image}
            alt={product.imageAlt}
            width={800}
            height={800}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
          />
        </Link>
        {product.badge ? <span className="product-badge">{product.badge}</span> : null}
      </div>

      <div className="product-info">
        <p className="product-category">{getCategoryName(product.category)}</p>
        <h3 className="product-title">
          <Link href={`/produit/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="product-summary">{product.summary}</p>

        <div className="product-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
          <AddToCart
            slug={product.slug}
            name={product.name}
            disabled={!available}
            small
          />
        </div>
      </div>
    </article>
  );
}
