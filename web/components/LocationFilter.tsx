"use client";

import { useEffect, useRef, useState } from "react";
import { LocationMap } from "@/components/LocationMapLoader";

interface Localisation {
  label: string;
  codePostal: string;
  lat: number;
  lng: number;
}

interface RechercheRecente extends Localisation {
  rayon: number;
}

const CLE_STOCKAGE = "lbt-recherches-localisation";

// Historique des recherches de localisation — stocké dans le navigateur
// (pas de table dédiée en base : c'est un confort personnel, pas une donnée
// à synchroniser entre appareils).
function chargerRecherchesRecentes(): RechercheRecente[] {
  if (typeof window === "undefined") return [];
  try {
    const brut = window.localStorage.getItem(CLE_STOCKAGE);
    return brut ? JSON.parse(brut) : [];
  } catch {
    return [];
  }
}

function sauvegarderRechercheRecente(recherche: RechercheRecente) {
  const existantes = chargerRecherchesRecentes().filter((r) => r.codePostal !== recherche.codePostal);
  window.localStorage.setItem(CLE_STOCKAGE, JSON.stringify([recherche, ...existantes].slice(0, 5)));
}

export function LocationFilter({
  label,
  initialLocalisation,
  initialLat,
  initialLng,
  initialRayon,
  onApply,
}: {
  label: string;
  initialLocalisation: string;
  initialLat: string;
  initialLng: string;
  initialRayon: string;
  onApply: (updates: {
    localisation: string | null;
    lat: string | null;
    lng: string | null;
    rayon: string | null;
  }) => void;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Localisation[]>([]);
  const [recherche, setRecherche] = useState<Localisation | null>(
    initialLocalisation && initialLat && initialLng
      ? { label: initialLocalisation, codePostal: "", lat: Number(initialLat), lng: Number(initialLng) }
      : null
  );
  const [rayon, setRayon] = useState(Number(initialRayon) || 5);
  const [recentes, setRecentes] = useState<RechercheRecente[]>(() => chargerRecherchesRecentes());
  const abortRef = useRef<AbortController | null>(null);

  const suggestionsAffichees = query.trim().length < 2 ? [] : suggestions;

  useEffect(() => {
    if (query.trim().length < 2) {
      return;
    }
    const timeout = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      fetch(`https://api-adresse.data.gouv.fr/search/?${new URLSearchParams({ q: query, limit: "5" })}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(
            (data.features ?? []).map((f: { properties: { label: string; postcode: string }; geometry: { coordinates: [number, number] } }) => ({
              label: f.properties.label,
              codePostal: f.properties.postcode,
              lat: f.geometry.coordinates[1],
              lng: f.geometry.coordinates[0],
            }))
          );
        })
        .catch(() => {});
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  function autourDeMoi() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      setRecherche({
        label: "Autour de moi",
        codePostal: "",
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setQuery("");
      setSuggestions([]);
    });
  }

  function effacer() {
    setRecherche(null);
    onApply({ localisation: null, lat: null, lng: null, rayon: null });
  }

  function valider() {
    if (!recherche) {
      onApply({ localisation: null, lat: null, lng: null, rayon: null });
      return;
    }
    sauvegarderRechercheRecente({ ...recherche, rayon });
    setRecentes(chargerRecherchesRecentes());
    onApply({
      localisation: recherche.label,
      lat: String(recherche.lat),
      lng: String(recherche.lng),
      rayon: String(rayon),
    });
  }

  return (
    <section className="filter-drawer-section filter-location">
      <h3>{label}</h3>

      {recherche ? (
        <>
          <span className="filter-location-chip">
            {recherche.label}
            <button type="button" onClick={() => setRecherche(null)} aria-label="Retirer la localisation">
              ✕
            </button>
          </span>

          <p className="filter-location-radius-label">
            Dans un rayon de <strong>{rayon} km</strong>
          </p>
          <input
            type="range"
            min={1}
            max={250}
            value={rayon}
            onChange={(e) => setRayon(Number(e.target.value))}
            className="filter-location-slider"
          />
          <div className="filter-location-minmax">
            <span>1 km</span>
            <span>250 km</span>
          </div>

          <div className="filter-location-map">
            <LocationMap lat={recherche.lat} lng={recherche.lng} rayonKm={rayon} height={160} />
          </div>
        </>
      ) : (
        <>
          <input
            type="text"
            className="filter-drawer-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ville ou code postal"
          />

          {suggestionsAffichees.length > 0 ? (
            <ul className="filter-location-suggestions">
              {suggestionsAffichees.map((s) => (
                <li key={s.label}>
                  <button
                    type="button"
                    onClick={() => {
                      setRecherche(s);
                      setQuery("");
                      setSuggestions([]);
                    }}
                  >
                    📍 {s.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <>
              {recentes.length > 0 && (
                <>
                  <p className="filter-location-souscat">Vous avez déjà recherché à</p>
                  <ul className="filter-location-suggestions">
                    {recentes.map((r) => (
                      <li key={r.codePostal || r.label}>
                        <button
                          type="button"
                          onClick={() => {
                            setRecherche(r);
                            setRayon(r.rayon);
                          }}
                        >
                          🕓 {r.label} — {r.rayon} km
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <p className="filter-location-souscat">Suggestions</p>
              <ul className="filter-location-suggestions">
                <li>
                  <button type="button" onClick={autourDeMoi}>
                    ⊙ Autour de moi
                  </button>
                </li>
              </ul>
            </>
          )}
        </>
      )}

      <div className="filter-location-actions">
        <button type="button" className="filter-drawer-clear" onClick={effacer}>
          Effacer
        </button>
        <button type="button" className="btn btn-accent" onClick={valider}>
          Valider
        </button>
      </div>
    </section>
  );
}
