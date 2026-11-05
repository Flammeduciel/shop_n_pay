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
      <header className="site-header">
        <div className="container site-header__inner">
          <Link href="/" className="brand" aria-label="Shop&Pay, retour à l'accueil">
            shop<span className="brand__amp">&amp;</span>pay
          </Link>

          <nav className="site-nav" aria-label="Navigation principale">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="site-nav__link">
                {item.label}
              </Link>
            ))}
          </nav>

          <form action="/recherche" method="get" role="search" className="header-search">
            <label htmlFor="header-search" className="visually-hidden">
              Rechercher un produit
            </label>
            <input
              id="header-search"
              name="q"
              type="search"
              placeholder="Rechercher"
              autoComplete="off"
              className="header-search__input"
            />
            <button type="submit" className="header-search__submit" aria-label="Lancer la recherche">
              <SearchIcon size={18} />
            </button>
          </form>

          <div className="header-actions">
            <Link href="/compte" className="header-action" aria-label="Mon compte">
              <UserIcon />
              <span>Compte</span>
            </Link>
            <CartLink />
          </div>
        </div>
      </header>
    </>
  );
}
