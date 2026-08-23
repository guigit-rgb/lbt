#!/usr/bin/env node
// Peuple la base avec des annonces de démonstration : texte généré par l'IA
// (par annonce, pas par lot, pour que le contexte — marque, sous-catégorie,
// type de bien...) soit toujours cohérent avec le titre) et 3 vraies photos
// pertinentes par annonce via l'API Pexels (licence Pexels : usage commercial
// libre, pas d'attribution requise — cf. https://www.pexels.com/license/).
//
// Repart de zéro à chaque exécution : supprime d'abord toutes les annonces
// du compte "Catalogue démo" existant avant de reseeder (pas d'accumulation).
//
// Usage : node --env-file=.env.local scripts/seed-demo-listings.mjs

import { neon } from "@neondatabase/serverless";
import Anthropic from "@anthropic-ai/sdk";
import { randomUUID } from "node:crypto";
import { hash } from "bcryptjs";

const sql = neon(process.env.DATABASE_URL);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const DEMO_EMAIL = "catalogue-demo@lebontruc.internal";
const PAR_CATEGORIE = 4;
const PHOTOS_PAR_ANNONCE = 3;

const VILLES = [
  ["Rodez", "12000"], ["Saint-Céré", "46400"], ["Toulouse", "31000"], ["Millau", "12100"],
  ["Villefranche-de-Rouergue", "12200"], ["Cahors", "46000"], ["Albi", "81000"], ["Figeac", "46100"],
  ["Decazeville", "12300"], ["Espalion", "12500"], ["Montauban", "82000"], ["Rignac", "12390"],
];

const MARQUES_MODELES = [
  ["Peugeot", "208"], ["Renault", "Clio"], ["Citroën", "C3"], ["Volkswagen", "Golf"],
  ["Audi", "A3"], ["BMW", "Série 1"], ["Toyota", "Yaris"], ["Ford", "Fiesta"],
  ["Mercedes", "Classe A"], ["Dacia", "Sandero"],
];
const CARBURANTS = ["Essence", "Diesel", "Hybride", "Électrique"];
const BOITES = ["Manuelle", "Automatique"];
const ETATS_PRODUIT = ["Neuf", "Très bon état", "Bon état", "Satisfaisant"];
const TYPES_ANIMAUX = ["Chien", "Chat", "Oiseau", "Rongeur"];
const TYPES_BIEN = ["Maison", "Appartement", "Terrain", "Parking"];
const TYPES_BIEN_VACANCES = ["Maison/Villa", "Appartement", "Chalet"];

// Sous-catégories, dupliquées ici en JS plutôt qu'importées de
// lib/subcategory-filters.ts (script Node autonome, pas de build TS) — même
// liste de valeurs, tenue à jour manuellement si celle-ci change.
const SOUS_CATEGORIES = {
  loisirs: [
    "Antiquités", "Instruments de musique", "Livres", "Modélisme", "Sport & Plein air",
    "Jeux de société", "Vélo de route", "VTT", "Loisirs créatifs", "Collection",
    "CD - Musique", "DVD - Films", "Vins & Gastronomie", "Équipements vélos",
  ],
  "materiel-pro": [
    "Tracteurs", "Matériel agricole", "BTP - Chantier gros-œuvre", "Poids lourds",
    "Manutention - Levage", "Matériel médical", "Équipements industriels",
  ],
  electronique: [
    "Ordinateurs", "Accessoires informatique", "Tablettes & Liseuses", "Photo, audio & vidéo",
    "Téléphones & Objets connectés", "Consoles", "Jeux vidéo", "Électroménager",
  ],
  emploi: ["Offres d'emploi", "Formations professionnelles"],
  mode: ["Vêtements", "Chaussures", "Montres & Bijoux", "Accessoires & Bagagerie"],
  "maison-jardin": [
    "Ameublement", "Papeterie & Fournitures scolaires", "Électroménager", "Arts de la table",
    "Décoration", "Linge de maison", "Bricolage", "Jardin & Plantes",
  ],
  famille: ["Équipement bébé", "Mobilier enfant", "Vêtements bébé", "Baby-Sitting"],
  services: [
    "Services de déménagement", "Services de réparations mécaniques", "Services à la personne",
    "Services aux animaux", "Services évènementiels", "Covoiturage", "Cours particuliers",
  ],
  animaux: ["Animaux", "Accessoires animaux", "Animaux perdus"],
};

const CATEGORIES = [
  { categorie: "vehicules", label: "Véhicules", prix: [3000, 32000] },
  { categorie: "immobilier", label: "Immobilier", prix: [90000, 420000] },
  { categorie: "locations-vacances", label: "Locations de vacances", prix: [300, 1800] },
  { categorie: "emploi", label: "Emploi", prix: null },
  { categorie: "mode", label: "Mode", prix: [5, 150] },
  { categorie: "maison-jardin", label: "Maison & jardin", prix: [10, 800] },
  { categorie: "electronique", label: "Électronique", prix: [20, 1200] },
  { categorie: "materiel-pro", label: "Matériel pro", prix: [200, 15000] },
  { categorie: "loisirs", label: "Loisirs", prix: [10, 900] },
  { categorie: "animaux", label: "Animaux", prix: [0, 400] },
  { categorie: "famille", label: "Famille", prix: [5, 200] },
  { categorie: "services", label: "Services", prix: [10, 90] },
  { categorie: "autres", label: "Autres", prix: [5, 300] },
  { categorie: "dons", label: "Dons", prix: [0, 0] },
];

// Requête Pexels de repli par catégorie, utilisée si la requête précise
// (générée par l'IA pour CETTE annonce) ne renvoie pas 3 résultats.
const REPLI_PEXELS = {
  vehicules: "car",
  immobilier: "house exterior",
  "locations-vacances": "vacation house",
  emploi: "office work",
  mode: "clothing fashion",
  "maison-jardin": "home decor",
  electronique: "electronics gadget",
  "materiel-pro": "industrial equipment",
  loisirs: "hobby",
  animaux: "pet animal",
  famille: "baby family",
  services: "service work",
  autres: "object",
  dons: "object",
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function genererAnnonce(categorieLabel, contexte) {
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 512,
    tools: [
      {
        name: "generer_annonce",
        description: "Génère une annonce fictive de petite annonce, réaliste et précise.",
        input_schema: {
          type: "object",
          properties: {
            titre: { type: "string", description: "Titre court, style vendeur particulier" },
            description: { type: "string", description: "3 à 4 phrases honnêtes et concrètes, à la première personne" },
            photoQuery: {
              type: "string",
              description:
                "2 à 5 mots en ANGLAIS décrivant précisément l'objet de CETTE annonce (pas la catégorie en général), pour une recherche de photo de banque d'images. Ex: 'red Peugeot 208 hatchback', 'vintage vinyl record player', 'modern white kitchen'.",
            },
          },
          required: ["titre", "description", "photoQuery"],
        },
      },
    ],
    tool_choice: { type: "tool", name: "generer_annonce" },
    messages: [
      {
        role: "user",
        content: `Génère UNE annonce fictive réaliste, en français, pour la catégorie "${categorieLabel}" d'un site de petites annonces (façon leboncoin).${contexte ? ` Contexte imposé, à respecter strictement : ${contexte}.` : ""} Sois concret et spécifique (pas générique).`,
      },
    ],
  });
  const toolUse = response.content.find((b) => b.type === "tool_use");
  return toolUse?.input ?? null;
}

async function chercherPhotosPexels(query, repli) {
  async function rechercher(q) {
    try {
      const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=5&orientation=landscape`, {
        headers: { Authorization: process.env.PEXELS_API_KEY },
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.photos ?? [];
    } catch {
      return [];
    }
  }

  let photos = await rechercher(query);
  if (photos.length < PHOTOS_PAR_ANNONCE) {
    const complement = await rechercher(repli);
    const vus = new Set(photos.map((p) => p.id));
    for (const p of complement) {
      if (!vus.has(p.id)) photos.push(p);
    }
  }
  return photos.slice(0, PHOTOS_PAR_ANNONCE).map((p) => p.src.large);
}

async function supprimerCatalogueDemo(demoUserId) {
  const annonceIds = await sql`select id from annonces where user_id = ${demoUserId}`;
  for (const { id } of annonceIds) {
    await sql`delete from annonce_images where annonce_id = ${id}`;
  }
  const del = await sql`delete from annonces where user_id = ${demoUserId} returning id`;
  console.log(`Ancien catalogue démo supprimé : ${del.length} annonces.`);
}

async function main() {
  const passwordHash = await hash(randomUUID(), 10);
  let [demoUser] = await sql`select id from users where email = ${DEMO_EMAIL}`;
  if (!demoUser) {
    [demoUser] = await sql`
      insert into users (email, password_hash, display_name, role)
      values (${DEMO_EMAIL}, ${passwordHash}, 'Catalogue démo', 'user')
      returning id
    `;
    console.log("Compte démo créé:", demoUser.id);
  } else {
    console.log("Compte démo existant réutilisé:", demoUser.id);
    await supprimerCatalogueDemo(demoUser.id);
  }

  for (const cat of CATEGORIES) {
    console.log(`\n--- ${cat.label} ---`);

    for (let i = 0; i < PAR_CATEGORIE; i++) {
      let marque = null, modele = null, annee = null, kilometrage = null;
      let sousCategorie = null, etatProduit = null, typeAnimal = null;
      let attributs = {};
      let contexte = "";

      if (cat.categorie === "vehicules") {
        [marque, modele] = pick(MARQUES_MODELES);
        annee = randInt(2010, 2023);
        kilometrage = randInt(15000, 180000);
        attributs = { carburant: pick(CARBURANTS), boite: pick(BOITES) };
        contexte = `Marque : ${marque}, Modèle : ${modele}, Année : ${annee}`;
      } else if (cat.categorie === "immobilier") {
        const typeBien = pick(TYPES_BIEN);
        const surfaceHabitable = randInt(28, 180);
        const pieces = randInt(1, 6);
        attributs = { typeBien, surfaceHabitable: String(surfaceHabitable), pieces: String(pieces), typeVente: "Ancien" };
        contexte = `Type de bien : ${typeBien}, Surface habitable : ${surfaceHabitable} m², Pièces : ${pieces}`;
      } else if (cat.categorie === "locations-vacances") {
        const typeBien = pick(TYPES_BIEN_VACANCES);
        attributs = { typeBien };
        contexte = `Type de bien : ${typeBien}`;
      } else if (SOUS_CATEGORIES[cat.categorie]) {
        sousCategorie = pick(SOUS_CATEGORIES[cat.categorie]);
        if (cat.categorie === "animaux") {
          if (sousCategorie === "Animaux" || sousCategorie === "Accessoires animaux") {
            typeAnimal = pick(TYPES_ANIMAUX);
          }
          if (sousCategorie === "Accessoires animaux") etatProduit = pick(ETATS_PRODUIT);
          contexte = `Sous-catégorie : ${sousCategorie}${typeAnimal ? `, Type d'animal : ${typeAnimal}` : ""}`;
        } else if (cat.categorie === "loisirs") {
          etatProduit = pick(ETATS_PRODUIT);
          contexte = `Sous-catégorie : ${sousCategorie}, État : ${etatProduit}`;
        } else {
          contexte = `Sous-catégorie : ${sousCategorie}`;
        }
      }

      const genere = await genererAnnonce(cat.label, contexte);
      if (!genere) {
        console.log("  ⚠ génération IA échouée, annonce ignorée.");
        continue;
      }
      const { titre, description, photoQuery } = genere;

      const [ville, codePostal] = pick(VILLES);
      const prixCents = cat.prix ? randInt(cat.prix[0], cat.prix[1]) * 100 : null;
      const joursEcoules = randInt(0, 12);
      const createdAt = new Date(Date.now() - joursEcoules * 24 * 60 * 60 * 1000);
      const expiresAt = new Date(Date.now() + (60 - joursEcoules) * 24 * 60 * 60 * 1000);

      const [annonce] = await sql`
        insert into annonces (
          user_id, categorie, type_annonce, titre, description, prix_cents,
          ville, code_postal, etat, marque, modele, annee, kilometrage,
          sous_categorie, etat_produit, type_animal, attributs,
          created_at, updated_at, published_at, expires_at
        ) values (
          ${demoUser.id}, ${cat.categorie}, 'offre', ${titre}, ${description}, ${prixCents},
          ${ville}, ${codePostal}, 'en_ligne', ${marque}, ${modele}, ${annee}, ${kilometrage},
          ${sousCategorie}, ${etatProduit}, ${typeAnimal}, ${JSON.stringify(attributs)},
          ${createdAt.toISOString()}, ${createdAt.toISOString()}, ${createdAt.toISOString()}, ${expiresAt.toISOString()}
        )
        returning id
      `;

      const urls = await chercherPhotosPexels(photoQuery, REPLI_PEXELS[cat.categorie] ?? cat.label);
      for (let p = 0; p < urls.length; p++) {
        await sql`
          insert into annonce_images (annonce_id, storage_key_original, url_thumb, url_medium, url_large, position, status)
          values (${annonce.id}, ${"external:" + urls[p]}, ${urls[p]}, ${urls[p]}, ${urls[p]}, ${p}, 'ready')
        `;
      }

      console.log(`  ✓ ${titre} — ${urls.length} photo(s) ("${photoQuery}")`);
      await sleep(150);
    }
  }

  console.log("\nTerminé.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
