export const siteConfig = {
  name: "Shop&Pay",
  description:
    "Boutique en ligne d'objets utiles pour l'audio, la mobilité, la maison et le bureau. Livraison au Congo et paiement par Mobile Money.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  email: "bonjour@shoppay.cg",
  phone: "+242 06 000 00 00",
  address: "Brazzaville, Congo",
};

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
