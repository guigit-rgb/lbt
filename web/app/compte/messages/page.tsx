import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { listerConversations } from "@/lib/messages";

export const dynamic = "force-dynamic";

export default async function MessagesIndexPage() {
  const session = await auth();
  if (!session) {
    redirect("/compte/connexion");
  }

  const conversations = await listerConversations(session.user.id);
  if (conversations.length > 0) {
    redirect(`/compte/messages/${conversations[0].id}`);
  }

  return (
    <section className="msg-panel msg-panel-empty">
      <p>Sélectionnez une conversation dans la liste, ou contactez un vendeur depuis une annonce.</p>
    </section>
  );
}
