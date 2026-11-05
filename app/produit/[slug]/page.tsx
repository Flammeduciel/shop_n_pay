import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { CheckIcon, LockIcon, ShieldIcon, TruckIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { ProductPurchase } from "@/components/product-purchase";
import { SectionHeading } from "@/components/section-heading";
import { formatPrice } from "@/lib/format";
import {
  getCategoryName,
  getProduct,
  getRelatedProducts,
  products,
} from "@/lib/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return { title: "Produit introuvable" };
  }

  return {
    title: product.name,
    description: product.summary,
    openGraph: {
      title: product.name,
      description: product.summary,
      images: [{ url: product.image, width: 800, height: 800, alt: product.imageAlt }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product, 3);
  const categoryName = getCategoryName(product.category);

  return (
    <div className="container page">
      <Breadcrumb
        items={[{ label: "Catalogue", href: "/catalogue" }, { label: product.name }]}
      />

      <div className="product-detail">
        <div className="product-detail__media">
          <Image
            src={product.image}
            alt={product.imageAlt}
            width={900}
            height={900}
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
          />
          {product.badge ? (
            <span className="product-detail__badge">{product.badge}</span>
          ) : null}
        </div>

        <div className="product-detail__info">
          <p className="eyebrow">{categoryName}</p>
          <h1>{product.name}</h1>
          <p className="product-detail__price">{formatPrice(product.price)}</p>
          <p className="product-detail__summary">{product.summary}</p>
          <p className="product-detail__description">{product.description}</p>

          <ProductPurchase
            slug={product.slug}
            name={product.name}
            stock={product.stock}
          />

          <ul className="detail-list">
            {product.details.map((detail) => (
              <li key={detail}>
                <CheckIcon size={16} />
                {detail}
              </li>
            ))}
          </ul>

          <div className="product-notes">
            <p>
              <TruckIcon size={18} />
              Expédition sous 24 h après confirmation du paiement.
            </p>
            <p>
              <LockIcon size={18} />
              Paiement Mobile Money sur le guichet Monetbil.
            </p>
            <p>
              <ShieldIcon size={18} />
              Retour accepté sous 7 jours, article non utilisé.
            </p>
          </div>
        </div>
      </div>

      <section className="section section--tight" aria-labelledby="related-title">
        <SectionHeading
          id="related-title"
          title="À découvrir aussi"
          description="Trois références qui complètent bien ce produit."
          action={
            <Link href="/catalogue" className="link-arrow">
              Tout le catalogue
            </Link>
          }
        />
        <div className="product-grid product-grid--three">
          {relatedProducts.map((related) => (
            <ProductCard key={related.slug} product={related} />
          ))}
        </div>
      </section>
    </div>
  );
}
