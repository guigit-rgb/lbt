#!/usr/bin/env node
// Remplace les photos génériques (Picsum) des annonces démo par de vraies
// photos pertinentes trouvées sur Openverse (recherche par mot-clé, licences
// Creative Commons, pas de clé API nécessaire) — pour que le contenu visuel
// corresponde enfin au titre de l'annonce.
//
// Attention : les photos Openverse sont sous diverses licences CC (BY, BY-SA,
// CC0, PDM...) — certaines demandent une attribution. Ce script ne conserve
// PAS ces métadonnées : correct pour une démo interne, à ne pas réutiliser
// tel quel si ces annonces devenaient un jour publiques/réelles.
//
// Usage : node --env-file=.env.local scripts/fix-demo-photos.mjs

import { neon } from "@neondatabase/serverless";
import Anthropic from "@anthropic-ai/sdk";

const sql = neon(process.env.DATABASE_URL);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const DEMO_EMAIL = "catalogue-demo@lebontruc.internal";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function motsClesAnglais(titres) {
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 2048,
    tools: [
      {
        name: "traduire_mots_cles",
        description: "Donne un mot-clé de recherche photo en anglais pour chaque titre d'annonce.",
        input_schema: {
          type: "object",
          properties: {
            mots_cles: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  titre: { type: "string" },
                  motCle: {
                    type: "string",
                    description: "2 à 4 mots en anglais décrivant l'objet PRINCIPAL de l'annonce, pour une recherche de photo (ex: 'red bicycle', 'wooden dining table')",
                  },
                },
                required: ["titre", "motCle"],
              },
            },
          },
          required: ["mots_cles"],
        },
      },
    ],
    tool_choice: { type: "tool", name: "traduire_mots_cles" },
    messages: [
      {
        role: "user",
        content: `Pour chacun de ces titres d'annonces françaises, donne un mot-clé de recherche photo en anglais (2-4 mots, objet concret) :\n\n${titres.map((t, i) => `${i + 1}. ${t}`).join("\n")}`,
      },
    ],
  });
  const toolUse = response.content.find((b) => b.type === "tool_use");
  return toolUse?.input?.mots_cles ?? [];
}

async function chercherPhoto(motCle) {
  try {
    const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(motCle)}&license_type=all&page_size=5&mature=false`;
    const res = await fetch(url, { headers: { "User-Agent": "lebontruc-demo-seed/1.0" } });
    if (!res.ok) return null;
    const data = await res.json();
    const result = (data.results ?? []).find((r) => r.url && r.width >= 400) ?? data.results?.[0];
    return result?.url ?? null;
  } catch {
    return null;
  }
}

async function main() {
  const [demoUser] = await sql`select id from users where email = ${DEMO_EMAIL}`;
  if (!demoUser) {
    console.log("Aucun compte démo trouvé — lancez d'abord seed-demo-listings.mjs.");
    return;
  }

  const rows = await sql`
    select a.id, a.titre, ai.id as image_id
    from annonces a
    join annonce_images ai on ai.annonce_id = a.id and ai.position = 0
    where a.user_id = ${demoUser.id}
    order by a.categorie, a.created_at
  `;
  console.log(`${rows.length} annonces démo à traiter.`);

  const parLots = 10;
  for (let i = 0; i < rows.length; i += parLots) {
    const lot = rows.slice(i, i + parLots);
    const motsCles = await motsClesAnglais(lot.map((r) => r.titre));

    for (const row of lot) {
      const trouve = motsCles.find((m) => m.titre === row.titre);
      const motCle = trouve?.motCle ?? row.titre;
      let photoUrl = await chercherPhoto(motCle);
      if (!photoUrl) {
        photoUrl = `https://picsum.photos/seed/${row.id}/800/600`;
        console.log(`  ⚠ pas de résultat pour "${motCle}" (${row.titre}) — repli Picsum`);
      } else {
        console.log(`  ✓ ${row.titre} → "${motCle}"`);
      }

      await sql`
        update annonce_images
        set url_thumb = ${photoUrl}, url_medium = ${photoUrl}, url_large = ${photoUrl},
            storage_key_original = ${"external:" + photoUrl}
        where id = ${row.image_id}
      `;
      await sleep(150);
    }
  }

  console.log("\nTerminé.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
