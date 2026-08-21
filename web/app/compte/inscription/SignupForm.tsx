"use client";

import { useActionState, useState } from "react";
import { signup, type AuthActionResult } from "@/lib/actions/auth";

const initialState: AuthActionResult = { success: true };

export function SignupForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: AuthActionResult, formData: FormData) => signup(formData),
    initialState
  );
  const [motDePasseVisible, setMotDePasseVisible] = useState(false);

  return (
    <form action={formAction} className="auth-form">
      {next && <input type="hidden" name="next" value={next} />}

      <div>
        <label className="auth-label" htmlFor="displayName">
          Nom affiché
          <span className="auth-hint">Visible par les acheteurs sur vos annonces.</span>
        </label>
        <input
          className="auth-input"
          id="displayName"
          type="text"
          name="displayName"
          required
          autoComplete="name"
        />
      </div>

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
          <span className="auth-hint">8 caractères minimum.</span>
        </label>
        <div className="auth-password">
          <input
            className="auth-input"
            id="password"
            type={motDePasseVisible ? "text" : "password"}
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
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

      <div>
        <label className="auth-label" htmlFor="inviteCode">
          Code d&apos;invitation
          <span className="auth-hint">
            Le bon truc est en communauté vérifiée : on y entre invité par un proche ou un collègue.
          </span>
        </label>
        <input className="auth-input" id="inviteCode" type="text" name="inviteCode" required />
      </div>

      {"error" in state && state.error ? (
        <p role="alert" className="auth-error">
          {state.error}
        </p>
      ) : null}

      <button type="submit" className="btn btn-accent auth-submit" disabled={pending}>
        {pending ? "Création…" : "Créer mon compte"}
      </button>
    </form>
  );
}
