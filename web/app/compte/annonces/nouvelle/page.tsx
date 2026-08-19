import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import NouvelleAnnonceForm from "@/components/NouvelleAnnonceForm";

export default async function NouvelleAnnoncePage() {
  const session = await auth();

  // Le proxy protège déjà cette route ; revérification explicite ici
  // (règle Next.js 16 : ne jamais compter sur le proxy seul).
  if (!session) {
    redirect("/compte/connexion");
  }

  return <NouvelleAnnonceForm />;
}
