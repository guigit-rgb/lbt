import { createHmac, timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";
import { db } from "@/lib/db/client";
import { evenementContact } from "@/lib/db/schema";

// Journal des mises en relation — écriture (cahier des charges §5.3 Résultat
// n°6, §8.7 Résultat n°4, action §17 n°209).
//
// Ce module est le SEUL endroit du code où une ligne d'`evenement_contact` est
// écrite, et le seul où le poivre est lu. La §5.3 fait du compteur le résultat
// d'une fonction pure appliquée à un journal en ajout seul : un second chemin
// d'écriture, même bien intentionné, casserait l'invariant sans rien signaler.
//
// LIMITE ASSUMÉE ET DATÉE (2026-08-26) : le poivre est ici une variable
// d'environnement du même hôte que la base. La §8.7 (Résultat n°4) a établi
// que c'est exactement ce qu'il ne faut pas faire — la compromission qui donne
// la base donne alors aussi la clé, et la mesure de réduction tombe en même
// temps que le risque qu'elle réduit. L'espace des numéros mobiles français
// est fermé (2 × 10⁸) : qui détient le poivre reconstitue le journal en une
// fraction de seconde. La rotation mensuelle à deux poivres actifs et le
// gestionnaire de secrets séparé sont l'action n°202 ; la double lecture
// ci-dessous (`CONTACT_POIVRE_PRECEDENT`) en est le point d'accroche, déjà
// posé pour que la rotation ne demande pas de migration de données.

const VERSION_REGLES = "v0-degradee";

function poivreCourant(): string {
  const poivre = process.env.CONTACT_POIVRE;
  if (!poivre) {
    // Volontairement bruyant : un journal écrit sous un poivre vide serait un
    // hachage public, donc une donnée personnelle en clair déguisée.
    throw new Error(
      "CONTACT_POIVRE absent — le journal de mise en relation ne peut pas être écrit sans poivre."
    );
  }
  return poivre;
}

// Poivre du mois précédent (action n°202) : renseigné pendant la rotation, il
// permet de retrouver dans la fenêtre glissante de 30 jours une empreinte
// écrite sous l'ancien poivre. Jamais utilisé pour *écrire* — seul le poivre
// courant est stocké.
export function poivrePrecedent(): string | null {
  return process.env.CONTACT_POIVRE_PRECEDENT ?? null;
}

export function empreinte(identifiant: string, poivre: string): string {
  return createHmac("sha256", poivre).update(identifiant).digest("hex");
}

// Comparaison à temps constant : deux empreintes se comparent avec `===` sans
// danger réel ici (elles ne sont pas secrètes), mais la fonction sert aussi à
// la double recherche de la rotation et l'habitude a un coût nul.
export function memeEmpreinte(a: string, b: string): boolean {
  const ba = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export type SourceEmpreinte = "telephone_verifie" | "compte" | "navigateur";

type IdentiteAcheteur = {
  empreinte: string;
  source: SourceEmpreinte;
  acheteurVerifie: boolean;
  userAgentTronque: string | null;
};

// Détermine l'identité de l'acheteur avec ce qu'on a, et dit ce que ça vaut.
//
// Ordre de préférence — c'est aussi l'ordre de fiabilité décroissante de la
// déduplication de la §5.3 (clé `(empreinte_acheteur, id_vendeur)`) :
//   1. numéro vérifié par OTP  → n'existe pas encore (§5.3 R4, non implémenté)
//   2. compte connecté         → une personne peut ouvrir plusieurs comptes
//   3. IP + user-agent         → ni stable ni unique, à ne jamais lire comme
//                                un acheteur unique (voir §5.3, limite)
export async function identifierAcheteur(userId: string | null): Promise<IdentiteAcheteur> {
  const enTetes = await headers();
  const userAgent = enTetes.get("user-agent");
  const userAgentTronque = userAgent ? userAgent.slice(0, 120) : null;
  const poivre = poivreCourant();

  if (userId) {
    return {
      empreinte: empreinte(`compte:${userId}`, poivre),
      source: "compte",
      // Passera à `true` quand l'OTP de la §5.3 R4 existera — le compteur lira
      // ce champ, pas la présence d'un compte.
      acheteurVerifie: false,
      userAgentTronque,
    };
  }

  const ip = enTetes.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnue";
  return {
    empreinte: empreinte(`navigateur:${ip}|${userAgentTronque ?? ""}`, poivre),
    source: "navigateur",
    acheteurVerifie: false,
    userAgentTronque,
  };
}

type EvenementAEcrire = {
  evenement: "affichage_numero" | "premier_message" | "notification_interet";
  canal: "telephone" | "messagerie" | "formulaire";
  idVendeur: string;
  idAnnonce: string | null;
  vendeurEstPro: boolean;
  identite: IdentiteAcheteur;
  idPreuve?: string | null;
};

// Écrit une ligne du journal. Ne renvoie rien et n'échoue jamais vers
// l'appelant : une mise en relation qui casse parce que la mesure a échoué
// serait un contact perdu (30 € HT, §5.3 R10) pour un octet de statistique.
// L'échec est journalisé côté serveur — c'est le seul cas du projet où perdre
// une observation est préférable à perdre un utilisateur.
export async function enregistrerEvenementContact(ev: EvenementAEcrire): Promise<void> {
  try {
    await db.insert(evenementContact).values({
      evenement: ev.evenement,
      canal: ev.canal,
      idVendeur: ev.idVendeur,
      idAnnonce: ev.idAnnonce,
      vendeurEstPro: ev.vendeurEstPro,
      empreinteAcheteur: ev.identite.empreinte,
      empreinteSource: ev.identite.source,
      acheteurVerifie: ev.identite.acheteurVerifie,
      cleDedup: `${ev.identite.empreinte}:${ev.idVendeur}`,
      idPreuve: ev.idPreuve ?? null,
      userAgentTronque: ev.identite.userAgentTronque,
      versionRegles: VERSION_REGLES,
    });
  } catch (erreur) {
    console.error("[evenement_contact] écriture impossible", erreur);
  }
}
