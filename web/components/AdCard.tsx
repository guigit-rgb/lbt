import type { FakeAd } from "@/lib/fake-data";

interface AdCardProps {
  ad: FakeAd;
  showSeller?: boolean;
}

export default function AdCard({ ad, showSeller = false }: AdCardProps) {
  return (
    <article className="card">
      {showSeller && ad.vendeur && (
        <div className="card-seller">
          <span className="avatar" style={{ background: ad.vendeur.couleur }}>
            {ad.vendeur.initiale}
          </span>
          <span className="name">{ad.vendeur.nom}</span>
        </div>
      )}
      <div className={`thumb ${ad.thumbClass}`}>
        {ad.badges?.map((badge) => (
          <span key={badge.label} className={`badge${badge.variant ? ` ${badge.variant}` : ""}`}>
            {badge.label}
          </span>
        ))}
        <span className={`fav${ad.favori ? " on" : ""}`}>{ad.favori ? "♥" : "♡"}</span>
      </div>
      <div className="body">
        <div className="price-row">
          <span className="price">{ad.prixLabel}</span>
          <span className="fresh">{ad.fraicheur}</span>
        </div>
        <div className="title">{ad.titre}</div>
        <div className="sub">{ad.sousLigne}</div>
      </div>
    </article>
  );
}
