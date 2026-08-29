import { marquesDuModele, normaliserRequeteAuto } from "@/lib/normaliseur-auto";
import { MARQUES_AUTRES, MARQUES_COURANTES } from "@/lib/marques";
import { plierAccents } from "@/lib/recherche-texte";

/**
 * Déduction des colonnes `marque` et `modele` d'une annonce véhicule à partir
 * de son **titre** — action §17 n°226, et réparation d'une régression datée.
 *
 * ## Pourquoi ce fichier existe
 *
 * Le 2026-08-28 (§14.8), la recherche par modèle est devenue un **filtre sur la
 * colonne** `annonces.modele` : « clio » ne produit plus une requête plein
 * texte mais `modele=Clio`. Le gain est réel (§14.8 : 80 % des requêtes auto ne
 * laissent plus aucun texte à chercher), mais il a un revers que la §14.8 a
 * elle-même relevé comme « le seul endroit où elle fait moins bien que la
 * §14.7 » : **une annonce dont le titre dit « Clio » mais dont la colonne
 * `modele` est vide n'est plus trouvée**, alors que la recherche plein texte de
 * la veille la trouvait.
 *
 * Et cette colonne est vide bien plus souvent qu'on ne le croit : au dépôt
 * (`components/NouvelleAnnonceForm.tsx`), Marque et Modèle ne portent pas
 * l'astérisque des champs obligatoires et `lib/actions/annonces.ts` les lit
 * avec `optionalString`. Le trou n'est donc pas un stock à rattraper une fois,
 * c'est un **flux** : chaque nouvelle annonce déposée sans ces champs le
 * rouvre. D'où trois usages du même code, et non un script de rattrapage
 * isolé :
 *
 *  1. `scripts/backfill-marque-modele.ts` — le stock existant ;
 *  2. `lib/actions/annonces.ts` (dépôt et modification) — le flux ;
 *  3. `lib/annonce-filters.ts` — le filet d'exécution, qui rend une annonce à
 *     colonne vide trouvable **par son titre** tant que 1 et 2 n'ont pas joué.
 *
 * ## La règle qui gouverne tout le fichier
 *
 * *À la lecture, un filtre trop large ajoute des résultats ; à l'écriture, une
 * valeur fausse est une donnée fausse en base, que plus rien ne signale.* Le
 * normaliseur de la §14.8 est calibré pour la lecture — il élargit
 * volontairement (`modele=Leon,León`, `marque=CITROEN,CITROËN`). Ce fichier
 * fait le travail inverse : il **resserre**, et préfère ne rien écrire à
 * écrire un doute. Trois resserrements, dans cet ordre :
 *
 *  - **désambiguïsation par la marque** — un modèle qui n'appartient pas à la
 *    marque reconnue est écarté (`Mercedes Classe C 220 d` ne doit pas écrire
 *    « Serie 2 », alias BMW du code commercial `220`) ;
 *  - **repliage des orthographes** — `Leon` / `León`, `Serie 3` / `Série 3` ne
 *    sont qu'une valeur ; c'est la même table de pliage que l'indexation plein
 *    texte (§14.7), donc la même définition de « deux écritures du même mot » ;
 *  - **abstention sur ambiguïté réelle** — « Citroën Picasso » désigne quatre
 *    modèles distincts (C4, Grand C4, Xsara, C3 Picasso) : on n'en choisit
 *    aucun, on le journalise.
 */

/** Catalogue de marques réellement proposé au dépôt et au filtre. Une valeur
 *  écrite hors de ce catalogue serait invisible du panneau de filtres — le
 *  filtre `marque` compare `upper(marque)` à des valeurs de ce catalogue. */
const CATALOGUE_MARQUES = new Set<string>([...MARQUES_COURANTES, ...MARQUES_AUTRES]);

export type RaisonDeduction =
  /** Rien de reconnaissable dans le titre. */
  | "aucun"
  /** Reconnu et retenu. */
  | "deduit"
  /** Reconnu, mais plusieurs modèles distincts en lice : on s'abstient. */
  | "ambigu";

export interface DeductionVehicule {
  /** Marque à écrire, ou `null` si aucune certitude. Toujours une valeur du
   *  catalogue `lib/marques.ts` quand elle est non nulle. */
  marque: string | null;
  /** Modèle à écrire, ou `null`. */
  modele: string | null;
  raisonMarque: RaisonDeduction;
  raisonModele: RaisonDeduction;
  /** `true` quand la marque ne vient pas d'un mot du titre mais du modèle
   *  reconnu (« Golf 7 » → VOLKSWAGEN). Certaine par construction — le
   *  normaliseur ne déduit une marque du modèle que lorsqu'un seul constructeur
   *  est candidat — mais tenue à part pour le journal : c'est la déduction qu'on
   *  voudra revoir en premier si un jour une valeur fausse apparaît. */
  marqueDeduiteDuModele: boolean;
  /** Modèles écartés faute de pouvoir trancher (journal de l'ambiguïté). */
  modelesEnLice: string[];
  /** Ce que le normaliseur n'a pas su consommer. C'est **l'indicateur du
   *  référentiel** (§14.3, Résultat n°9 : « le résidu est l'indicateur à
   *  instrumenter ») : sur un titre d'annonce, un résidu qui revient souvent
   *  est un modèle manquant, pas une faute de l'acheteur. */
  residuTokens: string[];
}

/** Vide au sens de la base : `null`, mais aussi la chaîne vide ou blanche, que
 *  le dépôt écrit quand le vendeur ne remplit pas le champ. */
export function champVide(valeur: string | null | undefined): boolean {
  return valeur === null || valeur === undefined || valeur.trim() === "";
}

/** Parmi des orthographes équivalentes (`Serie 3` / `Série 3`), garde celle qui
 *  porte les accents : c'est la valeur qui sera **affichée** sur la page de
 *  détail et dans le panneau de filtres. Le choix est sans effet sur la
 *  recherche, qui compare des valeurs repliées des deux côtés (§14.7). */
function orthographePreferee(valeurs: string[]): string {
  return valeurs.find((v) => /[^\u0020-\u007E]/.test(v)) ?? valeurs[0];
}

/**
 * Déduit `marque` et `modele` du titre d'une annonce véhicule.
 *
 * @param titre       le titre saisi par le vendeur.
 * @param marqueConnue marque déjà renseignée en base, le cas échéant. Elle
 *   n'est pas seulement conservée : elle est **injectée en tête du texte
 *   normalisé**, pour que l'étage 5b du normaliseur s'en serve à désambiguïser
 *   le modèle (« Duster » seul est Dacia *ou* Renault ; avec la marque connue,
 *   il n'y a plus d'hésitation). C'est la seule façon d'obtenir cet effet sans
 *   dupliquer le référentiel : `OptionsNormalisation.marqueConnue` dit *qu'*une
 *   marque est fixée, pas *laquelle*.
 */
/** « Ce texte contient-il ce mot, entier ? » Même bordure que le filet SQL de
 *  `lib/annonce-filters.ts`, pour que les deux répondent identiquement. */
function motPresent(texteReplie: string, valeur: string): boolean {
  const motif = plierAccents(valeur).replace(/[.*+?^${}()|[\]\\-]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])(${motif})([^a-z0-9]|$)`).test(texteReplie);
}

/** Valeur de modèle indistinguable d'un nombre ordinaire ou d'un sigle : elle
 *  n'est écrite que si une marque est nommée dans le texte. */
function valeurTropAmbigue(valeur: string): boolean {
  const replie = plierAccents(valeur);
  return /^[0-9]+$/.test(replie) || replie.length <= 2;
}

export function deduireVehiculeDepuisTitre(
  titre: string | null | undefined,
  marqueConnue?: string | null
): DeductionVehicule {
  const vide: DeductionVehicule = {
    marque: null,
    modele: null,
    raisonMarque: "aucun",
    raisonModele: "aucun",
    marqueDeduiteDuModele: false,
    modelesEnLice: [],
    residuTokens: [],
  };
  if (champVide(titre)) return vide;

  const prefixe = champVide(marqueConnue) ? "" : `${marqueConnue!.trim()} `;
  const texte = `${prefixe}${titre!.trim()}`;
  const titreReplie = plierAccents(texte);
  const normalisation = normaliserRequeteAuto(texte);

  // --- marque nommée dans le texte ---------------------------------------
  const marquesBrutes = (normalisation.derives.marque ?? "").split(",").filter(Boolean);
  let marque: string | null = null;
  if (marquesBrutes.length > 0) {
    // Le normaliseur élargit volontairement (`CITROEN,CITROËN` ;
    // `MERCEDES-BENZ,MERCEDES-AMG,MERCEDES`). Une seule valeur peut être
    // écrite : la première du catalogue, l'ordre des listes d'alias plaçant
    // toujours la forme préférée en tête.
    marque = marquesBrutes.find((v) => CATALOGUE_MARQUES.has(v)) ?? null;
  }

  // --- modèle ------------------------------------------------------------
  const modelesBruts = (normalisation.derives.modele ?? "").split(",").filter(Boolean);

  // Resserrement n°1 — **le modèle doit appartenir à la marque établie**, sans
  // repli. C'est le resserrement le plus coûteux du fichier et celui qui a été
  // ajouté en dernier, après avoir sondé 60 titres à la main : « Honda CB 500 F
  // 2020 » écrivait `modele = 500` (le 500 est une Fiat) et « BMW R 1200 GS
  // Adventure » écrivait `modele = GS` (la GS est une Citroën). Aucun des deux
  // n'était visible dans un jeu de cas construit à partir de titres de
  // voitures : la rubrique `vehicules` contient aussi des motos, des
  // utilitaires, des remorques et des pièces détachées, et le référentiel de la
  // §14.3 est un référentiel **automobile**.
  //
  // Le repli qui existait ici (« si le sous-ensemble est vide, garder tout »,
  // pour couvrir les sous-marques comme MERCEDES AMG dont les modèles sont
  // indexés sous MERCEDES-BENZ) a donc été retiré : il rendait le resserrement
  // inopérant dans exactement les cas où il servait. Coût assumé : sur une
  // annonce « Mercedes AMG Classe A 45 », le modèle n'est plus écrit. Abstenir
  // est le bon côté de l'erreur.
  let candidats = modelesBruts;
  if (marque !== null) {
    candidats = modelesBruts.filter((v) => marquesDuModele(v).includes(marque!));
  }

  // Resserrement n°1 bis — **le modèle doit se lire dans le titre**. Le
  // référentiel reconnaît aussi des *codes commerciaux* (`320` → Série 3,
  // `530` → Série 5) : très utiles pour chercher, désastreux pour écrire, parce
  // que le nombre qui les déclenche est rarement un code commercial dans un
  // titre. Mesuré : « Yamaha Tmax 530 DX » écrivait `marque = BMW,
  // modele = Série 5`. Exiger que la valeur écrite apparaisse **en toutes
  // lettres** dans le titre élimine toute la famille d'un coup, sans liste
  // d'exceptions à tenir.
  //
  // La bordure est la même que celle du filet SQL de `lib/annonce-filters.ts`
  // (`[^a-z0-9]`), et volontairement : les deux répondent à la même question —
  // « ce titre nomme-t-il ce modèle ? » — et doivent y répondre pareil.
  candidats = candidats.filter((v) => motPresent(titreReplie, v));

  // Resserrement n°1 ter — **une valeur courte ou purement numérique exige une
  // marque nommée dans le texte**. `A2` est un modèle Audi et une catégorie de
  // permis moto ; `500` est une Fiat, un poids de remorque et une cylindrée ;
  // `205` est une Peugeot et une largeur de pneu. Mesuré sur les mêmes 60
  // titres : « Yamaha MT-07 2019 A2 » → Audi A2, « Remorque bagagère 500 kg »
  // → Fiat 500, « Pneus hiver 205/55 R16 » → Peugeot 205. Avec une marque
  // nommée, l'ambiguïté tombe (« Peugeot 208 » est une 208).
  //
  // Ce que cela coûte, et c'est réel : « a saisir 208 essence faible
  // kilometrage » n'écrit plus rien. Le filet de `lib/annonce-filters.ts`
  // continue de trouver cette annonce par son titre — c'est précisément à cela
  // qu'il sert, et c'est ce qui autorise ce fichier à être aussi prudent.
  const marqueNommee = marquesBrutes.length > 0;
  if (!marqueNommee) {
    candidats = candidats.filter((v) => !valeurTropAmbigue(v));
  }

  // Resserrement n°2 : regrouper les orthographes d'une même valeur.
  const groupes = new Map<string, string[]>();
  for (const v of candidats) {
    const cle = plierAccents(v);
    groupes.set(cle, [...(groupes.get(cle) ?? []), v]);
  }
  // Resserrement n°3 : au-delà d'un groupe, on s'abstient.
  const modele = groupes.size === 1 ? orthographePreferee([...groupes.values()][0]) : null;

  // --- marque déduite du modèle ------------------------------------------
  // Calculée **après** le modèle, et c'est tout l'objet de la correction du
  // 2026-08-29. Le normaliseur signale une marque déduite dès qu'un seul
  // constructeur est candidat pour le mot qu'il a reconnu — y compris pour un
  // mot que les resserrements ci-dessus viennent de rejeter. Résultat mesuré
  // sur les 60 titres sondés : « Yamaha Tmax 530 DX » écrivait `marque = BMW`,
  // « Remorque bagagère 500 kg » `marque = FIAT`, « Pneus hiver 205/55 R16 »
  // `marque = PEUGEOT`, « Yamaha MT-07 2019 A2 » `marque = AUDI`. Le modèle
  // était bien rejeté ; la marque qui en découlait, elle, passait.
  //
  // La règle est donc : **une marque déduite d'un modèle n'est écrite que si ce
  // modèle est lui-même écrit**, et qu'il n'appartient qu'à cette marque. La
  // déduction ne survit jamais à ce dont elle est déduite.
  let marqueDeduiteDuModele = false;
  const deduiteDuModele = normalisation.reconnus.find((r) => r.champ === "marqueDeduite");
  if (
    marque === null &&
    modele !== null &&
    deduiteDuModele !== undefined &&
    CATALOGUE_MARQUES.has(deduiteDuModele.valeur) &&
    marquesDuModele(modele).length === 1 &&
    marquesDuModele(modele)[0] === deduiteDuModele.valeur
  ) {
    marque = deduiteDuModele.valeur;
    marqueDeduiteDuModele = true;
  }

  return {
    marque,
    modele,
    raisonMarque: marque !== null ? "deduit" : "aucun",
    raisonModele:
      modele !== null ? "deduit" : groupes.size > 1 ? "ambigu" : "aucun",
    marqueDeduiteDuModele,
    modelesEnLice: groupes.size > 1 ? candidats : [],
    residuTokens: normalisation.journal.residuTokens,
  };
}

/**
 * Complète les seuls champs vides d'une annonce véhicule. Ne remplace **jamais**
 * une valeur saisie par le vendeur : la déduction est un filet, pas une
 * correction. Rend les valeurs à écrire et la liste de ce qui a été déduit —
 * l'appelant décide s'il la journalise.
 */
export function completerVehicule(
  titre: string | null | undefined,
  marque: string | null | undefined,
  modele: string | null | undefined
): { marque: string | undefined; modele: string | undefined; champsDeduits: string[] } {
  const marqueSaisie = champVide(marque) ? undefined : marque!.trim();
  const modeleSaisi = champVide(modele) ? undefined : modele!.trim();
  if (marqueSaisie !== undefined && modeleSaisi !== undefined) {
    return { marque: marqueSaisie, modele: modeleSaisi, champsDeduits: [] };
  }
  const deduction = deduireVehiculeDepuisTitre(titre, marqueSaisie);
  const champsDeduits: string[] = [];
  let marqueFinale = marqueSaisie;
  let modeleFinal = modeleSaisi;
  if (marqueFinale === undefined && deduction.marque !== null) {
    marqueFinale = deduction.marque;
    champsDeduits.push("marque");
  }
  if (modeleFinal === undefined && deduction.modele !== null) {
    modeleFinal = deduction.modele;
    champsDeduits.push("modele");
  }
  return { marque: marqueFinale, modele: modeleFinal, champsDeduits };
}
