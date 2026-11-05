# Backlog et répartition

Ce fichier est la source de vérité du backlog de Shop&Pay. Il sert à créer les issues, les branches et les pull requests sur GitHub. Les numéros de PR sont indicatifs et correspondent à l'ordre de création prévu, après les 26 issues.

État au 5 novembre 2026 : **22 tickets fermés sur 26**, soit environ **85 %** du backlog. Les quatre tickets ouverts sont le déploiement réel, la validation Monetbil, le bug bash et l'évolution vers une base de données.

## 1. Tableau des tickets

| N° | Ticket | Critères d'acceptation | Priorité | Statut | Assigné | Branche | PR | Revue |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Initialiser le projet Next.js 15 et TypeScript | `package.json`, `tsconfig.json`, scripts `dev`, `build`, `start` et `typecheck`. Pas d'ESLint. | P0 | Fermé | WASSANGOU Flamme | `feat/design-system` | #27 | MBEMBA |
| 2 | Mettre en place les tokens et les feuilles CSS | Variables de couleur, espacement et typographie. Fichiers séparés réunis par `styles/main.css`. | P1 | Fermé | WASSANGOU Flamme | `feat/design-system` | #27 | MBEMBA |
| 3 | Construire le layout global | En-tête, navigation, recherche, panier, pied de page, lien d'évitement et repères ARIA. | P1 | Fermé | WASSANGOU Flamme | `feat/design-system` | #27 | MBEMBA |
| 4 | Créer la page d'accueil en SSG | Hero, services, catégories, sélection de produits et explication du paiement. `force-static`. | P1 | Fermé | MBEMBA Paul Divin | `feat/catalogue` | #28 | DELLOT-MVOUMINA |
| 5 | Rédiger les données des 12 produits | Quatre catégories, prix en FCFA, stocks, descriptions, caractéristiques et illustrations SVG. | P0 | Fermé | MBEMBA Paul Divin | `feat/catalogue` | #28 | DELLOT-MVOUMINA |
| 6 | Construire le catalogue en ISR | Filtre par catégorie, tri par prix ou nom, 12 cartes et `revalidate = 300`. | P0 | Fermé | MBEMBA Paul Divin | `feat/catalogue` | #28 | DELLOT-MVOUMINA |
| 7 | Générer les fiches produit en SSG | `generateStaticParams`, `dynamicParams = false`, 404 sur slug inconnu et produits associés. | P0 | Fermé | MBEMBA Paul Divin | `feat/catalogue` | #28 | DELLOT-MVOUMINA |
| 8 | Ajouter la recherche en SSR | Paramètre `q`, recherche sans accents, résultats vides et suggestions. `force-dynamic`. | P1 | Fermé | MBEMBA Paul Divin | `feat/catalogue` | #28 | DELLOT-MVOUMINA |
| 9 | Configurer Auth.js avec Credentials | Connexion, session JWT de 30 jours, comparaison scrypt et callbacks de session. | P0 | Fermé | WASSANGOU Flamme | `feat/auth` | #29 | MATONDO |
| 10 | Créer la page de connexion | Formulaire accessible, messages d'erreur, compte de démonstration et `callbackUrl` sûr. | P0 | Fermé | WASSANGOU Flamme | `feat/auth` | #29 | MATONDO |
| 11 | Protéger les routes avec le middleware | `/compte` et `/paiement` redirigent vers `/connexion` sans session. | P0 | Fermé | WASSANGOU Flamme | `feat/auth` | #29 | MATONDO |
| 12 | Afficher le compte, l'historique et la déconnexion | Informations de session, quatre dernières commandes et bouton de déconnexion. | P1 | Fermé | WASSANGOU Flamme | `feat/auth` | #29 | MATONDO |
| 13 | Persister le panier dans le navigateur | Ajout, suppression, quantité maximale de 10 et restauration depuis `localStorage`. | P0 | Fermé | DELLOT-MVOUMINA Alty | `feat/cart-checkout` | #30 | WASSANGOU |
| 14 | Construire la page panier | Lignes, quantités, sous-total, livraison offerte dès 50 000 FCFA et panier vide. | P0 | Fermé | DELLOT-MVOUMINA Alty | `feat/cart-checkout` | #30 | WASSANGOU |
| 15 | Valider le formulaire de commande | Champs obligatoires, téléphone camerounais, validation côté client et côté serveur. | P0 | Fermé | DELLOT-MVOUMINA Alty | `feat/cart-checkout` | #30 | WASSANGOU |
| 16 | Intégrer le client Monetbil et la signature | Widget, `checkPayment`, signature MD5 et détection du mode démonstration. | P0 | Fermé | DELLOT-MVOUMINA Alty | `feat/cart-checkout` | #30 | WASSANGOU |
| 17 | Créer les routes de paiement | `initier`, `retour`, `notification`, vérification de signature et recalcul du panier. | P0 | Fermé | DELLOT-MVOUMINA Alty | `feat/cart-checkout` | #30 | WASSANGOU |
| 18 | Ajouter la simulation et l'historique | Page de simulation, cookies de commande, confirmation et vidage du panier après succès. | P0 | Fermé | DELLOT-MVOUMINA Alty | `feat/cart-checkout` | #30 | WASSANGOU |
| 19 | Définir les stratégies SSG, ISR et SSR | Tableau de rendu, `force-static`, `revalidate`, `force-dynamic`, sitemap et robots. | P1 | Fermé | WASSANGOU Flamme | `perf/rendering` | #31 | MILANDOU |
| 20 | Écrire les tests Playwright | Six tests : pages publiques, recherche, protection, erreur, session et parcours d'achat. | P0 | Fermé | MATONDO Jonathan | `test/quality` | #32 | DELLOT-MVOUMINA |
| 21 | Corriger l'accessibilité et lancer Lighthouse | Score Accessibilité 100 sur mobile, capture et rapport ajoutés au dépôt. | P0 | Fermé | WASSANGOU Flamme | `perf/rendering` | #31 | MILANDOU |
| 22 | Rédiger le README, le guide de déploiement et le backlog | Compte de test, rendu, architecture, variables, tests, équipe et limites. | P1 | Fermé | MILANDOU Loïc Divin | `docs/readme` | #34 | MATONDO |
| 23 | Déployer l'application sur Vercel | URL stable, variables de production, compte de test fonctionnel et aucun secret dans Git. | P0 | Ouvert | MILANDOU Loïc Divin | `chore/deployment` | #33 | WASSANGOU |
| 24 | Valider le paiement Monetbil avec les clés réelles | Paiement réel de bout en bout, notification signée et statut correct dans la confirmation. | P0 | Ouvert | DELLOT-MVOUMINA Alty | `fix/monetbil-production` | à ouvrir | WASSANGOU |
| 25 | Réaliser le bug bash sur le dépôt du groupe 9 | Trois issues reproductibles publiées sur le dépôt du groupe cible. | P1 | Ouvert | MATONDO Jonathan | sans objet | sans objet | DELLOT-MVOUMINA |
| 26 | Étudier la persistance des commandes en base | Schéma de commandes, migration des cookies et suppression des limites de stockage. | P2 | Ouvert | WASSANGOU Flamme | à créer | à ouvrir | MILANDOU |

## 2. Détail des tickets ouverts

### Ticket 23 : déployer l'application sur Vercel

- Créer le projet Vercel à partir du dépôt GitHub.
- Ajouter `AUTH_SECRET`, `AUTH_URL`, `NEXT_PUBLIC_SITE_URL`, `AUTH_DEMO_EMAIL` et `AUTH_DEMO_PASSWORD`.
- Laisser `MONETBIL_DEMO=true` tant que les clés réelles ne sont pas validées.
- Vérifier la connexion, les routes protégées et le paiement simulé sur l'URL publique.
- Reporter l'URL dans le README et dans le champ « URL de production ».
- Ne jamais copier `.env.local` dans le dépôt.

### Ticket 24 : valider le paiement Monetbil avec les clés réelles

- Renseigner `MONETBIL_SERVICE_KEY` et `MONETBIL_SERVICE_SECRET` dans Vercel.
- Passer `MONETBIL_DEMO` à `false`.
- Configurer les URL de retour et de notification dans Monetbil.
- Effectuer un paiement de faible montant avec MTN ou Orange Money.
- Vérifier la signature de la notification et le statut renvoyé par `checkPayment`.
- Contrôler que la commande apparaît dans `/compte`.
- Revenir au mode démonstration si les clés ne sont plus disponibles.

### Ticket 25 : bug bash sur le dépôt du groupe 9

- Choisir trois défauts reproductibles sur l'application du groupe cible.
- Publier une issue par défaut avec le gabarit de la section 4.
- Ajouter le label `bug-bash`, le navigateur et la version du système.
- Ne pas corriger le dépôt cible, seulement documenter et signaler.

### Ticket 26 : persistance des commandes en base

- Choisir une base compatible avec Vercel, par exemple Postgres ou KV.
- Créer une table `orders` avec référence, client, lignes, montants, statut et date.
- Remplacer la lecture du cookie `shoppay_orders` par une requête serveur.
- Conserver le cookie uniquement pour la commande en attente.
- Ajouter une migration et documenter la variable de connexion.
- Vérifier que l'historique reste lié au compte connecté.

## 3. Branches, pull requests et revues

| Branche | Tickets | Auteur | PR | Revue | État |
| --- | --- | --- | --- | --- | --- |
| `feat/design-system` | 1, 2, 3 | WASSANGOU Flamme | #27 | MBEMBA Paul Divin | Fusionnée dans `develop` |
| `feat/catalogue` | 4, 5, 6, 7, 8 | MBEMBA Paul Divin | #28 | DELLOT-MVOUMINA Alty | Fusionnée dans `develop` |
| `feat/auth` | 9, 10, 11, 12 | WASSANGOU Flamme | #29 | MATONDO Jonathan | Fusionnée dans `develop` |
| `feat/cart-checkout` | 13, 14, 15, 16, 17, 18 | DELLOT-MVOUMINA Alty | #30 | WASSANGOU Flamme | Fusionnée dans `develop` |
| `perf/rendering` | 19, 21 | WASSANGOU Flamme | #31 | MILANDOU Loïc Divin | Fusionnée dans `develop` |
| `test/quality` | 20 | MATONDO Jonathan | #32 | DELLOT-MVOUMINA Alty | Fusionnée dans `develop` |
| `chore/deployment` | 23 | MILANDOU Loïc Divin | #33 | WASSANGOU Flamme | Fusionnée dans `develop`, déploiement à effectuer |
| `docs/readme` | 22 | MILANDOU Loïc Divin | #34 | MATONDO Jonathan | Fusionnée dans `develop` |

Chaque membre possède au moins une pull request fusionnée et relue par un autre membre. `main` reste réservé à la validation finale du responsable du groupe.

## 4. Bug bash sur le dépôt du groupe 9

Les trois issues ci-dessous doivent être créées sur le dépôt du groupe cible. Remplacer `<groupe-09>` et `<depot>` par les valeurs réelles. Ajouter une capture d'écran et la version du navigateur dans chaque issue.

### BB-1 : le panier se vide après actualisation

- **Dépôt** : `<groupe-09>/<depot>`
- **Sévérité** : majeure
- **Environnement** : Chrome 141, Windows 11, version de production
- **Étapes** :
  1. Ouvrir la fiche d'un produit disponible.
  2. Cliquer sur « Ajouter au panier ».
  3. Vérifier que le compteur du panier passe à 1.
  4. Actualiser la page avec `F5`.
- **Attendu** : le produit reste dans le panier.
- **Observé** : le compteur revient à zéro et la page panier est vide.
- **Critère de reproduction** : le défaut apparaît à chaque actualisation, en navigation normale.
- **Statut** : à ouvrir, label `bug-bash`.

### BB-2 : la déconnexion laisse la session active

- **Dépôt** : `<groupe-09>/<depot>`
- **Sévérité** : majeure
- **Environnement** : Chrome 141, Windows 11, version de production
- **Étapes** :
  1. Se connecter avec un compte de test.
  2. Ouvrir une page protégée pour vérifier l'accès.
  3. Cliquer sur « Se déconnecter ».
  4. Revenir à la page protégée avec le bouton Précédent.
- **Attendu** : la page protégée redirige vers la connexion.
- **Observé** : le contenu protégé reste accessible après le retour arrière.
- **Critère de reproduction** : la session reste visible jusqu'à la fermeture du navigateur.
- **Statut** : à ouvrir, label `bug-bash`.

### BB-3 : erreur 500 sur une recherche avec apostrophe

- **Dépôt** : `<groupe-09>/<depot>`
- **Sévérité** : critique
- **Environnement** : Chrome 141, Windows 11, version de production
- **Étapes** :
  1. Ouvrir la page de recherche.
  2. Saisir `d'écoute` dans le champ.
  3. Valider la recherche.
- **Attendu** : une page de résultats, même vide, s'affiche correctement.
- **Observé** : la page renvoie une erreur 500 et la console serveur affiche une erreur de requête.
- **Critère de reproduction** : le défaut apparaît avec toute chaîne contenant une apostrophe.
- **Statut** : à ouvrir, label `bug-bash`.

## 5. Règles de revue

- Une pull request ne peut pas être fusionnée par son auteur.
- La revue vérifie au minimum : le typecheck, le build, le parcours concerné et l'absence de secret.
- Les commentaires de revue restent en français et indiquent le fichier et le comportement attendu.
- Une branche est fusionnée dans `develop` avec `git merge --no-ff`.
- Une issue est fermée uniquement quand son critère d'acceptation est vérifié.
- Les tickets ouverts restent visibles dans le backlog et expliquent le blocage éventuel.
