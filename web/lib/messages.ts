import { alias } from "drizzle-orm/pg-core";
import { asc, desc, eq, inArray, or } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { annonces, conversations, messages, users } from "@/lib/db/schema";
import { getCoverUrls } from "@/lib/annonce-display";

export interface ConversationSummary {
  id: string;
  annonceId: string;
  annonceTitre: string;
  annoncePhotoUrl?: string;
  autreParticipantNom: string;
  dernierMessage: string | null;
  dernierMessageAt: Date;
  nonLus: number;
}

// Liste des conversations d'un utilisateur, qu'il y soit acheteur ou
// vendeur — une seule requête par table plutôt qu'une requête par
// conversation, le volume par utilisateur restant faible.
export async function listerConversations(userId: string): Promise<ConversationSummary[]> {
  const acheteur = alias(users, "acheteur");
  const vendeur = alias(users, "vendeur");

  const rows = await db
    .select({
      id: conversations.id,
      annonceId: conversations.annonceId,
      annonceTitre: annonces.titre,
      acheteurId: conversations.acheteurId,
      vendeurId: conversations.vendeurId,
      acheteurNom: acheteur.displayName,
      vendeurNom: vendeur.displayName,
      createdAt: conversations.createdAt,
      lastMessageAt: conversations.lastMessageAt,
    })
    .from(conversations)
    .innerJoin(annonces, eq(conversations.annonceId, annonces.id))
    .innerJoin(acheteur, eq(conversations.acheteurId, acheteur.id))
    .innerJoin(vendeur, eq(conversations.vendeurId, vendeur.id))
    .where(or(eq(conversations.acheteurId, userId), eq(conversations.vendeurId, userId)));

  if (rows.length === 0) return [];

  const ids = rows.map((r) => r.id);
  const [tousMessages, covers] = await Promise.all([
    db.select().from(messages).where(inArray(messages.conversationId, ids)).orderBy(desc(messages.createdAt)),
    getCoverUrls(rows.map((r) => r.annonceId)),
  ]);

  return rows
    .map((r) => {
      const msgs = tousMessages.filter((m) => m.conversationId === r.id);
      const dernier = msgs[0];
      const nonLus = msgs.filter((m) => m.senderId !== userId && m.readAt == null).length;
      return {
        id: r.id,
        annonceId: r.annonceId,
        annonceTitre: r.annonceTitre,
        annoncePhotoUrl: covers.get(r.annonceId),
        autreParticipantNom: r.acheteurId === userId ? r.vendeurNom : r.acheteurNom,
        dernierMessage: dernier?.body ?? null,
        dernierMessageAt: r.lastMessageAt ?? r.createdAt,
        nonLus,
      };
    })
    .sort((a, b) => b.dernierMessageAt.getTime() - a.dernierMessageAt.getTime());
}

export interface MessageItem {
  id: string;
  body: string;
  createdAt: Date;
  estMoi: boolean;
}

export interface ConversationDetail {
  id: string;
  annonceId: string;
  annonceTitre: string;
  annoncePrixCents: number | null;
  annoncePhotoUrl?: string;
  autreParticipantId: string;
  autreParticipantNom: string;
  autreParticipantMembreDepuis: Date;
  autreParticipantEstPro: boolean;
  messages: MessageItem[];
}

// Retourne `null` si la conversation n'existe pas ou si l'utilisateur n'en
// est ni l'acheteur ni le vendeur — une seule vérification d'accès, à la
// source, plutôt que répétée dans chaque appelant.
export async function chargerConversation(conversationId: string, userId: string): Promise<ConversationDetail | null> {
  const acheteur = alias(users, "acheteur");
  const vendeur = alias(users, "vendeur");

  const [conv] = await db
    .select({
      id: conversations.id,
      annonceId: conversations.annonceId,
      annonceTitre: annonces.titre,
      annoncePrixCents: annonces.prixCents,
      acheteurId: conversations.acheteurId,
      vendeurId: conversations.vendeurId,
      acheteurNom: acheteur.displayName,
      vendeurNom: vendeur.displayName,
      acheteurCreatedAt: acheteur.createdAt,
      vendeurCreatedAt: vendeur.createdAt,
      acheteurEstPro: acheteur.estPro,
      vendeurEstPro: vendeur.estPro,
    })
    .from(conversations)
    .innerJoin(annonces, eq(conversations.annonceId, annonces.id))
    .innerJoin(acheteur, eq(conversations.acheteurId, acheteur.id))
    .innerJoin(vendeur, eq(conversations.vendeurId, vendeur.id))
    .where(eq(conversations.id, conversationId))
    .limit(1);

  if (!conv || (conv.acheteurId !== userId && conv.vendeurId !== userId)) {
    return null;
  }

  const [msgs, covers] = await Promise.all([
    db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(asc(messages.createdAt)),
    getCoverUrls([conv.annonceId]),
  ]);

  const estAcheteur = conv.acheteurId === userId;

  return {
    id: conv.id,
    annonceId: conv.annonceId,
    annonceTitre: conv.annonceTitre,
    annoncePrixCents: conv.annoncePrixCents,
    annoncePhotoUrl: covers.get(conv.annonceId),
    autreParticipantId: estAcheteur ? conv.vendeurId : conv.acheteurId,
    autreParticipantNom: estAcheteur ? conv.vendeurNom : conv.acheteurNom,
    autreParticipantMembreDepuis: estAcheteur ? conv.vendeurCreatedAt : conv.acheteurCreatedAt,
    autreParticipantEstPro: estAcheteur ? conv.vendeurEstPro : conv.acheteurEstPro,
    messages: msgs.map((m) => ({ id: m.id, body: m.body, createdAt: m.createdAt, estMoi: m.senderId === userId })),
  };
}
