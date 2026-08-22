"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { annonces, paiements } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { stripe, PRIX_URGENT_CENTS, DUREE_URGENT_HEURES } from "@/lib/stripe";
import { urlAbsolue } from "@/lib/site-url";
import { enregistrerPrixObserve } from "@/lib/prix-trajectoire";

// Toutes les créations de session Stripe Checkout passent par ici — un seul
// endroit à changer le jour où LBT bascule vers un autre prestataire
// (Axepta ou autre) pour l'encaissement pour son propre compte.
async function creerSessionCheckout(params: {
  userId: string;
  annonceId: string;
  type: "modification" | "urgent";
  montantCents: number;
  libelle: string;
  donnees?: Record<string, unknown>;
  successPath: string;
  cancelPath: string;
}): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: { name: params.libelle },
          unit_amount: params.montantCents,
        },
        quantity: 1,
      },
    ],
    success_url: await urlAbsolue(params.successPath),
    cancel_url: await urlAbsolue(params.cancelPath),
  });
  if (!session.url) throw new Error("Stripe n'a pas renvoyé d'URL de paiement.");

  await db.insert(paiements).values({
    userId: params.userId,
    annonceId: params.annonceId,
    type: params.type,
    montantCents: params.montantCents,
    stripeSessionId: session.id,
    donnees: params.donnees ?? {},
  });

  return session.url;
}

// Appelé depuis `modifierAnnonce` (lib/actions/annonces.ts) quand la
// modification n'est pas une simple baisse de prix — voir cahier des charges
// §5 Résultat n°6. Renvoie l'URL Stripe, `modifierAnnonce` fait le redirect
// pour garder son propre flux d'erreurs cohérent.
export async function demarrerModificationPayante(
  userId: string,
  annonceId: string,
  donnees: Record<string, unknown>
): Promise<string> {
  return creerSessionCheckout({
    userId,
    annonceId,
    type: "modification",
    montantCents: 400,
    libelle: "Modification d'annonce",
    donnees,
    successPath: `/annonces/${annonceId}?modification=succes`,
    cancelPath: `/compte/annonces/${annonceId}/modifier?modification=annule`,
  });
}

// Déclenché par le vendeur depuis sa propre annonce ou "Mes annonces" —
// réutilise le mécanisme de boost déjà décidé (§5.2), avec badge + filtre.
export async function demarrerAnnonceUrgente(annonceId: string): Promise<void> {
  const session = await auth();
  if (!session) redirect("/compte/connexion");

  const [annonce] = await db.select().from(annonces).where(eq(annonces.id, annonceId)).limit(1);
  if (!annonce || annonce.userId !== session.user.id) {
    throw new Error("Annonce introuvable.");
  }

  const url = await creerSessionCheckout({
    userId: session.user.id,
    annonceId,
    type: "urgent",
    montantCents: PRIX_URGENT_CENTS,
    libelle: "Annonce urgente (48h)",
    successPath: `/annonces/${annonceId}?urgent=succes`,
    cancelPath: `/annonces/${annonceId}?urgent=annule`,
  });
  redirect(url);
}

// Appelé uniquement par le webhook Stripe (app/api/stripe/webhook/route.ts)
// après confirmation du paiement — jamais depuis une action utilisateur, pour
// ne jamais appliquer un effet payant avant que l'argent soit effectivement
// reçu (carte refusée, onglet fermé, etc.).
export async function appliquerPaiementConfirme(stripeSessionId: string): Promise<void> {
  const [paiement] = await db.select().from(paiements).where(eq(paiements.stripeSessionId, stripeSessionId)).limit(1);
  if (!paiement || paiement.statut !== "en_attente") return; // déjà traité ou inconnu : idempotent

  if (paiement.type === "urgent") {
    await db
      .update(annonces)
      .set({ urgentJusqua: new Date(Date.now() + DUREE_URGENT_HEURES * 60 * 60 * 1000) })
      .where(eq(annonces.id, paiement.annonceId!));
  } else if (paiement.type === "modification") {
    const [annonce] = await db.select().from(annonces).where(eq(annonces.id, paiement.annonceId!)).limit(1);
    const donnees = paiement.donnees as Record<string, unknown>;
    await db
      .update(annonces)
      .set({ ...donnees, updatedAt: new Date() })
      .where(eq(annonces.id, paiement.annonceId!));
    if ("prixCents" in donnees) {
      await enregistrerPrixObserve(paiement.annonceId!, donnees.prixCents as number | null, "modification_auteur", annonce?.prixCents);
    }
  }

  await db.update(paiements).set({ statut: "paye", payeA: new Date() }).where(eq(paiements.id, paiement.id));
}
