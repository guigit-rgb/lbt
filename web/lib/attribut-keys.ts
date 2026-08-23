// Extrait de lib/annonce-filters.ts pour rester importable depuis un
// composant client (components/AttributsDynamiques.tsx) sans entraîner la
// connexion base de données de lib/db/client.ts dans le bundle navigateur.
export const ATTRIBUT_ARRAY_KEYS = ["exterieur", "caracteristiques"] as const;
