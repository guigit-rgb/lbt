/**
 * Modèle de contenu des pages légales (§8.9, action §17 n°212 et n°253).
 *
 * Pourquoi les textes sont des **données** et non du JSX : trois obligations
 * du dossier portent sur la forme du document, pas sur son fond, et aucune
 * n'est vérifiable si le texte est éparpillé dans des composants React.
 *
 *  1. **DSA art. 14** exige les conditions générales « dans un format
 *     accessible **et lisible par machine** » (§7.2, Résultat n°1). Un tableau
 *     de blocs typés se sérialise ; un arbre de `<p>` ne se sérialise pas.
 *  2. **P2B art. 3** exige un préavis de modification, et §8.2 (Résultat n°6,
 *     point 4) en tire que « le versionnement de la page est une obligation,
 *     pas une élégance » : la version et la date sont donc des champs, pas une
 *     phrase perdue dans un paragraphe.
 *  3. **§8.8 (Résultat n°2, corollaire de rédaction)** : dans le dispositif de
 *     l'article L. 32-3 du CPCE, « le mot écrit dans la politique de
 *     confidentialité *est* le fait générateur du régime ». Un texte que l'on
 *     peut relire par programme est un texte dont on peut vérifier qu'il ne
 *     contient pas la phrase qui fait basculer un traitement du III (autorisé)
 *     au IV (interdit sans consentement annuel). C'est exactement ce que fait
 *     `scripts/verif-pages-legales.ts`.
 */

/** Balisage en ligne autorisé dans un texte : `**gras**`, `[libellé](/chemin)`
 *  et `[[à figer : …]]` pour une mention que Nicolas doit arrêter avant
 *  publication. Volontairement pauvre — voir `balisage.ts`. */
export type TexteBalise = string;

export type Bloc =
  | { type: "paragraphe"; texte: TexteBalise }
  | { type: "liste"; items: TexteBalise[] }
  | { type: "tableau"; entetes: string[]; lignes: TexteBalise[][] }
  | { type: "encadre"; titre: string; texte: TexteBalise };

export type Section = {
  /** Titre de niveau 2. Sert aussi d'ancre (`id`) et de sommaire. */
  titre: string;
  blocs: Bloc[];
};

export type DocumentLegal = {
  /** Identifiant stable, jamais réutilisé — sert de clé de version. */
  id: string;
  /** Chemin public, sans barre oblique finale. */
  chemin: string;
  titre: string;
  /** Une phrase : à qui le document s'adresse et ce qu'il règle. */
  sousTitre: string;
  /** Version publiée. Toute modification de fond l'incrémente. */
  version: string;
  /** Date de la version, ISO court. */
  date: string;
  /** Bases juridiques, affichées en tête et vérifiées par le contrôle. */
  fondement: string[];
  /**
   * `true` : le lien doit figurer dans le pied de page de **toutes** les
   * pages. Ce n'est pas une préférence de mise en page — le décret
   * n° 2017-1434 exige pour la description du classement « une rubrique
   * spécifique directement et aisément accessible depuis toutes les pages du
   * site » (§8.2, Résultat n°1).
   */
  piedDePage: boolean;
  sections: Section[];
};
