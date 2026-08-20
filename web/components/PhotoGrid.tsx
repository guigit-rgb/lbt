"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { Categorie } from "@/lib/db/schema";
import { supprimerPhoto, reordonnerPhotos } from "@/lib/actions/annonces";
import { MAX_PHOTOS } from "@/lib/photos-constants";

export interface Photo {
  id: string;
  url: string;
}

interface UploadEnCours {
  tempId: string;
  progress: number;
}

// Emplacements suggérés pour les 3 premières photos d'un véhicule (repris de
// l'ordre habituel d'une annonce auto) — reprend les mêmes icônes emoji que le
// reste du site (cf. lib/categories.ts) plutôt que des pictos dessinés
// spécifiquement, pour rester cohérent avec l'iconographie déjà en place.
const VEHICULE_PHOTO_SLOTS = [
  { label: "3/4 avant gauche", icon: "🚙" },
  { label: "3/4 arrière droit", icon: "🚙" },
  { label: "Intérieur conducteur", icon: "💺" },
];

// Upload via une route API classique (XHR), pas une Server Action : c'est la
// seule façon d'obtenir une vraie progression d'envoi (`upload.onprogress`)
// pour l'afficher à l'utilisateur, cf. journal du cahier des charges.
function uploaderFichier(
  annonceId: string,
  fichier: File,
  onProgress: (pct: number) => void
): Promise<{ id: string; url: string } | { error: string }> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    });
    xhr.addEventListener("load", () => {
      let data: unknown = null;
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        resolve({ error: "Réponse invalide du serveur." });
        return;
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data as { id: string; url: string });
      } else {
        const err = (data as { error?: string })?.error ?? "Échec de l'envoi.";
        resolve({ error: err });
      }
    });
    xhr.addEventListener("error", () => resolve({ error: "Erreur réseau pendant l'envoi." }));
    const formData = new FormData();
    formData.set("fichier", fichier);
    xhr.open("POST", `/api/uploads/photos/${annonceId}`);
    xhr.send(formData);
  });
}

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

function PendingPhotoTile({ progress, coverBadge }: { progress: number; coverBadge: boolean }) {
  return (
    <div className="depot-photo-tile depot-photo-pending">
      {coverBadge && <span className="depot-photo-cover">Photo de couverture</span>}
      <span className="depot-photo-percent">{progress}%</span>
      <div className="depot-photo-progress-track">
        <div className="depot-photo-progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export default function PhotoGrid({
  annonceId,
  categorie,
  initialPhotos = [],
  onPhotosChange,
  onUploadingChange,
}: {
  annonceId: string;
  categorie: Categorie | "";
  initialPhotos?: Photo[];
  onPhotosChange?: (photos: Photo[]) => void;
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [enCours, setEnCours] = useState<UploadEnCours[]>([]);
  const [photoError, setPhotoError] = useState("");
  const dragIndexRef = useRef<number | null>(null);

  // Notifier le parent dans un effet, jamais depuis l'updater de setState
  // lui-même — appeler le setState d'un parent pendant le rendu d'un enfant
  // (même indirectement, via l'updater) déclenche l'avertissement React
  // "Cannot update a component while rendering a different component".
  useEffect(() => {
    onPhotosChange?.(photos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos]);

  useEffect(() => {
    onUploadingChange?.(enCours.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enCours.length]);

  async function handleFichiers(e: ChangeEvent<HTMLInputElement>) {
    const fichiers = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (fichiers.length === 0) return;
    setPhotoError("");

    const place = MAX_PHOTOS - photos.length - enCours.length;
    const aEnvoyer = fichiers.slice(0, Math.max(place, 0));

    await Promise.all(
      aEnvoyer.map(async (fichier) => {
        const tempId = crypto.randomUUID();
        setEnCours((prev) => [...prev, { tempId, progress: 0 }]);
        const res = await uploaderFichier(annonceId, fichier, (pct) => {
          setEnCours((prev) => prev.map((u) => (u.tempId === tempId ? { ...u, progress: pct } : u)));
        });
        setEnCours((prev) => prev.filter((u) => u.tempId !== tempId));
        if ("error" in res) {
          setPhotoError(res.error);
          return;
        }
        setPhotos((prev) => [...prev, { id: res.id, url: res.url }]);
      })
    );
  }

  function handleSupprimerPhoto(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    void supprimerPhoto(id);
  }

  function handleDrop(index: number) {
    const from = dragIndexRef.current;
    dragIndexRef.current = null;
    if (from === null || from === index) return;
    setPhotos((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(index, 0, moved);
      void reordonnerPhotos(annonceId, next.map((p) => p.id));
      return next;
    });
  }

  return (
    <div>
      <p className="depot-photo-hint">Faites glisser vos photos pour changer leur ordre.</p>
      <span className="depot-question">
        Vos photos<span className="req">*</span>
      </span>
      <div className="depot-photo-grid">
        {photos.length + enCours.length < MAX_PHOTOS && (
          <label className="depot-photo-add">
            <input type="file" accept="image/*" multiple onChange={handleFichiers} />
            <span className="add-icon">＋📷</span>
            Ajouter des photos
          </label>
        )}

        {/* Pour les véhicules, les 3 premiers emplacements affichent une
            suggestion d'angle (icône + libellé) tant qu'aucune photo n'y a
            été déposée — reprend les 3 vignettes guidées du modèle
            leboncoin. Les autres catégories n'ont pas cette notion d'angle
            et affichent simplement les photos au fur et à mesure. */}
        {categorie === "vehicules"
          ? VEHICULE_PHOTO_SLOTS.map((slot, index) => {
              if (photos[index]) {
                return (
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
                );
              }
              const pendingIndex = index - photos.length;
              if (pendingIndex >= 0 && pendingIndex < enCours.length) {
                return (
                  <PendingPhotoTile
                    key={enCours[pendingIndex].tempId}
                    progress={enCours[pendingIndex].progress}
                    coverBadge={index === 0}
                  />
                );
              }
              return (
                <label key={slot.label} className="depot-photo-add">
                  <input type="file" accept="image/*" onChange={handleFichiers} />
                  {index === 0 && <span className="depot-photo-cover">Photo de couverture</span>}
                  <span className="add-icon">{slot.icon}</span>
                  {slot.label}
                </label>
              );
            })
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

        {enCours
          .slice(categorie === "vehicules" ? Math.max(0, VEHICULE_PHOTO_SLOTS.length - photos.length) : 0)
          .map((u) => (
            <PendingPhotoTile key={u.tempId} progress={u.progress} coverBadge={false} />
          ))}
      </div>
      {photoError && <p style={{ color: "var(--brand-red)" }}>{photoError}</p>}
    </div>
  );
}
