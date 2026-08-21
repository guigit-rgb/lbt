#!/usr/bin/env node
// Supprime toutes les annonces de démonstration créées par
// seed-demo-listings.mjs (compte "catalogue-demo@lebontruc.internal"),
// y compris le compte lui-même.
//
// Usage : node --env-file=.env.local scripts/remove-demo-listings.mjs

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const DEMO_EMAIL = "catalogue-demo@lebontruc.internal";

async function main() {
  const [demoUser] = await sql`select id from users where email = ${DEMO_EMAIL}`;
  if (!demoUser) {
    console.log("Aucun compte démo trouvé, rien à faire.");
    return;
  }

  const annonceIds = await sql`select id from annonces where user_id = ${demoUser.id}`;
  for (const { id } of annonceIds) {
    await sql`delete from annonce_images where annonce_id = ${id}`;
  }
  const delAnnonces = await sql`delete from annonces where user_id = ${demoUser.id} returning id`;
  await sql`delete from users where id = ${demoUser.id}`;

  console.log(`Supprimé : ${delAnnonces.length} annonces démo + le compte "Catalogue démo".`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
