"use server";

import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { annonces, users } from "@/lib/db/schema";
import { enregistrerEvenementContact, identifierAcheteur } from "@/lib/contacts";

// Clic « Voir le numéro » (action §17 n°209, §5.3 Résultat n°2 ligne N2).
//
// Ce que cet événement mesure, et ce qu'il ne mesure pas : c'est une
// **intention**, pas un contact facturable. La §5.3 exclut explicitement
// l'affichage de numéro sans appel abouti (N2), pour une raison qui n'est pas
// négociable — le garage ne peut ni le voir dans son journal d'appels ni le
// contester, et facturer un événement invisible pour le client détruirait la
// crédibilité que la règle de prix doit construire. Il est journalisé quand
// même parce que le rapport `affichages / appels aboutis` est précisément ce
// qu'il faudra connaître pour lire λ le jour où le CPaaS existera.
export async function signalerAffichageNumero(annonceId: string): Promise<void> {
  const session = await auth();

  const [ligne] = await db
    .select({ idVendeur: annonces.userId, vendeurEstPro: users.estPro })
    .from(annonces)
    .innerJoin(users, eq(users.id, annonces.userId))
    .where(eq(annonces.id, annonceId))
    .limit(1);
  if (!ligne) return;

  // N6 de la §5.3 — un vendeur qui regarde sa propre annonce n'est pas un
  // contact. Le bouton n'est déjà pas affiché au propriétaire, mais l'action
  // serveur est appelable directement.
  if (session?.user.id && session.user.id === ligne.idVendeur) return;

  const identite = await identifierAcheteur(session?.user.id ?? null);
  await enregistrerEvenementContact({
    evenement: "affichage_numero",
    canal: "telephone",
    idVendeur: ligne.idVendeur,
    idAnnonce: annonceId,
    vendeurEstPro: ligne.vendeurEstPro,
    identite,
  });
}
