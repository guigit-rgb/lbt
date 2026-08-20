import { eq, asc } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { annonces, annonceImages } from "@/lib/db/schema";
import ModifierAnnonceForm from "@/components/ModifierAnnonceForm";

export default async function ModifierAnnoncePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    redirect("/compte/connexion");
  }

  const [annonce] = await db.select().from(annonces).where(eq(annonces.id, id)).limit(1);
  if (!annonce || annonce.userId !== session.user.id) {
    notFound();
  }

  const photos = await db
    .select({ id: annonceImages.id, url: annonceImages.urlThumb })
    .from(annonceImages)
    .where(eq(annonceImages.annonceId, id))
    .orderBy(asc(annonceImages.position));

  return (
    <ModifierAnnonceForm
      annonce={annonce}
      photosInitiales={photos.map((p) => ({ id: p.id, url: p.url ?? `/api/uploads/annonces/${p.id}` }))}
    />
  );
}
