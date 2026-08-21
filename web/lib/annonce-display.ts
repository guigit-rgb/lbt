import { and, eq, gt, inArray, isNull, or, type SQL } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { annonceImages, annonces } from "@/lib/db/schema";
import type { FakeAd } from "@/lib/fake-data";

export type AnnonceRow = typeof annonces.$inferSelect;
export type EtatAnnonce = AnnonceRow["etat"];

// Libellés des sept états, en un seul endroit. Les trois fins de vie de
// l'auteur/de l'horloge ne doivent surtout pas emprunter le vocabulaire de la
// décision de modération (§6.6 Résultat n°0) : un vendeur qui retire son
// annonce ne lit pas « retirée » comme le lecteur d'une sanction.
const LIBELLES_ETAT: Record<EtatAnnonce, string> = {
  brouillon: "brouillon",
  en_ligne: "en ligne",
  en_pause: "en pause",
  vendue: "vendue",
  retiree_par_auteur: "retirée par son auteur",
  expiree: "expirée",
  retiree: "retirée par LBT",
};

export function libelleEtat(etat: EtatAnnonce): string {
  return LIBELLES_ETAT[etat];
}

// Une annonce en fin de vie ne revient pas en ligne.
export const ETATS_FIN_DE_VIE: readonly EtatAnnonce[] = [
  "vendue",
  "retiree_par_auteur",
  "expiree",
  "retiree",
];

export function estFinDeVie(etat: EtatAnnonce): boolean {
  return ETATS_FIN_DE_VIE.includes(etat);
}

// Condition unique de visibilité publique d'une annonce, à utiliser dans
// TOUTES les requêtes de catalogue. `etat = 'en_ligne'` ne suffit pas : aucune
// horloge n'écrit encore `expiree` (l'échéance n'était vérifiée qu'à
// l'affichage de « Mes annonces »), si bien qu'une annonce dépassée restait
// listée et indexable. Le jour où le travail d'expiration existera, cette
// condition restera juste — elle sera seulement redondante.
export function annonceVisiblePublic(): SQL | undefined {
  return and(
    eq(annonces.etat, "en_ligne"),
    or(isNull(annonces.expiresAt), gt(annonces.expiresAt, new Date()))
  );
}

export function formatPrix(prixCents: number | null): string {
  if (prixCents == null) return "Prix sur demande";
  return `${(prixCents / 100).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`;
}

export function formatFraicheur(createdAt: Date): string {
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

export interface AdRowSpec {
  label: string;
  value: string;
}

export interface AdRowData {
  id: string;
  titre: string;
  prixLabel: string;
  fraicheur: string;
  photoUrl?: string;
  thumbClass: string;
  ville: string | null;
  vendeurNom: string;
  specs: AdRowSpec[];
}

// Caractéristiques affichées en grille sous le prix, sur le modèle de la page
// de résultats leboncoin (Année/Kilométrage/Énergie/Boîte pour un véhicule).
// Différent de `sousLigne` (une seule ligne condensée, utilisée par la carte
// compacte de l'accueil) : ici chaque caractéristique reste un champ à part.
function specsListe(row: AnnonceRow): AdRowSpec[] {
  if (row.categorie === "vehicules") {
    const specs: AdRowSpec[] = [];
    if (row.annee) specs.push({ label: "Année", value: String(row.annee) });
    if (row.kilometrage != null) {
      specs.push({ label: "Kilométrage", value: `${row.kilometrage.toLocaleString("fr-FR")} km` });
    }
    const attributs = row.attributs as Record<string, string>;
    if (attributs.carburant) specs.push({ label: "Énergie", value: attributs.carburant });
    if (attributs.boite) specs.push({ label: "Boîte de vitesse", value: attributs.boite });
    return specs;
  }
  if (row.categorie === "loisirs") {
    const specs: AdRowSpec[] = [];
    if (row.sousCategorie) specs.push({ label: "Catégorie", value: row.sousCategorie });
    if (row.etatProduit) specs.push({ label: "État", value: row.etatProduit });
    return specs;
  }
  if (row.categorie === "animaux" && row.typeAnimal) {
    return [{ label: "Type", value: row.typeAnimal }];
  }
  return [];
}

// Convertit une ligne réelle vers la forme attendue par <AdRow> — la vue en
// liste détaillée d'une page de résultats par catégorie (par opposition à
// <AdCard>, la vignette compacte utilisée sur l'accueil).
export function annonceToRowData(row: AnnonceRow, coverUrl: string | undefined, vendeurNom: string): AdRowData {
  const titre =
    row.categorie === "vehicules" && row.marque
      ? `${row.marque} ${row.modele ?? ""}`.trim() + (row.annee ? ` — ${row.annee}` : "")
      : row.titre;

  return {
    id: row.id,
    titre: titre || row.titre,
    prixLabel: formatPrix(row.prixCents),
    fraicheur: formatFraicheur(row.createdAt),
    photoUrl: coverUrl,
    thumbClass: "ic-teapot",
    ville: row.ville,
    vendeurNom,
    specs: specsListe(row),
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
