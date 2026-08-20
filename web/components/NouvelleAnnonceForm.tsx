"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState, type ChangeEvent } from "react";
import { MEGA_MENU, AUTRES_ENTRY, DONS_ENTRY } from "@/lib/categories";
import type { Categorie } from "@/lib/db/schema";
import {
  enregistrerBrouillon,
  televerserPhoto,
  supprimerPhoto,
  reordonnerPhotos,
  publierAnnonce,
  type CreerAnnonceResult,
} from "@/lib/actions/annonces";

interface Photo {
  id: string;
  url: string;
}

const MAX_PHOTOS = 12;

// Emplacements suggérés pour les 3 premières photos d'un véhicule (repris de
// l'ordre habituel d'une annonce auto) — reprend les mêmes icônes emoji que le
// reste du site (cf. lib/categories.ts) plutôt que des pictos dessinés
// spécifiquement, pour rester cohérent avec l'iconographie déjà en place.
const VEHICULE_PHOTO_SLOTS = [
  { label: "3/4 avant gauche", icon: "🚙" },
  { label: "3/4 arrière droit", icon: "🚙" },
  { label: "Intérieur conducteur", icon: "💺" },
];

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

function PhotoTile({
  photo,
  index,
  onDragStart,
  onDrop,
  onRemove,
}: {
  photo: Photo;
  index: number;
  onDragStart: () => void;
  onDrop: () => void;
  onRemove: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="depot-photo-tile"
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      {index === 0 && <span className="depot-photo-cover">Photo de couverture</span>}
      {!loaded && !failed && <span className="depot-photo-loading" aria-hidden="true" />}
      {failed ? (
        <span className="depot-photo-failed">Échec du chargement</span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo.url}
          alt=""
          style={{ opacity: loaded ? 1 : 0 }}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
      <button type="button" className="depot-photo-remove" onClick={onRemove} aria-label="Supprimer cette photo">
        ×
      </button>
    </div>
  );
}

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
  const [uploadingCount, setUploadingCount] = useState(0);
  const [photoError, setPhotoError] = useState("");
  const dragIndexRef = useRef<number | null>(null);

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

  async function handleFichiers(e: ChangeEvent<HTMLInputElement>) {
    const fichiers = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!annonceId || fichiers.length === 0) return;
    setPhotoError("");
    for (const fichier of fichiers) {
      if (photos.length + 1 > MAX_PHOTOS) break;
      setUploadingCount((n) => n + 1);
      const formData = new FormData();
      formData.set("fichier", fichier);
      const res = await televerserPhoto(annonceId, formData);
      setUploadingCount((n) => n - 1);
      if ("error" in res) {
        setPhotoError(res.error);
        continue;
      }
      setPhotos((prev) => [...prev, { id: res.id, url: res.url }]);
    }
  }

  function handleSupprimerPhoto(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    void supprimerPhoto(id);
  }

  function handleDrop(index: number) {
    const from = dragIndexRef.current;
    dragIndexRef.current = null;
    if (from === null || from === index || !annonceId) return;
    setPhotos((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(index, 0, moved);
      void reordonnerPhotos(annonceId, next.map((p) => p.id));
      return next;
    });
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

            {step === 2 && (
              <section>
                <p className="depot-photo-hint">Faites glisser vos photos pour changer leur ordre.</p>
                <span className="depot-question">
                  Vos photos<span className="req">*</span>
                </span>
                <div className="depot-photo-grid">
                  {photos.length < MAX_PHOTOS && (
                    <label className={`depot-photo-add${uploadingCount > 0 ? " disabled" : ""}`}>
                      <input type="file" accept="image/*" multiple onChange={handleFichiers} />
                      <span className="add-icon">＋📷</span>
                      {uploadingCount > 0 ? "Envoi…" : "Ajouter des photos"}
                    </label>
                  )}

                  {/* Pour les véhicules, les 3 premiers emplacements affichent une
                      suggestion d'angle (icône + libellé) tant qu'aucune photo n'y
                      a été déposée — reprend les 3 vignettes guidées du modèle
                      leboncoin. Les autres catégories n'ont pas cette notion
                      d'angle et affichent simplement les photos au fur et à mesure. */}
                  {categorie === "vehicules"
                    ? VEHICULE_PHOTO_SLOTS.map((slot, index) =>
                        photos[index] ? (
                          <PhotoTile
                            key={photos[index].id}
                            photo={photos[index]}
                            index={index}
                            onDragStart={() => {
                              dragIndexRef.current = index;
                            }}
                            onDrop={() => handleDrop(index)}
                            onRemove={() => handleSupprimerPhoto(photos[index].id)}
                          />
                        ) : (
                          <label key={slot.label} className={`depot-photo-add${uploadingCount > 0 ? " disabled" : ""}`}>
                            <input type="file" accept="image/*" onChange={handleFichiers} />
                            {index === 0 && <span className="depot-photo-cover">Photo de couverture</span>}
                            <span className="add-icon">{slot.icon}</span>
                            {slot.label}
                          </label>
                        )
                      )
                    : null}

                  {photos.map((photo, index) => {
                    if (categorie === "vehicules" && index < VEHICULE_PHOTO_SLOTS.length) return null;
                    return (
                      <PhotoTile
                        key={photo.id}
                        photo={photo}
                        index={index}
                        onDragStart={() => {
                          dragIndexRef.current = index;
                        }}
                        onDrop={() => handleDrop(index)}
                        onRemove={() => handleSupprimerPhoto(photo.id)}
                      />
                    );
                  })}
                </div>
                {photoError && <p style={{ color: "var(--brand-red)" }}>{photoError}</p>}

                <div className="depot-actions">
                  <button type="button" className="btn btn-outline" onClick={back}>
                    Retour
                  </button>
                  <button
                    type="button"
                    className="btn btn-accent"
                    disabled={photos.length === 0 || uploadingCount > 0}
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
                    <input className="depot-input" value={marque} onChange={(e) => setMarque(e.target.value)} />
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
