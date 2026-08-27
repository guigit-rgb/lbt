/**
 * Contrôle HORS BASE de la recherche plein texte (§14.7) — `npx tsx scripts/verif-recherche-sql.ts`.
 *
 * Ne se connecte à rien : il imprime le SQL que Drizzle émettrait et vérifie
 * que l'expression de recherche de la requête est **identique caractère par
 * caractère** à celle indexée par
 * scripts/migration-2026-08-27-recherche-plein-texte.sql.
 *
 * Raison d'être : c'est le seul défaut de cette fonctionnalité qui ne se voit
 * pas. Si les deux expressions divergent, l'index existe, la recherche rend les
 * bons résultats, aucun test ne casse — et chaque requête balaye la table
 * entière. Le contrôle `EXPLAIN` en fin de script de migration attrape le même
 * écart en base ; celui-ci l'attrape avant le déploiement.
 */
import { and, eq } from "drizzle-orm";
import { readFileSync } from "node:fs";
import { db } from "@/lib/db/client";
import { annonces, users } from "@/lib/db/schema";
import { buildAnnonceConditions, buildAnnonceOrderBy, normaliserTri } from "@/lib/annonce-filters";
import { plierAccents, requeteTexte } from "@/lib/recherche-texte";

let echecs = 0;
function verifier(intitule: string, condition: boolean) {
  console.log(`${condition ? "  ok  " : "ÉCHEC "} ${intitule}`);
  if (!condition) echecs++;
}

// 1. Le SQL de la page /recherche
const sp: Record<string, string | undefined> = { q: "Citroën C3 Diesel" };
const requeteSql = db
  .select({ annonce: annonces, vendeurNom: users.displayName })
  .from(annonces)
  .innerJoin(users, eq(annonces.userId, users.id))
  .where(and(...buildAnnonceConditions(null, sp)))
  .orderBy(...buildAnnonceOrderBy(normaliserTri(undefined, sp), sp))
  .limit(200)
  .toSQL();

console.log("\n--- SQL émis par /recherche ---\n" + requeteSql.sql);
console.log("--- paramètres liés ---\n" + JSON.stringify(requeteSql.params) + "\n");

// 2. L'expression indexée, relue dans le script de migration lui-même
const migration = readFileSync(new URL("./migration-2026-08-27-recherche-plein-texte.sql", import.meta.url), "utf8");
// Comparaison à l'espacement près (le SQL de la migration est indenté sur
// plusieurs lignes) et au préfixe de table près (`"annonces"."titre"` dans la
// requête, `titre` dans le CREATE INDEX — Postgres les résout au même Var).
// Drizzle cite les identifiants (`"annonces"."titre"`), le CREATE INDEX ne les
// cite pas (`titre`) : les deux formes désignent le même Var pour Postgres.
const normaliser = (s: string) =>
  s.replace(/\s+/g, "").replace(/"annonces"\./g, "").replace(/"(titre|description)"/g, "$1");
const debut = migration.indexOf("to_tsvector(", migration.indexOf("USING gin ("));
// La tranche va jusqu'à COMMIT et se termine donc par la parenthèse de
// `USING gin (` et le point-virgule du CREATE INDEX : eux seuls sont retirés.
const expressionMigration = normaliser(migration.slice(debut, migration.indexOf("COMMIT;"))).replace(/\);$/, "");

console.log("--- comparaison requête / index ---");
verifier(
  "l'expression to_tsvector de la requête est celle indexée par la migration",
  normaliser(requeteSql.sql).includes(expressionMigration)
);
verifier(
  "la requête de l'utilisateur reste un paramètre lié, jamais interpolée",
  requeteSql.sql.includes("websearch_to_tsquery('french', $") &&
    requeteSql.params.includes("citroen c3 diesel")
);

// 3. Symétrie du pliage des accents (le défaut le plus coûteux : muet côté serveur)
console.log("\n--- pliage des accents ---");
for (const [entree, attendu] of [
  ["Citroën", "citroen"],
  ["TÉLÉPHONE", "telephone"],
  ["bébé", "bebe"],
  ["vélo", "velo"],
  // Volontairement NON plié : `translate()` côté SQL ne connaît pas ce
  // caractère, donc le plier côté requête casserait la symétrie.
  ["Škoda", "škoda"],
] as const) {
  verifier(`« ${entree} » → « ${attendu} »`, plierAccents(entree) === attendu);
}

// 4. Requêtes qui ne doivent PAS déclencher de recherche texte
console.log("\n--- requêtes vides ou sans contenu ---");
for (const entree of ["", "   ", "???", "---"]) {
  verifier(`${JSON.stringify(entree)} → aucune recherche texte`, requeteTexte(entree) === null);
}
verifier("« Clio 3 essence » → recherche texte", requeteTexte("Clio 3 essence") === "clio 3 essence");

// 5. Les trois contextes de tri de la §14.2 (Résultat n°5)
console.log("\n--- les trois contextes de tri ---");
const ordre = (params: Record<string, string | undefined>) =>
  db
    .select()
    .from(annonces)
    .orderBy(...buildAnnonceOrderBy(normaliserTri(params.tri, params), params))
    .toSQL().sql;

const geo = { lat: "43.6045", lng: "1.4442", rayon: "50" };
verifier(
  "contexte 1 (ni texte ni rayon) : fraîcheur seule",
  /order by "annonces"\."created_at" desc$/i.test(ordre({}))
);
verifier(
  "contexte 2 (texte) : paliers de pertinence, puis vues, puis fraîcheur",
  /ts_rank_cd/.test(ordre({ q: "clio" })) && /"vues" desc/.test(ordre({ q: "clio" }))
);
verifier(
  "contexte 3 (rayon seul) : distance par paliers de 30 km, puis prix",
  /greatest\(/.test(ordre(geo)) && /"prix_cents" asc/.test(ordre(geo))
);
verifier(
  "arbitrage §14.2 : texte + rayon → la pertinence gagne, la distance n'est plus qu'un filtre",
  /ts_rank_cd/.test(ordre({ ...geo, q: "kangoo" })) && !/greatest\(/.test(ordre({ ...geo, q: "kangoo" }))
);
verifier("« distance » refusé sans coordonnées", !ordre({ tri: "distance" }).includes("greatest("));

console.log(`\n${echecs === 0 ? "Tous les contrôles passent." : `${echecs} contrôle(s) en échec.`}`);
process.exit(echecs === 0 ? 0 : 1);
