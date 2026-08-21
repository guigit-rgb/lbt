import { and, asc, desc, eq, gte, ilike, isNotNull, lte, type SQL } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { annonces, type Categorie } from "@/lib/db/schema";
import { annonceVisiblePublic } from "@/lib/annonce-display";

// Colonne réelle derrière chaque filtre "select" — tenue à part de
// lib/listing-config.ts pour ne pas faire dépendre ce fichier partagé
// (utilisé aussi côté dépôt d'annonce) du schéma Drizzle complet.
export const SELECT_COLUMNS = {
  marque: annonces.marque,
  modele: annonces.modele,
  annee: annonces.annee,
  sous_categorie: annonces.sousCategorie,
  etat_produit: annonces.etatProduit,
  type_animal: annonces.typeAnimal,
} as const;

// Reconstruit les conditions SQL d'une recherche filtrée à partir des mêmes
// clés que l'URL de la page catégorie — utilisé à la fois par la page
// catégorie elle-même et par le comptage des recherches sauvegardées
// (§17 action n°200), pour ne jamais avoir deux lectures différentes des
// mêmes filtres.
export function buildAnnonceConditions(categorie: Categorie, params: Record<string, string | undefined>): SQL[] {
  const conditions = [eq(annonces.categorie, categorie), annonceVisiblePublic()].filter(
    (c): c is SQL => c !== undefined
  );
  if (params.localisation) conditions.push(ilike(annonces.ville, `%${params.localisation}%`));
  if (params.prix_min) conditions.push(gte(annonces.prixCents, Number(params.prix_min) * 100));
  if (params.prix_max) conditions.push(lte(annonces.prixCents, Number(params.prix_max) * 100));
  if (params.kilometrage_min) conditions.push(gte(annonces.kilometrage, Number(params.kilometrage_min)));
  if (params.kilometrage_max) conditions.push(lte(annonces.kilometrage, Number(params.kilometrage_max)));
  for (const key of Object.keys(SELECT_COLUMNS) as (keyof typeof SELECT_COLUMNS)[]) {
    const value = params[key];
    if (value) {
      const column = SELECT_COLUMNS[key];
      conditions.push(key === "annee" ? eq(column, Number(value)) : eq(column, value));
    }
  }
  return conditions;
}

export async function distinctOptions(categorie: Categorie, key: keyof typeof SELECT_COLUMNS): Promise<string[]> {
  const column = SELECT_COLUMNS[key];
  const rows = await db
    .selectDistinct({ value: column })
    .from(annonces)
    .where(and(eq(annonces.categorie, categorie), annonceVisiblePublic(), isNotNull(column)))
    .orderBy(key === "annee" ? desc(column) : asc(column));
  return rows.map((r) => String(r.value)).filter(Boolean);
}
