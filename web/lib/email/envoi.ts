/**
 * La boîte d'envoi (cahier des charges §14.11 Résultat n°6, action §17 n°211 ;
 * point d'accroche de l'action n°115 sur la table `travaux`).
 *
 * DEUX EXIGENCES QUI SE CONTREDISENT, ET C'EST TOUT LE SUJET :
 *
 *  - **un envoi ne doit jamais faire échouer le geste de l'utilisateur.**
 *    Une inscription qui échoue parce que l'API de l'expéditeur répond 502 est
 *    un défaut bien pire que l'e-mail manquant ;
 *  - **un envoi ne doit jamais être perdu en silence.** Le §6.4 (R6) fait de
 *    la notification « nouveau contact » le flux qui rend un contact visible
 *    par le garage, donc facturable sans contestation (§5.3) : un message
 *    avalé par un `catch` vide est un contact facturé que le garage n'a jamais
 *    vu.
 *
 * La forme qui satisfait les deux est la boîte d'envoi : **on écrit d'abord la
 * ligne dans `travaux`, on tente ensuite l'envoi tout de suite.** Si l'envoi
 * passe, la ligne est marquée `termine` et la latence est celle d'un envoi
 * direct. S'il échoue, la ligne reste `en_attente` avec sa date de
 * disponibilité repoussée — et c'est le *worker* de l'action n°115 qui la
 * reprendra. Le worker n'existe pas encore ; le point important est que rien
 * ne se perd d'ici là, et qu'aucune ligne d'appelant ne changera quand il
 * arrivera.
 *
 * CE QUE CETTE VERSION N'EST PAS. Ce n'est pas une boîte d'envoi
 * *transactionnelle* au sens strict : l'écriture dans `travaux` n'est pas dans
 * la même transaction que l'écriture métier (`neon-http` sert une requête par
 * aller-retour, sans transaction multi-instructions). Un incident entre les
 * deux écritures perd le message. La §7.4 (Résultat n°6) demande la vraie
 * forme ; elle suppose un pilote Postgres transactionnel, ce qui est une
 * décision d'infrastructure et pas un choix d'e-mail → action n°241.
 */

import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { travaux } from "@/lib/db/schema";
import { expediteurPour, sujetValide, type ResultatEnvoi } from "./expediteur";
import { rendre, type Message } from "./gabarit";

export const TYPE_TRAVAIL_EMAIL = "email";

export interface EnvoiDemande {
  destinataire: string;
  nomDestinataire?: string;
  message: Message;
}

/** Report d'un réessai : 1 min, 5 min, 25 min, 2 h… plafonné à 6 h. */
function reportSecondes(tentative: number): number {
  return Math.min(60 * 5 ** tentative, 6 * 3600);
}

/**
 * Envoie un e-mail. **Ne lève jamais** : tous les chemins d'échec sont
 * journalisés et rendus, jamais propagés à l'appelant.
 */
export async function envoyerEmail(demande: EnvoiDemande): Promise<ResultatEnvoi> {
  const { message } = demande;

  if (!sujetValide(message.sujet)) {
    // Contrainte du fournisseur (§14.11 R5) vérifiée avant l'appel réseau :
    // sinon l'échec est un 400 opaque en production. Le jeu de contrôle
    // `scripts/verif-email.ts` interdit que ce cas arrive pour l'un des quatre
    // messages du dépôt ; ce garde-fou couvre les messages à venir.
    console.error(`[email] objet trop court, envoi refusé : « ${message.sujet} »`);
    return { envoye: false, fournisseur: "aucun", erreur: "objet trop court", reessayable: false };
  }

  let rendu;
  try {
    rendu = rendre(message);
  } catch (err) {
    console.error(`[email] gabarit refusé : ${String(err)}`);
    return { envoye: false, fournisseur: "aucun", erreur: String(err), reessayable: false };
  }

  const charge = {
    flux: message.flux,
    destinataire: demande.destinataire,
    nomDestinataire: demande.nomDestinataire ?? null,
    sujet: rendu.sujet,
    // Le corps rendu est stocké tel quel : un réessai doit renvoyer le MÊME
    // message, pas un message recomposé plus tard à partir d'un état de base
    // qui a changé entre-temps (« nouveau message » dont le fil a été lu, prix
    // d'annonce modifié…). C'est la même règle que le journal en ajout seul de
    // la §5.3 : on rejoue des faits, pas des recalculs.
    html: rendu.html,
    texte: rendu.texte,
    entetes: rendu.entetes,
  };

  // 1. Écriture dans la boîte d'envoi. Un échec ici (table absente, base
  //    injoignable) ne doit pas empêcher la tentative d'envoi : mieux vaut un
  //    message envoyé sans trace qu'aucun message.
  let idTravail: number | null = null;
  try {
    const [ligne] = await db
      .insert(travaux)
      .values({ type: TYPE_TRAVAIL_EMAIL, payload: charge })
      .returning({ id: travaux.id });
    idTravail = ligne?.id ?? null;
  } catch (err) {
    console.error(`[email] boîte d'envoi indisponible, envoi tenté sans trace : ${String(err)}`);
  }

  // 2. Envoi opportuniste immédiat.
  const expediteur = expediteurPour(message.flux);
  const resultat = await expediteur.envoyer({
    flux: message.flux,
    destinataire: demande.destinataire,
    nomDestinataire: demande.nomDestinataire,
    rendu,
  });

  // 3. Clôture de la ligne.
  if (idTravail !== null) {
    try {
      if (resultat.envoye) {
        await db.update(travaux).set({ etat: "termine", tentative: 1 }).where(eq(travaux.id, idTravail));
      } else if (resultat.reessayable) {
        await db
          .update(travaux)
          .set({
            etat: "en_attente",
            tentative: 1,
            erreur: resultat.erreur.slice(0, 1000),
            disponibleA: new Date(Date.now() + reportSecondes(1) * 1000),
          })
          .where(eq(travaux.id, idTravail));
      } else {
        await db
          .update(travaux)
          .set({ etat: "echec", tentative: 1, erreur: resultat.erreur.slice(0, 1000) })
          .where(eq(travaux.id, idTravail));
      }
    } catch (err) {
      console.error(`[email] clôture de la boîte d'envoi impossible : ${String(err)}`);
    }
  }

  if (!resultat.envoye) {
    console.error(
      `[email:${message.flux}] échec ${resultat.fournisseur} vers ${demande.destinataire} — ${resultat.erreur}`
    );
  }
  return resultat;
}

/**
 * Variante « jamais attendue » : l'e-mail part sans que l'appelant en attende
 * l'issue. À utiliser depuis une action serveur dont la réponse doit être
 * immédiate (envoi d'un message dans la messagerie) — et **jamais** là où
 * l'utilisateur attend l'e-mail à l'écran (mot de passe oublié), parce que
 * l'écran doit pouvoir dire « c'est envoyé » sans mentir.
 *
 * Note d'exécution, à ne pas oublier le jour d'une bascule d'hébergement : sur
 * une plateforme sans serveur, une promesse non attendue peut être coupée par
 * la fin de la requête. Le remède est `after()` de Next.js ou la file de
 * l'action n°115, pas un `await` posé au mauvais endroit.
 */
export function envoyerEmailSansAttendre(demande: EnvoiDemande): void {
  void envoyerEmail(demande).catch((err) => console.error(`[email] échec non rattrapé : ${String(err)}`));
}
