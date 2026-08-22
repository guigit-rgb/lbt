"use client";

import { useState } from "react";
import type { AdDetailSpec } from "@/lib/annonce-display";

const NOMBRE_VISIBLE = 8;

// "Les informations clés" tronquées à 8 critères par défaut, avec un lien
// pour déplier/replier le reste — sur le modèle fourni par Nicolas le
// 2026-08-22 (une longue liste de caractéristiques techniques noyait les
// plus utiles pour un premier coup d'œil).
export function InformationsCles({ specs }: { specs: AdDetailSpec[] }) {
  const [ouvert, setOuvert] = useState(false);
  const masques = specs.length - NOMBRE_VISIBLE;
  const visibles = ouvert || masques <= 0 ? specs : specs.slice(0, NOMBRE_VISIBLE);

  return (
    <>
      <div className="ad-detail-specs">
        {visibles.map((spec) => (
          <div key={spec.label} className="ad-detail-spec">
            <span className="ad-detail-spec-icon" aria-hidden="true">
              {spec.icon}
            </span>
            <span>
              <span className="ad-detail-spec-label">{spec.label}</span>
              <span className="ad-detail-spec-value">{spec.value}</span>
            </span>
          </div>
        ))}
      </div>
      {masques > 0 &&
        (ouvert ? (
          <button type="button" className="ad-detail-specs-toggle" onClick={() => setOuvert(false)}>
            Voir moins
          </button>
        ) : (
          <button type="button" className="ad-detail-specs-toggle" onClick={() => setOuvert(true)}>
            Voir les {masques} critères supplémentaires
          </button>
        ))}
    </>
  );
}
