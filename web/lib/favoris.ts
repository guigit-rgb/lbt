import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { annonces, favoris } from "@/lib/db/schema";
import { annonceToCardData, annonceVisiblePublic, getCoverUrls } from "@/lib/annonce-display";
import type { FakeAd } from "@/lib/fake-data";

// Identifiants des annonces qu'un compte a mises en favori — pour savoir
// quel cœur afficher plein sur une grille sans requête par annonce.
export async function listerFavorisIds(userId: string): Promise<Set<string>> {
  const rows = await db.select({ annonceId: favoris.annonceId }).from(favoris).where(eq(favoris.userId, userId));
  return new Set(rows.map((r) => r.annonceId));
}

// Annonces favorites encore visibles publiquement — une annonce retirée ou
// vendue disparaît de la liste plutôt que d'y laisser un lien mort ; le
// favori en base n'est pas supprimé pour autant (l'auteur pourrait la
// remettre en ligne).
export async function listerAnnoncesFavorites(userId: string): Promise<FakeAd[]> {
  const ids = await db.select({ annonceId: favoris.annonceId }).from(favoris).where(eq(favoris.userId, userId));
  if (ids.length === 0) return [];

  const rows = await db
    .select()
    .from(annonces)
    .where(and(inArray(annonces.id, ids.map((r) => r.annonceId)), annonceVisiblePublic()))
    .orderBy(desc(annonces.createdAt));

  const covers = await getCoverUrls(rows.map((r) => r.id));
  return rows.map((r) => annonceToCardData(r, covers.get(r.id)));
}
