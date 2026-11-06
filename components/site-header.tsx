import Link from "next/link";
import { CartLink } from "./cart-link";
import { UserIcon } from "./icons";

export function SiteHeader() {
  return (
    <>
      <p className="announcement">
        Livraison offerte dès 50 000 FCFA à Douala et Yaoundé
      </p>
      <header className="header">
        <div className="header-content">
          <Link href="/" className="logo" aria-label="Shop&Pay, retour à l'accueil">
            <span>Shop&Pay</span>
          </Link>

          <form action="/recherche" method="get" role="search" className="search-container header-search">
            <i className="fas fa-search" aria-hidden="true" />
            <input
              id="header-search"
              name="q"
              type="search"
              placeholder="Rechercher un produit..."
              aria-label="Rechercher un produit"
              autoComplete="off"
            />
          </form>

          <div className="navbar">
            <Link href="/compte" className="icon-button" aria-label="Mon compte">
              <UserIcon />
            </Link>
            <CartLink />
          </div>
        </div>
      </header>
    </>
  );
}