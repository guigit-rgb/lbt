import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { recherchesSauvegardees } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

// Compteur léger pour le badge "Mes recherches" du header (SiteHeader, "use
// client" — ne peut pas lire la base directement) : un simple count(*), pas
// listerRecherchesSauvegardees() qui recalcule en plus le nombre de résultats
// de chaque recherche (une requête par recherche sauvegardée, inutile ici).
export async function GET(): Promise<Response> {
  const session = await auth();
  if (!session?.user.id) {
    return NextResponse.json({ count: 0 });
  }

  const [ligne] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(recherchesSauvegardees)
    .where(eq(recherchesSauvegardees.userId, session.user.id));

  return NextResponse.json({ count: ligne?.total ?? 0 });
}
