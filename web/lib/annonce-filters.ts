import { and, asc, desc, eq, gte, ilike, isNotNull, lte, sql, type SQL } from "drizzle-orm";
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

// Critères véhicule stockés dans la colonne JSONB `attributs` (pas de colonne
// dédiée) — typeVehicule/carburant/boite/critAir en choix unique, puissanceDin
// en plage min/max comme kilométrage. Traités à part de SELECT_COLUMNS qui ne
// connaît que les vraies colonnes Drizzle.
export const ATTRIBUT_SELECT_KEYS = ["typeVehicule", "carburant", "boite", "critAir"] as const;
export const ATTRIBUT_RANGE_KEYS = ["puissanceDin"] as const;

// Reconstruit les conditions SQL d'une recherche filtrée à partir des mêmes
// clés que l'URL de la page catégorie — utilisé à la fois par la page
// catégorie elle-même et par le comptage des recherches sauvegardées
// (§17 action n°200), pour ne jamais avoir deux lectures différentes des
// mêmes filtres.
export function buildAnnonceConditions(categorie: Categorie, params: Record<string, string | undefined>): SQL[] {
  const conditions = [eq(annonces.categorie, categorie), annonceVisiblePublic()].filter(
    (c): c is SQL => c !== undefined
  );
  // Recherche par rayon (lat/lng/rayon, choisis via l'autocomplétion adresse)
  // prioritaire sur l'ancien filtre texte — les deux ne coexistent jamais
  // puisque `LocationFilter` écrit toujours les trois ensemble ou aucun.
  // Distance à vol d'oiseau (formule de la loi des cosinus sphérique) :
  // suffisante pour un rayon de recherche, pas pour une distance routière.
  if (params.lat && params.lng && params.rayon) {
    const lat = Number(params.lat);
    const lng = Number(params.lng);
    const rayonKm = Number(params.rayon);
    conditions.push(
      sql`${annonces.lat} is not null and ${annonces.lng} is not null and (6371 * acos(least(1, cos(radians(${lat})) * cos(radians(${annonces.lat})) * cos(radians(${annonces.lng}) - radians(${lng})) + sin(radians(${lat})) * sin(radians(${annonces.lat}))))) <= ${rayonKm}`
    );
  } else if (params.localisation) {
    conditions.push(ilike(annonces.ville, `%${params.localisation}%`));
  }
  if (params.prix_min) conditions.push(gte(annonces.prixCents, Number(params.prix_min) * 100));
  if (params.prix_max) conditions.push(lte(annonces.prixCents, Number(params.prix_max) * 100));
  if (params.kilometrage_min) conditions.push(gte(annonces.kilometrage, Number(params.kilometrage_min)));
  if (params.kilometrage_max) conditions.push(lte(annonces.kilometrage, Number(params.kilometrage_max)));
  if (params.annee_min) conditions.push(gte(annonces.annee, Number(params.annee_min)));
  if (params.annee_max) conditions.push(lte(annonces.annee, Number(params.annee_max)));
  for (const key of Object.keys(SELECT_COLUMNS) as (keyof typeof SELECT_COLUMNS)[]) {
    const value = params[key];
    if (value) {
      const column = SELECT_COLUMNS[key];
      conditions.push(key === "annee" ? eq(column, Number(value)) : eq(column, value));
    }
  }
  for (const key of ATTRIBUT_SELECT_KEYS) {
    const value = params[key];
    if (value) conditions.push(sql`${annonces.attributs} ->> ${key} = ${value}`);
  }
  for (const key of ATTRIBUT_RANGE_KEYS) {
    const min = params[`${key}_min`];
    const max = params[`${key}_max`];
    if (min) conditions.push(sql`(nullif(${annonces.attributs} ->> ${key}, ''))::numeric >= ${Number(min)}`);
    if (max) conditions.push(sql`(nullif(${annonces.attributs} ->> ${key}, ''))::numeric <= ${Number(max)}`);
  }
  return conditions;
}

export async function distinctOptions(categorie: Categorie, key: string): Promise<string[]> {
  if ((ATTRIBUT_SELECT_KEYS as readonly string[]).includes(key)) {
    const valeur = sql<string>`${annonces.attributs} ->> ${key}`;
    const rows = await db
      .selectDistinct({ valeur })
      .from(annonces)
      .where(and(eq(annonces.categorie, categorie), annonceVisiblePublic(), sql`${annonces.attributs} ? ${key}`))
      // ORDER BY doit référencer la position de la colonne sélectionnée, pas
      // ré-émettre l'expression : avec SELECT DISTINCT, Postgres refuse un
      // ORDER BY qui n'apparaît pas littéralement dans la liste SELECT — deux
      // interpolations `${key}` produisent deux paramètres distincts ($1/$2),
      // pas la même expression syntaxique aux yeux du parseur.
      .orderBy(sql`1`);
    return rows.map((r) => r.valeur).filter(Boolean);
  }
  const column = SELECT_COLUMNS[key as keyof typeof SELECT_COLUMNS];
  const rows = await db
    .selectDistinct({ value: column })
    .from(annonces)
    .where(and(eq(annonces.categorie, categorie), annonceVisiblePublic(), isNotNull(column)))
    .orderBy(key === "annee" ? desc(column) : asc(column));
  return rows.map((r) => String(r.value)).filter(Boolean);
}
