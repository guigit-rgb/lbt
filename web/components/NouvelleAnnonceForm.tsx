"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { MEGA_MENU, AUTRES_ENTRY, DONS_ENTRY } from "@/lib/categories";
import type { Categorie } from "@/lib/db/schema";
import { creerAnnonce, type CreerAnnonceResult } from "@/lib/actions/annonces";

interface Suggestion {
  categorie: Categorie;
  sousCategorie?: string;
  label: string;
}

const CATEGORY_OPTIONS: { categorie: Categorie; label: string }[] = [
  ...MEGA_MENU.map((entry) => ({ categorie: entry.categorie, label: entry.label })),
  { categorie: AUTRES_ENTRY.categorie, label: AUTRES_ENTRY.label },
  { categorie: DONS_ENTRY.categorie, label: DONS_ENTRY.label },
];

const LOISIRS_SOUS_CATEGORIES = MEGA_MENU.find((e) => e.categorie === "loisirs")!.columns.flatMap((col) =>
  col.flatMap((group) => group.links.map((l) => l.label))
);

const CARBURANTS = ["Essence", "Diesel", "Hybride", "Électrique", "Autre"];
const ETATS_PRODUIT = ["Neuf", "Très bon état", "Bon état", "Satisfaisant"];
const TYPES_ANIMAUX = ["Chien", "Chat", "Oiseau", "Rongeur", "Autre"];

const initialState: CreerAnnonceResult = { success: true, id: "" };

export default function NouvelleAnnonceForm() {
  const [step, setStep] = useState(1);

  const [titre, setTitre] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [categorie, setCategorie] = useState<Categorie | "">("");

  const [marque, setMarque] = useState("");
  const [modele, setModele] = useState("");
  const [annee, setAnnee] = useState("");
  const [kilometrage, setKilometrage] = useState("");
  const [carburant, setCarburant] = useState("");
  const [boite, setBoite] = useState("");

  const [sousCategorie, setSousCategorie] = useState("");
  const [etatProduit, setEtatProduit] = useState("");
  const [typeAnimal, setTypeAnimal] = useState("");

  const [description, setDescription] = useState("");
  const [generatingDescription, setGeneratingDescription] = useState(false);

  const [prix, setPrix] = useState("");
  const [ville, setVille] = useState("");
  const [codePostal, setCodePostal] = useState("");

  const [state, formAction, pending] = useActionState(
    async (_prev: CreerAnnonceResult, formData: FormData) => creerAnnonce(formData),
    initialState
  );

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (titre.trim().length < 3) {
      return;
    }
    const timeout = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoadingSuggestions(true);
      fetch("/api/ai/categorie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titre }),
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data) => setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []))
        .catch(() => {})
        .finally(() => setLoadingSuggestions(false));
    }, 400);
    return () => clearTimeout(timeout);
  }, [titre]);

  const categorieLabel = CATEGORY_OPTIONS.find((c) => c.categorie === categorie)?.label ?? "";

  async function genererDescription() {
    setGeneratingDescription(true);
    const details: Record<string, string> = {};
    if (categorie === "vehicules") {
      if (marque) details["Marque"] = marque;
      if (modele) details["Modèle"] = modele;
      if (annee) details["Année"] = annee;
      if (kilometrage) details["Kilométrage"] = `${kilometrage} km`;
      if (carburant) details["Carburant"] = carburant;
      if (boite) details["Boîte"] = boite;
    } else if (categorie === "loisirs") {
      if (sousCategorie) details["Catégorie"] = sousCategorie;
      if (etatProduit) details["État"] = etatProduit;
    } else if (categorie === "animaux") {
      if (typeAnimal) details["Type d'animal"] = typeAnimal;
    }

    try {
      const res = await fetch("/api/ai/description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titre, categorieLabel, details }),
      });
      const data = await res.json();
      if (typeof data.description === "string" && data.description) {
        setDescription(data.description);
      }
    } catch {
      // silencieux : l'utilisateur peut toujours écrire sa description à la main
    } finally {
      setGeneratingDescription(false);
    }
  }

  const hasDetailStep = categorie === "vehicules" || categorie === "loisirs" || categorie === "animaux";
  const totalSteps = hasDetailStep ? 7 : 6;
  const detailStepIndex = 3;

  function next() {
    setStep((s) => (hasDetailStep ? s + 1 : s === 2 ? s + 2 : s + 1));
  }
  function back() {
    setStep((s) => (hasDetailStep ? s - 1 : s === 4 ? s - 2 : s - 1));
  }

  return (
    <div style={{ maxWidth: 560, margin: "2rem auto", padding: "0 1rem" }}>
      <p style={{ color: "var(--muted, #666)" }}>
        Étape {hasDetailStep || step < 3 ? step : step - 1} / {totalSteps}
      </p>

      {step === 1 && (
        <section>
          <h1>Quel est le titre de l&apos;annonce ?</h1>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            maxLength={200}
            style={{ width: "100%", padding: "0.6rem" }}
            autoFocus
          />
          <p style={{ fontSize: "0.85rem", color: "var(--muted, #666)" }}>{titre.length}/200</p>

          {loadingSuggestions && <p>Recherche de catégories…</p>}
          {titre.trim().length >= 3 && suggestions.length > 0 && (
            <div style={{ margin: "1rem 0" }}>
              <p>Choisissez une catégorie suggérée</p>
              <div style={{ display: "grid", gap: "0.4rem" }}>
                {suggestions.map((s) => (
                  <button
                    key={`${s.categorie}-${s.sousCategorie ?? ""}`}
                    onClick={() => {
                      setCategorie(s.categorie);
                      if (s.categorie === "loisirs" && s.sousCategorie) setSousCategorie(s.sousCategorie);
                      setStep(2);
                    }}
                    style={{ textAlign: "left", padding: "0.5rem 0.75rem" }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button disabled={titre.trim().length < 3} onClick={() => setStep(2)} style={{ marginTop: "1rem" }}>
            Continuer
          </button>
        </section>
      )}

      {step === 2 && (
        <section>
          <h1>Choisissez une catégorie</h1>
          <select value={categorie} onChange={(e) => setCategorie(e.target.value as Categorie)} style={{ padding: "0.5rem", width: "100%" }}>
            <option value="">Choisissez</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.categorie} value={c.categorie}>
                {c.label}
              </option>
            ))}
          </select>
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <button onClick={() => setStep(1)}>Retour</button>
            <button disabled={!categorie} onClick={next}>
              Continuer
            </button>
          </div>
        </section>
      )}

      {step === detailStepIndex && hasDetailStep && categorie === "vehicules" && (
        <section>
          <h1>Détails du véhicule</h1>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Marque
            <input value={marque} onChange={(e) => setMarque(e.target.value)} style={{ display: "block", width: "100%", padding: "0.5rem" }} />
          </label>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Modèle
            <input value={modele} onChange={(e) => setModele(e.target.value)} style={{ display: "block", width: "100%", padding: "0.5rem" }} />
          </label>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Année
            <input type="number" value={annee} onChange={(e) => setAnnee(e.target.value)} style={{ display: "block", width: "100%", padding: "0.5rem" }} />
          </label>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Kilométrage
            <input
              type="number"
              value={kilometrage}
              onChange={(e) => setKilometrage(e.target.value)}
              style={{ display: "block", width: "100%", padding: "0.5rem" }}
            />
          </label>
          <p>Carburant</p>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
            {CARBURANTS.map((c) => (
              <button
                key={c}
                onClick={() => setCarburant(c)}
                style={{ padding: "0.3rem 0.7rem", fontWeight: carburant === c ? 700 : 400 }}
              >
                {c}
              </button>
            ))}
          </div>
          <p>Boîte</p>
          <label style={{ marginRight: "1rem" }}>
            <input type="radio" name="boite" checked={boite === "Manuelle"} onChange={() => setBoite("Manuelle")} /> Manuelle
          </label>
          <label>
            <input type="radio" name="boite" checked={boite === "Automatique"} onChange={() => setBoite("Automatique")} /> Automatique
          </label>
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <button onClick={back}>Retour</button>
            <button onClick={next}>Continuer</button>
          </div>
        </section>
      )}

      {step === detailStepIndex && hasDetailStep && categorie === "loisirs" && (
        <section>
          <h1>Détails de l&apos;objet</h1>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Sous-catégorie
            <select
              value={sousCategorie}
              onChange={(e) => setSousCategorie(e.target.value)}
              style={{ display: "block", width: "100%", padding: "0.5rem" }}
            >
              <option value="">Choisissez</option>
              {LOISIRS_SOUS_CATEGORIES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <p>État</p>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {ETATS_PRODUIT.map((e) => (
              <button
                key={e}
                onClick={() => setEtatProduit(e)}
                style={{ padding: "0.3rem 0.7rem", fontWeight: etatProduit === e ? 700 : 400 }}
              >
                {e}
              </button>
            ))}
          </div>
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <button onClick={back}>Retour</button>
            <button onClick={next}>Continuer</button>
          </div>
        </section>
      )}

      {step === detailStepIndex && hasDetailStep && categorie === "animaux" && (
        <section>
          <h1>Détails</h1>
          <p>Type d&apos;animal</p>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {TYPES_ANIMAUX.map((t) => (
              <button
                key={t}
                onClick={() => setTypeAnimal(t)}
                style={{ padding: "0.3rem 0.7rem", fontWeight: typeAnimal === t ? 700 : 400 }}
              >
                {t}
              </button>
            ))}
          </div>
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <button onClick={back}>Retour</button>
            <button onClick={next}>Continuer</button>
          </div>
        </section>
      )}

      {step === 4 && (
        <section>
          <h1>Décrivez votre bien</h1>
          <button onClick={genererDescription} disabled={generatingDescription} style={{ marginBottom: "0.75rem" }}>
            {generatingDescription ? "Génération…" : "✨ Générer une description"}
          </button>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            maxLength={4000}
            style={{ width: "100%", padding: "0.6rem" }}
          />
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <button onClick={back}>Retour</button>
            <button onClick={next}>Continuer</button>
          </div>
        </section>
      )}

      {step === 5 && (
        <section>
          <h1>Quel est votre prix ?</h1>
          <input
            type="number"
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            placeholder="€"
            style={{ width: "100%", padding: "0.6rem" }}
          />
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <button onClick={back}>Retour</button>
            <button onClick={next}>Continuer</button>
          </div>
        </section>
      )}

      {step === 6 && (
        <section>
          <h1>Où se situe votre bien ?</h1>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Ville
            <input value={ville} onChange={(e) => setVille(e.target.value)} style={{ display: "block", width: "100%", padding: "0.5rem" }} />
          </label>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Code postal
            <input
              value={codePostal}
              onChange={(e) => setCodePostal(e.target.value)}
              maxLength={5}
              style={{ display: "block", width: "100%", padding: "0.5rem" }}
            />
          </label>
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <button onClick={back}>Retour</button>
            <button onClick={next}>Continuer</button>
          </div>
        </section>
      )}

      {step === 7 && (
        <section>
          <h1>Récapitulatif</h1>
          <ul>
            <li>
              <strong>Titre :</strong> {titre}
            </li>
            <li>
              <strong>Catégorie :</strong> {categorieLabel}
            </li>
            {categorie === "vehicules" && (
              <li>
                <strong>Véhicule :</strong> {marque} {modele} {annee && `(${annee})`} — {kilometrage} km,{" "}
                {carburant}, {boite}
              </li>
            )}
            {categorie === "loisirs" && (
              <li>
                <strong>Détails :</strong> {sousCategorie} — {etatProduit}
              </li>
            )}
            {categorie === "animaux" && (
              <li>
                <strong>Type :</strong> {typeAnimal}
              </li>
            )}
            <li>
              <strong>Description :</strong> {description}
            </li>
            <li>
              <strong>Prix :</strong> {prix} €
            </li>
            <li>
              <strong>Localisation :</strong> {ville} ({codePostal})
            </li>
          </ul>

          <form action={formAction}>
            <input type="hidden" name="categorie" value={categorie} />
            <input type="hidden" name="titre" value={titre} />
            <input type="hidden" name="description" value={description} />
            <input type="hidden" name="prix" value={prix} />
            <input type="hidden" name="ville" value={ville} />
            <input type="hidden" name="codePostal" value={codePostal} />
            {categorie === "vehicules" && (
              <>
                <input type="hidden" name="marque" value={marque} />
                <input type="hidden" name="modele" value={modele} />
                <input type="hidden" name="annee" value={annee} />
                <input type="hidden" name="kilometrage" value={kilometrage} />
                <input type="hidden" name="carburant" value={carburant} />
                <input type="hidden" name="boite" value={boite} />
              </>
            )}
            {categorie === "loisirs" && (
              <>
                <input type="hidden" name="sousCategorie" value={sousCategorie} />
                <input type="hidden" name="etatProduit" value={etatProduit} />
              </>
            )}
            {categorie === "animaux" && <input type="hidden" name="typeAnimal" value={typeAnimal} />}

            {"error" in state && state.error ? (
              <p role="alert" style={{ color: "var(--brand-red, #e2231a)" }}>
                {state.error}
              </p>
            ) : null}

            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
              <button type="button" onClick={back}>
                Retour
              </button>
              <button type="submit" disabled={pending}>
                {pending ? "Publication…" : "Publier"}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
