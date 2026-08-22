"use client";

import dynamic from "next/dynamic";

// Leaflet touche `window` dès l'évaluation du module, ce qui casse le rendu
// serveur même dans un composant "use client" (Next.js le rend malgré tout
// une première fois côté serveur). `ssr: false` reporte le chargement au
// client — seul point d'entrée à utiliser pour importer la carte, y compris
// depuis un autre composant client dont l'import serait, lui, évalué côté
// serveur.
export const LocationMap = dynamic(() => import("@/components/LocationMap").then((m) => m.LocationMap), {
  ssr: false,
});
