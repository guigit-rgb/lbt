import { CATEGORIES, type Categorie } from "./db/schema";
import {
  TYPES_BIEN,
  TYPES_VENTE,
  EXTERIEURS,
  ETAGES,
  EXPOSITIONS,
  CARACTERISTIQUES,
  ETATS_BIEN,
  DPE_CLASSES,
} from "./immobilier-types";
import type { FilterField } from "./filter-field";
import { SOUS_CATEGORIES, SUBCATEGORY_FILTERS, LOCATIONS_VACANCES, DONS } from "./subcategory-filters";

export type { FilterField, FilterWidget } from "./filter-field";

export interface ListingConfig {
  categorie: Categorie;
  label: string;
  h1: string;
  filters: FilterField[];
  supportsAvisExpert?: boolean;
  popularFilters?: string[];
  // Champs supplémentaires propres à chaque sous-catégorie (lib/
  // subcategory-filters.ts), fusionnés à `filters` par getFiltersForCategory
  // une fois qu'une valeur de sous_categorie est active — pas avant, pour ne
  // pas noyer le panneau de filtres tant qu'aucune sous-catégorie n'est
  // choisie (cohérent avec le fonctionnement réel de leboncoin.fr : les
  // filtres fins n'apparaissent qu'une fois entré dans une sous-catégorie).
  subCategoryFilters?: Record<string, FilterField[]>;
}

const LOCATION_FILTER: FilterField = { key: "localisation", label: "Choisir une localisation", widget: "location" };
const PRIX_FILTER: FilterField = { key: "prix", label: "Prix", widget: "range" };
const SALAIRE_FILTER: FilterField = { key: "prix", label: "Salaire", widget: "range" };

// Filtre de base "sous_categorie" pour une catégorie qui en a plusieurs (même
// mécanisme que Loisirs, déjà en place) — catalogue toujours affiché, sur le
// modèle déjà appliqué à Immobilier (retour de Nicolas du 2026-08-23).
function sousCategorieFilter(categorie: Categorie): FilterField {
  return { key: "sous_categorie", label: "Catégorie", widget: "select", catalogue: SOUS_CATEGORIES[categorie] };
}

const ENRICHED: Record<string, ListingConfig> = {
  vehicules: {
    categorie: "vehicules",
    label: "Véhicules",
    h1: "Annonces Véhicules",
    filters: [
      LOCATION_FILTER,
      { key: "marque", label: "Marque", widget: "marque" },
      { key: "modele", label: "Modèle", widget: "select" },
      { key: "annee", label: "Année-modèle", widget: "range" },
      { key: "typeVehicule", label: "Type de véhicule", widget: "select" },
      { key: "carburant", label: "Énergie", widget: "select" },
      { key: "boite", label: "Boîte de vitesse", widget: "select" },
      { key: "kilometrage", label: "Kilométrage", widget: "range" },
      { key: "puissanceDin", label: "Puissance DIN", widget: "range" },
      { key: "critAir", label: "Crit'air", widget: "select" },
      { key: "permis", label: "Permis", widget: "checkbox" },
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
    subCategoryFilters: SUBCATEGORY_FILTERS.loisirs,
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
    // "Type d'animal" et "État" ne sont plus systématiques : "Animaux
    // perdus" (relevé leboncoin) n'a ni Prix ni Type d'animal — désormais
    // propres à la sous-catégorie choisie, cf. subCategoryFilters ci-dessous.
    filters: [LOCATION_FILTER, sousCategorieFilter("animaux"), PRIX_FILTER],
    subCategoryFilters: SUBCATEGORY_FILTERS.animaux,
  },
  immobilier: {
    categorie: "immobilier",
    label: "Immobilier",
    h1: "Annonces Immobilier",
    // Relevé exhaustif des filtres leboncoin.fr (Immobilier > Ventes
    // immobilières, fourni par Nicolas le 2026-08-23) — ordre identique à la
    // référence. typeBien/typeVente/etage/exposition/etatBien/dpe/ascenseur
    // sont en widget "checkbox" (cocher plusieurs valeurs acceptées à la
    // fois), pas "select" : voir lib/annonce-filters.ts ATTRIBUT_MULTI_KEYS.
    filters: [
      LOCATION_FILTER,
      { key: "typeBien", label: "Type de bien", widget: "checkbox", catalogue: TYPES_BIEN },
      PRIX_FILTER,
      { key: "surfaceHabitable", label: "Surface habitable", widget: "range" },
      { key: "typeVente", label: "Type de vente", widget: "checkbox", catalogue: TYPES_VENTE },
      { key: "surfaceTerrain", label: "Surface du terrain", widget: "range" },
      { key: "pieces", label: "Pièces", widget: "range" },
      { key: "chambres", label: "Chambres", widget: "range" },
      { key: "exterieur", label: "Extérieur", widget: "checkbox", catalogue: EXTERIEURS },
      { key: "etage", label: "Étage de l'appartement", widget: "checkbox", catalogue: ETAGES },
      { key: "ascenseur", label: "Avec ascenseur", widget: "checkbox", catalogue: ["1"] },
      { key: "exposition", label: "Exposition", widget: "checkbox", catalogue: EXPOSITIONS },
      { key: "caracteristiques", label: "Caractéristiques", widget: "checkbox", catalogue: CARACTERISTIQUES },
      { key: "etatBien", label: "État du bien", widget: "checkbox", catalogue: ETATS_BIEN },
      { key: "dpe", label: "Classe énergie (DPE)", widget: "checkbox", catalogue: DPE_CLASSES },
    ],
    popularFilters: ["Maison", "Appartement", "Terrain", "Parking", "Balcon", "Jardin", "Piscine", "Avec ascenseur"],
  },
  "materiel-pro": {
    categorie: "materiel-pro",
    label: "Matériel pro",
    h1: "Annonces Matériel professionnel",
    filters: [LOCATION_FILTER, sousCategorieFilter("materiel-pro"), PRIX_FILTER],
    subCategoryFilters: SUBCATEGORY_FILTERS["materiel-pro"],
  },
  electronique: {
    categorie: "electronique",
    label: "Électronique",
    h1: "Annonces Électronique",
    filters: [LOCATION_FILTER, sousCategorieFilter("electronique"), PRIX_FILTER, DONS],
    subCategoryFilters: SUBCATEGORY_FILTERS.electronique,
  },
  emploi: {
    categorie: "emploi",
    label: "Emploi",
    h1: "Annonces Emploi",
    // "Salaire" plutôt que "Prix" (le champ reste `prix`, cf.
    // lib/annonce-filters.ts) — libellé plus juste pour cette catégorie,
    // relevé leboncoin ("Tri : Salaires croissants/décroissants").
    filters: [LOCATION_FILTER, sousCategorieFilter("emploi"), SALAIRE_FILTER],
    subCategoryFilters: SUBCATEGORY_FILTERS.emploi,
  },
  mode: {
    categorie: "mode",
    label: "Mode",
    h1: "Annonces Mode",
    filters: [LOCATION_FILTER, sousCategorieFilter("mode"), PRIX_FILTER, DONS],
    subCategoryFilters: SUBCATEGORY_FILTERS.mode,
  },
  "maison-jardin": {
    categorie: "maison-jardin",
    label: "Maison & jardin",
    h1: "Annonces Maison & jardin",
    filters: [LOCATION_FILTER, sousCategorieFilter("maison-jardin"), PRIX_FILTER, DONS],
    subCategoryFilters: SUBCATEGORY_FILTERS["maison-jardin"],
  },
  famille: {
    categorie: "famille",
    label: "Famille",
    h1: "Annonces Famille",
    filters: [LOCATION_FILTER, sousCategorieFilter("famille"), PRIX_FILTER, DONS],
    subCategoryFilters: SUBCATEGORY_FILTERS.famille,
  },
  services: {
    categorie: "services",
    label: "Services",
    h1: "Annonces Services",
    filters: [LOCATION_FILTER, sousCategorieFilter("services"), PRIX_FILTER],
    subCategoryFilters: SUBCATEGORY_FILTERS.services,
  },
  "locations-vacances": {
    categorie: "locations-vacances",
    label: "Locations de vacances",
    h1: "Annonces Locations de vacances",
    // Uniquement les filtres de liste (Type de bien, hébergement,
    // équipements, capacité) — pas de recherche cartographique par
    // destination/dates/voyageurs, absente de LBT (voir lib/
    // subcategory-filters.ts pour le détail de cette limite assumée).
    filters: [LOCATION_FILTER, PRIX_FILTER, ...LOCATIONS_VACANCES],
  },
  autres: {
    categorie: "autres",
    label: "Autres",
    h1: "Annonces Autres",
    filters: [LOCATION_FILTER, PRIX_FILTER, DONS],
  },
  dons: {
    categorie: "dons",
    label: "Dons",
    h1: "Annonces Dons",
    // Pas de filtre Prix : par construction, une annonce déposée dans cette
    // catégorie est gratuite (cf. lib/categories.ts DONS_ENTRY).
    filters: [LOCATION_FILTER],
  },
};

function genericConfig(categorie: Categorie): ListingConfig {
  return {
    categorie,
    label: categorie,
    h1: `Annonces ${categorie}`,
    filters: [LOCATION_FILTER, PRIX_FILTER],
  };
}

const FILTERS_BY_CATEGORY: Record<Categorie, ListingConfig> = Object.fromEntries(
  CATEGORIES.map((categorie) => [categorie, ENRICHED[categorie] ?? genericConfig(categorie)])
) as Record<Categorie, ListingConfig>;

// `sousCategorie` (valeur de `sous_categorie` déjà sélectionnée, ex. dans
// l'URL de la page catégorie) ajoute les champs propres à cette
// sous-catégorie à la fin de `filters` — absent, seuls les filtres de base
// apparaissent (cf. ListingConfig.subCategoryFilters ci-dessus).
export function getFiltersForCategory(categorie: Categorie, sousCategorie?: string): ListingConfig {
  const base = FILTERS_BY_CATEGORY[categorie];
  const extra = sousCategorie ? base.subCategoryFilters?.[sousCategorie] : undefined;
  if (!extra || extra.length === 0) return base;
  return { ...base, filters: [...base.filters, ...extra] };
}
