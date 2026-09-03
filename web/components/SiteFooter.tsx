import Link from "next/link";
import { DOCUMENTS_LEGAUX } from "@/lib/legal/documents";

/**
 * Les liens légaux du pied de page ne sont pas une convention de mise en
 * page. Le décret n° 2017-1434 du 29 septembre 2017 exige que les modalités de
 * classement figurent dans « une rubrique spécifique directement et aisément
 * accessible **depuis toutes les pages du site** » (§8.2, Résultat n°1), et
 * c'est l'une des rares obligations du dossier dont un contrôleur constate le
 * manquement en ouvrant le site, sans rien demander à personne.
 *
 * Ils sont donc rendus depuis le registre `DOCUMENTS_LEGAUX` et non écrits à la
 * main : ajouter un document met à jour le pied de page, et
 * `scripts/verif-pages-legales.ts` vérifie qu'aucun lien légal n'est resté à
 * `href="#"`.
 */
export default function SiteFooter() {
  const legaux = DOCUMENTS_LEGAUX.filter((d) => d.piedDePage);
  return (
    <footer className="site">
      <div className="wrap foot-cols">
        <div className="foot-col">
          <h3>Découvrir</h3>
          <ul>
            <li>
              <a href="#">Comment ça marche</a>
            </li>
            <li>
              <a href="#">Application mobile</a>
            </li>
            <li>
              <a href="#">Toutes les catégories</a>
            </li>
            <li>
              <a href="#">Devenir vendeur pro</a>
            </li>
          </ul>
        </div>
        <div className="foot-col">
          <h3>L&apos;entreprise</h3>
          <ul>
            <li>
              <a href="#">Qui sommes-nous</a>
            </li>
            <li>
              <a href="#">Nous recrutons</a>
            </li>
            <li>
              <a href="#">Espace presse</a>
            </li>
          </ul>
        </div>
        <div className="foot-col">
          <h3>Aide &amp; sécurité</h3>
          <ul>
            <li>
              <a href="#">Centre d&apos;aide</a>
            </li>
            <li>
              <a href="#">Conseils sécurité</a>
            </li>
            <li>
              <a href="#">Signaler un contenu</a>
            </li>
            <li>
              <Link href="/droits-et-obligations">Acheter à un pro ou à un particulier</Link>
            </li>
          </ul>
        </div>
        <div className="foot-col">
          <h3>Nous suivre</h3>
          <ul>
            <li>
              <a href="#">Facebook</a>
            </li>
            <li>
              <a href="#">Instagram</a>
            </li>
            <li>
              <a href="#">LinkedIn</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap foot-row">
        <span>lebontruc.fr — SASU Courlis · France entière</span>
        <div className="foot-legal">
          {legaux.map((doc) => (
            <Link href={doc.chemin} key={doc.id}>
              {LIBELLES_COURTS[doc.id] ?? doc.titre}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

/** Le pied de page n'a pas la place des titres complets. Les libellés courts
 *  restent explicites — « Classement des annonces » et non « Classement »,
 *  parce que c'est le seul lien du lot dont la loi exige l'accessibilité depuis
 *  toutes les pages et qu'un intitulé énigmatique n'y satisferait pas. */
const LIBELLES_COURTS: Record<string, string> = {
  "mentions-legales": "Mentions légales",
  cgu: "CGU",
  confidentialite: "Confidentialité",
  cookies: "Traceurs",
  classement: "Classement des annonces",
  "droits-et-obligations": "Droits et obligations",
  "cgv-pro": "CGV professionnels",
};
