# lebontruc.fr — code

Dossier de développement du produit, à côté du cahier des charges (`../cahier-des-charges.md`, la référence pour toutes les décisions produit/technique/légales).

## Où on en est

- `mockups/` : maquettes HTML statiques (zéro dépendance, s'ouvrent directement dans un navigateur), utilisées pour valider la direction visuelle et l'UX avant d'écrire le vrai code.
  - `accueil.html` — page d'accueil (bloc 1, validée par Nicolas le 2026-08-17 : direction "enseigne d'atelier" — vert émail, cuivre patiné, papier sauge).

## Prochaine étape

Une fois les maquettes validées, mise en place du vrai projet (Next.js + Postgres + Typesense, cf. §14 du cahier des charges) — nécessite d'installer Node.js sur cette machine au préalable (pas encore fait).

## Stack retenue (cahier des charges §14)

- Recherche : Typesense, indexé depuis Postgres (source de vérité).
- Modération : cascade auto-hébergée (pHash, NSFW, YOLO plaques, OCR) + VLM sélectif.
- Infra : conteneurs Docker pour les services auto-hébergés, Cloudflare en CDN/WAF (§14.5).
- Orchestration : table Postgres (`SKIP LOCKED`), pas de courtier de messages (§7.4).
