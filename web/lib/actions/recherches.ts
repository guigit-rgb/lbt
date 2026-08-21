"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { recherchesSauvegardees, type Categorie } from "@/lib/db/schema";

export type RechercheActionResult = { error: string } | { success: true };

export async function sauvegarderRecherche(
  categorie: Categorie,
  filtres: Record<string, string>,
  tri: string
): Promise<RechercheActionResult> {
  const session = await auth();
  if (!session?.user.id) {
    return { error: "Vous devez être connecté pour sauvegarder une recherche." };
  }

  await db.insert(recherchesSauvegardees).values({ userId: session.user.id, categorie, filtres, tri });

  revalidatePath("/compte/recherches");
  return { success: true };
}

export async function supprimerRecherche(id: string): Promise<RechercheActionResult> {
  const session = await auth();
  if (!session?.user.id) {
    return { error: "Vous devez être connecté." };
  }

  await db
    .delete(recherchesSauvegardees)
    .where(and(eq(recherchesSauvegardees.id, id), eq(recherchesSauvegardees.userId, session.user.id)));

  revalidatePath("/compte/recherches");
  return { success: true };
}
