import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { annonceImages, type annonces } from "@/lib/db/schema";
import type { FakeAd } from "@/lib/fake-data";

export type AnnonceRow = typeof annonces.$inferSelect;

function formatPrix(prixCents: number | null): string {
  if (prixCents == null) return "Prix sur demande";
  return `${(prixCents / 100).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`;
}

function formatFraicheur(createdAt: Date): string {
  const days = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Auj.";
  if (days === 1) return "1 j.";
  return `${days} j.`;
}

function sousLigne(row: AnnonceRow): string {
  const parts: string[] = [];
  if (row.categorie === "vehicules" && row.kilometrage != null) {
    parts.push(`${row.kilometrage.toLocaleString("fr-FR")} km`);
  } else if (row.categorie === "loisirs" && row.sousCategorie) {
    parts.push(row.sousCategorie);
  } else if (row.categorie === "animaux" && row.typeAnimal) {
    parts.push(row.typeAnimal);
  }
  if (row.ville) parts.push(row.ville);
  return parts.join(" · ") || "France";
}

// Convertit une ligne réelle `annonces` vers la même forme que `FakeAd`,
// pour que <AdCard> reste inchangé quelle que soit la source des données.
// `coverUrl` (photo de couverture réelle, position 0 dans annonce_images) est
// facultatif : quand l'annonce n'a pas encore de photo, on retombe sur
// l'icône générique `ic-teapot` plutôt que de casser l'affichage.
export function annonceToCardData(row: AnnonceRow, coverUrl?: string | null): FakeAd {
  const titre =
    row.categorie === "vehicules" && row.marque
      ? `${row.marque} ${row.modele ?? ""}`.trim() + (row.annee ? ` — ${row.annee}` : "")
      : row.titre;

  return {
    id: row.id,
    categorie: row.categorie,
    titre: titre || row.titre,
    sousLigne: sousLigne(row),
    prixLabel: formatPrix(row.prixCents),
    fraicheur: formatFraicheur(row.createdAt),
    thumbClass: "ic-teapot",
    photoUrl: coverUrl ?? undefined,
    badges: row.categorie === "loisirs" && row.avisExpert ? [{ label: "Avis d'expert", variant: "expert" }] : undefined,
  };
}

// Photo de couverture (position 0) de chaque annonce, en une seule requête
// groupée — à utiliser avant `annonceToCardData` pour les listes.
export async function getCoverUrls(ids: string[]): Promise<Map<string, string>> {
  if (ids.length === 0) return new Map();
  const rows = await db
    .select({ annonceId: annonceImages.annonceId, url: annonceImages.urlThumb })
    .from(annonceImages)
    .where(and(inArray(annonceImages.annonceId, ids), eq(annonceImages.position, 0)));
  return new Map(rows.filter((r): r is { annonceId: string; url: string } => !!r.url).map((r) => [r.annonceId, r.url]));
}
