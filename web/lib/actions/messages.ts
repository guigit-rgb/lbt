"use server";

import { and, eq, isNull, ne } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { annonces, conversations, messages, users } from "@/lib/db/schema";
import { enregistrerEvenementContact, identifierAcheteur } from "@/lib/contacts";

export type MessageActionResult = { error: string } | { success: true };

type ConversationTrouvee = { id: string; creee: boolean; vendeurId: string; vendeurEstPro: boolean };

// Retrouve la conversation acheteur/annonce existante ou en crée une — une
// contrainte unique en base garantit qu'un acheteur n'a qu'un seul fil par
// annonce, comme sur leboncoin. Partagé entre l'envoi d'un message et la
// notification automatique d'intérêt (favoris).
//
// `creee` distingue le premier message du fil des suivants : c'est la
// condition du Q1 de la §5.3 (« premier message du fil »), et sans elle le
// journal de mise en relation compterait une réponse comme une prise de
// contact neuve.
async function trouverOuCreerConversation(annonceId: string, acheteurId: string): Promise<ConversationTrouvee | { error: string }> {
  const [annonce] = await db
    .select({ userId: annonces.userId, vendeurEstPro: users.estPro })
    .from(annonces)
    .innerJoin(users, eq(users.id, annonces.userId))
    .where(eq(annonces.id, annonceId))
    .limit(1);
  if (!annonce) {
    return { error: "Annonce introuvable." };
  }
  if (annonce.userId === acheteurId) {
    return { error: "Vous ne pouvez pas vous envoyer un message sur votre propre annonce." };
  }

  const [existante] = await db
    .select({ id: conversations.id })
    .from(conversations)
    .where(and(eq(conversations.annonceId, annonceId), eq(conversations.acheteurId, acheteurId)))
    .limit(1);

  if (existante) {
    return {
      id: existante.id,
      creee: false,
      vendeurId: annonce.userId,
      vendeurEstPro: annonce.vendeurEstPro,
    };
  }

  const [creee] = await db
    .insert(conversations)
    .values({ annonceId, acheteurId, vendeurId: annonce.userId })
    .returning({ id: conversations.id });

  return {
    id: creee.id,
    creee: true,
    vendeurId: annonce.userId,
    vendeurEstPro: annonce.vendeurEstPro,
  };
}

// Journalise une mise en relation par la messagerie (action §17 n°209).
// Deux fils ouverts par le même acheteur sur deux annonces du même vendeur
// produisent bien deux lignes : c'est la clé de déduplication
// `(empreinte_acheteur, id_vendeur)` sur 30 jours de la §5.3 (R2) qui les
// ramène à un seul contact au comptage, pas l'écriture qui les supprime — un
// journal qui décide déjà ne se rejoue plus.
async function journaliserContactMessagerie(
  evenement: "premier_message" | "notification_interet",
  conv: ConversationTrouvee,
  annonceId: string,
  acheteurId: string
): Promise<void> {
  const identite = await identifierAcheteur(acheteurId);
  await enregistrerEvenementContact({
    evenement,
    canal: "messagerie",
    idVendeur: conv.vendeurId,
    idAnnonce: annonceId,
    vendeurEstPro: conv.vendeurEstPro,
    identite,
    idPreuve: conv.id,
  });
}

async function poserMessage(conversationId: string, senderId: string, body: string): Promise<void> {
  await db.insert(messages).values({ conversationId, senderId, body });
  await db.update(conversations).set({ lastMessageAt: new Date() }).where(eq(conversations.id, conversationId));
}

// Démarre une conversation depuis la page d'une annonce — ou réutilise celle
// qui existe déjà pour ce couple annonce/acheteur (contrainte unique en
// base : un acheteur n'a qu'un seul fil par annonce, comme sur leboncoin).
export async function demarrerConversation(formData: FormData): Promise<MessageActionResult> {
  const session = await auth();
  if (!session?.user.id) {
    return { error: "Vous devez être connecté pour contacter le vendeur." };
  }

  const annonceId = formData.get("annonceId");
  const body = formData.get("body");
  if (typeof annonceId !== "string" || typeof body !== "string" || !body.trim()) {
    return { error: "Le message ne peut pas être vide." };
  }

  const conv = await trouverOuCreerConversation(annonceId, session.user.id);
  if ("error" in conv) return conv;

  await poserMessage(conv.id, session.user.id, body.trim());
  // Seul le premier message du fil est une prise de contact (§5.3, Q1) ;
  // les suivants sont des échanges dans un contact déjà compté.
  if (conv.creee) {
    await journaliserContactMessagerie("premier_message", conv, annonceId, session.user.id);
  }
  redirect(`/compte/messages/${conv.id}`);
}

// Message automatique envoyé au vendeur quand un acheteur ajoute son annonce
// aux favoris — sur confirmation explicite (§17, capture leboncoin fournie
// par Nicolas : l'ajout aux favoris est immédiat, la notification est un
// second geste volontaire, jamais automatique).
export async function envoyerNotificationInteret(annonceId: string): Promise<MessageActionResult> {
  const session = await auth();
  if (!session?.user.id) {
    return { error: "Vous devez être connecté." };
  }

  const conv = await trouverOuCreerConversation(annonceId, session.user.id);
  if ("error" in conv) return conv;

  await poserMessage(conv.id, session.user.id, `${session.user.name} a manifesté un intérêt pour votre annonce.`);
  // Journalisé sous un événement distinct, et c'est le point à ne pas rater :
  // ce message est produit par un clic sur « prévenir le vendeur » après un
  // favori, pas par un acheteur qui écrit. Le confondre avec `premier_message`
  // gonflerait le compteur d'un geste que le garage ne reconnaîtrait pas dans
  // sa boîte comme une demande — exactement ce que la règle générale de la
  // §5.3 interdit (ne compter que ce que le garage peut voir *et* qualifier).
  await journaliserContactMessagerie("notification_interet", conv, annonceId, session.user.id);
  revalidatePath("/compte/messages");
  return { success: true };
}

export async function repondre(formData: FormData): Promise<MessageActionResult> {
  const session = await auth();
  if (!session?.user.id) {
    return { error: "Vous devez être connecté." };
  }

  const conversationId = formData.get("conversationId");
  const body = formData.get("body");
  if (typeof conversationId !== "string" || typeof body !== "string" || !body.trim()) {
    return { error: "Le message ne peut pas être vide." };
  }

  const [conv] = await db
    .select({ acheteurId: conversations.acheteurId, vendeurId: conversations.vendeurId })
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);
  if (!conv || (conv.acheteurId !== session.user.id && conv.vendeurId !== session.user.id)) {
    return { error: "Conversation introuvable." };
  }

  await db.insert(messages).values({ conversationId, senderId: session.user.id, body: body.trim() });
  await db.update(conversations).set({ lastMessageAt: new Date() }).where(eq(conversations.id, conversationId));

  revalidatePath(`/compte/messages/${conversationId}`);
  revalidatePath("/compte/messages");
  return { success: true };
}

// Marque lus les messages de l'autre participant — appelé à l'ouverture d'un
// fil, jamais côté liste (sinon ouvrir la liste suffirait à tout marquer lu).
export async function marquerLu(conversationId: string, userId: string): Promise<void> {
  await db
    .update(messages)
    .set({ readAt: new Date() })
    .where(and(eq(messages.conversationId, conversationId), ne(messages.senderId, userId), isNull(messages.readAt)));
}
