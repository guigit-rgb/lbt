import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, and } from "drizzle-orm";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AdRow from "@/components/AdRow";
import CategoryFilters from "@/components/CategoryFilters";
import { db } from "@/lib/db/client";
import { annonces, users, CATEGORIES, type Categorie } from "@/lib/db/schema";
import { getFiltersForCategory } from "@/lib/listing-config";
import { annonceToRowData, getCoverUrls } from "@/lib/annonce-display";
import {
  buildAnnonceConditions,
  buildAnnonceOrderBy,
  normaliserTri,
  optionCounts,
  trisDisponibles,
  typeAnnonceCounts,
  urgentCount,
  vendeurCounts,
} from "@/lib/annonce-filters";
import { requeteTexte } from "@/lib/recherche-texte";
import { auth } from "@/lib/auth";
import { listerFavorisIds } from "@/lib/favoris";

// Les annonces changent à chaque dépôt (Server Function, pas de revalidation
// ciblée en V0) : la page doit se recalculer à chaque requête, pas être
// générée statiquement au build.
export const dynamic = "force-dynamic";

function isCategorie(value: string): value is Categorie {
  return (CATEGORIES as readonly string[]).includes(value);
}

export default async function CategorieListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ categorie: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { categorie } = await params;
  const sp = await searchParams;

  if (!isCategorie(categorie)) {
    notFound();
  }

  // sous_categorie est déjà l'un des filtres actifs (`sp`) : les champs
  // propres à cette sous-catégorie ne rejoignent le panneau qu'une fois
  // qu'elle est choisie (cf. lib/listing-config.ts ListingConfig.subCategoryFilters).
  const config = getFiltersForCategory(categorie, sp.sous_categorie);
  const conditions = buildAnnonceConditions(categorie, sp);

  // Le tri « Pertinence » ne se réduit plus à la fraîcheur : quand la page
  // porte une requête texte (`?q=`), il applique les paliers de pertinence de
  // la §14.2 ; quand elle porte un rayon, la distance. Cf. buildAnnonceOrderBy.
  const tri = normaliserTri(sp.tri, sp);
  const orderBy = buildAnnonceOrderBy(tri, sp);
  const requete = requeteTexte(sp.q);

  const session = await auth();

  const [rowsWithVendeur, optionEntries, typeAnnonceComptes, vendeurComptes, urgentComptes, favorisIds] = await Promise.all([
    db
      .select({ annonce: annonces, vendeurNom: users.displayName })
      .from(annonces)
      .innerJoin(users, eq(annonces.userId, users.id))
      .where(and(...conditions))
      .orderBy(...orderBy),
    Promise.all(
      config.filters
        .filter((f) => f.widget === "select" || f.widget === "checkbox" || f.widget === "marque")
        .map(async (f) => [f.key, await optionCounts(categorie, sp, f.key)] as const)
    ),
    typeAnnonceCounts(categorie, sp),
    vendeurCounts(categorie, sp),
    urgentCount(categorie, sp),
    session ? listerFavorisIds(session.user.id) : Promise.resolve(new Set<string>()),
  ]);
  const options = Object.fromEntries(optionEntries);

  const covers = await getCoverUrls(rowsWithVendeur.map((r) => r.annonce.id));
  const ads = rowsWithVendeur.map((r) =>
    annonceToRowData(r.annonce, covers.get(r.annonce.id), r.vendeurNom, favorisIds.has(r.annonce.id))
  );
  const count = ads.length;

  const currentValues = Object.fromEntries(
    Object.entries(sp).filter(([k, v]) => k !== "tri" && typeof v === "string" && v.length > 0)
  ) as Record<string, string>;

  return (
    <>
      <SiteHeader activeCategorie={categorie} valeurRecherche={sp.q ?? ""} />

      <section className="filter-bar">
        <CategoryFilters
          basePath={`/${categorie}`}
          categorie={categorie}
          filters={config.filters}
          currentValues={currentValues}
          options={options}
          typeAnnonceCounts={typeAnnonceComptes}
          vendeurCounts={vendeurComptes}
          urgentCount={urgentComptes}
          currentTri={tri}
          trisDisponibles={trisDisponibles(sp)}
          resultCount={count}
        />
      </section>

      <section className="results-head">
        <div className="wrap">
          <h1>{requete ? `${sp.q} — ${config.label}` : config.h1}</h1>
          <p className="results-count">{count.toLocaleString("fr-FR")} annonces</p>
        </div>
      </section>

      <section className="results-grid-section">
        <div className="wrap">
          {ads.length === 0 && (
            <p className="empty-state">
              {requete ? (
                <>
                  Aucune annonce ne correspond à « {sp.q} » dans {config.label}.{" "}
                  <Link href={`/recherche?q=${encodeURIComponent(sp.q ?? "")}`}>
                    Chercher dans toutes les rubriques
                  </Link>
                  .
                </>
              ) : (
                "Aucune annonce ne correspond à ces filtres pour le moment."
              )}
            </p>
          )}
          <div className="ad-row-list">
            {ads.map((ad) => (
              <AdRow key={ad.id} ad={ad} href={`/annonces/${ad.id}`} />
            ))}
          </div>
        </div>
        <div className="wrap">
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
