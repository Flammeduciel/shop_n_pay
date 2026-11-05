export const siteConfig = {
  name: "Shop&Pay",
  description:
    "Boutique en ligne d'objets utiles pour l'audio, la mobilité, la maison et le bureau. Livraison au Cameroun et paiement par Mobile Money.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  email: "bonjour@shoppay.cm",
  phone: "+237 6 90 00 00 00",
  address: "Douala, Cameroun",
};

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
