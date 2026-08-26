"use client";

import { useState } from "react";
import { signalerAffichageNumero } from "@/lib/actions/contacts";

function formatTelephone(telephone: string): string {
  return telephone.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}

export function RevealPhoneButton({
  telephone,
  annonceId,
}: {
  telephone: string;
  annonceId: string;
}) {
  const [revele, setRevele] = useState(false);

  // Le numéro s'affiche immédiatement ; la trace part en parallèle et son
  // échec ne doit jamais retarder ni empêcher l'affichage (§5.3 R10 : un
  // contact perdu vaut 30 € HT, une observation perdue vaut zéro).
  function reveler() {
    setRevele(true);
    void signalerAffichageNumero(annonceId).catch(() => {});
  }

  if (revele) {
    return (
      <a href={`tel:${telephone}`} className="btn btn-outline ad-detail-phone-revealed">
        {formatTelephone(telephone)}
      </a>
    );
  }

  return (
    <button type="button" className="btn btn-outline" onClick={reveler}>
      Voir le numéro
    </button>
  );
}
