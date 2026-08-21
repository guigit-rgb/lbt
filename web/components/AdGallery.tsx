"use client";

import { useState } from "react";

interface Photo {
  id: string;
  url: string | null;
}

// Mosaïque à trois photos façon leboncoin (une grande + deux empilées, avec
// un bouton "Voir les X photos" par-dessus la troisième s'il y en a plus).
// Le bouton déplie la liste complète en vignettes cliquables sous la
// mosaïque plutôt que d'ouvrir une visionneuse plein écran — pas de
// composant de lightbox dans ce projet pour l'instant.
export default function AdGallery({ photos, alt }: { photos: Photo[]; alt: string }) {
  const [expanded, setExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (photos.length === 0) return null;

  if (photos.length === 1) {
    return (
      <div className="ad-gallery-single">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photos[0].url ?? undefined} alt={alt} />
      </div>
    );
  }

  const reste = photos.length - 3;

  return (
    <div className="ad-gallery">
      <div className="ad-gallery-mosaic">
        <div className="ad-gallery-tile ad-gallery-tile-main">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[activeIndex].url ?? undefined} alt={alt} />
        </div>
        <div className="ad-gallery-tile-stack">
          {photos.slice(1, 3).map((p, i) => (
            <div key={p.id} className="ad-gallery-tile">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url ?? undefined} alt="" />
              {i === 1 && reste > 0 && (
                <button type="button" className="ad-gallery-more" onClick={() => setExpanded((v) => !v)}>
                  Voir les {photos.length} photos
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {expanded && (
        <div className="ad-gallery-thumbs">
          {photos.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={`ad-gallery-thumb${i === activeIndex ? " active" : ""}`}
              onClick={() => setActiveIndex(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url ?? undefined} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
