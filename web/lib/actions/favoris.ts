"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { favoris } from "@/lib/db/schema";

export type BasculerFavoriResult = { error: string } | { success: true; favori: boolean };

// Ajoute ou retire l'annonce des favoris du compte connecté — un simple
// bascule, la table `favoris` (userId, annonceId) existait déjà en base
// sans jamais avoir été alimentée.
export async function basculerFavori(annonceId: string): Promise<BasculerFavoriResult> {
  const session = await auth();
  if (!session?.user.id) {
    return { error: "Vous devez être connecté pour ajouter un favori." };
  }

  const [existant] = await db
    .select({ userId: favoris.userId })
    .from(favoris)
    .where(and(eq(favoris.userId, session.user.id), eq(favoris.annonceId, annonceId)))
    .limit(1);

  if (existant) {
    await db.delete(favoris).where(and(eq(favoris.userId, session.user.id), eq(favoris.annonceId, annonceId)));
    revalidatePath("/compte/favoris");
    return { success: true, favori: false };
  }

  await db.insert(favoris).values({ userId: session.user.id, annonceId });
  revalidatePath("/compte/favoris");
  return { success: true, favori: true };
}
