import type { Metadata, Viewport } from "next";
import "@/styles/main.css";
import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Shop&Pay | Objets utiles et paiement Mobile Money",
    template: "%s | Shop&Pay",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: "Groupe 10, Akieni Academy" }],
  keywords: [
    "boutique en ligne",
    "Cameroun",
    "Mobile Money",
    "MTN",
    "Orange Money",
    "audio",
    "bureau",
  ],
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Shop&Pay | Objets utiles et paiement Mobile Money",
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f3ec",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>
        <CartProvider>
          <SiteHeader />
          <main id="contenu" className="site-main">
            {children}
          </main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
