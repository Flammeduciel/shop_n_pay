# Déploiement sur Vercel

Ce document décrit le déploiement de Shop&Pay sur Vercel et la configuration du paiement Monetbil.

Le projet est une application Next.js 15 sans serveur séparé. Vercel exécute le build, les routes API et le middleware. Les données de démonstration sont conservées dans des cookies, aucune base de données n'est nécessaire.

## 1. Prérequis

- Compte Vercel.
- Dépôt GitHub contenant le projet.
- Node.js 20 ou plus récent pour les tests locaux.
- Compte Monetbil avec une clé de service et une clé secrète pour le paiement réel.

## 2. Importer le projet

1. Se connecter à [vercel.com](https://vercel.com).
2. Cliquer sur **Add New**, puis **Project**.
3. Importer le dépôt GitHub `shop_n_pay`.
4. Vérifier les réglages :
   - Framework Preset : **Next.js**
   - Root Directory : la racine du dépôt
   - Build Command : `npm run build`
   - Install Command : `npm install`
   - Output Directory : laisser vide
   - Node.js Version : 20.x ou plus récent
5. Ne pas lancer le déploiement tout de suite. Ajouter d'abord les variables d'environnement.

## 3. Variables d'environnement

Dans **Project Settings**, puis **Environment Variables**, ajouter les valeurs pour **Production**, **Preview** et **Development** selon le besoin.

| Nom | Exemple production | Obligatoire |
| --- | --- | --- |
| `AUTH_SECRET` | valeur aléatoire de 32 octets | Oui |
| `AUTH_URL` | `https://shop-n-pay.vercel.app` | Oui |
| `AUTH_DEMO_EMAIL` | `demo@shoppay.cm` | Non |
| `AUTH_DEMO_PASSWORD` | `Demo1234!` | Non |
| `NEXT_PUBLIC_SITE_URL` | `https://shop-n-pay.vercel.app` | Oui |
| `MONETBIL_SERVICE_KEY` | clé fournie par Monetbil | Pour le paiement réel |
| `MONETBIL_SERVICE_SECRET` | secret fourni par Monetbil | Pour le paiement réel |
| `MONETBIL_DEMO` | `false` en production avec clés | Non |
| `MONETBIL_LOGO_URL` | `https://shop-n-pay.vercel.app/icon.svg` | Non |

Générer le secret Auth.js avec :

```bash
openssl rand -base64 32
```

Sous PowerShell :

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Règles importantes :

- `AUTH_URL` et `NEXT_PUBLIC_SITE_URL` doivent correspondre au domaine réel, sans slash final.
- Utiliser la même valeur pour les deux variables.
- Modifier `NEXT_PUBLIC_SITE_URL` après l'ajout d'un domaine personnalisé, puis redéployer.
- Ne jamais placer de clé Monetbil dans une variable préfixée par `NEXT_PUBLIC_`.
- Le fichier `.env.local` ne doit pas être versionné.

## 4. Déployer

### Avec l'interface Vercel

1. Cliquer sur **Deploy**.
2. Attendre la fin du build.
3. Ouvrir l'URL fournie par Vercel.
4. Vérifier que la page d'accueil et le catalogue répondent.

### Avec la CLI Vercel

```bash
npm install -g vercel
vercel login
vercel link
vercel env add AUTH_SECRET production
vercel env add AUTH_URL production
vercel env add NEXT_PUBLIC_SITE_URL production
vercel env add AUTH_DEMO_EMAIL production
vercel env add AUTH_DEMO_PASSWORD production
vercel --prod
```

La CLI demande la valeur de chaque variable. Répéter l'opération pour `preview` si les aperçus doivent fonctionner avec l'authentification.

## 5. Configuration Monetbil

Dans l'espace Monetbil, renseigner les URL publiques du site.

| Élément | URL |
| --- | --- |
| Retour utilisateur | `https://shop-n-pay.vercel.app/api/paiement/retour` |
| Notification serveur | `https://shop-n-pay.vercel.app/api/paiement/notification` |
| Logo | `https://shop-n-pay.vercel.app/icon.svg` |

Ces URL sont aussi envoyées dans chaque requête de paiement par `lib/monetbil.ts`. Si Monetbil demande une liste blanche, ajouter le domaine Vercel.

Activer le paiement réel :

```text
MONETBIL_DEMO=false
MONETBIL_SERVICE_KEY=<clé>
MONETBIL_SERVICE_SECRET=<secret>
```

Après toute modification des clés, redéployer pour que les nouvelles variables soient disponibles.

Points de contrôle :

- Le retour Monetbil arrive sur `/api/paiement/retour` puis redirige vers la confirmation.
- La notification arrive sur `/api/paiement/notification` et vérifie la signature avant de contrôler le paiement.
- Le montant est recalculé côté serveur avant l'appel Monetbil.
- Le mode simulation reste accessible uniquement si `MONETBIL_DEMO=true` et si la commande en attente appartient au navigateur.

## 6. Après le déploiement

1. Ouvrir l'URL de production.
2. Vérifier la connexion avec `demo@shoppay.cm` et `Demo1234!`.
3. Ouvrir `/compte` sans session pour vérifier la redirection.
4. Ajouter un produit au panier, passer une commande et terminer le paiement simulé.
5. Vérifier la présence de la commande dans `/compte`.
6. Lancer Lighthouse mobile sur l'URL de production.
7. Vérifier que `robots.txt` et `sitemap.xml` utilisent le bon domaine.
8. Mettre à jour l'URL de production dans le README.

## 7. Liste de contrôle

- [ ] `npm run typecheck` passe en local.
- [ ] `npm run build` passe en local.
- [ ] `npm run test:e2e` passe avec 6 tests.
- [ ] `AUTH_SECRET` est défini sur Vercel.
- [ ] `AUTH_URL` et `NEXT_PUBLIC_SITE_URL` utilisent le domaine de production.
- [ ] Le compte de démonstration fonctionne.
- [ ] Les routes `/compte` et `/paiement` redirigent sans session.
- [ ] Le paiement simulé fonctionne quand les clés sont absentes.
- [ ] Les clés Monetbil sont présentes pour le paiement réel.
- [ ] Les URL de retour et de notification sont configurées chez Monetbil.
- [ ] Aucun secret n'apparaît dans le dépôt.
- [ ] Le rapport Lighthouse est ajouté au dépôt.
- [ ] L'URL de production est reportée dans le README.

## 8. Dépannage

### `UntrustedHost` ou redirection de connexion incorrecte

Vérifier `AUTH_URL`. Elle doit correspondre exactement au domaine utilisé, avec `https` en production.

### La session ne persiste pas

Vérifier que `AUTH_SECRET` est identique sur toutes les instances et que le navigateur accepte les cookies du domaine. Les cookies sont `HttpOnly`, `SameSite=Lax` et `Secure` en production.

### Le paiement reste en attente

Vérifier les URL de retour et de notification dans Monetbil, puis consulter les logs Vercel de `/api/paiement/retour` et `/api/paiement/notification`. Le statut dépend de la réponse de `checkPayment`.

### Erreur 502 à l'initialisation

Le serveur n'a pas obtenu de `payment_url`. Vérifier la clé de service, la signature et la disponibilité de Monetbil.

### Les images SVG ne s'affichent pas

Le projet autorise les SVG locaux dans `next.config.mjs`. Ne pas retirer `dangerouslyAllowSVG` sans remplacer les illustrations par des formats bitmap.

### Le build échoue sur Vercel mais passe en local

Supprimer `.next` et `node_modules`, puis relancer `npm ci` et `npm run build`. Vérifier aussi que la version de Node sur Vercel est compatible avec Next.js 15.
