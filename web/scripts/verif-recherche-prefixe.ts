/**
 * Contrôle HORS BASE de la recherche par préfixe et de la barre de suggestions
 * (§14.10, action §17 n°222) — `./node_modules/.bin/tsx scripts/verif-recherche-prefixe.ts`.
 *
 * Ne se connecte à rien. Trois choses sont vérifiées, et les deux premières
 * sont celles qu'aucun test d'interface n'attraperait :
 *
 *  1. **le découpage tête/préfixe** — les trois règles de la §14.10 (token
 *     alphanumérique, au moins une lettre, jamais une négation ni une
 *     expression exacte) ;
 *  2. **la forme du SQL émis** — que la branche préfixe soit bien en `or` avec
 *     la branche exacte (donc additive), que l'expression `to_tsvector`
 *     indexée soit inchangée, et que l'opérande de `to_tsquery` reste un
 *     paramètre lié ;
 *  3. **le classement des suggestions**, y compris les faux amis que la règle
 *     « début de mot » doit écarter.
 */
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { annonces, users } from "@/lib/db/schema";
import { buildAnnonceConditions, buildAnnonceOrderBy, normaliserTri } from "@/lib/annonce-filters";
import { decouperPrefixe, requeteTexte } from "@/lib/recherche-texte";
import { suggerer, tailleIndexSuggestions, type Suggestion } from "@/lib/suggestions-recherche";

let echecs = 0;
function verifier(intitule: string, condition: boolean, detail?: string) {
  console.log(`${condition ? "  ok  " : "ÉCHEC "} ${intitule}${!condition && detail ? ` — ${detail}` : ""}`);
  if (!condition) echecs++;
}

// ---------------------------------------------------------------------------
// 1. Découpage tête / préfixe
// ---------------------------------------------------------------------------
console.log("\n--- découpage tête / préfixe ---");

// [requête pliée, tête attendue, préfixe attendu (null = pas de préfixe)]
const CAS: [string, string, string | null][] = [
  // Le cas qui motive toute l'action : un seul token partiel.
  ["cli", "", "cli"],
  ["clio", "", "clio"],
  ["cli essenc", "cli", "essenc"],
  ["citroen c3 diesel", "citroen c3", "diesel"],
  // Règle 3 : un token purement numérique n'est jamais préfixé. « renault 5 »
  // ne doit pas ramener les 50 000 km et les 5 portes.
  ["renault 5", "", null],
  ["clio 90000", "", null],
  ["208", "", null],
  // Un token alphanumérique mixte est légitime : la lettre lève l'ambiguïté
  // avec un nombre nu, exactement comme `cleModeleAdmissible` du normaliseur.
  ["audi a3", "audi", "a3"],
  ["bmw x5", "bmw", "x5"],
  ["i20", "", "i20"],
  // Règle 2 : token ponctué → aucune préfixation, la tokenisation de Postgres
  // et la nôtre divergeraient en silence.
  ["mazda cx-5", "", null],
  ["volkswagen id.3", "", null],
  ["saab 9-3", "", null],
  ["audi e-tron", "", null],
  // Négation : préfixer une exclusion l'élargirait, donc retirerait des
  // résultats — interdit par la garantie d'additivité.
  ["clio -diesel", "", null],
  // Expression exacte : le guillemet est l'échappatoire documentée.
  ['"range rover"', "", null],
  ['"audi a3" tdi', '"audi a3"', "tdi"],
  // Opérateurs de websearch_to_tsquery, et leurs équivalents français.
  ["clio or", "", null],
  ["clio ou", "", null],
  // Longueur minimale.
  ["c", "", null],
  ["clio c", "", null],
  // Espaces multiples : le découpage ne doit pas produire de token vide.
  ["clio    essenc", "clio", "essenc"],
];

for (const [entree, teteAttendue, prefixeAttendu] of CAS) {
  const { tete, prefixe } = decouperPrefixe(entree);
  verifier(
    `« ${entree} » → tête « ${teteAttendue} », préfixe ${prefixeAttendu === null ? "aucun" : `« ${prefixeAttendu} »`}`,
    tete === teteAttendue && prefixe === prefixeAttendu,
    `obtenu tête « ${tete} », préfixe ${prefixe === null ? "aucun" : `« ${prefixe} »`}`
  );
}

// Le découpage travaille sur la sortie de `requeteTexte` (donc pliée) : une
// requête accentuée ne doit jamais produire un préfixe accentué, sinon le
// lexème émis n'existe dans aucun vecteur.
const pliee = requeteTexte("Citroën Béb");
verifier("pliage appliqué avant le découpage", pliee === "citroen beb" && decouperPrefixe(pliee!).prefixe === "beb");

// ---------------------------------------------------------------------------
// 2. Forme du SQL émis
// ---------------------------------------------------------------------------
console.log("\n--- SQL émis ---");

function sqlDe(sp: Record<string, string | undefined>) {
  return db
    .select({ annonce: annonces, vendeurNom: users.displayName })
    .from(annonces)
    .innerJoin(users, eq(annonces.userId, users.id))
    .where(and(...buildAnnonceConditions(null, sp)))
    .orderBy(...buildAnnonceOrderBy(normaliserTri(undefined, sp), sp))
    .limit(200)
    .toSQL();
}

const unToken = sqlDe({ q: "cli" });
console.log("\n" + unToken.sql + "\n");
console.log("paramètres : " + JSON.stringify(unToken.params) + "\n");

verifier(
  "un seul token : les deux branches sont en `or` (la branche préfixe est additive)",
  / or /.test(unToken.sql) && unToken.sql.includes("websearch_to_tsquery") && unToken.sql.includes("to_tsquery")
);
verifier(
  "un seul token : l'opérande `cli:*` est un paramètre lié, jamais interpolé",
  unToken.params.includes("cli:*") && !unToken.sql.includes("cli:*")
);
verifier(
  "un seul token : pas de `and` entre la branche exacte et la branche préfixe",
  !/websearch_to_tsquery\([^)]*\)\s+and\s+/.test(unToken.sql)
);

const deuxTokens = sqlDe({ q: "cli essenc" });
verifier(
  "deux tokens : la tête est passée à websearch_to_tsquery séparément",
  deuxTokens.params.includes("cli essenc") && deuxTokens.params.includes("cli") && deuxTokens.params.includes("essenc:*")
);
verifier(
  "deux tokens : forme `exacte or (tête and préfixe)`",
  / or \(/.test(deuxTokens.sql) && / and /.test(deuxTokens.sql)
);

const numerique = sqlDe({ q: "trottinette 500" });
verifier(
  "token numérique : aucune branche préfixe (une seule tsquery)",
  !numerique.params.some((p) => typeof p === "string" && p.endsWith(":*"))
);

// L'expression indexée doit rester intacte : c'est le défaut muet de la §14.7.
// Si elle change, l'index existe toujours mais n'est plus jamais utilisé.
const EXPRESSION_ATTENDUE =
  `to_tsvector('french', translate(lower(coalesce("annonces"."titre", '') || ' ' || ` +
  `coalesce("annonces"."description", '')), 'àâäáãåçéèêëíìîïñòóôöõùúûüýÿ', 'aaaaaaceeeeiiiinooooouuuuyy'))`;
verifier(
  "l'expression to_tsvector indexée est inchangée par l'ajout du préfixe",
  unToken.sql.includes(EXPRESSION_ATTENDUE)
);

// Tri : le déclassement de la branche préfixe doit apparaître dans l'ORDER BY.
verifier(
  "le tri par pertinence classe aussi les correspondances obtenues par préfixe",
  /greatest\(ts_rank_cd/.test(unToken.sql) && unToken.sql.includes("* 0.5")
);
verifier(
  "sans préfixe possible, le tri reste le `ts_rank_cd` simple de la §14.7",
  !/greatest\(ts_rank_cd/.test(numerique.sql) && numerique.sql.includes("ts_rank_cd")
);

// ---------------------------------------------------------------------------
// 3. Suggestions
// ---------------------------------------------------------------------------
console.log("\n--- suggestions à la frappe ---");
console.log(`index construit : ${tailleIndexSuggestions()} entrées`);

const libelles = (s: Suggestion[]) => s.map((x) => x.label);
const premiere = (saisie: string) => suggerer(saisie)[0];

verifier("« cli » propose Clio en tête", premiere("cli")?.label === "Clio");
verifier(
  "« cli » → URL filtrée marque + modèle, pas une recherche texte",
  premiere("cli")?.href === "/vehicules?marque=RENAULT&modele=Clio"
);
verifier("« vehic » propose la rubrique Véhicules", libelles(suggerer("vehic")).includes("Véhicules"));
verifier("« immo » propose la rubrique Immobilier", premiere("immo")?.label === "Immobilier");
verifier(
  "« rover » trouve « Range Rover » (début du second mot)",
  libelles(suggerer("rover")).some((l) => l.startsWith("Range Rover"))
);
verifier(
  "« picasso » trouve les Picasso de Citroën",
  libelles(suggerer("picasso")).some((l) => l.includes("Picasso"))
);
verifier(
  "faux ami écarté : « ass » ne propose pas « Classe C » (pas un début de mot)",
  !libelles(suggerer("ass")).some((l) => l.startsWith("Classe"))
);
verifier(
  "une correspondance exacte passe devant une correspondance par préfixe",
  premiere("clio")?.label === "Clio"
);
verifier("saisie d'une seule lettre : aucune suggestion", suggerer("c").length === 0);
verifier("saisie vide : aucune suggestion", suggerer("").length === 0 && suggerer("   ").length === 0);
verifier("au plus 10 suggestions", suggerer("c3").length <= 10 && suggerer("a").length <= 10);

const avecRepli = suggerer("playmobil 3000 complet");
verifier(
  "requête sans correspondance : la dernière ligne est le repli plein texte",
  avecRepli.length >= 1 &&
    avecRepli[avecRepli.length - 1].type === "texte" &&
    avecRepli[avecRepli.length - 1].href === "/recherche?q=playmobil%203000%20complet"
);
verifier(
  "le repli plein texte est TOUJOURS présent, même quand la liste est pleine",
  suggerer("c3").some((s) => s.type === "texte")
);
verifier(
  "accents : « mégane » et « megane » donnent le même premier résultat",
  premiere("mégane")?.href === premiere("megane")?.href
);
verifier(
  "casse : « CLIO » et « clio » donnent le même premier résultat",
  premiere("CLIO")?.href === premiere("clio")?.href
);
verifier(
  "toutes les URL de suggestion sont des chemins internes",
  suggerer("c").length === 0 &&
    ["cli", "vehic", "rover", "immo", "c3", "duster"].every((s) =>
      suggerer(s).every((x) => x.href.startsWith("/"))
    )
);
verifier(
  "critère d'admission : toute sous-catégorie proposée porte un filtre dans son URL",
  ["velo", "immo", "vehic", "telepho", "canap", "chauss", "poussett", "appart"].every((s) =>
    suggerer(s).every((x) => x.type !== "sous-categorie" || x.href.includes("?"))
  )
);
verifier(
  "« velo » ne propose plus « Vélos » vers la rubrique nue, mais ses enfants filtrés",
  !suggerer("velo").some((x) => x.type === "sous-categorie" && x.label === "Vélos") &&
    libelles(suggerer("velo")).some((l) => l.startsWith("Vélo "))
);
verifier(
  "doublon de casse réglé : « audi » ne propose pas deux fois la même destination",
  new Set(suggerer("audi").map((x) => x.href.toLowerCase())).size === suggerer("audi").length
);
verifier(
  "aucun doublon (libellé + URL) dans une même liste",
  ["cli", "c3", "a3", "rover", "vehic"].every((s) => {
    const l = suggerer(s).map((x) => `${x.label}|${x.href}`);
    return new Set(l).size === l.length;
  })
);

for (const saisie of ["cli", "duster", "rover", "vehic", "immo", "velo"]) {
  const liste = suggerer(saisie);
  console.log(
    `  « ${saisie} » → ${liste.map((s) => `${s.label}${s.contexte ? ` (${s.contexte})` : ""}`).join(" · ")}`
  );
}

console.log(`\n${echecs === 0 ? "Tous les contrôles passent." : `${echecs} contrôle(s) en échec.`}`);
process.exit(echecs === 0 ? 0 : 1);
