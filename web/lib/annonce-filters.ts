import { and, asc, desc, eq, gt, gte, ilike, isNotNull, lte, sql, type SQL } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { annonces, users, type Categorie } from "@/lib/db/schema";
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
  type_annonce: annonces.typeAnnonce,
} as const;

// Critères véhicule stockés dans la colonne JSONB `attributs` (pas de colonne
// dédiée) — typeVehicule/carburant/boite/critAir en choix unique, puissanceDin
// en plage min/max comme kilométrage. Traités à part de SELECT_COLUMNS qui ne
// connaît que les vraies colonnes Drizzle.
export const ATTRIBUT_SELECT_KEYS = ["typeVehicule", "carburant", "boite", "critAir"] as const;
export const ATTRIBUT_RANGE_KEYS = ["puissanceDin"] as const;
// Permis : seul critère où on autorise de cocher plusieurs valeurs à la fois
// (ex. "Avec permis" + "Sans permis" cochés ensemble = pas de restriction).
export const ATTRIBUT_MULTI_KEYS = ["permis"] as const;

function isAttributSelectKey(key: string): key is (typeof ATTRIBUT_SELECT_KEYS)[number] {
  return (ATTRIBUT_SELECT_KEYS as readonly string[]).includes(key);
}
function isAttributMultiKey(key: string): key is (typeof ATTRIBUT_MULTI_KEYS)[number] {
  return (ATTRIBUT_MULTI_KEYS as readonly string[]).includes(key);
}

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
  for (const key of ATTRIBUT_MULTI_KEYS) {
    const raw = params[key];
    if (!raw) continue;
    const valeurs = raw.split(",").filter(Boolean);
    if (valeurs.length === 1) {
      conditions.push(sql`${annonces.attributs} ->> ${key} = ${valeurs[0]}`);
    } else if (valeurs.length > 1) {
      conditions.push(
        sql`${annonces.attributs} ->> ${key} in (${sql.join(
          valeurs.map((v) => sql`${v}`),
          sql`, `
        )})`
      );
    }
  }
  // Type de vendeur : nécessite la jointure `users`, déjà présente partout où
  // buildAnnonceConditions est appelé (page catégorie et comptage des
  // recherches sauvegardées — voir lib/recherches.ts).
  if (params.vendeur) {
    const valeurs = params.vendeur.split(",").filter(Boolean);
    const veutParticulier = valeurs.includes("particulier");
    const veutPro = valeurs.includes("pro");
    if (veutParticulier && !veutPro) conditions.push(eq(users.estPro, false));
    else if (veutPro && !veutParticulier) conditions.push(eq(users.estPro, true));
    // Les deux cochés (ou aucun) : pas de restriction.
  }
  // Annonce urgente (§5 Résultat n°6) : un badge + un filtre, jamais un effet
  // sur le tri (`_eval()`/`sort_by`, §14.2/§14.4).
  if (params.urgent === "1") {
    conditions.push(gt(annonces.urgentJusqua, new Date()));
  }
  return conditions;
}

// Nombre d'annonces par valeur possible d'un filtre "select"/"checkbox",
// calculé avec tous les AUTRES filtres actifs mais sans celui-ci — pour que
// cocher une valeur du filtre `key` ne fasse pas disparaître ses propres
// alternatives (comptage à facettes standard).
export async function optionCounts(
  categorie: Categorie,
  params: Record<string, string | undefined>,
  key: string
): Promise<{ value: string; count: number }[]> {
  const reste = { ...params };
  delete reste[key];
  const conditions = buildAnnonceConditions(categorie, reste);

  // Jointure users systématique : buildAnnonceConditions peut référencer
  // users.estPro dès qu'un filtre "vendeur" est actif à côté de celui-ci, et
  // cette fonction ne sait pas d'avance quels autres filtres accompagnent `key`.
  if (isAttributSelectKey(key) || isAttributMultiKey(key)) {
    const valeur = sql<string>`${annonces.attributs} ->> ${key}`;
    const total = sql<number>`count(*)::int`;
    const rows = await db
      .select({ valeur, total })
      .from(annonces)
      .innerJoin(users, eq(annonces.userId, users.id))
      // GROUP BY / ORDER BY référencent la position 1 de la liste SELECT,
      // pas l'expression ré-émise : chaque interpolation `${key}` crée un
      // paramètre distinct ($1, $6…) aux yeux de Postgres, même identique en
      // valeur — une position numérique évite la divergence de paramètres.
      .where(and(...conditions, sql`${annonces.attributs} ? ${key}`))
      .groupBy(sql`1`)
      .orderBy(sql`1`);
    return rows.map((r) => ({ value: r.valeur, count: r.total })).filter((r) => r.value);
  }

  const column = SELECT_COLUMNS[key as keyof typeof SELECT_COLUMNS];
  const total = sql<number>`count(*)::int`;
  const rows = await db
    .select({ valeur: column, total })
    .from(annonces)
    .innerJoin(users, eq(annonces.userId, users.id))
    .where(and(...conditions, isNotNull(column)))
    .groupBy(column)
    .orderBy(key === "annee" ? desc(column) : asc(column));
  return rows.map((r) => ({ value: String(r.valeur), count: r.total })).filter((r) => r.value);
}

// Type d'annonce (Offres/Demandes) : les deux choix doivent toujours être
// proposés, même si l'un des deux n'a aucune annonce pour l'instant — pas
// dérivé des valeurs distinctes en base comme les autres filtres "select".
export async function typeAnnonceCounts(
  categorie: Categorie,
  params: Record<string, string | undefined>
): Promise<{ value: "offre" | "demande"; count: number }[]> {
  const comptes = await optionCounts(categorie, params, "type_annonce");
  const parValeur = new Map(comptes.map((c) => [c.value, c.count]));
  return [
    { value: "offre", count: parValeur.get("offre") ?? 0 },
    { value: "demande", count: parValeur.get("demande") ?? 0 },
  ];
}

// Type de vendeur (Particuliers/Professionnels) : nécessite une jointure
// `users` dédiée, `optionCounts` ne le sait pas faire génériquement.
export async function vendeurCounts(
  categorie: Categorie,
  params: Record<string, string | undefined>
): Promise<{ particulier: number; pro: number }> {
  const reste = { ...params };
  delete reste.vendeur;
  const conditions = buildAnnonceConditions(categorie, reste);
  const rows = await db
    .select({ estPro: users.estPro, total: sql<number>`count(*)::int` })
    .from(annonces)
    .innerJoin(users, eq(annonces.userId, users.id))
    .where(and(...conditions))
    .groupBy(users.estPro);
  return {
    particulier: rows.find((r) => !r.estPro)?.total ?? 0,
    pro: rows.find((r) => r.estPro)?.total ?? 0,
  };
}

// Annonces urgentes (§5 Résultat n°6) : une seule case à cocher, pas une paire
// d'options — compte à part comme vendeurCounts, pour la même raison (le
// critère n'est ni une colonne SELECT_COLUMNS ni un attribut JSONB).
export async function urgentCount(categorie: Categorie, params: Record<string, string | undefined>): Promise<number> {
  const reste = { ...params };
  delete reste.urgent;
  const conditions = buildAnnonceConditions(categorie, reste);
  const [ligne] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(annonces)
    .innerJoin(users, eq(annonces.userId, users.id))
    .where(and(...conditions, gt(annonces.urgentJusqua, new Date())));
  return ligne?.total ?? 0;
}

