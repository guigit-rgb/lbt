// Extrait de lib/listing-config.ts pour être importable depuis
// lib/subcategory-filters.ts sans dépendance circulaire (ce fichier associe
// des FilterField à des sous-catégories, et listing-config.ts les rattache
// ensuite à chaque ListingConfig).
export type FilterWidget = "location" | "select" | "checkbox" | "marque" | "range" | "text";

export interface FilterField {
  key: string;
  label: string;
  widget: FilterWidget;
  // Liste fermée de valeurs toujours proposées (même à 0 annonce) — sur le
  // modèle du catalogue Marque véhicules (lib/marques.ts) et des filtres
  // Immobilier. Absent pour les filtres "référentiel propre" (Marque,
  // Produit, Couleur, Matière... des catégories génériques) dont
  // leboncoin.fr ne détaille pas les valeurs : ceux-là restent dérivés des
  // annonces existantes, comme "Modèle" pour les véhicules aujourd'hui.
  catalogue?: readonly string[];
}
