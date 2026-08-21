import Link from "next/link";
import type { FakeAd } from "@/lib/fake-data";

interface AdCardProps {
  ad: FakeAd;
  showSeller?: boolean;
  href?: string;
}

export default function AdCard({ ad, showSeller = false, href }: AdCardProps) {
  const content = (
    <>
      {showSeller && ad.vendeur && (
        <div className="card-seller">
          <span className="avatar" style={{ background: ad.vendeur.couleur }}>
            {ad.vendeur.initiale}
          </span>
          <span className="name">{ad.vendeur.nom}</span>
        </div>
      )}
      <div className={`thumb${ad.photoUrl ? "" : ` ${ad.thumbClass}`}`}>
        {ad.photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ad.photoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
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
    </>
  );

  if (href) {
    return (
      <Link href={href} className="card">
        {content}
      </Link>
    );
  }

  return <article className="card">{content}</article>;
}
