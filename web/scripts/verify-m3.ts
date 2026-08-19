import { readFileSync } from "node:fs";
import { join } from "node:path";

function loadEnvLocal() {
  const path = join(__dirname, "..", ".env.local");
  const content = readFileSync(path, "utf-8");
  for (const line of content.split("\n")) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (match) {
      const [, key, rawValue] = match;
      const value = rawValue.replace(/^(['"])(.*)\1$/, "$2");
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  }
}

async function main() {
  loadEnvLocal();
  const { hash } = await import("bcryptjs");
  const { db } = await import("../lib/db/client");
  const { users, annonces, feedback } = await import("../lib/db/schema");

  const email = `verif-m3-${Date.now()}@example.com`;
  const password = "verif-password-123";
  const passwordHash = await hash(password, 12);

  const [user] = await db
    .insert(users)
    .values({ email, passwordHash, displayName: "Testeur M3" })
    .returning({ id: users.id });
  console.log("USER_ID=" + user.id);
  console.log("USER_EMAIL=" + email);
  console.log("USER_PASSWORD=" + password);

  const [vehicule] = await db
    .insert(annonces)
    .values({
      userId: user.id,
      categorie: "vehicules",
      titre: "Porsche Cayenne hybrid — vérification M3",
      description: "Annonce de vérification automatisée pour le jalon M3.",
      prixCents: 5400000,
      ville: "Toulouse",
      codePostal: "31000",
      etat: "en_ligne",
      marque: "Porsche",
      modele: "Cayenne",
      annee: 2018,
      kilometrage: 101000,
      attributs: { carburant: "Hybride", boite: "Automatique" },
      publishedAt: new Date(),
    })
    .returning({ id: annonces.id });
  console.log("VEHICULE_ID=" + vehicule.id);

  const [mode] = await db
    .insert(annonces)
    .values({
      userId: user.id,
      categorie: "mode",
      titre: "Veste en cuir — vérification M3",
      description: "Annonce générique de vérification pour une catégorie sans champs dédiés.",
      prixCents: 4500,
      ville: "Bordeaux",
      codePostal: "33000",
      etat: "en_ligne",
      attributs: {},
      publishedAt: new Date(),
    })
    .returning({ id: annonces.id });
  console.log("MODE_ID=" + mode.id);

  const [fb] = await db
    .insert(feedback)
    .values({ userId: user.id, contexte: "depot_annonce", reponse: "Très facile" })
    .returning({ id: feedback.id });
  console.log("FEEDBACK_ID=" + fb.id);
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
