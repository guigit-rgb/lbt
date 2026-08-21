"use client";

import { useActionState, useRef } from "react";
import { repondre, type MessageActionResult } from "@/lib/actions/messages";

const initialState: MessageActionResult = { success: true };

export function ReplyForm({ conversationId }: { conversationId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(async (_prev: MessageActionResult, formData: FormData) => {
    const result = await repondre(formData);
    if ("success" in result) {
      formRef.current?.reset();
    }
    return result;
  }, initialState);

  return (
    <form ref={formRef} action={formAction} className="msg-reply">
      <input type="hidden" name="conversationId" value={conversationId} />
      <textarea name="body" placeholder="Écrivez votre message" required rows={2} />
      {"error" in state && state.error && <p className="msg-reply-error">{state.error}</p>}
      <button type="submit" disabled={pending}>
        {pending ? "Envoi…" : "Envoyer"}
      </button>
    </form>
  );
}
