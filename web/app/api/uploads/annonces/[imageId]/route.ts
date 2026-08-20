import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { annonceImages } from "@/lib/db/schema";
import { readFromR2 } from "@/lib/storage/r2";

export async function GET(_request: Request, { params }: { params: Promise<{ imageId: string }> }) {
  const { imageId } = await params;

  const [image] = await db.select().from(annonceImages).where(eq(annonceImages.id, imageId)).limit(1);
  if (!image) {
    return NextResponse.json({ error: "Image introuvable." }, { status: 404 });
  }

  const object = await readFromR2(image.storageKeyOriginal);
  if (!object) {
    return NextResponse.json({ error: "Fichier introuvable dans le stockage." }, { status: 404 });
  }

  return new NextResponse(object.body, {
    headers: {
      "Content-Type": object.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
