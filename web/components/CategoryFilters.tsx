"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Categorie } from "@/lib/db/schema";
import type { FilterField } from "@/lib/listing-config";
import { sauvegarderRecherche } from "@/lib/actions/recherches";
import { LocationFilter } from "@/components/LocationFilter";

const TRI_OPTIONS = [
  { value: "pertinence", label: "Pertinence" },
  { value: "recentes", label: "Plus récentes" },
  { value: "anciennes", label: "Plus anciennes" },
  { value: "prix_asc", label: "Prix croissants" },
  { value: "prix_desc", label: "Prix décroissants" },
] as const;

// Valeurs stockées en base (identiques au dépôt d'annonce) réécrites pour
// l'affichage du filtre — un seul endroit à étendre si une future valeur
// brute a besoin d'un libellé différent de celui saisi au dépôt.
const LABEL_OVERRIDES: Record<string, Record<string, string>> = {
  permis: { "Permis B": "Avec permis", "Sans permis (voiturette)": "Sans permis" },
};

function labelFor(key: string, value: string): string {
  return LABEL_OVERRIDES[key]?.[value] ?? value;
}

function toggleInList(current: string, value: string): string {
  const values = current ? current.split(",").filter(Boolean) : [];
  const next = values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
  return next.join(",");
}

export default function CategoryFilters({
  basePath,
  categorie,
  filters,
  currentValues,
  options,
  typeAnnonceCounts,
  vendeurCounts,
  currentTri,
  resultCount,
}: {
  basePath: string;
  categorie: Categorie;
  filters: FilterField[];
  currentValues: Record<string, string>;
  options: Record<string, { value: string; count: number }[]>;
  typeAnnonceCounts: { value: "offre" | "demande"; count: number }[];
  vendeurCounts: { particulier: number; pro: number };
  currentTri: string;
  resultCount: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [etatSauvegarde, setEtatSauvegarde] = useState<"idle" | "enregistrement" | "ok" | "erreur">("idle");
  const [recherchesTexte, setRecherchesTexte] = useState<Record<string, string>>({});

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

  function toggleValue(key: string, value: string) {
    navigateWith(key, toggleInList(currentValues[key] ?? "", value));
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
          {TRI_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              Tri : {option.label}
            </option>
          ))}
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
                        <label key={opt.value} className="filter-drawer-radio">
                          <input
                            type="radio"
                            name={filter.key}
                            checked={currentValues[filter.key] === opt.value}
                            onChange={() => navigateWith(filter.key, opt.value)}
                          />
                          {labelFor(filter.key, opt.value)}
                          <span className="filter-drawer-count">{opt.count}</span>
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

                if (filter.widget === "checkbox") {
                  const opts = options[filter.key] ?? [];
                  const selected = (currentValues[filter.key] ?? "").split(",").filter(Boolean);
                  const recherche = (recherchesTexte[filter.key] ?? "").trim().toLowerCase();
                  const optsFiltres = recherche
                    ? opts.filter((opt) => labelFor(filter.key, opt.value).toLowerCase().includes(recherche))
                    : opts;
                  return (
                    <section key={filter.key} className="filter-drawer-section">
                      <h3>{filter.label}</h3>
                      <input
                        type="search"
                        className="filter-drawer-search"
                        placeholder="Rechercher une valeur"
                        value={recherchesTexte[filter.key] ?? ""}
                        onChange={(e) => setRecherchesTexte((prev) => ({ ...prev, [filter.key]: e.target.value }))}
                      />
                      {optsFiltres.map((opt) => (
                        <label key={opt.value} className="filter-drawer-checkbox">
                          <input
                            type="checkbox"
                            checked={selected.includes(opt.value)}
                            onChange={() => toggleValue(filter.key, opt.value)}
                          />
                          {labelFor(filter.key, opt.value)}
                          <span className="filter-drawer-count">{opt.count}</span>
                        </label>
                      ))}
                      {selected.length > 0 && (
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

                // widget === "range" : prix, kilométrage, année ou puissance —
                // un champ min et un champ max.
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
                    {(currentValues[minKey] || currentValues[maxKey]) && (
                      <button
                        type="button"
                        className="filter-drawer-reset"
                        onClick={() => navigateWithMultiple({ [minKey]: null, [maxKey]: null })}
                      >
                        Effacer
                      </button>
                    )}
                  </section>
                );
              })}

              <section className="filter-drawer-section">
                <h3>Tri</h3>
                {TRI_OPTIONS.map((option) => (
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

              <section className="filter-drawer-section">
                <h3>Type d&apos;annonces</h3>
                {typeAnnonceCounts.map((opt) => (
                  <label key={opt.value} className="filter-drawer-radio">
                    <input
                      type="radio"
                      name="type_annonce"
                      checked={currentValues.type_annonce === opt.value}
                      onChange={() => navigateWith("type_annonce", opt.value)}
                    />
                    {opt.value === "offre" ? "Offres" : "Demandes"}
                    <span className="filter-drawer-count">{opt.count}</span>
                  </label>
                ))}
                {currentValues.type_annonce && (
                  <button type="button" className="filter-drawer-reset" onClick={() => navigateWith("type_annonce", "")}>
                    Effacer
                  </button>
                )}
              </section>

              <section className="filter-drawer-section">
                <h3>Type de vendeurs</h3>
                {(
                  [
                    { value: "particulier", label: "Particuliers", count: vendeurCounts.particulier },
                    { value: "pro", label: "Professionnels", count: vendeurCounts.pro },
                  ] as const
                ).map((opt) => {
                  const selected = (currentValues.vendeur ?? "").split(",").filter(Boolean);
                  return (
                    <label key={opt.value} className="filter-drawer-checkbox">
                      <input
                        type="checkbox"
                        checked={selected.includes(opt.value)}
                        onChange={() => toggleValue("vendeur", opt.value)}
                      />
                      {opt.label}
                      <span className="filter-drawer-count">{opt.count}</span>
                    </label>
                  );
                })}
                {currentValues.vendeur && (
                  <button type="button" className="filter-drawer-reset" onClick={() => navigateWith("vendeur", "")}>
                    Effacer
                  </button>
                )}
              </section>
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
                Rechercher ({resultCount.toLocaleString("fr-FR")})
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
