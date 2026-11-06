import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container page page--narrow">
      <p className="eyebrow">Erreur 404</p>
      <h1>Page introuvable</h1>
      <p className="page-header__lead">
        L'adresse demandée n'existe pas ou a été déplacée.
      </p>
      <div className="prose-actions">
        <Link href="/" className="button button--accent">
          Retour à l'accueil
        </Link>
        <Link href="/catalogue" className="button button--secondary">
          Voir le catalogue
        </Link>
      </div>
    </div>
  );
}
