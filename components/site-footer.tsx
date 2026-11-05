import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <p className="brand brand--footer">
            shop<span className="brand__amp">&amp;</span>pay
          </p>
          <p className="footer-text">
            Des objets utiles pour l'audio, la mobilité, la maison et le bureau.
            Sélection courte, prix lisibles, livraison au Cameroun.
          </p>
          <p className="footer-text">{siteConfig.address}</p>
        </div>

        <div>
          <h2 className="footer-title">Boutique</h2>
          <ul className="footer-list">
            <li>
              <Link href="/catalogue">Tout le catalogue</Link>
            </li>
            <li>
              <Link href="/panier">Mon panier</Link>
            </li>
            <li>
              <Link href="/compte">Mon compte</Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="footer-title">Informations</h2>
          <ul className="footer-list">
            <li>
              <Link href="/livraison">Livraison et paiement</Link>
            </li>
            <li>
              <Link href="/a-propos">À propos</Link>
            </li>
            <li>
              <Link href="/recherche">Rechercher</Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="footer-title">Contact</h2>
          <ul className="footer-list">
            <li>
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </li>
            <li>
              <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>{siteConfig.phone}</a>
            </li>
            <li>Lundi au vendredi, 9h à 18h</li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Shop&Pay. Tous droits réservés.</p>
        <p>Paiement par Mobile Money avec Monetbil.</p>
      </div>
    </footer>
  );
}
