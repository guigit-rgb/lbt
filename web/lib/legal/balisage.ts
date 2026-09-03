/**
 * Balisage en ligne des textes légaux — trois marques, pas une de plus.
 *
 * `**gras**`                → emphase
 * `[libellé](/chemin)`      → lien interne (ou `mailto:`, ou `https://`)
 * `[[à figer : quelque chose]]` → mention que Nicolas doit arrêter avant
 *                             publication ; comptée et affichée comme telle.
 *
 * Aucun HTML n'est jamais produit ici : la fonction rend des **jetons**, que
 * `components/DocumentLegalVue.tsx` transforme en éléments React. C'est
 * délibéré et c'est la seule règle de sécurité de ce module — pas de
 * `dangerouslySetInnerHTML`, donc pas de surface d'injection, même le jour où
 * un texte légal sera édité ailleurs que dans le dépôt.
 */

export type Jeton =
  | { type: "texte"; valeur: string }
  | { type: "gras"; valeur: string }
  | { type: "lien"; valeur: string; href: string }
  | { type: "afiger"; valeur: string };

/** `[[à figer : X]]` — le contenu, sans le préfixe, est la description. */
const A_FIGER = /\[\[à figer\s*:\s*([^\]]+)\]\]/;
const GRAS = /\*\*([^*]+)\*\*/;
const LIEN = /\[([^\]]+)\]\(([^)]+)\)/;

/**
 * Découpe un texte balisé en jetons, dans l'ordre d'apparition. Les marques
 * ne s'imbriquent pas : `**[a](/b)**` rend un gras contenant les crochets
 * bruts. C'est voulu — une grammaire imbriquée demanderait un analyseur, et
 * un analyseur demanderait des tests qui n'ont rien à voir avec le droit.
 */
export function jetons(texte: string): Jeton[] {
  const sortie: Jeton[] = [];
  let reste = texte;

  while (reste.length > 0) {
    const candidats: { index: number; longueur: number; jeton: Jeton }[] = [];

    const aFiger = A_FIGER.exec(reste);
    if (aFiger) {
      candidats.push({
        index: aFiger.index,
        longueur: aFiger[0].length,
        jeton: { type: "afiger", valeur: aFiger[1].trim() },
      });
    }
    const gras = GRAS.exec(reste);
    if (gras) {
      candidats.push({
        index: gras.index,
        longueur: gras[0].length,
        jeton: { type: "gras", valeur: gras[1] },
      });
    }
    const lien = LIEN.exec(reste);
    // Un `[[à figer]]` commence aussi par `[` : si les deux s'ouvrent au même
    // endroit, la mention à figer gagne.
    if (lien && !(aFiger && aFiger.index === lien.index)) {
      candidats.push({
        index: lien.index,
        longueur: lien[0].length,
        jeton: { type: "lien", valeur: lien[1], href: lien[2] },
      });
    }

    if (candidats.length === 0) {
      sortie.push({ type: "texte", valeur: reste });
      break;
    }

    candidats.sort((a, b) => a.index - b.index || b.longueur - a.longueur);
    const gagnant = candidats[0];
    if (gagnant.index > 0) {
      sortie.push({ type: "texte", valeur: reste.slice(0, gagnant.index) });
    }
    sortie.push(gagnant.jeton);
    reste = reste.slice(gagnant.index + gagnant.longueur);
  }

  return sortie.filter((j) => j.type !== "texte" || j.valeur.length > 0);
}

/** Le texte nu, marques retirées. C'est sur lui que porte toute recherche de
 *  clause : une clause absente parce qu'elle est écrite en gras serait une
 *  fausse alerte, et une clause présente uniquement dans un `href` n'est pas
 *  une clause. */
export function texteNu(texte: string): string {
  return jetons(texte)
    .map((j) => j.valeur)
    .join("");
}
