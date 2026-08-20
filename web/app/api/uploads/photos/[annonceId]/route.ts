import { randomUUID } from "node:crypto";
import convert from "heic-convert";
import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { annonceImages } from "@/lib/db/schema";
import { uploadToR2 } from "@/lib/storage/r2";
import { chargerAnnoncePossedee } from "@/lib/actions/annonces";
import { MAX_PHOTOS, MAX_TAILLE_PHOTO_OCTETS } from "@/lib/photos-constants";

// Les photos iPhone sont en HEIC par défaut — aucun navigateur ne sait
// afficher ce format dans une balise <img>, et son type MIME signalé par le
// navigateur est peu fiable (souvent vide ou "application/octet-stream" hors
// Safari). On détecte donc aussi par extension, et on convertit toujours en
// JPEG côté serveur avant stockage.
function estHeic(fichier: File): boolean {
  return (
    fichier.type === "image/heic" ||
    fichier.type === "image/heif" ||
    /\.(heic|heif)$/i.test(fichier.name)
  );
}

// Route API classique (pas une Server Action) : c'est la seule façon d'obtenir
// une vraie progression d'upload côté navigateur (XHR `upload.onprogress`),
// une Server Action ne l'exposant pas. Cf. journal du cahier des charges.
export async function POST(request: Request, { params }: { params: Promise<{ annonceId: string }> }) {
  const { annonceId } = await params;

  const possession = await chargerAnnoncePossedee(annonceId);
  if (!possession.ok) {
    return NextResponse.json({ error: possession.error }, { status: 403 });
  }

  const formData = await request.formData();
  const fichier = formData.get("fichier");
  if (!(fichier instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }
  const heic = estHeic(fichier);
  if (!heic && !fichier.type.startsWith("image/")) {
    return NextResponse.json({ error: "Le fichier doit être une image." }, { status: 400 });
  }
  if (fichier.size > MAX_TAILLE_PHOTO_OCTETS) {
    return NextResponse.json({ error: "L'image dépasse 8 Mo." }, { status: 400 });
  }

  const [{ n: nombreActuel }] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(annonceImages)
    .where(eq(annonceImages.annonceId, annonceId));
  if (nombreActuel >= MAX_PHOTOS) {
    return NextResponse.json({ error: `Vous ne pouvez pas ajouter plus de ${MAX_PHOTOS} photos.` }, { status: 400 });
  }

  let buffer = Buffer.from(await fichier.arrayBuffer());
  let contentType = fichier.type || "image/jpeg";
  let extension = fichier.type.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";

  if (heic) {
    try {
      const converti = await convert({ buffer, format: "JPEG", quality: 0.92 });
      buffer = Buffer.from(converti);
      contentType = "image/jpeg";
      extension = "jpg";
    } catch {
      return NextResponse.json(
        { error: "Impossible de convertir cette photo HEIC. Essayez un autre format (JPEG, PNG)." },
        { status: 400 }
      );
    }
  }

  const cle = `annonces/${annonceId}/${randomUUID()}.${extension}`;
  await uploadToR2(cle, buffer, contentType);

  const [image] = await db
    .insert(annonceImages)
    .values({ annonceId, storageKeyOriginal: cle, position: nombreActuel, status: "ready" })
    .returning({ id: annonceImages.id });

  const url = `/api/uploads/annonces/${image.id}`;
  // `urlThumb/Medium/Large` pointent toutes vers la même image d'origine pour
  // l'instant — pas de pipeline de redimensionnement (pas de worker `travaux`
  // pour ça à ce stade) ; on garde les 3 colonnes pour rester compatible avec
  // la lecture déjà faite dans app/compte/annonces/page.tsx.
  await db
    .update(annonceImages)
    .set({ urlThumb: url, urlMedium: url, urlLarge: url })
    .where(eq(annonceImages.id, image.id));

  return NextResponse.json({ id: image.id, url });
}
