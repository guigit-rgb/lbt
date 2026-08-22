import { NextResponse } from "next/server";
import { and, asc, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { annonces } from "@/lib/db/schema";
import { annonceVisiblePublic } from "@/lib/annonce-display";

// Modèles disponibles pour une marque donnée — utilisé par le widget de
// recherche accueil pour le menu "Modèle" en cascade sous "Marque". `modele`
// reste un champ libre au dépôt (pas de catalogue comme lib/marques.ts,
// aucune source fiable de "tous les modèles existants" contrairement aux
// marques) : cette liste ne montre donc que les modèles réellement présents
// en base, insensible à la casse comme le filtre marque (lib/annonce-filters.ts).
export async function GET(request: Request): Promise<Response> {
  const marque = new URL(request.url).searchParams.get("marque");
  if (!marque) {
    return NextResponse.json({ modeles: [] });
  }

  const rows = await db
    .selectDistinct({ modele: annonces.modele })
    .from(annonces)
    .where(
      and(
        eq(annonces.categorie, "vehicules"),
        annonceVisiblePublic(),
        isNotNull(annonces.modele),
        sql`upper(${annonces.marque}) = ${marque.toUpperCase()}`
      )
    )
    .orderBy(asc(annonces.modele));

  return NextResponse.json({ modeles: rows.map((r) => r.modele).filter((m): m is string => !!m) });
}
