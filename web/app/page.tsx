import Link from "next/link";
import { and, count, desc, eq } from "drizzle-orm";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SeoLinks from "@/components/SeoLinks";
import AdCard from "@/components/AdCard";
import RechercheVehiculesWidget from "@/components/RechercheVehiculesWidget";
import { db } from "@/lib/db/client";
import { annonces, CATEGORIES, type Categorie } from "@/lib/db/schema";
import { annonceToCardData, annonceVisiblePublic, getCoverUrls } from "@/lib/annonce-display";
import { auth } from "@/lib/auth";
import { listerFavorisIds } from "@/lib/favoris";

export const dynamic = "force-dynamic";

async function latestAds(categorie: Categorie, limit: number, favorisIds: Set<string>) {
  const rows = await db
    .select()
    .from(annonces)
    .where(and(eq(annonces.categorie, categorie), annonceVisiblePublic()))
    .orderBy(desc(annonces.createdAt))
    .limit(limit);
  const covers = await getCoverUrls(rows.map((r) => r.id));
  return rows.map((row) => annonceToCardData(row, covers.get(row.id), favorisIds.has(row.id)));
}

async function countsByCategorie(): Promise<Record<Categorie, number>> {
  const rows = await db
    .select({ categorie: annonces.categorie, total: count() })
    .from(annonces)
    .where(annonceVisiblePublic())
    .groupBy(annonces.categorie);

  const counts = Object.fromEntries(CATEGORIES.map((categorie) => [categorie, 0])) as Record<Categorie, number>;
  for (const row of rows) {
    counts[row.categorie] = row.total;
  }
  return counts;
}

const CATALOG_TILES: { categorie: Categorie; label: string }[] = [
  { categorie: "immobilier", label: "Immobilier" },
  { categorie: "locations-vacances", label: "Locations de vacances" },
  { categorie: "emploi", label: "Emploi" },
  { categorie: "mode", label: "Mode" },
  { categorie: "maison-jardin", label: "Maison & jardin" },
  { categorie: "electronique", label: "Électronique" },
  { categorie: "materiel-pro", label: "Matériel pro" },
  { categorie: "animaux", label: "Animaux" },
  { categorie: "famille", label: "Famille" },
  { categorie: "services", label: "Services" },
  { categorie: "autres", label: "Autres" },
];

export default async function HomePage() {
  const session = await auth();
  const favorisIds = session ? await listerFavorisIds(session.user.id) : new Set<string>();

  const [vehicules, loisirs, counts] = await Promise.all([
    latestAds("vehicules", 6, favorisIds),
    latestAds("loisirs", 5, favorisIds),
    countsByCategorie(),
  ]);

  return (
    <>
      <SiteHeader />

      <section className="depose-banner">
        <span className="drift" style={{ left: "8%", animationDuration: "7s", animationDelay: "0s" }}>
          🚗
        </span>
        <span className="drift" style={{ left: "22%", animationDuration: "9s", animationDelay: "2s" }}>
          📷
        </span>
        <span className="drift" style={{ left: "38%", animationDuration: "6.5s", animationDelay: "4s" }}>
          🏠
        </span>
        <span className="drift" style={{ left: "58%", animationDuration: "8s", animationDelay: "1s" }}>
          🎸
        </span>
        <span className="drift" style={{ left: "74%", animationDuration: "7.5s", animationDelay: "3s" }}>
          👕
        </span>
        <span className="drift" style={{ left: "88%", animationDuration: "9.5s", animationDelay: "5s" }}>
          🚲
        </span>
        <div className="wrap">
          <div className="banner-half">
            <span className="label kicker">Ça prend 2 minutes</span>
            <h2>Un truc à vendre ? Déposez votre annonce dès maintenant</h2>
            <Link className="btn-depose" href="/compte/annonces/nouvelle">
              <span>＋</span>Déposer une annonce
            </Link>
          </div>
          <div className="banner-half">
            <p className="banner-pitch">
              LeBonTruc, c&apos;est comme l&apos;autre — mais 100% français, et moins cher (pas besoin de financer
              des milliards d&apos;€ aux fonds américains)
            </p>
          </div>
        </div>
      </section>

      <section className="recherche-widget-section">
        <div className="wrap">
          <RechercheVehiculesWidget />
        </div>
      </section>

      <section className="tint">
        <div className="wrap">
          <div className="section-head">
            <h2>Véhicules</h2>
            <Link className="see-all" href="/vehicules">
              Voir les {counts.vehicules.toLocaleString("fr-FR")} annonces →
            </Link>
          </div>
          <div className="card-strip">
            {vehicules.map((ad) => (
              <AdCard key={ad.id} ad={ad} href={`/annonces/${ad.id}`} />
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-head">
            <h2>Loisirs</h2>
            <Link className="see-all" href="/loisirs">
              Voir les {counts.loisirs.toLocaleString("fr-FR")} annonces →
            </Link>
          </div>
          <div className="card-strip">
            {loisirs.map((ad) => (
              <AdCard key={ad.id} ad={ad} href={`/annonces/${ad.id}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="trust">
        <div className="wrap trust-grid">
          <div className="trust-item">
            <span className="label">Plaques floutées</span>
            <p>Automatiquement, sur chaque photo déposée.</p>
          </div>
          <div className="trust-item">
            <span className="label">Historique gratuit</span>
            <p>Rapport HistoVec joint sur toutes les annonces auto.</p>
          </div>
          <div className="trust-item">
            <span className="label">Vendeurs suivis</span>
            <p>Délai de réponse et taux de retrait affichés, pas d&apos;étoiles achetées.</p>
          </div>
          <div className="trust-item">
            <span className="label">Communautés vérifiées</span>
            <p>Invité par un collègue ou un proche, jamais par un inconnu.</p>
          </div>
        </div>
      </section>

      <section className="tint">
        <div className="wrap">
          <div className="section-head">
            <h2 style={{ fontSize: "1.05rem" }}>Aussi sur le bon truc</h2>
          </div>
          <div className="catalog-grid">
            {CATALOG_TILES.map((tile) => (
              <Link className="cat-tile" href={`/${tile.categorie}`} key={tile.categorie}>
                <div className="n">{counts[tile.categorie]}</div>
                <div className="name">{tile.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SeoLinks />
      <SiteFooter />
    </>
  );
}
