import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { registerAction } from "@/app/actions/auth";
import { Alert } from "@/components/alert";
import { CheckIcon, LockIcon, ShieldIcon, TruckIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inscription",
  description: "Créez votre compte Shop&Pay.",
  robots: { index: false, follow: false },
};

type RegisterPageProps = {
  searchParams: Promise<{ erreur?: string }>;
};

const errorMessages: Record<string, string> = {
  champs: "Renseignez tous les champs.",
  motdepasse: "Le mot de passe doit contenir au moins 8 caractères.",
  existant: "Un compte existe déjà avec cette adresse e-mail.",
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const session = await auth();

  if (session?.user) {
    redirect("/compte");
  }

  const errorMessage = params.erreur ? errorMessages[params.erreur] : undefined;

  return (
    <div className="container page page--narrow">
      <div className="auth-layout">
        <div className="auth-intro">
          <p className="eyebrow">Compte</p>
          <h1>Créer un compte</h1>
          <p>
            Créez votre compte pour finaliser une commande et retrouver votre
            historique.
          </p>

          <ul className="auth-points">
            <li>
              <ShieldIcon size={18} />
              Session persistante pendant 30 jours
            </li>
            <li>
              <LockIcon size={18} />
              Route de commande protégée par le middleware
            </li>
            <li>
              <TruckIcon size={18} />
              Historique des commandes dans le compte
            </li>
          </ul>

          <Link href="/connexion" className="link-arrow">
            Déjà un compte ? Se connecter
          </Link>
        </div>

        <div className="auth-card">
          <h2 className="auth-card__title">Inscription</h2>

          {errorMessage ? (
            <Alert tone="danger" title="Inscription impossible">
              {errorMessage}
            </Alert>
          ) : null}

          <form action={registerAction} className="form">
            <div className="field">
              <label htmlFor="name" className="field-label">
                Nom
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="field-input"
                autoComplete="name"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="email" className="field-label">
                Adresse e-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="field-input"
                autoComplete="email"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password" className="field-label">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="field-input"
                autoComplete="new-password"
                required
              />
            </div>

            <button type="submit" className="button button--accent button--block">
              Créer le compte
            </button>
          </form>

          <div className="auth-card__checks">
            <p>
              <CheckIcon size={16} />
              Aucune donnée bancaire n'est demandée.
            </p>
            <p>
              <CheckIcon size={16} />
              Le paiement se fait sur le guichet Mobile Money.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}