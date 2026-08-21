import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AdCard from "@/components/AdCard";
import { auth } from "@/lib/auth";
import { listerAnnoncesFavorites } from "@/lib/favoris";

export const dynamic = "force-dynamic";

export default async function FavorisPage() {
  const session = await auth();
  if (!session) {
    redirect("/compte/connexion");
  }

  const ads = await listerAnnoncesFavorites(session.user.id);

  return (
    <>
      <SiteHeader />

      <main className="wrap recherches-page">
        <h1>Mes favoris</h1>

        {ads.length === 0 ? (
          <p className="empty-state">
            Aucune annonce en favori pour l&apos;instant. Cliquez sur le cœur d&apos;une annonce pour
            l&apos;ajouter ici.
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
