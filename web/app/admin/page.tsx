import { notFound } from "next/navigation";
import { desc, sql } from "drizzle-orm";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { db } from "@/lib/db/client";
import { annonces, users, paiements, recherchesIa } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { libelleEtat } from "@/lib/annonce-display";

const TOUS_ETATS = ["en_ligne", "en_pause", "brouillon", "vendue", "retiree_par_auteur", "expiree", "retiree"] as const;
import { getFiltersForCategory } from "@/lib/listing-config";
import { CATEGORIES, type Categorie } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

function formatEuros(cents: number): string {
  return `${(cents / 100).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`;
}

export default async function AdminPage() {
  const session = await auth();
  // 404, pas une redirection vers la connexion : ne pas révéler que cette
  // route existe à quelqu'un qui n'a pas le rôle admin.
  if (!session || session.user.role !== "admin") {
    notFound();
  }

  const [
    parEtat,
    parCategorie,
    totalComptes,
    comptesPro,
    parPaiement,
    totalRecherchesIa,
    dernieresRecherchesIa,
  ] = await Promise.all([
    db
      .select({ etat: annonces.etat, total: sql<number>`count(*)::int` })
      .from(annonces)
      .groupBy(annonces.etat),
    db
      .select({ categorie: annonces.categorie, total: sql<number>`count(*)::int` })
      .from(annonces)
      .where(sql`${annonces.etat} = 'en_ligne'`)
      .groupBy(annonces.categorie),
    db.select({ total: sql<number>`count(*)::int` }).from(users),
    db.select({ total: sql<number>`count(*)::int` }).from(users).where(sql`${users.estPro} = true`),
    db
      .select({
        type: paiements.type,
        statut: paiements.statut,
        total: sql<number>`count(*)::int`,
        montant: sql<number>`coalesce(sum(${paiements.montantCents}), 0)::int`,
      })
      .from(paiements)
      .groupBy(paiements.type, paiements.statut),
    db.select({ total: sql<number>`count(*)::int` }).from(recherchesIa),
    db.select().from(recherchesIa).orderBy(desc(recherchesIa.createdAt)).limit(20),
  ]);

  const etatMap = new Map(parEtat.map((r) => [r.etat, r.total]));
  const categorieMap = new Map(parCategorie.map((r) => [r.categorie, r.total]));
  const totalAnnonces = parEtat.reduce((acc, r) => acc + r.total, 0);

  const paiementsParType = new Map<string, { paye: number; montantPaye: number; enAttente: number; echec: number }>();
  for (const ligne of parPaiement) {
    const entree = paiementsParType.get(ligne.type) ?? { paye: 0, montantPaye: 0, enAttente: 0, echec: 0 };
    if (ligne.statut === "paye") {
      entree.paye += ligne.total;
      entree.montantPaye += ligne.montant;
    } else if (ligne.statut === "en_attente") {
      entree.enAttente += ligne.total;
    } else if (ligne.statut === "echec") {
      entree.echec += ligne.total;
    }
    paiementsParType.set(ligne.type, entree);
  }

  const LABELS_TYPE_PAIEMENT: Record<string, string> = {
    modification: "Modification payante",
    urgent: "Annonce urgente",
  };

  return (
    <>
      <SiteHeader />

      <main className="wrap admin-page">
        <h1>Administration LBT</h1>

        <section className="admin-section">
          <h2>Annonces</h2>
          <div className="admin-tiles">
            <div className="admin-tile">
              <strong>{totalAnnonces.toLocaleString("fr-FR")}</strong>
              <span>Annonces (tous statuts)</span>
            </div>
            <div className="admin-tile">
              <strong>{(etatMap.get("en_ligne") ?? 0).toLocaleString("fr-FR")}</strong>
              <span>En ligne</span>
            </div>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Statut</th>
                <th>Annonces</th>
              </tr>
            </thead>
            <tbody>
              {TOUS_ETATS.map((etat) => (
                <tr key={etat}>
                  <td>{libelleEtat(etat)}</td>
                  <td>{(etatMap.get(etat) ?? 0).toLocaleString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Annonces en ligne par catégorie</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Catégorie</th>
                <th>Annonces en ligne</th>
              </tr>
            </thead>
            <tbody>
              {(CATEGORIES as readonly Categorie[]).map((cat) => (
                <tr key={cat}>
                  <td>{getFiltersForCategory(cat).label}</td>
                  <td>{(categorieMap.get(cat) ?? 0).toLocaleString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="admin-section">
          <h2>Comptes</h2>
          <div className="admin-tiles">
            <div className="admin-tile">
              <strong>{totalComptes[0]?.total.toLocaleString("fr-FR") ?? 0}</strong>
              <span>Comptes créés</span>
            </div>
            <div className="admin-tile">
              <strong>{comptesPro[0]?.total.toLocaleString("fr-FR") ?? 0}</strong>
              <span>Comptes pro déclarés</span>
            </div>
          </div>
        </section>

        <section className="admin-section">
          <h2>Options payantes</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Option</th>
                <th>Payées</th>
                <th>Montant encaissé</th>
                <th>En attente</th>
                <th>Échouées</th>
              </tr>
            </thead>
            <tbody>
              {[...paiementsParType.entries()].map(([type, v]) => (
                <tr key={type}>
                  <td>{LABELS_TYPE_PAIEMENT[type] ?? type}</td>
                  <td>{v.paye.toLocaleString("fr-FR")}</td>
                  <td>{formatEuros(v.montantPaye)}</td>
                  <td>{v.enAttente.toLocaleString("fr-FR")}</td>
                  <td>{v.echec.toLocaleString("fr-FR")}</td>
                </tr>
              ))}
              {paiementsParType.size === 0 && (
                <tr>
                  <td colSpan={5}>Aucun paiement enregistré pour l&apos;instant.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="admin-section">
          <h2>Recherche en langage naturel (accueil)</h2>
          <div className="admin-tiles">
            <div className="admin-tile">
              <strong>{totalRecherchesIa[0]?.total.toLocaleString("fr-FR") ?? 0}</strong>
              <span>Recherches IA depuis le lancement</span>
            </div>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Texte saisi</th>
                <th>Filtres extraits</th>
              </tr>
            </thead>
            <tbody>
              {dernieresRecherchesIa.map((r) => (
                <tr key={r.id}>
                  <td>{r.createdAt.toLocaleString("fr-FR")}</td>
                  <td>{r.texte}</td>
                  <td>{JSON.stringify(r.filtresExtraits)}</td>
                </tr>
              ))}
              {dernieresRecherchesIa.length === 0 && (
                <tr>
                  <td colSpan={3}>Aucune recherche IA enregistrée pour l&apos;instant.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="admin-section">
          <h2>Visites du site</h2>
          <p className="admin-non-disponible">
            Non disponible — nécessite Matomo (cahier des charges §8.3), pas encore hébergé/branché.
          </p>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
