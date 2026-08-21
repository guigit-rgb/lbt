"use client";

import { useState } from "react";

function formatTelephone(telephone: string): string {
  return telephone.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}

export function RevealPhoneButton({ telephone }: { telephone: string }) {
  const [revele, setRevele] = useState(false);

  if (revele) {
    return (
      <a href={`tel:${telephone}`} className="btn btn-outline ad-detail-phone-revealed">
        {formatTelephone(telephone)}
      </a>
    );
  }

  return (
    <button type="button" className="btn btn-outline" onClick={() => setRevele(true)}>
      Voir le numéro
    </button>
  );
}
