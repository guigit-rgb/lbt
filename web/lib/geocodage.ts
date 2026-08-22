// Géocodage via l'API officielle adresse.data.gouv.fr (Base Adresse
// Nationale) — gratuite, sans clé, sans compte à créer, et adaptée puisque
// LBT n'a d'adresses qu'en France. Utilisée à l'écriture (dépôt/modification
// d'une annonce, ville + code postal → lat/lng) ; la recherche interactive
// de localisation côté client interroge la même API directement depuis le
// navigateur (CORS ouvert), sans passer par une route de l'application.

export interface Coordonnees {
  lat: number;
  lng: number;
}

export async function geocoderAdresse(ville: string, codePostal: string | null): Promise<Coordonnees | null> {
  const q = codePostal ? `${ville} ${codePostal}` : ville;
  const params = new URLSearchParams({ q, limit: "1" });
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
    // Le géocodage est un confort d'affichage (carte, recherche par rayon),
    // jamais une condition de publication — une annonce sans coordonnées
    // reste valide, elle n'affiche simplement pas la carte.
    return null;
  }
}
