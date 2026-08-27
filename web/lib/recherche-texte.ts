import { sql, type SQL } from "drizzle-orm";

// Recherche plein texte — repli MVP explicitement prévu par le cahier des
// charges §14.1 (« Postgres seul (repli MVP) ») et acté par la §13.2
// (Résultat n°2) : au volume du pilote, Typesense n'est pas nécessaire, et le
// champ de recherche de l'en-tête était inerte (`action="#"`) depuis l'origine.
//
// Trois décisions structurent ce fichier, et elles ne sont pas interchangeables :
//
//  1. **Le pliage des accents se fait avec `translate()`, pas avec `unaccent()`.**
//     `unaccent()` est déclarée STABLE par l'extension `unaccent` : Postgres
//     refuse de l'utiliser dans une expression d'index, ce qui oblige d'ordinaire
//     à créer une configuration de recherche dédiée (`french_unaccent`) — donc
//     une extension à installer et un objet de base supplémentaire à créer avant
//     tout déploiement, sous peine d'erreur `42704` sur *chaque* recherche.
//     `translate()` et `lower()` sont IMMUTABLE : l'expression est indexable telle
//     quelle, sur n'importe quel Postgres, sans extension ni configuration.
//     Sur un site français, le pliage n'est pas un raffinement : sans lui,
//     « citroen », « velo », « telephone », « canape » ou « bebe » — tapés sans
//     accent par la majorité des visiteurs mobiles — ne trouvent rien.
//
//  2. **Le même pliage est appliqué des deux côtés**, à l'indexation (SQL) et à
//     la requête (JS), à partir des deux mêmes constantes. Toute divergence
//     entre les deux tables produit des requêtes qui ne matchent rien, et le
//     symptôme est invisible en test si l'on ne teste qu'avec des mots sans
//     accent. C'est pourquoi `PLIAGE_SOURCE`/`PLIAGE_CIBLE` sont exportées et
//     utilisées par les deux chemins plutôt que réécrites de chaque côté.
//
//  3. **Les constantes sont interpolées littéralement dans le SQL (`sql.raw`),
//     jamais paramétrées.** Postgres n'utilise un index d'expression que si
//     l'expression de la requête est *identique* à celle de l'index ; une
//     expression bâtie avec des paramètres `$1` ne correspond jamais à un index
//     bâti avec des littéraux. Les valeurs interpolées sont des constantes de ce
//     fichier, jamais des données utilisateur — la requête de l'utilisateur, elle,
//     reste toujours un paramètre lié (cf. `conditionTexte`).
//
// Ce que ce fichier ne fait PAS, et qui reste à faire (§14.3) : le normaliseur de
// requête auto (reconnaissance marque/modèle/génération, chiffres romains, codes
// commerciaux, seuils numériques, communes) qui transforme 82 % des requêtes auto
// en filtres. Ici, « clio 3 essence » part intégralement en recherche texte.

/** Caractères pliés à l'indexation ET à la requête. Doit rester synchronisé
 *  caractère par caractère avec `PLIAGE_CIBLE` (même longueur, même ordre).
 *  Les ligatures (œ, æ) sont volontairement absentes : `translate()` est un
 *  remplacement caractère → caractère et ne sait pas produire « oe »/« ae ». */
export const PLIAGE_SOURCE = "àâäáãåçéèêëíìîïñòóôöõùúûüýÿ";
export const PLIAGE_CIBLE = "aaaaaaceeeeiiiinooooouuuuyy";

/** Configuration de recherche Postgres. `french` fournit le stemmer et la liste
 *  de mots vides ; il reçoit ici du texte déjà déplié, ce qui dégrade un peu son
 *  travail (« été » lui arrive en « ete », donc n'est plus reconnu comme mot
 *  vide). Effet symétrique des deux côtés, donc sans conséquence sur le
 *  matching — seulement quelques mots vides indexés pour rien. */
const CONFIG = "french";

// Expression indexée. Doit rester **strictement identique** à celle du
// `CREATE INDEX` de scripts/migration-2026-08-27-recherche-plein-texte.sql :
// à la moindre différence, l'index existe mais n'est jamais utilisé, et rien
// ne le signale (la recherche continue de fonctionner, en balayage séquentiel).
const EXPRESSION_VECTEUR =
  `to_tsvector('${CONFIG}', translate(lower(` +
  `coalesce("annonces"."titre", '') || ' ' || coalesce("annonces"."description", '')` +
  `), '${PLIAGE_SOURCE}', '${PLIAGE_CIBLE}'))`;

/** Pliage côté requête — même table que `translate()` côté SQL. Volontairement
 *  pas `String.normalize("NFD")`, qui plierait *plus* de caractères que la table
 *  SQL (š → s, ā → a…) et casserait donc la symétrie du point 2 ci-dessus. */
export function plierAccents(texte: string): string {
  let sortie = "";
  for (const caractere of texte.toLowerCase()) {
    const position = PLIAGE_SOURCE.indexOf(caractere);
    sortie += position === -1 ? caractere : PLIAGE_CIBLE[position];
  }
  return sortie;
}

/** Longueur maximale d'une requête acceptée. Au-delà, la requête est tronquée :
 *  `websearch_to_tsquery` ne lève pas d'erreur sur une entrée absurde (contrairement
 *  à `to_tsquery`), mais rien ne justifie d'indexer le coût d'une requête de 10 Ko. */
const LONGUEUR_MAX = 120;

/**
 * Requête texte normalisée, ou `null` s'il n'y a rien à chercher.
 * Sert de test unique « cette recherche a-t-elle une composante texte ? » :
 * page catégorie, page /recherche et recherches sauvegardées doivent toutes
 * répondre pareil, sinon le tri par pertinence et le filtrage divergent.
 */
export function requeteTexte(q: string | undefined): string | null {
  if (!q) return null;
  const normalisee = plierAccents(q).trim().slice(0, LONGUEUR_MAX);
  // Une requête qui ne contient aucun caractère alphanumérique (« ??? », « --- »)
  // produit une tsquery vide, qui ne matche rien : autant la traiter comme
  // absente et rendre la liste complète plutôt qu'une page vide inexplicable.
  return /[\p{L}\p{N}]/u.test(normalisee) ? normalisee : null;
}

/** Condition de correspondance plein texte. La requête utilisateur reste un
 *  paramètre lié ; seules les constantes du fichier sont interpolées. */
export function conditionTexte(requete: string): SQL {
  return sql`${sql.raw(EXPRESSION_VECTEUR)} @@ websearch_to_tsquery('${sql.raw(CONFIG)}', ${requete})`;
}

/**
 * Palier de pertinence — équivalent Postgres du `_text_match(buckets: 10)` de
 * la §14.2 (Résultat n°5, contexte 2) : « Typesense découpe les résultats en
 * groupes de pertinence égale, puis laisse le critère suivant réordonner à
 * l'intérieur de chaque groupe ».
 *
 * Postgres n'a pas d'équivalent natif : `ts_rank_cd` rend un score continu, et
 * trier dessus directement laisserait la fraîcheur sans aucun effet (deux scores
 * ne sont jamais exactement égaux). L'arrondi crée les paliers.
 *
 *  - `ts_rank_cd` (et non `ts_rank`) : tient compte de la **proximité** des
 *    termes, ce qui est exactement ce qu'on veut sur des titres du type
 *    « Marque Modèle Version Année ».
 *  - drapeau de normalisation `32` = `rang / (rang + 1)`, qui ramène le score
 *    dans [0, 1[ et rend l'arrondi comparable d'une requête à l'autre. Sans lui
 *    l'échelle dépend du nombre de termes, donc la taille des paliers aussi.
 *  - arrondi à 2 décimales : environ 10 à 20 paliers effectifs en pratique. Ce
 *    n'est PAS l'équivalent exact des 10 paquets de taille égale de Typesense
 *    (cf. « Limites » du cahier des charges §14.7) — c'est l'approximation la
 *    plus simple qui produise le comportement voulu.
 */
export function palierPertinence(requete: string): SQL<number> {
  return sql<number>`round(ts_rank_cd(${sql.raw(EXPRESSION_VECTEUR)}, websearch_to_tsquery('${sql.raw(
    CONFIG
  )}', ${requete}), 32)::numeric, 2)`;
}
