import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { annonces } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

function formatPrix(prixCents: number | null): string {
  if (prixCents == null) return "Prix sur demande";
  return `${(prixCents / 100).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`;
}

export default async function MesAnnoncesPage() {
  const session = await auth();

  // Le proxy protège déjà cette route, mais une Server Function/page ne doit
  // jamais s'y fier seule — revérification explicite (règle Next.js 16).
  if (!session) {
    redirect("/compte/connexion");
  }

  const mesAnnonces = await db
    .select()
    .from(annonces)
    .where(eq(annonces.userId, session.user.id))
    .orderBy(desc(annonces.createdAt));

  return (
    <main style={{ maxWidth: 720, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Bonjour {session.user.name}</h1>

      <Link
        href="/compte/annonces/nouvelle"
        style={{ display: "inline-block", margin: "1rem 0", padding: "0.6rem 1.2rem" }}
      >
        + Déposer une annonce
      </Link>

      {mesAnnonces.length === 0 ? (
        <p>Vous n&apos;avez pas encore déposé d&apos;annonce.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "0.75rem" }}>
          {mesAnnonces.map((annonce) => (
            <li key={annonce.id} style={{ border: "1px solid var(--line, #ddd)", borderRadius: 8, padding: "0.75rem 1rem" }}>
              <Link href={`/annonces/${annonce.id}`} style={{ fontWeight: 600 }}>
                {annonce.titre}
              </Link>
              <div style={{ color: "var(--muted, #666)", fontSize: "0.9rem" }}>
                {formatPrix(annonce.prixCents)} · {annonce.etat} ·{" "}
                {annonce.createdAt.toLocaleDateString("fr-FR")}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
