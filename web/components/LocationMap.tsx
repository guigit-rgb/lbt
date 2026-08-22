"use client";

import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Icônes par défaut de Leaflet chargées depuis un CDN plutôt que le bundle
// Next.js : Leaflet référence ses images de marqueur par un chemin relatif
// qui ne survit pas au bundling webpack sans configuration dédiée — le
// contournement standard est de pointer vers les mêmes fichiers publiés.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Zoom approximatif pour que le cercle de rayon reste visible dans le cadre
// — Leaflet n'a pas de "fit radius" natif sans calculer des bounds.
function zoomPourRayon(rayonKm: number): number {
  if (rayonKm <= 2) return 12;
  if (rayonKm <= 5) return 11;
  if (rayonKm <= 10) return 10;
  if (rayonKm <= 25) return 9;
  if (rayonKm <= 50) return 8;
  if (rayonKm <= 100) return 7;
  if (rayonKm <= 175) return 6;
  return 5;
}

export function LocationMap({
  lat,
  lng,
  rayonKm,
  height = 220,
}: {
  lat: number;
  lng: number;
  rayonKm?: number;
  height?: number;
}) {
  return (
    <MapContainer
      key={`${lat}-${lng}-${rayonKm ?? ""}`}
      center={[lat, lng]}
      zoom={rayonKm ? zoomPourRayon(rayonKm) : 13}
      style={{ height, width: "100%", borderRadius: 10 }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} />
      {rayonKm != null && rayonKm > 0 && (
        <Circle center={[lat, lng]} radius={rayonKm * 1000} pathOptions={{ color: "#1d4ed8", fillOpacity: 0.12 }} />
      )}
    </MapContainer>
  );
}
