"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import type { Suggestion } from "@/lib/suggestions-recherche";
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

// Barre de suggestions à la frappe (§14.10, action §17 n°222). Volontairement
// écrite à la main plutôt qu'avec `<datalist>` ou une bibliothèque de
// combobox : chaque ligne porte une **URL filtrée** (`/vehicules?marque=…`) et
// non un simple texte à réinjecter dans le champ, ce qui est tout l'intérêt du
// dispositif — `<datalist>` ne sait rendre que du texte.
//
// Le formulaire reste un GET vers /recherche, inchangé : sans JavaScript, la
// barre n'apparaît pas et la recherche continue de fonctionner.
function BarreSuggestions({ valeurInitiale }: { valeurInitiale: string }) {
  const router = useRouter();
  const [saisie, setSaisie] = useState(valeurInitiale);
  const [derniereListe, setDerniereListe] = useState<Suggestion[]>([]);
  const [ouvert, setOuvert] = useState(false);
  const [actif, setActif] = useState(-1);
  const conteneur = useRef<HTMLDivElement>(null);

  // La liste affichée est **dérivée** de la saisie, pas remise à zéro dans
  // l'effet : `react-hooks/set-state-in-effect` interdit (à raison) un
  // `setState` synchrone dans un effet, qui provoquerait un rendu en cascade à
  // chaque frappe. Effet de bord recherché au passage : entre deux frappes, la
  // liste précédente reste affichée pendant les 160 ms de débounce au lieu de
  // disparaître et revenir — c'est le comportement attendu d'une barre de
  // suggestions, et il est ici obtenu gratuitement.
  const terme = saisie.trim();
  const suggestions = terme.length >= 2 ? derniereListe : [];

  // Débounce 160 ms + annulation de la requête précédente. La route est servie
  // depuis la mémoire du processus (aucune base), donc le débounce n'est pas là
  // pour protéger un backend mais pour éviter que la liste ne clignote à chaque
  // frappe.
  useEffect(() => {
    const terme = saisie.trim();
    if (terme.length < 2) return;
    const controller = new AbortController();
    const minuteur = setTimeout(() => {
      fetch(`/api/recherche/suggestions?q=${encodeURIComponent(terme)}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((data) => {
          setDerniereListe(data.suggestions ?? []);
          setActif(-1);
        })
        .catch(() => {});
    }, 160);
    return () => {
      clearTimeout(minuteur);
      controller.abort();
    };
  }, [saisie]);

  // Fermeture au clic extérieur. Pas `onBlur` : un clic sur une suggestion
  // provoque un blur du champ AVANT le clic, et la liste disparaîtrait sous le
  // curseur.
  useEffect(() => {
    function auClic(e: MouseEvent) {
      if (!conteneur.current?.contains(e.target as Node)) setOuvert(false);
    }
    document.addEventListener("mousedown", auClic);
    return () => document.removeEventListener("mousedown", auClic);
  }, []);

  const visibles = ouvert && suggestions.length > 0;

  function auClavier(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOuvert(false);
      return;
    }
    if (!visibles) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const pas = e.key === "ArrowDown" ? 1 : -1;
      // `actif` vaut -1 quand rien n'est sélectionné, d'où le décalage de 1 :
      // le cycle porte sur `suggestions.length + 1` états et repasse par
      // « rien de sélectionné » entre le dernier et le premier — sans quoi on
      // ne peut plus revenir à sa propre saisie une fois entré dans la liste.
      setActif((i) => ((i + 1 + pas + suggestions.length + 1) % (suggestions.length + 1)) - 1);
      return;
    }
    // `suggestions[actif]` peut être absent : la liste rétrécit entre deux
    // frappes sans que `actif` en soit averti. Sans cette garde, Entrée sur une
    // sélection devenue hors bornes lèverait une exception au lieu de soumettre
    // le formulaire.
    const choisie = actif >= 0 ? suggestions[actif] : undefined;
    if (e.key === "Enter" && choisie) {
      // Une suggestion est sélectionnée au clavier : on suit son URL filtrée
      // au lieu de soumettre le formulaire, qui enverrait la chaîne brute.
      e.preventDefault();
      setOuvert(false);
      router.push(choisie.href);
    }
  }

  return (
    <div className="nav-search-wrap" ref={conteneur}>
      <form className="nav-search" role="search" action="/recherche" method="get">
        <input
          type="search"
          name="q"
          value={saisie}
          onChange={(e) => {
            setSaisie(e.target.value);
            setOuvert(true);
          }}
          onFocus={() => setOuvert(true)}
          onKeyDown={auClavier}
          placeholder="Une Clio, un vinyle, un utilitaire…"
          aria-label="Rechercher une annonce"
          role="combobox"
          aria-expanded={visibles}
          aria-controls="nav-suggestions"
          aria-autocomplete="list"
          aria-activedescendant={actif >= 0 ? `nav-suggestion-${actif}` : undefined}
          autoComplete="off"
        />
        <button type="submit" className="nav-search-btn" aria-label="Rechercher">
          ⌕
        </button>
      </form>
      {visibles && (
        <ul className="nav-suggestions" id="nav-suggestions" role="listbox">
          {suggestions.map((s, i) => (
            <li
              key={`${s.type}-${s.href}`}
              id={`nav-suggestion-${i}`}
              role="option"
              aria-selected={i === actif}
              className={i === actif ? "actif" : undefined}
              onMouseEnter={() => setActif(i)}
            >
              <Link href={s.href} onClick={() => setOuvert(false)}>
                <span className="suggestion-label">{s.label}</span>
                {s.contexte && <span className="suggestion-contexte">{s.contexte}</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SiteHeader({
  activeCategorie,
  valeurRecherche = "",
}: {
  activeCategorie?: Categorie;
  valeurRecherche?: string;
}) {
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
          {/* Formulaire GET vers /recherche : le champ portait `action="#"`
              depuis l'origine — il était inerte (§13.2, Résultat n°2). Un GET
              plutôt qu'un `router.push` pour que la recherche reste une URL
              partageable, indexable et rechargeable, et qu'elle fonctionne sans
              JavaScript. Le champ est passé en état **contrôlé** le 2026-08-30
              (§14.10) : la barre de suggestions a besoin de la saisie en cours.
              Le `<form>` reste un GET, donc la recherche fonctionne toujours
              sans JavaScript — la barre, elle, disparaît simplement. */}
          <BarreSuggestions valeurInitiale={valeurRecherche} />
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
