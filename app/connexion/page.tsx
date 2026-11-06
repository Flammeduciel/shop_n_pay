import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { loginAction } from "@/app/actions/auth";
import { Alert } from "@/components/alert";
import { CheckIcon, LockIcon, ShieldIcon, TruckIcon } from "@/components/icons";
import { safeCallbackPath } from "@/lib/callback";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte Shop&Pay.",
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{ erreur?: string; callbackUrl?: string }>;
};

const errorMessages: Record<string, string> = {
  identifiants: "Adresse e-mail ou mot de passe incorrect.",
  champs: "Renseignez l'adresse e-mail et le mot de passe.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = safeCallbackPath(params.callbackUrl);
  const session = await auth();

  if (session?.user) {
    redirect(callbackUrl);
  }

  const errorMessage = params.erreur ? errorMessages[params.erreur] : undefined;

  return (
    <div className="container page page--narrow">
      <div className="auth-layout">
        <div className="auth-intro">
          <p className="eyebrow">Compte</p>
          <h1>Se connecter</h1>
          <p>
            La connexion permet de finaliser une commande et de retrouver son
            historique. Le compte de démonstration donne accès à toutes les pages
            protégées.
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

          <div className="auth-links">
            <Link href="/catalogue" className="link-arrow">
              Continuer sans acheter
            </Link>
            <Link href="/inscription" className="link-arrow">
              Créer un compte
            </Link>
          </div>
        </div>

        <div className="auth-card">
          <h2 className="auth-card__title">Connexion</h2>

          {errorMessage ? (
            <Alert tone="danger" title="Connexion impossible">
              {errorMessage}
            </Alert>
          ) : null}

          <form action={loginAction} className="form">
            <input type="hidden" name="callbackUrl" value={callbackUrl} />

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
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className="button button--accent button--block">
              Se connecter
            </button>
          </form>

          <div className="auth-card__checks">
            <p>
              <CheckIcon size={16} />
              Aucune donnée bancaire n'est demandée.
            </p>
            <p>
              <CheckIcon size={16} />
              Le paiement se fait sur le guichet Monetbil.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
