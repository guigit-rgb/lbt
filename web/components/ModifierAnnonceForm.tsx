"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PhotoGrid, { type Photo } from "@/components/PhotoGrid";
import { getFiltersForCategory } from "@/lib/listing-config";
import type { annonces } from "@/lib/db/schema";
import { modifierAnnonce, type CreerAnnonceResult } from "@/lib/actions/annonces";
import { MARQUES_COURANTES, MARQUES_AUTRES } from "@/lib/marques";
import { TYPES_VEHICULE } from "@/lib/vehicule-types";
import {
  TYPES_BIEN,
  TYPES_VENTE,
  EXTERIEURS,
  ETAGES,
  EXPOSITIONS,
  CARACTERISTIQUES,
  ETATS_BIEN,
  DPE_CLASSES,
} from "@/lib/immobilier-types";
import { SUBCATEGORY_FILTERS, LOCATIONS_VACANCES } from "@/lib/subcategory-filters";
import AttributsDynamiques from "@/components/AttributsDynamiques";

type Annonce = typeof annonces.$inferSelect;

const CARBURANTS = ["Essence", "Diesel", "Hybride", "Électrique", "Autre"];
const PORTES = ["2", "3", "4", "5"];
const PLACES = ["2", "4", "5", "7", "9"];
const ETATS_VEHICULE = ["Neuf", "Comme neuf", "Bon état", "Réparations mineures à prévoir", "Pour pièces"];
const COULEURS = ["Noir", "Blanc", "Gris", "Bleu", "Rouge", "Vert", "Marron", "Beige", "Jaune", "Orange"];
const SELLERIES = ["Tissu", "Cuir", "Simili-cuir"];
const PERMIS_OPTIONS = ["Permis B", "Sans permis (voiturette)"];
const CRIT_AIR_OPTIONS = ["Crit'Air E", "Crit'Air 1", "Crit'Air 2", "Crit'Air 3", "Crit'Air 4", "Crit'Air 5", "Non classé"];

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
  const attributs = annonce.attributs as Record<string, string | string[]>;
  const attributsTexte = attributs as Record<string, string>;

  const [carburant, setCarburant] = useState(attributsTexte.carburant ?? "");
  const [boite, setBoite] = useState(attributsTexte.boite ?? "");
  const [ascenseur, setAscenseur] = useState(attributsTexte.ascenseur === "1");
  const [exterieur, setExterieur] = useState<string[]>(Array.isArray(attributs.exterieur) ? attributs.exterieur : []);
  const [caracteristiques, setCaracteristiques] = useState<string[]>(
    Array.isArray(attributs.caracteristiques) ? attributs.caracteristiques : []
  );

  // Matériel pro, Électronique, Emploi, Mode, Maison & Jardin, Famille,
  // Services, Animaux, Locations de vacances (et, en bonus, Loisirs — même
  // mécanisme) : la sous-catégorie n'est pas modifiable ici, seuls ses
  // champs le sont (cf. AttributsDynamiques).
  const champsGeneriques =
    annonce.categorie === "locations-vacances"
      ? LOCATIONS_VACANCES
      : (SUBCATEGORY_FILTERS[annonce.categorie]?.[annonce.sousCategorie ?? ""] ?? []);
  const [attributsGeneriques, setAttributsGeneriques] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const champ of champsGeneriques) {
      if (champ.key === "etat_produit") {
        init[champ.key] = annonce.etatProduit ?? "";
      } else if (champ.key === "type_animal") {
        init[champ.key] = annonce.typeAnimal ?? "";
      } else {
        const valeur = attributs[champ.key];
        init[champ.key] = Array.isArray(valeur) ? valeur.join(",") : (valeur ?? "");
      }
    }
    return init;
  });

  function toggleDansListe(liste: string[], setListe: (v: string[]) => void, valeur: string) {
    setListe(liste.includes(valeur) ? liste.filter((v) => v !== valeur) : [...liste, valeur]);
  }
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
                    <select name="marque" className="depot-select" defaultValue={annonce.marque ?? ""}>
                      <option value="">Choisissez</option>
                      {/* Annonce déposée avant le passage en liste fermée
                          (marque en texte libre) : préserve la valeur
                          existante plutôt que de la perdre silencieusement. */}
                      {annonce.marque &&
                        !MARQUES_COURANTES.includes(annonce.marque as (typeof MARQUES_COURANTES)[number]) &&
                        !MARQUES_AUTRES.includes(annonce.marque as (typeof MARQUES_AUTRES)[number]) && (
                          <option value={annonce.marque}>{annonce.marque}</option>
                        )}
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
                      <option value="Autre">Autre</option>
                    </select>
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
                    <select name="portes" className="depot-select" defaultValue={attributsTexte.portes ?? ""}>
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
                    <select name="places" className="depot-select" defaultValue={attributsTexte.places ?? ""}>
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
                    <select name="typeVehicule" className="depot-select" defaultValue={attributsTexte.typeVehicule ?? ""}>
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
                    <select name="etatVehicule" className="depot-select" defaultValue={attributsTexte.etatVehicule ?? ""}>
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
                    <select name="couleur" className="depot-select" defaultValue={attributsTexte.couleur ?? ""}>
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
                    <select name="sellerie" className="depot-select" defaultValue={attributsTexte.sellerie ?? ""}>
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
                    <select name="permis" className="depot-select" defaultValue={attributsTexte.permis ?? ""}>
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
                      defaultValue={attributsTexte.puissanceFiscale ?? ""}
                    />
                  </label>
                  <label>
                    <span className="depot-question">Puissance DIN (ch)</span>
                    <input
                      name="puissanceDin"
                      type="number"
                      className="depot-input"
                      defaultValue={attributsTexte.puissanceDin ?? ""}
                    />
                  </label>
                  <label>
                    <span className="depot-question">Mise en circulation (MM/AAAA)</span>
                    <input
                      name="miseEnCirculation"
                      className="depot-input"
                      placeholder="03/2018"
                      defaultValue={attributsTexte.miseEnCirculation ?? ""}
                    />
                  </label>
                  <label>
                    <span className="depot-question">Contrôle technique valide jusqu&apos;à</span>
                    <input
                      name="controleTechnique"
                      type="number"
                      className="depot-input"
                      placeholder="2026"
                      defaultValue={attributsTexte.controleTechnique ?? ""}
                    />
                  </label>
                  <label>
                    <span className="depot-question">Crit&apos;air</span>
                    <select name="critAir" className="depot-select" defaultValue={attributsTexte.critAir ?? ""}>
                      <option value="">Choisissez</option>
                      {CRIT_AIR_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label>
                  <span className="depot-question">Équipements (séparés par des virgules)</span>
                  <input
                    name="equipements"
                    className="depot-input"
                    placeholder="Climatisation, GPS, Toit ouvrant…"
                    defaultValue={attributsTexte.equipements ?? ""}
                  />
                </label>
              </fieldset>
            )}

            {annonce.categorie === "immobilier" && (
              <fieldset style={{ border: "1px solid var(--line)", borderRadius: 10, padding: "1.25rem", marginBottom: "1.25rem" }}>
                <legend style={{ padding: "0 0.5rem", fontWeight: 600 }}>Bien</legend>
                <div className="depot-field-row">
                  <label>
                    <span className="depot-question">Type de bien</span>
                    <select name="typeBien" className="depot-select" defaultValue={attributsTexte.typeBien ?? ""}>
                      <option value="">Choisissez</option>
                      {TYPES_BIEN.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="depot-question">Type de vente</span>
                    <select name="typeVente" className="depot-select" defaultValue={attributsTexte.typeVente ?? ""}>
                      <option value="">Choisissez</option>
                      {TYPES_VENTE.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="depot-question">Surface habitable (m²)</span>
                    <input
                      name="surfaceHabitable"
                      type="number"
                      className="depot-input"
                      defaultValue={attributsTexte.surfaceHabitable ?? ""}
                    />
                  </label>
                  <label>
                    <span className="depot-question">Surface du terrain (m²)</span>
                    <input
                      name="surfaceTerrain"
                      type="number"
                      className="depot-input"
                      defaultValue={attributsTexte.surfaceTerrain ?? ""}
                    />
                  </label>
                  <label>
                    <span className="depot-question">Pièces</span>
                    <input name="pieces" type="number" className="depot-input" defaultValue={attributsTexte.pieces ?? ""} />
                  </label>
                  <label>
                    <span className="depot-question">Chambres</span>
                    <input
                      name="chambres"
                      type="number"
                      className="depot-input"
                      defaultValue={attributsTexte.chambres ?? ""}
                    />
                  </label>
                  <label>
                    <span className="depot-question">Étage</span>
                    <select name="etage" className="depot-select" defaultValue={attributsTexte.etage ?? ""}>
                      <option value="">Choisissez</option>
                      {ETAGES.map((e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="depot-question">Exposition</span>
                    <select name="exposition" className="depot-select" defaultValue={attributsTexte.exposition ?? ""}>
                      <option value="">Choisissez</option>
                      {EXPOSITIONS.map((e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="depot-question">État du bien</span>
                    <select name="etatBien" className="depot-select" defaultValue={attributsTexte.etatBien ?? ""}>
                      <option value="">Choisissez</option>
                      {ETATS_BIEN.map((e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="depot-question">Classe énergie (DPE)</span>
                    <select name="dpe" className="depot-select" defaultValue={attributsTexte.dpe ?? ""}>
                      <option value="">Choisissez</option>
                      {DPE_CLASSES.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="depot-offer-option" style={{ display: "inline-flex", gap: "0.5rem", alignItems: "center" }}>
                  <input type="checkbox" checked={ascenseur} onChange={(e) => setAscenseur(e.target.checked)} />
                  Avec ascenseur
                </label>
                <input type="hidden" name="ascenseur" value={ascenseur ? "1" : ""} />

                <span className="depot-question">Extérieur</span>
                <div className="depot-chip-row">
                  {EXTERIEURS.map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`depot-chip${exterieur.includes(val) ? " active" : ""}`}
                      onClick={() => toggleDansListe(exterieur, setExterieur, val)}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <input type="hidden" name="exterieur" value={exterieur.join(",")} />

                <span className="depot-question">Caractéristiques</span>
                <div className="depot-chip-row">
                  {CARACTERISTIQUES.map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`depot-chip${caracteristiques.includes(val) ? " active" : ""}`}
                      onClick={() => toggleDansListe(caracteristiques, setCaracteristiques, val)}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <input type="hidden" name="caracteristiques" value={caracteristiques.join(",")} />
              </fieldset>
            )}

            {champsGeneriques.length > 0 && (
              <fieldset style={{ border: "1px solid var(--line)", borderRadius: 10, padding: "1.25rem", marginBottom: "1.25rem" }}>
                <legend style={{ padding: "0 0.5rem", fontWeight: 600 }}>
                  {annonce.sousCategorie ?? getFiltersForCategory(annonce.categorie).label}
                </legend>
                <AttributsDynamiques
                  fields={champsGeneriques}
                  values={attributsGeneriques}
                  onChange={(k, v) => setAttributsGeneriques((prev) => ({ ...prev, [k]: v }))}
                />
                {Object.entries(attributsGeneriques).map(([k, v]) => (
                  <input key={k} type="hidden" name={k} value={v} />
                ))}
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
