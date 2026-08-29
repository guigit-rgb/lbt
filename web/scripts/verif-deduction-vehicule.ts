/**
 * Jeu de non-régression de la déduction marque/modèle depuis un titre
 * (§14.9, action §17 n°226) — `npx tsx scripts/verif-deduction-vehicule.ts`.
 *
 * Ne se connecte à rien. Même contrainte que `verif-normaliseur-auto.ts` :
 * `DATABASE_URL` doit être **définie** (une valeur factice suffit), parce que
 * la chaîne d'imports passe par `lib/db/client.ts`, qui appelle `neon()` au
 * chargement du module :
 *
 *   DATABASE_URL="postgres://u:p@localhost/db" npx tsx scripts/verif-deduction-vehicule.ts
 *
 * ## Pourquoi un jeu distinct de celui du normaliseur
 *
 * Parce que ce n'est pas la même question. `verif-normaliseur-auto.ts` mesure
 * ce qu'une **requête d'acheteur** produit comme filtres, et y accepte — y
 * cherche même — l'élargissement : `modele=Leon,León` est un bon résultat pour
 * une recherche. Ici on mesure ce qu'on s'autorise à **écrire dans la base
 * d'un vendeur** à partir de son titre, où l'élargissement n'a aucun sens : il
 * faut une valeur, une seule, ou rien.
 *
 * La leçon du 2026-08-28 (§14.8 : cinq faux positifs graves trouvés à la main
 * *après* que le jeu de 50 requêtes soit passé au vert) est donc reprise telle
 * quelle : les cas de ce fichier ne sont pas des variations du jeu précédent,
 * ce sont les cas où **écrire** est différent de **chercher**.
 */

import { deduireVehiculeDepuisTitre, completerVehicule } from "@/lib/deduction-vehicule";
import { MARQUES_AUTRES, MARQUES_COURANTES } from "@/lib/marques";
import { and } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { annonces } from "@/lib/db/schema";
import { buildAnnonceConditions } from "@/lib/annonce-filters";

let echecs = 0;
let total = 0;

function verifier(intitule: string, condition: boolean, detail?: string) {
  total++;
  if (!condition) {
    echecs++;
    console.log(`  ✗ ${intitule}${detail ? ` — ${detail}` : ""}`);
  }
}

interface Cas {
  titre: string;
  marqueConnue?: string;
  marque: string | null;
  modele: string | null;
  /** Commentaire affiché quand le cas échoue : dit *pourquoi* il est là. */
  motif: string;
}

// --- Famille 1 : le cas ordinaire ------------------------------------------
// Un titre de vendeur bien formé doit produire les deux colonnes.
const ORDINAIRES: Cas[] = [
  { titre: "Renault Clio IV 1.5 dCi 90 Business", marque: "RENAULT", modele: "Clio", motif: "titre canonique" },
  { titre: "Peugeot 208 essence 2019 très bon état", marque: "PEUGEOT", modele: "208", motif: "modèle numérique à 3 chiffres" },
  { titre: "Skoda Octavia Combi 1.6 TDI", marque: "SKODA", modele: "Octavia", motif: "marque à orthographe alternative (Škoda)" },
  { titre: "Toyota Yaris hybride 2020 - 45000 km", marque: "TOYOTA", modele: "Yaris", motif: "titre chargé de facettes" },
  { titre: "Superbe Audi A3 Sportback 2.0 TDI 150", marque: "AUDI", modele: "A3 Sportback", motif: "bigramme de modèle" },
  { titre: "Nissan Qashqai 1.5 dci 110 Tekna 2017", marque: "NISSAN", modele: "Qashqai", motif: "finition inconnue en fin de titre" },
  { titre: "Camping-car Fiat Ducato aménagé", marque: "FIAT", modele: "Ducato", motif: "mot hors vocabulaire auto en tête" },
];

// --- Famille 2 : une seule valeur, jamais une liste -------------------------
// Le normaliseur élargit volontairement ; l'écriture doit resserrer.
const RESSERREMENTS: Cas[] = [
  {
    titre: "Vends BMW Série 3 320d 2016",
    marque: "BMW",
    modele: "Série 3",
    motif: "`Serie 3,Série 3` doit se replier en une valeur, accentuée",
  },
  {
    titre: "Citroën C3 Picasso 1.6 HDi",
    marque: "CITROEN",
    modele: "C3 Picasso",
    motif: "`CITROEN,CITROËN` → la valeur du catalogue lib/marques.ts",
  },
  {
    titre: "Mercedes Classe C 220 d",
    marque: "MERCEDES-BENZ",
    modele: "Classe C",
    motif:
      "défaut mesuré le 2026-08-29 : `220` est un alias BMW (Série 2) et le normaliseur le retient malgré la marque reconnue — l'écriture doit l'écarter",
  },
  {
    titre: "Seat Leon FR 2.0 TDI 150",
    marque: "SEAT",
    modele: "León",
    motif: "`Leon,León` → une seule valeur",
  },
  {
    titre: "Mercedes AMG GT 63",
    marque: "MERCEDES AMG",
    modele: null,
    motif: "sous-marque du catalogue : la marque s'écrit, le modèle reste inconnu",
  },
];

// --- Famille 3 : l'abstention ----------------------------------------------
// Les cas où ne rien écrire est la bonne réponse. Ce sont eux qui protègent la
// base, et ils sont plus importants que les précédents.
const ABSTENTIONS: Cas[] = [
  {
    titre: "Citroën Picasso 1.6 HDi",
    marque: "CITROEN",
    modele: null,
    motif: "quatre Picasso au catalogue Citroën : aucun ne peut être choisi",
  },
  {
    titre: "Picasso 1.6 HDi",
    marqueConnue: "CITROEN",
    marque: "CITROEN",
    modele: null,
    motif: "la marque connue ne lève pas cette ambiguïté-là, elle est interne à la marque",
  },
  {
    titre: "Voiture à vendre urgent",
    marque: null,
    modele: null,
    motif: "aucun signal : les mots vides ne doivent produire aucune écriture",
  },
  {
    titre: "Remorque porte-voiture 750 kg",
    marque: null,
    modele: null,
    motif: "annonce de la rubrique véhicules qui n'est pas une voiture",
  },
  {
    titre: "Scooter Peugeot Kisbee 50cc",
    marque: "PEUGEOT",
    modele: null,
    motif: "modèle deux-roues absent du référentiel : la marque seule s'écrit",
  },
  {
    titre: "BMW 320d Touring",
    marque: "BMW",
    modele: null,
    motif:
      "`320d` n'est pas `320` : le référentiel ne coupe pas le suffixe de motorisation, donc pas de modèle — et c'est bien un résidu à journaliser",
  },
];

// --- Famille 4 : la marque connue désambiguïse ------------------------------
const MARQUE_CONNUE: Cas[] = [
  {
    titre: "Duster 2019",
    marque: null,
    modele: "Duster",
    motif: "Duster est Dacia *ou* Renault : le modèle s'écrit, pas la marque",
  },
  {
    titre: "Duster 2019",
    marqueConnue: "RENAULT",
    marque: "RENAULT",
    modele: "Duster",
    motif: "la marque déjà en base doit servir à la désambiguïsation, pas seulement être conservée",
  },
  {
    titre: "Golf 7 GTD 184ch full options",
    marque: "VOLKSWAGEN",
    modele: "Golf",
    motif: "marque déduite du modèle quand un seul constructeur est candidat",
  },
  {
    titre: "Range Rover Evoque 2.2 SD4",
    marque: "LAND ROVER",
    modele: "Range Rover Evoque",
    motif: "trigramme dont le premier mot est aussi un nom de marque (§14.8, défaut n°2)",
  },
];

// --- Famille 5 : les faux positifs trouvés à la main le 2026-08-29 ----------
// Aucun de ces cas n'était visible dans les quatre familles ci-dessus, parce
// qu'elles sont toutes construites à partir de titres de **voitures**. La
// rubrique `vehicules` contient aussi des motos, des remorques, des pièces
// détachées et des bateaux, et le référentiel de la §14.3 est automobile : ce
// sont ces annonces-là qui recevaient des données fausses. Trouvés en sondant
// 60 titres réalistes après que les 98 assertions précédentes furent au vert —
// même leçon que le 2026-08-28 (§14.8), et c'est la deuxième fois.
const FAUX_POSITIFS: Cas[] = [
  {
    titre: "Yamaha MT-07 2019 A2",
    marque: null,
    modele: null,
    motif: "écrivait marque=AUDI, modele=A2 : `A2` est une catégorie de permis moto autant qu'une Audi",
  },
  {
    titre: "Kawasaki Z900 A2 bridable",
    marque: null,
    modele: null,
    motif: "même cause ; ni Yamaha ni Kawasaki ne sont au catalogue automobile de lib/marques.ts",
  },
  {
    titre: "Yamaha Tmax 530 DX",
    marque: null,
    modele: null,
    motif: "écrivait marque=BMW, modele=Série 5 : `530` est un code commercial BMW du référentiel",
  },
  {
    titre: "Honda CB 500 F 2020",
    marque: "HONDA",
    modele: null,
    motif: "écrivait modele=500 (la 500 est une Fiat) malgré la marque Honda explicitement nommée",
  },
  {
    titre: "BMW R 1200 GS Adventure",
    marque: "BMW",
    modele: null,
    motif: "écrivait modele=GS (la GS est une Citroën) : une moto BMW n'a pas de modèle au référentiel",
  },
  {
    titre: "Remorque bagagère 500 kg avec bâche",
    marque: null,
    modele: null,
    motif: "écrivait marque=FIAT, modele=500 sur une remorque",
  },
  {
    titre: "Pneus hiver 205/55 R16 Michelin x4",
    marque: null,
    modele: null,
    motif: "écrivait marque=PEUGEOT, modele=205 sur un jeu de pneus",
  },
  {
    titre: "Mini Countryman Cooper D",
    marque: "MINI",
    modele: null,
    motif: "deux modèles Mini dans le même titre : abstention, pas un tirage au sort",
  },
];

console.log("Déduction marque/modèle depuis le titre (§14.9) — jeu de non-régression\n");

for (const [nom, cas] of [
  ["Ordinaires", ORDINAIRES],
  ["Resserrements", RESSERREMENTS],
  ["Abstentions", ABSTENTIONS],
  ["Marque connue", MARQUE_CONNUE],
  ["Faux positifs du 2026-08-29", FAUX_POSITIFS],
] as [string, Cas[]][]) {
  console.log(`--- ${nom} (${cas.length} cas) ---`);
  for (const c of cas) {
    const d = deduireVehiculeDepuisTitre(c.titre, c.marqueConnue ?? null);
    verifier(
      `« ${c.titre} »${c.marqueConnue ? ` [marque connue : ${c.marqueConnue}]` : ""} → marque`,
      d.marque === c.marque,
      `attendu ${c.marque ?? "null"}, obtenu ${d.marque ?? "null"} (${c.motif})`
    );
    verifier(
      `« ${c.titre} »${c.marqueConnue ? ` [marque connue : ${c.marqueConnue}]` : ""} → modèle`,
      d.modele === c.modele,
      `attendu ${c.modele ?? "null"}, obtenu ${d.modele ?? "null"} (${c.motif})`
    );
  }
}

// --- Propriétés générales ---------------------------------------------------
console.log("--- Propriétés ---");

// 1. La saisie du vendeur n'est jamais remplacée.
{
  const r = completerVehicule("Renault Clio IV 1.5 dCi", "PEUGEOT", "208");
  verifier("saisie du vendeur préservée (marque)", r.marque === "PEUGEOT", `obtenu ${r.marque}`);
  verifier("saisie du vendeur préservée (modèle)", r.modele === "208", `obtenu ${r.modele}`);
  verifier("aucune déduction annoncée quand rien n'est déduit", r.champsDeduits.length === 0);
}

// 2. Complétion partielle : seul le champ vide est rempli.
{
  const r = completerVehicule("Renault Clio IV 1.5 dCi", "RENAULT", "");
  verifier("champ vide complété", r.modele === "Clio", `obtenu ${r.modele ?? "undefined"}`);
  verifier("champ rempli inchangé", r.marque === "RENAULT");
  verifier("déduction annoncée", r.champsDeduits.join(",") === "modele", r.champsDeduits.join(","));
}

// 3. Idempotence — la propriété que la §14.8 (Résultat n°8) a payée d'un défaut
//    avant de l'obtenir. Réappliquer la complétion à son propre résultat ne doit
//    plus rien changer : sans cela, un vendeur qui réenregistre son annonce
//    verrait ses colonnes bouger toutes seules.
{
  const titres = [...ORDINAIRES, ...RESSERREMENTS, ...ABSTENTIONS, ...MARQUE_CONNUE, ...FAUX_POSITIFS];
  for (const c of titres) {
    const un = completerVehicule(c.titre, c.marqueConnue ?? null, null);
    const deux = completerVehicule(c.titre, un.marque ?? null, un.modele ?? null);
    verifier(
      `idempotence « ${c.titre} »`,
      deux.marque === un.marque && deux.modele === un.modele && deux.champsDeduits.length === 0,
      `1er passage ${un.marque}/${un.modele}, 2e ${deux.marque}/${deux.modele}`
    );
  }
}

// 4. Une marque écrite appartient toujours au catalogue de lib/marques.ts —
//    sinon elle serait invisible du panneau de filtres, qui n'affiche que les
//    valeurs du catalogue.
{
  const catalogue = new Set<string>([...MARQUES_COURANTES, ...MARQUES_AUTRES]);
  const titres = [...ORDINAIRES, ...RESSERREMENTS, ...ABSTENTIONS, ...MARQUE_CONNUE, ...FAUX_POSITIFS];
  for (const c of titres) {
    const d = deduireVehiculeDepuisTitre(c.titre, c.marqueConnue ?? null);
    verifier(
      `marque déduite dans le catalogue « ${c.titre} »`,
      d.marque === null || catalogue.has(d.marque),
      `${d.marque} absente de lib/marques.ts`
    );
  }
}

// 5. Aucune écriture ne doit sortir d'un titre vide ou absurde.
{
  for (const titre of ["", "   ", "???", "à vendre"]) {
    const d = deduireVehiculeDepuisTitre(titre);
    verifier(`titre inexploitable « ${titre} »`, d.marque === null && d.modele === null, `${d.marque}/${d.modele}`);
  }
}

// --- Le filet côté SQL ------------------------------------------------------
// Ces assertions sont les seules du fichier qui portent sur du SQL, et elles
// sont là parce qu'aucune session automatisée n'a de base : `toSQL()` est le
// seul moyen de vérifier que le filet est branché du bon côté, et surtout
// qu'il ne l'est PAS quand l'acheteur a coché une case.
console.log("--- Filet SQL (§14.9) ---");
{
  const sqlDe = (params: Record<string, string | undefined>) =>
    db
      .select({ id: annonces.id })
      .from(annonces)
      .where(and(...buildAnnonceConditions("vehicules", params)))
      .toSQL();

  const deduit = sqlDe({ q: "clio" });
  verifier(
    "filtre déduit du texte : la branche de repli sur le titre est présente",
    deduit.sql.includes("btrim") && deduit.sql.includes(" ~ "),
    deduit.sql
  );
  verifier(
    "le motif exige un mot entier (bordures non alphanumériques)",
    deduit.params.some((p) => typeof p === "string" && p === "(^|[^a-z0-9])(clio)([^a-z0-9]|$)"),
    JSON.stringify(deduit.params)
  );

  const coche = sqlDe({ modele: "Clio" });
  verifier(
    "case cochée dans le panneau : aucun repli, la colonne fait foi",
    !coche.sql.includes(" ~ "),
    coche.sql
  );

  const marqueDeduite = sqlDe({ q: "renault" });
  verifier(
    "marque déduite du texte : même filet que pour le modèle",
    marqueDeduite.sql.includes(" ~ "),
    marqueDeduite.sql
  );
  const marqueCochee = sqlDe({ marque: "RENAULT" });
  verifier("marque cochée : aucun repli", !marqueCochee.sql.includes(" ~ "), marqueCochee.sql);

  // Hors rubrique véhicules, le normaliseur ne s'applique pas (§14.8) : il n'y
  // a donc jamais de filtre déduit, donc jamais de filet.
  const horsAuto = db
    .select({ id: annonces.id })
    .from(annonces)
    .where(and(...buildAnnonceConditions("mode", { q: "clio" })))
    .toSQL();
  verifier("hors véhicules : ni filtre modèle ni filet", !horsAuto.sql.includes(" ~ "), horsAuto.sql);

  // L'échappatoire `?brut=1` doit désactiver le filet en même temps que la
  // normalisation — sinon elle ne rendrait plus la recherche « telle qu'écrite ».
  const brut = sqlDe({ q: "clio", brut: "1" });
  verifier("?brut=1 : ni normalisation ni filet", !brut.sql.includes(" ~ "), brut.sql);
}

console.log(`\n${total - echecs}/${total} assertions vérifiées.`);
if (echecs > 0) {
  console.log(`${echecs} ÉCHEC(S).`);
  process.exit(1);
}
console.log("Tout est vert.");
