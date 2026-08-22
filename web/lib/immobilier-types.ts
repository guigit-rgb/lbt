// Vocabulaire des filtres Immobilier (relevé exhaustif fourni par Nicolas le
// 2026-08-23, catégorie leboncoin.fr Immobilier > Ventes immobilières) —
// centralisé ici sur le modèle de lib/vehicule-types.ts, pour que le dépôt
// d'annonce, sa modification et le panneau de filtres partagent le même
// catalogue de valeurs.
export const TYPES_BIEN = ["Maison", "Appartement", "Terrain", "Parking", "Autre"] as const;
export const TYPES_VENTE = ["Ancien", "Neuf", "Viager"] as const;
export const EXTERIEURS = ["Balcon", "Terrasse", "Jardin", "Piscine"] as const;
export const ETAGES = ["Rez-de-chaussée", "Pas de rez-de-chaussée", "Dernier étage"] as const;
export const EXPOSITIONS = ["Nord", "Sud", "Est", "Ouest", "Nord-Est", "Nord-Ouest", "Sud-Est", "Sud-Ouest"] as const;
export const CARACTERISTIQUES = [
  "Place(s) de parking",
  "Cuisine équipée",
  "Cuisine ouverte",
  "Cuisine séparée",
  "Baignoire",
  "Plusieurs toilettes",
  "Accès PMR",
  "Sous-sol",
  "Cave",
  "Grenier",
  "Actuellement loué",
  "Climatisation",
  "Chauffage au sol",
] as const;
export const ETATS_BIEN = ["Très bon état", "Bon état", "Rénové", "À rafraîchir", "Travaux à prévoir"] as const;
export const DPE_CLASSES = ["A", "B", "C", "D", "E", "F", "G", "Vierge", "Non soumis au DPE"] as const;
