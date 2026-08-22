// Limiteur de fréquence minimal, en mémoire — pour la recherche IA publique
// (app/api/ai/recherche-vehicule/route.ts), la seule route de LBT qui déclenche
// un appel IA coûteux sans authentification préalable.
//
// Limite connue et acceptée : cette mémoire vit par instance de fonction
// serverless (Vercel peut router deux requêtes du même visiteur vers deux
// instances différentes, ou en créer une neuve à froid) — ce n'est donc pas
// une protection étanche contre un abus distribué. C'est un garde-fou low-cost
// contre le cas le plus probable (un même visiteur ou un script simple qui
// boucle), pas une solution de production complète. Si l'abus devient un
// problème réel, la suite logique est un compteur partagé (ex. Upstash
// Redis), pas d'agrandir cette Map.
const fenetres = new Map<string, number[]>();
const FENETRE_MS = 60_000;
const MAX_PAR_FENETRE = 8;

export function autoriseParIp(ip: string): boolean {
  const maintenant = Date.now();
  const horodatages = (fenetres.get(ip) ?? []).filter((t) => maintenant - t < FENETRE_MS);
  if (horodatages.length >= MAX_PAR_FENETRE) {
    fenetres.set(ip, horodatages);
    return false;
  }
  horodatages.push(maintenant);
  fenetres.set(ip, horodatages);
  return true;
}

export function ipDepuisRequete(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "inconnue";
}
