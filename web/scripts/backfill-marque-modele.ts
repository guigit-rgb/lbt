/**
 * Rattrapage des colonnes `marque` / `modele` des annonces véhicules — action
 * §17 n°226, spécifié en §14.9.
 *
 *   # ce que le script ferait, sans rien écrire (défaut)
 *   ./node_modules/.bin/tsx scripts/backfill-marque-modele.ts
 *   # écriture réelle
 *   ./node_modules/.bin/tsx scripts/backfill-marque-modele.ts --ecrire
 *
 * Il lit `.env.local` comme les autres scripts du dossier (`verify-m3.ts`,
 * `create-invite.ts`) et n'a besoin que de `DATABASE_URL`.
 *
 * ## Le rattrapage n'est pas le livrable principal — le journal l'est
 *
 * Écrire les colonnes manquantes répare le stock, et c'est utile : depuis le
 * 2026-08-28 (§14.8), « clio » est un filtre sur la colonne, donc une annonce à
 * colonne vide est introuvable. Mais ce que ce script produit et que rien
 * d'autre ne produit, c'est **la liste des titres que le référentiel ne sait pas
 * lire** — la §14.3 (Résultat n°9) le dit sans détour : « le résidu est
 * l'indicateur à instrumenter ». Sur une requête d'acheteur, un résidu peut être
 * une faute de frappe ; sur un titre d'annonce écrit par un vendeur qui décrit
 * sa propre voiture, un résidu fréquent est presque toujours **un modèle
 * manquant au référentiel**. Trois sorties, donc, et la dernière compte autant
 * que la première :
 *
 *   1. combien d'annonces ont été complétées, et par quoi ;
 *   2. les titres **ambigus** (plusieurs modèles en lice : « Citroën Picasso »
 *      en désigne quatre) — ceux-là ne sont jamais écrits, ils sont listés ;
 *   3. les **résidus par fréquence**, à relire à la main : ce qui revient est
 *      soit un modèle à ajouter au référentiel, soit une finition à ignorer
 *      (le champ `version` de la §14.2, qui n'existe pas encore).
 *
 * ## Deux garde-fous
 *
 *  - **Rien n'est écrasé.** Seules les colonnes vides sont remplies ; la saisie
 *    d'un vendeur fait toujours foi, même si elle contredit son propre titre.
 *  - **Rejouable.** Une seconde exécution ne trouve plus que ce que la première
 *    n'a pas su lire, donc ne réécrit rien. Le script est sans effet cumulatif.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function loadEnvLocal() {
  const path = join(__dirname, "..", ".env.local");
  const content = readFileSync(path, "utf-8");
  for (const line of content.split("\n")) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (match) {
      const [, key, rawValue] = match;
      const value = rawValue.replace(/^(['"])(.*)\1$/, "$2");
      if (!(key in process.env)) process.env[key] = value;
    }
  }
}

interface Ligne {
  id: string;
  titre: string;
  marque: string | null;
  modele: string | null;
}

async function main() {
  const ecrire = process.argv.includes("--ecrire");
  loadEnvLocal();

  const { neon } = await import("@neondatabase/serverless");
  const { deduireVehiculeDepuisTitre, champVide } = await import("../lib/deduction-vehicule");
  const sql = neon(process.env.DATABASE_URL!);

  // `btrim(...) = ''` autant que `is null` : le dépôt écrit une chaîne vide
  // quand le vendeur ne remplit pas le champ, et une chaîne vide échoue au
  // filtre exactement comme un `null` — sans en avoir l'air dans un `select`.
  const lignes = (await sql`
    select id, titre, marque, modele
    from annonces
    where categorie = 'vehicules'
      and (marque is null or btrim(marque) = '' or modele is null or btrim(modele) = '')
    order by created_at
  `) as unknown as Ligne[];

  console.log(`${lignes.length} annonce(s) véhicules avec marque ou modèle manquant.\n`);

  let completees = 0;
  let marquesEcrites = 0;
  let modelesEcrits = 0;
  const ambigus: { id: string; titre: string; enLice: string[] }[] = [];
  const muets: { id: string; titre: string }[] = [];
  const residus = new Map<string, number>();

  for (const ligne of lignes) {
    const marqueExistante = champVide(ligne.marque) ? null : ligne.marque;
    const d = deduireVehiculeDepuisTitre(ligne.titre, marqueExistante);

    for (const token of d.residuTokens) {
      residus.set(token, (residus.get(token) ?? 0) + 1);
    }
    if (d.raisonModele === "ambigu") {
      ambigus.push({ id: ligne.id, titre: ligne.titre, enLice: d.modelesEnLice });
    }

    const marqueAEcrire = champVide(ligne.marque) && d.marque !== null ? d.marque : null;
    const modeleAEcrire = champVide(ligne.modele) && d.modele !== null ? d.modele : null;
    if (marqueAEcrire === null && modeleAEcrire === null) {
      muets.push({ id: ligne.id, titre: ligne.titre });
      continue;
    }

    completees++;
    if (marqueAEcrire !== null) marquesEcrites++;
    if (modeleAEcrire !== null) modelesEcrits++;
    const drapeau = d.marqueDeduiteDuModele ? " (marque déduite du modèle)" : "";
    console.log(
      `  ${ecrire ? "→" : "·"} ${ligne.titre}\n      marque=${marqueAEcrire ?? "(inchangée)"} modele=${
        modeleAEcrire ?? "(inchangé)"
      }${drapeau}`
    );

    if (ecrire) {
      // Le choix « la valeur existante d'abord » est fait **par le SQL**, pas
      // par le script : si un vendeur a rempli la colonne entre le `select` et
      // cet `update`, c'est sa saisie qui gagne. Un rattrapage ne doit jamais
      // gagner contre un humain, fût-ce par une course de quelques secondes.
      // Effet de bord assumé sur les lignes touchées : une valeur réduite à des
      // espaces devient `null`, ce qu'elle aurait toujours dû être.
      await sql`
        update annonces
        set marque = coalesce(nullif(btrim(coalesce(marque, '')), ''), ${marqueAEcrire}::text),
            modele = coalesce(nullif(btrim(coalesce(modele, '')), ''), ${modeleAEcrire}::text)
        where id = ${ligne.id}
      `;
    }
  }

  const residusTries = [...residus.entries()].sort((a, b) => b[1] - a[1]);
  const rapport = {
    date: new Date().toISOString(),
    ecriture: ecrire,
    annoncesExaminees: lignes.length,
    annoncesCompletees: completees,
    marquesEcrites,
    modelesEcrits,
    ambigus,
    muets,
    residusParFrequence: residusTries.map(([token, n]) => ({ token, n })),
  };
  const chemin = join(__dirname, "..", "backfill-marque-modele.json");
  writeFileSync(chemin, JSON.stringify(rapport, null, 2), "utf-8");

  console.log(`\n--- Bilan ---`);
  console.log(`Annonces examinées      : ${lignes.length}`);
  console.log(`Annonces complétées     : ${completees} (${marquesEcrites} marques, ${modelesEcrits} modèles)`);
  console.log(`Titres ambigus          : ${ambigus.length} (jamais écrits, cf. rapport)`);
  console.log(`Titres muets            : ${muets.length}`);
  console.log(`\nRésidus les plus fréquents (candidats à l'ajout au référentiel §14.3) :`);
  for (const [token, n] of residusTries.slice(0, 30)) console.log(`  ${String(n).padStart(4)}  ${token}`);
  console.log(`\nRapport complet écrit dans ${chemin}`);
  if (!ecrire) console.log(`\nAucune écriture — relancer avec --ecrire pour appliquer.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
