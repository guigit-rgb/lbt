import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Défaut 1 Mo trop bas pour l'envoi de photos (jusqu'à 8 Mo/fichier,
      // cf. MAX_TAILLE_PHOTO_OCTETS dans lib/actions/annonces.ts).
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
