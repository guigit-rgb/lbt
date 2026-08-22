import type { Categorie } from "./db/schema";

export interface FakeAd {
  id: string;
  categorie: Categorie;
  titre: string;
  sousLigne: string;
  prixLabel: string;
  fraicheur: string;
  thumbClass: string;
  photoUrl?: string;
  badges?: { label: string; variant?: "histovec" | "expert" | "urgent" }[];
  favori?: boolean;
  vendeur?: { initiale: string; couleur: string; nom: string };
}

export const HOMEPAGE_VEHICULES: FakeAd[] = [
  {
    id: "veh-1",
    categorie: "vehicules",
    titre: "Peugeot 205 GTI — 1988",
    sousLigne: "Toulouse · 87 000 km",
    prixLabel: "18 900 €",
    fraicheur: "Auj.",
    thumbClass: "ic-car",
    badges: [{ label: "Plaque floutée" }, { label: "HistoVec inclus", variant: "histovec" }],
    favori: true,
  },
  {
    id: "veh-2",
    categorie: "vehicules",
    titre: "Renault Clio V — 2019",
    sousLigne: "Particulier · 45 200 km",
    prixLabel: "11 400 €",
    fraicheur: "Auj.",
    thumbClass: "ic-car",
  },
  {
    id: "veh-3",
    categorie: "vehicules",
    titre: "Renault Trafic utilitaire",
    sousLigne: "Garage Meunier · Bordeaux",
    prixLabel: "14 200 €",
    fraicheur: "2 j.",
    thumbClass: "ic-van",
    badges: [{ label: "Pro vérifié" }, { label: "HistoVec inclus", variant: "histovec" }],
  },
  {
    id: "veh-4",
    categorie: "vehicules",
    titre: "Citroën C3 — 2016",
    sousLigne: "Particulier · 62 000 km",
    prixLabel: "6 300 €",
    fraicheur: "2 j.",
    thumbClass: "ic-car",
  },
  {
    id: "veh-5",
    categorie: "vehicules",
    titre: "Peugeot 3008 — 2021",
    sousLigne: "Garage Meunier · Bordeaux",
    prixLabel: "22 500 €",
    fraicheur: "3 j.",
    thumbClass: "ic-car",
  },
  {
    id: "veh-6",
    categorie: "vehicules",
    titre: "Porsche 911 GT3 Heritage — 2025",
    sousLigne: 'Édition spéciale "63" · comme neuve',
    prixLabel: "219 000 €",
    fraicheur: "Auj.",
    thumbClass: "ic-porsche",
    badges: [{ label: "Coup de cœur" }],
    favori: true,
  },
];

export const HOMEPAGE_LOISIRS: FakeAd[] = [
  {
    id: "loi-1",
    categorie: "loisirs",
    titre: "Montre automatique — années 60",
    sousLigne: "Révisée · Dijon",
    prixLabel: "640 €",
    fraicheur: "Auj.",
    thumbClass: "ic-watch",
    badges: [{ label: "Avis d'expert", variant: "expert" }],
    favori: true,
  },
  {
    id: "loi-2",
    categorie: "loisirs",
    titre: "Vinyles jazz — lot de 40",
    sousLigne: "Bon état · Lille",
    prixLabel: "120 €",
    fraicheur: "Auj.",
    thumbClass: "ic-vinyl",
  },
  {
    id: "loi-3",
    categorie: "loisirs",
    titre: "Meuble TV teck vintage",
    sousLigne: "Toulouse",
    prixLabel: "210 €",
    fraicheur: "1 j.",
    thumbClass: "ic-tv",
  },
  {
    id: "loi-4",
    categorie: "loisirs",
    titre: "Appareil photo argentique",
    sousLigne: "Fonctionnel, testé · Rennes",
    prixLabel: "85 €",
    fraicheur: "4 j.",
    thumbClass: "ic-camera",
  },
  {
    id: "loi-5",
    categorie: "loisirs",
    titre: "Service à thé porcelaine",
    sousLigne: "Collection complète · Nancy",
    prixLabel: "450 €",
    fraicheur: "6 j.",
    thumbClass: "ic-teapot",
  },
];

export const CATALOG_COUNTS: Partial<Record<Categorie, number>> = {
  vehicules: 2340,
  immobilier: 410,
  "locations-vacances": 35,
  emploi: 190,
  mode: 265,
  "maison-jardin": 330,
  electronique: 140,
  "materiel-pro": 95,
  loisirs: 860,
  animaux: 180,
  famille: 70,
  services: 85,
  autres: 58,
  dons: 24,
};

const VENDEURS = [
  { initiale: "N", couleur: "#2a7a5e", nom: "nouf" },
  { initiale: "P", couleur: "#c1592c", nom: "pucette" },
  { initiale: "G", couleur: "#1f4d3e", nom: "Garage Meunier" },
  { initiale: "O", couleur: "#1f6f78", nom: "odette" },
  { initiale: "J", couleur: "#3a6ea5", nom: "Julien_R" },
];

// Jeu de données factice par catégorie pour la page de listing (M0 : pas de lecture DB)
const LISTING_ADS: Partial<Record<Categorie, FakeAd[]>> = {
  vehicules: [
    ...HOMEPAGE_VEHICULES,
    {
      id: "veh-7",
      categorie: "vehicules",
      titre: "Peugeot 205 Rallye — 1991",
      sousLigne: "Reims · 98 000 km",
      prixLabel: "15 800 €",
      fraicheur: "3 j.",
      thumbClass: "ic-car",
    },
    {
      id: "veh-8",
      categorie: "vehicules",
      titre: "Renault 5 Alpine — 1987",
      sousLigne: "Lyon · même décennie",
      prixLabel: "19 900 €",
      fraicheur: "5 j.",
      thumbClass: "ic-car",
    },
  ],
  loisirs: HOMEPAGE_LOISIRS,
  animaux: [
    {
      id: "ani-1",
      categorie: "animaux",
      titre: "Chiot Berger Américain Miniature",
      sousLigne: "Vittersbourg · Pro",
      prixLabel: "1 000 €",
      fraicheur: "Auj.",
      thumbClass: "ic-dog",
      badges: [{ label: "À la une" }],
    },
    {
      id: "ani-2",
      categorie: "animaux",
      titre: "Superbes chiots Pomchi",
      sousLigne: "Poitiers · Pro",
      prixLabel: "1 000 €",
      fraicheur: "Auj.",
      thumbClass: "ic-dog",
      badges: [{ label: "À la une" }],
    },
    {
      id: "ani-3",
      categorie: "animaux",
      titre: "Chatons européens à réserver",
      sousLigne: "Rennes · Particulier",
      prixLabel: "Don",
      fraicheur: "2 j.",
      thumbClass: "ic-cat",
    },
  ],
  mode: [
    {
      id: "mode-1",
      categorie: "mode",
      titre: "Veste en cuir homme — taille L",
      sousLigne: "Bordeaux",
      prixLabel: "45 €",
      fraicheur: "Auj.",
      thumbClass: "ic-tv",
    },
    {
      id: "mode-2",
      categorie: "mode",
      titre: "Sac à main vintage",
      sousLigne: "Particulier · Nice",
      prixLabel: "30 €",
      fraicheur: "1 j.",
      thumbClass: "ic-teapot",
    },
  ],
  emploi: [
    {
      id: "emploi-1",
      categorie: "emploi",
      titre: "Recherche apprenti mécanicien",
      sousLigne: "Garage Meunier · Bordeaux",
      prixLabel: "CDI",
      fraicheur: "Auj.",
      thumbClass: "ic-van",
    },
  ],
  immobilier: [
    {
      id: "immo-1",
      categorie: "immobilier",
      titre: "T2 centre-ville",
      sousLigne: "Particulier · Nantes",
      prixLabel: "890 €/mois",
      fraicheur: "3 j.",
      thumbClass: "ic-house",
    },
  ],
};

export function getFakeAdsForCategory(categorie: Categorie): FakeAd[] {
  const existing = LISTING_ADS[categorie];
  if (existing) {
    return existing.map((ad, i) => ({
      ...ad,
      vendeur: ad.vendeur ?? VENDEURS[i % VENDEURS.length],
    }));
  }
  // Catégorie générique sans jeu de données dédié : quelques annonces factices minimales
  return Array.from({ length: 4 }).map((_, i) => ({
    id: `${categorie}-${i + 1}`,
    categorie,
    titre: `Annonce d'exemple ${i + 1} — ${categorie}`,
    sousLigne: "Particulier · France",
    prixLabel: `${(i + 1) * 25} €`,
    fraicheur: `${i + 1} j.`,
    thumbClass: "ic-teapot",
    vendeur: VENDEURS[i % VENDEURS.length],
  }));
}
