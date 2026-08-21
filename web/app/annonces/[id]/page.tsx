import Link from "next/link";
import { asc, eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AdCard from "@/components/AdCard";
import AdGallery from "@/components/AdGallery";
import { ContactVendeurForm } from "@/components/ContactVendeurForm";
import { RevealPhoneButton } from "@/components/RevealPhoneButton";
import { db } from "@/lib/db/client";
import { annonces, annonceImages, users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { getFiltersForCategory } from "@/lib/listing-config";
import { libelleEtat, formatPrix, detailInformationsCles, getAutresAnnoncesVendeur } from "@/lib/annonce-display";
import { AnnonceFeedbackGate } from "./AnnonceFeedbackGate";

export const dynamic = "force-dynamic";

export default async function AnnonceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ nouveau?: string }>;
}) {
  const { id } = await params;
  const { nouveau } = await searchParams;
  const session = await auth();

  const [row] = await db
    .select({
      annonce: annonces,
      vendeurNom: users.displayName,
      vendeurEstPro: users.estPro,
      vendeurSiret: users.siret,
      vendeurTelephone: users.telephone,
    })
    .from(annonces)
    .innerJoin(users, eq(annonces.userId, users.id))
    .where(eq(annonces.id, id))
    .limit(1);

  if (!row) {
    notFound();
  }

  const isOwner = session?.user.id === row.annonce.userId;
  if (row.annonce.etat !== "en_ligne" && !isOwner) {
    notFound();
  }

  if (!isOwner) {
    // Comptage des vues pour le vendeur — on n'incrémente pas ses propres
    // consultations pour ne pas gonfler artificiellement le compteur affiché
    // sur "Mes annonces".
    await db
      .update(annonces)
      .set({ vues: sql`${annonces.vues} + 1` })
      .where(eq(annonces.id, id));
  }

  const [photos, autresAnnonces] = await Promise.all([
    db
      .select({ id: annonceImages.id, url: annonceImages.urlThumb })
      .from(annonceImages)
      .where(eq(annonceImages.annonceId, id))
      .orderBy(asc(annonceImages.position)),
    getAutresAnnoncesVendeur(row.annonce.userId, id),
  ]);

  const config = getFiltersForCategory(row.annonce.categorie);
  const specs = detailInformationsCles(row.annonce);

  return (
    <>
      <SiteHeader activeCategorie={row.annonce.categorie} />

      <main className="wrap ad-detail">
        <p className="ad-detail-crumb">
          <Link href="/">Accueil</Link> › <Link href={`/${row.annonce.categorie}`}>{config.label}</Link>
          {row.annonce.etat !== "en_ligne" && (
            <strong className="ad-detail-etat">
              (annonce {libelleEtat(row.annonce.etat)} — visible uniquement par vous)
            </strong>
          )}
        </p>

        <div className="ad-detail-grid">
          <div className="ad-detail-main">
            <AdGallery photos={photos} alt={row.annonce.titre} />

            {specs.length > 0 && (
              <section className="ad-detail-block">
                <h2>Les informations clés</h2>
                <div className="ad-detail-specs">
                  {specs.map((spec) => (
                    <div key={spec.label} className="ad-detail-spec">
                      <span className="ad-detail-spec-icon" aria-hidden="true">
                        {spec.icon}
                      </span>
                      <span>
                        <span className="ad-detail-spec-label">{spec.label}</span>
                        <span className="ad-detail-spec-value">{spec.value}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="ad-detail-block">
              <h2>Description</h2>
              <p className="ad-detail-desc">{row.annonce.description}</p>
            </section>

            {row.annonce.ville && (
              <section className="ad-detail-block">
                <h2>Localisation</h2>
                <p className="ad-detail-loc">
                  {row.annonce.ville} {row.annonce.codePostal ? `(${row.annonce.codePostal})` : ""}
                </p>
              </section>
            )}
          </div>

          <aside className="ad-detail-side">
            <div className="ad-detail-price-card">
              <p className="ad-detail-price">{formatPrix(row.annonce.prixCents)}</p>
              <h1 className="ad-detail-title">{row.annonce.titre}</h1>
              {row.annonce.ville && <p className="ad-detail-side-loc">{row.annonce.ville}</p>}

              {!isOwner && row.vendeurTelephone && (
                <div className="ad-detail-phone">
                  <RevealPhoneButton telephone={row.vendeurTelephone} />
                </div>
              )}

              {!isOwner &&
                (session ? (
                  <ContactVendeurForm annonceId={row.annonce.id} />
                ) : (
                  <Link href="/compte/connexion" className="btn btn-accent ad-detail-contact-login">
                    Se connecter pour envoyer un message
                  </Link>
                ))}
            </div>

            <div className="ad-detail-seller-card">
              <h2>Vendeur</h2>
              <Link href={`/vendeurs/${row.annonce.userId}`} className="ad-detail-seller-name">
                {row.vendeurNom}
                {row.vendeurEstPro && <span className="ad-detail-pro-badge">Pro</span>}
              </Link>
              {row.vendeurEstPro && row.vendeurSiret && (
                <p className="ad-detail-siret">N° SIRET : {row.vendeurSiret}</p>
              )}

              {autresAnnonces.length > 0 && (
                <div className="ad-detail-seller-ads">
                  <div className="ad-detail-seller-ads-head">
                    <h3>Autres annonces de {row.vendeurNom}</h3>
                    <Link href={`/vendeurs/${row.annonce.userId}`}>Tout voir</Link>
                  </div>
                  <div className="ad-detail-seller-ads-list">
                    {autresAnnonces.map((ad) => (
                      <AdCard key={ad.id} ad={ad} href={`/annonces/${ad.id}`} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      {nouveau === "1" && isOwner && <AnnonceFeedbackGate />}

      <SiteFooter />
    </>
  );
}
