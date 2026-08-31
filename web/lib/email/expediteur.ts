/**
 * L'interface de substitution de l'expéditeur d'e-mails
 * (cahier des charges §14.11, action §17 n°211).
 *
 * DOCTRINE, ET ELLE N'EST PAS NEUVE : la §8.3 (Résultat n°4, point 1) l'a
 * posée pour le modèle vision-langage — « l'appel passe derrière une interface
 * de substitution : le jour où le cadre de transfert tombe, on change de
 * fournisseur, on ne réécrit pas la chaîne ». La §14.1 l'a posée pour le
 * moteur de recherche : « ne pas juger un fournisseur sur son état mais sur sa
 * trajectoire, et garder la réversibilité ». Un expéditeur d'e-mails est le
 * cas où cette doctrine coûte le moins cher à appliquer — le contrat tient en
 * quatre champs — et où elle rapporte le plus vite : la §14.11 (Résultat n°4)
 * établit qu'on peut vouloir changer de fournisseur **pour un seul flux**,
 * l'alerte de recherche étant à la limite de ce qu'un contrat « transactionnel
 * uniquement » autorise.
 *
 * AUCUNE DÉPENDANCE NPM. Les deux fournisseurs retenus exposent une API HTTP
 * JSON ; `fetch` suffit. Un SDK d'expéditeur, c'est une dépendance de plus à
 * suivre, et surtout un couplage à un fournisseur là où toute la section
 * cherche l'inverse.
 */

import { CONFIGURATION_FLUX, adresseExpediteur, nomExpediteur, type Flux } from "./flux";
import type { EmailRendu } from "./gabarit";

export interface DemandeEnvoi {
  flux: Flux;
  destinataire: string;
  nomDestinataire?: string;
  rendu: EmailRendu;
}

export type ResultatEnvoi =
  | { envoye: true; fournisseur: string; identifiant: string | null }
  | { envoye: false; fournisseur: string; erreur: string; reessayable: boolean };

export interface Expediteur {
  nom: string;
  envoyer(demande: DemandeEnvoi): Promise<ResultatEnvoi>;
}

/**
 * Contrainte de fournisseur remontée dans le contrat, et pas laissée au hasard
 * de la production : l'API de Scaleway TEM **refuse un objet de moins de 10
 * caractères** (§14.11 R5, source primaire — dépôt `scaleway/docs-content`).
 * Un « Code : 384920 » de 13 caractères passe, un « Bienvenue » de 9 ne passe
 * pas, et l'échec serait un 400 en production sur un message que personne ne
 * relit. La vérification est faite ici, pour tous les transports, afin qu'un
 * changement de fournisseur ne fasse pas disparaître la contrainte du champ de
 * vision — c'est le plus petit dénominateur commun, pas une bizarrerie locale.
 */
export const SUJET_LONGUEUR_MINIMALE = 10;

export function sujetValide(sujet: string): boolean {
  return sujet.trim().length >= SUJET_LONGUEUR_MINIMALE;
}

// --- Transport 1 : Scaleway Transactional Email (fr-par) --------------------
// Retenu par la §14.11 (Résultat n°3). API :
//   POST https://api.scaleway.com/transactional-email/v1alpha1/regions/fr-par/emails
//   en-tête `X-Auth-Token` = clé secrète d'API, `project_id` dans le corps.
class ExpediteurScaleway implements Expediteur {
  nom = "scaleway";

  async envoyer(demande: DemandeEnvoi): Promise<ResultatEnvoi> {
    const cle = process.env.SCALEWAY_SECRET_KEY;
    const projet = process.env.SCALEWAY_PROJECT_ID;
    if (!cle || !projet) {
      return {
        envoye: false,
        fournisseur: this.nom,
        erreur: "SCALEWAY_SECRET_KEY ou SCALEWAY_PROJECT_ID absent",
        // Une clé absente ne se répare pas en réessayant : la ligne reste en
        // attente dans la boîte d'envoi, ce qui est exactement le bon
        // comportement (rien n'est perdu, rien n'est retenté en boucle).
        reessayable: false,
      };
    }

    const region = process.env.SCALEWAY_TEM_REGION ?? "fr-par";
    const corps = {
      from: { name: nomExpediteur(demande.flux), email: adresseExpediteur(demande.flux) },
      to: [{ name: demande.nomDestinataire ?? "", email: demande.destinataire }],
      subject: demande.rendu.sujet,
      project_id: projet,
      text: demande.rendu.texte,
      html: demande.rendu.html,
      additional_headers: Object.entries(demande.rendu.entetes).map(([key, value]) => ({ key, value })),
    };

    try {
      const reponse = await fetch(
        `https://api.scaleway.com/transactional-email/v1alpha1/regions/${region}/emails`,
        {
          method: "POST",
          headers: { "X-Auth-Token": cle, "Content-Type": "application/json" },
          body: JSON.stringify(corps),
        }
      );
      if (!reponse.ok) {
        const detail = (await reponse.text()).slice(0, 400);
        return {
          envoye: false,
          fournisseur: this.nom,
          erreur: `HTTP ${reponse.status} — ${detail}`,
          reessayable: estReessayable(reponse.status),
        };
      }
      const json = (await reponse.json()) as { emails?: { id?: string }[] };
      return { envoye: true, fournisseur: this.nom, identifiant: json.emails?.[0]?.id ?? null };
    } catch (err) {
      // Panne réseau : toujours réessayable, c'est le cas nominal de la boîte
      // d'envoi.
      return { envoye: false, fournisseur: this.nom, erreur: String(err), reessayable: true };
    }
  }
}

// --- Transport 2 : Brevo ----------------------------------------------------
// Repli documenté de la §14.11 (Résultat n°3) : c'est le fournisseur que le
// §5.1 avait supposé depuis le 2026-07-28 sans jamais l'arbitrer, et il reste
// le seul candidat capable de porter *aussi* de l'e-mail marketing le jour où
// LBT en enverrait — ce que Scaleway TEM interdit par contrat.
//   POST https://api.brevo.com/v3/smtp/email, en-tête `api-key`.
class ExpediteurBrevo implements Expediteur {
  nom = "brevo";

  async envoyer(demande: DemandeEnvoi): Promise<ResultatEnvoi> {
    const cle = process.env.BREVO_API_KEY;
    if (!cle) {
      return { envoye: false, fournisseur: this.nom, erreur: "BREVO_API_KEY absent", reessayable: false };
    }

    const corps = {
      sender: { name: nomExpediteur(demande.flux), email: adresseExpediteur(demande.flux) },
      to: [{ email: demande.destinataire, ...(demande.nomDestinataire ? { name: demande.nomDestinataire } : {}) }],
      subject: demande.rendu.sujet,
      textContent: demande.rendu.texte,
      htmlContent: demande.rendu.html,
      headers: demande.rendu.entetes,
    };

    try {
      const reponse = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": cle, "Content-Type": "application/json", accept: "application/json" },
        body: JSON.stringify(corps),
      });
      if (!reponse.ok) {
        const detail = (await reponse.text()).slice(0, 400);
        return {
          envoye: false,
          fournisseur: this.nom,
          erreur: `HTTP ${reponse.status} — ${detail}`,
          reessayable: estReessayable(reponse.status),
        };
      }
      const json = (await reponse.json()) as { messageId?: string };
      return { envoye: true, fournisseur: this.nom, identifiant: json.messageId ?? null };
    } catch (err) {
      return { envoye: false, fournisseur: this.nom, erreur: String(err), reessayable: true };
    }
  }
}

// --- Transport 3 : le journal (défaut) --------------------------------------
// Aucun envoi, une ligne de journal. C'est le transport par DÉFAUT, et c'est
// délibéré : tant que Nicolas n'a pas posé les enregistrements DNS et la clé
// d'API, un site déployé doit continuer à fonctionner sans jamais tenter un
// envoi qui échouerait à chaque fois. Le message est écrit dans la boîte
// d'envoi comme les autres — le jour où le fournisseur est configuré, l'arriéré
// est là.
class ExpediteurJournal implements Expediteur {
  nom = "journal";

  async envoyer(demande: DemandeEnvoi): Promise<ResultatEnvoi> {
    console.log(
      `[email:${demande.flux}] → ${demande.destinataire} — « ${demande.rendu.sujet} » (aucun fournisseur configuré, message non envoyé)`
    );
    return { envoye: true, fournisseur: this.nom, identifiant: null };
  }
}

/**
 * 429 et 5xx se réessaient ; 4xx non (une adresse invalide, un objet trop
 * court ou un domaine non vérifié le resteront au prochain essai, et la
 * réputation se dégrade à insister).
 */
function estReessayable(statut: number): boolean {
  return statut === 429 || statut >= 500;
}

const TRANSPORTS: Record<string, Expediteur> = {
  scaleway: new ExpediteurScaleway(),
  brevo: new ExpediteurBrevo(),
  journal: new ExpediteurJournal(),
};

/**
 * Choix du transport, du plus spécifique au plus général :
 *   1. la variable propre au flux (`EMAIL_FOURNISSEUR_ALERTES`…) ;
 *   2. la variable globale `EMAIL_FOURNISSEUR` ;
 *   3. le journal.
 * Un nom inconnu retombe sur le journal plutôt que de lever : une faute de
 * frappe dans une variable d'environnement ne doit pas empêcher une
 * inscription.
 */
export function expediteurPour(flux: Flux): Expediteur {
  const nom =
    process.env[CONFIGURATION_FLUX[flux].variableFournisseur] ?? process.env.EMAIL_FOURNISSEUR ?? "journal";
  return TRANSPORTS[nom] ?? TRANSPORTS.journal;
}

export function transportsDisponibles(): string[] {
  return Object.keys(TRANSPORTS);
}
