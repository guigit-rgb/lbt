"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Categorie } from "@/lib/db/schema";
import type { FilterField } from "@/lib/listing-config";
import { sauvegarderRecherche } from "@/lib/actions/recherches";
import { LocationFilter } from "@/components/LocationFilter";

export default function CategoryFilters({
  basePath,
  categorie,
  filters,
  currentValues,
  options,
  currentTri,
  resultCount,
}: {
  basePath: string;
  categorie: Categorie;
  filters: FilterField[];
  currentValues: Record<string, string>;
  options: Record<string, string[]>;
  currentTri: string;
  resultCount: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [etatSauvegarde, setEtatSauvegarde] = useState<"idle" | "enregistrement" | "ok" | "erreur">("idle");

  async function handleSauvegarder() {
    setEtatSauvegarde("enregistrement");
    const res = await sauvegarderRecherche(categorie, currentValues, currentTri);
    if ("error" in res) {
      setEtatSauvegarde("erreur");
      if (res.error.includes("connecté")) router.push("/compte/connexion");
    } else {
      setEtatSauvegarde("ok");
    }
  }

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function navigateWith(key: string, value: string) {
    const params = new URLSearchParams(currentValues);
    if (currentTri !== "pertinence") params.set("tri", currentTri);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${basePath}${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function navigateTri(tri: string) {
    const params = new URLSearchParams(currentValues);
    if (tri !== "pertinence") params.set("tri", tri);
    router.push(`${basePath}${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function navigateWithMultiple(updates: Record<string, string | null>) {
    const params = new URLSearchParams(currentValues);
    if (currentTri !== "pertinence") params.set("tri", currentTri);
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    router.push(`${basePath}${params.toString() ? `?${params.toString()}` : ""}`);
  }

  const nombreFiltresActifs = Object.keys(currentValues).length;

  return (
    <>
      <div className="wrap filter-row">
        <button type="button" className="filter-pill filter-toggle" onClick={() => setOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          Filtres
          {nombreFiltresActifs > 0 && <span className="filter-toggle-badge">{nombreFiltresActifs}</span>}
        </button>

        <select className="filter-pill" value={currentTri} onChange={(e) => navigateTri(e.target.value)}>
          <option value="pertinence">Tri : Pertinence</option>
          <option value="prix_asc">Prix croissant</option>
          <option value="prix_desc">Prix décroissant</option>
        </select>
      </div>

      {open && (
        <div className="filter-drawer-overlay" onClick={() => setOpen(false)}>
          <aside className="filter-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="filter-drawer-header">
              <h2>Tous les filtres</h2>
              <button type="button" className="filter-drawer-close" onClick={() => setOpen(false)} aria-label="Fermer">
                ✕
              </button>
            </div>

            <div className="filter-drawer-body">
              <section className="filter-drawer-section">
                <h3>Tri</h3>
                {[
                  { value: "pertinence", label: "Pertinence" },
                  { value: "prix_asc", label: "Prix croissants" },
                  { value: "prix_desc", label: "Prix décroissants" },
                ].map((option) => (
                  <label key={option.value} className="filter-drawer-radio">
                    <input
                      type="radio"
                      name="tri"
                      value={option.value}
                      checked={currentTri === option.value}
                      onChange={() => navigateTri(option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </section>

              {filters.map((filter) => {
                if (filter.widget === "location") {
                  return (
                    <LocationFilter
                      key={filter.key}
                      label={filter.label}
                      initialLocalisation={currentValues[filter.key] ?? ""}
                      initialLat={currentValues.lat ?? ""}
                      initialLng={currentValues.lng ?? ""}
                      initialRayon={currentValues.rayon ?? ""}
                      onApply={({ localisation, lat, lng, rayon }) =>
                        navigateWithMultiple({ [filter.key]: localisation, lat, lng, rayon })
                      }
                    />
                  );
                }

                if (filter.widget === "select") {
                  const opts = options[filter.key] ?? [];
                  return (
                    <section key={filter.key} className="filter-drawer-section">
                      <h3>{filter.label}</h3>
                      {opts.map((opt) => (
                        <label key={opt} className="filter-drawer-radio">
                          <input
                            type="radio"
                            name={filter.key}
                            checked={currentValues[filter.key] === opt}
                            onChange={() => navigateWith(filter.key, opt)}
                          />
                          {opt}
                        </label>
                      ))}
                      {currentValues[filter.key] && (
                        <button
                          type="button"
                          className="filter-drawer-reset"
                          onClick={() => navigateWith(filter.key, "")}
                        >
                          Effacer
                        </button>
                      )}
                    </section>
                  );
                }

                // widget === "range" : prix ou kilométrage, un champ min et un champ max
                const minKey = `${filter.key}_min`;
                const maxKey = `${filter.key}_max`;
                return (
                  <section key={filter.key} className="filter-drawer-section">
                    <h3>{filter.label}</h3>
                    <div className="filter-drawer-range">
                      <input
                        type="number"
                        defaultValue={currentValues[minKey] ?? ""}
                        onBlur={(e) => navigateWith(minKey, e.target.value)}
                        placeholder="Min"
                      />
                      <span>–</span>
                      <input
                        type="number"
                        defaultValue={currentValues[maxKey] ?? ""}
                        onBlur={(e) => navigateWith(maxKey, e.target.value)}
                        placeholder="Max"
                      />
                    </div>
                  </section>
                );
              })}
            </div>

            <div className="filter-drawer-save">
              <button type="button" className="filter-drawer-save-btn" onClick={handleSauvegarder} disabled={etatSauvegarde === "enregistrement"}>
                {etatSauvegarde === "ok" ? "✓ Recherche sauvegardée" : "☆ Sauvegarder cette recherche"}
              </button>
              {etatSauvegarde === "erreur" && (
                <p className="filter-drawer-save-error">Une erreur est survenue, réessayez.</p>
              )}
            </div>

            <div className="filter-drawer-footer">
              <button type="button" className="filter-drawer-clear" onClick={() => router.push(basePath)}>
                Tout effacer
              </button>
              <button type="button" className="btn btn-accent" onClick={() => setOpen(false)}>
                Voir les résultats ({resultCount.toLocaleString("fr-FR")})
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
