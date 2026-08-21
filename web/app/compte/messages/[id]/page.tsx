import Link from "next/link";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { chargerConversation } from "@/lib/messages";
import { marquerLu } from "@/lib/actions/messages";
import { formatPrix } from "@/lib/annonce-display";
import { ReplyForm } from "./ReplyForm";

export const dynamic = "force-dynamic";

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session) {
    redirect("/compte/connexion");
  }

  const conversation = await chargerConversation(id, session.user.id);
  if (!conversation) {
    notFound();
  }

  await marquerLu(id, session.user.id);

  return (
    <section className="msg-panel">
      <div className="msg-thread">
        <div className="msg-thread-header">
          <strong>{conversation.autreParticipantNom}</strong>
        </div>

        <div className="msg-thread-body">
          {conversation.messages.map((m) => (
            <p key={m.id} className={`msg-bubble${m.estMoi ? " mine" : ""}`}>
              {m.body}
            </p>
          ))}
        </div>

        <ReplyForm conversationId={conversation.id} />
      </div>

      <aside className="msg-ad-card">
        <div className={`msg-ad-thumb${conversation.annoncePhotoUrl ? "" : " ic-teapot"}`}>
          {conversation.annoncePhotoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={conversation.annoncePhotoUrl} alt="" />
          )}
        </div>
        <div>
          <p className="msg-ad-titre">{conversation.annonceTitre}</p>
          <p className="msg-ad-prix">{formatPrix(conversation.annoncePrixCents)}</p>
          <Link href={`/annonces/${conversation.annonceId}`}>Voir l&apos;annonce</Link>
        </div>
      </aside>
    </section>
  );
}
