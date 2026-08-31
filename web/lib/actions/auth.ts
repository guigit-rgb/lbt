"use server";

import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { CredentialsSignin } from "next-auth";
import { db } from "@/lib/db/client";
import { users, invites } from "@/lib/db/schema";
import { signIn } from "@/lib/auth";
import { envoyerVerificationAdresse } from "@/lib/actions/mot-de-passe";

export type AuthActionResult = { error: string } | { success: true };

export async function signup(formData: FormData): Promise<AuthActionResult> {
  const email = formData.get("email");
  const password = formData.get("password");
  const displayName = formData.get("displayName");
  const inviteCode = formData.get("inviteCode");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof displayName !== "string" ||
    typeof inviteCode !== "string" ||
    !email.trim() ||
    !displayName.trim() ||
    !inviteCode.trim()
  ) {
    return { error: "Merci de remplir tous les champs." };
  }

  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  const [invite] = await db
    .select()
    .from(invites)
    .where(eq(invites.code, inviteCode.trim()))
    .limit(1);
  if (!invite) {
    return { error: "Code d'invitation invalide." };
  }

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email.trim()))
    .limit(1);
  if (existing) {
    return { error: "Un compte existe déjà avec cet email." };
  }

  const passwordHash = await hash(password, 12);

  const [cree] = await db
    .insert(users)
    .values({
      email: email.trim(),
      passwordHash,
      displayName: displayName.trim(),
    })
    .returning({ id: users.id });

  // Confirmation d'adresse (§14.11, message n°4). Enveloppé : une inscription
  // ne doit pas échouer parce que l'expéditeur d'e-mails est indisponible. Le
  // compte existe déjà à ce stade, et l'écran de profil permet de redemander
  // le message — perdre l'inscription serait sans commune mesure.
  try {
    await envoyerVerificationAdresse(cree.id, email.trim(), displayName.trim());
  } catch (err) {
    console.error(`[inscription] confirmation d'adresse non envoyée : ${String(err)}`);
  }

  try {
    await signIn("credentials", {
      email: email.trim(),
      password,
      redirectTo: "/compte/annonces",
    });
    return { success: true };
  } catch (err) {
    if (err instanceof CredentialsSignin) {
      return { error: "Compte créé, mais la connexion automatique a échoué. Connectez-vous manuellement." };
    }
    throw err;
  }
}

export async function login(formData: FormData): Promise<AuthActionResult> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    return { error: "Merci de renseigner votre email et votre mot de passe." };
  }

  try {
    await signIn("credentials", {
      email: email.trim(),
      password,
      redirectTo: "/compte/annonces",
    });
    return { success: true };
  } catch (err) {
    if (err instanceof CredentialsSignin) {
      return { error: "Email ou mot de passe incorrect." };
    }
    throw err;
  }
}
