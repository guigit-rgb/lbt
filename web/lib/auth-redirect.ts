export const DESTINATION_PAR_DEFAUT = "/compte/annonces";

// Valide la destination de retour après connexion ou inscription (`?next=`,
// posé par `proxy.ts` quand il intercepte une page protégée).
//
// Une valeur non validée serait une **redirection ouverte** : `//exemple.fr` et
// `/\exemple.fr` sont interprétés comme des domaines par les navigateurs, et
// une URL absolue enverrait l'utilisateur hors du site juste après avoir saisi
// son mot de passe. On n'accepte donc qu'un chemin interne.
//
// Renvoie `undefined` quand aucune destination explicite n'est demandée, pour
// que l'appelant retombe sur `DESTINATION_PAR_DEFAUT` et que l'URL des écrans
// d'identification reste propre dans le cas courant.
export function destinationInterne(valeur: unknown): string | undefined {
  if (typeof valeur !== "string" || valeur.length === 0) return undefined;
  if (!valeur.startsWith("/")) return undefined;
  if (valeur.startsWith("//") || valeur.startsWith("/\\")) return undefined;
  // Un retour chariot dans une valeur reconduite en en-tête `Location` est un
  // classique d'injection de réponse : on écarte tous les caractères de
  // contrôle plutôt que les seuls \r et \n.
  for (const caractere of valeur) {
    if (caractere.charCodeAt(0) < 0x20 || caractere.charCodeAt(0) === 0x7f) return undefined;
  }
  if (valeur === DESTINATION_PAR_DEFAUT) return undefined;
  return valeur;
}
