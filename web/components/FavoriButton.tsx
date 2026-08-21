"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { basculerFavori } from "@/lib/actions/favoris";
import { envoyerNotificationInteret } from "@/lib/actions/messages";

// Le popup de confirmation est rendu dans un portail plutôt qu'ancré au
// cœur cliqué : les cartes (`.card`, `.ad-row-thumb`) ont un `overflow:
// hidden` qui le découperait sinon, et une grille de plusieurs dizaines de
// cartes n'a pas besoin d'un popup différent par carte.
export function FavoriButton({
  annonceId,
  initialFavori,
  className,
}: {
  annonceId: string;
  initialFavori: boolean;
  className: string;
}) {
  const router = useRouter();
  const [favori, setFavori] = useState(initialFavori);
  const [showPopup, setShowPopup] = useState(false);
  const [notifState, setNotifState] = useState<"idle" | "envoi" | "ok" | "erreur">("idle");
  const [pending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      const res = await basculerFavori(annonceId);
      if ("error" in res) {
        if (res.error.includes("connecté")) router.push("/compte/connexion");
        return;
      }
      setFavori(res.favori);
      if (res.favori) {
        setNotifState("idle");
        setShowPopup(true);
      }
    });
  }

  async function envoyerNotification() {
    setNotifState("envoi");
    const res = await envoyerNotificationInteret(annonceId);
    setNotifState("error" in res ? "erreur" : "ok");
  }

  return (
    <>
      <button
        type="button"
        className={`${className}${favori ? " on" : ""}`}
        onClick={handleClick}
        disabled={pending}
        aria-label={favori ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        {favori ? "♥" : "♡"}
      </button>

      {showPopup &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="favori-popup" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="favori-popup-close"
              onClick={() => setShowPopup(false)}
              aria-label="Fermer"
            >
              ✕
            </button>
            {notifState === "ok" ? (
              <p className="favori-popup-title">Notification envoyée au vendeur.</p>
            ) : (
              <>
                <p className="favori-popup-title">Annonce ajoutée aux favoris !</p>
                <p className="favori-popup-text">
                  N&apos;hésitez pas à notifier le vendeur pour lui montrer votre intérêt.
                </p>
                <button
                  type="button"
                  className="btn btn-accent favori-popup-btn"
                  onClick={envoyerNotification}
                  disabled={notifState === "envoi"}
                >
                  {notifState === "envoi" ? "Envoi…" : "Envoyer une notification"}
                </button>
              </>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
