import Link from "next/link";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { auth } from "@/lib/auth";
import { listerConversations } from "@/lib/messages";

export const dynamic = "force-dynamic";

function formatHeure(date: Date): string {
  const jours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (jours <= 0) return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  if (jours === 1) return "hier";
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default async function MessagesLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) {
    redirect("/compte/connexion");
  }

  const conversations = await listerConversations(session.user.id);

  return (
    <>
      <SiteHeader />

      <main className="wrap msg-shell">
        <aside className="msg-list">
          <h1 className="msg-list-title">Messages</h1>
          {conversations.length === 0 ? (
            <p className="msg-empty">
              Aucune conversation pour l&apos;instant. Elles apparaîtront ici dès qu&apos;un acheteur vous
              contactera, ou que vous contactez un vendeur depuis une annonce.
            </p>
          ) : (
            conversations.map((c) => (
              <Link key={c.id} href={`/compte/messages/${c.id}`} className="msg-list-item">
                <div className={`msg-list-thumb${c.annoncePhotoUrl ? "" : " ic-teapot"}`}>
                  {c.annoncePhotoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.annoncePhotoUrl} alt="" />
                  )}
                </div>
                <div className="msg-list-body">
                  <div className="msg-list-top">
                    <span className="msg-list-titre">{c.annonceTitre}</span>
                    <span className="msg-list-time">{formatHeure(c.dernierMessageAt)}</span>
                  </div>
                  <p className="msg-list-snippet">
                    <strong>{c.autreParticipantNom}</strong>
                    {c.dernierMessage ? ` — ${c.dernierMessage}` : ""}
                  </p>
                </div>
                {c.nonLus > 0 && <span className="msg-list-badge">{c.nonLus}</span>}
              </Link>
            ))
          )}
        </aside>

        {children}
      </main>

      <SiteFooter />
    </>
  );
}
