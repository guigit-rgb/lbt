"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { MEGA_MENU, AUTRES_ENTRY, DONS_ENTRY, type MegaMenuEntry } from "@/lib/categories";
import type { Categorie } from "@/lib/db/schema";
import { hrefRubriqueMegaMenu, hrefLienMegaMenu } from "@/lib/mega-menu-href";

// "Mes recherches" — icône ligne (pas un emoji comme les autres) : retour de
// Nicolas du 2026-08-22, qui voulait un rendu plus "stylisé" que le pictogramme
// emoji d'origine (⭐ puis ⚙️). `currentColor` reprend la couleur du texte de
// `.icon-link`, donc s'accorde avec le thème sans réglage séparé.
function IconeCloche() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function MegaMenuItem({ entry, activeCategorie }: { entry: MegaMenuEntry; activeCategorie?: Categorie }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  function positionSubmenu() {
    const item = itemRef.current;
    if (!item) return;
    const link = item.querySelector<HTMLElement>(".cat-tile-link");
    const submenu = item.querySelector<HTMLElement>(".submenu");
    if (!link || !submenu) return;
    const rect = link.getBoundingClientRect();
    submenu.style.top = `${rect.bottom}px`;
    if (submenu.classList.contains("mega")) {
      const w = submenu.offsetWidth;
      submenu.style.left = `${Math.max(16, (window.innerWidth - w) / 2)}px`;
    } else {
      submenu.style.left = `${rect.left}px`;
    }
  }

  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest(".cat-item")) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  return (
    <div className={`cat-item${open ? " open" : ""}`} ref={itemRef} onMouseEnter={positionSubmenu}>
      <button
        type="button"
        className={`cat-tile-link${activeCategorie === entry.categorie ? " active" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          positionSubmenu();
          setOpen((prev) => !prev);
        }}
      >
        <span className="ic">{entry.icon}</span>
        <span className="t">{entry.label}</span>
      </button>
      <div className={`submenu mega cols-${Math.min(entry.columns.length, 4)}`}>
        <div className="mega-side">
          <span className="mega-side-label">
            <span className="mega-side-ic">{entry.icon}</span>
            {entry.label}
          </span>
        </div>
        {entry.columns.map((column, colIndex) => (
          <div className="mega-col" key={colIndex}>
            {colIndex === 0 && entry.allLabel && (
              <Link className="mega-all" href={`/${entry.categorie}`}>
                {entry.allLabel}
              </Link>
            )}
            {column.map((group, groupIndex) => (
              <div className="mega-group" key={groupIndex}>
                {group.heading && (
                  <Link href={hrefRubriqueMegaMenu(entry.categorie, group.heading)}>
                    <h4>{group.heading}</h4>
                  </Link>
                )}
                {group.links.length === 1 && !group.heading ? (
                  <Link className="mega-head" href={hrefLienMegaMenu(entry.categorie, group.heading, group.links[0].label)}>
                    {group.links[0].label}
                  </Link>
                ) : (
                  group.links.map((link) => (
                    <Link key={link.label} href={hrefLienMegaMenu(entry.categorie, group.heading, link.label)}>
                      {link.label}
                    </Link>
                  ))
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SiteHeader({ activeCategorie }: { activeCategorie?: Categorie }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const [recherchesCount, setRecherchesCount] = useState(0);

  // Badge "Mes recherches" (nombre de recherches sauvegardées) — SiteHeader
  // est un composant client sur toutes les pages, il ne peut pas lire la
  // base directement, d'où l'aller-retour vers une route dédiée.
  useEffect(() => {
    if (!session) return;
    const controller = new AbortController();
    fetch("/api/compte/recherches/count", { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => setRecherchesCount(data.count ?? 0))
      .catch(() => {});
    return () => controller.abort();
  }, [session]);

  return (
    <div className="site-top">
      <header className="site">
        <div className="wrap nav nav-wrap">
          <Link className="wordmark" href="/">
            <span>lebon</span>
            <span className="truc">truc</span>
          </Link>
          <form className="nav-search" role="search" action="#">
            <input type="search" placeholder="Une Clio, un vinyle, un utilitaire…" aria-label="Rechercher une annonce" />
            <button type="submit" className="nav-search-btn" aria-label="Rechercher">
              ⌕
            </button>
          </form>
          <nav className="nav-actions">
            <Link className="icon-link" href="/compte/messages">
              <span className="glyph">✉️</span>Messages<span className="dot" />
            </Link>
            <Link className="icon-link" href="/compte/favoris">
              <span className="glyph">♡</span>Favoris
            </Link>
            <Link className="icon-link" href="/compte/recherches">
              <span className="glyph glyph-recherches">
                <IconeCloche />
              </span>
              Mes recherches
              {recherchesCount > 0 && <span className="badge-count">{recherchesCount}</span>}
            </Link>
            {session ? (
              <>
                <Link className="icon-link" href="/compte/annonces">
                  <span className="glyph">👤</span>
                  {session.user.name}
                </Link>
                <button type="button" className="icon-link nav-logout" onClick={() => signOut({ callbackUrl: "/" })}>
                  Se déconnecter
                </button>
              </>
            ) : (
              <Link className="icon-link" href="/compte/connexion">
                <span className="glyph">👤</span>Se connecter
              </Link>
            )}
            <Link className="btn btn-accent" href="/compte/annonces/nouvelle">
              <span className="btn-plus">
                <span>+</span>
              </span>
              Déposer une annonce
            </Link>
          </nav>
          <button
            type="button"
            className="nav-burger"
            aria-label="Ouvrir le menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        {mobileMenuOpen && (
          <nav className="nav-mobile-panel" aria-label="Menu">
            <Link className="btn btn-accent" href="/compte/annonces/nouvelle" onClick={() => setMobileMenuOpen(false)}>
              <span className="btn-plus">
                <span>+</span>
              </span>
              Déposer une annonce
            </Link>
            {session ? (
              <>
                <Link className="icon-link" href="/compte/annonces" onClick={() => setMobileMenuOpen(false)}>
                  <span className="glyph">👤</span>
                  {session.user.name}
                </Link>
                <button
                  type="button"
                  className="icon-link nav-logout"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <Link className="icon-link" href="/compte/connexion" onClick={() => setMobileMenuOpen(false)}>
                <span className="glyph">👤</span>Se connecter
              </Link>
            )}
            <Link className="icon-link" href="/compte/messages" onClick={() => setMobileMenuOpen(false)}>
              <span className="glyph">✉️</span>Messages
            </Link>
            <Link className="icon-link" href="/compte/favoris" onClick={() => setMobileMenuOpen(false)}>
              <span className="glyph">♡</span>Favoris
            </Link>
            <Link className="icon-link" href="/compte/recherches" onClick={() => setMobileMenuOpen(false)}>
              <span className="glyph glyph-recherches">
                <IconeCloche />
              </span>
              Mes recherches
              {recherchesCount > 0 && <span className="badge-count">{recherchesCount}</span>}
            </Link>
          </nav>
        )}
      </header>

      <nav className="catband" aria-label="Catégories">
        <div className="wrap">
          {MEGA_MENU.map((entry) => (
            <MegaMenuItem key={entry.categorie} entry={entry} activeCategorie={activeCategorie} />
          ))}
          <Link className="cat-tile-link" href={`/${AUTRES_ENTRY.categorie}`}>
            <span className="ic">{AUTRES_ENTRY.icon}</span>
            <span className="t">{AUTRES_ENTRY.label}</span>
          </Link>
          <Link className="cat-tile-link cat-highlight" href={`/${DONS_ENTRY.categorie}`}>
            <span className="ic">{DONS_ENTRY.icon}</span>
            <span className="t">{DONS_ENTRY.label}</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
