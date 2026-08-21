import { asc, eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { db } from "@/lib/db/client";
import { annonces, annonceImages, users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { getFiltersForCategory } from "@/lib/listing-config";
import { libelleEtat } from "@/lib/annonce-display";
import { AnnonceFeedbackGate } from "./AnnonceFeedbackGate";

export const dynamic = "force-dynamic";

function formatPrix(prixCents: number | null): string {
  if (prixCents == null) return "Prix sur demande";
  return `${(prixCents / 100).toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`;
}

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
    .select({ annonce: annonces, vendeurNom: users.displayName })
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

  const photos = await db
    .select({ id: annonceImages.id, url: annonceImages.urlThumb })
    .from(annonceImages)
    .where(eq(annonceImages.annonceId, id))
    .orderBy(asc(annonceImages.position));

  const config = getFiltersForCategory(row.annonce.categorie);
  const details: { label: string; value: string }[] = [];
  if (row.annonce.categorie === "vehicules") {
    if (row.annonce.marque) details.push({ label: "Marque", value: row.annonce.marque });
    if (row.annonce.modele) details.push({ label: "Modèle", value: row.annonce.modele });
    if (row.annonce.annee) details.push({ label: "Année", value: String(row.annonce.annee) });
    if (row.annonce.kilometrage != null)
      details.push({ label: "Kilométrage", value: `${row.annonce.kilometrage.toLocaleString("fr-FR")} km` });
    const attributs = row.annonce.attributs as Record<string, string>;
    if (attributs.carburant) details.push({ label: "Carburant", value: attributs.carburant });
    if (attributs.boite) details.push({ label: "Boîte", value: attributs.boite });
  } else if (row.annonce.categorie === "loisirs") {
    if (row.annonce.sousCategorie) details.push({ label: "Catégorie", value: row.annonce.sousCategorie });
    if (row.annonce.etatProduit) details.push({ label: "État", value: row.annonce.etatProduit });
  } else if (row.annonce.categorie === "animaux") {
    if (row.annonce.typeAnimal) details.push({ label: "Type d'animal", value: row.annonce.typeAnimal });
  }

  return (
    <>
      <SiteHeader activeCategorie={row.annonce.categorie} />

      <main style={{ maxWidth: 720, margin: "2.5rem auto", padding: "0 1rem" }}>
        <p style={{ color: "var(--muted)", marginBottom: "0.5rem" }}>
          {config.label}
          {row.annonce.etat !== "en_ligne" && (
            <strong style={{ marginLeft: "0.5rem" }}>
              (annonce {libelleEtat(row.annonce.etat)} — visible uniquement par vous)
            </strong>
          )}
        </p>

        {photos.length > 0 && (
          <div style={{ marginBottom: "1.25rem" }}>
            <div
              style={{
                aspectRatio: "4/3",
                borderRadius: 10,
                overflow: "hidden",
                background: "var(--surface-2)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photos[0].url ?? undefined}
                alt={row.annonce.titre}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            {photos.length > 1 && (
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                {photos.slice(1).map((p) => (
                  <div
                    key={p.id}
                    style={{
                      width: 90,
                      height: 68,
                      borderRadius: 6,
                      overflow: "hidden",
                      background: "var(--surface-2)",
                      flexShrink: 0,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.url ?? undefined}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <h1 style={{ marginBottom: "0.25rem" }}>{row.annonce.titre}</h1>
        <p style={{ fontSize: "1.4rem", fontWeight: 700 }}>{formatPrix(row.annonce.prixCents)}</p>
        <p style={{ color: "var(--muted)" }}>
          {row.annonce.ville} ({row.annonce.codePostal})
        </p>

        {details.length > 0 && (
          <dl style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem 1rem", margin: "1.25rem 0" }}>
            {details.map((d) => (
              <div key={d.label} style={{ display: "contents" }}>
                <dt style={{ color: "var(--muted)" }}>{d.label}</dt>
                <dd>{d.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <h2 style={{ fontSize: "1.05rem", marginTop: "1.5rem" }}>Description</h2>
        <p style={{ whiteSpace: "pre-wrap" }}>{row.annonce.description}</p>

        <h2 style={{ fontSize: "1.05rem", marginTop: "1.5rem" }}>Vendeur</h2>
        <p>{row.vendeurNom}</p>
      </main>

      {nouveau === "1" && isOwner && <AnnonceFeedbackGate />}

      <SiteFooter />
    </>
  );
}
