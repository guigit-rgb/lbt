"use server";

import { and, eq, isNull, ne } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { annonces, conversations, messages } from "@/lib/db/schema";

export type MessageActionResult = { error: string } | { success: true };

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

  const [annonce] = await db
    .select({ userId: annonces.userId })
    .from(annonces)
    .where(eq(annonces.id, annonceId))
    .limit(1);
  if (!annonce) {
    return { error: "Annonce introuvable." };
  }
  if (annonce.userId === session.user.id) {
    return { error: "Vous ne pouvez pas vous envoyer un message sur votre propre annonce." };
  }

  let [conv] = await db
    .select({ id: conversations.id })
    .from(conversations)
    .where(and(eq(conversations.annonceId, annonceId), eq(conversations.acheteurId, session.user.id)))
    .limit(1);

  if (!conv) {
    [conv] = await db
      .insert(conversations)
      .values({ annonceId, acheteurId: session.user.id, vendeurId: annonce.userId })
      .returning({ id: conversations.id });
  }

  await db.insert(messages).values({ conversationId: conv.id, senderId: session.user.id, body: body.trim() });
  await db.update(conversations).set({ lastMessageAt: new Date() }).where(eq(conversations.id, conv.id));

  redirect(`/compte/messages/${conv.id}`);
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
