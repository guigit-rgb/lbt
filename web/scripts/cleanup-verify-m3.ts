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
  const { eq } = await import("drizzle-orm");
  const { db } = await import("../lib/db/client");
  const { users, annonces, feedback } = await import("../lib/db/schema");

  const userId = process.argv[2];
  if (!userId) {
    console.error("Usage: npx tsx scripts/cleanup-verify-m3.ts <userId>");
    process.exit(1);
  }

  await db.delete(feedback).where(eq(feedback.userId, userId));
  await db.delete(annonces).where(eq(annonces.userId, userId));
  await db.delete(users).where(eq(users.id, userId));
  console.log("Nettoyage effectué pour userId=" + userId);
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
