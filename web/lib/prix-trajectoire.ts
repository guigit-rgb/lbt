import { db } from "@/lib/db/client";
import { annoncePrixHistorique } from "@/lib/db/schema";

type SourcePrix = (typeof annoncePrixHistorique.$inferInsert)["source"];

// Enregistre un prix *observé* dans la trajectoire de l'annonce (§6.6 R3).
// Deux règles, et elles ont chacune une raison :
//  - on n'écrit que si le prix a réellement changé, sinon toute modification
//    de texte gonflerait la table de doublons et fausserait le comptage des
//    baisses (« trois baisses en quarante jours » doit rester lisible) ;
//  - on n'écrit jamais d'`update` : une trajectoire ne se corrige pas, elle
//    s'allonge. Une correction de modération est une observation `back_office`.
// Module à part (pas dans lib/actions/annonces.ts) pour que lib/actions/paiements.ts
// puisse l'appeler sans créer d'import circulaire entre les deux fichiers "use server".
export async function enregistrerPrixObserve(
  annonceId: string,
  prixCents: number | null | undefined,
  source: SourcePrix,
  prixPrecedent?: number | null
): Promise<void> {
  const valeur = prixCents ?? null;
  if (prixPrecedent !== undefined && (prixPrecedent ?? null) === valeur) {
    return;
  }
  await db.insert(annoncePrixHistorique).values({ annonceId, prixCents: valeur, source });
}
