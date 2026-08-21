import Link from "next/link";

export type AuthOnglet = "connexion" | "inscription";

// Coquille commune aux écrans d'identification : bandeau minimal (pas
// l'en-tête complet du site — on ne propose pas de repartir naviguer au milieu
// d'une connexion), carte centrée, bascule Connexion/Inscription.
export default function AuthCard({
  onglet,
  titre,
  lede,
  next,
  children,
}: {
  onglet: AuthOnglet;
  titre: string;
  lede: string;
  // Destination de retour, déjà validée par `destinationInterne` : reconduite
  // d'un onglet à l'autre pour ne pas la perdre si l'utilisateur passe de
  // « Connexion » à « Inscription ».
  next?: string;
  children: React.ReactNode;
}) {
  const suffixe = next ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <div className="auth-page">
      <div className="auth-top">
        <div className="auth-top-inner">
          <Link className="auth-back" href="/" aria-label="Revenir à l'accueil">
            ←
          </Link>
          <Link className="wordmark" href="/">
            <span>lebon</span>
            <span className="truc">truc</span>
          </Link>
        </div>
      </div>

      <main className="auth-body">
        <div className="auth-card">
          <h1>{titre}</h1>
          <p className="auth-lede">{lede}</p>

          <nav className="auth-tabs" aria-label="Connexion ou inscription">
            <Link
              className={`auth-tab${onglet === "connexion" ? " active" : ""}`}
              href={`/compte/connexion${suffixe}`}
              aria-current={onglet === "connexion" ? "page" : undefined}
            >
              Connexion
            </Link>
            <Link
              className={`auth-tab${onglet === "inscription" ? " active" : ""}`}
              href={`/compte/inscription${suffixe}`}
              aria-current={onglet === "inscription" ? "page" : undefined}
            >
              Inscription
            </Link>
          </nav>

          {children}
        </div>
      </main>
    </div>
  );
}
