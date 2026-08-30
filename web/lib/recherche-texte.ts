import { sql, type AnyColumn, type SQL } from "drizzle-orm";

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
// Le normaliseur de requête auto de la §14.3 — qui transforme 82 % des requêtes
// automobiles en *filtres* plutôt qu'en texte à scorer — existe depuis le
// 2026-08-28 (lib/normaliseur-auto.ts, §14.8) et s'applique en amont, dans
// `buildAnnonceConditions`. Ce fichier ne voit donc que le résidu textuel :
// « clio 3 essence » lui arrive vidé de ses trois critères.
//
// Ajouté le 2026-08-30 (§14.10, action §17 n°222) : la **recherche par
// préfixe** sur le dernier token, sans laquelle « cli » ne trouvait pas
// « clio » et aucune suggestion à la frappe n'était possible. Voir le bloc de
// commentaires devant `decouperPrefixe` — la décision structurante est que la
// branche préfixe est *additive*, donc incapable de dégrader la recherche
// existante.

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
/**
 * Colonne repliée (minuscules + accents) pour une comparaison d'égalité
 * tolérante. Même table que l'indexation plein texte, et pour la même raison :
 * le normaliseur de requête auto (§14.3) émet des valeurs de filtre issues de
 * son référentiel (« Mégane », « Série 3 »), tandis que la base contient ce que
 * les vendeurs ont saisi (« megane », « MEGANE », « Serie 3 »). Une égalité
 * stricte y échouerait silencieusement — un filtre faux, c'est-à-dire une page
 * vide sans explication, exactement ce que la §14.3 (Résultat n°5) proscrit.
 *
 * Volontairement sans index dédié : la sélectivité utile vient des autres
 * conditions (catégorie, état, marque) et le volume du pilote ne le justifie
 * pas. À revoir si `modele` devient un filtre de tête sur un gros catalogue.
 */
export function colonnePliee(colonne: SQL | AnyColumn): SQL<string> {
  return sql<string>`translate(lower(coalesce(${colonne}, '')), '${sql.raw(PLIAGE_SOURCE)}', '${sql.raw(
    PLIAGE_CIBLE
  )}')`;
}

// ---------------------------------------------------------------------------
// Recherche par préfixe (§14.10, action §17 n°222)
// ---------------------------------------------------------------------------
//
// Le problème : « cli » ne trouve pas « clio ». `websearch_to_tsquery` ne
// produit jamais l'opérateur `:*` de Postgres, et sans lui aucune suggestion à
// la frappe n'est possible — le visiteur qui tape voit une page vide jusqu'au
// dernier caractère du mot.
//
// Trois décisions gouvernent le dispositif ci-dessous, et la première est la
// seule qui compte vraiment :
//
//  1. **La branche préfixe est ADDITIVE par construction.** La condition émise
//     est `websearch(requête complète) OR (branche préfixe)`, jamais la seule
//     branche préfixe. Conséquence : *aucun* défaut de la branche préfixe ne
//     peut rendre la recherche pire qu'avant le 2026-08-30 — au pire elle
//     n'ajoute rien. C'est ce qui permet de se passer de la liste de mots vides
//     de Postgres : `to_tsquery('french', 'de:*')` rend une tsquery **vide**
//     (les mots vides sont supprimés par le dictionnaire), et une tsquery vide
//     ne matche rien ; en AND strict, « canapé de » serait passé de « des
//     résultats » à « aucun résultat ». En OR additif, la branche meurt seule
//     et la recherche d'hier répond. Le prix est un second parcours d'index
//     par requête, non mesurable au volume du pilote.
//
//  2. **Le dernier token n'est préfixé que s'il est déjà purement
//     alphanumérique** (`/^[\p{L}\p{N}]+$/u`). Motif : la tokenisation de
//     Postgres n'est pas la nôtre. `cx-5` produit trois lexèmes (`cx-5`, `cx`,
//     `5`), `id.3` en produit un ou deux selon l'analyseur — le reconstruire à
//     la main, c'est risquer d'émettre un lexème qui n'existe dans aucun
//     vecteur, donc de ne rien ajouter tout en croyant élargir. Sur un token
//     ponctué, on laisse `websearch_to_tsquery` faire son travail (il applique
//     exactement la tokenisation de `to_tsvector`) et on n'ajoute pas de
//     préfixe. C'est un renoncement mesuré, pas un oubli.
//
//  3. **Un token purement numérique n'est jamais préfixé.** C'est la troisième
//     apparition de la règle 2 de la §14.3 (« le nombre nu n'est pas un
//     critère »), et le cas est cette fois-ci mesurable à la lecture :
//     `renault 5` deviendrait `renault & 5:*` et ramènerait toute Renault dont
//     la description contient « 50 000 km », « 5 portes » ou « 5 places » ;
//     `clio 90000` matcherait `900000`. Le token doit contenir au moins une
//     lettre.
//
// La sortie de `websearch_to_tsquery` est conservée telle quelle sur la requête
// complète : les opérateurs de recherche web (`"expression exacte"`, `or`,
// `-exclusion`) continuent donc de fonctionner exactement comme avant, sans que
// ce fichier ait à les réimplémenter. Le guillemet est même l'échappatoire
// documentée : une requête dont le dernier token porte un `"` n'est pas
// préfixée — qui écrit `"audi a3"` demande une expression exacte.

/** Opérateurs textuels de `websearch_to_tsquery` (et leurs équivalents
 *  français, que Postgres ne connaît pas mais qu'un visiteur peut taper) : un
 *  dernier token égal à l'un d'eux n'est pas un mot à préfixer. */
const OPERATEURS_TEXTE = new Set(["or", "ou", "and", "et"]);

/** Longueur minimale d'un token préfixable. À 1 caractère, `a:*` parcourt
 *  l'essentiel de l'index pour n'apporter aucune information. */
const LONGUEUR_MIN_PREFIXE = 2;

export interface DecoupagePrefixe {
  /** Tout ce qui précède le dernier token, tel quel — passé à
   *  `websearch_to_tsquery` sans réinterprétation. Chaîne vide si la requête
   *  n'a qu'un seul token. */
  tete: string;
  /** Lexème à préfixer, sans le `:*`, ou `null` si aucun préfixe ne doit être
   *  émis (voir les trois règles ci-dessus). */
  prefixe: string | null;
}

/**
 * Découpe une requête déjà pliée (sortie de `requeteTexte`) en une tête à
 * traiter en recherche exacte et un dernier token à traiter en préfixe.
 * Fonction pure, sans réseau ni base : c'est elle qu'exerce
 * scripts/verif-recherche-prefixe.ts.
 */
export function decouperPrefixe(requete: string): DecoupagePrefixe {
  const tokens = requete.split(/\s+/).filter(Boolean);
  const dernier = tokens[tokens.length - 1];
  const tete = tokens.slice(0, -1).join(" ");
  const refuser: DecoupagePrefixe = { tete: "", prefixe: null };
  if (!dernier) return refuser;
  // Négation (`-diesel`) : préfixer une exclusion l'élargirait, c'est-à-dire
  // retirerait des résultats — l'inverse exact de ce que la branche additive
  // garantit. Jamais.
  if (dernier.startsWith("-")) return refuser;
  // Expression exacte : le guillemet est l'échappatoire documentée.
  if (dernier.includes('"')) return refuser;
  if (OPERATEURS_TEXTE.has(dernier)) return refuser;
  // Règle 2 : token déjà purement alphanumérique, sinon la tokenisation de
  // Postgres et la nôtre divergent en silence.
  if (!/^[\p{L}\p{N}]+$/u.test(dernier)) return refuser;
  if (dernier.length < LONGUEUR_MIN_PREFIXE) return refuser;
  // Règle 3 : au moins une lettre.
  if (!/\p{L}/u.test(dernier)) return refuser;
  return { tete, prefixe: dernier };
}

/** Opérande de préfixe, prêt pour `to_tsquery`. Le lexème est validé
 *  alphanumérique par `decouperPrefixe`, donc syntaxiquement inoffensif pour
 *  l'analyseur de tsquery — c'est la garantie qui remplace la gestion d'erreurs
 *  que `websearch_to_tsquery` offrait gratuitement (`to_tsquery` **lève une
 *  exception** sur une requête malformée, il ne rend pas un résultat vide). */
function operandePrefixe(prefixe: string): string {
  return `${prefixe}:*`;
}

export function conditionTexte(requete: string): SQL {
  const exacte = sql`${sql.raw(EXPRESSION_VECTEUR)} @@ websearch_to_tsquery('${sql.raw(
    CONFIG
  )}', ${requete})`;
  const { tete, prefixe } = decouperPrefixe(requete);
  if (!prefixe) return exacte;
  const surPrefixe = sql`${sql.raw(EXPRESSION_VECTEUR)} @@ to_tsquery('${sql.raw(
    CONFIG
  )}', ${operandePrefixe(prefixe)})`;
  // Un seul token (« cli ») : la tête est vide, et `websearch_to_tsquery('')`
  // rend une tsquery vide qui ne matche rien — la brancher en AND tuerait la
  // branche préfixe, précisément dans le cas qui la justifie. D'où deux formes.
  if (!tete) return sql`(${exacte} or ${surPrefixe})`;
  const teteExacte = sql`${sql.raw(EXPRESSION_VECTEUR)} @@ websearch_to_tsquery('${sql.raw(
    CONFIG
  )}', ${tete})`;
  return sql`(${exacte} or (${teteExacte} and ${surPrefixe}))`;
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
/** Facteur de déclassement d'une correspondance obtenue par préfixe seul.
 *  Une annonce trouvée parce que le visiteur n'avait pas fini de taper son mot
 *  est une correspondance moins sûre qu'une correspondance exacte : sans ce
 *  facteur, les lignes que seule la branche préfixe ramène auraient un rang de
 *  0 (`ts_rank_cd` d'une tsquery qui ne les sélectionne pas) et tomberaient
 *  toutes dans le même palier 0,00, où elles seraient classées par nombre de
 *  vues — c'est-à-dire sans aucune pertinence. Le facteur les réordonne entre
 *  elles tout en les maintenant, en règle générale, sous les correspondances
 *  exactes. **Ce n'est pas une garantie d'ordre strict** : un préfixe très bien
 *  placé (termes adjacents dans le titre) peut dépasser une correspondance
 *  exacte très diffuse (termes éloignés dans une longue description), et c'est
 *  assumé — dans ce cas de figure, la première est effectivement la meilleure. */
const DECLASSEMENT_PREFIXE = 0.5;

export function palierPertinence(requete: string): SQL<number> {
  const rangExact = sql<number>`ts_rank_cd(${sql.raw(EXPRESSION_VECTEUR)}, websearch_to_tsquery('${sql.raw(
    CONFIG
  )}', ${requete}), 32)`;
  const { prefixe } = decouperPrefixe(requete);
  if (!prefixe) return sql<number>`round(${rangExact}::numeric, 2)`;
  // `to_tsquery` ici aussi, sur le même opérande validé alphanumérique. Une
  // tsquery vide (mot vide) rend un rang de 0 : sans conséquence, on est dans
  // le calcul du tri et non dans la sélection des lignes.
  const rangPrefixe = sql<number>`ts_rank_cd(${sql.raw(EXPRESSION_VECTEUR)}, to_tsquery('${sql.raw(
    CONFIG
  )}', ${operandePrefixe(prefixe)}), 32)`;
  return sql<number>`round(greatest(${rangExact}, ${rangPrefixe} * ${sql.raw(
    String(DECLASSEMENT_PREFIXE)
  )})::numeric, 2)`;
}
