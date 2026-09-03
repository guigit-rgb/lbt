import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { DOCUMENTS_LEGAUX, mentionsAFiger, totalMentionsAFiger } from "@/lib/legal/documents";

export const metadata: Metadata = {
  title: "Informations légales — lebontruc.fr",
  description:
    "Mentions légales, conditions générales, politique de confidentialité, traceurs, classement des annonces et conditions professionnelles.",
};

export default function Page() {
  const aFiger = totalMentionsAFiger();
  return (
    <>
      <SiteHeader />
      <main className="wrap legal-main">
        <article className="legal-page">
          <header className="legal-entete">
            <h1>Informations légales</h1>
            <p className="legal-soustitre">
              Sept documents, chacun versionné et daté. Les versions antérieures restent
              consultables.
            </p>
          </header>

          {aFiger > 0 && (
            <div className="legal-projet" role="note">
              <strong>
                {aFiger} mention(s) restent à arrêter avant l&apos;ouverture du service.
              </strong>{" "}
              Elles concernent l&apos;identité de la société, les prestataires d&apos;infrastructure
              et les adresses de contact — aucune ne peut être décidée par la seule lecture du
              dépôt. Tant qu&apos;il en reste, ces documents sont des projets.
            </div>
          )}

          <ul className="legal-index">
            {DOCUMENTS_LEGAUX.map((doc) => {
              const restantes = mentionsAFiger(doc).length;
              return (
                <li key={doc.id}>
                  <Link className="legal-index-titre" href={doc.chemin}>
                    {doc.titre}
                  </Link>
                  <p className="legal-index-soustitre">{doc.sousTitre}</p>
                  <p className="legal-index-meta">
                    Version {doc.version} — {doc.date}
                    {restantes > 0 ? ` · ${restantes} mention(s) à figer` : " · prêt à publier"}
                  </p>
                  <ul className="legal-index-fondement">
                    {doc.fondement.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
