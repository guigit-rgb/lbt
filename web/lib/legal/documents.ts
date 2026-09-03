import type { Bloc, DocumentLegal } from "./types";
import { texteNu } from "./balisage";
import { MENTIONS_LEGALES } from "./mentions-legales";
import { CGU } from "./cgu";
import { CGV_PRO } from "./cgv-pro";
import { CONFIDENTIALITE } from "./confidentialite";
import { CLASSEMENT } from "./classement";
import { COOKIES } from "./cookies";
import { DROITS_ET_OBLIGATIONS } from "./droits-et-obligations";

/**
 * Le registre — source unique de vérité des pages légales (§8.9).
 *
 * Ordre d'affichage voulu : d'abord ce qu'un visiteur cherche (qui édite, ce
 * qu'il accepte, ce qu'on fait de ses données), puis ce qui s'adresse aux
 * vendeurs. Le pied de page et la page d'index suivent cet ordre.
 */
export const DOCUMENTS_LEGAUX: readonly DocumentLegal[] = [
  MENTIONS_LEGALES,
  CGU,
  CONFIDENTIALITE,
  COOKIES,
  CLASSEMENT,
  DROITS_ET_OBLIGATIONS,
  CGV_PRO,
];

export function documentParChemin(chemin: string): DocumentLegal | undefined {
  return DOCUMENTS_LEGAUX.find((d) => d.chemin === chemin);
}

/** Tous les textes balisés d'un bloc, dans l'ordre. */
export function textesDuBloc(bloc: Bloc): string[] {
  switch (bloc.type) {
    case "paragraphe":
      return [bloc.texte];
    case "liste":
      return [...bloc.items];
    case "encadre":
      return [bloc.titre, bloc.texte];
    case "tableau":
      return [...bloc.entetes, ...bloc.lignes.flat()];
  }
}

/** Le document entier en texte nu, titres compris. C'est ce sur quoi porte
 *  toute recherche de clause dans `scripts/verif-pages-legales.ts` — et ce
 *  qu'exige, au fond, le « format lisible par machine » de l'article 14 du
 *  DSA (§7.2, Résultat n°1). */
export function texteIntegral(doc: DocumentLegal): string {
  const morceaux: string[] = [doc.titre, doc.sousTitre];
  for (const section of doc.sections) {
    morceaux.push(section.titre);
    for (const bloc of section.blocs) {
      morceaux.push(...textesDuBloc(bloc).map(texteNu));
    }
  }
  return morceaux.join("\n");
}

/**
 * Le document découpé en **unités de sens** : un paragraphe, un item de liste,
 * un encadré, ou **une ligne de tableau entière** — cellules jointes.
 *
 * C'est l'unité sur laquelle raisonnent les interdits de rédaction du §8.8
 * (`scripts/verif-pages-legales.ts`, famille 5), et le choix de la ligne plutôt
 * que de la cellule n'est pas un détail de mise en œuvre : dans le tableau
 * « Correspondances » de la politique de confidentialité, la première cellule
 * décrit un traitement (« publier un taux de réponse ») et la troisième dit que
 * nous ne le faisons pas. Séparées, la première se lit comme un engagement ;
 * ensemble, elles disent l'inverse. Le sens est porté par la ligne.
 */
export function unitesDeSens(doc: DocumentLegal): string[] {
  const unites: string[] = [];
  for (const section of doc.sections) {
    for (const bloc of section.blocs) {
      switch (bloc.type) {
        case "paragraphe":
          unites.push(texteNu(bloc.texte));
          break;
        case "liste":
          unites.push(...bloc.items.map(texteNu));
          break;
        case "encadre":
          unites.push(`${bloc.titre} — ${texteNu(bloc.texte)}`);
          break;
        case "tableau":
          unites.push(...bloc.lignes.map((ligne) => ligne.map(texteNu).join(" — ")));
          break;
      }
    }
  }
  return unites;
}

/** Les mentions `[[à figer : …]]` d'un document, dans l'ordre d'apparition.
 *
 *  Ce compte n'est pas décoratif : tant qu'il n'est pas nul, le document est
 *  un **projet**, et le publier à l'ouverture du service serait un manquement
 *  constatable en une visite. La page d'index l'affiche, la page du document
 *  l'affiche, et le contrôle hors base l'imprime. */
export function mentionsAFiger(doc: DocumentLegal): string[] {
  const trouvees: string[] = [];
  const motif = /\[\[à figer\s*:\s*([^\]]+)\]\]/g;
  for (const section of doc.sections) {
    for (const bloc of section.blocs) {
      for (const texte of textesDuBloc(bloc)) {
        for (const m of texte.matchAll(motif)) trouvees.push(m[1].trim());
      }
    }
  }
  return trouvees;
}

export function totalMentionsAFiger(): number {
  return DOCUMENTS_LEGAUX.reduce((n, d) => n + mentionsAFiger(d).length, 0);
}
