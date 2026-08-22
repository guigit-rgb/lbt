#!/usr/bin/env node
// Géocode (ville + code postal → lat/lng) les annonces existantes qui n'ont
// pas encore de coordonnées — créées avant l'ajout de la carte et de la
// recherche par rayon. Rejouable : ne touche que les annonces où lat est
// encore nul. Une pause entre chaque appel pour rester correct avec l'API
// gratuite adresse.data.gouv.fr (pas de clé, mais pas de quota négocié
// non plus).
//
// Usage : node --env-file=.env.local scripts/backfill-geocodage.mjs

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

async function geocoder(ville, codePostal) {
  const params = new URLSearchParams({ q: codePostal ? `${ville} ${codePostal}` : ville, limit: "1" });
  if (codePostal) params.set("postcode", codePostal);
  try {
    const res = await fetch(`https://api-adresse.data.gouv.fr/search/?${params.toString()}`);
    if (!res.ok) return null;
    const data = await res.json();
    const feature = data.features?.[0];
    if (!feature) return null;
    const [lng, lat] = feature.geometry.coordinates;
    return { lat, lng };
  } catch {
    // Aléa réseau — l'annonce reste sans coordonnées et sera reprise au
    // prochain passage du script (rejouable, ne cible que lat IS NULL).
    return null;
  }
}

async function main() {
  const rows = await sql`
    select id, ville, code_postal from annonces
    where lat is null and ville is not null
  `;
  console.log(`${rows.length} annonce(s) à géocoder`);

  let ok = 0;
  let echecs = 0;
  for (const row of rows) {
    const coords = await geocoder(row.ville, row.code_postal);
    if (coords) {
      await sql`update annonces set lat = ${coords.lat}, lng = ${coords.lng} where id = ${row.id}`;
      ok++;
    } else {
      echecs++;
      console.log(`échec : ${row.ville} (${row.code_postal})`);
    }
    await new Promise((r) => setTimeout(r, 150));
  }

  console.log(`Terminé : ${ok} géocodées, ${echecs} échecs.`);
}

main();
