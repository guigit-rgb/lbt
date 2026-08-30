import { plierAccents } from "./recherche-texte";
import { MARQUES_CATALOGUE } from "./marques";
import { listerModelesIndexes } from "./normaliseur-auto";
import { MEGA_MENU, AUTRES_ENTRY, DONS_ENTRY } from "./categories";
import { hrefRubriqueMegaMenu, hrefLienMegaMenu } from "./mega-menu-href";

/**
 * Barre de suggestions à la frappe — §14.10 du cahier des charges (action §17
 * n°222, second volet).
 *
 * La question que l'action laissait ouverte : d'où viennent les suggestions ?
 * Deux pistes y étaient nommées, `pg_trgm` sur les titres d'annonces contre une
 * `tsquery` préfixée. **Aucune des deux n'est retenue, et c'est le résultat le
 * plus utile de la session :** les deux répondent à la question « quelles
 * *annonces* ressemblent à ce que je tape », alors qu'une barre de suggestions a
 * besoin de « quels *termes* est-il utile de proposer ». Un index sur les titres
 * ne donne pas de termes — il faut agréger, dédupliquer, et le résultat d'une
 * agrégation de titres saisis par des vendeurs est un vocabulaire sale
 * (« URGENT !! », « prix a debattre », le même modèle en six orthographes) qu'il
 * faudrait nettoyer avec… un référentiel.
 *
 * Or LBT possède déjà ce référentiel, et il est meilleur que n'importe quelle
 * agrégation de titres, pour une raison qui n'a rien à voir avec sa propreté :
 *
 *   **une suggestion n'est admissible que si un clic dessus produit un
 *   filtre.** Proposer « clio » pour renvoyer vers `?q=clio` ne fait que
 *   déplacer d'un cran le problème que la §14.8 a passé une session à résoudre
 *   (« 82 % des requêtes auto devraient être des filtres »). Proposer « Clio »
 *   pour renvoyer vers `/vehicules?marque=RENAULT&modele=Clio` transforme une
 *   frappe approximative en requête exacte — c'est-à-dire exactement le travail
 *   du normaliseur, obtenu ici en un clic et sans deviner.
 *
 * Les trois sources sont donc celles dont LBT sait déjà fabriquer une URL
 * filtrée : le catalogue de marques (`lib/marques.ts`, 201 entrées fournies par
 * Nicolas), le référentiel de modèles du normaliseur (`lib/normaliseur-auto.ts`)
 * et la taxonomie du méga-menu (`lib/categories.ts` + `lib/mega-menu-href.ts`),
 * qui couvre les rubriques et sous-catégories de **tout** le catalogue et pas
 * seulement l'automobile — la §14.8 s'était volontairement limitée à
 * `vehicules`, cette barre n'a pas à l'être.
 *
 * Conséquences pratiques, toutes voulues :
 *
 *  - **aucun accès à la base**, donc aucun index à créer, aucune latence de
 *    requête, et une route publique qu'un robot peut marteler sans coût (le
 *    seul risque d'abus d'une barre de suggestions est le volume, et il est ici
 *    servi depuis la mémoire du processus) ;
 *  - **aucun compteur de résultats** à côté de chaque suggestion — leboncoin en
 *    affiche un, il faudrait une requête par suggestion. Reporté (action n°236) ;
 *  - une suggestion peut ne renvoyer **aucune** annonce (le référentiel décrit
 *    le marché, pas le stock de LBT). Au volume du pilote c'est fréquent, et
 *    c'est le principal défaut assumé de ce choix — voir §14.10, « Limites ».
 */

export type TypeSuggestion = "rubrique" | "sous-categorie" | "marque" | "modele" | "texte";

export interface Suggestion {
  /** Libellé affiché, dans l'orthographe du référentiel (accents compris). */
  label: string;
  /** Contexte affiché en gris à droite (« dans Véhicules », « Renault »). */
  contexte?: string;
  href: string;
  type: TypeSuggestion;
}

interface EntreeIndex extends Suggestion {
  /** Libellé plié (minuscules, accents retirés) — la clé de comparaison. */
  cle: string;
  /** Rang de départage entre deux entrées d'égale qualité de correspondance.
   *  Plus petit = proposé d'abord. */
  poids: number;
}

/** Poids par type. Une rubrique est une destination sûre (elle a des annonces
 *  par construction), un modèle est la suggestion la plus précise mais peut
 *  être vide au volume du pilote — d'où cet ordre, qui n'est pas alphabétique
 *  et n'est pas neutre : il décide de ce que voit un visiteur qui a tapé deux
 *  lettres. */
const POIDS: Record<TypeSuggestion, number> = {
  rubrique: 0,
  "sous-categorie": 1,
  modele: 2,
  marque: 3,
  texte: 9,
};

/** Suggestions dont le libellé est trop court pour être proposé à la frappe :
 *  « DS », « MG », « Up », « Ka », « ML », « TT », « C1 »… Elles polluent la
 *  liste dès la première lettre tapée alors qu'un visiteur qui les cherche les
 *  tape en entier. Seuil bas (2), parce que « i3 », « X5 », « A3 » sont des
 *  suggestions légitimes une fois les deux caractères tapés — c'est le nombre
 *  de caractères SAISIS qui filtre, pas la longueur de la suggestion. */
const LONGUEUR_MIN_SAISIE = 2;

/** Nombre de suggestions rendues. La §14.2 (Résultat n°2) portait
 *  `max_candidates` de 4 à 10 pour Typesense ; 10 est repris ici, dont une
 *  ligne réservée au repli « chercher dans toutes les annonces ». */
export const MAX_SUGGESTIONS = 10;

let index: EntreeIndex[] | null = null;

function ajouter(cible: EntreeIndex[], vues: Set<string>, entree: Omit<EntreeIndex, "cle" | "poids">) {
  const cle = plierAccents(entree.label).trim();
  if (!cle) return;
  // **Le critère d'admission, appliqué à la lettre.** Une sous-catégorie dont
  // l'URL calculée est la page de rubrique nue (`/vehicules`, sans le moindre
  // paramètre) n'est pas une destination filtrée : `lib/mega-menu-href.ts`
  // refuse délibérément d'inventer un filtre là où aucun n'existe au schéma —
  // « Vélos », « Caravaning », « Camions », « Nautisme » dans Véhicules, ou
  // « Locations » dans Immobilier. Proposer « Vélos » pour ouvrir la totalité
  // de la rubrique Véhicules est trompeur, et c'est précisément ce que le
  // premier essai faisait (mesuré sur la route en service : `q=velo` rendait
  // « Vélos → /vehicules » et « Vélos → /loisirs »). On les écarte ; les
  // enfants réellement filtrés du même arbre (« Vélo enfant », « Vélo de
  // route », « Vélo électrique ») subsistent et font mieux le travail.
  if (entree.type === "sous-categorie" && !entree.href.includes("?")) return;
  // Déduplication sur (libellé plié, URL **repliée en minuscules**) et non sur
  // le seul libellé. Trois cas, tous mesurés :
  //  - « BMW » est une marque de voiture ET une marque de moto dans le
  //    méga-menu, avec la même URL → une seule entrée ;
  //  - « Leon » est un modèle Seat et un modèle Cupra, avec deux URL → deux
  //    entrées légitimes, que le contexte affiché distingue ;
  //  - le pli en minuscules règle un doublon visible qui, sinon, apparaissait
  //    dès la première frappe : le méga-menu écrit `?marque=Audi` et le
  //    catalogue `?marque=AUDI`, donc « audi » proposait deux fois la même
  //    destination sous deux orthographes (« Audi » et « AUDI »). Le filtre
  //    `marque` comparant en majuscules, les deux URL désignent la même
  //    requête. Le méga-menu étant indexé en premier, c'est sa casse — celle
  //    qu'un humain a écrite — qui survit.
  const empreinte = `${cle} ${entree.href.toLowerCase()}`;
  if (vues.has(empreinte)) return;
  vues.add(empreinte);
  cible.push({ ...entree, cle, poids: POIDS[entree.type] });
}

/**
 * Index des suggestions, construit une fois par processus. Coût mesuré à la
 * construction : quelques milliers d'entrées, aucune E/S.
 */
function construireIndex(): EntreeIndex[] {
  const entrees: EntreeIndex[] = [];
  const vues = new Set<string>();

  // 1. Rubriques et sous-catégories — toute la taxonomie, pas seulement l'auto.
  for (const entree of MEGA_MENU) {
    ajouter(entrees, vues, {
      label: entree.label,
      href: `/${entree.categorie}`,
      type: "rubrique",
    });
    for (const colonne of entree.columns) {
      for (const groupe of colonne) {
        if (groupe.heading) {
          ajouter(entrees, vues, {
            label: groupe.heading,
            contexte: entree.label,
            href: hrefRubriqueMegaMenu(entree.categorie, groupe.heading),
            type: "sous-categorie",
          });
        }
        for (const lien of groupe.links) {
          ajouter(entrees, vues, {
            label: lien.label,
            contexte: groupe.heading ?? entree.label,
            href: lien.href ?? hrefLienMegaMenu(entree.categorie, groupe.heading, lien.label),
            type: "sous-categorie",
          });
        }
      }
    }
  }
  for (const entree of [AUTRES_ENTRY, DONS_ENTRY]) {
    ajouter(entrees, vues, { label: entree.label, href: `/${entree.categorie}`, type: "rubrique" });
  }

  // 2. Marques automobiles — le catalogue du dépôt et du filtre, donc une URL
  //    qui rend forcément le bon jeu d'annonces.
  for (const marque of MARQUES_CATALOGUE) {
    if (marque === "Autre") continue;
    ajouter(entrees, vues, {
      label: marque,
      contexte: "Véhicules",
      href: `/vehicules?marque=${encodeURIComponent(marque)}`,
      type: "marque",
    });
  }

  // 3. Modèles — la suggestion la plus précise, et la seule qui produise deux
  //    filtres d'un coup. `marque` ET `modele` sont émis : sans la marque,
  //    « Duster » ramènerait les Dacia et les Renault mélangées, ce qui est le
  //    comportement de la recherche mais pas ce qu'on propose en cliquant sur
  //    une ligne qui affiche « Duster — Dacia ».
  for (const { marque, valeur } of listerModelesIndexes()) {
    ajouter(entrees, vues, {
      label: valeur,
      contexte: marque,
      href: `/vehicules?marque=${encodeURIComponent(marque)}&modele=${encodeURIComponent(valeur)}`,
      type: "modele",
    });
  }

  return entrees;
}

/** Qualité de la correspondance, du meilleur au pire. `null` = pas de
 *  correspondance. Le mot-clé est cherché **au début d'un mot** du libellé et
 *  jamais en plein milieu : « ass » ne doit pas proposer « Classe C » (le
 *  visiteur tape le début de ce qu'il cherche, pas son milieu — et une
 *  correspondance interne remplit la liste de faux amis dès deux lettres). */
function qualite(cle: string, saisie: string): number | null {
  if (cle === saisie) return 0;
  if (cle.startsWith(saisie)) return 1;
  // Début d'un mot suivant : « rover » → « Range Rover », « picasso » →
  // « C4 Picasso ». Séparateurs traités comme des espaces (`C4 Space-Tourer`).
  for (const mot of cle.split(/[\s\-.]+/).slice(1)) {
    if (mot.startsWith(saisie)) return 2;
  }
  return null;
}

/**
 * Suggestions pour une saisie partielle. Fonction pure : ni base, ni réseau.
 * La dernière ligne est toujours un repli explicite vers la recherche plein
 * texte — sans elle, un visiteur qui tape « playmobil 3000 complet » verrait
 * une liste vide et croirait le site vide, alors que la §14.7 sait très bien
 * répondre à cette requête.
 */
export function suggerer(saisieBrute: string, max = MAX_SUGGESTIONS): Suggestion[] {
  const saisie = plierAccents(saisieBrute).trim().replace(/\s+/g, " ");
  if (saisie.length < LONGUEUR_MIN_SAISIE) return [];
  if (!index) index = construireIndex();

  const trouvees: { entree: EntreeIndex; q: number }[] = [];
  for (const entree of index) {
    const q = qualite(entree.cle, saisie);
    if (q !== null) trouvees.push({ entree, q });
  }
  trouvees.sort(
    (a, b) =>
      a.q - b.q ||
      a.entree.poids - b.entree.poids ||
      a.entree.cle.length - b.entree.cle.length ||
      a.entree.label.localeCompare(b.entree.label, "fr")
  );

  const sortie: Suggestion[] = trouvees
    .slice(0, Math.max(0, max - 1))
    .map(({ entree }) => ({
      label: entree.label,
      contexte: entree.contexte,
      href: entree.href,
      type: entree.type,
    }));

  sortie.push({
    label: saisieBrute.trim(),
    contexte: "dans toutes les annonces",
    href: `/recherche?q=${encodeURIComponent(saisieBrute.trim())}`,
    type: "texte",
  });
  return sortie;
}

/** Taille de l'index, exposée pour le contrôle hors base
 *  (scripts/verif-recherche-prefixe.ts) et pour la même raison que
 *  `TAILLE_REFERENTIEL` du normaliseur : c'est le chiffre qui dit si « tout
 *  tient en mémoire du processus » reste vrai. */
export function tailleIndexSuggestions(): number {
  if (!index) index = construireIndex();
  return index.length;
}
