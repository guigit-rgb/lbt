import Link from "next/link";
import { and, count, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { annonces, users } from "@/lib/db/schema";
import { couleurAvatar } from "@/lib/avatar";
import { DeconnexionButton } from "@/components/DeconnexionButton";
import { ProfilProForm } from "./ProfilProForm";

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const session = await auth();
  if (!session) {
    redirect("/compte/connexion");
  }

  const [[user], [{ value: nombreEnLigne }]] = await Promise.all([
    db
      .select({
        displayName: users.displayName,
        createdAt: users.createdAt,
        estPro: users.estPro,
        siret: users.siret,
        telephone: users.telephone,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1),
    db
      .select({ value: count() })
      .from(annonces)
      .where(and(eq(annonces.userId, session.user.id), eq(annonces.etat, "en_ligne"))),
  ]);

  const nom = user?.displayName ?? session.user.name;
  const membreDepuis = user?.createdAt.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) ?? "";

  return (
    <>
      <SiteHeader />

      <main className="wrap profil-page">
        <div className="profil-header">
          <span className="profil-avatar" style={{ background: couleurAvatar(nom) }} aria-hidden="true">
            {nom.charAt(0).toUpperCase()}
          </span>
          <div className="profil-header-body">
            <h1>
              {nom}
              {user?.estPro && <span className="ad-detail-pro-badge">Pro</span>}
            </h1>
            <p className="profil-meta">Membre depuis {membreDepuis}</p>
            <Link href="/compte/annonces" className="profil-meta profil-meta-link">
              {nombreEnLigne} annonce{nombreEnLigne !== 1 ? "s" : ""} en ligne
            </Link>
          </div>
        </div>

        <section className="profil-card">
          <h2>Paramètres du compte</h2>
          <p className="profil-card-note">
            Le statut professionnel est auto-déclaré : LBT ne vérifie pas le SIRET auprès d&apos;un
            registre officiel. Le téléphone est facultatif ; sans lui, vos annonces n&apos;affichent
            pas le bouton « Voir le numéro ».
          </p>
          <ProfilProForm estPro={user?.estPro ?? false} siret={user?.siret ?? ""} telephone={user?.telephone ?? ""} />
        </section>

        <div className="profil-deconnexion">
          <DeconnexionButton />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
