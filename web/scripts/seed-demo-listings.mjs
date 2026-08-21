#!/usr/bin/env node
// Peuple la base avec des annonces de démonstration (texte généré par l'IA,
// photo générique via Picsum — pas d'API de recherche de photo par mot-clé
// configurée, donc les photos ne correspondent pas forcément au contenu,
// mais au moins la grille n'affiche plus la même image partout).
//
// Toutes les annonces créées appartiennent à un compte "Catalogue démo"
// dédié (email DEMO_EMAIL ci-dessous) — facile à identifier et à supprimer
// en bloc plus tard (cf. scripts/remove-demo-listings.mjs).
//
// Usage : node --env-file=.env.local scripts/seed-demo-listings.mjs

import { neon } from "@neondatabase/serverless";
import Anthropic from "@anthropic-ai/sdk";
import { randomUUID } from "node:crypto";
import { hash } from "bcryptjs";

const sql = neon(process.env.DATABASE_URL);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const DEMO_EMAIL = "catalogue-demo@lebontruc.internal";
const PAR_CATEGORIE = 10;

const VILLES = [
  ["Rodez", "12000"],
  ["Saint-Céré", "46400"],
  ["Toulouse", "31000"],
  ["Millau", "12100"],
  ["Villefranche-de-Rouergue", "12200"],
  ["Cahors", "46000"],
  ["Albi", "81000"],
  ["Figeac", "46100"],
  ["Decazeville", "12300"],
  ["Espalion", "12500"],
  ["Montauban", "82000"],
  ["Rignac", "12390"],
];

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

const MARQUES_MODELES = [
  ["Peugeot", "208"], ["Renault", "Clio"], ["Citroën", "C3"], ["Volkswagen", "Golf"],
  ["Audi", "A3"], ["BMW", "Série 1"], ["Toyota", "Yaris"], ["Ford", "Fiesta"],
  ["Mercedes", "Classe A"], ["Dacia", "Sandero"],
];
const CARBURANTS = ["Essence", "Diesel", "Hybride", "Électrique"];
const BOITES = ["Manuelle", "Automatique"];
const SOUS_CATEGORIES_LOISIRS = [
  "Antiquités", "Instruments de musique", "Livres", "Modélisme", "Sport & Plein air",
  "Jeux de société", "Vélo de route", "Loisirs créatifs",
];
const ETATS_PRODUIT = ["Neuf", "Très bon état", "Bon état", "Satisfaisant"];
const TYPES_ANIMAUX = ["Chien", "Chat", "Oiseau", "Rongeur"];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function genererTextes(categorieLabel, n) {
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 2048,
    tools: [
      {
        name: "generer_annonces",
        description: "Génère des annonces fictives de petites annonces pour peupler une démo.",
        input_schema: {
          type: "object",
          properties: {
            annonces: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  titre: { type: "string", description: "Titre court, style vendeur particulier, sans majuscules excessives" },
                  description: { type: "string", description: "3 à 4 phrases, honnête et concrète, pas de superlatifs vides" },
                },
                required: ["titre", "description"],
              },
            },
          },
          required: ["annonces"],
        },
      },
    ],
    tool_choice: { type: "tool", name: "generer_annonces" },
    messages: [
      {
        role: "user",
        content: `Génère ${n} annonces fictives DIFFÉRENTES et VARIÉES pour la catégorie "${categorieLabel}" d'un site de petites annonces français généraliste (façon leboncoin). Chaque annonce doit avoir un objet/bien concret différent des autres (pas de répétition du même type d'objet). Titres et descriptions rédigés à la première personne, en français, réalistes.`,
      },
    ],
  });
  const toolUse = response.content.find((b) => b.type === "tool_use");
  return toolUse?.input?.annonces ?? [];
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
  }

  for (const cat of CATEGORIES) {
    console.log(`\n--- ${cat.label} ---`);
    const textes = await genererTextes(cat.label, PAR_CATEGORIE);
    if (textes.length === 0) {
      console.log("  Aucun texte généré, catégorie ignorée.");
      continue;
    }

    for (let i = 0; i < textes.length; i++) {
      const { titre, description } = textes[i];
      const [ville, codePostal] = pick(VILLES);
      const prixCents = cat.prix ? randInt(cat.prix[0], cat.prix[1]) * 100 : null;
      const joursEcoules = randInt(0, 12);
      const createdAt = new Date(Date.now() - joursEcoules * 24 * 60 * 60 * 1000);
      const expiresAt = new Date(Date.now() + (60 - joursEcoules) * 24 * 60 * 60 * 1000);

      let marque = null, modele = null, annee = null, kilometrage = null;
      let sousCategorie = null, etatProduit = null, typeAnimal = null;
      let attributs = {};

      if (cat.categorie === "vehicules") {
        [marque, modele] = pick(MARQUES_MODELES);
        annee = randInt(2010, 2023);
        kilometrage = randInt(15000, 180000);
        attributs = { carburant: pick(CARBURANTS), boite: pick(BOITES) };
      } else if (cat.categorie === "loisirs") {
        sousCategorie = pick(SOUS_CATEGORIES_LOISIRS);
        etatProduit = pick(ETATS_PRODUIT);
      } else if (cat.categorie === "animaux") {
        typeAnimal = pick(TYPES_ANIMAUX);
      }

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

      const seed = `${cat.categorie}-demo-${i}`;
      const photoUrl = `https://picsum.photos/seed/${seed}/800/600`;
      await sql`
        insert into annonce_images (annonce_id, storage_key_original, url_thumb, url_medium, url_large, position, status)
        values (${annonce.id}, ${"external:" + photoUrl}, ${photoUrl}, ${photoUrl}, ${photoUrl}, 0, 'ready')
      `;

      console.log(`  ✓ ${titre}`);
    }
  }

  console.log("\nTerminé.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
