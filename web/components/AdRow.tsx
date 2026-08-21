import Link from "next/link";
import type { AdRowData } from "@/lib/annonce-display";
import { FavoriButton } from "@/components/FavoriButton";

export default function AdRow({ ad, href }: { ad: AdRowData; href: string }) {
  return (
    <Link href={href} className="ad-row">
      <div className={`ad-row-thumb${ad.photoUrl ? "" : ` ${ad.thumbClass}`}`}>
        {ad.photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ad.photoUrl} alt="" />
        )}
        <FavoriButton annonceId={ad.id} initialFavori={ad.estFavori} className="ad-row-fav" />
      </div>

      <div className="ad-row-body">
        <div className="ad-row-top">
          <h3 className="ad-row-title">{ad.titre}</h3>
          <span className="ad-row-fresh">{ad.fraicheur}</span>
        </div>

        <p className="ad-row-price">{ad.prixLabel}</p>

        {ad.specs.length > 0 && (
          <div className="ad-row-specs">
            {ad.specs.map((spec) => (
              <div key={spec.label}>
                <span className="ad-row-spec-label">{spec.label}</span>
                <span className="ad-row-spec-value">{spec.value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="ad-row-seller">
          <span>{ad.vendeurNom}</span>
          {ad.ville && <span>{ad.ville}</span>}
        </div>
      </div>
    </Link>
  );
}
