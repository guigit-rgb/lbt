import { CATEGORIES, type Categorie } from "./db/schema";

export type FilterWidget = "location" | "select" | "range" | "text";

export interface FilterField {
  key: string;
  label: string;
  widget: FilterWidget;
}

export interface ListingConfig {
  categorie: Categorie;
  label: string;
  h1: string;
  filters: FilterField[];
  supportsAvisExpert?: boolean;
  popularFilters?: string[];
}

const LOCATION_FILTER: FilterField = { key: "localisation", label: "Choisir une localisation", widget: "location" };
const PRIX_FILTER: FilterField = { key: "prix", label: "Prix", widget: "range" };

const ENRICHED: Record<string, ListingConfig> = {
  vehicules: {
    categorie: "vehicules",
    label: "Véhicules",
    h1: "Annonces Véhicules",
    filters: [
      LOCATION_FILTER,
      { key: "marque", label: "Marque", widget: "select" },
      { key: "modele", label: "Modèle", widget: "select" },
      { key: "annee", label: "Année-modèle", widget: "range" },
      { key: "typeVehicule", label: "Type de véhicule", widget: "select" },
      { key: "carburant", label: "Énergie", widget: "select" },
      { key: "boite", label: "Boîte de vitesse", widget: "select" },
      { key: "kilometrage", label: "Kilométrage", widget: "range" },
      { key: "puissanceDin", label: "Puissance DIN", widget: "range" },
      { key: "critAir", label: "Crit'air", widget: "select" },
      PRIX_FILTER,
    ],
    popularFilters: [
      "Voitures",
      "Utilitaires",
      "Motos",
      "Camions",
      "Caravaning",
      "Nautisme",
      "Peugeot",
      "Renault",
      "Volkswagen",
      "Audi",
      "BMW",
      "Mercedes",
      "Équipement auto",
      "Vélos",
    ],
  },
  loisirs: {
    categorie: "loisirs",
    label: "Loisirs",
    h1: "Annonces Loisirs",
    filters: [
      LOCATION_FILTER,
      { key: "sous_categorie", label: "Catégorie", widget: "select" },
      { key: "etat_produit", label: "État", widget: "select" },
      PRIX_FILTER,
    ],
    supportsAvisExpert: true,
    popularFilters: [
      "Vélos",
      "Jeux & Jouets",
      "Sport & Plein air",
      "Livres",
      "Collection",
      "Équipements vélos",
      "DVD - Films",
      "CD - Musique",
      "Antiquités",
      "Instruments de musique",
      "Vinyles",
      "Modélisme",
      "Vins & Gastronomie",
      "Billetterie",
      "Loisirs créatifs",
    ],
  },
  animaux: {
    categorie: "animaux",
    label: "Animaux",
    h1: "Annonces Animaux, chiot, chaton",
    filters: [LOCATION_FILTER, PRIX_FILTER, { key: "type_animal", label: "Type d'animal", widget: "select" }],
  },
};

const GENERIC_LABELS: Record<string, string> = {
  immobilier: "Immobilier",
  "locations-vacances": "Locations de vacances",
  emploi: "Emploi",
  mode: "Mode",
  "maison-jardin": "Maison & jardin",
  electronique: "Électronique",
  "materiel-pro": "Matériel pro",
  famille: "Famille",
  services: "Services",
  autres: "Autres",
  dons: "Dons",
};

function genericConfig(categorie: Categorie): ListingConfig {
  const label = GENERIC_LABELS[categorie] ?? categorie;
  return {
    categorie,
    label,
    h1: `Annonces ${label}`,
    filters: [LOCATION_FILTER, PRIX_FILTER],
  };
}

const FILTERS_BY_CATEGORY: Record<Categorie, ListingConfig> = Object.fromEntries(
  CATEGORIES.map((categorie) => [categorie, ENRICHED[categorie] ?? genericConfig(categorie)])
) as Record<Categorie, ListingConfig>;

export function getFiltersForCategory(categorie: Categorie): ListingConfig {
  return FILTERS_BY_CATEGORY[categorie];
}
