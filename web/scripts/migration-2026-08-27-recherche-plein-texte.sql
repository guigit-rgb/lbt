-- Migration 2026-08-27 — index de recherche plein texte (action §17 n°210, §14.7)
--
-- À exécuter UNE FOIS, en session locale, contre la base de production
-- (`psql "$DATABASE_URL" -f scripts/migration-2026-08-27-recherche-plein-texte.sql`).
-- Aucune donnée n'est modifiée : la migration ne crée qu'un index.
--
-- `npm run db:push` fait le même travail : vérifié le 2026-08-27 en session
-- automatisée, `drizzle-kit generate` émet bien le CREATE INDEX ci-dessous à
-- partir de la déclaration de lib/db/schema.ts. Ce script existe pour deux
-- raisons quand même : il permet de poser l'index SANS déclencher la
-- comparaison de schéma complète d'un `db:push` (qui touche 14 tables), et il
-- porte les trois contrôles de fin de fichier, dont le seul qui compte
-- vraiment — l'index est-il réellement utilisé.
-- L'index reste DÉCLARÉ dans lib/db/schema.ts, sans quoi le prochain
-- `db:push` le verrait comme un objet inconnu de la base et le supprimerait.
--
-- L'expression doit rester identique au caractère près à `EXPRESSION_VECTEUR`
-- de lib/recherche-texte.ts. Voir le commentaire d'en-tête de ce fichier pour
-- les trois raisons de cette forme précise (translate() plutôt qu'unaccent(),
-- pliage symétrique requête/index, littéraux plutôt que paramètres).

BEGIN;

-- Note : `CREATE INDEX CONCURRENTLY` serait préférable en production (pas de
-- verrou d'écriture sur `annonces`), mais il est interdit dans une transaction.
-- Au volume actuel (quelques milliers de lignes) la construction prend moins
-- d'une seconde ; passer en CONCURRENTLY — hors transaction — le jour où la
-- table dépasse quelques centaines de milliers de lignes.
CREATE INDEX IF NOT EXISTS annonces_recherche_idx
  ON annonces
  USING gin (
    to_tsvector(
      'french',
      translate(
        lower(coalesce(titre, '') || ' ' || coalesce(description, '')),
        'àâäáãåçéèêëíìîïñòóôöõùúûüýÿ',
        'aaaaaaceeeeiiiinooooouuuuyy'
      )
    )
  );

COMMIT;

-- ---------------------------------------------------------------------------
-- Contrôles à lire après exécution (aucun n'est automatique)
-- ---------------------------------------------------------------------------

-- 1. L'index existe et sa définition est bien celle attendue.
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'annonces' AND indexname = 'annonces_recherche_idx';

-- 2. LE CONTRÔLE QUI COMPTE : l'index est-il réellement *utilisé* ?
--    Attendu : « Bitmap Index Scan on annonces_recherche_idx ».
--    Si le plan montre « Seq Scan », l'expression de la requête a divergé de
--    celle de l'index — comparer caractère par caractère avec
--    lib/recherche-texte.ts. Rien d'autre ne signalera l'écart.
--    (Sur une table de quelques milliers de lignes, le planificateur peut
--    légitimement préférer un Seq Scan : forcer le diagnostic avec
--    `SET enable_seqscan = off;` avant l'EXPLAIN si le doute persiste.)
EXPLAIN
SELECT id
FROM annonces
WHERE to_tsvector(
        'french',
        translate(
          lower(coalesce(titre, '') || ' ' || coalesce(description, '')),
          'àâäáãåçéèêëíìîïñòóôöõùúûüýÿ',
          'aaaaaaceeeeiiiinooooouuuuyy'
        )
      ) @@ websearch_to_tsquery('french', 'clio essence');

-- 3. Contrôle métier du pliage des accents : les deux requêtes doivent rendre
--    le MÊME nombre de lignes. Si la seconde rend 0 alors que la première ne
--    rend pas 0, le pliage ne fonctionne pas et toute la recherche française
--    sans accent est cassée (« citroen », « velo », « bebe », « telephone »).
SELECT
  (SELECT count(*) FROM annonces
    WHERE to_tsvector('french', translate(lower(coalesce(titre,'') || ' ' || coalesce(description,'')),
      'àâäáãåçéèêëíìîïñòóôöõùúûüýÿ', 'aaaaaaceeeeiiiinooooouuuuyy'))
      @@ websearch_to_tsquery('french', 'telephone')) AS sans_accent,
  (SELECT count(*) FROM annonces
    WHERE to_tsvector('french', translate(lower(coalesce(titre,'') || ' ' || coalesce(description,'')),
      'àâäáãåçéèêëíìîïñòóôöõùúûüýÿ', 'aaaaaaceeeeiiiinooooouuuuyy'))
      @@ websearch_to_tsquery('french', translate(lower('téléphone'),
        'àâäáãåçéèêëíìîïñòóôöõùúûüýÿ', 'aaaaaaceeeeiiiinooooouuuuyy'))) AS avec_accent;
