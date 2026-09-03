/**
 * Contrôle HORS BASE et HORS RÉSEAU des pages légales
 * (§8.9, actions §17 n°212 et n°253) —
 * `./node_modules/.bin/tsx scripts/verif-pages-legales.ts`.
 *
 * Six familles de contrôles. Les trois premières relèvent de la plomberie et
 * un œil humain les attraperait ; les trois dernières, non — et ce sont
 * celles-là qui justifient le script.
 *
 *  1. **Registre et routage** — chaque document déclaré a une page, chaque
 *     chemin est unique, et aucun ne masque une rubrique d'annonces.
 *  2. **Pied de page** — les liens légaux sont rendus depuis le registre et
 *     plus aucun `href="#"` ne subsiste dans la barre légale. C'est
 *     l'obligation dont un contrôleur constate le manquement en ouvrant le
 *     site (décret n° 2017-1434, §8.2 Résultat n°1).
 *  3. **Balisage** — l'analyseur `lib/legal/balisage.ts` fait ce qu'il dit, et
 *     aucun lien interne ne pointe vers une page qui n'existe pas.
 *  4. **Clauses obligatoires** — chaque document contient les mentions dont
 *     l'absence est un manquement identifié dans le cahier des charges. C'est
 *     un contrôle de présence, pas de qualité juridique : il empêche une
 *     réécriture de perdre une clause, il ne remplace pas le juriste.
 *  5. **Interdits de rédaction — le cœur du script.** Le §8.8 (Résultat n°2)
 *     a établi que dans le dispositif de l'article L. 32-3 du CPCE, la
 *     finalité écrite *est* le fait générateur du régime : le même traitement
 *     est autorisé par le III ou interdit par le IV selon le mot employé, et
 *     la sanction de référence est pénale (art. 226-15 du code pénal). Trois
 *     formulations sont donc proscrites dans tout document publié, et une
 *     relecture humaine ne les rattrapera pas de façon fiable à chaque
 *     modification.
 *  6. **Mentions à figer** — comptées et listées. Tant qu'il en reste une, le
 *     lot est un projet, et le dire est plus utile que de l'oublier.
 */
import { readFileSync, existsSync } from "node:fs";
import { CATEGORIES } from "@/lib/db/schema";
import { jetons, texteNu } from "@/lib/legal/balisage";
import {
  DOCUMENTS_LEGAUX,
  mentionsAFiger,
  textesDuBloc,
  texteIntegral,
  totalMentionsAFiger,
  unitesDeSens,
} from "@/lib/legal/documents";

let echecs = 0;
function verifier(intitule: string, condition: boolean, detail?: string) {
  console.log(`${condition ? "  ok  " : "ÉCHEC "} ${intitule}${!condition && detail ? ` — ${detail}` : ""}`);
  if (!condition) echecs++;
}


// ---------------------------------------------------------------- 1. Registre
console.log("\n--- 1. Registre et routage ---");

const chemins = DOCUMENTS_LEGAUX.map((d) => d.chemin);
const ids = DOCUMENTS_LEGAUX.map((d) => d.id);
verifier("au moins six documents au registre", DOCUMENTS_LEGAUX.length >= 6, `${DOCUMENTS_LEGAUX.length}`);
verifier("chemins uniques", new Set(chemins).size === chemins.length);
verifier("identifiants uniques", new Set(ids).size === ids.length);

for (const doc of DOCUMENTS_LEGAUX) {
  verifier(`${doc.id} : chemin absolu sans barre finale`, /^\/[a-z0-9-]+$/.test(doc.chemin), doc.chemin);
  verifier(`${doc.id} : version renseignée`, /^\d+\.\d+$/.test(doc.version), doc.version);
  verifier(`${doc.id} : date ISO`, /^\d{4}-\d{2}-\d{2}$/.test(doc.date), doc.date);
  verifier(`${doc.id} : au moins un fondement juridique`, doc.fondement.length > 0);
  verifier(`${doc.id} : au moins trois sections`, doc.sections.length >= 3, `${doc.sections.length}`);
  verifier(
    `${doc.id} : la page existe`,
    existsSync(`app${doc.chemin}/page.tsx`),
    `app${doc.chemin}/page.tsx introuvable`
  );
  // Un document dont le chemin est aussi un identifiant de rubrique rendrait
  // la page catégorie inatteignable : la route statique gagne toujours.
  verifier(
    `${doc.id} : ne masque aucune rubrique d'annonces`,
    !(CATEGORIES as readonly string[]).includes(doc.chemin.slice(1)),
    doc.chemin
  );
}

// -------------------------------------------------------------- 2. Pied de page
console.log("\n--- 2. Pied de page ---");

const piedSource = readFileSync("components/SiteFooter.tsx", "utf8");
verifier("le pied de page lit le registre", piedSource.includes("DOCUMENTS_LEGAUX"));

const barreLegale = piedSource.slice(piedSource.indexOf("foot-legal"));
verifier(
  "plus aucun lien mort dans la barre légale",
  !barreLegale.includes('href="#"'),
  "un `href=\"#\"` subsiste après la barre légale"
);

const dansLePied = DOCUMENTS_LEGAUX.filter((d) => d.piedDePage);
verifier("tous les documents sont au pied de page", dansLePied.length === DOCUMENTS_LEGAUX.length);
verifier(
  "le classement est au pied de page (décret n° 2017-1434)",
  dansLePied.some((d) => d.id === "classement")
);
for (const doc of dansLePied) {
  verifier(`${doc.id} : libellé court défini`, piedSource.includes(`"${doc.id}"`) || piedSource.includes(`${doc.id}:`));
}

// ----------------------------------------------------------------- 3. Balisage
console.log("\n--- 3. Balisage ---");

verifier(
  "gras reconnu",
  JSON.stringify(jetons("un **mot** gras")) ===
    JSON.stringify([
      { type: "texte", valeur: "un " },
      { type: "gras", valeur: "mot" },
      { type: "texte", valeur: " gras" },
    ])
);
verifier(
  "lien interne reconnu",
  JSON.stringify(jetons("voir [les CGU](/cgu).")) ===
    JSON.stringify([
      { type: "texte", valeur: "voir " },
      { type: "lien", valeur: "les CGU", href: "/cgu" },
      { type: "texte", valeur: "." },
    ])
);
verifier(
  "mention à figer reconnue, et elle gagne sur le lien",
  JSON.stringify(jetons("[[à figer : le SIREN]]")) ===
    JSON.stringify([{ type: "afiger", valeur: "le SIREN" }])
);
verifier("texte nu débarrassé des marques", texteNu("**a** [b](/c) [[à figer : d]]") === "a b d");
verifier("texte sans marque rendu tel quel", texteNu("rien à signaler") === "rien à signaler");

for (const doc of DOCUMENTS_LEGAUX) {
  for (const section of doc.sections) {
    for (const bloc of section.blocs) {
      for (const texte of textesDuBloc(bloc)) {
        verifier(
          `${doc.id} : pas de gras non refermé`,
          (texte.match(/\*\*/g) ?? []).length % 2 === 0,
          texte.slice(0, 60)
        );
        verifier(
          `${doc.id} : aucun crochet double résiduel`,
          !texteNu(texte).includes("[["),
          texte.slice(0, 60)
        );
        for (const j of jetons(texte)) {
          if (j.type !== "lien") continue;
          const interne = j.href.startsWith("/");
          verifier(
            `${doc.id} : lien « ${j.valeur} » valide`,
            interne
              ? chemins.includes(j.href) || j.href === "/legal"
              : j.href.startsWith("https://") || j.href.startsWith("mailto:"),
            j.href
          );
        }
      }
    }
  }
}

// ------------------------------------------------------ 4. Clauses obligatoires
console.log("\n--- 4. Clauses obligatoires ---");

/** Chaque entrée est une obligation identifiée dans le cahier des charges, et
 *  la chaîne cherchée est le mot par lequel on la reconnaît dans le texte. */
const CLAUSES: Record<string, [string, string][]> = {
  "mentions-legales": [
    ["directeur de la publication", "LCEN art. 6-III"],
    ["stockage des données", "art. 48 loi SREN — nommer les prestataires de stockage"],
    ["Point de contact pour les autorités", "DSA art. 11"],
    ["Point de contact pour les utilisateurs", "DSA art. 12"],
    ["médiateur de la consommation", "C. conso. art. L. 611-1"],
  ],
  cgu: [
    ["réexamen par un être humain", "DSA art. 14 — décrire la modération"],
    ["accusé de réception", "DSA art. 16"],
    ["moyens automatisés", "DSA art. 17 — mention obligatoire de l'exposé des motifs"],
    ["voies de recours", "DSA art. 17"],
    ["menaçant la vie ou la sécurité", "DSA art. 18"],
    ["avertissement", "sanctions graduées (§7.2)"],
    ["intelligence artificielle", "règlement (UE) 2024/1689, art. 50"],
    ["un humain", "mot-clé d'escalade (§8.6, Résultat n°1)"],
    ["non garanti", "décret n° 78-993 — kilométrage non justifié"],
  ],
  "cgv-pro": [
    ["30 jours", "P2B art. 3 et 4 — préavis"],
    ["30 € HT", "règle de prix de la §5.3"],
    ["Sans engagement", "§5.2, Résultat n°4"],
    ["exécution du présent contrat", "finalité du comptage (§8.8)"],
    ["traitement différencié", "P2B art. 7"],
    ["Accès à vos données", "P2B art. 9"],
  ],
  confidentialite: [
    ["L. 32-3", "table finalité → traitement → paragraphe (action n°253 a)"],
    ["décret n° 2021-1362", "conservation 1 an après clôture"],
    ["archivage intermédiaire", "les trois étages de conservation (§8.3, Résultat n°6)"],
    ["Hors Union européenne", "transfert du modèle d'analyse d'images (§8.3, Résultat n°4)"],
    ["CNIL", "voie de réclamation"],
    ["entièrement automatisé", "RGPD art. 22"],
  ],
  cookies: [
    ["2020-091", "délibération d'exemption"],
    ["tronquée", "condition d'exemption"],
    ["13 mois", "durée du traceur"],
    ["25 mois", "durée des données brutes"],
    ["opposition", "condition d'exemption — mécanisme de refus"],
  ],
  classement: [
    ["Sponsorisé", "décret n° 2017-1434 — étiquetage"],
    ["20 %", "plafond de densité"],
    ["2 emplacements", "règle de regroupement par vendeur"],
    ["30 jours", "préavis P2B"],
    ["zéro résultat", "modalités de référencement (§14.2, R4)"],
  ],
  "droits-et-obligations": [
    ["garantie légale de conformité", "C. conso. art. L. 111-7, 3°"],
    ["rétractation", "idem"],
    ["mois et l'année", "décret n° 78-993"],
    ["242 bis", "CGI — information fiscale"],
    ["pratique commerciale trompeuse", "faux particuliers (§8.1, Résultat n°7)"],
  ],
};

const textes = new Map(DOCUMENTS_LEGAUX.map((d) => [d.id, texteIntegral(d)]));
for (const [id, clauses] of Object.entries(CLAUSES)) {
  const texte = textes.get(id);
  if (!texte) {
    verifier(`${id} : document présent au registre`, false);
    continue;
  }
  for (const [attendu, pourquoi] of clauses) {
    verifier(`${id} : « ${attendu} »`, texte.toLowerCase().includes(attendu.toLowerCase()), pourquoi);
  }
}

// ------------------------------------------------- 5. Interdits de rédaction
console.log("\n--- 5. Interdits de rédaction (§8.8, Résultat n°2) ---");

/** Une unité est « désavouante » si elle dit que nous ne faisons pas ce
 *  qu'elle décrit. Les trois interdits ci-dessous ne cherchent pas à bannir un
 *  mot du document — la politique de confidentialité doit au contraire nommer
 *  ce qu'elle renonce à faire — mais à interdire de le **déclarer comme une
 *  finalité**. */
function desavoue(unite: string): boolean {
  return /ne le faisons pas|ne les? faisons pas|n'est publié|aucun|jamais|sans objet|relèverait|supposerait|anonymes|agrégé/i.test(
    unite
  );
}

for (const doc of DOCUMENTS_LEGAUX) {
  const unites = unitesDeSens(doc);

  // (a) Le détecteur de messages-type est un dispositif de SÉCURITÉ. Le
  //     présenter comme une amélioration du service le ferait basculer du III
  //     (autorisé) au IV (interdit sans consentement annuel).
  const fautifsDetecteur = unites.filter(
    (u) =>
      /messages-type|contenus non sollicités|détecter les messages/i.test(u) &&
      /amélioration du service/i.test(u)
  );
  verifier(
    `${doc.id} : le détecteur d'escroqueries n'est jamais une « amélioration du service »`,
    fautifsDetecteur.length === 0,
    fautifsDetecteur[0]
  );

  // (b) Aucun taux de réponse public. Le §8.8 (Résultat n°4) le range dans le
  //     IV et en fait « le point le plus lourd du document ». Toute unité qui
  //     le mentionne doit donc être une unité de renonciation.
  const fautifsTaux = unites.filter((u) => /taux de réponse/i.test(u) && !desavoue(u));
  verifier(
    `${doc.id} : aucun engagement de publier un taux de réponse`,
    fautifsTaux.length === 0,
    fautifsTaux[0]
  );

  // (c) Aucune finalité statistique déclarée sur des données de
  //     correspondance (action n°248 : λ se calcule sur l'arrêté mensuel).
  const fautifsStat = unites.filter(
    (u) =>
      /statistique/i.test(u) &&
      /correspondant|correspondance|messages|appels|mises en relation|contacts/i.test(u) &&
      !desavoue(u)
  );
  verifier(
    `${doc.id} : aucune finalité statistique sur les correspondances`,
    fautifsStat.length === 0,
    fautifsStat[0]
  );
}

// (d) Le cas particulier du classement : la description de la popularité ne
//     doit pas réintroduire la composante « contacts » retirée le 2026-09-03
//     (§8.9 ; action n°250).
const unitePopularite = unitesDeSens(
  DOCUMENTS_LEGAUX.find((d) => d.id === "classement")!
).find((u) => u.includes("popularité** d'une annonce se calcule") || u.includes("popularité d'une annonce se calcule"));
verifier(
  "classement : la popularité n'est pas décrite comme reposant sur les contacts",
  unitePopularite !== undefined && !/contact/i.test(unitePopularite),
  unitePopularite ?? "unité introuvable — le texte a changé de formulation"
);
verifier(
  "classement : la neutralité des échanges est dite explicitement",
  textes.get("classement")!.includes("ni des messages échangés, ni des appels")
);

// ------------------------------------------------------- 6. Mentions à figer
console.log("\n--- 6. Mentions à figer ---");

let totalCrochets = 0;
for (const doc of DOCUMENTS_LEGAUX) {
  for (const section of doc.sections) {
    for (const bloc of section.blocs) {
      for (const texte of textesDuBloc(bloc)) {
        totalCrochets += (texte.match(/\[\[/g) ?? []).length;
      }
    }
  }
}
verifier(
  "toutes les mentions `[[…]]` sont bien formées",
  totalCrochets === totalMentionsAFiger(),
  `${totalCrochets} ouvertures pour ${totalMentionsAFiger()} mentions analysées`
);

for (const doc of DOCUMENTS_LEGAUX) {
  const restantes = mentionsAFiger(doc);
  console.log(
    `  ${doc.id.padEnd(24)} v${doc.version}  ${String(restantes.length).padStart(2)} à figer` +
      (restantes.length === 0 ? "   ← prêt à publier" : "")
  );
  for (const m of restantes) console.log(`      · ${m}`);
}

console.log(
  `\nTotal : ${totalMentionsAFiger()} mention(s) à arrêter avant l'ouverture du service.` +
    " Ce compte n'est pas un échec de contrôle — c'est le reste-à-faire de Nicolas."
);

console.log(`\n${echecs === 0 ? "Tous les contrôles passent." : `${echecs} contrôle(s) en échec.`}`);
process.exit(echecs === 0 ? 0 : 1);
