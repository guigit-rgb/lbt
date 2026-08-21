import type { Metadata } from "next";
import Link from "next/link";
import { and, asc, count, desc, eq, gte, ilike, lte } from "drizzle-orm";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AdRow from "@/components/AdRow";
import CategoryFilters from "@/components/CategoryFilters";
import { db } from "@/lib/db/client";
import { annonces, users, CATEGORIES, type Categorie } from "@/lib/db/schema";
import { categorieLabel, SEARCH_FILTERS, type FilterOption } from "@/lib/listing-config";
import { annonceToRowData, getCoverUrls, annonceVisiblePublic } from "@/lib/annonce-display";
import { conditionRecherche, motsRecherche, ordrePertinence } from "@/lib/annonce-search";

export const dynamic = "force-dynamic";

// Une page de résultats n'a pas à être indexée : elle n'apporte rien qu'une
// page catégorie ou une page d'annonce n'apporte déjà, et laisser un moteur
// parcourir l'espace des requêtes multiplie les URL sans contenu propre. Les
// pages SEO géolocalisées du §14.2 sont un autre objet, à construire à part.
export const metadata: Metadata = {
  title: "Recherche — lebontruc.fr",
  robots: { index: false, follow: true },
};

// Nombre de résultats rendus. Il n'y a pas encore de pagination sur le site ;
// plafonner explicitement vaut mieux que rapatrier tout le catalogue, et le
// total réel reste affiché au-dessus de la liste.
const MAX_RESULTATS = 100;

function isCategorie(value: string | undefined): value is Categorie {
  return value != null && (CATEGORIES as readonly string[]).includes(value);
}

export default async function RecherchePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const mots = motsRecherche(sp.q ?? "");
  // Forme canonique de la requête : tronquée, sans espaces superflus et bornée
  // à huit mots. C'est elle qu'on réaffiche et qu'on propage dans les URL de
  // filtre, pour qu'un `?q=` de 10 000 caractères ne se recopie pas de lien en
  // lien, et pour que la barre de recherche montre ce qui a réellement servi.
  const requete = mots.join(" ");
  const categorieFiltre = isCategorie(sp.categorie) ? sp.categorie : undefined;

  // Les filtres communs aux résultats et aux facettes : la catégorie en est
  // exclue, sinon chaque facette n'afficherait que le compte de la catégorie
  // déjà sélectionnée.
  const conditionsCommunes = [annonceVisiblePublic(), conditionRecherche(mots)];
  if (sp.localisation) conditionsCommunes.push(ilike(annonces.ville, `%${sp.localisation}%`));
  if (sp.prix_min) conditionsCommunes.push(gte(annonces.prixCents, Number(sp.prix_min) * 100));
  if (sp.prix_max) conditionsCommunes.push(lte(annonces.prixCents, Number(sp.prix_max) * 100));

  const conditions = categorieFiltre
    ? [...conditionsCommunes, eq(annonces.categorie, categorieFiltre)]
    : conditionsCommunes;

  const tri = sp.tri === "prix_asc" || sp.tri === "prix_desc" ? sp.tri : "pertinence";
  const orderBy =
    tri === "prix_asc"
      ? [asc(annonces.prixCents)]
      : tri === "prix_desc"
        ? [desc(annonces.prixCents)]
        : [asc(ordrePertinence(mots)), desc(annonces.createdAt)];

  const [rowsWithVendeur, facettes] = mots.length
    ? await Promise.all([
        db
          .select({ annonce: annonces, vendeurNom: users.displayName })
          .from(annonces)
          .innerJoin(users, eq(annonces.userId, users.id))
          .where(and(...conditions))
          .orderBy(...orderBy)
          .limit(MAX_RESULTATS),
        db
          .select({ categorie: annonces.categorie, total: count() })
          .from(annonces)
          .where(and(...conditionsCommunes))
          .groupBy(annonces.categorie),
      ])
    : [[], []];

  const covers = await getCoverUrls(rowsWithVendeur.map((r) => r.annonce.id));
  const ads = rowsWithVendeur.map((r) => annonceToRowData(r.annonce, covers.get(r.annonce.id), r.vendeurNom));

  const totauxParCategorie = new Map(facettes.map((f) => [f.categorie, f.total]));
  const total = categorieFiltre
    ? (totauxParCategorie.get(categorieFiltre) ?? 0)
    : facettes.reduce((somme, f) => somme + f.total, 0);

  // La catégorie sélectionnée reste dans la liste même sans résultat, sinon le
  // `select` afficherait « Toutes les catégories » alors qu'un filtre est actif.
  if (categorieFiltre && !totauxParCategorie.has(categorieFiltre)) {
    totauxParCategorie.set(categorieFiltre, 0);
  }
  const optionsCategorie: FilterOption[] = [...totauxParCategorie.entries()]
    .sort(([, a], [, b]) => b - a)
    .map(([categorie, n]) => ({
      value: categorie,
      label: `${categorieLabel(categorie)} (${n.toLocaleString("fr-FR")})`,
    }));

  // Paramètres reconduits par la barre de filtres. `q` y prend sa forme
  // canonique, et une catégorie inconnue est écartée plutôt que recopiée : sans
  // ça un `?categorie=nimportequoi` survivrait à chaque changement de filtre
  // tout en n'ayant aucun effet sur les résultats.
  const currentValues = Object.fromEntries(
    Object.entries({ ...sp, q: requete, categorie: categorieFiltre }).filter(
      ([k, v]) => k !== "tri" && typeof v === "string" && v.length > 0
    )
  ) as Record<string, string>;

  return (
    <>
      <SiteHeader searchQuery={requete} />

      <section className="filter-bar">
        <CategoryFilters
          basePath="/recherche"
          filters={SEARCH_FILTERS}
          currentValues={currentValues}
          options={{ categorie: optionsCategorie }}
          currentTri={tri}
        />
      </section>

      <section className="results-head">
        <div className="wrap">
          <h1>{requete || "Rechercher une annonce"}</h1>
          {mots.length > 0 && <p className="results-count">{total.toLocaleString("fr-FR")} annonces</p>}
        </div>
      </section>

      <section className="results-grid-section">
        <div className="wrap">
          {mots.length === 0 && (
            <p className="empty-state">
              Saisissez un mot-clé dans la barre de recherche — une marque, un modèle, une ville…
            </p>
          )}
          {mots.length > 0 && ads.length === 0 && (
            <p className="empty-state">
              Aucune annonce ne correspond à cette recherche. Essayez avec moins de mots, ou parcourez les{" "}
              <Link href="/vehicules">annonces véhicules</Link>.
            </p>
          )}
          <div className="ad-row-list">
            {ads.map((ad) => (
              <AdRow key={ad.id} ad={ad} href={`/annonces/${ad.id}`} />
            ))}
          </div>
          {total > ads.length && (
            <p className="results-note">
              Seuls les {MAX_RESULTATS.toLocaleString("fr-FR")} premiers résultats sont affichés. Affinez la
              recherche avec un filtre pour voir les autres.
            </p>
          )}
        </div>
        <div className="wrap">
          <div className="crumb">
            <Link href="/">Accueil</Link> › Recherche
            {categorieFiltre && ` › ${categorieLabel(categorieFiltre)}`}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
