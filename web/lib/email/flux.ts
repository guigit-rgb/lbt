/**
 * Les trois flux d'envoi de LBT et leurs sous-domaines
 * (cahier des charges §6.4 Résultat n°6 point 1, §14.11).
 *
 * POURQUOI TROIS FLUX ET PAS UN SEUL EXPÉDITEUR. La chaîne causale est écrite
 * au §6.4 : un e-mail d'alerte est le seul message que LBT envoie et que son
 * destinataire peut ne pas vouloir → les plaintes se déposent sur le domaine
 * d'envoi → si c'est le même domaine que la notification « nouveau contact »
 * adressée au garage, le garage cesse de voir ses contacts → le compteur de la
 * §5.3 décompte un contact que le garage n'a jamais vu, et la garantie
 * commerciale du §5.2 devient contestable.
 *
 * CE QUE LA §14.11 AJOUTE, ET C'EST UNE CORRECTION DE LA §6.4 : trois
 * sous-domaines et trois clés DKIM distinctes protègent la réputation du
 * DOMAINE, pas celle de l'ADRESSE IP. Chez un fournisseur à IP partagée, les
 * trois flux sortent par le même pool, partagé avec les autres clients — donc
 * la séparation est réelle du côté de l'alignement DMARC et fictive du côté du
 * filtrage par IP. D'où `fournisseurParDefaut` : le flux se choisit son
 * expéditeur, ce qui permet de placer `alertes.` et `contacts.` chez deux
 * fournisseurs (ou deux projets) différents le jour où le volume le justifie,
 * sans toucher à une seule ligne d'appelant.
 */

export const FLUX = ["transactionnel", "contacts", "alertes"] as const;
export type Flux = (typeof FLUX)[number];

export interface ConfigurationFlux {
  /** Sous-domaine d'envoi — une clé DKIM distincte par sous-domaine (§6.4 R6). */
  sousDomaine: string;
  /** Partie locale de l'adresse `From`. */
  boite: string;
  /** Nom affiché dans la boîte du destinataire. */
  nomAffiche: string;
  /**
   * Un message de ce flux peut-il être désabonné ? Le §6.4 (R6 point 3) est
   * catégorique : la désinscription en un clic désabonne *cette alerte* et
   * jamais le flux transactionnel ni la messagerie. Un `List-Unsubscribe` sur
   * un e-mail de réinitialisation de mot de passe serait pire qu'inutile — il
   * proposerait de couper le seul canal de récupération de compte.
   */
  desabonnable: boolean;
  /**
   * Variable d'environnement qui, si elle est posée, remplace le fournisseur
   * global pour ce flux seul. Voir `expediteur.ts`.
   */
  variableFournisseur: string;
}

/**
 * Domaine racine. `lebontruc.fr` en production ; surchargeable pour les
 * environnements de recette, qui ne doivent surtout pas émettre depuis le
 * domaine de production (une plainte déposée en recette compte comme les
 * autres).
 */
export function domaineRacine(): string {
  return process.env.EMAIL_DOMAINE ?? "lebontruc.fr";
}

export const CONFIGURATION_FLUX: Record<Flux, ConfigurationFlux> = {
  // Mot de passe oublié, vérification d'adresse, confirmations de compte.
  // C'est le flux dont l'échec est le plus visible pour l'utilisateur (il
  // attend le message, écran ouvert) et le moins risqué pour la réputation.
  transactionnel: {
    sousDomaine: "mail",
    boite: "ne-pas-repondre",
    nomAffiche: "lebontruc",
    desabonnable: false,
    variableFournisseur: "EMAIL_FOURNISSEUR_TRANSACTIONNEL",
  },
  // Notification « nouveau message » au vendeur. Le §6.4 le désigne comme
  // « le flux qui ne doit JAMAIS être dégradé » : c'est lui qui rend un
  // contact visible par le garage, donc facturable sans contestation (§5.3).
  contacts: {
    sousDomaine: "contacts",
    boite: "notifications",
    nomAffiche: "lebontruc",
    desabonnable: false,
    variableFournisseur: "EMAIL_FOURNISSEUR_CONTACTS",
  },
  // Alertes sur recherche sauvegardée. Le seul flux à risque de plainte.
  alertes: {
    sousDomaine: "alertes",
    boite: "alertes",
    nomAffiche: "lebontruc — alertes",
    desabonnable: true,
    variableFournisseur: "EMAIL_FOURNISSEUR_ALERTES",
  },
};

export function adresseExpediteur(flux: Flux): string {
  const config = CONFIGURATION_FLUX[flux];
  return `${config.boite}@${config.sousDomaine}.${domaineRacine()}`;
}

export function nomExpediteur(flux: Flux): string {
  return CONFIGURATION_FLUX[flux].nomAffiche;
}
