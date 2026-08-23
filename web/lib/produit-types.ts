// État d'un produit générique (toutes catégories hors véhicules/immobilier,
// qui ont leur propre échelle) — centralisé ici pour que le dépôt d'annonce
// (NouvelleAnnonceForm), le catalogue des sous-catégories
// (lib/subcategory-filters.ts) et lib/listing-config.ts (Loisirs) partagent
// la même liste plutôt que trois copies divergentes.
export const ETATS_PRODUIT = ["Neuf", "Très bon état", "Bon état", "Satisfaisant"] as const;

// Idem pour le catalogue "Type d'animal" — auparavant dupliqué localement
// dans NouvelleAnnonceForm.tsx, désormais aussi utilisé par
// lib/subcategory-filters.ts (catégorie Animaux, sous-catégories "Animaux"
// et "Accessoires animaux").
export const TYPES_ANIMAUX = ["Chien", "Chat", "Oiseau", "Rongeur", "Autre"] as const;
