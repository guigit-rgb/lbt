"use server";

import { eq, sql } from "drizzle-orm";
import { hash } from "bcryptjs";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { envoyerEmail } from "@/lib/email/envoi";
import { lienAbsolu } from "@/lib/email/lien";
import { motDePasseOublie, verificationAdresse } from "@/lib/email/messages";
import {
  VALIDITE_REINITIALISATION_MINUTES,
  VALIDITE_VERIFICATION_HEURES,
  consommerJeton,
  emettreJeton,
  revoquerJetons,
} from "@/lib/jetons-email";

export type ResultatMotDePasse = { error: string } | { success: true; message: string };

/**
 * Demande de réinitialisation (§14.11, action §17 n°211, message n°1).
 *
 * RÉPONSE TOUJOURS IDENTIQUE, que l'adresse existe ou non. C'est la règle qui
 * empêche ce formulaire d'être un oracle d'existence de compte : à raison de
 * quelques milliers de requêtes, un « aucun compte avec cette adresse » permet
 * de reconstituer la liste des inscrits — et sur un site d'annonces, savoir
 * *qui* est inscrit a une valeur commerciale immédiate pour un concurrent.
 * Corollaire à ne pas oublier : le message de succès ne doit rien promettre de
 * faux non plus, d'où « si un compte existe ».
 */
export async function demanderReinitialisation(formData: FormData): Promise<ResultatMotDePasse> {
  const email = formData.get("email");
  if (typeof email !== "string" || !email.trim()) {
    return { error: "Merci de renseigner votre adresse e-mail." };
  }

  const succes = {
    success: true as const,
    message:
      "Si un compte existe avec cette adresse, un lien de réinitialisation vient d'y être envoyé. Vérifiez aussi vos indésirables.",
  };

  // Recherche insensible à la casse, et c'est une correction et non un
  // raffinement : l'inscription (`lib/actions/auth.ts`) enregistre l'adresse
  // telle qu'elle a été saisie, sans repli en minuscules. Un compte créé avec
  // « Nicolas@retro.fr » et une demande tapée « nicolas@retro.fr » ne se
  // rejoindraient jamais — et comme cette action répond la même chose dans
  // tous les cas (voir ci-dessus), l'utilisateur n'aurait aucun moyen de
  // comprendre pourquoi rien n'arrive. Normaliser à l'inscription serait le
  // vrai remède ; il touche l'unicité de la colonne et sort du périmètre de
  // l'action n°211 → action n°243.
  const saisie = email.trim().toLowerCase();
  const [compte] = await db
    .select({ id: users.id, email: users.email, displayName: users.displayName })
    .from(users)
    .where(sql`lower(${users.email}) = ${saisie}`)
    .limit(1);

  if (!compte) return succes;

  // Une nouvelle demande annule les précédentes : sinon, un lien intercepté la
  // semaine dernière resterait valable pendant sa fenêtre alors que le
  // titulaire vient d'en demander un autre.
  await revoquerJetons(compte.id, "reinitialisation");
  const jeton = await emettreJeton(compte.id, "reinitialisation");

  // Attendu, pas détaché : l'écran affiche « c'est envoyé », il ne doit pas le
  // dire avant que l'envoi ait été au moins tenté (§14.11 R6).
  await envoyerEmail({
    destinataire: compte.email,
    nomDestinataire: compte.displayName,
    message: motDePasseOublie({
      lien: lienAbsolu(`/compte/reinitialiser?jeton=${encodeURIComponent(jeton)}`),
      validiteMinutes: VALIDITE_REINITIALISATION_MINUTES,
    }),
  });

  return succes;
}

export async function reinitialiser(formData: FormData): Promise<ResultatMotDePasse> {
  const jeton = formData.get("jeton");
  const motDePasse = formData.get("password");
  const confirmation = formData.get("passwordConfirmation");

  if (typeof jeton !== "string" || !jeton) {
    return { error: "Lien invalide. Recommencez la demande depuis « mot de passe oublié »." };
  }
  if (typeof motDePasse !== "string" || motDePasse.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }
  if (motDePasse !== confirmation) {
    return { error: "Les deux mots de passe ne correspondent pas." };
  }

  const resultat = await consommerJeton(jeton, "reinitialisation");
  if (!resultat.valide) {
    const motifs = {
      inconnu: "Ce lien n'est pas valide.",
      expire: `Ce lien a expiré (il est valable ${VALIDITE_REINITIALISATION_MINUTES} minutes).`,
      deja_utilise: "Ce lien a déjà servi.",
    } as const;
    return { error: `${motifs[resultat.motif]} Demandez-en un nouveau depuis « mot de passe oublié ».` };
  }

  await db
    .update(users)
    .set({ passwordHash: await hash(motDePasse, 12) })
    .where(eq(users.id, resultat.userId));

  return { success: true, message: "Mot de passe modifié. Vous pouvez vous connecter." };
}

// --- Vérification d'adresse (message n°4) -----------------------------------

export async function envoyerVerificationAdresse(userId: string, email: string, nom: string): Promise<void> {
  const jeton = await emettreJeton(userId, "verification");
  await envoyerEmail({
    destinataire: email,
    nomDestinataire: nom,
    message: verificationAdresse({
      lien: lienAbsolu(`/compte/verifier?jeton=${encodeURIComponent(jeton)}`),
      validiteHeures: VALIDITE_VERIFICATION_HEURES,
    }),
  });
}

export type ResultatVerification = { verifie: true } | { verifie: false; motif: string };

export async function verifierAdresse(jeton: string): Promise<ResultatVerification> {
  const resultat = await consommerJeton(jeton, "verification");
  if (!resultat.valide) {
    const motifs = {
      inconnu: "Ce lien de confirmation n'est pas valide.",
      expire: `Ce lien de confirmation a expiré (il est valable ${VALIDITE_VERIFICATION_HEURES} heures).`,
      deja_utilise: "Cette adresse a déjà été confirmée.",
    } as const;
    return { verifie: false, motif: motifs[resultat.motif] };
  }

  await db.update(users).set({ emailVerifieA: new Date() }).where(eq(users.id, resultat.userId));
  return { verifie: true };
}
