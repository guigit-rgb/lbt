import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { annonces } from "@/lib/db/schema";
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

  return <ModifierAnnonceForm annonce={annonce} />;
}
