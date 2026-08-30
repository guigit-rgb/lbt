/**
 * Jeu de non-régression du normaliseur de requête auto (§14.3, §14.8) —
 * `npx tsx scripts/verif-normaliseur-auto.ts`.
 *
 * Pourquoi ce fichier existe, et pourquoi il est le vrai livrable de l'action
 * n°221 autant que le module qu'il teste : la §14.3 (Résultat n°5) l'a écrit
 * noir sur blanc après avoir mesuré ses propres échecs — « le normaliseur n'est
 * spécifiable qu'avec son jeu de non-régression : les 50 requêtes de l'action
 * n°40 ne sont pas un outil de mesure de la pertinence, ce sont **les tests
 * unitaires du normaliseur**, et elles doivent exister avant la première ligne
 * de code ». Les six défauts corrigés entre la v1 et la v2 du prototype (dont
 * `clio 4 dci 90` → département 90) ne se raisonnent pas, ils se constatent.
 *
 * Composition imposée par l'action n°40, respectée ci-dessous : 15 marque+modèle,
 * 8 avec génération, 7 avec finition, 5 références chiffrées proches, 5 fautes
 * de frappe, 5 langage naturel, 5 géolocalisées.
 *
 * Lancement exact, et il y a un piège : **`DATABASE_URL` doit être définie**,
 * même si le script n'ouvre aucune connexion — importer `lib/db/client.ts`
 * appelle `neon()`, qui refuse une chaîne vide au chargement du module. Une
 * valeur factice suffit :
 *
 *   DATABASE_URL="postgres://u:p@localhost/db" npx tsx scripts/verif-normaliseur-auto.ts
 *
 * (Même contrainte, non documentée jusqu'ici, pour `verif-recherche-sql.ts`.)
 * `tsx` n'est pas une dépendance déclarée du dépôt : il n'est présent que par
 * transitivité (`drizzle-kit`), donc `./node_modules/.bin/tsx` fonctionne
 * aujourd'hui sans garantie pour demain — à épingler avec la CI (action n°217).
 *
 * Le script ne se connecte à rien. Il vérifie trois familles de propriétés :
 *   1. les attentes par requête (filtres produits, filtres interdits) ;
 *   2. les invariants globaux — aucun département inféré d'un nombre nu, aucune
 *      clé dérivée inconnue de `buildAnnonceConditions`, idempotence ;
 *   3. les indicateurs de la §14.3 (Résultat n°4), réimprimés pour comparaison.
 */
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { annonces, users } from "@/lib/db/schema";
import { buildAnnonceConditions, buildAnnonceOrderBy, normaliserTri } from "@/lib/annonce-filters";
import {
  appliquerNormaliseur,
  normaliserRequeteAuto,
  CLES_DERIVABLES,
  TAILLE_REFERENTIEL,
} from "@/lib/normaliseur-auto";

let echecs = 0;
function verifier(intitule: string, condition: boolean, detail?: string) {
  console.log(`${condition ? "  ok  " : "ÉCHEC "} ${intitule}${condition || !detail ? "" : ` — ${detail}`}`);
  if (!condition) echecs++;
}

interface Cas {
  q: string;
  /** Sous-ensemble attendu des paramètres dérivés. */
  attendus?: Record<string, string>;
  /** Clés qui ne doivent PAS être produites. */
  interdits?: string[];
  /** Résidu texte attendu (`null` = plus rien à chercher en texte). */
  residu?: string | null;
  /** Pseudo-champs reconnus mais non filtrables attendus (generation, places…). */
  inertes?: string[];
}

const CAS: Cas[] = [
  // --- 15 marque + modèle -------------------------------------------------
  { q: "renault clio", attendus: { marque: "RENAULT", modele: "Clio" }, residu: null },
  { q: "peugeot 208", attendus: { marque: "PEUGEOT", modele: "208" }, residu: null },
  { q: "citroen c3", attendus: { modele: "C3" }, residu: null },
  { q: "volkswagen golf", attendus: { marque: "VOLKSWAGEN", modele: "Golf" }, residu: null },
  { q: "audi a3", attendus: { marque: "AUDI", modele: "A3" }, residu: null },
  { q: "bmw serie 3", attendus: { marque: "BMW" }, residu: null },
  { q: "mercedes classe a", attendus: { marque: "MERCEDES-BENZ,MERCEDES-AMG,MERCEDES" }, residu: null },
  { q: "dacia sandero", attendus: { marque: "DACIA", modele: "Sandero" }, residu: null },
  { q: "toyota yaris", attendus: { marque: "TOYOTA", modele: "Yaris" }, residu: null },
  { q: "ford fiesta", attendus: { marque: "FORD", modele: "Fiesta" }, residu: null },
  { q: "opel corsa", attendus: { marque: "OPEL", modele: "Corsa" }, residu: null },
  { q: "fiat 500", attendus: { marque: "FIAT", modele: "500" }, residu: null },
  { q: "renault trafic", attendus: { marque: "RENAULT", modele: "Trafic" }, residu: null },
  { q: "peugeot boxer", attendus: { marque: "PEUGEOT", modele: "Boxer" }, residu: null },
  { q: "vw polo", attendus: { marque: "VOLKSWAGEN", modele: "Polo" }, residu: null },

  // --- 8 avec génération --------------------------------------------------
  // La génération n'a aucun champ au schéma : reconnue, retirée du texte,
  // signalée à l'acheteur. La laisser dans `q` garantirait zéro résultat.
  { q: "clio 3", attendus: { modele: "Clio" }, residu: null, inertes: ["generation"] },
  { q: "clio iii", attendus: { modele: "Clio" }, residu: null, inertes: ["generation"] },
  { q: "megane 4", attendus: { modele: "Megane,Mégane" }, residu: null, inertes: ["generation"] },
  { q: "golf vii", attendus: { modele: "Golf" }, residu: null, inertes: ["generation"] },
  { q: "308 phase 2", attendus: { modele: "308" }, residu: null, inertes: ["generation"] },
  { q: "scenic 3 diesel", attendus: { carburant: "Diesel" }, residu: null, inertes: ["generation"] },
  { q: "twingo 2 essence", attendus: { modele: "Twingo", carburant: "Essence" }, residu: null, inertes: ["generation"] },
  // Le bug nommé de la §14.3 (Résultat n°5) : « 5 places » ne doit jamais
  // devenir une génération, et « kangoo » reste reconnu.
  { q: "kangoo 5 places", attendus: { modele: "Kangoo" }, residu: null, inertes: ["places"] },

  // --- 7 avec finition ----------------------------------------------------
  // Le résidu est ici le comportement CORRECT (§14.3, Résultat n°9) : une
  // finition n'est pas énumérable, elle appartient au champ `version`.
  { q: "peugeot 308 gt line", attendus: { marque: "PEUGEOT", modele: "308" }, residu: "gt line" },
  { q: "citroen c4 shine", attendus: { modele: "C4" }, residu: "shine" },
  { q: "peugeot 208 allure", attendus: { marque: "PEUGEOT", modele: "208" }, residu: "allure" },
  { q: "golf gtd", attendus: { modele: "Golf" }, residu: "gtd" },
  { q: "clio rs", attendus: { modele: "Clio" }, residu: "rs" },
  { q: "308 1.5 bluehdi", attendus: { modele: "308" }, residu: "1.5 bluehdi" },
  { q: "audi a3 35 tdi", attendus: { marque: "AUDI", modele: "A3", carburant: "Diesel" }, interdits: ["codePostal"] },

  // --- 5 références chiffrées proches ------------------------------------
  { q: "peugeot 3008", attendus: { marque: "PEUGEOT", modele: "3008" }, residu: null },
  { q: "peugeot 2008", attendus: { marque: "PEUGEOT", modele: "2008" }, residu: null, interdits: ["annee_min"] },
  { q: "peugeot 5008", attendus: { marque: "PEUGEOT", modele: "5008" }, residu: null },
  { q: "audi a4", attendus: { marque: "AUDI", modele: "A4" }, residu: null },
  { q: "bmw 320", attendus: { marque: "BMW" }, residu: null },

  // --- 5 fautes de frappe -------------------------------------------------
  { q: "peugot 3008", attendus: { marque: "PEUGEOT", modele: "3008" }, residu: null },
  { q: "renaut clio", attendus: { marque: "RENAULT", modele: "Clio" }, residu: null },
  { q: "volkswagen gold", attendus: { marque: "VOLKSWAGEN", modele: "Golf" }, residu: null },
  { q: "citroën c3 picaso", attendus: { modele: "C3" }, residu: "picaso" },
  { q: "mercedez classe c", attendus: { marque: "MERCEDES-BENZ,MERCEDES-AMG,MERCEDES" } },

  // --- 5 langage naturel --------------------------------------------------
  { q: "voiture occasion moins de 8000 euros", attendus: { prix_max: "8000" } },
  { q: "clio essence moins de 100 000 km", attendus: { modele: "Clio", carburant: "Essence", kilometrage_max: "100000" }, residu: null },
  { q: "suv 7 places boite auto", attendus: { typeVehicule: "SUV / 4x4", boite: "Automatique" }, residu: null, inertes: ["places"] },
  { q: "308 a partir de 2018", attendus: { modele: "308", annee_min: "2018" }, residu: null },
  { q: "clio 4 dci 90", attendus: { modele: "Clio" }, interdits: ["codePostal"], inertes: ["generation"] },

  // --- 5 géolocalisées ----------------------------------------------------
  { q: "clio 87000", attendus: { modele: "Clio", codePostal: "87000" }, residu: null },
  { q: "golf dep. 33", attendus: { modele: "Golf", codePostal: "33" }, residu: null },
  { q: "peugeot 208 (87)", attendus: { marque: "PEUGEOT", modele: "208", codePostal: "87" }, residu: null },
  { q: "clio a bordeaux", attendus: { modele: "Clio", localisation: "bordeaux" }, residu: null },
  { q: "3008 87", attendus: { modele: "3008" }, interdits: ["codePostal"], residu: "87" },
];


/**
 * Cas de régression trouvés HORS du jeu de 50, en sondant le module à la main
 * une fois les 50 requêtes vertes. Tenus à part pour que les indicateurs
 * ci-dessous restent comparables au tableau du §14.3 (Résultat n°4), mais ils
 * sont la partie la plus utile du fichier : chacun d'eux était un défaut réel
 * qu'aucune des 50 requêtes ne montrait. La leçon de la §14.3 se répète à
 * l'identique — « ces défauts ne se raisonnent pas, ils se constatent ».
 */
const CAS_REGRESSION: Cas[] = [
  // Rattrapage flou sur un mot vide : « auto » est à une transposition de
  // « Alto » (Suzuki), « cher » à une insertion de « Chery ». Les deux
  // produisaient un filtre de marque/modèle sur une requête qui n'en contient
  // aucun — le faux positif le plus grave rencontré.
  { q: "voiture auto occasion", interdits: ["modele", "marque"] },
  { q: "voiture pas cher", interdits: ["modele", "marque"] },
  // Un nom de modèle qui contient un nom de marque : « rover » était consommé
  // par la passe marque, et le trigramme n'était plus visible.
  { q: "range rover evoque", attendus: { modele: "Range Rover Evoque" }, residu: null },
  { q: "land rover defender", attendus: { marque: "LAND ROVER", modele: "Defender" }, residu: null },
  // Un kilométrage à 5 chiffres passait pour un code postal (variante non vue
  // par la §14.3 de son Résultat n°5).
  { q: "clio 90000 km", attendus: { kilometrage_max: "90000" }, interdits: ["codePostal"], residu: null },
  // Puissance fiscale : « 5 cv » n'est pas une puissance DIN, et le « 5 » ne
  // doit pas devenir une génération faute d'avoir été consommé.
  { q: "clio 5 cv", attendus: { modele: "Clio" }, interdits: ["puissanceDin_min"], residu: null },
  // Prix abrégé.
  { q: "clio 10k", attendus: { modele: "Clio", prix_max: "10000" }, residu: null },
  { q: "entre 5000 et 10000 €", attendus: { prix_min: "5000", prix_max: "10000" }, residu: null },
  // Ambiguïté de marque assumée (Seat/Cupra depuis 2018, §14.3 Résultat n°7) :
  // le modèle est filtré, la marque n'est pas devinée.
  { q: "leon", attendus: { modele: "Leon,León" }, interdits: ["marque"], residu: null },
  { q: "porsche cayenne", attendus: { marque: "PORSCHE", modele: "Cayenne" }, residu: null },
  // Préfixe électrique : porte l'énergie en plus du modèle.
  { q: "e-208", attendus: { modele: "e-208", carburant: "Électrique" }, residu: null },
  { q: "ë-c4", attendus: { carburant: "Électrique" }, residu: null },
  // Modèle vs millésime : la Peugeot 2008 est le seul nom de modèle du marché
  // français qui soit aussi une année plausible. Le modèle gagne, et l'année
  // qui suit reste lisible.
  { q: "peugeot 2008 2015", attendus: { modele: "2008", annee_min: "2015", annee_max: "2015" }, residu: null },
  // Requête complète, tous étages mobilisés.
  {
    q: "a3 tdi 150 ch dep. 87",
    attendus: { modele: "A3", carburant: "Diesel", puissanceDin_min: "140", puissanceDin_max: "160", codePostal: "87" },
    residu: null,
  },

  // --- troncatures (trouvées le 2026-08-30, §14.10 Résultat n°2) -----------
  // Une troncature n'est pas une faute de frappe. Les 50 requêtes du jeu sont
  // toutes des requêtes *terminées* : par construction, aucune ne pouvait
  // montrer ces cas, qui se produisent pourtant à CHAQUE frappe de la barre de
  // recherche. Mesuré avant correction : « megan » → `marque=MEGA` (un
  // constructeur grec de microcars, donc une page vide), « kang » →
  // `modele=Tang` (BYD). Attendu désormais : aucun filtre, le token part en
  // résidu, et la recherche par préfixe de la §14.10 le retrouve dans le titre.
  { q: "megan", interdits: ["marque", "modele"], residu: "megan" },
  { q: "kang", interdits: ["marque", "modele"], residu: "kang" },
  { q: "trafi", interdits: ["marque", "modele"], residu: "trafi" },
  { q: "renaul", interdits: ["marque", "modele"], residu: "renaul" },
  { q: "captu", interdits: ["marque", "modele"], residu: "captu" },
  // Contre-épreuve : le garde-fou ne doit pas désarmer le correcteur sur de
  // vraies fautes de frappe, qui ne sont préfixes de rien.
  { q: "meganne", attendus: { modele: "Megane,Mégane" }, residu: null },
  { q: "kangooo", attendus: { modele: "Kangoo" }, residu: null },
  { q: "volkswagem", attendus: { marque: "VOLKSWAGEN" }, residu: null },
];

console.log(`\n=== Normaliseur de requête auto — ${CAS.length} requêtes du jeu de l'action n°40 ===\n`);

let avecFiltre = 0;
let qVide = 0;
const residus: string[] = [];
const departementsInferes: string[] = [];
const clesVues = new Set<string>();
const debut = process.hrtime.bigint();

function verifierCas(cas: Cas, compter: boolean) {
  const n = normaliserRequeteAuto(cas.q);
  const derives = n.derives;
  for (const k of Object.keys(derives)) clesVues.add(k);
  if (compter) {
    if (Object.keys(derives).length > 0) avecFiltre++;
    if (n.residu === null) qVide++;
    else residus.push(n.residu);
  }

  const problemes: string[] = [];
  for (const [k, v] of Object.entries(cas.attendus ?? {})) {
    if (derives[k] !== v) problemes.push(`${k} attendu « ${v} », obtenu « ${derives[k] ?? "—"} »`);
  }
  for (const k of cas.interdits ?? []) {
    if (derives[k] !== undefined) problemes.push(`${k} ne devait pas être produit (« ${derives[k]} »)`);
  }
  if (cas.residu !== undefined && n.residu !== cas.residu) {
    problemes.push(`résidu attendu « ${cas.residu ?? "∅"} », obtenu « ${n.residu ?? "∅"} »`);
  }
  for (const champ of cas.inertes ?? []) {
    if (!n.reconnus.some((r) => r.champ === champ && !r.filtrable)) {
      problemes.push(`« ${champ} » devait être reconnu non filtrable`);
    }
  }
  verifier(
    `« ${cas.q} » → ${Object.entries(derives).map(([k, v]) => `${k}=${v}`).join(" ") || "aucun filtre"}${
      n.residu ? `  ·  q="${n.residu}"` : ""
    }`,
    problemes.length === 0,
    problemes.join(" ; ")
  );

  // Invariant transversal : un département ne sort jamais d'un nombre nu.
  // Reconstitué depuis la requête plutôt que depuis l'attente du cas, pour que
  // l'invariant tienne même sur un cas futur dont personne n'aurait prévu
  // l'interdit (§14.3, Résultat n°5 — l'erreur est silencieuse et fatale).
  const marqueursGeo = /\d{5}|\(\d{2,3}\)|dep\.?|dept|departement|dans le|du \d/i;
  if (derives.codePostal && !marqueursGeo.test(cas.q)) departementsInferes.push(cas.q);

  // Idempotence : ré-appliquer le normaliseur sur sa propre sortie ne doit rien
  // changer. C'est ce qui autorise `buildAnnonceConditions` ET la page à
  // l'appeler tous les deux (§14.8).
  const premier = appliquerNormaliseur("vehicules", { q: cas.q });
  const second = appliquerNormaliseur("vehicules", premier);
  if (JSON.stringify(premier) !== JSON.stringify(second)) {
    verifier(`idempotence sur « ${cas.q} »`, false, `${JSON.stringify(premier)} → ${JSON.stringify(second)}`);
  }
}

for (const cas of CAS) verifierCas(cas, true);

console.log(`\n=== ${CAS_REGRESSION.length} cas de régression trouvés hors du jeu de 50 ===\n`);
for (const cas of CAS_REGRESSION) verifierCas(cas, false);
const dureeMs = Number(process.hrtime.bigint() - debut) / 1e6;

// Latence mesurée à part, sur 200 répétitions du jeu entier : le chiffre
// ci-dessus inclut les assertions, la construction de SQL et le premier appel
// (donc la compilation JIT et l'indexation des référentiels).
const debutLatence = process.hrtime.bigint();
const REPETITIONS = 200;
for (let r = 0; r < REPETITIONS; r++) for (const cas of CAS) normaliserRequeteAuto(cas.q);
const latenceMs = Number(process.hrtime.bigint() - debutLatence) / 1e6 / (REPETITIONS * CAS.length);

console.log("\n--- invariants ---");
verifier(
  "aucun département/code postal inféré d'un nombre nu",
  departementsInferes.length === 0,
  departementsInferes.join(" | ")
);
verifier(
  "toutes les clés dérivées sont déclarées dans CLES_DERIVABLES",
  [...clesVues].every((k) => (CLES_DERIVABLES as readonly string[]).includes(k)),
  [...clesVues].filter((k) => !(CLES_DERIVABLES as readonly string[]).includes(k)).join(", ")
);

// Une clé dérivée que `buildAnnonceConditions` ignorerait serait un filtre
// fantôme : affiché à l'acheteur, absent de la requête SQL. On le vérifie en
// comparant le nombre de conditions produites avec et sans le paramètre.
console.log("\n--- chaque clé dérivable produit bien une condition SQL ---");
const VALEURS_TEST: Record<string, string> = {
  marque: "RENAULT", modele: "Clio", carburant: "Diesel", boite: "Automatique",
  typeVehicule: "Berline", permis: "Sans permis (voiturette)",
  annee_min: "2015", annee_max: "2020", prix_min: "1000", prix_max: "20000",
  kilometrage_min: "1000", kilometrage_max: "150000",
  puissanceDin_min: "80", puissanceDin_max: "100", codePostal: "87", localisation: "limoges",
};
const socle = buildAnnonceConditions("vehicules", {}).length;
for (const cle of CLES_DERIVABLES) {
  const avec = buildAnnonceConditions("vehicules", { [cle]: VALEURS_TEST[cle] }).length;
  verifier(`${cle} → +${avec - socle} condition(s)`, avec > socle);
}

// Le normaliseur ne doit toucher QUE la verticale automobile : `clio` sur Mode
// ou sur la recherche transverse ne doit pas produire `marque=RENAULT`, qui
// exclurait d'un coup toutes les rubriques non automobiles.
console.log("\n--- périmètre ---");
verifier(
  "aucune normalisation hors de la catégorie vehicules",
  JSON.stringify(appliquerNormaliseur("mode", { q: "clio 3" })) === JSON.stringify({ q: "clio 3" })
);
verifier(
  "aucune normalisation sur la recherche transverse (categorie = null)",
  JSON.stringify(appliquerNormaliseur(null, { q: "clio 3" })) === JSON.stringify({ q: "clio 3" })
);
verifier(
  "?brut=1 désactive la normalisation",
  JSON.stringify(appliquerNormaliseur("vehicules", { q: "clio 3", brut: "1" })) ===
    JSON.stringify({ q: "clio 3", brut: "1" })
);
verifier(
  "un filtre explicite de l'acheteur n'est jamais écrasé par une déduction",
  appliquerNormaliseur("vehicules", { q: "clio", marque: "PEUGEOT" }).marque === "PEUGEOT"
);

// Le tri doit basculer du contexte 2 (pertinence texte) au contexte 1
// (fraîcheur) quand la normalisation a vidé `q` : sans cela, la page trierait
// sur un `ts_rank_cd` d'une requête qui n'existe plus.
console.log("\n--- tri (§14.2, contextes) ---");
const spNormalise = appliquerNormaliseur("vehicules", { q: "renault clio" });
const ordre = buildAnnonceOrderBy(normaliserTri(undefined, spNormalise), spNormalise);
verifier("q vidé par le normaliseur → tri par fraîcheur, pas par pertinence", ordre.length === 1);
const spResidu = appliquerNormaliseur("vehicules", { q: "peugeot 308 gt line" });
verifier(
  "résidu texte conservé → tri par paliers de pertinence",
  buildAnnonceOrderBy(normaliserTri(undefined, spResidu), spResidu).length === 3
);

// SQL réellement émis pour une requête normalisée — à lire, pas à asserter :
// c'est le contrôle qui a permis de voir, en §14.7, qu'une expression
// paramétrée ne correspond jamais à un index d'expression.
const sqlNormalise = db
  .select({ annonce: annonces, vendeurNom: users.displayName })
  .from(annonces)
  .innerJoin(users, eq(annonces.userId, users.id))
  .where(and(...buildAnnonceConditions("vehicules", { q: "clio 3 essence moins de 8000 €" })))
  .toSQL();
console.log("\n--- SQL émis pour « clio 3 essence moins de 8000 € » ---\n" + sqlNormalise.sql);
console.log("--- paramètres liés ---\n" + JSON.stringify(sqlNormalise.params));

const taille = TAILLE_REFERENTIEL();
console.log(`\n--- référentiel embarqué : ${taille.marques} clés de marque, ${taille.modeles} clés de modèle ---`);
console.log("\n--- indicateurs (comparables au tableau du §14.3, Résultat n°4) ---");
console.log(`  requêtes produisant au moins un filtre : ${avecFiltre}/${CAS.length} — ${Math.round((avecFiltre / CAS.length) * 100)} %`);
console.log(`  requêtes dont q est entièrement vide   : ${qVide}/${CAS.length} — ${Math.round((qVide / CAS.length) * 100)} %`);
console.log(`  requêtes laissant un résidu texte      : ${residus.length}`);
console.log(`  filtres département inférés à tort     : ${departementsInferes.length}`);
console.log(`  latence moyenne (200 répétitions)      : ${latenceMs.toFixed(4)} ms/requête`);
console.log(`  dont premier passage + assertions      : ${(dureeMs / CAS.length).toFixed(3)} ms/requête`);
console.log(`  résidus                                : ${residus.join(" | ")}`);

console.log(`\n${echecs === 0 ? "TOUT VERT" : `${echecs} ÉCHEC(S)`}\n`);
process.exit(echecs === 0 ? 0 : 1);
