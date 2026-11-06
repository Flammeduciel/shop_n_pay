export type CategorySlug = "audio" | "mobilite" | "maison" | "bureau";

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
};

export type Product = {
  slug: string;
  name: string;
  category: CategorySlug;
  price: number;
  summary: string;
  description: string;
  details: string[];
  image: string;
  imageAlt: string;
  stock: number;
  featured?: boolean;
  badge?: string;
};

export const categories: Category[] = [
  {
    slug: "audio",
    name: "Audio",
    description: "Casques, enceintes et écouteurs pour écouter chez soi ou en déplacement.",
  },
  {
    slug: "mobilite",
    name: "Mobilité",
    description: "Chargeurs, batteries et accessoires qui suivent le rythme de la journée.",
  },
  {
    slug: "maison",
    name: "Maison",
    description: "Lumière, table et textile pour rendre les espaces plus agréables.",
  },
  {
    slug: "bureau",
    name: "Bureau",
    description: "Carnets, stylos et rangements simples pour travailler sans distraction.",
  },
];

export const products: Product[] = [
  {
    slug: "casque-studio-kola",
    name: "Casque studio Kola",
    category: "audio",
    price: 45000,
    summary: "Un casque fermé pour écouter et travailler sans être dérangé.",
    description:
      "Le Kola isole correctement du bruit ambiant sans serrer la tête. Les coussinets se remplacent et l'arceau se range à plat dans la housse fournie.",
    details: [
      "Transducteurs de 40 mm",
      "Bluetooth 5.3 et prise jack 3,5 mm",
      "Autonomie annoncée de 38 heures",
      "Poids de 265 g",
    ],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Casque audio fermé posé sur un fond beige",
    stock: 12,
    featured: true,
    badge: "Sélection",
  },
  {
    slug: "enceinte-nomade-bassa",
    name: "Enceinte nomade Bassa",
    category: "audio",
    price: 32500,
    summary: "Une enceinte compacte, pensée pour la maison et les déplacements.",
    description:
      "La Bassa tient dans un sac et diffuse un son équilibré dans une pièce moyenne. La dragonne en tissu permet de l'accrocher ou de la porter facilement.",
    details: [
      "Puissance de 20 W",
      "Bluetooth 5.2",
      "Autonomie annoncée de 16 heures",
      "Résistance aux éclaboussures IPX5",
    ],
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Enceinte portable rectangulaire avec sa dragonne",
    stock: 8,
    featured: true,
  },
  {
    slug: "ecouteurs-fil-wouri",
    name: "Écouteurs Fil Wouri",
    category: "audio",
    price: 18000,
    summary: "Des écouteurs légers pour les trajets quotidiens.",
    description:
      "Le format intra-auriculaire reste discret et stable. Le boîtier de charge ajoute deux recharges complètes et se glisse dans une poche.",
    details: [
      "Bluetooth 5.3",
      "Autonomie de 6 heures par charge",
      "Boîtier de charge USB-C",
      "Trois tailles d'embouts fournies",
    ],
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Écouteurs sans fil et leur boîtier de charge",
    stock: 20,
  },
  {
    slug: "chargeur-rapide-65w",
    name: "Chargeur rapide 65 W",
    category: "mobilite",
    price: 15000,
    summary: "Un seul bloc pour l'ordinateur, la tablette et le téléphone.",
    description:
      "Le chargeur propose deux ports USB-C et un port USB-A. La charge se répartit automatiquement selon les appareils branchés.",
    details: [
      "65 W sur le port USB-C principal",
      "Deux ports USB-C et un port USB-A",
      "Protection contre les surtensions",
      "Câble USB-C de 1,5 m inclus",
    ],
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Chargeur secteur compact avec deux ports USB-C",
    stock: 16,
  },
  {
    slug: "batterie-externe-20000",
    name: "Batterie externe 20 000 mAh",
    category: "mobilite",
    price: 24000,
    summary: "De quoi recharger un téléphone plusieurs fois pendant un déplacement.",
    description:
      "La batterie affiche le niveau restant sur une petite rangée de diodes. Elle accepte la charge rapide en entrée comme en sortie.",
    details: [
      "Capacité de 20 000 mAh",
      "Charge rapide 22,5 W",
      "Deux sorties USB-A et une sortie USB-C",
      "Poids de 410 g",
    ],
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Batterie externe avec indicateurs de charge",
    stock: 9,
  },
  {
    slug: "support-telephone-bois",
    name: "Support téléphone en bois",
    category: "mobilite",
    price: 9500,
    summary: "Un support stable pour poser le téléphone pendant la journée.",
    description:
      "Taillé dans du bois clair, le support accueille le téléphone en portrait comme en paysage. La rainure centrale laisse passer le câble de charge.",
    details: [
      "Bois d'hévéa huilé",
      "Compatible avec la plupart des téléphones",
      "Rainure pour le câble de charge",
      "Fabrication locale",
    ],
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Support en bois avec un téléphone posé dessus",
    stock: 14,
  },
  {
    slug: "lampe-bureau-mungo",
    name: "Lampe de bureau Mungo",
    category: "maison",
    price: 21000,
    summary: "Une lumière chaude et dirigée pour travailler le soir.",
    description:
      "Le bras orientable place la lumière là où elle est utile. Le variateur à molette permet de passer d'une lumière douce à une lumière plus franche.",
    details: [
      "LED de 6 W, lumière chaude",
      "Bras orientable en métal",
      "Variateur d'intensité",
      "Prise USB pour recharger un téléphone",
    ],
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Lampe de bureau à bras orientable",
    stock: 7,
    featured: true,
  },
  {
    slug: "carafe-filtre-sanaga",
    name: "Carafe filtre Sanaga",
    category: "maison",
    price: 14500,
    summary: "Une carafe en verre pour garder de l'eau fraîche sur la table.",
    description:
      "La carafe contient un litre et se ferme avec un couvercle en liège. Le filtre amovible retient les morceaux de fruits ou de menthe.",
    details: [
      "Verre borosilicate, 1 litre",
      "Couvercle en liège",
      "Filtre amovible en inox",
      "Compatible avec le lave-vaisselle",
    ],
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Carafe en verre avec un couvercle en liège",
    stock: 11,
  },
  {
    slug: "plaid-coton-dibamba",
    name: "Plaid coton Dibamba",
    category: "maison",
    price: 27000,
    summary: "Un plaid léger en coton tissé pour les soirées plus fraîches.",
    description:
      "Le tissage serré garde le plaid souple après lavage. Les rayures discrètes s'accordent avec un canapé clair comme avec un lit en bois.",
    details: [
      "100 % coton",
      "Dimensions de 130 x 180 cm",
      "Tissage local",
      "Lavage à 30 degrés",
    ],
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Plaid en coton plié avec des rayures fines",
    stock: 6,
  },
  {
    slug: "carnet-relie-nyong",
    name: "Carnet relié Nyong",
    category: "bureau",
    price: 7500,
    summary: "Un carnet solide pour les notes et les listes du quotidien.",
    description:
      "Les pages ivoire acceptent le stylo plume sans transpercer. La reliure cousue permet d'ouvrir le carnet bien à plat.",
    details: [
      "192 pages lignées",
      "Papier 90 g/m²",
      "Reliure cousue",
      "Couverture en carton recyclé",
    ],
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Carnet relié fermé avec un élastique",
    stock: 24,
    featured: true,
  },
  {
    slug: "stylo-laiton-benoue",
    name: "Stylo laiton Bénoué",
    category: "bureau",
    price: 12000,
    summary: "Un stylo à bille simple, en laiton brossé.",
    description:
      "Le corps en laiton prend une patine avec le temps. La recharge standard se remplace en dévissant la partie basse du stylo.",
    details: [
      "Corps en laiton brossé",
      "Recharge à bille standard",
      "Poids de 32 g",
      "Livré dans un étui en carton",
    ],
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Stylo en laiton posé en diagonale",
    stock: 18,
  },
  {
    slug: "organisateur-bureau-waza",
    name: "Organisateur de bureau Waza",
    category: "bureau",
    price: 16500,
    summary: "Un plateau en bois pour ranger stylos, carnet et petits objets.",
    description:
      "Trois compartiments de tailles différentes gardent le bureau lisible. Le plateau se déplace facilement pour nettoyer dessous.",
    details: [
      "Bois de hévéa huilé",
      "Trois compartiments",
      "Dimensions de 28 x 18 cm",
      "Fabrication locale",
    ],
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Organisateur de bureau en bois avec trois compartiments",
    stock: 10,
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getCategoryName(slug: CategorySlug): string {
  return getCategory(slug)?.name ?? slug;
}

export function getFeaturedProducts(limit = 4): Product[] {
  return products.filter((product) => product.featured).slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  const sameCategory = products.filter(
    (candidate) => candidate.category === product.category && candidate.slug !== product.slug,
  );
  const others = products.filter(
    (candidate) => candidate.category !== product.category && candidate.slug !== product.slug,
  );

  return [...sameCategory, ...others].slice(0, limit);
}

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function searchProducts(query: string): Product[] {
  const term = normalizeText(query);
  if (!term) return [];

  return products.filter((product) => {
    const haystack = normalizeText(
      [
        product.name,
        product.summary,
        product.description,
        getCategoryName(product.category),
        product.details.join(" "),
      ].join(" "),
    );

    return haystack.includes(term);
  });
}
