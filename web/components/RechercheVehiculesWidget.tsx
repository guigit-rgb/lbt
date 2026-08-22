"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MARQUES_COURANTES, MARQUES_AUTRES } from "@/lib/marques";
import { TYPES_VOITURE, TYPES_UTILITAIRE, TYPES_MOTO, PALIERS_PRIX_MAX } from "@/lib/vehicule-types";

type TypeIcone = "voiture" | "utilitaire" | "moto";

const GROUPES_TYPE: Record<TypeIcone, readonly string[]> = {
  voiture: TYPES_VOITURE,
  utilitaire: TYPES_UTILITAIRE,
  moto: TYPES_MOTO,
};

export default function RechercheVehiculesWidget() {
  const router = useRouter();
  const [onglet, setOnglet] = useState<"acheter" | "vendre">("acheter");
  const [type, setType] = useState<TypeIcone>("voiture");
  const [marque, setMarque] = useState("");
  const [modele, setModele] = useState("");
  const [modeles, setModeles] = useState<string[]>([]);
  const [prixMax, setPrixMax] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [texteIA, setTexteIA] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [erreur, setErreur] = useState("");
  const [recherche, setRecherche] = useState(false);

  // Modèles en cascade — le reset (marque vidée ou changée) se fait dans le
  // onChange du <select> Marque, pas ici : un effet ne doit déclencher
  // setState que depuis un callback asynchrone (la réponse du fetch), jamais
  // en synchrone dans son corps.
  useEffect(() => {
    if (!marque) return;
    const controller = new AbortController();
    fetch(`/api/vehicules/modeles?marque=${encodeURIComponent(marque)}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => setModeles(data.modeles ?? []))
      .catch(() => {});
    return () => controller.abort();
  }, [marque]);

  // Compteur live — seulement pour les champs structurés : la case IA appelle
  // un modèle de langage, on ne la déclenche jamais à chaque frappe. Le reset
  // du compteur quand on tape du texte IA se fait dans son onChange, pas ici.
  useEffect(() => {
    if (texteIA.trim()) return;
    const controller = new AbortController();
    const query = new URLSearchParams();
    query.set("typeVehicule", GROUPES_TYPE[type].join(","));
    if (marque) query.set("marque", marque);
    if (modele) query.set("modele", modele);
    if (prixMax) query.set("prix_max", prixMax);
    if (codePostal) query.set("codePostal", codePostal);

    const identifiant = setTimeout(() => {
      fetch(`/api/vehicules/count?${query.toString()}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((data) => setCount(data.total ?? 0))
        .catch(() => {});
    }, 250);

    return () => {
      clearTimeout(identifiant);
      controller.abort();
    };
  }, [type, marque, modele, prixMax, codePostal, texteIA]);

  async function lancerRecherche() {
    setErreur("");

    if (texteIA.trim()) {
      setRecherche(true);
      try {
        const res = await fetch("/api/ai/recherche-vehicule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texte: texteIA.trim() }),
        });
        const data = await res.json();
        if (!res.ok) {
          setErreur(data.error ?? "Recherche indisponible.");
          setRecherche(false);
          return;
        }
        const params = new URLSearchParams();
        for (const [cle, valeur] of Object.entries(data.filtres ?? {})) {
          if (valeur !== undefined && valeur !== null) params.set(cle, String(valeur));
        }
        router.push(`/vehicules${params.toString() ? `?${params.toString()}` : ""}`);
      } catch {
        setErreur("Recherche indisponible, réessayez.");
        setRecherche(false);
      }
      return;
    }

    const params = new URLSearchParams();
    params.set("typeVehicule", GROUPES_TYPE[type].join(","));
    if (marque) params.set("marque", marque);
    if (modele) params.set("modele", modele);
    if (prixMax) params.set("prix_max", prixMax);
    if (codePostal) params.set("codePostal", codePostal);
    router.push(`/vehicules?${params.toString()}`);
  }

  return (
    <div className="recherche-widget">
      <div className="recherche-widget-tabs">
        <button
          type="button"
          className={`recherche-widget-tab${onglet === "acheter" ? " active" : ""}`}
          onClick={() => setOnglet("acheter")}
        >
          Acheter
        </button>
        <Link
          href="/compte/annonces/nouvelle"
          className={`recherche-widget-tab${onglet === "vendre" ? " active" : ""}`}
          onClick={() => setOnglet("vendre")}
        >
          Vendre
        </Link>
      </div>

      {onglet === "acheter" && (
        <>
          <div className="recherche-widget-types">
            <button type="button" className={type === "voiture" ? "active" : ""} onClick={() => setType("voiture")}>
              🚗 Voiture
            </button>
            <button
              type="button"
              className={type === "utilitaire" ? "active" : ""}
              onClick={() => setType("utilitaire")}
            >
              🚐 Utilitaire
            </button>
            <button type="button" className={type === "moto" ? "active" : ""} onClick={() => setType("moto")}>
              🏍️ Moto
            </button>
          </div>

          <div className="recherche-widget-row">
            <select
              value={marque}
              onChange={(e) => {
                setMarque(e.target.value);
                setModele("");
                setModeles([]);
              }}
            >
              <option value="">Marque</option>
              <optgroup label="Marques courantes">
                {MARQUES_COURANTES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Autres marques">
                {MARQUES_AUTRES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </optgroup>
            </select>
            <select value={modele} onChange={(e) => setModele(e.target.value)} disabled={!marque}>
              <option value="">{marque ? "Modèle" : "Choisissez une marque"}</option>
              {modeles.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="recherche-widget-row">
            <select value={prixMax} onChange={(e) => setPrixMax(e.target.value)}>
              <option value="">Prix max</option>
              {PALIERS_PRIX_MAX.map((p) => (
                <option key={p} value={p}>
                  {p.toLocaleString("fr-FR")} €
                </option>
              ))}
            </select>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Code postal"
              value={codePostal}
              onChange={(e) => setCodePostal(e.target.value.replace(/\D/g, "").slice(0, 5))}
            />
          </div>

          <div className="recherche-widget-divider">
            <span />
            ou
            <span />
          </div>

          <label className="recherche-widget-ia-label">
            Décrivez votre voiture idéale <span className="recherche-widget-beta">BETA</span>
          </label>
          <input
            type="text"
            className="recherche-widget-ia-input"
            placeholder="Un SUV automatique à moins de 15 000 €…"
            value={texteIA}
            onChange={(e) => {
              setTexteIA(e.target.value);
              if (e.target.value.trim()) setCount(null);
            }}
          />

          {erreur && <p className="recherche-widget-erreur">{erreur}</p>}

          <button type="button" className="btn btn-accent recherche-widget-submit" onClick={lancerRecherche} disabled={recherche}>
            {recherche ? "Recherche…" : count !== null ? `Rechercher (${count.toLocaleString("fr-FR")})` : "Rechercher"}
          </button>
        </>
      )}
    </div>
  );
}
