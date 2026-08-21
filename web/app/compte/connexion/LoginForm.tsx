"use client";

import { useActionState, useState } from "react";
import { login, type AuthActionResult } from "@/lib/actions/auth";

const initialState: AuthActionResult = { success: true };

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: AuthActionResult, formData: FormData) => login(formData),
    initialState
  );
  const [motDePasseVisible, setMotDePasseVisible] = useState(false);

  return (
    <form action={formAction} className="auth-form">
      {next && <input type="hidden" name="next" value={next} />}

      <div>
        <label className="auth-label" htmlFor="email">
          Adresse email
        </label>
        <input
          className="auth-input"
          id="email"
          type="email"
          name="email"
          required
          autoComplete="email"
        />
      </div>

      <div>
        <label className="auth-label" htmlFor="password">
          Mot de passe
        </label>
        <div className="auth-password">
          <input
            className="auth-input"
            id="password"
            type={motDePasseVisible ? "text" : "password"}
            name="password"
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            className="auth-reveal"
            onClick={() => setMotDePasseVisible((visible) => !visible)}
            aria-pressed={motDePasseVisible}
            aria-label={motDePasseVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {motDePasseVisible ? "🙈" : "👁"}
          </button>
        </div>
      </div>

      {"error" in state && state.error ? (
        <p role="alert" className="auth-error">
          {state.error}
        </p>
      ) : null}

      <button type="submit" className="btn btn-accent auth-submit" disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
