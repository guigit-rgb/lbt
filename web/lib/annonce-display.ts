import type { annonces } from "@/lib/db/schema";
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
export function annonceToCardData(row: AnnonceRow): FakeAd {
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
    badges: row.categorie === "loisirs" && row.avisExpert ? [{ label: "Avis d'expert", variant: "expert" }] : undefined,
  };
}
