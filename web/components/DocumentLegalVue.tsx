import Link from "next/link";
import { jetons } from "@/lib/legal/balisage";
import { mentionsAFiger } from "@/lib/legal/documents";
import type { Bloc, DocumentLegal, Section } from "@/lib/legal/types";

/** Ancre d'une section : le titre débarrassé de sa numérotation et de ses
 *  accents, pour que `/cgu#signaler-un-contenu` reste lisible dans une barre
 *  d'adresse et citable dans un échange avec un utilisateur. */
export function ancre(titre: string): string {
  return titre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/^\d+\.\s*/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function Texte({ texte }: { texte: string }) {
  return (
    <>
      {jetons(texte).map((j, i) => {
        if (j.type === "gras") return <strong key={i}>{j.valeur}</strong>;
        if (j.type === "afiger")
          return (
            <mark className="legal-afiger" key={i} title="Mention à arrêter avant publication">
              à figer : {j.valeur}
            </mark>
          );
        if (j.type === "lien") {
          return j.href.startsWith("/") ? (
            <Link href={j.href} key={i}>
              {j.valeur}
            </Link>
          ) : (
            <a href={j.href} key={i} rel="noreferrer">
              {j.valeur}
            </a>
          );
        }
        return <span key={i}>{j.valeur}</span>;
      })}
    </>
  );
}

function BlocVue({ bloc }: { bloc: Bloc }) {
  switch (bloc.type) {
    case "paragraphe":
      return (
        <p>
          <Texte texte={bloc.texte} />
        </p>
      );
    case "liste":
      return (
        <ul className="legal-liste">
          {bloc.items.map((item, i) => (
            <li key={i}>
              <Texte texte={item} />
            </li>
          ))}
        </ul>
      );
    case "encadre":
      return (
        <aside className="legal-encadre">
          <h3>{bloc.titre}</h3>
          <p>
            <Texte texte={bloc.texte} />
          </p>
        </aside>
      );
    case "tableau":
      return (
        <div className="legal-tableau-scroll">
          <table className="legal-tableau">
            <thead>
              <tr>
                {bloc.entetes.map((entete, i) => (
                  <th key={i}>{entete}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bloc.lignes.map((ligne, i) => (
                <tr key={i}>
                  {ligne.map((cellule, j) => (
                    <td key={j}>
                      <Texte texte={cellule} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

function SectionVue({ section }: { section: Section }) {
  return (
    <section className="legal-section" id={ancre(section.titre)}>
      <h2>{section.titre}</h2>
      {section.blocs.map((bloc, i) => (
        <BlocVue bloc={bloc} key={i} />
      ))}
    </section>
  );
}

export default function DocumentLegalVue({ doc }: { doc: DocumentLegal }) {
  const aFiger = mentionsAFiger(doc);
  return (
    <article className="legal-page">
      <header className="legal-entete">
        <p className="legal-fil">
          <Link href="/legal">Informations légales</Link> · {doc.titre}
        </p>
        <h1>{doc.titre}</h1>
        <p className="legal-soustitre">{doc.sousTitre}</p>
        <p className="legal-meta">
          Version {doc.version} — {doc.date}
        </p>
        <ul className="legal-fondement">
          {doc.fondement.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </header>

      {aFiger.length > 0 && (
        <div className="legal-projet" role="note">
          <strong>Document en projet — {aFiger.length} mention(s) à arrêter avant publication.</strong>{" "}
          Elles sont surlignées dans le texte. Tant qu&apos;il en reste une, ce document ne peut pas
          être opposé à un utilisateur ni servir de base contractuelle.
        </div>
      )}

      {/* Une liste NON ordonnée, et c'est délibéré : les titres des documents
          portent déjà leur propre numérotation (« 3. Comment les annonces sont
          contrôlées »), qu'un `<ol>` doublerait à l'affichage. */}
      <nav className="legal-sommaire" aria-label="Sommaire">
        <ul>
          {doc.sections.map((s) => (
            <li key={s.titre}>
              <a href={`#${ancre(s.titre)}`}>{s.titre}</a>
            </li>
          ))}
        </ul>
      </nav>

      {doc.sections.map((section) => (
        <SectionVue key={section.titre} section={section} />
      ))}

      <footer className="legal-pied">
        <p>
          Les versions antérieures de ce document restent consultables. Pour toute question :{" "}
          <Link href="/mentions-legales">points de contact</Link>.
        </p>
      </footer>
    </article>
  );
}
