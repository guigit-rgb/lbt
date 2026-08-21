"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PhotoGrid, { type Photo } from "@/components/PhotoGrid";
import { getFiltersForCategory } from "@/lib/listing-config";
import type { annonces } from "@/lib/db/schema";
import { modifierAnnonce, type CreerAnnonceResult } from "@/lib/actions/annonces";

type Annonce = typeof annonces.$inferSelect;

const CARBURANTS = ["Essence", "Diesel", "Hybride", "Électrique", "Autre"];
const PORTES = ["2", "3", "4", "5"];
const PLACES = ["2", "4", "5", "7", "9"];
const ETATS_VEHICULE = ["Neuf", "Comme neuf", "Bon état", "Réparations mineures à prévoir", "Pour pièces"];
const TYPES_VEHICULE = ["Berline", "Citadine", "SUV / 4x4", "Break", "Coupé", "Cabriolet", "Monospace", "Utilitaire"];
const COULEURS = ["Noir", "Blanc", "Gris", "Bleu", "Rouge", "Vert", "Marron", "Beige", "Jaune", "Orange"];
const SELLERIES = ["Tissu", "Cuir", "Simili-cuir"];
const PERMIS_OPTIONS = ["Permis B", "Sans permis (voiturette)"];

const initialState: CreerAnnonceResult = { success: true, id: "" };

function formatPrix(prixCents: number | null): string {
  if (prixCents == null) return "Prix sur demande";
  return `${(prixCents / 100).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`;
}

export default function ModifierAnnonceForm({
  annonce,
  photosInitiales,
}: {
  annonce: Annonce;
  photosInitiales: Photo[];
}) {
  const attributs = annonce.attributs as Record<string, string>;

  const [carburant, setCarburant] = useState(attributs.carburant ?? "");
  const [boite, setBoite] = useState(attributs.boite ?? "");
  const [photos, setPhotos] = useState<Photo[]>(photosInitiales);
  const [prix, setPrix] = useState(annonce.prixCents != null ? (annonce.prixCents / 100).toString() : "");
  const [ville, setVille] = useState(annonce.ville ?? "");
  const [codePostal, setCodePostal] = useState(annonce.codePostal ?? "");
  const [titre, setTitre] = useState(annonce.titre);

  const [state, formAction, pending] = useActionState(
    async (_prev: CreerAnnonceResult, formData: FormData) => modifierAnnonce(annonce.id, formData),
    initialState
  );

  const categorieLabel = getFiltersForCategory(annonce.categorie).label;
  const prixCentsAffiche = prix ? Math.round(Number.parseFloat(prix.replace(",", ".")) * 100) : null;

  return (
    <>
      <SiteHeader activeCategorie={annonce.categorie} />

      <main className="wrap" style={{ maxWidth: 900, paddingTop: "2rem", paddingBottom: "3rem" }}>
        <h1 style={{ marginBottom: "1.5rem" }}>Modifiez votre annonce</h1>

        <div className="depot-card" style={{ maxWidth: "none", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
            <div className="depot-photo-tile" style={{ width: 110, height: 110, cursor: "default" }}>
              {photos[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photos[0].url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "0.72rem", color: "var(--muted)", textAlign: "center", padding: "0.5rem" }}>
                  {categorieLabel}
                </span>
              )}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.25rem" }}>{titre}</p>
              <p style={{ fontWeight: 700, marginBottom: "0.35rem" }}>{formatPrix(prixCentsAffiche)}</p>
              <p style={{ color: "var(--muted)" }}>
                {categorieLabel}
                {ville && (
                  <>
                    {" · "}
                    {ville} {codePostal && `(${codePostal})`}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="depot-card" style={{ maxWidth: "none", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Ajoutez des photos</h2>
          <PhotoGrid
            annonceId={annonce.id}
            categorie={annonce.categorie}
            initialPhotos={photosInitiales}
            onPhotosChange={setPhotos}
          />
        </div>

        <div className="depot-card" style={{ maxWidth: "none" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "1.25rem" }}>Dites-nous en plus</h2>

          <form action={formAction}>
            <label className="depot-fallback-label" htmlFor="modifier-titre">
              <span className="depot-question">Titre</span>
              <input
                id="modifier-titre"
                name="titre"
                className="depot-input"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
                minLength={3}
              />
            </label>

            <label className="depot-fallback-label" htmlFor="modifier-description">
              <span className="depot-question">Description</span>
              <textarea
                id="modifier-description"
                name="description"
                className="depot-textarea"
                defaultValue={annonce.description}
                rows={5}
                required
                minLength={10}
              />
            </label>

            <label className="depot-fallback-label" htmlFor="modifier-prix">
              <span className="depot-question">Prix (€)</span>
              <input
                id="modifier-prix"
                name="prix"
                type="text"
                className="depot-input"
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
              />
            </label>

            <div className="depot-field-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <label>
                <span className="depot-question">Ville</span>
                <input
                  name="ville"
                  className="depot-input"
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  required
                />
              </label>
              <label>
                <span className="depot-question">Code postal</span>
                <input
                  name="codePostal"
                  className="depot-input"
                  value={codePostal}
                  onChange={(e) => setCodePostal(e.target.value)}
                  required
                  pattern="\d{5}"
                  maxLength={5}
                />
              </label>
            </div>

            {annonce.categorie === "vehicules" && (
              <fieldset style={{ border: "1px solid var(--line)", borderRadius: 10, padding: "1.25rem", marginBottom: "1.25rem" }}>
                <legend style={{ padding: "0 0.5rem", fontWeight: 600 }}>Véhicule</legend>
                <div className="depot-field-row">
                  <label>
                    <span className="depot-question">Marque</span>
                    <input name="marque" className="depot-input" defaultValue={annonce.marque ?? ""} />
                  </label>
                  <label>
                    <span className="depot-question">Modèle</span>
                    <input name="modele" className="depot-input" defaultValue={annonce.modele ?? ""} />
                  </label>
                  <label>
                    <span className="depot-question">Année</span>
                    <input name="annee" type="number" className="depot-input" defaultValue={annonce.annee ?? ""} />
                  </label>
                  <label>
                    <span className="depot-question">Kilométrage</span>
                    <input
                      name="kilometrage"
                      type="number"
                      className="depot-input"
                      defaultValue={annonce.kilometrage ?? ""}
                    />
                  </label>
                </div>

                <span className="depot-question">Carburant</span>
                <div className="depot-chip-row">
                  {CARBURANTS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`depot-chip${carburant === c ? " active" : ""}`}
                      onClick={() => setCarburant(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <input type="hidden" name="carburant" value={carburant} />

                <span className="depot-question">Boîte</span>
                <div className="depot-radio-group">
                  <label>
                    <input
                      type="radio"
                      name="boite-radio"
                      checked={boite === "Manuelle"}
                      onChange={() => setBoite("Manuelle")}
                    />
                    Manuelle
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="boite-radio"
                      checked={boite === "Automatique"}
                      onChange={() => setBoite("Automatique")}
                    />
                    Automatique
                  </label>
                </div>
                <input type="hidden" name="boite" value={boite} />

                <div className="depot-field-row">
                  <label>
                    <span className="depot-question">Nombre de portes</span>
                    <select name="portes" className="depot-select" defaultValue={attributs.portes ?? ""}>
                      <option value="">Choisissez</option>
                      {PORTES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="depot-question">Nombre de places</span>
                    <select name="places" className="depot-select" defaultValue={attributs.places ?? ""}>
                      <option value="">Choisissez</option>
                      {PLACES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="depot-question">Type de véhicule</span>
                    <select name="typeVehicule" className="depot-select" defaultValue={attributs.typeVehicule ?? ""}>
                      <option value="">Choisissez</option>
                      {TYPES_VEHICULE.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="depot-question">État du véhicule</span>
                    <select name="etatVehicule" className="depot-select" defaultValue={attributs.etatVehicule ?? ""}>
                      <option value="">Choisissez</option>
                      {ETATS_VEHICULE.map((e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="depot-question">Couleur</span>
                    <select name="couleur" className="depot-select" defaultValue={attributs.couleur ?? ""}>
                      <option value="">Choisissez</option>
                      {COULEURS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="depot-question">Sellerie</span>
                    <select name="sellerie" className="depot-select" defaultValue={attributs.sellerie ?? ""}>
                      <option value="">Choisissez</option>
                      {SELLERIES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="depot-question">Permis</span>
                    <select name="permis" className="depot-select" defaultValue={attributs.permis ?? ""}>
                      <option value="">Choisissez</option>
                      {PERMIS_OPTIONS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="depot-question">Puissance fiscale (CV)</span>
                    <input
                      name="puissanceFiscale"
                      type="number"
                      className="depot-input"
                      defaultValue={attributs.puissanceFiscale ?? ""}
                    />
                  </label>
                  <label>
                    <span className="depot-question">Puissance DIN (ch)</span>
                    <input
                      name="puissanceDin"
                      type="number"
                      className="depot-input"
                      defaultValue={attributs.puissanceDin ?? ""}
                    />
                  </label>
                  <label>
                    <span className="depot-question">Mise en circulation (MM/AAAA)</span>
                    <input
                      name="miseEnCirculation"
                      className="depot-input"
                      placeholder="03/2018"
                      defaultValue={attributs.miseEnCirculation ?? ""}
                    />
                  </label>
                  <label>
                    <span className="depot-question">Contrôle technique valide jusqu&apos;à</span>
                    <input
                      name="controleTechnique"
                      type="number"
                      className="depot-input"
                      placeholder="2026"
                      defaultValue={attributs.controleTechnique ?? ""}
                    />
                  </label>
                </div>

                <label>
                  <span className="depot-question">Équipements (séparés par des virgules)</span>
                  <input
                    name="equipements"
                    className="depot-input"
                    placeholder="Climatisation, GPS, Toit ouvrant…"
                    defaultValue={attributs.equipements ?? ""}
                  />
                </label>
              </fieldset>
            )}

            {state && "error" in state && <p style={{ color: "var(--brand-red)" }}>{state.error}</p>}

            <div className="depot-actions" style={{ marginTop: annonce.categorie === "vehicules" ? 0 : "0.5rem" }}>
              <button type="submit" className="btn btn-accent" disabled={pending}>
                {pending ? "Enregistrement…" : "Enregistrer"}
              </button>
              <Link href="/compte/annonces" className="btn btn-outline">
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
