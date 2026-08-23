"use client";

import type { FilterField } from "@/lib/listing-config";
import { ATTRIBUT_ARRAY_KEYS } from "@/lib/attribut-keys";

export type AttributsValues = Record<string, string>;

function toggleDansListe(courant: string, valeur: string): string {
  const valeurs = courant ? courant.split(",").filter(Boolean) : [];
  const suivant = valeurs.includes(valeur) ? valeurs.filter((v) => v !== valeur) : [...valeurs, valeur];
  return suivant.join(",");
}

function estArray(key: string): boolean {
  return (ATTRIBUT_ARRAY_KEYS as readonly string[]).includes(key);
}

// Rend les champs propres à une sous-catégorie (lib/subcategory-filters.ts)
// pour le dépôt et la modification d'annonce — un moteur générique unique
// plutôt que du JSX dupliqué pour chacune des ~50 sous-catégories
// leboncoin.fr (retour de Nicolas du 2026-08-23, "détaillé partout").
// Une seule valeur par champ à ce stade (pas de min/max : une annonce a UNE
// surface, UNE puissance — le widget "range" ne prend deux bornes que côté
// filtre de recherche, cf. components/CategoryFilters.tsx).
export default function AttributsDynamiques({
  fields,
  values,
  onChange,
}: {
  fields: FilterField[];
  values: AttributsValues;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <>
      {fields.map((field) => {
        if (field.widget === "range") {
          return (
            <label key={field.key}>
              <span className="depot-question">{field.label}</span>
              <input
                type="number"
                className="depot-input"
                value={values[field.key] ?? ""}
                onChange={(e) => onChange(field.key, e.target.value)}
              />
            </label>
          );
        }

        if (!field.catalogue) {
          // Filtre "référentiel propre" (Marque, Produit, Matière...) sans
          // liste fermée fournie par leboncoin — saisie libre, comme
          // "Modèle" pour les véhicules aujourd'hui.
          return (
            <label key={field.key}>
              <span className="depot-question">{field.label}</span>
              <input
                className="depot-input"
                value={values[field.key] ?? ""}
                onChange={(e) => onChange(field.key, e.target.value)}
              />
            </label>
          );
        }

        const multiple = field.widget === "checkbox" || estArray(field.key);
        const courant = values[field.key] ?? "";
        const selection = courant.split(",").filter(Boolean);

        return (
          <div key={field.key}>
            <span className="depot-question">{field.label}</span>
            <div className="depot-chip-row">
              {field.catalogue.map((valeur) => (
                <button
                  key={valeur}
                  type="button"
                  className={`depot-chip${selection.includes(valeur) ? " active" : ""}`}
                  onClick={() => onChange(field.key, multiple ? toggleDansListe(courant, valeur) : valeur)}
                >
                  {valeur}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
