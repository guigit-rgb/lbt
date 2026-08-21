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
    <form action={formAction} style={{ display: "grid", gap: "0.9rem" }}>
      <label>
        Téléphone (facultatif)
        <input type="tel" name="telephone" defaultValue={telephone} placeholder="06 12 34 56 78" />
      </label>

      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <input
          type="checkbox"
          name="estPro"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        Je vends en tant que professionnel
      </label>

      {checked && (
        <label>
          N° SIRET (14 chiffres)
          <input type="text" name="siret" defaultValue={siret} inputMode="numeric" maxLength={14} />
        </label>
      )}

      {"error" in state && state.error ? (
        <p role="alert" style={{ color: "var(--brand-red, #e2231a)" }}>
          {state.error}
        </p>
      ) : (
        state !== initialState && "success" in state && state.success && (
          <p style={{ color: "var(--muted)" }}>Profil mis à jour.</p>
        )
      )}

      <button type="submit" disabled={pending} style={{ justifySelf: "start" }}>
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
