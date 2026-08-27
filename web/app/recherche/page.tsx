import Link from "next/link";
import { and, eq } from "drizzle-orm";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AdRow from "@/components/AdRow";
import { db } from "@/lib/db/client";
import { annonces, users } from "@/lib/db/schema";
import { getFiltersForCategory } from "@/lib/listing-config";
import { annonceToRowData, getCoverUrls } from "@/lib/annonce-display";
import {
  buildAnnonceConditions,
  buildAnnonceOrderBy,
  compterParCategorie,
  normaliserTri,
  trisDisponibles,
} from "@/lib/annonce-filters";
import { requeteTexte } from "@/lib/recherche-texte";
import { auth } from "@/lib/auth";
import { listerFavorisIds } from "@/lib/favoris";

// Même raison qu'en page catégorie : le catalogue change à chaque dépôt.
export const dynamic = "force-dynamic";

// Plafond de résultats rendus. La pagination n'existe encore nulle part sur le
// site (la page catégorie rend elle aussi la liste entière) ; ce plafond est
// donc une protection contre une requête très large (« voiture »), pas une
// pagination. À remplacer par une vraie pagination en même temps que celle de
// la page catégorie — et c'est là que se posera l'entrelacement des annonces
// sponsorisées du §14.4, qui est une fonction pure de (page, rang).
const LIMITE_RESULTATS = 200;

const LIBELLES_TRI: Record<string, string> = {
  pertinence: "Pertinence",
  recentes: "Plus récentes",
  anciennes: "Plus anciennes",
  prix_asc: "Prix croissants",
  prix_desc: "Prix décroissants",
  distance: "Les plus proches",
};

export default async function RecherchePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const saisie = (sp.q ?? "").trim();
  const requete = requeteTexte(saisie);

  // Recherche transverse : aucune rubrique n'est imposée (`null`), à la
  // différence de la page catégorie. Tout le reste des filtres est construit
  // par le même code, donc se comporte à l'identique.
  const conditions = buildAnnonceConditions(null, sp);
  const tri = normaliserTri(sp.tri, sp);
  const orderBy = buildAnnonceOrderBy(tri, sp);

  const session = await auth();

  const [rows, parCategorie, favorisIds] = await Promise.all([
    requete
      ? db
          .select({ annonce: annonces, vendeurNom: users.displayName })
          .from(annonces)
          .innerJoin(users, eq(annonces.userId, users.id))
          .where(and(...conditions))
          .orderBy(...orderBy)
          .limit(LIMITE_RESULTATS)
      : Promise.resolve([]),
    requete ? compterParCategorie(sp) : Promise.resolve([]),
    session ? listerFavorisIds(session.user.id) : Promise.resolve(new Set<string>()),
  ]);

  const covers = await getCoverUrls(rows.map((r) => r.annonce.id));
  const ads = rows.map((r) =>
    annonceToRowData(r.annonce, covers.get(r.annonce.id), r.vendeurNom, favorisIds.has(r.annonce.id))
  );
  const total = parCategorie.reduce((somme, c) => somme + c.count, 0);

  function hrefTri(valeur: string): string {
    const params = new URLSearchParams();
    params.set("q", saisie);
    if (valeur !== "pertinence") params.set("tri", valeur);
    return `/recherche?${params.toString()}`;
  }

  return (
    <>
      <SiteHeader valeurRecherche={saisie} />

      <section className="results-head">
        <div className="wrap">
          {requete ? (
            <>
              <h1>« {saisie} »</h1>
              <p className="results-count">
                {total.toLocaleString("fr-FR")} annonce{total > 1 ? "s" : ""}
                {total > LIMITE_RESULTATS && ` — les ${LIMITE_RESULTATS} plus pertinentes sont affichées`}
              </p>
            </>
          ) : (
            <>
              <h1>Rechercher une annonce</h1>
              <p className="results-count">
                Saisissez ce que vous cherchez dans le champ de recherche, en haut de la page.
              </p>
            </>
          )}
        </div>
      </section>

      {requete && parCategorie.length > 0 && (
        <section className="results-grid-section">
          <div className="wrap">
            {/* Facettes par rubrique. Chaque lien renvoie vers la page
                catégorie AVEC la requête : c'est là que vit le panneau de
                filtres complet (marque, prix, kilométrage…), qui n'a pas de
                sens transverse — on ne filtre pas des vinyles par kilométrage. */}
            <div className="pf-row">
              {parCategorie.map((c) => (
                <Link
                  className="pf-chip"
                  key={c.categorie}
                  href={`/${c.categorie}?q=${encodeURIComponent(saisie)}`}
                >
                  {getFiltersForCategory(c.categorie).label} ({c.count.toLocaleString("fr-FR")})
                </Link>
              ))}
            </div>
            <div className="pf-row">
              {trisDisponibles(sp).map((valeur) => (
                <Link
                  className={`pf-chip${valeur === tri ? " active" : ""}`}
                  key={valeur}
                  href={hrefTri(valeur)}
                >
                  Tri : {LIBELLES_TRI[valeur]}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="results-grid-section">
        <div className="wrap">
          {requete && ads.length === 0 && (
            <p className="empty-state">
              Aucune annonce ne correspond à « {saisie} ». Essayez avec moins de mots, ou
              parcourez les rubriques depuis le menu.
            </p>
          )}
          <div className="ad-row-list">
            {ads.map((ad) => (
              <AdRow key={ad.id} ad={ad} href={`/annonces/${ad.id}`} />
            ))}
          </div>
          <div className="crumb">
            <Link href="/">Accueil</Link> › Recherche
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
