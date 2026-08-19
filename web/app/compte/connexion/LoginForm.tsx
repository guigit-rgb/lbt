"use client";

import { useActionState } from "react";
import { login, type AuthActionResult } from "@/lib/actions/auth";

const initialState: AuthActionResult = { success: true };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: AuthActionResult, formData: FormData) => login(formData),
    initialState
  );

  return (
    <form action={formAction} style={{ display: "grid", gap: "0.75rem", maxWidth: 360 }}>
      <label>
        Email
        <input type="email" name="email" required autoComplete="email" />
      </label>
      <label>
        Mot de passe
        <input type="password" name="password" required autoComplete="current-password" />
      </label>
      {"error" in state && state.error ? (
        <p role="alert" style={{ color: "var(--brand-red, #e2231a)" }}>
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
