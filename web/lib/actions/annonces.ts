"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import type { Session } from "next-auth";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { annonces, annonceImages, CATEGORIES, type Categorie } from "@/lib/db/schema";
import { deleteFromR2 } from "@/lib/storage/r2";
import { estFinDeVie } from "@/lib/annonce-display";
import { geocoderAdresse } from "@/lib/geocodage";
import { enregistrerPrixObserve } from "@/lib/prix-trajectoire";
import { demarrerModificationPayante } from "@/lib/actions/paiements";
import { SUBCATEGORY_FILTERS, LOCATIONS_VACANCES } from "@/lib/subcategory-filters";
import { ATTRIBUT_ARRAY_KEYS } from "@/lib/attribut-keys";
import { completerVehicule } from "@/lib/deduction-vehicule";
import type { FilterField } from "@/lib/filter-field";

const DUREE_PUBLICATION_JOURS = 60;

/**
 * Trace d'une marque ou d'un modèle **écrit par le site et non par le vendeur**
 * (§14.9, action §17 n°226).
 *
 * Une seule ligne de journal, à dessein. Ce n'est pas le journal du normaliseur
 * demandé par l'action n°228 — celui-là portera les résidus et les corrections
 * floues de *toutes* les recherches, et devra aller en base. C'est le minimum
 * sans lequel une déduction fausse serait strictement invisible : le site aurait
 * modifié l'annonce d'un vendeur sans que quiconque puisse dire laquelle, ni
 * d'après quel titre. À rediriger vers le journal de la n°228 le jour où il
 * existe, plutôt qu'à dupliquer.
 */
function journaliserDeduction(
  id: string,
  titre: string,
  complete: { marque?: string; modele?: string; champsDeduits: string[] }
): void {
  console.info(
    JSON.stringify({
      evenement: "deduction_vehicule",
      annonce: id,
      titre,
      champs: complete.champsDeduits,
      marque: complete.marque ?? null,
      modele: complete.modele ?? null,
    })
  );
}

// Caractéristiques véhicule facultatives, toutes de simples chaînes stockées
// dans `attributs` (au même titre que carburant/boite) — un seul endroit à
// étendre si un futur champ vient s'y ajouter.
const VEHICULE_ATTRIBUTS_TEXTE = [
  "portes",
  "places",
  "etatVehicule",
  "typeVehicule",
  "couleur",
  "sellerie",
  "equipements",
  "puissanceFiscale",
  "puissanceDin",
  "permis",
  "controleTechnique",
  "miseEnCirculation",
  "critAir",
] as const;

// Caractéristiques immobilier à valeur unique — sur le modèle de
// VEHICULE_ATTRIBUTS_TEXTE. `exterieur` et `caracteristiques` en sont
// volontairement absents : une annonce peut en cumuler plusieurs à la fois,
// et sont donc traités à part comme un tableau (cf. lib/annonce-filters.ts
// ATTRIBUT_ARRAY_KEYS).
const IMMOBILIER_ATTRIBUTS_TEXTE = [
  "typeBien",
  "typeVente",
  "surfaceHabitable",
  "surfaceTerrain",
  "pieces",
  "chambres",
  "etage",
  "exposition",
  "etatBien",
  "dpe",
] as const;

// Champs des ~50 sous-catégories génériques (lib/subcategory-filters.ts —
// Matériel pro, Électronique, Emploi, Mode, Maison & Jardin, Famille,
// Services, Animaux, Locations de vacances) : contrairement à
// VEHICULE_ATTRIBUTS_TEXTE, la liste des champs dépend de la sous-catégorie
// choisie, d'où une lecture générique plutôt qu'une liste figée. "etat_produit"
// et "type_animal" restent des colonnes dédiées (déjà utilisées ailleurs —
// annonce-display.ts, lib/annonce-filters.ts SELECT_COLUMNS) : ce sont les
// deux seules clés à ne PAS atterrir dans `attributs`.
function champsSousCategorie(categorie: Categorie, sousCategorie: string | undefined): FilterField[] {
  if (categorie === "locations-vacances") return LOCATIONS_VACANCES;
  return SUBCATEGORY_FILTERS[categorie]?.[sousCategorie ?? ""] ?? [];
}

function lireChampsDynamiques(
  formData: FormData,
  champs: FilterField[],
  attributs: Record<string, string | string[]>
): { etatProduit?: string; typeAnimal?: string } {
  const colonnesDediees: { etatProduit?: string; typeAnimal?: string } = {};
  for (const champ of champs) {
    const valeur = optionalString(formData, champ.key);
    if (!valeur) continue;
    if (champ.key === "etat_produit") {
      colonnesDediees.etatProduit = valeur;
    } else if (champ.key === "type_animal") {
      colonnesDediees.typeAnimal = valeur;
    } else {
      attributs[champ.key] = (ATTRIBUT_ARRAY_KEYS as readonly string[]).includes(champ.key)
        ? valeur.split(",").filter(Boolean)
        : valeur;
    }
  }
  return colonnesDediees;
}

function dansNJours(n: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + n);
  return date;
}

type Annonce = typeof annonces.$inferSelect;

type Possession =
  | { ok: false; error: string }
  | { ok: true; session: Session; annonce: Annonce };

export async function chargerAnnoncePossedee(id: string): Promise<Possession> {
  const session = await auth();
  if (!session) {
    return { ok: false, error: "Vous devez être connecté." };
  }
  const [annonce] = await db.select().from(annonces).where(eq(annonces.id, id)).limit(1);
  if (!annonce || annonce.userId !== session.user.id) {
    return { ok: false, error: "Annonce introuvable." };
  }
  return { ok: true, session, annonce };
}

export type BrouillonInput = { id?: string; titre: string; categorie: string; typeAnnonce: string };

// Crée (ou met à jour, si `id` est fourni) une annonce à l'état "brouillon" —
// nécessaire dès l'étape Photos car `annonce_images.annonce_id` référence une
// annonce existante : on ne peut plus attendre la toute fin du tunnel pour
// créer la ligne en base, contrairement à l'ancien `creerAnnonce` (cf. journal
// du cahier des charges, session photos).
export async function enregistrerBrouillon(input: BrouillonInput): Promise<CreerAnnonceResult> {
  const session = await auth();
  if (!session) {
    return { error: "Vous devez être connecté." };
  }
  if (!isCategorie(input.categorie)) {
    return { error: "Catégorie invalide." };
  }
  if (input.typeAnnonce !== "offre" && input.typeAnnonce !== "demande") {
    return { error: "Merci de préciser s'il s'agit d'une offre ou d'une demande." };
  }
  const titre = input.titre.trim();
  if (titre.length < 3) {
    return { error: "Le titre doit contenir au moins 3 caractères." };
  }

  if (input.id) {
    const result = await chargerAnnoncePossedee(input.id);
    if (!result.ok) return { error: result.error };
    await db
      .update(annonces)
      .set({ titre, categorie: input.categorie, typeAnnonce: input.typeAnnonce, updatedAt: new Date() })
      .where(eq(annonces.id, input.id));
    return { success: true, id: input.id };
  }

  const [inserted] = await db
    .insert(annonces)
    .values({
      userId: session.user.id,
      categorie: input.categorie,
      typeAnnonce: input.typeAnnonce,
      titre,
      description: "",
      etat: "brouillon",
    })
    .returning({ id: annonces.id });

  return { success: true, id: inserted.id };
}

export type PhotoResult = { error: string } | { success: true; id: string; url: string };

// Le téléversement se fait via une route API classique
// (app/api/uploads/photos/[annonceId]/route.ts), pas via une Server Action —
// c'est la seule façon d'exposer une vraie progression d'upload (XHR
// `upload.onprogress`) au navigateur, cf. journal du cahier des charges.

export async function supprimerPhoto(imageId: string): Promise<{ error: string } | { success: true }> {
  const session = await auth();
  if (!session) return { error: "Vous devez être connecté." };

  const [image] = await db.select().from(annonceImages).where(eq(annonceImages.id, imageId)).limit(1);
  if (!image) return { error: "Photo introuvable." };

  const possession = await chargerAnnoncePossedee(image.annonceId);
  if (!possession.ok) return { error: possession.error };

  await deleteFromR2(image.storageKeyOriginal).catch(() => {});
  await db.delete(annonceImages).where(eq(annonceImages.id, imageId));

  const restantes = await db
    .select({ id: annonceImages.id })
    .from(annonceImages)
    .where(eq(annonceImages.annonceId, image.annonceId))
    .orderBy(annonceImages.position);
  for (let i = 0; i < restantes.length; i++) {
    await db.update(annonceImages).set({ position: i }).where(eq(annonceImages.id, restantes[i].id));
  }

  return { success: true };
}

export async function reordonnerPhotos(
  annonceId: string,
  ordreIds: string[]
): Promise<{ error: string } | { success: true }> {
  const possession = await chargerAnnoncePossedee(annonceId);
  if (!possession.ok) return { error: possession.error };

  for (let i = 0; i < ordreIds.length; i++) {
    await db
      .update(annonceImages)
      .set({ position: i })
      .where(and(eq(annonceImages.id, ordreIds[i]), eq(annonceImages.annonceId, annonceId)));
  }
  return { success: true };
}

// Retournent `void` (et non un objet de résultat) car ces actions sont
// appelées directement en `action={...}` sur des <form> de la liste
// "Mes annonces" — Next.js exige `void | Promise<void>` dans ce cas
// (contrairement à un appel via useActionState, cf. modifierAnnonce/creerAnnonce).
export async function mettreEnPauseAnnonce(id: string): Promise<void> {
  const result = await chargerAnnoncePossedee(id);
  if (!result.ok) throw new Error(result.error);
  if (result.annonce.etat !== "en_ligne") {
    throw new Error("Seule une annonce en ligne peut être mise en pause.");
  }

  await db.update(annonces).set({ etat: "en_pause", updatedAt: new Date() }).where(eq(annonces.id, id));
  revalidatePath("/compte/annonces");
}

export async function reactiverAnnonce(id: string): Promise<void> {
  const result = await chargerAnnoncePossedee(id);
  if (!result.ok) throw new Error(result.error);
  if (result.annonce.etat !== "en_pause") {
    throw new Error("Seule une annonce en pause peut être réactivée.");
  }

  await db
    .update(annonces)
    .set({ etat: "en_ligne", expiresAt: dansNJours(DUREE_PUBLICATION_JOURS), updatedAt: new Date() })
    .where(eq(annonces.id, id));
  revalidatePath("/compte/annonces");
}

// Retrait volontaire par l'auteur. Écrit `retiree_par_auteur` et **jamais**
// `retiree`, qui est réservé à la décision restrictive de LBT : sans cette
// distinction, une requête sur `etat` compterait chaque retrait volontaire
// comme une décision de modération et gonflerait le rapport de transparence
// public du DSA (cahier des charges §6.6 Résultat n°0, §8.2).
export async function supprimerAnnonce(id: string): Promise<void> {
  const result = await chargerAnnoncePossedee(id);
  if (!result.ok) throw new Error(result.error);
  if (estFinDeVie(result.annonce.etat)) {
    throw new Error("Cette annonce n'est plus en ligne.");
  }

  await db
    .update(annonces)
    .set({ etat: "retiree_par_auteur", finVieAt: new Date(), updatedAt: new Date() })
    .where(eq(annonces.id, id));
  revalidatePath("/compte/annonces");
}

// Déclaration de vente par l'auteur. La transition d'état ne doit **jamais**
// être conditionnée à une réponse du vendeur (§6.6 Résultat n°2, règle 1) :
// l'écran de clôture — statut, prix final pré-rempli, canal — est une couche
// facultative par-dessus cette transition (action n°189), pas un préalable.
export async function marquerVendueAnnonce(id: string): Promise<void> {
  const result = await chargerAnnoncePossedee(id);
  if (!result.ok) throw new Error(result.error);
  if (estFinDeVie(result.annonce.etat)) {
    throw new Error("Cette annonce n'est plus en ligne.");
  }
  if (result.annonce.etat === "brouillon") {
    throw new Error("Une annonce non publiée ne peut pas être marquée vendue.");
  }

  await db
    .update(annonces)
    .set({ etat: "vendue", finVieAt: new Date(), updatedAt: new Date() })
    .where(eq(annonces.id, id));
  revalidatePath("/compte/annonces");
}

export type CreerAnnonceResult = { error: string } | { success: true; id: string };

function isCategorie(value: unknown): value is Categorie {
  return typeof value === "string" && (CATEGORIES as readonly string[]).includes(value);
}

function optionalString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function optionalInt(formData: FormData, key: string): number | undefined {
  const raw = optionalString(formData, key);
  if (!raw) return undefined;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : undefined;
}

// Champs multi-valeurs immobilier (exterieur, caracteristiques) : le
// formulaire de dépôt envoie une liste jointe par des virgules dans un champ
// caché, à ranger en tableau JSON dans `attributs` plutôt qu'en chaîne — voir
// lib/annonce-filters.ts ATTRIBUT_ARRAY_KEYS pour le filtrage côté recherche.
function optionalStringList(formData: FormData, key: string): string[] | undefined {
  const raw = optionalString(formData, key);
  if (!raw) return undefined;
  const valeurs = raw.split(",").filter(Boolean);
  return valeurs.length > 0 ? valeurs : undefined;
}

export async function publierAnnonce(id: string, formData: FormData): Promise<CreerAnnonceResult> {
  // Le brouillon (titre/catégorie/type/photos) existe déjà en base à ce
  // stade — cette fonction complète les champs restants et fait passer
  // l'annonce de "brouillon" à "en_ligne" (cf. enregistrerBrouillon).
  const result = await chargerAnnoncePossedee(id);
  if (!result.ok) return { error: result.error };

  const categorie = formData.get("categorie");
  if (!isCategorie(categorie)) {
    return { error: "Catégorie invalide." };
  }

  const typeAnnonce = formData.get("typeAnnonce");
  if (typeAnnonce !== "offre" && typeAnnonce !== "demande") {
    return { error: "Merci de préciser s'il s'agit d'une offre ou d'une demande." };
  }

  const titre = optionalString(formData, "titre");
  const description = optionalString(formData, "description");
  const ville = optionalString(formData, "ville");
  const codePostal = optionalString(formData, "codePostal");

  if (!titre || titre.length < 3) {
    return { error: "Le titre doit contenir au moins 3 caractères." };
  }
  if (!description || description.length < 10) {
    return { error: "La description doit contenir au moins 10 caractères." };
  }
  if (!ville) {
    return { error: "La ville est requise." };
  }
  if (!codePostal || !/^\d{5}$/.test(codePostal)) {
    return { error: "Le code postal doit contenir 5 chiffres." };
  }

  const [{ n: nombrePhotos }] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(annonceImages)
    .where(eq(annonceImages.annonceId, id));
  if (nombrePhotos < 1) {
    return { error: "Ajoutez au moins une photo avant de publier." };
  }

  // `null` et non `undefined` : Drizzle **omet** de l'`update` un champ à
  // `undefined`, si bien qu'un vendeur qui vide le champ Prix pour passer en
  // « prix sur demande » voyait son ancien prix silencieusement conservé.
  // Le bug était invisible avant la trajectoire de prix, qui aurait enregistré
  // une observation « sans prix » sur une annonce toujours affichée à son prix.
  const prixRaw = optionalString(formData, "prix");
  let prixCents: number | null = null;
  if (prixRaw) {
    const prix = Number.parseFloat(prixRaw.replace(",", "."));
    if (!Number.isFinite(prix) || prix < 0) {
      return { error: "Prix invalide." };
    }
    prixCents = Math.round(prix * 100);
  }

  let marque: string | undefined;
  let modele: string | undefined;
  let annee: number | undefined;
  let kilometrage: number | undefined;
  let sousCategorie: string | undefined;
  let etatProduit: string | undefined;
  let typeAnimal: string | undefined;
  const attributs: Record<string, string | string[]> = {};

  if (categorie === "vehicules") {
    marque = optionalString(formData, "marque");
    modele = optionalString(formData, "modele");
    annee = optionalInt(formData, "annee");
    kilometrage = optionalInt(formData, "kilometrage");
    const carburant = optionalString(formData, "carburant");
    const boite = optionalString(formData, "boite");
    if (carburant) attributs.carburant = carburant;
    if (boite) attributs.boite = boite;
    for (const champ of VEHICULE_ATTRIBUTS_TEXTE) {
      const valeur = optionalString(formData, champ);
      if (valeur) attributs[champ] = valeur;
    }
    // Marque et Modèle ne sont pas obligatoires au dépôt, et depuis le
    // 2026-08-28 la recherche par modèle est un filtre sur la colonne (§14.8) :
    // les laisser vides, c'est publier une annonce introuvable par le premier
    // mot que l'acheteur tapera. On complète donc **les seuls champs vides** à
    // partir du titre que le vendeur vient d'écrire (§14.9, action n°226) — sa
    // saisie n'est jamais remplacée.
    const complete = completerVehicule(titre, marque, modele);
    if (complete.champsDeduits.length > 0) {
      journaliserDeduction(id, titre, complete);
    }
    marque = complete.marque;
    modele = complete.modele;
  } else if (categorie === "loisirs") {
    sousCategorie = optionalString(formData, "sousCategorie");
    etatProduit = optionalString(formData, "etatProduit");
  } else if (categorie === "immobilier") {
    for (const champ of IMMOBILIER_ATTRIBUTS_TEXTE) {
      const valeur = optionalString(formData, champ);
      if (valeur) attributs[champ] = valeur;
    }
    const ascenseur = optionalString(formData, "ascenseur");
    if (ascenseur) attributs.ascenseur = ascenseur;
    const exterieur = optionalStringList(formData, "exterieur");
    if (exterieur) attributs.exterieur = exterieur;
    const caracteristiques = optionalStringList(formData, "caracteristiques");
    if (caracteristiques) attributs.caracteristiques = caracteristiques;
  } else {
    // Matériel pro, Électronique, Emploi, Mode, Maison & Jardin, Famille,
    // Services, Animaux, Locations de vacances — voir champsSousCategorie.
    sousCategorie = optionalString(formData, "sousCategorie");
    const dediees = lireChampsDynamiques(formData, champsSousCategorie(categorie, sousCategorie), attributs);
    if (dediees.etatProduit) etatProduit = dediees.etatProduit;
    if (dediees.typeAnimal) typeAnimal = dediees.typeAnimal;
  }

  const coordonnees = await geocoderAdresse(ville, codePostal);

  await db
    .update(annonces)
    .set({
      categorie,
      typeAnnonce,
      titre,
      description,
      prixCents,
      ville,
      codePostal,
      lat: coordonnees?.lat ?? null,
      lng: coordonnees?.lng ?? null,
      etat: "en_ligne",
      expiresAt: dansNJours(DUREE_PUBLICATION_JOURS),
      marque,
      modele,
      annee,
      kilometrage,
      sousCategorie,
      etatProduit,
      typeAnimal,
      attributs,
      publishedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(annonces.id, id));

  // Premier point de la trajectoire de prix (§6.6 R3). Le brouillon n'a pas de
  // prix observable : l'annonce n'était pas offerte au marché.
  await enregistrerPrixObserve(id, prixCents, "depot");

  redirect(`/annonces/${id}?nouveau=1`);
}

export async function modifierAnnonce(id: string, formData: FormData): Promise<CreerAnnonceResult> {
  const result = await chargerAnnoncePossedee(id);
  if (!result.ok) return { error: result.error };
  const { annonce } = result;

  const titre = optionalString(formData, "titre");
  const description = optionalString(formData, "description");
  const ville = optionalString(formData, "ville");
  const codePostal = optionalString(formData, "codePostal");

  if (!titre || titre.length < 3) {
    return { error: "Le titre doit contenir au moins 3 caractères." };
  }
  if (!description || description.length < 10) {
    return { error: "La description doit contenir au moins 10 caractères." };
  }
  if (!ville) {
    return { error: "La ville est requise." };
  }
  if (!codePostal || !/^\d{5}$/.test(codePostal)) {
    return { error: "Le code postal doit contenir 5 chiffres." };
  }

  // `null` et non `undefined` : Drizzle **omet** de l'`update` un champ à
  // `undefined`, si bien qu'un vendeur qui vide le champ Prix pour passer en
  // « prix sur demande » voyait son ancien prix silencieusement conservé.
  // Le bug était invisible avant la trajectoire de prix, qui aurait enregistré
  // une observation « sans prix » sur une annonce toujours affichée à son prix.
  const prixRaw = optionalString(formData, "prix");
  let prixCents: number | null = null;
  if (prixRaw) {
    const prix = Number.parseFloat(prixRaw.replace(",", "."));
    if (!Number.isFinite(prix) || prix < 0) {
      return { error: "Prix invalide." };
    }
    prixCents = Math.round(prix * 100);
  }

  const attributs = { ...(annonce.attributs as Record<string, string | string[]>) };
  let marque = annonce.marque ?? undefined;
  let modele = annonce.modele ?? undefined;
  let annee = annonce.annee ?? undefined;
  let kilometrage = annonce.kilometrage ?? undefined;
  let etatProduit = annonce.etatProduit ?? undefined;
  let typeAnimal = annonce.typeAnimal ?? undefined;
  const sousCategorie = annonce.sousCategorie ?? undefined;

  if (annonce.categorie === "vehicules") {
    marque = optionalString(formData, "marque") ?? marque;
    modele = optionalString(formData, "modele") ?? modele;
    annee = optionalInt(formData, "annee") ?? annee;
    kilometrage = optionalInt(formData, "kilometrage") ?? kilometrage;
    const carburant = optionalString(formData, "carburant");
    const boite = optionalString(formData, "boite");
    if (carburant) attributs.carburant = carburant;
    if (boite) attributs.boite = boite;
    for (const champ of VEHICULE_ATTRIBUTS_TEXTE) {
      const valeur = optionalString(formData, champ);
      if (valeur) attributs[champ] = valeur;
    }
  } else if (annonce.categorie === "immobilier") {
    for (const champ of IMMOBILIER_ATTRIBUTS_TEXTE) {
      const valeur = optionalString(formData, champ);
      if (valeur) attributs[champ] = valeur;
    }
    const ascenseur = optionalString(formData, "ascenseur");
    // Contrairement aux autres champs (silencieusement conservés si absents
    // du formulaire), l'ascenseur doit pouvoir repasser à "non" — une case
    // décochée n'envoie aucune valeur, ce qui la distinguerait sinon d'un
    // champ simplement non modifié.
    if (formData.has("ascenseur")) {
      if (ascenseur) attributs.ascenseur = ascenseur;
      else delete attributs.ascenseur;
    }
    const exterieur = optionalStringList(formData, "exterieur");
    if (formData.has("exterieur")) {
      if (exterieur) attributs.exterieur = exterieur;
      else delete attributs.exterieur;
    }
    const caracteristiques = optionalStringList(formData, "caracteristiques");
    if (formData.has("caracteristiques")) {
      if (caracteristiques) attributs.caracteristiques = caracteristiques;
      else delete attributs.caracteristiques;
    }
  } else {
    // Matériel pro, Électronique, Emploi, Mode, Maison & Jardin, Famille,
    // Services, Animaux, Locations de vacances — la sous-catégorie n'est pas
    // modifiable ici (cf. AttributsDynamiques dans ModifierAnnonceForm), donc
    // toujours celle déjà enregistrée.
    const dediees = lireChampsDynamiques(formData, champsSousCategorie(annonce.categorie, sousCategorie), attributs);
    if (dediees.etatProduit) etatProduit = dediees.etatProduit;
    if (dediees.typeAnimal) typeAnimal = dediees.typeAnimal;
  }

  // Ne regéocode que si la localisation a changé — un enregistrement sans
  // toucher à la ville ne doit pas déclencher un appel réseau supplémentaire.
  const localisationChangee = ville !== annonce.ville || codePostal !== annonce.codePostal;
  const coordonnees = localisationChangee
    ? await geocoderAdresse(ville, codePostal)
    : { lat: annonce.lat, lng: annonce.lng };

  // Même complétion qu'au dépôt (§14.9, action n°226), avec une précaution que
  // le dépôt n'a pas : les valeurs déduites entrent dans `donnees`, **pas**
  // dans les variables `marque`/`modele` comparées plus bas. Sans cela, un
  // vendeur qui rouvre puis réenregistre son annonce sans rien changer verrait
  // la déduction compter comme une modification — et se ferait facturer les 4 €
  // de la modification payante pour un champ que le site a rempli tout seul.
  const completeVehicule =
    annonce.categorie === "vehicules"
      ? completerVehicule(titre, marque, modele)
      : { marque, modele, champsDeduits: [] as string[] };
  if (completeVehicule.champsDeduits.length > 0) {
    journaliserDeduction(id, titre, completeVehicule);
  }

  const donnees = {
    titre,
    description,
    prixCents,
    ville,
    codePostal,
    lat: coordonnees?.lat ?? null,
    lng: coordonnees?.lng ?? null,
    marque: completeVehicule.marque,
    modele: completeVehicule.modele,
    annee,
    kilometrage,
    etatProduit,
    typeAnimal,
    attributs,
  };

  // Modification payante (4€, cahier des charges §5 Résultat n°6) — sauf si
  // le seul effet du formulaire est de baisser le prix affiché : cette
  // exception est volontaire, pour ne jamais décourager un vendeur de
  // corriger un prix trop haut, signal que la trajectoire de prix (§6.6)
  // a justement été construite pour valoriser.
  const prixInchange = prixCents === annonce.prixCents;
  const prixEnBaisse = prixCents !== null && annonce.prixCents !== null && prixCents < annonce.prixCents;
  const autresChampsInchanges =
    titre === annonce.titre &&
    description === annonce.description &&
    ville === annonce.ville &&
    codePostal === annonce.codePostal &&
    marque === (annonce.marque ?? undefined) &&
    modele === (annonce.modele ?? undefined) &&
    annee === (annonce.annee ?? undefined) &&
    kilometrage === (annonce.kilometrage ?? undefined) &&
    etatProduit === (annonce.etatProduit ?? undefined) &&
    typeAnimal === (annonce.typeAnimal ?? undefined) &&
    JSON.stringify(attributs) === JSON.stringify(annonce.attributs ?? {});
  const modificationGratuite = autresChampsInchanges && (prixInchange || prixEnBaisse);

  if (!modificationGratuite) {
    const url = await demarrerModificationPayante(result.session.user.id, id, donnees);
    redirect(url);
  }

  await db
    .update(annonces)
    .set({ ...donnees, updatedAt: new Date() })
    .where(and(eq(annonces.id, id), eq(annonces.userId, result.session.user.id)));

  // Cet `update` écrasait la valeur précédente sans trace : c'est la baisse de
  // prix, donc le signal de surévaluation, qui était détruite (§6.6 R3).
  await enregistrerPrixObserve(id, prixCents, "modification_auteur", annonce.prixCents);

  redirect(`/annonces/${id}`);
}
