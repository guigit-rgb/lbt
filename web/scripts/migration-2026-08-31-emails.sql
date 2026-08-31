-- Migration 2026-08-31 — e-mails transactionnels (action §17 n°211, §14.11)
--
-- À exécuter UNE FOIS, en session locale, contre la base
-- (`psql "$DATABASE_URL" -f scripts/migration-2026-08-31-emails.sql`).
-- `npm run db:push` fait le même travail à partir de lib/db/schema.ts ; ce
-- script existe pour poser exactement ces objets sans déclencher la
-- comparaison de schéma complète des quinze tables.
--
-- Rien n'est détruit, rien n'est réécrit : trois colonnes ajoutées et une
-- table créée. Toutes les instructions sont idempotentes (IF NOT EXISTS), le
-- script se rejoue donc sans dommage.
--
-- AUCUNE DE CES COLONNES NE SE RÉTRO-REMPLIT, et c'est volontaire :
--   * `users.email_verifie_a` reste NULL sur les comptes existants — nous
--     n'avons aucune preuve que leurs adresses leur appartiennent, et
--     l'inventer serait exactement ce que le §6.4 (R7) interdit. Conséquence
--     à connaître AVANT de lancer le premier lot d'alertes : tant que ces
--     comptes n'ont pas confirmé, ils n'en recevront aucune (voir la note de
--     fin de fichier).
--   * `recherches_sauvegardees.dernier_envoi_a` reste NULL, ce qui fait
--     démarrer le filigrane à `created_at` : une recherche enregistrée il y a
--     trois mois ne déclenche pas l'envoi de trois mois d'annonces.

BEGIN;

-- 1. Confirmation d'adresse (§14.11, message n°4)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS email_verifie_a timestamptz;

-- 2. Alerte par recherche : activation granulaire + filigrane (§6.4 R6)
ALTER TABLE recherches_sauvegardees
  ADD COLUMN IF NOT EXISTS alerte_active boolean NOT NULL DEFAULT true;
ALTER TABLE recherches_sauvegardees
  ADD COLUMN IF NOT EXISTS dernier_envoi_a timestamptz;

-- 3. Jetons à usage unique envoyés par courriel (§14.11 R8)
--    `empreinte` est l'empreinte SHA-256 du jeton, jamais le jeton : un jeton
--    de réinitialisation stocké en clair est un mot de passe stocké en clair.
CREATE TABLE IF NOT EXISTS jetons_email (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  usage       text NOT NULL,
  empreinte   text NOT NULL UNIQUE,
  expire_a    timestamptz NOT NULL,
  utilise_a   timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS jetons_email_user_usage_idx
  ON jetons_email (user_id, usage);

-- 4. La table `travaux` sert de boîte d'envoi (§14.11 R6). Elle est déclarée
--    dans lib/db/schema.ts depuis le 2026-08-21 mais n'a jamais eu de
--    producteur (§13.2) : cette instruction garantit qu'elle existe réellement
--    en base avant le premier envoi, faute de quoi chaque message partirait
--    sans trace (le code le tolère et le journalise, mais l'objet de la boîte
--    d'envoi est précisément de ne rien perdre).
CREATE TABLE IF NOT EXISTS travaux (
  id            bigserial PRIMARY KEY,
  type          text NOT NULL,
  payload       jsonb NOT NULL,
  etat          text NOT NULL DEFAULT 'en_attente',
  tentative     smallint NOT NULL DEFAULT 0,
  disponible_a  timestamptz NOT NULL DEFAULT now(),
  verrou_par    text,
  verrou_a      timestamptz,
  erreur        text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS travaux_etat_disponible_idx
  ON travaux (etat, disponible_a);

COMMIT;

-- --------------------------------------------------------------------------
-- Contrôles à lancer juste après (aucun n'écrit).
-- --------------------------------------------------------------------------

-- (a) Les colonnes et la table sont là.
-- SELECT column_name FROM information_schema.columns
--  WHERE table_name = 'recherches_sauvegardees'
--    AND column_name IN ('alerte_active','dernier_envoi_a');
-- SELECT to_regclass('public.jetons_email'), to_regclass('public.travaux');

-- (b) Combien de comptes ne recevront AUCUNE alerte tant qu'ils n'ont pas
--     confirmé leur adresse. Si ce nombre vaut la totalité des comptes, c'est
--     normal le premier jour — et c'est la raison pour laquelle le premier lot
--     d'alertes doit être lancé en simulation
--     (`tsx scripts/envoyer-alertes.ts`, sans --envoyer).
-- SELECT count(*) FILTER (WHERE email_verifie_a IS NULL) AS non_confirmes,
--        count(*) AS total
--   FROM users;

-- (c) Taille du premier lot d'alertes, avant tout envoi.
-- SELECT count(*) AS alertes_actives
--   FROM recherches_sauvegardees WHERE alerte_active;
