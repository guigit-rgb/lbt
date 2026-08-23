import { and, desc, eq, gt, inArray, isNull, ne, or, type SQL } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { annonceImages, annonces } from "@/lib/db/schema";
import type { FakeAd } from "@/lib/fake-data";
import { getFiltersForCategory } from "@/lib/listing-config";

// Clés déjà affichées à part (sous_categorie, état) ou qui ne sont pas des
// caractéristiques du bien (localisation, prix) — à exclure du fallback
// générique ci-dessous pour ne pas les répéter.
const CLES_GENERIQUES_EXCLUES = new Set(["localisation", "prix", "sous_categorie", "etat_produit"]);

// Caractéristiques d'une annonce des ~50 sous-catégories génériques
// (Matériel pro, Électronique, Emploi, Mode, Maison & Jardin, Famille,
// Services, Animaux, Locations de vacances) à partir de `attributs` et des
// libellés déjà définis dans lib/subcategory-filters.ts — pas de bloc dédié
// par sous-catégorie comme pour Véhicules/Immobilier, pour les mêmes raisons
// que components/AttributsDynamiques.tsx côté dépôt.
function attributsGeneriquesAffiches(row: AnnonceRow): { label: string; value: string }[] {
  const config = getFiltersForCategory(row.categorie, row.sousCategorie ?? undefined);
  const attributs = row.attributs as Record<string, string | string[]>;
  const specs: { label: string; value: string }[] = [];
  for (const field of config.filters) {
    if (CLES_GENERIQUES_EXCLUES.has(field.key)) continue;
    const valeur = attributs[field.key];
    if (!valeur || (Array.isArray(valeur) && valeur.length === 0)) continue;
    specs.push({ label: field.label, value: Array.isArray(valeur) ? valeur.join(", ") : valeur });
  }
  return specs;
}

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

// Annonce urgente (§5 Résultat n°6) : badge + critère de recherche, jamais un
// effet sur `_eval()`/`sort_by` (§14.2/§14.4) — voir lib/annonce-filters.ts.
export function estUrgente(row: Pick<AnnonceRow, "urgentJusqua">): boolean {
  return row.urgentJusqua != null && row.urgentJusqua.getTime() > Date.now();
}

function sousLigne(row: AnnonceRow): string {
  const parts: string[] = [];
  if (row.categorie === "vehicules" && row.kilometrage != null) {
    parts.push(`${row.kilometrage.toLocaleString("fr-FR")} km`);
  } else if (row.categorie === "loisirs" && row.sousCategorie) {
    parts.push(row.sousCategorie);
  } else if (row.categorie === "animaux" && row.typeAnimal) {
    parts.push(row.typeAnimal);
  } else if (row.categorie === "immobilier") {
    const attributs = row.attributs as Record<string, string>;
    if (attributs.typeBien) parts.push(attributs.typeBien);
    if (attributs.surfaceHabitable) parts.push(`${attributs.surfaceHabitable} m²`);
  } else if (row.sousCategorie) {
    parts.push(row.sousCategorie);
  }
  if (row.ville) parts.push(row.ville);
  return parts.join(" · ") || "France";
}

// Convertit une ligne réelle `annonces` vers la même forme que `FakeAd`,
// pour que <AdCard> reste inchangé quelle que soit la source des données.
// `coverUrl` (photo de couverture réelle, position 0 dans annonce_images) est
// facultatif : quand l'annonce n'a pas encore de photo, on retombe sur
// l'icône générique `ic-teapot` plutôt que de casser l'affichage.
export function annonceToCardData(row: AnnonceRow, coverUrl?: string | null, estFavori = false): FakeAd {
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
    favori: estFavori,
    thumbClass: "ic-teapot",
    photoUrl: coverUrl ?? undefined,
    badges: [
      estUrgente(row) ? { label: "Urgent", variant: "urgent" as const } : undefined,
      row.categorie === "loisirs" && row.avisExpert ? { label: "Avis d'expert", variant: "expert" as const } : undefined,
    ].filter((b): b is { label: string; variant: "urgent" | "expert" } => b !== undefined),
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
  estFavori: boolean;
  urgent: boolean;
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
  if (row.categorie === "immobilier") {
    const specs: AdRowSpec[] = [];
    const attributs = row.attributs as Record<string, string>;
    if (attributs.typeBien) specs.push({ label: "Type", value: attributs.typeBien });
    if (attributs.surfaceHabitable) specs.push({ label: "Surface", value: `${attributs.surfaceHabitable} m²` });
    if (attributs.pieces) specs.push({ label: "Pièces", value: attributs.pieces });
    return specs;
  }
  const specs: AdRowSpec[] = [];
  if (row.sousCategorie) specs.push({ label: "Catégorie", value: row.sousCategorie });
  if (row.etatProduit) specs.push({ label: "État", value: row.etatProduit });
  return specs.length > 0 ? specs : attributsGeneriquesAffiches(row).slice(0, 2);
}

// Convertit une ligne réelle vers la forme attendue par <AdRow> — la vue en
// liste détaillée d'une page de résultats par catégorie (par opposition à
// <AdCard>, la vignette compacte utilisée sur l'accueil).
export function annonceToRowData(
  row: AnnonceRow,
  coverUrl: string | undefined,
  vendeurNom: string,
  estFavori = false
): AdRowData {
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
    estFavori,
    urgent: estUrgente(row),
  };
}

export interface AdDetailSpec {
  icon: string;
  label: string;
  value: string;
}

// Grille « Les informations clés » de la page de détail — sur le modèle de
// leboncoin (icône + libellé + valeur). Volontairement distinct de
// `specsListe` : la page de détail affiche marque/modèle (déjà repris dans le
// titre de la vignette compacte, donc redondant là-bas) en plus des
// caractéristiques déjà listées pour la vue en liste.
export function detailInformationsCles(row: AnnonceRow): AdDetailSpec[] {
  if (row.categorie === "vehicules") {
    const specs: AdDetailSpec[] = [];
    if (row.marque) specs.push({ icon: "🚗", label: "Marque", value: row.marque });
    if (row.modele) specs.push({ icon: "🏷️", label: "Modèle", value: row.modele });
    if (row.annee) specs.push({ icon: "📅", label: "Année", value: String(row.annee) });
    if (row.kilometrage != null) {
      specs.push({ icon: "🛣️", label: "Kilométrage", value: `${row.kilometrage.toLocaleString("fr-FR")} km` });
    }
    const attributs = row.attributs as Record<string, string>;
    if (attributs.carburant) specs.push({ icon: "⛽", label: "Énergie", value: attributs.carburant });
    if (attributs.boite) specs.push({ icon: "⚙️", label: "Boîte de vitesse", value: attributs.boite });
    if (attributs.typeVehicule) specs.push({ icon: "🚙", label: "Type de véhicule", value: attributs.typeVehicule });
    if (attributs.etatVehicule) specs.push({ icon: "🔧", label: "État du véhicule", value: attributs.etatVehicule });
    if (attributs.portes) specs.push({ icon: "🚪", label: "Nombre de portes", value: attributs.portes });
    if (attributs.places) specs.push({ icon: "💺", label: "Nombre de places", value: attributs.places });
    if (attributs.miseEnCirculation) {
      specs.push({ icon: "📆", label: "Mise en circulation", value: attributs.miseEnCirculation });
    }
    if (attributs.controleTechnique) {
      specs.push({ icon: "🛠️", label: "Contrôle technique valide jusqu'à", value: attributs.controleTechnique });
    }
    if (attributs.couleur) specs.push({ icon: "🎨", label: "Couleur", value: attributs.couleur });
    if (attributs.sellerie) specs.push({ icon: "🪑", label: "Sellerie", value: attributs.sellerie });
    if (attributs.puissanceFiscale) {
      specs.push({ icon: "🐎", label: "Puissance fiscale", value: `${attributs.puissanceFiscale} CV` });
    }
    if (attributs.puissanceDin) {
      specs.push({ icon: "🏎️", label: "Puissance DIN", value: `${attributs.puissanceDin} ch` });
    }
    if (attributs.permis) specs.push({ icon: "🪪", label: "Permis", value: attributs.permis });
    if (attributs.equipements) specs.push({ icon: "🧩", label: "Équipements", value: attributs.equipements });
    return specs;
  }
  if (row.categorie === "loisirs") {
    const specs: AdDetailSpec[] = [];
    if (row.sousCategorie) specs.push({ icon: "🏷️", label: "Catégorie", value: row.sousCategorie });
    if (row.etatProduit) specs.push({ icon: "✅", label: "État", value: row.etatProduit });
    return specs;
  }
  if (row.categorie === "animaux" && row.typeAnimal) {
    return [{ icon: "🐾", label: "Type", value: row.typeAnimal }];
  }
  if (row.categorie === "immobilier") {
    const specs: AdDetailSpec[] = [];
    const attributs = row.attributs as Record<string, string | string[]>;
    const texte = attributs as Record<string, string>;
    if (texte.typeBien) specs.push({ icon: "🏠", label: "Type de bien", value: texte.typeBien });
    if (texte.typeVente) specs.push({ icon: "📜", label: "Type de vente", value: texte.typeVente });
    if (texte.surfaceHabitable) specs.push({ icon: "📐", label: "Surface habitable", value: `${texte.surfaceHabitable} m²` });
    if (texte.surfaceTerrain) specs.push({ icon: "🌳", label: "Surface du terrain", value: `${texte.surfaceTerrain} m²` });
    if (texte.pieces) specs.push({ icon: "🚪", label: "Pièces", value: texte.pieces });
    if (texte.chambres) specs.push({ icon: "🛏️", label: "Chambres", value: texte.chambres });
    if (texte.etage) specs.push({ icon: "🏢", label: "Étage", value: texte.etage });
    if (texte.ascenseur === "1") specs.push({ icon: "🛗", label: "Ascenseur", value: "Oui" });
    if (texte.exposition) specs.push({ icon: "🧭", label: "Exposition", value: texte.exposition });
    if (texte.etatBien) specs.push({ icon: "✅", label: "État du bien", value: texte.etatBien });
    if (texte.dpe) specs.push({ icon: "⚡", label: "Classe énergie (DPE)", value: texte.dpe });
    if (Array.isArray(attributs.exterieur) && attributs.exterieur.length > 0) {
      specs.push({ icon: "🌿", label: "Extérieur", value: attributs.exterieur.join(", ") });
    }
    if (Array.isArray(attributs.caracteristiques) && attributs.caracteristiques.length > 0) {
      specs.push({ icon: "🧩", label: "Caractéristiques", value: attributs.caracteristiques.join(", ") });
    }
    return specs;
  }
  const specs: AdDetailSpec[] = [];
  if (row.sousCategorie) specs.push({ icon: "🏷️", label: "Sous-catégorie", value: row.sousCategorie });
  if (row.etatProduit) specs.push({ icon: "✅", label: "État", value: row.etatProduit });
  specs.push(...attributsGeneriquesAffiches(row).map((s) => ({ icon: "•", ...s })));
  return specs;
}

// Autres annonces en ligne du même vendeur (hors annonce courante) — pour la
// section « Vendu par » de la page de détail, sur le modèle du bloc
// « Les annonces de ce pro » de leboncoin.
export async function getAutresAnnoncesVendeur(userId: string, excludeId: string, limite = 4): Promise<FakeAd[]> {
  const rows = await db
    .select()
    .from(annonces)
    .where(and(eq(annonces.userId, userId), annonceVisiblePublic(), ne(annonces.id, excludeId)))
    .orderBy(desc(annonces.createdAt))
    .limit(limite);
  const covers = await getCoverUrls(rows.map((r) => r.id));
  return rows.map((r) => annonceToCardData(r, covers.get(r.id)));
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
