#!/usr/bin/env node
// Enrichit les annonces "vehicules" existantes avec les nouveaux attributs
// (portes, places, état, type, couleur, sellerie, équipements, puissances,
// permis, contrôle technique, mise en circulation) ajoutés à la page de
// détail — sans quoi le catalogue de démo n'aurait jamais montré la grille
// étendue puisque ces annonces ont été créées avant son existence.
//
// Ne touche que les annonces "vehicules" dont l'attribut `portes` est encore
// absent (rejouable sans dupliquer un travail déjà fait), et préserve les
// attributs déjà présents (carburant, boite).
//
// Usage : node --env-file=.env.local scripts/backfill-vehicule-attributs.mjs

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

function pick(liste) {
  return liste[Math.floor(Math.random() * liste.length)];
}

const PORTES = ["3", "3", "5", "5", "5"];
const PLACES = ["5", "5", "5", "2", "7"];
const ETATS_VEHICULE = ["Bon état", "Bon état", "Très bon état", "Comme neuf", "Réparations mineures à prévoir"];
const TYPES_VEHICULE = ["Berline", "Citadine", "SUV / 4x4", "Break", "Monospace", "Utilitaire"];
const COULEURS = ["Noir", "Blanc", "Gris", "Bleu", "Rouge", "Marron", "Beige"];
const SELLERIES = ["Tissu", "Tissu", "Tissu", "Cuir", "Simili-cuir"];
const EQUIPEMENTS = [
  "Climatisation, GPS",
  "Climatisation, régulateur de vitesse",
  "GPS, caméra de recul, régulateur de vitesse",
  "Climatisation, toit ouvrant",
  "Climatisation",
];
const CRIT_AIR = ["Crit'Air 1", "Crit'Air 1", "Crit'Air 2", "Crit'Air 2", "Crit'Air 3", "Crit'Air E"];

function miseEnCirculationDepuisAnnee(annee) {
  if (!annee) return undefined;
  const mois = String(1 + Math.floor(Math.random() * 12)).padStart(2, "0");
  return `${mois}/${annee}`;
}

async function main() {
  const rows = await sql`
    select id, annee, attributs from annonces
    where categorie = 'vehicules' and not (attributs ? 'portes')
  `;
  console.log(`${rows.length} annonce(s) véhicules à enrichir`);

  for (const row of rows) {
    const attributs = {
      ...row.attributs,
      portes: pick(PORTES),
      places: pick(PLACES),
      etatVehicule: pick(ETATS_VEHICULE),
      typeVehicule: pick(TYPES_VEHICULE),
      couleur: pick(COULEURS),
      sellerie: pick(SELLERIES),
      equipements: pick(EQUIPEMENTS),
      puissanceFiscale: String(3 + Math.floor(Math.random() * 8)),
      puissanceDin: String(60 + Math.floor(Math.random() * 140)),
      permis: "Permis B",
      controleTechnique: String(2025 + Math.floor(Math.random() * 3)),
      critAir: pick(CRIT_AIR),
    };
    const miseEnCirculation = miseEnCirculationDepuisAnnee(row.annee);
    if (miseEnCirculation) attributs.miseEnCirculation = miseEnCirculation;

    await sql`update annonces set attributs = ${JSON.stringify(attributs)} where id = ${row.id}`;
  }

  console.log("Terminé.");
}

main();
