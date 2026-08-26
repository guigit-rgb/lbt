-- Lecture du journal de mise en relation — requêtes de référence
-- (cahier des charges §5.3, §13.3 ; action §17 n°209, 2026-08-26).
--
-- MISE EN SERVICE : `npm run db:push` crée `evenement_contact` et ses deux
-- index. Aucune migration de données n'est nécessaire — la table naît vide,
-- il n'y a rien à renommer ni à reconstituer, contrairement à la migration du
-- 2026-08-21. Ce fichier n'est donc pas un script à exécuter une fois : c'est
-- la LECTURE du journal, à rejouer chaque mois.
--
-- PRÉREQUIS D'EXPLOITATION : la variable `CONTACT_POIVRE` doit être définie
-- avant le déploiement. Sans elle, `lib/contacts.ts` lève — volontairement :
-- un journal écrit sous un poivre vide est un hachage public, donc une donnée
-- personnelle en clair déguisée en empreinte.
--
-- CE QUE CES REQUÊTES NE SONT PAS : la fonction `compter()` de la §5.3 R6.
-- Elles n'appliquent ni les 8 exclusions N1-N8, ni le versionnement des
-- règles, ni l'arrêté mensuel scellé par son empreinte SHA-256. Elles donnent
-- l'ORDRE DE GRANDEUR de λ que le go/no-go réclame, et rien de plus.

-- 1. λ dégradé — mises en relation par vendeur professionnel et par mois,
--    dédupliquées sur (acheteur, vendeur) comme l'exige la §5.3 R2.
--    NOTE : la déduplication se fait ici sur le mois calendaire et non sur la
--    fenêtre glissante de 30 jours, parce que l'arrêté est mensuel ; l'écart
--    entre les deux est un biais connu, faible, et toujours dans le sens
--    défavorable à LBT (un acheteur à cheval sur deux mois compte deux fois
--    dans la facturation, une fois dans la fenêtre glissante).
SELECT date_trunc('month', horodatage_utc) AS mois,
       id_vendeur,
       count(DISTINCT cle_dedup) FILTER (WHERE evenement = 'premier_message')   AS contacts_messagerie,
       count(DISTINCT cle_dedup) FILTER (WHERE evenement = 'affichage_numero')  AS intentions_telephone,
       count(*)                                                                 AS evenements_bruts
  FROM evenement_contact
 WHERE vendeur_est_pro
 GROUP BY 1, 2
 ORDER BY 1 DESC, 3 DESC;

-- 2. Le rapport qui décidera de la valeur du numéro suivi (§5.3 R3).
--    Tant que le CPaaS n'existe pas, LBT mesure l'intention téléphonique
--    (`affichage_numero`, N2) et le contact écrit (`premier_message`, Q1),
--    jamais l'appel abouti. Ce rapport est ce qu'il faudra confronter au
--    premier mois de CDR pour savoir quelle part des affichages devient un
--    appel de 30 s — c'est-à-dire ce que le numéro suivi ajoute vraiment.
SELECT date_trunc('month', horodatage_utc) AS mois,
       count(DISTINCT cle_dedup) FILTER (WHERE evenement = 'affichage_numero') AS intentions,
       count(DISTINCT cle_dedup) FILTER (WHERE evenement = 'premier_message')  AS messages,
       round(
         count(DISTINCT cle_dedup) FILTER (WHERE evenement = 'affichage_numero')::numeric
         / nullif(count(DISTINCT cle_dedup) FILTER (WHERE evenement = 'premier_message'), 0),
         2
       ) AS ratio_intention_sur_message
  FROM evenement_contact
 WHERE vendeur_est_pro
 GROUP BY 1
 ORDER BY 1 DESC;

-- 3. Contrôle de qualité de la mesure elle-même — à lire AVANT les deux
--    requêtes précédentes. La part d'événements dont l'empreinte vient du
--    navigateur (visiteur non connecté) borne ce que λ vaut : sur cette part,
--    « acheteur unique » signifie « couple IP + user-agent unique », ce qui
--    sous-compte les foyers et les entreprises partageant une sortie, et
--    sur-compte la navigation privée et les IP mobiles changeantes.
--    Si cette part dépasse ~30 %, le λ de la requête 1 n'est plus un nombre
--    d'acheteurs : c'est une borne, et il faut le dire au comité go/no-go.
SELECT date_trunc('month', horodatage_utc) AS mois,
       empreinte_source,
       count(*) AS evenements,
       round(100.0 * count(*) / sum(count(*)) OVER (PARTITION BY date_trunc('month', horodatage_utc)), 1) AS pct
  FROM evenement_contact
 GROUP BY 1, 2
 ORDER BY 1 DESC, 3 DESC;

-- 4. Invariant d'ajout seul — le journal ne doit connaître ni `UPDATE` ni
--    `DELETE`. Faute de contrainte en base (le projet a écarté les `CHECK`,
--    voir §6.7 : `db:push` les ferait dériver), l'invariant se contrôle par
--    requête. Un identifiant manquant dans la suite est le signe qu'une ligne
--    a été supprimée : la valeur doit rester 0.
SELECT (max(id) - min(id) + 1) - count(*) AS lignes_manquantes
  FROM evenement_contact;
