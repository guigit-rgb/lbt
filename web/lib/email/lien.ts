/**
 * Construction des liens absolus des e-mails (§14.11).
 *
 * `lib/site-url.ts` existe déjà mais lit l'en-tête `Host` de la requête en
 * cours : c'est le bon choix pour une redirection Stripe (l'URL doit ramener
 * sur *ce* déploiement, y compris une prévisualisation), et c'est le mauvais
 * choix ici pour deux raisons.
 *
 *  1. **Un e-mail survit à la requête qui l'a produit.** Le lot d'alertes de
 *     la §6.4 est envoyé par une tâche périodique, sans requête HTTP entrante,
 *     donc sans en-tête `Host` — `headers()` y lèverait.
 *  2. **`Host` est fourni par le client.** Un lien de réinitialisation de mot
 *     de passe construit à partir d'un en-tête que l'appelant contrôle est le
 *     schéma classique de l'empoisonnement d'en-tête hôte : l'attaquant
 *     demande une réinitialisation pour la victime avec `Host:` pointant chez
 *     lui, et reçoit le jeton quand la victime clique. Un domaine lu dans la
 *     configuration du serveur ferme la question.
 */

export function origine(): string {
  const brut = process.env.EMAIL_SITE_URL ?? process.env.SITE_URL ?? "https://lebontruc.fr";
  return brut.replace(/\/+$/, "");
}

export function lienAbsolu(chemin: string): string {
  return `${origine()}${chemin.startsWith("/") ? chemin : `/${chemin}`}`;
}
