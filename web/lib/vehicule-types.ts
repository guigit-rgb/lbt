// Types de véhicule (attributs.typeVehicule) — centralisés ici pour ne plus
// dupliquer la liste entre NouvelleAnnonceForm et ModifierAnnonceForm, et
// pour que le widget de recherche de l'accueil (§ "Voiture/Utilitaire/Moto")
// puisse regrouper les types fins en 3 grandes familles sans une deuxième
// liste à tenir à jour séparément.
export const TYPES_VEHICULE = [
  "Berline",
  "Citadine",
  "SUV / 4x4",
  "Break",
  "Coupé",
  "Cabriolet",
  "Monospace",
  "Utilitaire",
  "Moto",
] as const;

// Regroupement utilisé par le widget de recherche accueil (3 icônes,
// cf. retour de Nicolas du 2026-08-22) — un choix "Voiture" doit filtrer sur
// plusieurs types fins à la fois, d'où le filtre `typeVehicule` en sélection
// multiple (lib/annonce-filters.ts, ATTRIBUT_MULTI_KEYS).
export const TYPES_VOITURE = ["Berline", "Citadine", "SUV / 4x4", "Break", "Coupé", "Cabriolet", "Monospace"] as const;
export const TYPES_UTILITAIRE = ["Utilitaire"] as const;
export const TYPES_MOTO = ["Moto"] as const;

export const CARBURANTS = ["Essence", "Diesel", "Hybride", "Électrique", "Autre"] as const;
export const BOITES = ["Manuelle", "Automatique"] as const;

// Paliers de prix maximum du widget de recherche accueil — pas de saisie
// libre, pour rester au format "menu déroulant" de la référence fournie.
export const PALIERS_PRIX_MAX = [3000, 5000, 8000, 10000, 15000, 20000, 30000, 50000, 80000, 150000] as const;
