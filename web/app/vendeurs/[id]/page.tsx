import { notFound } from "next/navigation";
import { and, desc, eq, ilike } from "drizzle-orm";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AdCard from "@/components/AdCard";
import { db } from "@/lib/db/client";
import { annonces, users } from "@/lib/db/schema";
import { annonceToCardData, annonceVisiblePublic, getCoverUrls } from "@/lib/annonce-display";
import { couleurAvatar } from "@/lib/avatar";
import { auth } from "@/lib/auth";
import { listerFavorisIds } from "@/lib/favoris";

export const dynamic = "force-dynamic";

export default async function VendeurPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { id } = await params;
  const { q } = await searchParams;

  const [vendeur] = await db
    .select({ id: users.id, displayName: users.displayName, createdAt: users.createdAt, estPro: users.estPro })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!vendeur) {
    notFound();
  }

  const conditions = [eq(annonces.userId, id), annonceVisiblePublic()];
  const recherche = q?.trim();
  if (recherche) conditions.push(ilike(annonces.titre, `%${recherche}%`));

  const rows = await db
    .select()
    .from(annonces)
    .where(and(...conditions))
    .orderBy(desc(annonces.createdAt));

  const session = await auth();
  const [covers, favorisIds] = await Promise.all([
    getCoverUrls(rows.map((r) => r.id)),
    session ? listerFavorisIds(session.user.id) : Promise.resolve(new Set<string>()),
  ]);
  const ads = rows.map((r) => annonceToCardData(r, covers.get(r.id), favorisIds.has(r.id)));

  const membreDepuis = vendeur.createdAt.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  return (
    <>
      <SiteHeader />

      <main className="wrap vendeur-page">
        <div className="profil-header">
          <span className="profil-avatar" style={{ background: couleurAvatar(vendeur.displayName) }} aria-hidden="true">
            {vendeur.displayName.charAt(0).toUpperCase()}
          </span>
          <div className="profil-header-body">
            <h1>
              {vendeur.displayName}
              {vendeur.estPro && <span className="ad-detail-pro-badge">Pro</span>}
            </h1>
            <p className="profil-meta">Membre depuis {membreDepuis}</p>
            <p className="profil-meta">
              {rows.length} annonce{rows.length !== 1 ? "s" : ""} en ligne
            </p>
          </div>
        </div>

        <form className="ma-toolbar" action={`/vendeurs/${id}`}>
          <label className="ma-search">
            🔎 <input type="text" name="q" defaultValue={q ?? ""} placeholder={`Rechercher dans les annonces de ${vendeur.displayName}`} />
          </label>
          <button type="submit" className="btn btn-outline">Rechercher</button>
        </form>

        {ads.length === 0 ? (
          <p className="empty-state">
            {recherche
              ? "Aucune annonce ne correspond à cette recherche."
              : "Ce vendeur n'a aucune annonce en ligne pour l'instant."}
          </p>
        ) : (
          <div className="card-strip">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} href={`/annonces/${ad.id}`} />
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
