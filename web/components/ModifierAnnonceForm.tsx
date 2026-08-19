"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { annonces } from "@/lib/db/schema";
import { modifierAnnonce, type CreerAnnonceResult } from "@/lib/actions/annonces";

type Annonce = typeof annonces.$inferSelect;

const CARBURANTS = ["Essence", "Diesel", "Hybride", "Électrique", "Autre"];

const initialState: CreerAnnonceResult = { success: true, id: "" };

export default function ModifierAnnonceForm({ annonce }: { annonce: Annonce }) {
  const attributs = annonce.attributs as Record<string, string>;

  const [carburant, setCarburant] = useState(attributs.carburant ?? "");
  const [boite, setBoite] = useState(attributs.boite ?? "");

  const [state, formAction, pending] = useActionState(
    async (_prev: CreerAnnonceResult, formData: FormData) => modifierAnnonce(annonce.id, formData),
    initialState
  );

  const inputStyle = { display: "block", width: "100%", padding: "0.5rem", marginTop: "0.25rem" };

  return (
    <main style={{ maxWidth: 560, margin: "3rem auto", padding: "0 1rem" }}>
      <h1>Modifier l&apos;annonce</h1>

      <form action={formAction} style={{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
        <label>
          Titre
          <input name="titre" defaultValue={annonce.titre} style={inputStyle} required minLength={3} />
        </label>

        <label>
          Description
          <textarea
            name="description"
            defaultValue={annonce.description}
            rows={5}
            style={inputStyle}
            required
            minLength={10}
          />
        </label>

        <label>
          Prix (€)
          <input
            name="prix"
            type="text"
            defaultValue={annonce.prixCents != null ? (annonce.prixCents / 100).toString() : ""}
            style={inputStyle}
          />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <label>
            Ville
            <input name="ville" defaultValue={annonce.ville ?? ""} style={inputStyle} required />
          </label>
          <label>
            Code postal
            <input
              name="codePostal"
              defaultValue={annonce.codePostal ?? ""}
              style={inputStyle}
              required
              pattern="\d{5}"
            />
          </label>
        </div>

        {annonce.categorie === "vehicules" && (
          <fieldset style={{ border: "1px solid var(--line, #ddd)", borderRadius: 8, padding: "1rem" }}>
            <legend>Véhicule</legend>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <label>
                Marque
                <input name="marque" defaultValue={annonce.marque ?? ""} style={inputStyle} />
              </label>
              <label>
                Modèle
                <input name="modele" defaultValue={annonce.modele ?? ""} style={inputStyle} />
              </label>
              <label>
                Année
                <input name="annee" type="number" defaultValue={annonce.annee ?? ""} style={inputStyle} />
              </label>
              <label>
                Kilométrage
                <input name="kilometrage" type="number" defaultValue={annonce.kilometrage ?? ""} style={inputStyle} />
              </label>
            </div>

            <div style={{ marginTop: "0.75rem" }}>
              Carburant
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
                {CARBURANTS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCarburant(c)}
                    style={{ padding: "0.3rem 0.7rem", fontWeight: carburant === c ? 700 : 400 }}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <input type="hidden" name="carburant" value={carburant} />
            </div>

            <div style={{ marginTop: "0.75rem" }}>
              Boîte
              <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem" }}>
                <label>
                  <input
                    type="radio"
                    name="boite-radio"
                    checked={boite === "Manuelle"}
                    onChange={() => setBoite("Manuelle")}
                  />{" "}
                  Manuelle
                </label>
                <label>
                  <input
                    type="radio"
                    name="boite-radio"
                    checked={boite === "Automatique"}
                    onChange={() => setBoite("Automatique")}
                  />{" "}
                  Automatique
                </label>
              </div>
              <input type="hidden" name="boite" value={boite} />
            </div>
          </fieldset>
        )}

        {state && "error" in state && <p style={{ color: "var(--warm, #c1592c)" }}>{state.error}</p>}

        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="submit" className="btn btn-accent" disabled={pending}>
            {pending ? "Enregistrement…" : "Enregistrer"}
          </button>
          <Link href="/compte/annonces" className="btn btn-outline">
            Annuler
          </Link>
        </div>
      </form>
    </main>
  );
}
