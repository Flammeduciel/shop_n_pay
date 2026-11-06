# Shop&Pay

Boutique en ligne réalisée par le **groupe 10** dans le cadre du livrable **S22 Fullstack A** d'Akieni Academy.

Shop&Pay vend une sélection courte d'objets pour l'audio, la mobilité, la maison et le bureau. Le site propose un catalogue, un panier, un compte client protégé et un paiement Mobile Money par Monetbil.

| Élément | Valeur |
| --- | --- |
| URL de production | `https://<projet>.vercel.app` (à remplacer après déploiement) |
| Dépôt GitHub | `https://github.com/<organisation>/shop_n_pay` |
| Groupe | 10 |
| Stack | Next.js 15.5, React 19, TypeScript, Auth.js 5, CSS |
| Hébergement | Vercel |
| Paiement | Monetbil, MTN Mobile Money et Airtel Money |

## 1. Compte de test

| Champ | Valeur |
| --- | --- |
| Adresse e-mail | `demo@shoppay.cm` |
| Mot de passe | `Demo1234!` |

Le compte fonctionne avec les variables `AUTH_DEMO_EMAIL` et `AUTH_DEMO_PASSWORD`. La session est un JWT signé, conservé 30 jours. La déconnexion se fait depuis la page **Mon compte**.

Les routes `/compte` et `/paiement` sont protégées par le middleware. Une visite sans session redirige vers `/connexion` avec l'adresse de retour dans `callbackUrl`.

## 2. Fonctionnalités

- Catalogue de 12 produits répartis en 4 catégories : audio, mobilité, maison et bureau.
- Filtre par catégorie, tri par prix ou par nom et recherche plein texte.
- Fiche produit avec prix, stock, caractéristiques, produits associés et ajout au panier.
- Panier persistant dans le navigateur, modification des quantités et suppression d'une ligne.
- Livraison offerte à partir de 50 000 FCFA, frais de 2 500 FCFA sinon.
- Commande protégée, validation du téléphone camerounais et récapitulatif avant paiement.
- Paiement Mobile Money par Monetbil, avec vérification du statut côté serveur.
- Historique des quatre dernières commandes dans le compte client.
- Mode démonstration automatique quand les clés Monetbil ne sont pas configurées.
- Pages statiques pour la présentation, la livraison et les mentions pratiques.
- Métadonnées, sitemap et robots.txt pour l'indexation.
- Tests de bout en bout Playwright et audit Lighthouse mobile.

## 3. Stratégies de rendu

Le projet utilise les trois modes demandés. Le tableau reprend les choix visibles dans la sortie de `npm run build`.

| Page | Route | Mode | Justification |
| --- | --- | --- | --- |
| Accueil | `/` | SSG, `force-static` | Le contenu éditorial change rarement. La page est générée au build et servie depuis le cache. |
| Catalogue | `/catalogue` | ISR, `revalidate = 300` | Les produits sont stables mais les stocks peuvent évoluer. La page est régénérée toutes les 5 minutes sans redéploiement. |
| Fiche produit | `/produit/[slug]` | SSG, `generateStaticParams` | Les 12 fiches sont connues à l'avance. `dynamicParams = false` renvoie une 404 pour un slug absent. |
| Recherche | `/recherche` | SSR, `force-dynamic` | Le résultat dépend du paramètre `q` et doit être calculé à chaque requête. |
| Compte | `/compte` | SSR, `force-dynamic` | La page lit la session et les cookies de commandes, propres à chaque visiteur. |
| Connexion | `/connexion` | SSR, `force-dynamic` | La page vérifie la session et lit le paramètre `callbackUrl`. |
| Paiement | `/paiement` | SSR, `force-dynamic` | Le formulaire dépend du compte connecté. |
| Confirmation | `/paiement/confirmation` | SSR, `force-dynamic` | Le statut dépend de la référence et du cookie de commande. |
| Simulation | `/paiement/simulation` | SSR, `force-dynamic` | La page lit la commande en attente et vérifie le mode démonstration. |
| Panier | `/panier` | Statique avec composant client | La coquille de page est statique, le contenu vient du stockage local. |
| Livraison et à propos | `/livraison`, `/a-propos` | SSG, `force-static` | Pages de contenu sans donnée personnelle. |

Les routes API de paiement et d'authentification sont dynamiques par nature.

## 4. Pages et responsabilités

| Page ou route | Fichier | Contenu |
| --- | --- | --- |
| Accueil | `app/page.tsx` | Hero, services, catégories, sélection et explication du paiement. |
| Catalogue | `app/catalogue/page.tsx` | Liste complète, filtre par catégorie, tri. |
| Produit | `app/produit/[slug]/page.tsx` | Fiche détaillée, achat, stock et suggestions. |
| Recherche | `app/recherche/page.tsx` | Recherche serveur sur le nom, la description et la catégorie. |
| Panier | `app/panier/page.tsx` | Lignes du panier, quantités, frais et total. |
| Commande | `app/paiement/page.tsx` | Formulaire de livraison et lancement du paiement. |
| Simulation | `app/paiement/simulation/page.tsx` | Paiement fictif quand Monetbil n'est pas configuré. |
| Confirmation | `app/paiement/confirmation/page.tsx` | Statut, récapitulatif et adresse de livraison. |
| Connexion | `app/connexion/page.tsx` | Formulaire de connexion et compte de démonstration. |
| Compte | `app/compte/page.tsx` | Informations de session, commandes et déconnexion. |
| Livraison | `app/livraison/page.tsx` | Délais, frais, étapes du paiement et retours. |
| À propos | `app/a-propos/page.tsx` | Présentation de la boutique et de l'équipe. |
| Connexion Auth.js | `app/api/auth/[...nextauth]/route.ts` | Gestion des requêtes Auth.js. |
| Initialisation du paiement | `app/api/paiement/initier/route.ts` | Validation du panier, création de la référence et appel Monetbil. |
| Retour Monetbil | `app/api/paiement/retour/route.ts` | Vérification du statut et enregistrement de la commande. |
| Notification Monetbil | `app/api/paiement/notification/route.ts` | Vérification de la signature et du statut. |
| Simulation | `app/api/paiement/simulation/route.ts` | Enregistrement d'un paiement fictif en mode démonstration. |

## 5. Authentification

L'authentification repose sur Auth.js avec un fournisseur **Credentials** et une session **JWT**.

- `auth.config.ts` définit la page de connexion, la durée de session de 30 jours et les callbacks `jwt` et `session`.
- `auth.ts` enregistre le fournisseur Credentials et vérifie le compte de démonstration.
- `lib/auth-user.ts` compare le mot de passe avec `scrypt` et une comparaison à temps constant.
- `middleware.ts` protège `/compte` et `/paiement` avec le matcher `["/compte/:path*", "/paiement/:path*"]`.
- `app/actions/auth.ts` expose les Server Actions de connexion et de déconnexion.
- `lib/callback.ts` limite la redirection à un chemin interne, ce qui évite une redirection ouverte.

Le compte de démonstration est volontairement unique. Le mot de passe affiché sur la page de connexion peut être masqué en définissant une autre valeur dans `AUTH_DEMO_PASSWORD`.

## 6. Paiement Mobile Money

### Mode démonstration

Le mode démonstration est actif si `MONETBIL_DEMO=true` ou si `MONETBIL_SERVICE_KEY` ou `MONETBIL_SERVICE_SECRET` est vide. Le parcours est alors le suivant :

1. Le panier est validé et le montant est recalculé côté serveur.
2. Une référence `SP-...` est créée et conservée dans le cookie `shoppay_pending`.
3. Le navigateur est envoyé vers `/paiement/simulation`.
4. L'utilisateur choisit un paiement réussi ou un échec.
5. La commande est enregistrée dans le cookie `shoppay_orders` et la page de confirmation affiche le statut.

Aucun montant n'est débité dans ce mode.

### Mode Monetbil

Quand les deux clés sont renseignées et que `MONETBIL_DEMO` vaut `false`, le serveur appelle le guichet Monetbil.

- Widget : `POST https://www.monetbil.com/widget/v2.1/{serviceKey}` au format `application/x-www-form-urlencoded`, avec `amount`, `phone`, `country`, `currency`, `item_ref`, `payment_ref`, `return_url`, `notify_url` et `sign`.
- Retour utilisateur : `GET /api/paiement/retour`, qui vérifie la référence puis interroge Monetbil.
- Notification serveur : `POST /api/paiement/notification`, qui vérifie la signature avant de contrôler le paiement.
- Vérification : `POST https://api.monetbil.com/payment/v1/checkPayment` avec `paymentId`.
- Signature : `md5(serviceSecret + valeurs des paramètres triées par clé et concaténées)`, sans le paramètre `sign`.

Les statuts Monetbil sont traduits dans `lib/status.ts` : `paye`, `echec`, `annule` ou `attente`.

Les clés restent côté serveur. Elles ne sont jamais exposées dans le navigateur. Le détail du déploiement et des URL de retour se trouve dans [deploy.md](deploy.md).

## 7. Architecture

```text
app/
  actions/              Server Actions de connexion et de déconnexion
  api/auth/             Routes Auth.js
  api/paiement/         Initialisation, retour, notification, simulation
  catalogue/            Catalogue ISR
  compte/               Compte protégé
  connexion/            Formulaire de connexion
  paiement/             Commande, simulation et confirmation
  panier/               Panier client
  produit/[slug]/       Fiches produit statiques
  recherche/            Recherche serveur
components/             Composants d'interface et panier client
lib/                    Données, panier, commandes, Monetbil, validation
public/images/           Ressources statiques et icônes
styles/                  Tokens et feuilles CSS
tests/                   Tests Playwright
docs/lighthouse/         Rapport Lighthouse mobile
```

Les styles sont découpés en fichiers : `tokens.css`, `base.css`, `utilities.css`, `layout.css`, `components.css` et `pages.css`. `styles/main.css` les regroupe dans l'ordre. Aucun framework CSS n'est utilisé.

## 8. Installation locale

Prérequis : Node.js 20 ou plus récent.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Sous Windows, créer `.env.local` à partir de `.env.example`, puis générer `AUTH_SECRET` avec :

```bash
openssl rand -base64 32
```

Le site est disponible sur `http://localhost:3000`.

Commandes utiles :

```bash
npm run typecheck
npm run build
npm run start
npm run test:e2e
npm run audit:lighthouse
npm run db:migrate
npm run db:seed
npm run db:reset
```

`npm run test:e2e` lance Playwright sur un serveur de production. Exécuter `npm run build` avant la première fois. Le test utilise le navigateur Chrome installé sur la machine.

`npm run audit:lighthouse` écrit le rapport HTML et JSON dans `docs/lighthouse/`. Le serveur doit être démarré sur `http://localhost:3000`.

## 9. Variables d'environnement

| Variable | Obligatoire | Rôle |
| --- | --- | --- |
| `AUTH_SECRET` | Oui | Signature des sessions Auth.js. Utiliser une valeur aléatoire de 32 octets. |
| `AUTH_URL` | Oui en production | URL publique utilisée par Auth.js. |
| `AUTH_DEMO_EMAIL` | Non | Adresse du compte de démonstration. Valeur par défaut : `demo@shoppay.cm`. |
| `AUTH_DEMO_PASSWORD` | Non | Mot de passe du compte de démonstration. Valeur par défaut : `Demo1234!`. |
| `NEXT_PUBLIC_SITE_URL` | Oui | URL publique du site, utilisée pour les métadonnées, le sitemap et les URL Monetbil. |
| `MONETBIL_SERVICE_KEY` | Selon le mode | Clé de service Monetbil. |
| `MONETBIL_SERVICE_SECRET` | Selon le mode | Clé secrète Monetbil, utilisée pour la signature. |
| `MONETBIL_DEMO` | Non | `true` force la simulation locale. `false` active Monetbil si les clés sont présentes. |
| `MONETBIL_LOGO_URL` | Non | Logo affiché sur le guichet Monetbil. Par défaut, `/icon.svg` du site. |
| `DATABASE_URL` | Non | URL de connexion PostgreSQL. Si absent, les données initiales sont utilisées. |
| `DATABASE_SSL` | Non | `prefer` par défaut. Mettre `disable` en local si nécessaire. |

Le fichier `.env.local` est ignoré par Git. Ne jamais versionner de clé réelle.

## 10. Tests et qualité

| Vérification | Résultat |
| --- | --- |
| `npm run typecheck` | Succès |
| `npm run build` | Succès, 26 pages générées |
| `npm run test:e2e` | 6 tests Playwright réussis |
| Lighthouse mobile Performance | 99 |
| Lighthouse mobile Accessibility | 100 |
| Lighthouse mobile Best Practices | 100 |
| Lighthouse mobile SEO | 100 |

Les tests couvrent les pages publiques, la recherche, la redirection des routes protégées, les identifiants invalides, la connexion avec session persistante et la déconnexion. Le dernier test parcourt le panier, le formulaire de commande, le paiement simulé et la confirmation.

La capture et le rapport complet sont dans [docs/lighthouse/](docs/lighthouse/).

## 11. Équipe et contributions

Les comptes GitHub ci-dessous sont des emplacements à remplacer par les comptes réels des membres avant la démonstration.

| Membre | Rôle | Compte GitHub | Branches | Revue principale |
| --- | --- | --- | --- | --- |
| WASSANGOU Flamme Du Ciel | Auth.js, middleware, stratégies de rendu, performance | `@<compte-flamme>` | `feat/auth`, `perf/rendering` | MBEMBA, MILANDOU |
| MBEMBA Paul Divin Aymerol | Catalogue, fiches produit, accueil, recherche | `@<compte-mbemba>` | `feat/catalogue` | DELLOT-MVOUMINA |
| DELLOT-MVOUMINA Alty | Panier, commande, Mobile Money, historique | `@<compte-alty>` | `feat/cart-checkout` | WASSANGOU |
| MILANDOU Loïc Divin Céleste | Déploiement Vercel, configuration, documentation | `@<compte-milandou>` | `chore/deployment`, `docs/readme` | WASSANGOU |
| MATONDO Jonathan | Tests de bout en bout, accessibilité, revue | `@<compte-jonathan>` | `test/quality` | DELLOT-MVOUMINA |

Chaque membre possède au moins une branche fusionnée dans `develop` après revue par un autre membre. Le détail des tickets, des branches et des revues est dans [ISSUES.md](ISSUES.md).

## 12. Backlog

Le backlog de référence contient 26 tickets, dont 22 fermés, soit environ 85 % du backlog. Les quatre tickets ouverts concernent le déploiement réel, la validation des clés Monetbil, le bug bash sur le dépôt d'un autre groupe et une évolution vers une base de données.

Voir [ISSUES.md](ISSUES.md) pour la liste complète, les assignations et les trois issues de bug bash.

## 13. Conventions Git

- Branches : `main`, `develop`, puis des branches par fonctionnalité.
- Nommage : `feat/...`, `fix/...`, `perf/...`, `test/...`, `chore/...`, `docs/...`.
- Messages de commit en français, au format Conventional Commits : `feat(auth): ajouter la session persistante`.
- Les branches de fonctionnalité sont fusionnées dans `develop` avec `--no-ff`.
- `main` ne reçoit que la version validée par le responsable du groupe.
- Chaque fusion dans `develop` est relue par un autre membre.

## 14. Limites connues

- Les produits sont stockés dans PostgreSQL quand `DATABASE_URL` est renseigné (`db/schema.sql` et `db/seed.sql`, commande `npm run db:seed`). Sans base, les données initiales sont utilisées.
- Les commandes sont stockées dans un cookie HttpOnly et non dans une base de données. Elles sont donc liées au navigateur et limitées à quatre entrées.
- Le compte de démonstration est unique et les identifiants sont configurables par variables d'environnement. Il n'existe pas d'inscription publique.
- Le paiement réel dépend de la validation du compte Monetbil et des clés de production.
- Le panier est conservé dans `localStorage` et n'est pas synchronisé entre appareils.
- Il n'y a pas d'espace d'administration pour gérer les produits ou les commandes.
- Les images produits sont des URL réelles (Unsplash par défaut), modifiables directement dans la table `products`.

## 15. Démonstration

Chaque membre présente sa partie en une minute pendant le stand-up du vendredi.

| Ordre | Membre | Point à montrer |
| --- | --- | --- |
| 1 | MBEMBA Paul Divin Aymerol | Accueil, catalogue, filtre, fiche produit et recherche. |
| 2 | WASSANGOU Flamme Du Ciel | Connexion, session persistante, route protégée et modes de rendu. |
| 3 | DELLOT-MVOUMINA Alty | Panier, formulaire, paiement simulé, confirmation et historique. |
| 4 | MILANDOU Loïc Divin Céleste | Variables Vercel, URL de production et rapport Lighthouse. |
| 5 | MATONDO Jonathan | Tests Playwright, revue et issues de bug bash. |

Le rapport Lighthouse mobile se trouve dans [docs/lighthouse/scores-mobile.png](docs/lighthouse/scores-mobile.png).
