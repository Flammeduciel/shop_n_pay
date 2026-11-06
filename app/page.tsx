import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  CheckIcon,
  LockIcon,
  ShieldIcon,
  TruckIcon,
} from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { categories } from "@/lib/products";
import { getFeaturedProducts } from "@/lib/products-server";

export const dynamic = "force-static";

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(4);

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="eyebrow">Sélection 2026 · Douala</p>
            <h1>Des objets utiles, choisis pour durer.</h1>
            <p className="hero__lead">
              Audio, mobilité, maison et bureau. Une sélection courte, des prix
              lisibles et le paiement Mobile Money.
            </p>

            <div className="hero__actions">
              <Link href="/catalogue" className="button button--accent">
                Découvrir le catalogue
                <ArrowRightIcon size={18} />
              </Link>
              <Link href="/livraison#paiement" className="button button--secondary">
                Comment payer
              </Link>
            </div>

            <ul className="hero__points">
              <li>
                <CheckIcon size={18} />
                Livraison à Douala et Yaoundé sous 48 h
              </li>
              <li>
                <CheckIcon size={18} />
                MTN Mobile Money et Orange Money
              </li>
              <li>
                <CheckIcon size={18} />
                Retour accepté sous 7 jours
              </li>
            </ul>
          </div>

          <div className="hero__media">
            <Image
              src="/images/hero-still-life.svg"
              alt="Lampe de bureau, carafe en verre et carnet posés sur une table"
              width={900}
              height={900}
              priority
              sizes="(max-width: 900px) 100vw, 46vw"
            />
            <p className="hero__caption">
              <Link href="/produit/lampe-bureau-mungo">Lampe Mungo</Link>,{" "}
              <Link href="/produit/carafe-filtre-sanaga">carafe Sanaga</Link> et{" "}
              <Link href="/produit/carnet-relie-nyong">carnet Nyong</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="service-band" aria-label="Services">
        <div className="container service-band__grid">
          <div className="service-item">
            <TruckIcon size={24} />
            <div>
              <h2>Livraison suivie</h2>
              <p>Douala et Yaoundé sous 48 h, autres villes sous 72 h.</p>
            </div>
          </div>
          <div className="service-item">
            <LockIcon size={24} />
            <div>
              <h2>Paiement Mobile Money</h2>
              <p>MTN et Orange Money via le guichet sécurisé Monetbil.</p>
            </div>
          </div>
          <div className="service-item">
            <ShieldIcon size={24} />
            <div>
              <h2>Retour sous 7 jours</h2>
              <p>Article non utilisé, dans son emballage d'origine.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section container" aria-labelledby="rayons-title">
        <SectionHeading
          id="rayons-title"
          eyebrow="Rayons"
          title="Quatre familles, peu de références"
          description="Nous préférons une sélection courte et lisible à un catalogue sans fin."
          action={
            <Link href="/catalogue" className="link-arrow">
              Tout voir
              <ArrowRightIcon size={16} />
            </Link>
          }
        />

        <div className="category-grid">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/recherche?q=${encodeURIComponent(category.name)}`}
              className="category-card"
            >
              <span className="category-card__index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <span className="category-card__link">
                Explorer
                <ArrowRightIcon size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container" aria-labelledby="selection-title">
        <SectionHeading
          id="selection-title"
          eyebrow="Sélection"
          title="Les pièces les plus demandées"
          description="Des produits testés au quotidien, disponibles en quantité limitée."
          action={
            <Link href="/catalogue" className="link-arrow">
              Voir le catalogue
              <ArrowRightIcon size={16} />
            </Link>
          }
        />

        <div className="product-grid">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.slug} product={product} priority={index < 2} />
          ))}
        </div>
      </section>

      <section className="payment-section" id="paiement">
        <div className="container payment-section__inner">
          <div className="payment-section__copy">
            <p className="eyebrow">Paiement</p>
            <h2>Mobile Money, sans carte bancaire</h2>
            <p>
              Le paiement se fait sur le guichet Monetbil. Vous choisissez votre
              opérateur, validez sur votre téléphone, puis revenez sur la boutique.
            </p>
            <Link href="/livraison#paiement" className="button button--secondary">
              Voir le détail du paiement
            </Link>
          </div>

          <ol className="payment-steps">
            <li>
              <span className="payment-steps__index">01</span>
              <div>
                <h3>Vous commandez</h3>
                <p>Le panier et l'adresse de livraison sont vérifiés avant le paiement.</p>
              </div>
            </li>
            <li>
              <span className="payment-steps__index">02</span>
              <div>
                <h3>Vous payez</h3>
                <p>Vous êtes redirigé vers Monetbil et validez avec votre code Mobile Money.</p>
              </div>
            </li>
            <li>
              <span className="payment-steps__index">03</span>
              <div>
                <h3>Nous préparons la commande</h3>
                <p>La confirmation s'affiche sur la boutique, puis la livraison est organisée.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="container">
        <div className="cta-band">
          <div>
            <p className="eyebrow">Catalogue</p>
            <h2>Un besoin précis ? Tout est rangé par usage.</h2>
          </div>
          <Link href="/catalogue" className="button button--light">
            Parcourir les produits
            <ArrowRightIcon size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
