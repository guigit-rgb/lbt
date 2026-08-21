import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { ProfilProForm } from "./ProfilProForm";

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const session = await auth();
  if (!session) {
    redirect("/compte/connexion");
  }

  const [user] = await db
    .select({ estPro: users.estPro, siret: users.siret })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  return (
    <>
      <SiteHeader />

      <main className="wrap" style={{ maxWidth: 480, margin: "2.5rem auto", padding: "0 1rem" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>Mon profil</h1>
        <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
          Le statut professionnel est auto-déclaré : LBT ne vérifie pas le SIRET auprès d&apos;un
          registre officiel.
        </p>
        <ProfilProForm estPro={user?.estPro ?? false} siret={user?.siret ?? ""} />
      </main>

      <SiteFooter />
    </>
  );
}
