import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { suggererCategorie } from "@/lib/ai/suggestions";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const titre = body && typeof body.titre === "string" ? body.titre.trim() : "";
  if (titre.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const suggestions = await suggererCategorie(titre);
    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ error: "Suggestion indisponible." }, { status: 502 });
  }
}
