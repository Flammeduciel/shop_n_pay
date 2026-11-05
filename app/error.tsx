"use client";

import Link from "next/link";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container page page--narrow">
      <p className="eyebrow">Erreur</p>
      <h1>Quelque chose s'est mal passé</h1>
      <p className="page-header__lead">
        La page n'a pas pu être affichée. Vous pouvez réessayer ou revenir à
        l'accueil.
      </p>
      <div className="prose-actions">
        <button type="button" className="button button--accent" onClick={reset}>
          Réessayer
        </button>
        <Link href="/" className="button button--secondary">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
