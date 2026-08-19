"use client";

import { useActionState } from "react";
import { signup, type AuthActionResult } from "@/lib/actions/auth";

const initialState: AuthActionResult = { success: true };

export function SignupForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: AuthActionResult, formData: FormData) => signup(formData),
    initialState
  );

  return (
    <form action={formAction} style={{ display: "grid", gap: "0.75rem", maxWidth: 360 }}>
      <label>
        Nom affiché
        <input type="text" name="displayName" required autoComplete="name" />
      </label>
      <label>
        Email
        <input type="email" name="email" required autoComplete="email" />
      </label>
      <label>
        Mot de passe
        <input
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </label>
      <label>
        Code d&apos;invitation
        <input type="text" name="inviteCode" required />
      </label>
      {"error" in state && state.error ? (
        <p role="alert" style={{ color: "var(--brand-red, #e2231a)" }}>
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={pending}>
        {pending ? "Création…" : "Créer mon compte"}
      </button>
    </form>
  );
}
