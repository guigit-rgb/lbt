"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MEGA_MENU, AUTRES_ENTRY, DONS_ENTRY, type MegaMenuEntry } from "@/lib/categories";
import type { Categorie } from "@/lib/db/schema";

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
      <div className="submenu mega">
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
                {group.heading && <h4>{group.heading}</h4>}
                {group.links.length === 1 && !group.heading ? (
                  <Link className="mega-head" href={`/${entry.categorie}`}>
                    {group.links[0].label}
                  </Link>
                ) : (
                  group.links.map((link) => (
                    <Link key={link.label} href={`/${entry.categorie}`}>
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
            <Link className="icon-link" href="#">
              <span className="glyph">♡</span>Favoris
            </Link>
            <Link className="icon-link" href="#">
              <span className="glyph">☆</span>Mes recherches
            </Link>
            <Link className="icon-link" href="/compte/connexion">
              <span className="glyph">👤</span>Se connecter
            </Link>
            <Link className="btn btn-accent" href="/compte/annonces/nouvelle">
              <span className="btn-plus">
                <span>+</span>
              </span>
              Déposer une annonce
            </Link>
          </nav>
        </div>
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
