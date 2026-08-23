import type { Categorie } from "./db/schema";
import { SOUS_CATEGORIES } from "./subcategory-filters";
import { TYPES_VOITURE, TYPES_UTILITAIRE, TYPES_MOTO } from "./vehicule-types";

// Jusqu'ici, chaque lien du méga-menu (components/SiteHeader.tsx) pointait
// sur `/${categorie}` quel que soit le libellé cliqué — un simple rappel
// visuel de l'arborescence, jamais câblé aux vraies pages filtrées (bug
// signalé par Nicolas le 2026-08-23 : "je clique sur Téléphones & Objets
// connectés, rien ne se passe"). Ce fichier calcule la bonne URL à partir de
// la rubrique (`heading`) et du libellé cliqué, en s'appuyant sur les
// sous-catégories et catalogues déjà définis dans lib/subcategory-filters.ts.

function qs(params: Record<string, string>): string {
  return new URLSearchParams(params).toString();
}

// Rubrique → attribut porté par ses enfants, quand ce n'est pas "produit"
// (le plus courant : Ameublement, Électroménager, Équipement bébé...).
const ATTRIBUT_PAR_RUBRIQUE: Record<string, string> = {
  "Téléphones & Objets connectés": "marqueProduit",
  "Offres d'emploi": "typeContrat",
  "Vêtements bébé": "trancheAge",
};

// Rubriques Loisirs déjà "aplaties" avant cette session (lib/
// subcategory-filters.ts) : leurs enfants SONT la sous-catégorie, la
// rubrique elle-même n'en est pas une.
const RUBRIQUES_APLATIES = new Set(["Jeux & Jouets", "Vélos"]);

function hrefVehicules(heading: string | undefined, label?: string): string {
  const base = "/vehicules";
  if (label) {
    if (heading === "Voitures" || heading === "Motos") return `${base}?${qs({ marque: label })}`;
    if (label === "Utilitaires") return `${base}?${qs({ typeVehicule: TYPES_UTILITAIRE.join(",") })}`;
    return base;
  }
  if (heading === "Voitures") return `${base}?${qs({ typeVehicule: TYPES_VOITURE.join(",") })}`;
  if (heading === "Motos") return `${base}?${qs({ typeVehicule: TYPES_MOTO.join(",") })}`;
  if (heading === "Utilitaires") return `${base}?${qs({ typeVehicule: TYPES_UTILITAIRE.join(",") })}`;
  // Caravaning/Camions/Nautisme/Équipements/Services de réparations : aucun
  // filtre ne modélise ces sous-familles aujourd'hui — page catégorie brute
  // plutôt qu'un filtre trompeur.
  return base;
}

const IMMOBILIER_TYPES_BIEN = new Set(["Maison", "Appartement", "Terrain", "Parking", "Autre"]);

function hrefImmobilier(heading: string | undefined, label?: string): string {
  const base = "/immobilier";
  if (heading === "Ventes immobilières" && label && IMMOBILIER_TYPES_BIEN.has(label)) {
    return `${base}?${qs({ typeBien: label })}`;
  }
  if (heading === "Immobilier Neuf") {
    if (label && IMMOBILIER_TYPES_BIEN.has(label)) return `${base}?${qs({ typeVente: "Neuf", typeBien: label })}`;
    return `${base}?${qs({ typeVente: "Neuf" })}`;
  }
  // "Locations" n'a pas d'équivalent dans les filtres actuels (Type de vente
  // ne connaît que Ancien/Neuf/Viager, pas de dimension vente/location) —
  // filtrer par Type de bien laisserait croire à tort qu'on montre des
  // locations. Mieux vaut la page catégorie brute qu'un résultat trompeur.
  return base;
}

// Locations de vacances (pas de sous-catégorie, filtres à plat — cf.
// lib/subcategory-filters.ts LOCATIONS_VACANCES) : les libellés du méga-menu
// diffèrent légèrement du catalogue des filtres ("Maisons et villas" vs
// "Maison/Villa"), d'où une table explicite plutôt qu'une correspondance
// automatique fragile.
const LOCATIONS_VACANCES_LIENS: Record<string, [string, string]> = {
  "Maisons et villas": ["typeBien", "Maison/Villa"],
  Appartements: ["typeBien", "Appartement"],
  Chalets: ["typeBien", "Chalet"],
  "Chambres d'hôtes": ["typeHebergement", "Chambre d'hôtes"],
  Campings: ["typeHebergement", "Camping"],
  Piscine: ["exterieur", "Piscine"],
  Jardin: ["exterieur", "Jardin"],
  "Animaux acceptés": ["servicesInclus", "Animaux acceptés"],
  Solo: ["capacite", "Solo"],
  "À deux": ["capacite", "À deux"],
  "À quatre": ["capacite", "À quatre"],
  "À six": ["capacite", "À six"],
  "Plus de six": ["capacite", "Plus de six"],
};

export function hrefRubriqueMegaMenu(categorie: Categorie, heading: string): string {
  if (categorie === "vehicules") return hrefVehicules(heading);
  if (categorie === "immobilier") return hrefImmobilier(heading);
  if (SOUS_CATEGORIES[categorie]?.includes(heading)) {
    return `/${categorie}?${qs({ sous_categorie: heading })}`;
  }
  return `/${categorie}`;
}

export function hrefLienMegaMenu(categorie: Categorie, heading: string | undefined, label: string): string {
  if (categorie === "vehicules") return hrefVehicules(heading, label);
  if (categorie === "immobilier") return hrefImmobilier(heading, label);
  if (categorie === "locations-vacances") {
    const mapping = LOCATIONS_VACANCES_LIENS[label];
    return mapping ? `/locations-vacances?${qs({ [mapping[0]]: mapping[1] })}` : "/locations-vacances";
  }

  // Le libellé est lui-même une sous-catégorie valide (cas le plus courant :
  // Matériel pro, Services, Animaux, la plupart de Loisirs/Maison & Jardin,
  // et les rubriques "aplaties" de Loisirs où l'enfant EST la sous-catégorie).
  if (SOUS_CATEGORIES[categorie]?.includes(label)) {
    return `/${categorie}?${qs({ sous_categorie: label })}`;
  }
  if (heading && !RUBRIQUES_APLATIES.has(heading) && SOUS_CATEGORIES[categorie]?.includes(heading)) {
    const attribut = ATTRIBUT_PAR_RUBRIQUE[heading] ?? (categorie === "mode" ? "univers" : "produit");
    return `/${categorie}?${qs({ sous_categorie: heading, [attribut]: label })}`;
  }
  // Pas de correspondance connue (ex. "Profil Candidat", ou les liens Famille
  // qui renvoient en réalité vers Mode/Loisirs) — page catégorie brute plutôt
  // qu'un lien qui semblerait filtrer sans vraiment le faire.
  return `/${categorie}`;
}
