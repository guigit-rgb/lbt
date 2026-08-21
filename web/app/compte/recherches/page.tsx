import Link from "next/link";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { auth } from "@/lib/auth";
import { listerRecherchesSauvegardees } from "@/lib/recherches";
import { SupprimerRechercheButton } from "./SupprimerRechercheButton";

export const dynamic = "force-dynamic";

export default async function RecherchesPage() {
  const session = await auth();
  if (!session) {
    redirect("/compte/connexion");
  }

  const recherches = await listerRecherchesSauvegardees(session.user.id);

  return (
    <>
      <SiteHeader />

      <main className="wrap recherches-page">
        <h1>Mes recherches</h1>

        {recherches.length === 0 ? (
          <p className="empty-state">
            Aucune recherche sauvegardée pour l&apos;instant. Depuis une page catégorie, ouvrez le
            panneau « Filtres » et cliquez sur « Sauvegarder cette recherche ».
          </p>
        ) : (
          <div className="recherches-list">
            {recherches.map((r) => (
              <div key={r.id} className="recherche-card">
                <div>
                  <p className="recherche-categorie">{r.categorieLabel}</p>
                  <p className="recherche-filtres">{r.libelleFiltres}</p>
                  <p className="recherche-count">
                    {r.nombreResultats} annonce{r.nombreResultats !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="recherche-actions">
                  <Link href={r.href} className="btn btn-outline">
                    Voir les résultats
                  </Link>
                  <SupprimerRechercheButton id={r.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
