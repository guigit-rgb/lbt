export default function SiteFooter() {
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
          <a href="#">CGU</a>
          <a href="#">Confidentialité</a>
          <a href="#">Cookies</a>
          <a href="#">Mentions légales</a>
        </div>
      </div>
    </footer>
  );
}
