import Link from "next/link";
import { and, desc, eq, inArray, ne, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { annonces, annonceImages, conversations, favoris, messages } from "@/lib/db/schema";
import { getFiltersForCategory } from "@/lib/listing-config";
import { estFinDeVie, libelleEtat } from "@/lib/annonce-display";
import {
  marquerVendueAnnonce,
  mettreEnPauseAnnonce,
  reactiverAnnonce,
  supprimerAnnonce,
} from "@/lib/actions/annonces";

export const dynamic = "force-dynamic";

function formatPrix(prixCents: number | null): string {
  if (prixCents == null) return "Prix sur demande";
  return `${(prixCents / 100).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`;
}

function formatDateCreation(date: Date): string {
  const aujourdHui = new Date();
  const memeJour = date.toDateString() === aujourdHui.toDateString();
  return memeJour ? "Créée aujourd'hui" : `Créée le ${date.toLocaleDateString("fr-FR")}`;
}

function formatExpiration(expiresAt: Date | null): string | null {
  if (!expiresAt) return null;
  const jours = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (jours <= 0) return "Expirée";
  return `Expire dans ${jours} jour${jours > 1 ? "s" : ""}`;
}

function estExpiree(annonce: { expiresAt: Date | null }): boolean {
  return annonce.expiresAt != null && annonce.expiresAt.getTime() <= Date.now();
}

export default async function MesAnnoncesPage({
  searchParams,
}: {
  searchParams: Promise<{ onglet?: string; q?: string }>;
}) {
  const session = await auth();

  // Le proxy protège déjà cette route, mais une Server Function/page ne doit
  // jamais s'y fier seule — revérification explicite (règle Next.js 16).
  if (!session) {
    redirect("/compte/connexion");
  }

  const { onglet: ongletBrut, q } = await searchParams;
  const onglet =
    ongletBrut === "expirees" ? "expirees" : ongletBrut === "cloturees" ? "cloturees" : "en_ligne";
  const recherche = q?.trim().toLowerCase() ?? "";

  const toutes = await db
    .select()
    .from(annonces)
    .where(eq(annonces.userId, session.user.id))
    .orderBy(desc(annonces.createdAt));

  const actives = toutes.filter((a) => a.etat === "en_ligne" || a.etat === "en_pause");
  const enLigne = actives.filter((a) => !estExpiree(a));
  const expirees = actives.filter((a) => estExpiree(a));
  // Troisième onglet : sans lui, une annonce marquée vendue ou retirée
  // disparaîtrait des deux listes sans aucune confirmation pour son auteur.
  const cloturees = toutes.filter((a) => estFinDeVie(a.etat));

  const listeOnglet =
    onglet === "expirees" ? expirees : onglet === "cloturees" ? cloturees : enLigne;
  const annoncesOnglet = listeOnglet.filter(
    (a) => !recherche || a.titre.toLowerCase().includes(recherche)
  );

  const ids = annoncesOnglet.map((a) => a.id);

  const [vignettes, favorisParAnnonce, messagesParAnnonce] = ids.length
    ? await Promise.all([
        db
          .select({ annonceId: annonceImages.annonceId, url: annonceImages.urlThumb })
          .from(annonceImages)
          .where(and(inArray(annonceImages.annonceId, ids), eq(annonceImages.position, 0))),
        db
          .select({ annonceId: favoris.annonceId, n: sql<number>`count(*)::int` })
          .from(favoris)
          .where(inArray(favoris.annonceId, ids))
          .groupBy(favoris.annonceId),
        db
          .select({ annonceId: conversations.annonceId, n: sql<number>`count(*)::int` })
          .from(messages)
          .innerJoin(conversations, eq(messages.conversationId, conversations.id))
          .where(and(inArray(conversations.annonceId, ids), ne(messages.senderId, session.user.id)))
          .groupBy(conversations.annonceId),
      ])
    : [[], [], []];

  const vignetteParAnnonce = new Map(vignettes.map((v) => [v.annonceId, v.url]));
  const favorisMap = new Map(favorisParAnnonce.map((f) => [f.annonceId, f.n]));
  const messagesMap = new Map(messagesParAnnonce.map((m) => [m.annonceId, m.n]));

  return (
    <>
      <SiteHeader />

      <main className="wrap">
        <div className="ma-header">
          <h1>Mes annonces</h1>
          <Link href="/compte/annonces/nouvelle" className="btn btn-accent">
            <span className="btn-plus"><span>+</span></span> Déposer une annonce
          </Link>
        </div>

        <nav className="ma-tabs">
          <Link href="/compte/annonces?onglet=en_ligne" className={`ma-tab${onglet === "en_ligne" ? " active" : ""}`}>
            En ligne ({enLigne.length})
          </Link>
          <Link href="/compte/annonces?onglet=expirees" className={`ma-tab${onglet === "expirees" ? " active" : ""}`}>
            Expirées ({expirees.length})
          </Link>
          <Link href="/compte/annonces?onglet=cloturees" className={`ma-tab${onglet === "cloturees" ? " active" : ""}`}>
            Clôturées ({cloturees.length})
          </Link>
        </nav>

        <form className="ma-toolbar" action="/compte/annonces">
          <input type="hidden" name="onglet" value={onglet} />
          <label className="ma-search">
            🔎 <input type="text" name="q" defaultValue={q ?? ""} placeholder="Rechercher dans vos annonces" />
          </label>
          <button type="submit" className="btn btn-outline">Rechercher</button>
        </form>

        {annoncesOnglet.length === 0 ? (
          <p className="ma-empty">
            {recherche
              ? "Aucune annonce ne correspond à votre recherche."
              : onglet === "expirees"
                ? "Vous n'avez aucune annonce expirée."
                : onglet === "cloturees"
                  ? "Vous n'avez aucune annonce clôturée."
                  : "Vous n'avez pas encore d'annonce en ligne."}
          </p>
        ) : (
          <ul className="ma-list">
            {annoncesOnglet.map((annonce) => {
              const vignette = vignetteParAnnonce.get(annonce.id);
              const expiree = onglet === "expirees";
              const badgeClass = expiree ? "expiree" : annonce.etat;
              const badgeLabel = expiree ? "Expirée" : libelleEtat(annonce.etat);
              const config = getFiltersForCategory(annonce.categorie);

              return (
                <li key={annonce.id} className="ma-card">
                  <div className="ma-thumb">
                    {vignette ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={vignette} alt={annonce.titre} />
                    ) : (
                      config.label
                    )}
                  </div>

                  <div className="ma-body">
                    <span className={`ma-badge ${badgeClass}`}>{badgeLabel}</span>
                    <Link href={`/annonces/${annonce.id}`} className="ma-title">
                      {annonce.titre}
                    </Link>
                    <div className="ma-price">{formatPrix(annonce.prixCents)}</div>
                    <div className="ma-meta">
                      {config.label} · {formatDateCreation(annonce.createdAt)}
                      {formatExpiration(annonce.expiresAt) && ` · ${formatExpiration(annonce.expiresAt)}`}
                    </div>

                    <div className="ma-actions">
                      {!estFinDeVie(annonce.etat) && (
                        <Link href={`/compte/annonces/${annonce.id}/modifier`} className="btn btn-outline">
                          Modifier
                        </Link>
                      )}
                      {/* « C'est vendu » est l'action PRIMAIRE, « Retirer »
                          l'action secondaire : c'est la forme retenue chez
                          FINN.no (même groupe d'origine que leboncoin) et la
                          décision du §6.6, Résultat n°1. Marquer vendu sert
                          d'abord le vendeur — cela arrête les appels — et c'est
                          ce qui rend la donnée de clôture exploitable, là où un
                          questionnaire greffé sur « Supprimer » ne récolte
                          rien. */}
                      {/* Volontairement proposé aussi sur l'onglet « Expirées » :
                          une annonce arrivée à échéance est justement celle dont
                          la §6.6 (R5) ne saura rien si le vendeur n'a aucun
                          moyen de déclarer la vente. */}
                      {(annonce.etat === "en_ligne" || annonce.etat === "en_pause") && (
                        <form action={marquerVendueAnnonce.bind(null, annonce.id)}>
                          <button type="submit" className="btn btn-accent">C&rsquo;est vendu</button>
                        </form>
                      )}
                      {!expiree && annonce.etat === "en_ligne" && (
                        <form action={mettreEnPauseAnnonce.bind(null, annonce.id)}>
                          <button type="submit" className="btn btn-ghost">Mettre en pause</button>
                        </form>
                      )}
                      {annonce.etat === "en_pause" && (
                        <form action={reactiverAnnonce.bind(null, annonce.id)}>
                          <button type="submit" className="btn btn-ghost">Réactiver</button>
                        </form>
                      )}
                      {!estFinDeVie(annonce.etat) && (
                        <form action={supprimerAnnonce.bind(null, annonce.id)}>
                          <button type="submit" className="btn btn-ghost">Retirer l&rsquo;annonce</button>
                        </form>
                      )}
                    </div>
                  </div>

                  <div className="ma-stats">
                    <div className="ma-stat">
                      <strong>{annonce.vues}</strong>vues
                    </div>
                    <div className="ma-stat">
                      <strong>{favorisMap.get(annonce.id) ?? 0}</strong>favoris
                    </div>
                    <div className="ma-stat">
                      <strong>{messagesMap.get(annonce.id) ?? 0}</strong>messages
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
