import { headers } from "next/headers";

// Construit une URL absolue vers ce même déploiement (succès/annulation
// Stripe Checkout, qui exige des URLs absolues) à partir de l'en-tête Host —
// fonctionne aussi bien en local qu'en preview/production Vercel, sans
// variable d'environnement à tenir à jour à chaque déploiement.
export async function urlAbsolue(chemin: string): Promise<string> {
  const en_tetes = await headers();
  const host = en_tetes.get("host") ?? "localhost:3000";
  const protocole = host.startsWith("localhost") ? "http" : "https";
  return `${protocole}://${host}${chemin}`;
}
