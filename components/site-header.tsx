import Link from "next/link";
import { CartLink } from "./cart-link";
import { SearchIcon, UserIcon } from "./icons";

const navigation = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/livraison", label: "Livraison" },
  { href: "/a-propos", label: "À propos" },
];

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

          <nav className="navbar" aria-label="Navigation principale">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="text-button">
                {item.label}
              </Link>
            ))}

            <form action="/recherche" method="get" role="search" className="search-container header-search">
              <SearchIcon size={16} />
              <input
                id="header-search"
                name="q"
                type="search"
                placeholder="Rechercher un produit..."
                aria-label="Rechercher un produit"
                autoComplete="off"
              />
            </form>

            <Link href="/compte" className="icon-button" aria-label="Mon compte">
              <UserIcon />
            </Link>
            <CartLink />
          </nav>
        </div>
      </header>
    </>
  );
}