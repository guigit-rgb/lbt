"use client";

import Link from "next/link";
import { useActionState } from "react";
import { reinitialiser, type ResultatMotDePasse } from "@/lib/actions/mot-de-passe";

const initial: ResultatMotDePasse = { success: true, message: "" };

export function ReinitialiserForm({ jeton }: { jeton: string }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: ResultatMotDePasse, formData: FormData) => reinitialiser(formData),
    initial
  );

  if ("success" in state && state.message) {
    return (
      <p role="status">
        {state.message} <Link href="/compte/connexion">Se connecter</Link>
      </p>
    );
  }

  return (
    <form action={formAction} style={{ display: "grid", gap: "0.75rem", maxWidth: 360 }}>
      <input type="hidden" name="jeton" value={jeton} />
      <label>
        Nouveau mot de passe
        <input type="password" name="password" required minLength={8} autoComplete="new-password" />
      </label>
      <label>
        Confirmation
        <input
          type="password"
          name="passwordConfirmation"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </label>
      {"error" in state ? (
        <p role="alert" style={{ color: "var(--brand-red, #e2231a)" }}>
          {state.error}{" "}
          <Link href="/compte/mot-de-passe-oublie">Refaire une demande</Link>
        </p>
      ) : null}
      <button type="submit" disabled={pending}>
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
