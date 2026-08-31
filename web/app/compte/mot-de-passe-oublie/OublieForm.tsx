"use client";

import { useActionState } from "react";
import { demanderReinitialisation, type ResultatMotDePasse } from "@/lib/actions/mot-de-passe";

const initial: ResultatMotDePasse = { success: true, message: "" };

export function OublieForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: ResultatMotDePasse, formData: FormData) => demanderReinitialisation(formData),
    initial
  );

  return (
    <form action={formAction} style={{ display: "grid", gap: "0.75rem", maxWidth: 360 }}>
      <label>
        Email
        <input type="email" name="email" required autoComplete="email" />
      </label>
      {"error" in state ? (
        <p role="alert" style={{ color: "var(--brand-red, #e2231a)" }}>
          {state.error}
        </p>
      ) : null}
      {"success" in state && state.message ? (
        <p role="status" style={{ color: "var(--text-muted, #69727d)" }}>
          {state.message}
        </p>
      ) : null}
      <button type="submit" disabled={pending}>
        {pending ? "Envoi…" : "Envoyer le lien"}
      </button>
    </form>
  );
}
