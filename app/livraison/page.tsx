import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { Alert } from "@/components/alert";
import { CheckIcon, LockIcon, TruckIcon } from "@/components/icons";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Livraison et paiement",
  description:
    "Zones de livraison, délais, frais et fonctionnement du paiement Mobile Money avec Mobile Money.",
};

export default function DeliveryPage() {
  return (
    <div className="container page page--narrow">
      <Breadcrumb items={[{ label: "Livraison" }]} />

      <header className="page-header">
        <p className="eyebrow">Informations</p>
        <h1>Livraison et paiement</h1>
        <p className="page-header__lead">
          Les commandes sont préparées à Brazzaville. Les frais et les délais dépendent
          de la ville de livraison.
        </p>
      </header>

      <div className="prose">
        <section id="livraison" aria-labelledby="livraison-title">
          <h2 id="livraison-title">Livraison</h2>
          <div className="info-table">
            <div className="info-table__row">
              <span className="info-table__label">Brazzaville et Pointe-Noire</span>
              <span>48 heures ouvrées</span>
              <span>2 500 FCFA</span>
            </div>
            <div className="info-table__row">
              <span className="info-table__label">Autres villes</span>
              <span>72 heures ouvrées</span>
              <span>2 500 FCFA</span>
            </div>
            <div className="info-table__row">
              <span className="info-table__label">Commande dès 50 000 FCFA</span>
              <span>Toutes villes desservies</span>
              <span>Livraison offerte</span>
            </div>
          </div>
          <p>
            La livraison est assurée du lundi au samedi. Le livreur appelle le
            numéro indiqué lors de la commande avant de se présenter.
          </p>
        </section>

        <section id="paiement" aria-labelledby="paiement-title">
          <h2 id="paiement-title">Paiement Mobile Money</h2>
          <p>
            Le paiement est traité par Mobile Money. Le montant total, livraison
            comprise, est calculé sur le serveur avant l'ouverture du .
          </p>

          <ol className="steps-list">
            <li>
              <h3>Choisir Mobile Money au moment de la commande</h3>
              <p>
                Le site prépare une référence de paiement unique et signée avec la
                clé de service.
              </p>
            </li>
            <li>
              <h3>Valider le paiement</h3>
              <p>
                Vous choisissez votre opérateur, saisissez votre numéro et
                confirmez avec votre code secret sur votre téléphone.
              </p>
            </li>
            <li>
              <h3>Revenir sur Shop&Pay</h3>
              <p>
                La boutique vérifie le statut du paiement auprès de Mobile Money, puis
                affiche la confirmation. La commande apparaît dans votre compte.
              </p>
            </li>
          </ol>

          <Alert tone="info" title="Numéro de téléphone">
            Le numéro saisi doit être celui du compte Mobile Money. Les formats
            camerounais avec ou sans l'indicatif 237 sont acceptés.
          </Alert>

          <p>
            Aucune donnée de carte bancaire n'est demandée ni stockée. Les clés
            Les clés de paiement restent sur le serveur et ne sont jamais envoyées au
            navigateur.
          </p>
        </section>

        <section id="retours" aria-labelledby="retours-title">
          <h2 id="retours-title">Retours</h2>
          <p>
            Un article peut être retourné sous 7 jours après réception, s'il n'a
            pas été utilisé et s'il est dans son emballage d'origine. Le remboursement
            est effectué sur le compte Mobile Money utilisé pour le paiement.
          </p>
          <p>
            Pour ouvrir un retour, écrivez à bonjour@shoppay.cm en indiquant la
            référence de commande et le motif.
          </p>
        </section>
      </div>

      <div className="feature-list">
        <div>
          <TruckIcon size={22} />
          <h3>Suivi simple</h3>
          <p>Une référence de commande et un contact direct pour chaque envoi.</p>
        </div>
        <div>
          <LockIcon size={22} />
          <h3>Paiement protégé</h3>
          <p>La signature Mobile Money est vérifiée avant toute confirmation.</p>
        </div>
        <div>
          <CheckIcon size={22} />
          <h3>Prix affichés</h3>
          <p>Le total inclut la livraison, sans frais ajoutés à la fin.</p>
        </div>
      </div>

      <div className="prose-actions">
        <Link href="/catalogue" className="button button--accent">
          Voir le catalogue
        </Link>
        <Link href="/panier" className="button button--secondary">
          Mon panier
        </Link>
      </div>
    </div>
  );
}
