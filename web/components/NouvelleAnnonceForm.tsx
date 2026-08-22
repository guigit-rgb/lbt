"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { MEGA_MENU, AUTRES_ENTRY, DONS_ENTRY } from "@/lib/categories";
import type { Categorie } from "@/lib/db/schema";
import { enregistrerBrouillon, publierAnnonce, type CreerAnnonceResult } from "@/lib/actions/annonces";
import PhotoGrid, { type Photo } from "@/components/PhotoGrid";
import { MARQUES_COURANTES, MARQUES_AUTRES } from "@/lib/marques";
import { TYPES_VEHICULE } from "@/lib/vehicule-types";

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

const CATEGORY_ICONS: Partial<Record<Categorie, string>> = Object.fromEntries([
  ...MEGA_MENU.map((entry) => [entry.categorie, entry.icon] as const),
  [AUTRES_ENTRY.categorie, AUTRES_ENTRY.icon] as const,
  [DONS_ENTRY.categorie, DONS_ENTRY.icon] as const,
]);

const LOISIRS_SOUS_CATEGORIES = MEGA_MENU.find((e) => e.categorie === "loisirs")!.columns.flatMap((col) =>
  col.flatMap((group) => group.links.map((l) => l.label))
);

const CARBURANTS = ["Essence", "Diesel", "Hybride", "Électrique", "Autre"];
const ETATS_PRODUIT = ["Neuf", "Très bon état", "Bon état", "Satisfaisant"];
const TYPES_ANIMAUX = ["Chien", "Chat", "Oiseau", "Rongeur", "Autre"];

const PORTES = ["2", "3", "4", "5"];
const PLACES = ["2", "4", "5", "7", "9"];
const ETATS_VEHICULE = ["Neuf", "Comme neuf", "Bon état", "Réparations mineures à prévoir", "Pour pièces"];
const COULEURS = ["Noir", "Blanc", "Gris", "Bleu", "Rouge", "Vert", "Marron", "Beige", "Jaune", "Orange"];
const SELLERIES = ["Tissu", "Cuir", "Simili-cuir"];
const PERMIS_OPTIONS = ["Permis B", "Sans permis (voiturette)"];
const CRIT_AIR_OPTIONS = ["Crit'Air E", "Crit'Air 1", "Crit'Air 2", "Crit'Air 3", "Crit'Air 4", "Crit'Air 5", "Non classé"];

const initialState: CreerAnnonceResult = { success: true, id: "" };

function renderSuggestionLabel(label: string) {
  const parts = label.split(">").map((p) => p.trim());
  if (parts.length < 2) {
    return <strong>{parts[0]}</strong>;
  }
  return (
    <>
      {parts[0]}
      <span className="path-sep">›</span>
      <strong>{parts.slice(1).join(" › ")}</strong>
    </>
  );
}

const CARD_TITLES: Record<number, string> = {
  1: "Démarrons cette annonce",
  2: "Ajoutez des photos",
  4: "Décrivez votre annonce",
  5: "Fixons un prix",
  6: "Où se trouve votre annonce ?",
  7: "Vérifiez avant de publier",
};

const TIPS: Record<number, { title: string; text: string }> = {
  1: {
    title: "Votre annonce sera trouvée plus facilement !",
    text: "Vous aurez 50% de chances en plus d'être contacté si votre annonce est dans la bonne catégorie.",
  },
  2: {
    title: "Ajoutez un maximum de photos",
    text: "pour augmenter le nombre de contacts.",
  },
  3: {
    title: "Plus de détails, plus de contacts sérieux.",
    text: "Les acheteurs filtrent souvent sur des caractéristiques précises avant de vous contacter.",
  },
  4: {
    title: "Une description honnête inspire confiance.",
    text: "Mentionnez l'état réel et ce qui est inclus : vous limiterez les questions et les déceptions.",
  },
  5: {
    title: "Un prix juste attire plus vite.",
    text: "Regardez ce qui se vend pour un bien similaire avant de fixer votre prix.",
  },
  6: {
    title: "La proximité compte.",
    text: "Les acheteurs près de chez vous sont prioritaires dans les résultats de recherche.",
  },
  7: {
    title: "Vérifiez avant de publier.",
    text: "Vous pourrez modifier ou retirer votre annonce à tout moment depuis « Mes annonces ».",
  },
};

export default function NouvelleAnnonceForm() {
  const [step, setStep] = useState(1);

  const [titre, setTitre] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [categorie, setCategorie] = useState<Categorie | "">("");
  const [typeAnnonce, setTypeAnnonce] = useState<"offre" | "demande">("offre");
  const [annonceId, setAnnonceId] = useState<string | null>(null);
  const [savingBrouillon, setSavingBrouillon] = useState(false);
  const [essentielError, setEssentielError] = useState("");

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);

  const [marque, setMarque] = useState("");
  const [modele, setModele] = useState("");
  const [annee, setAnnee] = useState("");
  const [kilometrage, setKilometrage] = useState("");
  const [carburant, setCarburant] = useState("");
  const [boite, setBoite] = useState("");
  const [portes, setPortes] = useState("");
  const [places, setPlaces] = useState("");
  const [etatVehicule, setEtatVehicule] = useState("");
  const [typeVehicule, setTypeVehicule] = useState("");
  const [couleur, setCouleur] = useState("");
  const [sellerie, setSellerie] = useState("");
  const [equipements, setEquipements] = useState("");
  const [puissanceFiscale, setPuissanceFiscale] = useState("");
  const [puissanceDin, setPuissanceDin] = useState("");
  const [permis, setPermis] = useState("");
  const [controleTechnique, setControleTechnique] = useState("");
  const [miseEnCirculation, setMiseEnCirculation] = useState("");
  const [critAir, setCritAir] = useState("");

  const [sousCategorie, setSousCategorie] = useState("");
  const [etatProduit, setEtatProduit] = useState("");
  const [typeAnimal, setTypeAnimal] = useState("");

  const [description, setDescription] = useState("");
  const [generatingDescription, setGeneratingDescription] = useState(false);

  const [prix, setPrix] = useState("");
  const [ville, setVille] = useState("");
  const [codePostal, setCodePostal] = useState("");

  const [state, formAction, pending] = useActionState(
    async (_prev: CreerAnnonceResult, formData: FormData) =>
      annonceId ? publierAnnonce(annonceId, formData) : { error: "Brouillon manquant, revenez à l'étape 1." },
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
  const displayStep = hasDetailStep || step < 3 ? step : step - 1;

  function next() {
    setStep((s) => (hasDetailStep ? s + 1 : s === 2 ? s + 2 : s + 1));
  }
  function back() {
    setStep((s) => (hasDetailStep ? s - 1 : s === 4 ? s - 2 : s - 1));
  }

  function choisirCategorie(value: Categorie | "") {
    setCategorie(value);
  }

  async function continuerEssentiel() {
    setEssentielError("");
    setSavingBrouillon(true);
    const res = await enregistrerBrouillon({ id: annonceId ?? undefined, titre, categorie, typeAnnonce });
    setSavingBrouillon(false);
    if ("error" in res) {
      setEssentielError(res.error);
      return;
    }
    setAnnonceId(res.id);
    next();
  }


  const cardTitle =
    step === 3
      ? categorie === "vehicules"
        ? "Les caractéristiques du véhicule"
        : categorie === "loisirs"
          ? "Parlez-nous de votre objet"
          : "Quelques précisions"
      : CARD_TITLES[step];

  const tip = TIPS[Math.min(step, 7)];
  const peutContinuerEssentiel = titre.trim().length >= 3 && categorie !== "" && !savingBrouillon;

  return (
    <div className="depot-page">
      <div className="depot-top">
        <div className="depot-top-inner">
          <Link className="wordmark" href="/">
            <span>lebon</span>
            <span className="truc">truc</span>
          </Link>
          <span className="depot-top-title">Déposer une annonce</span>
          <Link href="/compte/annonces" className="depot-quit">
            Quitter
          </Link>
        </div>
      </div>

      <div className="depot-body">
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="depot-step-label">
            Étape {displayStep} / {totalSteps}
          </p>

          <div className="depot-card">
            <h1>{cardTitle}</h1>

            {step === 1 && (
              <section>
                <p className="depot-required-note">* champs obligatoires</p>
                <label className="depot-question" htmlFor="titre-annonce">
                  Quel est le titre de l&apos;annonce ?<span className="req">*</span>
                </label>
                <input
                  id="titre-annonce"
                  type="text"
                  className="depot-input"
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  maxLength={200}
                  autoFocus
                />
                <p className="depot-counter">{titre.length}/200</p>

                {titre.trim().length >= 3 && (
                  <>
                    {categorie === "" ? (
                      <>
                        <hr className="depot-divider" />
                        {loadingSuggestions && <p style={{ color: "var(--muted)" }}>Recherche de catégories…</p>}
                        {suggestions.length > 0 && (
                          <>
                            <p className="depot-suggestions-heading">Choisissez une catégorie suggérée</p>
                            <div className="depot-suggestion-list">
                              {suggestions.map((s) => (
                                <label
                                  key={`${s.categorie}-${s.sousCategorie ?? ""}`}
                                  className="depot-suggestion-item"
                                >
                                  <input
                                    type="radio"
                                    name="categorie-suggeree"
                                    // Sélectionner une suggestion fixe `categorie` à une valeur non vide,
                                    // ce qui fait immédiatement basculer vers la vue "catégorie choisie" —
                                    // ce radio ne peut donc jamais être rendu déjà coché.
                                    checked={false}
                                    onChange={() => {
                                      choisirCategorie(s.categorie);
                                      if (s.categorie === "loisirs" && s.sousCategorie) setSousCategorie(s.sousCategorie);
                                    }}
                                  />
                                  <span className="depot-suggestion-icon">{CATEGORY_ICONS[s.categorie]}</span>
                                  <span>{renderSuggestionLabel(s.label)}</span>
                                </label>
                              ))}
                            </div>
                          </>
                        )}
                        <label className="depot-fallback-label" htmlFor="categorie-select">
                          <span className="depot-question">
                            Ou choisissez une autre catégorie<span className="req">*</span>
                          </span>
                          <select
                            id="categorie-select"
                            className="depot-select"
                            value=""
                            onChange={(e) => choisirCategorie(e.target.value as Categorie)}
                          >
                            <option value="">Choisissez</option>
                            {CATEGORY_OPTIONS.map((c) => (
                              <option key={c.categorie} value={c.categorie}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      </>
                    ) : (
                      <>
                        <label className="depot-fallback-label" htmlFor="categorie-select-2">
                          <span className="depot-question">
                            Catégorie<span className="req">*</span>
                          </span>
                          <select
                            id="categorie-select-2"
                            className="depot-select"
                            value={categorie}
                            onChange={(e) => choisirCategorie(e.target.value as Categorie | "")}
                          >
                            <option value="">Choisissez</option>
                            {CATEGORY_OPTIONS.map((c) => (
                              <option key={c.categorie} value={c.categorie}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        </label>

                        <span className="depot-question">
                          Type d&apos;annonce<span className="req">*</span>
                        </span>
                        <div className="depot-offer-options">
                          <label className="depot-offer-option">
                            <input
                              type="radio"
                              name="type-annonce"
                              checked={typeAnnonce === "offre"}
                              onChange={() => setTypeAnnonce("offre")}
                            />
                            <span>
                              <span className="title">Offre</span>
                              <br />
                              <span className="sub">Vous vendez ou proposez un bien.</span>
                            </span>
                          </label>
                          <label className="depot-offer-option">
                            <input
                              type="radio"
                              name="type-annonce"
                              checked={typeAnnonce === "demande"}
                              onChange={() => setTypeAnnonce("demande")}
                            />
                            <span>
                              <span className="title">Demande</span>
                              <br />
                              <span className="sub">Vous recherchez ce type de bien.</span>
                            </span>
                          </label>
                        </div>

                        {essentielError && <p style={{ color: "var(--brand-red)" }}>{essentielError}</p>}
                        <div className="depot-actions" style={{ justifyContent: "flex-end" }}>
                          <button
                            type="button"
                            className="btn btn-accent"
                            disabled={!peutContinuerEssentiel}
                            onClick={continuerEssentiel}
                          >
                            {savingBrouillon ? "…" : "Continuer"}
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}

                <p className="depot-legal" style={{ marginTop: "1.75rem" }}>
                  <a href="#">En savoir plus</a> sur le traitement de vos données et exercer vos droits.
                </p>
              </section>
            )}

            {step === 2 && annonceId && (
              <section>
                <PhotoGrid
                  annonceId={annonceId}
                  categorie={categorie}
                  onPhotosChange={setPhotos}
                  onUploadingChange={setUploading}
                />

                <div className="depot-actions">
                  <button type="button" className="btn btn-outline" onClick={back}>
                    Retour
                  </button>
                  <button
                    type="button"
                    className="btn btn-accent"
                    disabled={photos.length === 0 || uploading}
                    onClick={next}
                  >
                    Continuer
                  </button>
                </div>
              </section>
            )}

            {step === 3 && hasDetailStep && categorie === "vehicules" && (
              <section>
                <div className="depot-field-row">
                  <label>
                    <span className="depot-question">Marque</span>
                    <select className="depot-select" value={marque} onChange={(e) => setMarque(e.target.value)}>
                      <option value="">Choisissez</option>
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
                    <input className="depot-input" value={modele} onChange={(e) => setModele(e.target.value)} />
                  </label>
                  <label>
                    <span className="depot-question">Année</span>
                    <input
                      type="number"
                      className="depot-input"
                      value={annee}
                      onChange={(e) => setAnnee(e.target.value)}
                    />
                  </label>
                  <label>
                    <span className="depot-question">Kilométrage</span>
                    <input
                      type="number"
                      className="depot-input"
                      value={kilometrage}
                      onChange={(e) => setKilometrage(e.target.value)}
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

                <span className="depot-question">Boîte</span>
                <div className="depot-radio-group">
                  <label>
                    <input type="radio" name="boite" checked={boite === "Manuelle"} onChange={() => setBoite("Manuelle")} />
                    Manuelle
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="boite"
                      checked={boite === "Automatique"}
                      onChange={() => setBoite("Automatique")}
                    />
                    Automatique
                  </label>
                </div>

                <div className="depot-field-row">
                  <label>
                    <span className="depot-question">Nombre de portes</span>
                    <select className="depot-select" value={portes} onChange={(e) => setPortes(e.target.value)}>
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
                    <select className="depot-select" value={places} onChange={(e) => setPlaces(e.target.value)}>
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
                    <select className="depot-select" value={typeVehicule} onChange={(e) => setTypeVehicule(e.target.value)}>
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
                    <select className="depot-select" value={etatVehicule} onChange={(e) => setEtatVehicule(e.target.value)}>
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
                    <select className="depot-select" value={couleur} onChange={(e) => setCouleur(e.target.value)}>
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
                    <select className="depot-select" value={sellerie} onChange={(e) => setSellerie(e.target.value)}>
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
                    <select className="depot-select" value={permis} onChange={(e) => setPermis(e.target.value)}>
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
                      type="number"
                      className="depot-input"
                      value={puissanceFiscale}
                      onChange={(e) => setPuissanceFiscale(e.target.value)}
                    />
                  </label>
                  <label>
                    <span className="depot-question">Puissance DIN (ch)</span>
                    <input
                      type="number"
                      className="depot-input"
                      value={puissanceDin}
                      onChange={(e) => setPuissanceDin(e.target.value)}
                    />
                  </label>
                  <label>
                    <span className="depot-question">Mise en circulation (MM/AAAA)</span>
                    <input
                      className="depot-input"
                      placeholder="03/2018"
                      value={miseEnCirculation}
                      onChange={(e) => setMiseEnCirculation(e.target.value)}
                    />
                  </label>
                  <label>
                    <span className="depot-question">Contrôle technique valide jusqu&apos;à</span>
                    <input
                      type="number"
                      className="depot-input"
                      placeholder="2026"
                      value={controleTechnique}
                      onChange={(e) => setControleTechnique(e.target.value)}
                    />
                  </label>
                  <label>
                    <span className="depot-question">Crit&apos;air</span>
                    <select className="depot-select" value={critAir} onChange={(e) => setCritAir(e.target.value)}>
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
                    className="depot-input"
                    placeholder="Climatisation, GPS, Toit ouvrant…"
                    value={equipements}
                    onChange={(e) => setEquipements(e.target.value)}
                  />
                </label>

                <div className="depot-actions">
                  <button type="button" className="btn btn-outline" onClick={back}>
                    Retour
                  </button>
                  <button type="button" className="btn btn-accent" onClick={next}>
                    Continuer
                  </button>
                </div>
              </section>
            )}

            {step === 3 && hasDetailStep && categorie === "loisirs" && (
              <section>
                <label>
                  <span className="depot-question">Sous-catégorie</span>
                  <select
                    className="depot-select"
                    value={sousCategorie}
                    onChange={(e) => setSousCategorie(e.target.value)}
                    style={{ marginBottom: "1.25rem" }}
                  >
                    <option value="">Choisissez</option>
                    {LOISIRS_SOUS_CATEGORIES.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </label>

                <span className="depot-question">État</span>
                <div className="depot-chip-row">
                  {ETATS_PRODUIT.map((e) => (
                    <button
                      key={e}
                      type="button"
                      className={`depot-chip${etatProduit === e ? " active" : ""}`}
                      onClick={() => setEtatProduit(e)}
                    >
                      {e}
                    </button>
                  ))}
                </div>

                <div className="depot-actions">
                  <button type="button" className="btn btn-outline" onClick={back}>
                    Retour
                  </button>
                  <button type="button" className="btn btn-accent" onClick={next}>
                    Continuer
                  </button>
                </div>
              </section>
            )}

            {step === 3 && hasDetailStep && categorie === "animaux" && (
              <section>
                <span className="depot-question">Type d&apos;animal</span>
                <div className="depot-chip-row">
                  {TYPES_ANIMAUX.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`depot-chip${typeAnimal === t ? " active" : ""}`}
                      onClick={() => setTypeAnimal(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="depot-actions">
                  <button type="button" className="btn btn-outline" onClick={back}>
                    Retour
                  </button>
                  <button type="button" className="btn btn-accent" onClick={next}>
                    Continuer
                  </button>
                </div>
              </section>
            )}

            {step === 4 && (
              <section>
                <button
                  type="button"
                  className="depot-ai-btn"
                  onClick={genererDescription}
                  disabled={generatingDescription}
                >
                  {generatingDescription ? "Génération…" : "✨ Générer une description"}
                </button>
                <textarea
                  className="depot-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  maxLength={4000}
                />
                <div className="depot-actions">
                  <button type="button" className="btn btn-outline" onClick={back}>
                    Retour
                  </button>
                  <button type="button" className="btn btn-accent" onClick={next}>
                    Continuer
                  </button>
                </div>
              </section>
            )}

            {step === 5 && (
              <section>
                <input
                  type="number"
                  className="depot-input"
                  value={prix}
                  onChange={(e) => setPrix(e.target.value)}
                  placeholder="€"
                />
                <div className="depot-actions">
                  <button type="button" className="btn btn-outline" onClick={back}>
                    Retour
                  </button>
                  <button type="button" className="btn btn-accent" onClick={next}>
                    Continuer
                  </button>
                </div>
              </section>
            )}

            {step === 6 && (
              <section>
                <div className="depot-field-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <label>
                    <span className="depot-question">Ville</span>
                    <input className="depot-input" value={ville} onChange={(e) => setVille(e.target.value)} />
                  </label>
                  <label>
                    <span className="depot-question">Code postal</span>
                    <input
                      className="depot-input"
                      value={codePostal}
                      onChange={(e) => setCodePostal(e.target.value)}
                      maxLength={5}
                    />
                  </label>
                </div>
                <div className="depot-actions">
                  <button type="button" className="btn btn-outline" onClick={back}>
                    Retour
                  </button>
                  <button type="button" className="btn btn-accent" onClick={next}>
                    Continuer
                  </button>
                </div>
              </section>
            )}

            {step === 7 && (
              <section>
                <ul className="depot-recap-list">
                  <li>
                    <strong>Titre :</strong> {titre}
                  </li>
                  <li>
                    <strong>Catégorie :</strong> {categorieLabel}
                  </li>
                  <li>
                    <strong>Type :</strong> {typeAnnonce === "offre" ? "Offre" : "Demande"}
                  </li>
                  <li>
                    <strong>Photos :</strong> {photos.length}
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
                  <input type="hidden" name="typeAnnonce" value={typeAnnonce} />
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
                      <input type="hidden" name="portes" value={portes} />
                      <input type="hidden" name="places" value={places} />
                      <input type="hidden" name="etatVehicule" value={etatVehicule} />
                      <input type="hidden" name="typeVehicule" value={typeVehicule} />
                      <input type="hidden" name="couleur" value={couleur} />
                      <input type="hidden" name="sellerie" value={sellerie} />
                      <input type="hidden" name="equipements" value={equipements} />
                      <input type="hidden" name="puissanceFiscale" value={puissanceFiscale} />
                      <input type="hidden" name="puissanceDin" value={puissanceDin} />
                      <input type="hidden" name="permis" value={permis} />
                      <input type="hidden" name="controleTechnique" value={controleTechnique} />
                      <input type="hidden" name="miseEnCirculation" value={miseEnCirculation} />
                      <input type="hidden" name="critAir" value={critAir} />
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
                    <p role="alert" style={{ color: "var(--brand-red)" }}>
                      {state.error}
                    </p>
                  ) : null}

                  <div className="depot-actions">
                    <button type="button" className="btn btn-outline" onClick={back}>
                      Retour
                    </button>
                    <button type="submit" className="btn btn-accent" disabled={pending}>
                      {pending ? "Publication…" : "Publier"}
                    </button>
                  </div>
                </form>
              </section>
            )}
          </div>
        </div>

        <div className="depot-sidebar">
          <div className="depot-sidebar-rule">
            <span className="line" />
            <span className="depot-sidebar-icon">💡</span>
            <span className="line" />
          </div>
          <p className="depot-sidebar-title">{tip.title}</p>
          <p className="depot-sidebar-text">{tip.text}</p>
        </div>
      </div>
    </div>
  );
}
