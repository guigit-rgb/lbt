import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function MesAnnoncesPage() {
  const session = await auth();

  // The proxy already gates this route, but Server Functions/pages must
  // never rely solely on it — re-check explicitly (Next.js 16 guidance).
  if (!session) {
    redirect("/compte/connexion");
  }

  return (
    <main style={{ maxWidth: 640, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Bonjour {session.user.name}</h1>
      <p>Vous n&apos;avez pas encore déposé d&apos;annonce.</p>
    </main>
  );
}
