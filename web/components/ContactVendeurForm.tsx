"use client";

import { useActionState } from "react";
import { demarrerConversation, type MessageActionResult } from "@/lib/actions/messages";

const initialState: MessageActionResult = { success: true };

export function ContactVendeurForm({ annonceId }: { annonceId: string }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: MessageActionResult, formData: FormData) => demarrerConversation(formData),
    initialState
  );

  return (
    <form action={formAction} className="ad-detail-contact">
      <input type="hidden" name="annonceId" value={annonceId} />
      <textarea name="body" placeholder="Bonjour, votre annonce m'intéresse…" required rows={3} />
      {"error" in state && state.error && <p className="ad-detail-contact-error">{state.error}</p>}
      <button type="submit" className="btn btn-accent" disabled={pending}>
        {pending ? "Envoi…" : "Envoyer un message"}
      </button>
    </form>
  );
}
