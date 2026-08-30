import { NextResponse } from "next/server";
import { suggerer } from "@/lib/suggestions-recherche";

// Suggestions à la frappe (§14.10, action §17 n°222). Route publique, servie
// **entièrement depuis la mémoire du processus** : `lib/suggestions-recherche.ts`
// n'ouvre aucune connexion à la base et ne fait aucun appel réseau, ce qui est
// la raison pour laquelle cette route n'a ni authentification ni limiteur de
// fréquence (contrairement à /api/ai/recherche-vehicule, qui déclenche un appel
// IA facturé — cf. lib/rate-limit.ts). Un robot qui la martèle ne consomme
// qu'un peu de CPU.
//
// `force-static` serait faux (la réponse dépend de `q`) ; en revanche la
// réponse est **immuable à référentiel constant**, d'où un `Cache-Control`
// public généreux : le CDN absorbe les frappes répétées d'un même préfixe, qui
// sont le cas le plus fréquent (tout le monde tape « cl », « cli », « clio »).
// À revoir le jour où une suggestion portera un compteur d'annonces
// (action n°236) : elle cesserait d'être immuable.

export async function GET(request: Request): Promise<Response> {
  const q = new URL(request.url).searchParams.get("q") ?? "";
  // Garde-fou de taille : au-delà, ce n'est plus une frappe, et la comparaison
  // ne coûterait rien mais la réponse serait absurde.
  const suggestions = suggerer(q.slice(0, 80));
  return NextResponse.json(
    { suggestions },
    { headers: { "Cache-Control": "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400" } }
  );
}
