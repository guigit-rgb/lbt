/**
 * Jetons envoyés par courriel (cahier des charges §14.11 Résultat n°8,
 * action §17 n°211).
 *
 * DEUX MÉCANISMES, ET LE CHOIX ENTRE LES DEUX N'EST PAS UNE QUESTION DE GOÛT :
 *
 *  - **Jeton stocké** (réinitialisation de mot de passe, confirmation
 *    d'adresse) : il faut pouvoir le révoquer, ne l'accepter qu'une fois, et
 *    dire à l'utilisateur *pourquoi* son lien ne marche plus. Ces trois
 *    propriétés supposent un état en base.
 *  - **Jeton signé** (désabonnement d'une alerte) : la RFC 8058 impose que la
 *    désinscription en un clic fonctionne **sans session et sans page
 *    intermédiaire** — le fournisseur de messagerie appelle l'URL lui-même,
 *    en `POST`, depuis ses serveurs. Un jeton stocké obligerait à écrire une
 *    ligne par alerte et par envoi ; une signature HMAC du seul identifiant
 *    d'alerte n'a aucun état, ne périme pas (un désabonnement doit marcher
 *    six mois après réception) et se vérifie en une comparaison.
 */

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { jetonsEmail } from "@/lib/db/schema";

export const VALIDITE_REINITIALISATION_MINUTES = 30;
export const VALIDITE_VERIFICATION_HEURES = 48;

export type UsageJeton = "reinitialisation" | "verification";

function empreinteJeton(jeton: string): string {
  return createHash("sha256").update(jeton).digest("hex");
}

/**
 * Émet un jeton et rend sa valeur **en clair** — la seule fois où elle existe.
 * L'appelant la met dans un lien et l'oublie.
 */
export async function emettreJeton(userId: string, usage: UsageJeton): Promise<string> {
  const jeton = randomBytes(32).toString("base64url");
  const dureeMs =
    usage === "reinitialisation"
      ? VALIDITE_REINITIALISATION_MINUTES * 60_000
      : VALIDITE_VERIFICATION_HEURES * 3_600_000;

  await db.insert(jetonsEmail).values({
    userId,
    usage,
    empreinte: empreinteJeton(jeton),
    expireA: new Date(Date.now() + dureeMs),
  });

  return jeton;
}

export type ResultatJeton =
  | { valide: true; userId: string }
  | { valide: false; motif: "inconnu" | "expire" | "deja_utilise" };

/**
 * Consomme un jeton : le valide **et** le marque utilisé dans le même appel.
 * Les deux gestes ne sont pas séparés parce qu'un appelant qui oublierait le
 * second transformerait un jeton à usage unique en jeton permanent.
 *
 * La mise à jour est conditionnée par `utilise_a IS NULL` et l'affectation est
 * confirmée par `returning` : deux requêtes concurrentes présentant le même
 * jeton (double clic, préchargement de lien par un antivirus de messagerie)
 * ne peuvent pas réussir toutes les deux.
 */
export async function consommerJeton(jeton: string, usage: UsageJeton): Promise<ResultatJeton> {
  const empreinte = empreinteJeton(jeton);

  const [ligne] = await db
    .select({
      id: jetonsEmail.id,
      userId: jetonsEmail.userId,
      expireA: jetonsEmail.expireA,
      utiliseA: jetonsEmail.utiliseA,
    })
    .from(jetonsEmail)
    .where(and(eq(jetonsEmail.empreinte, empreinte), eq(jetonsEmail.usage, usage)))
    .limit(1);

  if (!ligne) return { valide: false, motif: "inconnu" };
  if (ligne.utiliseA) return { valide: false, motif: "deja_utilise" };
  if (ligne.expireA.getTime() < Date.now()) return { valide: false, motif: "expire" };

  const affectees = await db
    .update(jetonsEmail)
    .set({ utiliseA: new Date() })
    .where(and(eq(jetonsEmail.id, ligne.id), isNull(jetonsEmail.utiliseA)))
    .returning({ id: jetonsEmail.id });

  if (affectees.length === 0) return { valide: false, motif: "deja_utilise" };
  return { valide: true, userId: ligne.userId };
}

/**
 * Invalide les jetons encore ouverts d'un usage donné. Appelée après une
 * réinitialisation réussie : les demandes précédentes, y compris celles d'un
 * attaquant qui aurait déclenché l'envoi, cessent d'être exploitables.
 */
export async function revoquerJetons(userId: string, usage: UsageJeton): Promise<void> {
  await db
    .update(jetonsEmail)
    .set({ utiliseA: new Date() })
    .where(and(eq(jetonsEmail.userId, userId), eq(jetonsEmail.usage, usage), isNull(jetonsEmail.utiliseA)));
}

// --- Désabonnement : signature sans état -----------------------------------

function secretDesabonnement(): string {
  // Repli sur le poivre du journal de contacts plutôt que sur une constante :
  // une signature à secret vide n'est pas une signature, et un environnement
  // qui a l'un a très probablement l'autre. Si les deux manquent, la fonction
  // lève — un lien de désabonnement non vérifiable serait pire que pas de lien
  // du tout (n'importe qui désabonnerait n'importe qui).
  const secret = process.env.EMAIL_SECRET_DESABONNEMENT ?? process.env.CONTACT_POIVRE;
  if (!secret) {
    throw new Error(
      "EMAIL_SECRET_DESABONNEMENT absent — aucun lien de désabonnement ne peut être signé."
    );
  }
  return secret;
}

export function signerDesabonnement(rechercheId: string): string {
  return createHmac("sha256", secretDesabonnement()).update(`alerte:${rechercheId}`).digest("hex");
}

export function verifierDesabonnement(rechercheId: string, signature: string): boolean {
  let attendue: string;
  try {
    attendue = signerDesabonnement(rechercheId);
  } catch {
    return false;
  }
  const a = Buffer.from(attendue, "hex");
  const b = Buffer.from(signature, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}
