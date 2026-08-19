"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { annonces, CATEGORIES, type Categorie } from "@/lib/db/schema";

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
      titre,
      description,
      prixCents,
      ville,
      codePostal,
      etat: "en_ligne",
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
