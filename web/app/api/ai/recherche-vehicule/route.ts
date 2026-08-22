import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { recherchesIa } from "@/lib/db/schema";
import { extraireFiltresRecherche } from "@/lib/ai/recherche-vehicule";
import { autoriseParIp, ipDepuisRequete } from "@/lib/rate-limit";

const LONGUEUR_MAX_TEXTE = 200;

// Route publique (pas d'auth) : c'est le seul appel IA de LBT déclenché
// depuis une page anonyme à fort trafic (accueil), d'où le rate-limit — voir
// lib/rate-limit.ts pour ses limites connues.
export async function POST(request: Request): Promise<Response> {
  const ip = ipDepuisRequete(request);
  if (!autoriseParIp(ip)) {
    return NextResponse.json({ error: "Trop de recherches, réessayez dans une minute." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const texte = body && typeof body.texte === "string" ? body.texte.trim() : "";
  if (!texte) {
    return NextResponse.json({ error: "Décrivez la voiture que vous cherchez." }, { status: 400 });
  }

  try {
    const filtres = await extraireFiltresRecherche(texte.slice(0, LONGUEUR_MAX_TEXTE));
    // Journal d'usage (page /admin) : avant ce commit, rien ne permettait de
    // savoir si cette fonctionnalité était utilisée. Attendu explicitement —
    // une fonction serverless peut être gelée dès la réponse envoyée, un
    // insert "fire and forget" non attendu risquerait de ne jamais s'exécuter.
    // Best-effort côté fiabilité : une panne d'écriture ne fait pas échouer
    // la recherche elle-même.
    await db
      .insert(recherchesIa)
      .values({ texte: texte.slice(0, LONGUEUR_MAX_TEXTE), filtresExtraits: filtres, ip })
      .catch(() => {});
    return NextResponse.json({ filtres });
  } catch {
    return NextResponse.json({ error: "Recherche indisponible, réessayez." }, { status: 502 });
  }
}
