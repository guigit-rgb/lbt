import { NextResponse } from "next/server";
import { and, count, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { annonces, users } from "@/lib/db/schema";
import { buildAnnonceConditions } from "@/lib/annonce-filters";

// Compteur live du widget de recherche accueil — mêmes clés de filtre que la
// page catégorie (buildAnnonceConditions), pour ne jamais avoir deux lectures
// différentes des mêmes filtres.
export async function GET(request: Request): Promise<Response> {
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const conditions = buildAnnonceConditions("vehicules", params);

  const [ligne] = await db
    .select({ total: count() })
    .from(annonces)
    .innerJoin(users, eq(annonces.userId, users.id))
    .where(and(...conditions));

  return NextResponse.json({ total: ligne?.total ?? 0 });
}
