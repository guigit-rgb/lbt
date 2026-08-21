"use client";

import { useTransition } from "react";
import { supprimerRecherche } from "@/lib/actions/recherches";

export function SupprimerRechercheButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="btn btn-outline recherche-supprimer"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await supprimerRecherche(id);
        })
      }
    >
      Supprimer
    </button>
  );
}
