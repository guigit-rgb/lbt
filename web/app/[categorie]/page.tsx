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
import { appliquerNormaliseur, normaliserRequeteAuto } from "@/lib/normaliseur-auto";
import { auth } from "@/lib/auth";
import { listerFavorisIds } from "@/lib/favoris";

// Les annonces changent à chaque dépôt (Server Function, pas de revalidation
// ciblée en V0) : la page doit se recalculer à chaque requête, pas être
// générée statiquement au build.
export const dynamic = "force-dynamic";

function isCategorie(value: string): value is Categorie {
  return (CATEGORIES as readonly string[]).includes(value);
}

/** Même page, normaliseur désactivé (`?brut=1`). C'est la porte de sortie de
 *  l'acheteur quand les filtres déduits ne rendent rien : la requête repart
 *  intégralement en recherche plein texte, comme avant la §14.3. Les filtres
 *  déduits ne sont volontairement PAS recopiés dans l'URL — le but est de
 *  revenir au texte, pas de figer une interprétation qui vient d'échouer. */
function lienBrut(categorie: Categorie, sp: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string" && v.length > 0 && k !== "brut") params.set(k, v);
  }
  params.set("brut", "1");
  return `/${categorie}?${params.toString()}`;
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

  // Requête normalisée (§14.3, action n°221). `buildAnnonceConditions` applique
  // déjà le normaliseur — la fonction est idempotente, donc l'appeler ici en
  // plus ne change aucun résultat, et c'est ce qui permet à trois autres choses
  // de rester cohérentes avec les annonces affichées : les **compteurs de
  // facettes**, le **panneau de filtres** (qui montre donc « Marque : Renault »
  // quand l'acheteur a tapé « clio ») et le **tri**, dont le contexte dépend de
  // la présence d'un texte résiduel et non de la requête d'origine.
  // Ne s'applique qu'à la verticale automobile — cf. lib/normaliseur-auto.ts.
  const spEffectif = appliquerNormaliseur(categorie, sp);
  const normalisation = categorie === "vehicules" && sp.q && sp.brut !== "1" ? normaliserRequeteAuto(sp.q) : null;
  const conditions = buildAnnonceConditions(categorie, spEffectif);

  // Le tri « Pertinence » ne se réduit plus à la fraîcheur : quand la page
  // porte une requête texte (`?q=`), il applique les paliers de pertinence de
  // la §14.2 ; quand elle porte un rayon, la distance. Cf. buildAnnonceOrderBy.
  const tri = normaliserTri(sp.tri, spEffectif);
  const orderBy = buildAnnonceOrderBy(tri, spEffectif);
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
        .map(async (f) => [f.key, await optionCounts(categorie, spEffectif, f.key)] as const)
    ),
    typeAnnonceCounts(categorie, spEffectif),
    vendeurCounts(categorie, spEffectif),
    urgentCount(categorie, spEffectif),
    session ? listerFavorisIds(session.user.id) : Promise.resolve(new Set<string>()),
  ]);
  const options = Object.fromEntries(optionEntries);

  const covers = await getCoverUrls(rowsWithVendeur.map((r) => r.annonce.id));
  const ads = rowsWithVendeur.map((r) =>
    annonceToRowData(r.annonce, covers.get(r.annonce.id), r.vendeurNom, favorisIds.has(r.annonce.id))
  );
  const count = ads.length;

  // `spEffectif` et non `sp` : les filtres déduits de la requête deviennent des
  // valeurs actives du panneau, donc modifiables et retirables un par un. Ils
  // se matérialisent aussi dans l'URL dès que l'acheteur touche un filtre
  // (CategoryFilters reconstruit l'URL depuis `currentValues`) — c'est
  // volontaire : l'interprétation cesse d'être implicite dès qu'elle est
  // discutée. Effet dérivé gratuit : une recherche sauvegardée depuis cette
  // page enregistre les **filtres**, pas une chaîne à re-deviner à chaque
  // comptage (§6.4).
  const currentValues = Object.fromEntries(
    Object.entries(spEffectif).filter(([k, v]) => k !== "tri" && typeof v === "string" && v.length > 0)
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
          {/* Ce que le normaliseur a compris, affiché tel quel. La §14.3
              (Résultat n°7) demandait une désambiguïsation visible plutôt qu'un
              arbitrage silencieux ; c'est le minimum de cette promesse, et
              accessoirement le seul moyen pour l'acheteur de comprendre
              pourquoi la page ne montre pas ce qu'il attendait. */}
          {normalisation && normalisation.reconnus.length > 0 && (
            <p className="query-understood">
              <span className="qu-label">Compris comme</span>
              {normalisation.reconnus.map((r) => (
                <span className={`qu-chip${r.filtrable ? "" : " qu-chip-inerte"}`} key={`${r.champ}-${r.valeur}`}>
                  {r.libelle} : {r.valeur}
                  {r.note ? ` (${r.note})` : ""}
                </span>
              ))}
              {normalisation.residu && <span className="qu-chip qu-chip-texte">texte : {normalisation.residu}</span>}
              <Link className="qu-brut" href={lienBrut(categorie, sp)}>
                Recherche texte brute
              </Link>
            </p>
          )}
        </div>
      </section>

      <section className="results-grid-section">
        <div className="wrap">
          {ads.length === 0 && (
            <p className="empty-state">
              {requete ? (
                <>
                  Aucune annonce ne correspond à « {sp.q} » dans {config.label}.{" "}
                  {normalisation && Object.keys(normalisation.derives).length > 0 && (
                    <>
                      <Link href={lienBrut(categorie, sp)}>Réessayer en recherche texte, sans filtres déduits</Link>
                      {" ou "}
                    </>
                  )}
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
