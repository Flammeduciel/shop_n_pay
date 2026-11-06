import { expect, test, type Page } from "@playwright/test";

const demoEmail = process.env.AUTH_DEMO_EMAIL ?? "demo@shoppay.cm";
const demoPassword = process.env.AUTH_DEMO_PASSWORD ?? "Demo1234!";

async function login(page: Page) {
  await page.goto("/connexion");
  await page.getByLabel("Mot de passe").fill(demoPassword);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL(/\/compte$/);
}

test("les pages publiques se chargent", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Des objets utiles",
  );

  await page.getByRole("navigation", { name: "Navigation principale" }).getByRole("link", { name: "Catalogue" }).click();
  await expect(page).toHaveURL(/\/catalogue$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Des objets choisis",
  );
  await expect(page.locator(".product-card")).toHaveCount(12);

  await page.getByRole("button", { name: "Audio", exact: true }).click();
  await expect(page.locator(".product-card")).toHaveCount(3);
});

test("la recherche dynamique renvoie le bon produit", async ({ page }) => {
  await page.goto("/recherche?q=casque");
  await expect(page.getByText("1 résultat pour « casque »")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Casque studio Kola" }),
  ).toBeVisible();

  await page.goto("/recherche?q=produit-inexistant");
  await expect(page.getByText("Aucun produit trouvé")).toBeVisible();
});

test("une page protégée redirige vers la connexion", async ({ page }) => {
  await page.goto("/compte");
  await expect(page).toHaveURL(/\/connexion\?callbackUrl=%2Fcompte/);

  await page.goto("/paiement");
  await expect(page).toHaveURL(/\/connexion\?callbackUrl=%2Fpaiement/);
});

test("les identifiants invalides affichent une erreur", async ({ page }) => {
  await page.goto("/connexion");
  await page.getByLabel("Mot de passe").fill("mauvais-mot-de-passe");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page.getByText("Adresse e-mail ou mot de passe incorrect.")).toBeVisible();
});

test("connexion, session persistante et déconnexion", async ({ page }) => {
  await login(page);
  await expect(
    page.getByRole("heading", { level: 1, name: "Bonjour, Client démo" }),
  ).toBeVisible();

  await page.reload();
  await expect(page).toHaveURL(/\/compte$/);
  await expect(page.getByText(demoEmail)).toBeVisible();

  await page.getByRole("button", { name: "Se déconnecter" }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.goto("/compte");
  await expect(page).toHaveURL(/\/connexion/);
});

test("parcours panier et commande jusqu'au paiement", async ({ page }) => {
  await page.goto("/produit/casque-studio-kola");
  await page.getByRole("button", { name: "Ajouter au panier" }).click();
  await expect(page.getByRole("link", { name: /Panier, 1 article/ })).toBeVisible();

  await page.goto("/panier");
  await expect(page.getByRole("heading", { name: "Casque studio Kola" })).toBeVisible();
  await page.getByRole("link", { name: "Passer la commande" }).click();
  await expect(page).toHaveURL(/\/connexion\?callbackUrl=%2Fpaiement/);

  await page.getByLabel("Mot de passe").fill(demoPassword);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL(/\/paiement$/);

  await page.getByLabel("Téléphone Mobile Money").fill("690000000");
  await page.getByLabel("Adresse de livraison").fill("Rue des Écoles, Bonapriso");
  await expect(page.getByRole("button", { name: /^Payer / })).toBeVisible();
});
