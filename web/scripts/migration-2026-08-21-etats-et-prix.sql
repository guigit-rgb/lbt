-- Migration du 2026-08-21 — actions §17 n°187 et n°188 du cahier des charges
-- (voir §6.7 « Migration d'états et historique de prix »).
--
-- POURQUOI CE FICHIER EXISTE ALORS QUE LE PROJET UTILISE `npm run db:push` :
-- `annonces.etat` est une colonne `text` sans contrainte en base (l'`enum` de
-- Drizzle n'existe qu'en TypeScript — vérifié en générant le DDL). `db:push`
-- crée donc bien la table `annonce_prix_historique` et la colonne
-- `fin_vie_at`, mais il **ne renomme aucune valeur déjà écrite** : les lignes
-- portant `etat = 'retiree'` resteraient des retraits volontaires déguisés en
-- décisions de modération, et cette confusion ne se répare plus une fois
-- qu'une vraie décision de modération a été écrite avec la même valeur.
--
-- ORDRE D'EXÉCUTION, ET IL N'EST PAS NÉGOCIABLE :
--   1. `npm run db:push`  (crée la table, l'index et la colonne)
--   2. ce fichier          (renomme les valeurs, puis reconstitue l'historique)
--   3. déploiement du code (qui n'écrit plus jamais 'retiree' côté auteur)
-- L'étape 2 doit passer AVANT la première décision de modération enregistrée.
--
-- Idempotent : ré-exécutable sans effet de bord.

BEGIN;

-- 1. Renommage de la fin de vie « retrait volontaire par l'auteur ».
--    À ce jour, aucune décision de modération n'a jamais été écrite en base :
--    toutes les lignes 'retiree' sont donc des retraits d'auteur. Cette
--    hypothèse ne sera plus vraie après la mise en service du back-office de
--    modération (§7.5) — ce script ne doit donc jamais être rejoué après.
UPDATE annonces
   SET etat = 'retiree_par_auteur'
 WHERE etat = 'retiree';

-- 2. Date de fin de vie pour les annonces déjà closes.
--    `updated_at` est la meilleure approximation disponible et c'est la seule :
--    la date du retrait n'a jamais été stockée ailleurs. Les durées de vie
--    calculées sur ces lignes-là sont donc approchées — à documenter comme
--    telles dans toute analyse de survie (§6.6, Résultat n°5).
UPDATE annonces
   SET fin_vie_at = updated_at
 WHERE fin_vie_at IS NULL
   AND etat IN ('vendue', 'retiree_par_auteur', 'expiree', 'retiree');

-- 3. Amorce de la trajectoire de prix pour les annonces déjà publiées.
--    On ne peut reconstituer qu'un seul point par annonce (le prix actuel) :
--    les baisses antérieures ont été écrasées par `modifierAnnonce` et sont
--    définitivement perdues. `source = 'depot'` est donc ici une convention,
--    et `observe_a` est daté de la publication, pas de l'observation du prix.
INSERT INTO annonce_prix_historique (annonce_id, prix_cents, source, observe_a)
SELECT a.id, a.prix_cents, 'depot', COALESCE(a.published_at, a.created_at)
  FROM annonces a
 WHERE a.published_at IS NOT NULL
   AND NOT EXISTS (
        SELECT 1 FROM annonce_prix_historique h WHERE h.annonce_id = a.id
       );

COMMIT;

-- Contrôles à passer après exécution (les trois doivent renvoyer 0) :
--   SELECT count(*) FROM annonces WHERE etat = 'retiree';                 -- 0 avant back-office
--   SELECT count(*) FROM annonces
--    WHERE fin_vie_at IS NULL
--      AND etat IN ('vendue','retiree_par_auteur','expiree','retiree');   -- 0
--   SELECT count(*) FROM annonces a WHERE a.published_at IS NOT NULL
--     AND NOT EXISTS (SELECT 1 FROM annonce_prix_historique h
--                      WHERE h.annonce_id = a.id);                        -- 0
