"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

export type ProfilActionResult = { error: string } | { success: true };

// Statut "compte professionnel" auto-déclaré : le SIRET n'est vérifié
// auprès d'aucun registre officiel, seulement validé en forme (14 chiffres).
// Le téléphone est facultatif et sert au bouton "Voir le numéro" de la page
// de détail — un vendeur qui ne le renseigne pas n'affiche simplement pas ce
// bouton (pas de valeur bidon à masquer).
export async function mettreAJourProfilPro(formData: FormData): Promise<ProfilActionResult> {
  const session = await auth();
  if (!session?.user.id) {
    return { error: "Vous devez être connecté." };
  }

  const estPro = formData.get("estPro") === "on";
  const siretBrut = formData.get("siret");
  const siret = typeof siretBrut === "string" ? siretBrut.replace(/\s/g, "") : "";

  if (estPro && !/^\d{14}$/.test(siret)) {
    return { error: "Le SIRET doit contenir 14 chiffres." };
  }

  const telephoneBrut = formData.get("telephone");
  const telephoneSaisi = typeof telephoneBrut === "string" ? telephoneBrut.replace(/[\s.-]/g, "") : "";
  if (telephoneSaisi && !/^0\d{9}$/.test(telephoneSaisi)) {
    return { error: "Le numéro de téléphone doit être un numéro français à 10 chiffres." };
  }

  await db
    .update(users)
    .set({ estPro, siret: estPro ? siret : null, telephone: telephoneSaisi || null })
    .where(eq(users.id, session.user.id));

  revalidatePath("/compte/profil");
  return { success: true };
}
