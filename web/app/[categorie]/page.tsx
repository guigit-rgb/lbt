import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, asc, eq, and, ilike, gte, lte, isNotNull } from "drizzle-orm";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AdRow from "@/components/AdRow";
import CategoryFilters from "@/components/CategoryFilters";
import { db } from "@/lib/db/client";
import { annonces, users, CATEGORIES, type Categorie } from "@/lib/db/schema";
import { getFiltersForCategory } from "@/lib/listing-config";
import { annonceToRowData, getCoverUrls, annonceVisiblePublic } from "@/lib/annonce-display";

// Les annonces changent à chaque dépôt (Server Function, pas de revalidation
// ciblée en V0) : la page doit se recalculer à chaque requête, pas être
// générée statiquement au build.
export const dynamic = "force-dynamic";

function isCategorie(value: string): value is Categorie {
  return (CATEGORIES as readonly string[]).includes(value);
}

// Colonne réelle derrière chaque filtre "select" — tenue à part de
// lib/listing-config.ts pour ne pas faire dépendre ce fichier partagé
// (utilisé aussi côté dépôt d'annonce) du schéma Drizzle complet.
const SELECT_COLUMNS = {
  marque: annonces.marque,
  modele: annonces.modele,
  annee: annonces.annee,
  sous_categorie: annonces.sousCategorie,
  etat_produit: annonces.etatProduit,
  type_animal: annonces.typeAnimal,
} as const;

async function distinctOptions(categorie: Categorie, key: keyof typeof SELECT_COLUMNS): Promise<string[]> {
  const column = SELECT_COLUMNS[key];
  const rows = await db
    .selectDistinct({ value: column })
    .from(annonces)
    .where(and(eq(annonces.categorie, categorie), annonceVisiblePublic(), isNotNull(column)))
    .orderBy(key === "annee" ? desc(column) : asc(column));
  return rows.map((r) => String(r.value)).filter(Boolean);
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

  const config = getFiltersForCategory(categorie);

  const conditions = [eq(annonces.categorie, categorie), annonceVisiblePublic()];
  if (sp.localisation) conditions.push(ilike(annonces.ville, `%${sp.localisation}%`));
  if (sp.prix_min) conditions.push(gte(annonces.prixCents, Number(sp.prix_min) * 100));
  if (sp.prix_max) conditions.push(lte(annonces.prixCents, Number(sp.prix_max) * 100));
  if (sp.kilometrage_min) conditions.push(gte(annonces.kilometrage, Number(sp.kilometrage_min)));
  if (sp.kilometrage_max) conditions.push(lte(annonces.kilometrage, Number(sp.kilometrage_max)));
  for (const key of Object.keys(SELECT_COLUMNS) as (keyof typeof SELECT_COLUMNS)[]) {
    const value = sp[key];
    if (value) {
      const column = SELECT_COLUMNS[key];
      conditions.push(key === "annee" ? eq(column, Number(value)) : eq(column, value));
    }
  }

  const tri = sp.tri === "prix_asc" || sp.tri === "prix_desc" ? sp.tri : "pertinence";
  const orderBy =
    tri === "prix_asc" ? asc(annonces.prixCents) : tri === "prix_desc" ? desc(annonces.prixCents) : desc(annonces.createdAt);

  const [rowsWithVendeur, optionEntries] = await Promise.all([
    db
      .select({ annonce: annonces, vendeurNom: users.displayName })
      .from(annonces)
      .innerJoin(users, eq(annonces.userId, users.id))
      .where(and(...conditions))
      .orderBy(orderBy),
    Promise.all(
      config.filters
        .filter((f) => f.widget === "select")
        .map(async (f) => [f.key, await distinctOptions(categorie, f.key as keyof typeof SELECT_COLUMNS)] as const)
    ),
  ]);
  const options = Object.fromEntries(optionEntries);

  const covers = await getCoverUrls(rowsWithVendeur.map((r) => r.annonce.id));
  const ads = rowsWithVendeur.map((r) => annonceToRowData(r.annonce, covers.get(r.annonce.id), r.vendeurNom));
  const count = ads.length;

  const currentValues = Object.fromEntries(
    Object.entries(sp).filter(([k, v]) => k !== "tri" && typeof v === "string" && v.length > 0)
  ) as Record<string, string>;

  return (
    <>
      <SiteHeader activeCategorie={categorie} />

      <section className="filter-bar">
        <CategoryFilters
          basePath={`/${categorie}`}
          filters={config.filters}
          currentValues={currentValues}
          options={options}
          currentTri={tri}
          resultCount={count}
        />
      </section>

      <section className="results-head">
        <div className="wrap">
          <h1>{config.h1}</h1>
          <p className="results-count">{count.toLocaleString("fr-FR")} annonces</p>
        </div>
      </section>

      <section className="results-grid-section">
        <div className="wrap">
          {ads.length === 0 && (
            <p className="empty-state">Aucune annonce ne correspond à ces filtres pour le moment.</p>
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
