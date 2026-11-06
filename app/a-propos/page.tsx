import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { ArrowRightIcon } from "@/components/icons";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Shop&Pay, boutique en ligne camerounaise et projet du groupe 10 pour le livrable S22 d'Akieni Academy.",
};

const team = [
  {
    name: "WASSANGOU Flamme Du Ciel",
    role: "Authentification et stratégies de rendu",
  },
  {
    name: "MBEMBA Paul Divin Aymerol",
    role: "Catalogue et fiches produit",
  },
  {
    name: "DELLOT-MVOUMINA Alty",
    role: "Panier, commande et paiement Mobile Money",
  },
  {
    name: "MILANDOU Loïc Divin Céleste",
    role: "Déploiement et configuration Vercel",
  },
  {
    name: "MATONDO Jonathan",
    role: "Qualité, tests de bout en bout et revue",
  },
];

export default function AboutPage() {
  return (
    <div className="container page page--narrow">
      <Breadcrumb items={[{ label: "À propos" }]} />

      <header className="page-header">
        <p className="eyebrow">À propos</p>
        <h1>Une boutique simple, lisible et utile</h1>
        <p className="page-header__lead">
          Shop&Pay réunit une petite sélection d'objets pour l'audio, la mobilité,
          la maison et le bureau. Le projet a été réalisé dans le cadre du
          livrable S22 d'Akieni Academy.
        </p>
      </header>

      <div className="prose">
        <h2>Le point de départ</h2>
        <p>
          La plupart des boutiques en ligne du marché affichent des catalogues
          très longs, des frais peu clairs et un paiement qui demande une carte
          bancaire. Nous avons pris le chemin inverse : peu de références, des
          descriptions précises et un paiement Mobile Money accessible au plus
          grand nombre.
        </p>

        <h2>Ce que contient la boutique</h2>
        <p>
          Douze produits répartis en quatre familles. Chaque fiche indique le prix
          en FCFA, la disponibilité, les caractéristiques et les conditions de
          retour. Le panier reste sur l'appareil du client et la commande est
          préparée côté serveur avant le paiement.
        </p>

        <h2>Le paiement</h2>
        <p>
          Le tunnel de commande s'appuie sur Mobile Money pour Mobile Money. Le
          montant est recalculé sur le serveur, puis une référence de paiement est
          créée et signée. Après validation sur le guichet, Mobile Money renvoie le
          statut à la boutique. Aucune donnée bancaire ne transite par le site.
        </p>

        <h2>L'équipe</h2>
        <ul className="team-list">
          {team.map((member) => (
            <li key={member.name}>
              <span className="team-list__name">{member.name}</span>
              <span className="team-list__role">{member.role}</span>
            </li>
          ))}
        </ul>

        <p className="prose__note">
          Groupe 10, promotion Fullstack, Akieni Academy, novembre 2026.
        </p>
      </div>

      <div className="prose-actions">
        <Link href="/catalogue" className="button button--accent">
          Voir le catalogue
          <ArrowRightIcon size={18} />
        </Link>
        <Link href="/livraison" className="button button--secondary">
          Livraison et paiement
        </Link>
      </div>
    </div>
  );
}
