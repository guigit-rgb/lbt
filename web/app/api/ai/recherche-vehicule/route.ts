import { NextResponse } from "next/server";
import { extraireFiltresRecherche } from "@/lib/ai/recherche-vehicule";
import { autoriseParIp, ipDepuisRequete } from "@/lib/rate-limit";

const LONGUEUR_MAX_TEXTE = 200;

// Route publique (pas d'auth) : c'est le seul appel IA de LBT déclenché
// depuis une page anonyme à fort trafic (accueil), d'où le rate-limit — voir
// lib/rate-limit.ts pour ses limites connues.
export async function POST(request: Request): Promise<Response> {
  if (!autoriseParIp(ipDepuisRequete(request))) {
    return NextResponse.json({ error: "Trop de recherches, réessayez dans une minute." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const texte = body && typeof body.texte === "string" ? body.texte.trim() : "";
  if (!texte) {
    return NextResponse.json({ error: "Décrivez la voiture que vous cherchez." }, { status: 400 });
  }

  try {
    const filtres = await extraireFiltresRecherche(texte.slice(0, LONGUEUR_MAX_TEXTE));
    return NextResponse.json({ filtres });
  } catch {
    return NextResponse.json({ error: "Recherche indisponible, réessayez." }, { status: 502 });
  }
}
