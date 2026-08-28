import { and, asc, desc, eq, gt, gte, ilike, isNotNull, lte, sql, type SQL } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { annonces, users, type Categorie } from "@/lib/db/schema";
import { annonceVisiblePublic } from "@/lib/annonce-display";
import { colonnePliee, conditionTexte, palierPertinence, plierAccents, requeteTexte } from "@/lib/recherche-texte";
import { appliquerNormaliseur } from "@/lib/normaliseur-auto";
import { ATTRIBUT_ARRAY_KEYS } from "./attribut-keys";

// Distance à vol d'oiseau, en kilomètres, entre un point de référence et
// l'annonce (loi des cosinus sphérique). Extraite ici parce qu'elle sert
// désormais à deux choses qui doivent rester cohérentes : le **filtre** de
// rayon (`<= rayonKm`) et le **tri** par distance de la §14.2 (Résultat n°5,
// contexte 3). Deux formules distinctes produiraient un résultat trié par une
// distance différente de celle qui l'a sélectionné.
export function expressionDistanceKm(lat: number, lng: number): SQL<number> {
  return sql<number>`(6371 * acos(least(1, cos(radians(${lat})) * cos(radians(${annonces.lat})) * cos(radians(${annonces.lng}) - radians(${lng})) + sin(radians(${lat})) * sin(radians(${annonces.lat})))))`;
}

// Colonne réelle derrière chaque filtre "select" — tenue à part de
// lib/listing-config.ts pour ne pas faire dépendre ce fichier partagé
// (utilisé aussi côté dépôt d'annonce) du schéma Drizzle complet.
export const SELECT_COLUMNS = {
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
export const ATTRIBUT_SELECT_KEYS = ["carburant", "boite", "critAir"] as const;
// Surfaces/pièces/chambres immobilier (même logique que puissanceDin) :
// une seule valeur numérique par annonce, filtrée en plage min/max. Le
// panneau de filtres saisit "8+" comme un simple minimum à 8 sans maximum,
// plutôt que de dupliquer la liste fermée de boutons 1-8+ de leboncoin.
export const ATTRIBUT_RANGE_KEYS = [
  "puissanceDin",
  "surfaceHabitable",
  "surfaceTerrain",
  "pieces",
  "chambres",
  // Matériel professionnel (lib/subcategory-filters.ts) — kilométrage et
  // année réutilisent les colonnes dédiées déjà gérées plus bas dans cette
  // fonction (kilometrage_min/max, annee_min/max), pas cette liste.
  "puissance",
  "heures",
  "poids",
] as const;
// Permis : cocher plusieurs valeurs à la fois dans le panneau de filtres
// (ex. "Avec permis" + "Sans permis" cochés ensemble = pas de restriction).
// typeVehicule : le panneau de filtres reste en sélection unique (widget
// "select"), mais le widget de recherche de l'accueil doit pouvoir passer
// plusieurs types à la fois pour son bouton "Voiture" (Berline + Citadine +
// SUV + ... en une seule requête) — d'où le support multi ici, sans rien
// changer au panneau (lib/vehicule-types.ts, TYPES_VOITURE).
// Immobilier (typeBien/typeVente/etage/exposition/etatBien/dpe/ascenseur) :
// une seule valeur par annonce (un bien a un type, un état, une exposition
// principale...), mais le panneau de filtres doit pouvoir cocher plusieurs
// valeurs acceptées à la fois (ex. "Maison" + "Appartement"), même logique
// que permis/typeVehicule. `ascenseur` est une case unique ("1" si coché au
// dépôt, absent sinon) — traitée ici plutôt qu'en doublon du mécanisme
// `urgent` pour réutiliser tel quel le widget "checkbox" générique.
export const ATTRIBUT_MULTI_KEYS = [
  "permis",
  "typeVehicule",
  "typeBien",
  "typeVente",
  "etage",
  "exposition",
  "etatBien",
  "dpe",
  "ascenseur",
  // Clés génériques réutilisées par plusieurs sous-catégories (lib/
  // subcategory-filters.ts) — un même nom (ex. "couleur", "type") porte un
  // sens différent selon la sous-catégorie active, sans risque de
  // contamination croisée : la page catégorie/sous-catégorie (`categorie` +
  // `sous_categorie`, déjà dans SELECT_COLUMNS) reste systématiquement dans
  // les conditions de la requête, y compris pour le calcul des compteurs
  // par option (optionCounts ne retire que la clé du filtre courant).
  "produit",
  "marqueProduit",
  "modeleProduit",
  "couleur",
  "matiere",
  "type",
  "univers",
  "tailleEcran",
  "capaciteStockage",
  "compatibilite",
  "plateforme",
  "protectionPanne",
  "typePose",
  "typeContrat",
  "secteurActivite",
  "fonction",
  "experience",
  "niveauEtudes",
  "tempsTravail",
  "eligibleCpf",
  "domaineFormation",
  "typeEnseignement",
  "taille",
  "pointure",
  "piece",
  "style",
  "dimensions",
  "genreBebe",
  "trancheAge",
  "epoque",
  "conditionnement",
  "support",
  "genre",
  "edition",
  "packaging",
  "niveau",
  "format",
  "langue",
  "echelle",
  "age",
  "cible",
  "activite",
  "tailleVelo",
  "tailleRoue",
  "typeHebergement",
  "servicesInclus",
  "capacite",
] as const;
// Extérieur/Caractéristiques immobilier : contrairement aux clés ci-dessus,
// une même annonce peut cumuler PLUSIEURS valeurs à la fois (un bien peut
// avoir à la fois un balcon ET un jardin) — stockées comme un tableau JSON
// dans `attributs`, et non comme une chaîne unique. Le filtre matche une
// annonce dès qu'elle porte au moins une des valeurs cochées.
export { ATTRIBUT_ARRAY_KEYS };

function isAttributSelectKey(key: string): key is (typeof ATTRIBUT_SELECT_KEYS)[number] {
  return (ATTRIBUT_SELECT_KEYS as readonly string[]).includes(key);
}
function isAttributMultiKey(key: string): key is (typeof ATTRIBUT_MULTI_KEYS)[number] {
  return (ATTRIBUT_MULTI_KEYS as readonly string[]).includes(key);
}
function isAttributArrayKey(key: string): key is (typeof ATTRIBUT_ARRAY_KEYS)[number] {
  return (ATTRIBUT_ARRAY_KEYS as readonly string[]).includes(key);
}

// Reconstruit les conditions SQL d'une recherche filtrée à partir des mêmes
// clés que l'URL de la page catégorie — utilisé à la fois par la page
// catégorie elle-même et par le comptage des recherches sauvegardées
// (§17 action n°200), pour ne jamais avoir deux lectures différentes des
// mêmes filtres.
export function buildAnnonceConditions(
  categorie: Categorie | null,
  paramsBruts: Record<string, string | undefined>
): SQL[] {
  // Normaliseur de requête auto (§14.3, action n°221) : « clio 3 essence moins
  // de 8000 € » devient ici un jeu de filtres, et `q` ne garde que ce qui reste
  // vraiment du texte. Appliqué à cet endroit précis et pas dans la page, pour
  // la raison qui a déjà servi à la recherche plein texte (§14.7, Résultat n°4) :
  // les trois lecteurs des mêmes filtres — page catégorie, page /recherche et
  // comptage des recherches sauvegardées — doivent voir exactement le même
  // résultat, sinon une recherche sauvegardée « clio essence » compterait toutes
  // les Clio. La fonction est idempotente et ne s'applique qu'à `vehicules`
  // (cf. lib/normaliseur-auto.ts), donc la page peut l'appeler aussi pour
  // l'affichage et les compteurs sans risque de double application.
  const params = appliquerNormaliseur(categorie, paramsBruts);
  // `categorie === null` : recherche transverse (page /recherche), où le
  // visiteur cherche « une Clio ou un vinyle » sans avoir choisi de rubrique.
  // Toutes les autres conditions sont rigoureusement les mêmes — c'est la
  // raison d'être de ce paramètre nullable plutôt que d'un second constructeur
  // de conditions qui divergerait au premier filtre ajouté.
  const conditions = [
    categorie === null ? undefined : eq(annonces.categorie, categorie),
    annonceVisiblePublic(),
  ].filter((c): c is SQL => c !== undefined);
  // Recherche plein texte (§14.7). Placée ici, et non dans la page, pour que
  // les trois lecteurs des mêmes filtres — page catégorie, page /recherche et
  // comptage des recherches sauvegardées — voient exactement le même résultat.
  const requete = requeteTexte(params.q);
  if (requete) conditions.push(conditionTexte(requete));
  // Recherche par rayon (lat/lng/rayon, choisis via l'autocomplétion adresse)
  // prioritaire sur l'ancien filtre texte — les deux ne coexistent jamais
  // puisque `LocationFilter` écrit toujours les trois ensemble ou aucun.
  // Distance à vol d'oiseau (formule de la loi des cosinus sphérique) :
  // suffisante pour un rayon de recherche, pas pour une distance routière.
  if (params.lat && params.lng && params.rayon) {
    const rayonKm = Number(params.rayon);
    conditions.push(
      sql`${annonces.lat} is not null and ${annonces.lng} is not null and ${expressionDistanceKm(
        Number(params.lat),
        Number(params.lng)
      )} <= ${rayonKm}`
    );
  } else if (params.localisation) {
    conditions.push(ilike(annonces.ville, `%${params.localisation}%`));
  }
  // Code postal du widget de recherche accueil (§ "Voiture/Utilitaire/Moto")
  // — préfixe, pas égalité stricte, pour accepter aussi bien un code postal
  // complet qu'un simple département (ex. "33").
  if (params.codePostal) {
    conditions.push(ilike(annonces.codePostal, `${params.codePostal}%`));
  }
  if (params.prix_min) conditions.push(gte(annonces.prixCents, Number(params.prix_min) * 100));
  if (params.prix_max) conditions.push(lte(annonces.prixCents, Number(params.prix_max) * 100));
  if (params.kilometrage_min) conditions.push(gte(annonces.kilometrage, Number(params.kilometrage_min)));
  if (params.kilometrage_max) conditions.push(lte(annonces.kilometrage, Number(params.kilometrage_max)));
  if (params.annee_min) conditions.push(gte(annonces.annee, Number(params.annee_min)));
  if (params.annee_max) conditions.push(lte(annonces.annee, Number(params.annee_max)));
  for (const key of Object.keys(SELECT_COLUMNS) as (keyof typeof SELECT_COLUMNS)[]) {
    // `modele` est traité juste après, en comparaison repliée et
    // multi-valeurs — pas en égalité stricte comme les autres colonnes.
    if (key === "modele") continue;
    const value = params[key];
    if (value) {
      const column = SELECT_COLUMNS[key];
      conditions.push(key === "annee" ? eq(column, Number(value)) : eq(column, value));
    }
  }
  // Modèle : plusieurs valeurs acceptées et comparaison **repliée** (casse et
  // accents). Les deux sont nécessaires au normaliseur de la §14.3 et n'ont pas
  // d'équivalent dans l'égalité stricte d'origine :
  //  - multi-valeurs, parce qu'un alias vise plusieurs orthographes du même
  //    modèle (« 320 » → `Serie 3` et `Série 3` ; « picasso » → les quatre
  //    Picasso du catalogue Citroën) ;
  //  - repliée, parce que le référentiel écrit « Mégane » et la base contient
  //    ce que les vendeurs ont saisi. Une égalité stricte échouerait sans le
  //    moindre signal, ce qui est le mode de défaillance que la §14.3
  //    (Résultat n°5) désigne comme le plus coûteux : « l'acheteur voit
  //    "aucun résultat" et part ».
  if (params.modele) {
    const valeurs = params.modele.split(",").filter(Boolean).map((v) => plierAccents(v));
    if (valeurs.length > 0) {
      conditions.push(
        sql`${colonnePliee(annonces.modele)} in (${sql.join(
          valeurs.map((v) => sql`${v}`),
          sql`, `
        )})`
      );
    }
  }
  // Marque : cases à cocher multiples (catalogue lib/marques.ts) et
  // insensible à la casse, pour matcher aussi les annonces déposées avant le
  // passage du champ de dépôt en liste fermée (texte libre auparavant).
  if (params.marque) {
    const valeurs = params.marque.split(",").filter(Boolean).map((v) => v.toUpperCase());
    if (valeurs.length === 1) {
      conditions.push(sql`upper(${annonces.marque}) = ${valeurs[0]}`);
    } else if (valeurs.length > 1) {
      conditions.push(
        sql`upper(${annonces.marque}) in (${sql.join(
          valeurs.map((v) => sql`${v}`),
          sql`, `
        )})`
      );
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
  // `?|` (opérateur jsonb standard) : vrai si au moins une des valeurs
  // cochées figure dans le tableau JSON stocké pour cette clé — c'est
  // délibérément un OR, pas un sous-ensemble (`<@`), pour matcher une
  // annonce dès qu'elle a au moins un des extérieurs/caractéristiques
  // demandés plutôt que d'exiger qu'elle les ait tous.
  for (const key of ATTRIBUT_ARRAY_KEYS) {
    const raw = params[key];
    if (!raw) continue;
    const valeurs = raw.split(",").filter(Boolean);
    if (valeurs.length === 0) continue;
    conditions.push(
      sql`${annonces.attributs} -> ${key} ?| array[${sql.join(
        valeurs.map((v) => sql`${v}`),
        sql`, `
      )}]::text[]`
    );
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
  // "Dons uniquement" (lib/subcategory-filters.ts) : pas un attribut stocké,
  // juste un raccourci vers un prix nul — sur le modèle de `urgent` ci-dessus
  // plutôt qu'une entrée ATTRIBUT_*_KEYS qui n'aurait aucun sens ici.
  if (params.dons === "1") {
    conditions.push(eq(annonces.prixCents, 0));
  }
  return conditions;
}

// Les cinq tris proposés dans l'interface, plus `distance`, qui n'apparaît que
// lorsqu'un point de référence est choisi (cf. `trisDisponibles`).
export const TRIS = ["pertinence", "recentes", "anciennes", "prix_asc", "prix_desc", "distance"] as const;
export type Tri = (typeof TRIS)[number];

export function trisDisponibles(params: Record<string, string | undefined>): Tri[] {
  const geo = Boolean(params.lat && params.lng && params.rayon);
  return TRIS.filter((t) => t !== "distance" || geo);
}

export function normaliserTri(valeur: string | undefined, params: Record<string, string | undefined>): Tri {
  const possibles = trisDisponibles(params);
  return (possibles as readonly string[]).includes(valeur ?? "") ? (valeur as Tri) : "pertinence";
}

/**
 * Ordre de tri d'une liste d'annonces — transposition des **trois contextes**
 * de la §14.2 (Résultat n°5), dont aucun n'était implémenté : le code ne
 * connaissait que `desc(createdAt)`, y compris sous l'étiquette « Pertinence ».
 *
 *   contexte 1 — page catégorie, pas de requête texte  → fraîcheur
 *   contexte 2 — requête texte    → paliers de pertinence, popularité, fraîcheur
 *   contexte 3 — recherche géolocalisée → distance par paliers, prix, fraîcheur
 *
 * Et l'arbitrage explicite de la §14.2 quand les deux derniers se rencontrent :
 * « sur une requête texte **avec** rayon, la pertinence gagne et la distance
 * passe en filtre seul » — c'est l'ordre des tests ci-dessous, texte d'abord.
 *
 * Deux écarts assumés par rapport à la §14.2, faute des champs correspondants :
 *  - `score_popularite` (entier recalculé par lot) n'existe pas ; `vues` en tient
 *    lieu, ce qui en est le principal ingrédient mais pas la définition.
 *  - `date_mise_en_avant` (date de tri, distincte de `date_maj`) n'existe pas non
 *    plus ; `created_at` en tient lieu. Conséquence connue et non corrigée ici :
 *    un import de masse par flux pro donnerait à tout un stock la même fraîcheur
 *    (§14.2, Résultat n°6 — action n°38, toujours ouverte).
 */
export function buildAnnonceOrderBy(tri: Tri, params: Record<string, string | undefined>): SQL[] {
  if (tri === "prix_asc") return [asc(annonces.prixCents)];
  if (tri === "prix_desc") return [desc(annonces.prixCents)];
  if (tri === "recentes") return [desc(annonces.createdAt)];
  if (tri === "anciennes") return [asc(annonces.createdAt)];

  const geo =
    params.lat && params.lng && params.rayon
      ? { lat: Number(params.lat), lng: Number(params.lng) }
      : null;

  if (tri === "distance" && geo) return ordreDistance(geo.lat, geo.lng);

  // tri === "pertinence" : le contexte décide.
  const requete = requeteTexte(params.q);
  if (requete) {
    return [desc(palierPertinence(requete)), desc(annonces.vues), desc(annonces.createdAt)];
  }
  if (geo) return ordreDistance(geo.lat, geo.lng);
  return [desc(annonces.createdAt)];
}

// `greatest(distance, 30)` reproduit l'`exclude_radius: 30 km` de la §14.2 :
// tout ce qui est à moins de 30 km est réputé à égale distance et se départage
// sur le prix, au-delà la distance réelle reprend la main. Sans ce palier, un
// tri par distance classe au kilomètre près et rend le prix invisible dans
// toute une agglomération.
function ordreDistance(lat: number, lng: number): SQL[] {
  return [
    asc(sql`greatest(${expressionDistanceKm(lat, lng)}, 30)`),
    asc(annonces.prixCents),
    desc(annonces.createdAt),
  ];
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

  // "Dons uniquement" : pas un attribut JSONB, un simple raccourci vers
  // prix = 0 (cf. buildAnnonceConditions) — une seule case à cocher, sur le
  // modèle d'ascenseur/urgent plutôt qu'un vrai comptage par valeur.
  if (key === "dons") {
    const [ligne] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(annonces)
      .innerJoin(users, eq(annonces.userId, users.id))
      .where(and(...conditions, eq(annonces.prixCents, 0)));
    return [{ value: "1", count: ligne?.total ?? 0 }];
  }

  // Jointure users systématique : buildAnnonceConditions peut référencer
  // users.estPro dès qu'un filtre "vendeur" est actif à côté de celui-ci, et
  // cette fonction ne sait pas d'avance quels autres filtres accompagnent `key`.
  if (isAttributArrayKey(key)) {
    // Comptage par élément (pas par valeur brute entière) : une annonce avec
    // ["Balcon", "Jardin"] doit incrémenter le compteur de "Balcon" ET celui
    // de "Jardin", ce qu'un simple GROUP BY sur la valeur JSON ne ferait pas
    // (il compterait "Balcon,Jardin" comme une troisième valeur à part).
    // Repose sur le driver Neon qui désérialise déjà `attributs -> key` (une
    // colonne jsonb) en tableau JS, comme pour tout autre accès à `attributs`
    // dans ce fichier — pas de fonction SQL `jsonb_array_elements` nécessaire.
    const rows = await db
      .select({ valeurs: sql<string[]>`${annonces.attributs} -> ${key}` })
      .from(annonces)
      .innerJoin(users, eq(annonces.userId, users.id))
      .where(and(...conditions, sql`${annonces.attributs} ? ${key}`));
    const compteurs = new Map<string, number>();
    for (const row of rows) {
      for (const valeur of Array.isArray(row.valeurs) ? row.valeurs : []) {
        compteurs.set(valeur, (compteurs.get(valeur) ?? 0) + 1);
      }
    }
    return [...compteurs.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([value, count]) => ({ value, count }));
  }

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

  if (key === "marque") {
    // upper() fusionne "Peugeot" et "PEUGEOT" dans un seul compteur — sans
    // ça, les annonces déposées avant le passage en liste fermée (catalogue
    // lib/marques.ts) apparaîtraient comme une marque à part.
    const valeur = sql<string>`upper(${annonces.marque})`;
    const total = sql<number>`count(*)::int`;
    const rows = await db
      .select({ valeur, total })
      .from(annonces)
      .innerJoin(users, eq(annonces.userId, users.id))
      .where(and(...conditions, isNotNull(annonces.marque)))
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
// Répartition des résultats d'une recherche transverse par rubrique — les
// « facettes » de la page /recherche. Volontairement calculée sans le filtre
// `categorie` (comme `optionCounts` retire la clé du filtre courant), pour que
// choisir une rubrique ne fasse pas disparaître les autres du sélecteur.
export async function compterParCategorie(
  params: Record<string, string | undefined>
): Promise<{ categorie: Categorie; count: number }[]> {
  const reste = { ...params };
  delete reste.categorie;
  const conditions = buildAnnonceConditions(null, reste);
  const rows = await db
    .select({ categorie: annonces.categorie, total: sql<number>`count(*)::int` })
    .from(annonces)
    .innerJoin(users, eq(annonces.userId, users.id))
    .where(and(...conditions))
    .groupBy(annonces.categorie);
  return rows
    .map((r) => ({ categorie: r.categorie, count: r.total }))
    .sort((a, b) => b.count - a.count);
}

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

