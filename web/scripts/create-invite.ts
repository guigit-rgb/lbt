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
  const code = process.argv[2];
  if (!code) {
    console.error("Usage: npx tsx scripts/create-invite.ts <code>");
    process.exit(1);
  }

  loadEnvLocal();
  // Dynamic import: db/client.ts reads process.env.DATABASE_URL at module
  // load time, so env vars must be populated before this import runs.
  const { db } = await import("../lib/db/client");
  const { invites } = await import("../lib/db/schema");

  await db.insert(invites).values({ code, note: "créé via create-invite.ts" });
  console.log(`Code d'invitation créé : ${code}`);
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
