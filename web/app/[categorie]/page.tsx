import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AdCard from "@/components/AdCard";
import { CATEGORIES, type Categorie } from "@/lib/db/schema";
import { getFiltersForCategory } from "@/lib/listing-config";
import { getFakeAdsForCategory, CATALOG_COUNTS } from "@/lib/fake-data";

export function generateStaticParams() {
  return CATEGORIES.map((categorie) => ({ categorie }));
}

function isCategorie(value: string): value is Categorie {
  return (CATEGORIES as readonly string[]).includes(value);
}

export default async function CategorieListingPage({
  params,
}: {
  params: Promise<{ categorie: string }>;
}) {
  const { categorie } = await params;

  if (!isCategorie(categorie)) {
    notFound();
  }

  const config = getFiltersForCategory(categorie);
  const ads = getFakeAdsForCategory(categorie);
  const count = CATALOG_COUNTS[categorie] ?? ads.length;

  return (
    <>
      <SiteHeader activeCategorie={categorie} />

      <section className="filter-bar">
        <div className="wrap filter-row">
          {config.filters.map((filter) => (
            <button className="filter-pill" key={filter.key}>
              {filter.widget === "location" && (
                <span className="pin">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 21s7-7.58 7-12a7 7 0 1 0-14 0c0 4.42 7 12 7 12z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                </span>
              )}
              {filter.label}
              <span className="chev">⌄</span>
            </button>
          ))}
          <button className="filter-pill">
            <span>⚙︎</span>Filtres
          </button>
        </div>
        <div className="wrap filter-row breadcrumb-row">
          <button className="filter-chip">
            {config.label}
            <span className="chev">›</span>
          </button>
          <button className="filter-chip">
            Tri : Pertinence
            <span className="chev">›</span>
          </button>
        </div>
      </section>

      <section className="results-head">
        <div className="wrap">
          <h1>{config.h1}</h1>
          <p className="results-count">{count.toLocaleString("fr-FR")} annonces</p>
        </div>
      </section>

      <section className="results-grid-section">
        <div className="wrap">
          <div className="card-strip">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} showSeller />
            ))}
          </div>
        </div>
        <div className="wrap">
          <nav className="pagination" aria-label="Pagination">
            <span className="page-arrow">‹</span>
            <span className="page-num current">1</span>
            <span className="page-num">2</span>
            <span className="page-num">3</span>
            <span className="page-num">4</span>
            <span className="page-num">5</span>
            <span className="page-arrow">›</span>
          </nav>
          {config.popularFilters && (
            <div className="popular-filters">
              <h3>Filtres les plus souvent utilisés…</h3>
              <div className="pf-row">
                {config.popularFilters.map((chip) => (
                  <a className="pf-chip" href="#" key={chip}>
                    {chip}
                  </a>
                ))}
              </div>
            </div>
          )}
          <div className="crumb">
            <Link href="/">Accueil</Link> › {config.label}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
