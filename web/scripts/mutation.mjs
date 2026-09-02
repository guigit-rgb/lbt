/**
 * Harnais de mutation des cinq contrôles hors base — cahier des charges
 * §14.12, action §17 n°217. `npm run mutation`.
 *
 * ## Pourquoi ce fichier, et pourquoi il n'est PAS dans la CI
 *
 * Un contrôle qu'on n'a jamais vu rougir n'est pas un contrôle : c'est une
 * ligne de sortie rassurante. Les cinq `verif-*.ts` du dépôt affichaient
 * « Tous les contrôles passent » depuis leur écriture, sans qu'aucune session
 * n'ait jamais vérifié qu'ils étaient capables de dire l'inverse — et la §14.10
 * (Résultat n°6) avait déjà attrapé un contrôle qui passait au vert sur une
 * sortie parfaitement échappée, donc le risque est constaté, pas théorique.
 *
 * Ce script injecte une à une des fautes réelles dans `lib/`, relance le
 * contrôle censé les voir, et **restaure le fichier**. Un mutant qui survit est
 * soit un trou du contrôle, soit un mutant *équivalent* (le code muté fait la
 * même chose : la garde retirée était inatteignable). Les deux se distinguent à
 * la main, et le champ `equivalentAttendu` porte la conclusion déjà établie.
 *
 * Hors CI pour deux raisons : il écrit dans l'arbre de travail (donc il refuse
 * de tourner sur un arbre sale, voir plus bas), et il n'a de sens qu'à la
 * lecture d'un humain — un mutant qui survit n'est pas forcément une erreur.
 * Il se relance à chaque fois qu'un `verif-*.ts` change de forme.
 *
 * ## Résultat du 2026-09-02 (premier passage)
 *
 * 11 mutants injectés, 10 tués, 1 survivant — et le survivant est équivalent :
 * dans `decouperPrefixe`, les gardes « négation » et « expression exacte » sont
 * inatteignables, la règle « token purement alphanumérique » qui les suit
 * refusant déjà `-diesel` et `"essence"`. Score sur les mutants non
 * équivalents : 10/10.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

/** Un mutant = un remplacement exact de texte, et le contrôle censé le tuer. */
const MUTANTS = [
  {
    id: "M1",
    intitule: "pliage d'accents désactivé (« Citroën » ne trouve plus « citroen »)",
    fichier: "lib/recherche-texte.ts",
    avant: "sortie += position === -1 ? caractere : PLIAGE_CIBLE[position];",
    apres: "sortie += caractere;",
    controles: ["verif:recherche-sql"],
  },
  {
    id: "M2",
    intitule: "garde « jamais une négation » retirée de decouperPrefixe",
    fichier: "lib/recherche-texte.ts",
    avant: '  if (dernier.startsWith("-")) return refuser;',
    apres: "  // muté",
    controles: ["verif:recherche-prefixe", "verif:recherche-sql"],
    // Établi le 2026-09-02 : `-diesel` n'est pas `^[\p{L}\p{N}]+$`, donc la
    // règle 2 le refuse déjà. La garde est du code mort défensif ; sa
    // suppression ne change aucun comportement observable.
    equivalentAttendu: true,
  },
  {
    id: "M3",
    intitule: "List-Unsubscribe retiré des e-mails d'alerte (RFC 8058, §6.4 R6)",
    fichier: "lib/email/gabarit.ts",
    avant: 'entetes["List-Unsubscribe"]',
    apres: 'entetes["X-Mute"]',
    controles: ["verif:email"],
  },
  {
    id: "M4",
    intitule: "garde des opérateurs (« clio ou ») retirée de decouperPrefixe",
    fichier: "lib/recherche-texte.ts",
    avant: "  if (OPERATEURS_TEXTE.has(dernier)) return refuser;",
    apres: "  // muté",
    controles: ["verif:recherche-prefixe"],
  },
  {
    id: "M5",
    intitule: "LONGUEUR_MIN_PREFIXE 2 → 1 (« a:* » balaye l'index)",
    fichier: "lib/recherche-texte.ts",
    avant: "const LONGUEUR_MIN_PREFIXE = 2;",
    apres: "const LONGUEUR_MIN_PREFIXE = 1;",
    controles: ["verif:recherche-prefixe"],
  },
  {
    id: "M6",
    intitule: "resserrement « le modèle doit se lire dans le titre » retiré (§14.9)",
    fichier: "lib/deduction-vehicule.ts",
    avant: "  candidats = candidats.filter((v) => motPresent(titreReplie, v));",
    apres: "  // muté",
    controles: ["verif:deduction-vehicule"],
  },
  {
    id: "M7",
    intitule: "garde des valeurs ambiguës (500, 205, A2) retirée (§14.9)",
    fichier: "lib/deduction-vehicule.ts",
    avant: "    candidats = candidats.filter((v) => !valeurTropAmbigue(v));",
    apres: "    // muté",
    controles: ["verif:deduction-vehicule"],
  },
  {
    id: "M8",
    intitule: "abstention « plus d'un groupe d'orthographes » retirée (§14.9)",
    fichier: "lib/deduction-vehicule.ts",
    avant: "groupes.size === 1 ? orthographePreferee",
    apres: "groupes.size >= 1 ? orthographePreferee",
    controles: ["verif:deduction-vehicule"],
  },
  {
    id: "M9",
    intitule: "préfixe « dep./dans le/du » retiré du motif département (bug « dci 90 »)",
    fichier: "lib/normaliseur-auto.ts",
    avant:
      "/\\b(?:dep\\.?|dept\\.?|departement|dans le|du)\\s*(0[1-9]|[1-8][0-9]|9[0-5]|2[ab]|97[1-6])\\b/g,",
    apres: "/\\b(0[1-9]|[1-8][0-9]|9[0-5]|2[ab]|97[1-6])\\b/g,",
    controles: ["verif:normaliseur-auto"],
  },
  {
    id: "M10",
    intitule: "échappement du « < » retiré des e-mails (injection de balise)",
    fichier: "lib/email/gabarit.ts",
    avant: '    .replace(/</g, "&lt;")\n',
    apres: "",
    controles: ["verif:email"],
  },
  {
    id: "M11",
    intitule:
      "expression de recherche désalignée de l'index (le défaut « invisible » de la §14.7)",
    fichier: "lib/recherche-texte.ts",
    avant: "`to_tsvector('${CONFIG}', translate(lower(` +",
    apres: "`to_tsvector('${CONFIG}', translate(lower(trim(` +",
    controles: ["verif:recherche-sql"],
  },
];

// Refus sur arbre sale : ce script écrit dans `lib/` et restaure depuis une
// copie en mémoire. Si le processus est tué entre les deux, la seule façon de
// retrouver l'état d'origine est `git checkout` — donc il ne doit y avoir
// aucune modification non validée à perdre.
const sale = execFileSync("git", ["status", "--porcelain", "--", "lib"], {
  encoding: "utf8",
}).trim();
if (sale) {
  console.error(
    "Arbre de travail sale sous lib/ — ce script modifie puis restaure des fichiers.\n" +
      "Validez ou remisez d'abord :\n" +
      sale,
  );
  process.exit(2);
}

function lancer(script) {
  try {
    execFileSync("npm", ["run", "--silent", script], { stdio: "pipe" });
    return { rouge: false };
  } catch (erreur) {
    const sortie = `${erreur.stdout ?? ""}${erreur.stderr ?? ""}`;
    const echecs = (sortie.match(/ÉCHEC/g) ?? []).length;
    return { rouge: true, echecs };
  }
}

let tues = 0;
const survivants = [];

for (const mutant of MUTANTS) {
  const origine = readFileSync(mutant.fichier, "utf8");
  if (!origine.includes(mutant.avant)) {
    console.error(
      `${mutant.id} : motif introuvable dans ${mutant.fichier} — le code a bougé, ` +
        "le mutant doit être réécrit (c'est le coût normal de ce harnais).",
    );
    process.exitCode = 1;
    continue;
  }
  writeFileSync(mutant.fichier, origine.replace(mutant.avant, mutant.apres));
  let verdict;
  try {
    const resultats = mutant.controles.map((c) => [c, lancer(c)]);
    const tueurs = resultats.filter(([, r]) => r.rouge);
    verdict = { tueurs, resultats };
  } finally {
    writeFileSync(mutant.fichier, origine);
  }

  const { tueurs, resultats } = verdict;
  const detail = resultats
    .map(([c, r]) => (r.rouge ? `${c}=rouge(${r.echecs})` : `${c}=vert`))
    .join(" ");
  if (tueurs.length > 0) {
    tues++;
    console.log(`  tué        ${mutant.id}  ${mutant.intitule}\n             ${detail}`);
  } else {
    survivants.push(mutant);
    const etiquette = mutant.equivalentAttendu ? "survit (éq.)" : "SURVIT";
    console.log(`  ${etiquette}  ${mutant.id}  ${mutant.intitule}\n             ${detail}`);
  }
}

const inattendus = survivants.filter((m) => !m.equivalentAttendu);
console.log(
  `\n${tues}/${MUTANTS.length} mutants tués. ` +
    `Survivants : ${survivants.length} dont ${survivants.length - inattendus.length} ` +
    "connu(s) comme équivalent(s).",
);
if (inattendus.length > 0) {
  console.log(
    "\nUn mutant qui survit sans être marqué équivalent est un trou de contrôle " +
      "OU un mutant équivalent qu'il reste à démontrer. Les deux se tranchent à la main :\n" +
      inattendus.map((m) => `  - ${m.id} : ${m.intitule}`).join("\n"),
  );
}
process.exit(inattendus.length === 0 ? 0 : 1);
