"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import type { Session } from "next-auth";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { annonces, CATEGORIES, type Categorie } from "@/lib/db/schema";

const DUREE_PUBLICATION_JOURS = 60;

function dansNJours(n: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + n);
  return date;
}

type Annonce = typeof annonces.$inferSelect;

type Possession =
  | { ok: false; error: string }
  | { ok: true; session: Session; annonce: Annonce };

async function chargerAnnoncePossedee(id: string): Promise<Possession> {
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

export async function supprimerAnnonce(id: string): Promise<void> {
  const result = await chargerAnnoncePossedee(id);
  if (!result.ok) throw new Error(result.error);
  if (result.annonce.etat === "retiree") {
    throw new Error("Cette annonce est déjà retirée.");
  }

  await db.update(annonces).set({ etat: "retiree", updatedAt: new Date() }).where(eq(annonces.id, id));
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

export async function creerAnnonce(formData: FormData): Promise<CreerAnnonceResult> {
  // Le proxy protège /compte/annonces/nouvelle, mais une Server Function
  // doit toujours revérifier la session elle-même (règle Next.js 16).
  const session = await auth();
  if (!session) {
    return { error: "Vous devez être connecté pour déposer une annonce." };
  }

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

  const prixRaw = optionalString(formData, "prix");
  let prixCents: number | undefined;
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
  const attributs: Record<string, string> = {};

  if (categorie === "vehicules") {
    marque = optionalString(formData, "marque");
    modele = optionalString(formData, "modele");
    annee = optionalInt(formData, "annee");
    kilometrage = optionalInt(formData, "kilometrage");
    const carburant = optionalString(formData, "carburant");
    const boite = optionalString(formData, "boite");
    if (carburant) attributs.carburant = carburant;
    if (boite) attributs.boite = boite;
  } else if (categorie === "loisirs") {
    sousCategorie = optionalString(formData, "sousCategorie");
    etatProduit = optionalString(formData, "etatProduit");
  } else if (categorie === "animaux") {
    typeAnimal = optionalString(formData, "typeAnimal");
  }

  const [inserted] = await db
    .insert(annonces)
    .values({
      userId: session.user.id,
      categorie,
      typeAnnonce,
      titre,
      description,
      prixCents,
      ville,
      codePostal,
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
    })
    .returning({ id: annonces.id });

  redirect(`/annonces/${inserted.id}?nouveau=1`);
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

  const prixRaw = optionalString(formData, "prix");
  let prixCents: number | undefined;
  if (prixRaw) {
    const prix = Number.parseFloat(prixRaw.replace(",", "."));
    if (!Number.isFinite(prix) || prix < 0) {
      return { error: "Prix invalide." };
    }
    prixCents = Math.round(prix * 100);
  }

  const attributs = { ...(annonce.attributs as Record<string, string>) };
  let marque = annonce.marque ?? undefined;
  let modele = annonce.modele ?? undefined;
  let annee = annonce.annee ?? undefined;
  let kilometrage = annonce.kilometrage ?? undefined;

  if (annonce.categorie === "vehicules") {
    marque = optionalString(formData, "marque") ?? marque;
    modele = optionalString(formData, "modele") ?? modele;
    annee = optionalInt(formData, "annee") ?? annee;
    kilometrage = optionalInt(formData, "kilometrage") ?? kilometrage;
    const carburant = optionalString(formData, "carburant");
    const boite = optionalString(formData, "boite");
    if (carburant) attributs.carburant = carburant;
    if (boite) attributs.boite = boite;
  }

  await db
    .update(annonces)
    .set({
      titre,
      description,
      prixCents,
      ville,
      codePostal,
      marque,
      modele,
      annee,
      kilometrage,
      attributs,
      updatedAt: new Date(),
    })
    .where(and(eq(annonces.id, id), eq(annonces.userId, result.session.user.id)));

  redirect(`/annonces/${id}`);
}
