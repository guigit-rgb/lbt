"use client";

import { useActionState, useState } from "react";
import { mettreAJourProfilPro, type ProfilActionResult } from "@/lib/actions/profil";

const initialState: ProfilActionResult = { success: true };

export function ProfilProForm({
  estPro,
  siret,
  telephone,
}: {
  estPro: boolean;
  siret: string;
  telephone: string;
}) {
  const [checked, setChecked] = useState(estPro);
  const [state, formAction, pending] = useActionState(
    async (_prev: ProfilActionResult, formData: FormData) => mettreAJourProfilPro(formData),
    initialState
  );

  return (
    <form action={formAction} className="profil-form">
      <label className="profil-field">
        <span>Téléphone</span>
        <input type="tel" name="telephone" defaultValue={telephone} placeholder="06 12 34 56 78" />
      </label>

      <label className="profil-field profil-field-checkbox">
        <input
          type="checkbox"
          name="estPro"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <span>Je vends en tant que professionnel</span>
      </label>

      {checked && (
        <label className="profil-field">
          <span>N° SIRET (14 chiffres)</span>
          <input type="text" name="siret" defaultValue={siret} inputMode="numeric" maxLength={14} />
        </label>
      )}

      {"error" in state && state.error ? (
        <p role="alert" className="profil-form-error">
          {state.error}
        </p>
      ) : (
        state !== initialState && "success" in state && state.success && (
          <p className="profil-form-success">Profil mis à jour.</p>
        )
      )}

      <button type="submit" className="btn btn-accent profil-form-submit" disabled={pending}>
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
