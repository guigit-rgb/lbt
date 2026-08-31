/**
 * Les quatre messages de LBT, dans l'ordre d'utilité fixé par l'action §17
 * n°211 : mot de passe oublié, nouveau message, alerte de recherche,
 * vérification d'adresse (§14.11 Résultat n°7).
 *
 * Ce sont des **fonctions pures** : aucune lecture de base, aucun appel
 * réseau, aucune date implicite. C'est ce qui permet à
 * `scripts/verif-email.ts` de les rendre et de les inspecter hors base — et
 * c'est la même discipline que le normaliseur de la §14.8, pour la même
 * raison (un module qui ne fait qu'assembler se teste sans rien monter).
 */

import type { Bloc, Message } from "./gabarit";

/**
 * Un objet d'e-mail est un EN-TÊTE. Une valeur qui contient un retour à la
 * ligne ouvre une injection d'en-tête ; un titre d'annonce et un nom affiché
 * sont saisis par des tiers, donc les deux passent par ici avant d'approcher
 * un champ d'en-tête. Les transports du dépôt sérialisent en JSON — ce qui
 * neutralise déjà la plupart des cas — mais la garantie ne doit pas dépendre
 * du transport : un relais SMTP direct, un jour, ne l'offrirait pas.
 *
 * Effet de bord utile : les titres d'annonce en majuscules criardes et les
 * espaces multiples sont repliés, ce qui améliore aussi la lisibilité.
 */
export function nettoyerEntete(valeur: string): string {
  return valeur.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim();
}

/** Coupe proprement un extrait sans casser un mot, pour l'objet et l'aperçu. */
export function tronquer(valeur: string, longueur: number): string {
  const propre = nettoyerEntete(valeur);
  if (propre.length <= longueur) return propre;
  const coupe = propre.slice(0, longueur);
  const espace = coupe.lastIndexOf(" ");
  return `${(espace > longueur * 0.6 ? coupe.slice(0, espace) : coupe).trimEnd()}…`;
}

// --- 1. Mot de passe oublié -------------------------------------------------
// Premier de la liste parce que c'est le seul des quatre dont l'absence rend
// un compte définitivement irrécupérable : sans lui, un utilisateur qui perd
// son mot de passe perd ses annonces, ses fils de messagerie et ses favoris,
// et le seul recours est une intervention manuelle en base.
export function motDePasseOublie(params: { lien: string; validiteMinutes: number }): Message {
  return {
    flux: "transactionnel",
    sujet: "Réinitialiser votre mot de passe lebontruc",
    apercu: `Lien valable ${params.validiteMinutes} minutes.`,
    titre: "Réinitialiser votre mot de passe",
    blocs: [
      { type: "paragraphe", texte: "Vous avez demandé à réinitialiser le mot de passe de votre compte lebontruc." },
      { type: "bouton", libelle: "Choisir un nouveau mot de passe", href: params.lien },
      { type: "lien_brut", href: params.lien },
      {
        type: "secondaire",
        texte: `Ce lien est valable ${params.validiteMinutes} minutes et ne fonctionne qu'une fois. Si vous n'êtes pas à l'origine de cette demande, ignorez ce message : votre mot de passe reste inchangé.`,
      },
    ],
  };
}

// --- 2. Nouveau message -----------------------------------------------------
// Le flux `contacts` du §6.4 (R6) : celui qui ne doit jamais être dégradé,
// parce qu'un contact que le vendeur ne voit pas est un contact que le
// compteur de la §5.3 décompte quand même.
export function nouveauMessage(params: {
  nomExpediteur: string;
  titreAnnonce: string;
  extrait: string;
  lien: string;
  premierContact: boolean;
}): Message {
  const titreCourt = tronquer(params.titreAnnonce, 60);
  const auteur = nettoyerEntete(params.nomExpediteur);
  const blocs: Bloc[] = [
    {
      type: "paragraphe",
      texte: params.premierContact
        ? `${auteur} vous a écrit au sujet de votre annonce « ${titreCourt} ».`
        : `${auteur} a répondu dans votre conversation sur « ${titreCourt} ».`,
    },
    // L'extrait est cité, pas reproduit comme du texte de LBT : le bloc
    // `citation` l'isole visuellement et l'échappe. Un message d'acheteur peut
    // contenir n'importe quoi, y compris ce qui ressemble à un message de LBT.
    { type: "citation", texte: tronquer(params.extrait, 400), auteur },
    { type: "bouton", libelle: "Répondre sur lebontruc", href: params.lien },
    {
      type: "secondaire",
      texte:
        "Répondez depuis le site : les échanges restent dans votre messagerie lebontruc, où ils sont conservés et modérables. Une réponse à cette adresse ne parviendra pas à votre interlocuteur.",
    },
  ];

  return {
    flux: "contacts",
    sujet: `Nouveau message à propos de « ${titreCourt} »`,
    apercu: tronquer(params.extrait, 90),
    titre: "Vous avez reçu un message",
    blocs,
  };
}

// --- 3. Alerte sur recherche sauvegardée ------------------------------------
// Le seul flux à risque de plainte, et le seul qui porte une désinscription en
// un clic (§6.4 R6 point 3 et R7 point 2). Trois obligations du §6.4 sont
// câblées ici et pas ailleurs : la ligne de motif datée, l'ordre d'affichage
// publié (date de publication décroissante, aucun boost — §8.2, action n°147),
// et le plafond de 10 annonces par e-mail.
export const ALERTE_MAX_ANNONCES = 10;

export interface AnnonceAlerte {
  titre: string;
  prix: string | null;
  lieu: string | null;
  href: string;
}

export function alerteRecherche(params: {
  libelleRecherche: string;
  dateEnregistrement: string;
  annonces: AnnonceAlerte[];
  lienRecherche: string;
  lienDesabonnement: string;
}): Message {
  const libelle = tronquer(params.libelleRecherche, 70);
  const retenues = params.annonces.slice(0, ALERTE_MAX_ANNONCES);
  const reste = params.annonces.length - retenues.length;

  const blocs: Bloc[] = [
    {
      type: "paragraphe",
      texte:
        retenues.length === 1
          ? `Une annonce correspond à votre recherche « ${libelle} ».`
          : `${retenues.length} annonces correspondent à votre recherche « ${libelle} ».`,
    },
    ...retenues.map<Bloc>((a) => ({
      type: "annonce",
      titre: nettoyerEntete(a.titre),
      prix: a.prix ?? undefined,
      lieu: a.lieu ?? undefined,
      href: a.href,
    })),
  ];

  if (reste > 0) {
    blocs.push({ type: "paragraphe", texte: `et ${reste} autre${reste > 1 ? "s" : ""} annonce${reste > 1 ? "s" : ""}.` });
  }
  blocs.push({ type: "bouton", libelle: "Voir toutes les annonces", href: params.lienRecherche });
  // Publié dans le message lui-même, et pas seulement dans un document
  // annexe : l'e-mail donne une place relative à des biens, c'est donc une
  // surface de classement au sens du règlement P2B (§6.4 R7 point 3, §8.2).
  blocs.push({
    type: "secondaire",
    texte: "Annonces classées de la plus récente à la plus ancienne. Aucune mise en avant payante dans ce message.",
  });

  return {
    flux: "alertes",
    sujet:
      retenues.length === 1
        ? `Une nouvelle annonce pour « ${libelle} »`
        : `${retenues.length} nouvelles annonces pour « ${libelle} »`,
    apercu: retenues.map((a) => nettoyerEntete(a.titre)).join(" · ").slice(0, 120),
    titre: "Nouvelles annonces pour votre alerte",
    motif: `Vous recevez ce message parce que vous avez enregistré la recherche « ${libelle} » le ${params.dateEnregistrement}.`,
    desabonnement: params.lienDesabonnement,
    blocs,
  };
}

// --- 4. Vérification d'adresse ----------------------------------------------
// Dernier de la liste d'utilité, mais c'est lui qui conditionne les trois
// autres : une adresse non vérifiée est une adresse dont on ne sait pas si
// elle appartient à l'inscrit, donc un canal de plainte gratuit contre notre
// propre domaine (§6.4 R7, obligation n°1 — le double opt-in).
export function verificationAdresse(params: { lien: string; validiteHeures: number }): Message {
  return {
    flux: "transactionnel",
    sujet: "Confirmez votre adresse e-mail lebontruc",
    apercu: "Une seule étape pour activer les notifications de votre compte.",
    titre: "Confirmez votre adresse e-mail",
    blocs: [
      {
        type: "paragraphe",
        texte:
          "Bienvenue sur lebontruc. Confirmez cette adresse pour recevoir les messages de vos acheteurs, vos alertes et, le cas échéant, la réinitialisation de votre mot de passe.",
      },
      { type: "bouton", libelle: "Confirmer mon adresse", href: params.lien },
      { type: "lien_brut", href: params.lien },
      {
        type: "secondaire",
        texte: `Ce lien est valable ${params.validiteHeures} heures. Si vous n'avez pas créé de compte sur lebontruc, ignorez ce message — aucune adresse n'est activée sans ce clic.`,
      },
    ],
  };
}
