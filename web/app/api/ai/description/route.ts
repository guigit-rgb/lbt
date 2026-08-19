import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { genererDescription } from "@/lib/ai/suggestions";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const titre = body && typeof body.titre === "string" ? body.titre.trim() : "";
  const categorieLabel = body && typeof body.categorieLabel === "string" ? body.categorieLabel : "";
  const details =
    body && typeof body.details === "object" && body.details !== null
      ? (body.details as Record<string, string>)
      : undefined;

  if (!titre || !categorieLabel) {
    return NextResponse.json({ error: "Titre et catégorie requis." }, { status: 400 });
  }

  try {
    const description = await genererDescription({ titre, categorieLabel, details });
    return NextResponse.json({ description });
  } catch {
    return NextResponse.json({ error: "Génération indisponible." }, { status: 502 });
  }
}
