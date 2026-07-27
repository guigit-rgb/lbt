# Cahier des charges — LBT (lebontruc.fr / .com)
### Devenir un concurrent sérieux de LeBonCoin (LBC) en 24-36 mois

*Document vivant — dernière mise à jour : 2026-07-27. Porté par Nicolas Therond (PDG RETRO+), en phase de conception avec Claude. Pas encore d'équipe technique affectée.*

---

## 1. Résumé exécutif

LBC pèse ~1Md€ de CA (2024) et domine trois verticales (immobilier, auto, emploi) grâce à un effet de réseau construit sur 20 ans. LBT ne peut pas l'attaquer de front sur l'ensemble du marché : il lui faut une **tête de pont** — un segment où LBC est vulnérable et où Nicolas a un avantage concret.

**Décision de positionnement (validée avec Nicolas) :**
- **Phase 1 (mois 1-12) : automobile, particuliers puis professionnels**, en local/régional d'abord. Nicolas est lui-même client LBC Pro (1780€/mois pour une vitrine de 20 véhicules) — douleur vécue, réseau de garagistes accessible, marché en plus forte croissance chez Adevinta.
- **Phase 2 (mois 12-24) : extension à la collection/brocante/vintage**, en s'appuyant sur les 20 ans de trafic et de confiance de `collectionneur.net`.
- **Phase 3 (mois 24-36) : consolidation nationale** sur ces deux verticales avant d'envisager toute extension supplémentaire (immobilier, emploi — hors scope à ce stade, marchés déjà très verrouillés et capitalistiquement lourds).

Ne pas confondre "concurrent sérieux" et "clone généraliste de LBC" : l'objectif à 36 mois est une position forte et rentable sur 2 verticales, pas une couverture totale du marché.

---

## 2. Objectifs à 24-36 mois (à chiffrer précisément une fois le MVP testé)

| Horizon | Objectif |
|---|---|
| Mois 6 | MVP auto en ligne sur 1 région pilote (bassin de Nicolas), 500+ annonces particuliers actives |
| Mois 12 | Auto national particuliers + premiers garages pros payants (objectif : 200 garages abonnés) |
| Mois 18 | Lancement verticale collection/brocante, adossée à `collectionneur.net` |
| Mois 24 | Rentabilité opérationnelle sur la verticale auto ; collection en croissance |
| Mois 36 | Position "alternative crédible et moins chère que LBC" reconnue sur auto + collection, base pour lever des fonds ou négocier un rapprochement si pertinent |

*Ces chiffres sont des hypothèses de travail à valider — à revoir dès qu'on aura des données réelles du pilote régional.*

---

## 3. Analyse concurrentielle — ce qu'on sait de LBC (sources : recherche web du 2026-07-26)

- CA France : 494M€ (2022) → 550M€ (2023) → ~1Md€ TTC (2024). Croissance très rapide.
- Pas de répartition publique du CA par secteur depuis le rachat d'Adevinta par un consortium privé en 2024.
- Immobilier : 1,2M annonces, 85% des pros de l'immo présents. Emploi : 3ᵉ site d'emploi privé, en retrait.
- **Automobile : 700k+ véhicules, dont 400k+ postés par des professionnels** — la plus grosse base de comptes pros payants, verticale la plus dynamique du groupe (+21% mobilité au T4 2023).
- **27/04/2026 : LBC a supprimé l'achat de crédits à la carte**, forçant tous les vendeurs pros vers l'abonnement obligatoire → frustration actuelle exploitable commercialement.
- Modèle économique historique : gratuit pour les particuliers dès 2006 (y compris la modification d'annonce, aujourd'hui encore "Modifier gratuitement"), monétisation via options de mise en avant (1,99-7,99€ le boost) et annonces professionnelles payantes. Un épisode de 2013 (hausse tarifs pros) a fait fuir 550k annonces pros du jour au lendemain avant un retour en arrière partiel — LBC est donc sensible à la douleur tarifaire côté pros, c'est un flanc réel.
- Forces de LBC : effet de réseau, notoriété, marque préférée des Français sur seconde main et immobilier, 14,5M visiteurs uniques/mois (+15%/an).
- Faiblesses identifiées : coût pro élevé et en hausse perçue, généraliste donc pas d'expertise/curation sur les niches (collection, vintage), pas de mécanisme de confiance renforcé sur les catégories à risque de fraude (auto, objets de valeur).

**Action de suivi :** mettre en place une veille concurrentielle légère et récurrente (voir §11) plutôt qu'une étude ponctuelle qui périme vite.

---

## 4. Segments cibles et phasage

### Phase 1 — Automobile
- **Particuliers vendeurs** : levier d'acquisition (gratuit, sert à construire le trafic/la liquidité).
- **Garages et concessions indépendantes** (le segment de Nicolas) : levier de monétisation, cible prioritaire une fois le trafic acheteur établi.
- Zone de lancement : région de Nicolas, pas national — densité d'annonces > couverture géographique au démarrage.

### Phase 2 — Collection / brocante / vintage
- Public de `collectionneur.net` : audience déjà acquise, confiance de marque déjà là.
- Élargissement progressif : de la collection pure vers la brocante/chine au sens large (le nom "lebontruc" porte bien cette extension).

### Hors scope (36 mois)
- Immobilier, emploi, généraliste tout-venant : marchés déjà verrouillés par LBC et d'autres spécialistes (SeLoger, LaCentrale...), coûteux à attaquer, aucun avantage identifié pour Nicolas.

---

## 5. Modèle économique et grille tarifaire

**Principe directeur : gratuité réelle côté particuliers, monétisation côté pros et services à valeur ajoutée — pas de mécanique perçue comme punitive.**

| Levier | Particuliers | Professionnels (auto) |
|---|---|---|
| Dépôt d'annonce | Gratuit, illimité en durée | Abonnement obligatoire au-delà d'un seuil d'annonces gratuit |
| Modification | Gratuite (comme LBC aujourd'hui — ne pas réinventer une friction qui n'existe pas chez le concurrent) | Gratuite |
| Mise en avant / boost | Payant, prix d'appel < LBC (ex. 0,99-4,99€ vs 1,99-7,99€ chez LBC) | Inclus dans les paliers d'abonnement |
| Anti-fraude auto | **Friction-fee symbolique ciblé uniquement sur l'auto** (montant à tester : 0,50-1€), justifié auprès de l'utilisateur comme mesure anti-arnaque, pas comme frais caché | — |
| Abonnement vitrine pro | — | Paliers volume, prix cassé vs LBC (repère : LBC facture 1780€/mois pour 20 véhicules — cibler un tarif nettement inférieur en gardant une marge saine, à modéliser avec les coûts réels d'infra) |

**À faire avant de figer les prix :** modéliser le coût d'infrastructure par annonce/par pro (hébergement, modération, support) pour fixer un prix pro qui reste rentable même très en dessous de LBC — ne pas fixer un prix "attractif" sans avoir vérifié qu'il couvre les coûts.

---

## 6. Exigences produit / UX

Parité d'ergonomie avec LBC = prérequis silencieux, pas un argument de vente. Fonctions attendues au MVP :
- Dépôt d'annonce en < 2 minutes (formulaire court, upload photos multiple, géolocalisation auto)
- Recherche et filtres rapides (prix, localisation/rayon km, marque/modèle/année pour l'auto, état, etc.)
- Messagerie intégrée acheteur-vendeur (ne pas exposer les coordonnées perso par défaut — argument confiance)
- Fiche "vitrine pro" pour les garages (comme l'E-Vitrine LBC, mais moins chère)
- Système d'avis/réputation vendeur — argument de confiance différenciant sur l'auto (LBC n'a pas de système de notation robuste)
- Notifications (nouvelle réponse, baisse de prix sur une recherche sauvegardée, etc.)
- Version mobile web irréprochable dès le MVP (la majorité du trafic annonces est mobile) ; appli native à évaluer en phase 2

---

## 7. Exigences techniques

*Section à approfondir avec un profil technique (Fabien ou un développeur, une fois le concept validé) — ce qui suit est un cadrage de haut niveau, pas une architecture définitive.*

- Architecture : application web scalable, recherche full-text + filtres géographiques performants dès le départ (le moteur de recherche est le cœur du produit d'un site d'annonces)
- Hébergement : prévoir une infra capable de monter en charge sans refonte (auto-scaling) — plusieurs skills installés couvrent Cloudflare (Workers, D1, R2, Images) et Vercel/Next.js, pertinents pour un déploiement rapide et scalable sans lourdeur DevOps initiale
- Modération de contenu : outillage (automatique + humain) pour détecter annonces frauduleuses/interdites dès le lancement — obligation légale, pas une option (voir §8)
- Paiement : si LBT propose un jour un paiement sécurisé/livraison (comme LBC depuis 2018 avec Adyen), prévoir l'intégration d'un prestataire de paiement agréé — hors MVP, à anticiper dans l'architecture
- SEO technique : indexation des annonces, pages géolocalisées, temps de chargement — condition de la stratégie d'acquisition gratuite (§9)

**Gap identifié :** aucun des 341 skills installés ne couvre spécifiquement "stratégie de liquidité marketplace / anti-fraude" — ce savoir-faire vit dans ce document, pas dans un skill générique.

---

## 8. Confiance, sécurité & conformité légale

**À ne pas sous-estimer — c'est ce qui peut bloquer un lancement, pas le manque de code.**
- Statut d'hébergeur vs éditeur de contenu (loi LCEN) : obligations de modération et de retrait rapide de contenu illicite
- RGPD : données personnelles des utilisateurs (comptes, messages, localisation)
- Identification des vendeurs professionnels (obligation légale en France depuis 2023 pour les places de marché en ligne)
- Obligations fiscales de déclaration (type DAC7) si LBT facilite des transactions entre particuliers au-delà de certains seuils
- CGU/CGV adaptées, notamment sur la responsabilité en cas de fraude entre utilisateurs

**Action :** prévoir un point avec un juriste (ou Fabien s'il a la compétence) avant le lancement public, pas après.

---

## 9. Stratégie d'acquisition / bootstrap (résoudre le problème de démarrage à froid)

1. **Hyper-local d'abord** : concentrer les premières annonces sur la région de Nicolas plutôt que viser le national — la densité perçue convainc plus qu'une couverture large et vide.
2. **Levier `collectionneur.net`** : trafic croisé dès le lancement (bannière, mention, newsletter existante) même si la verticale initiale (auto) diffère — capitaliser sur l'audience existante plutôt que partir de zéro.
3. **Réseau personnel de garagistes** : Nicolas peut recruter les 10-20 premiers garages pros pilotes directement via ses relations professionnelles — bien plus efficace qu'une acquisition froide.
4. **SEO dès le jour 1** : les skills `seo-audit`, `programmatic-seo`, `seo-keyword-cluster-builder` sont directement mobilisables pour construire la visibilité organique en parallèle du produit.
5. **Frustration LBC pro comme argument commercial** : le changement tarifaire du 27/04/2026 (suppression des crédits à la carte) est un point d'entrée concret pour démarcher des garages mécontents.

---

## 10. Roadmap 24-36 mois (jalons, à affiner)

- **M1-3** : cahier des charges finalisé, choix techniques arrêtés, début développement MVP auto
- **M4-6** : MVP auto en test fermé sur la région pilote, recrutement des 10-20 premiers garages
- **M7-12** : ouverture publique régionale, itération produit, premiers abonnements pro payants
- **M13-18** : extension nationale auto ; lancement verticale collection adossée à `collectionneur.net`
- **M19-24** : consolidation, recherche de rentabilité opérationnelle sur l'auto
- **M25-36** : croissance des deux verticales, décision sur une éventuelle 3ᵉ verticale ou une levée de fonds

---

## 11. Organisation & ressources

Actuellement : Nicolas + Claude, phase de conception, **aucune ressource technique affectée**. Décision à prendre : à quel moment impliquer l'équipe IT de RETRO+ (Fabien, les 3 ingénieurs 3IL, l'admin sys) — probablement dès le passage en développement du MVP (fin de la phase de cahier des charges), pas avant, pour ne pas diluer leur temps sur un concept encore mouvant.

**Veille concurrentielle LBC** : mettre en place un suivi léger et récurrent (trimestriel suffit) plutôt qu'une étude figée — les prix et politiques de LBC bougent vite (cf. changement du 27/04/2026).

---

## 12. Risques principaux

| Risque | Mitigation |
|---|---|
| Effet de réseau de LBC trop fort même sur un segment niche | Rester strictement local/vertical au démarrage, ne pas viser le national trop tôt |
| Fraude sur l'auto ternit la réputation avant même le lancement | Friction-fee ciblé + modération humaine dès le MVP, pas en rattrapage |
| Dilution : vouloir couvrir trop de verticales trop vite | Discipline de phasage (§4) — collection seulement après l'auto, pas en parallèle dès le M1 |
| Aspect juridique sous-estimé | Point juridique avant lancement public (§8), pas après un incident |
| Absence de ressource technique dédiée | Décision claire sur le déclenchement de l'implication de l'équipe RETRO+ (§11) |

---

## 13. Plan de ressources (matériel & humain)

*À construire progressivement par les sessions de travail quotidiennes (voir §17). Vide au 2026-07-27 — rien n'est encore arbitré.*

- Besoins humains par phase (dev, design, modération/support, commercial garages...)
- Quand et comment impliquer l'équipe RETRO+ (Fabien, les 3 ingénieurs 3IL, l'admin sys) vs recruter/externaliser spécifiquement pour LBT
- Besoins matériels/infra (hébergement, stockage images, coûts variables par annonce/par utilisateur)
- Budget prévisionnel par phase

## 14. Choix technologiques

*À trancher progressivement — ne pas figer avant d'avoir comparé les options. Point de départ : les skills déjà installés couvrent Cloudflare (Workers/D1/R2/Images) et Vercel/Next.js, deux stacks capables de scalabilité rapide sans lourdeur DevOps initiale, mais rien n'est encore choisi.*

- Stack backend/frontend
- Moteur de recherche (le cœur produit d'un site d'annonces — évaluer Algolia, Meilisearch, Elasticsearch, ou solution native Cloudflare/Vercel)
- Hébergement et scalabilité
- Modération de contenu (outillage automatique + humain)
- Paiement/escrow (si applicable, hors MVP)

## 15. Skills nécessaires au projet — veille & gestion

- Bibliothèque actuelle : 341 skills installés le 2026-07-26 (voir [[installed-skills-library]] en mémoire), audités et liés entre eux.
- Gap connu : pas de skill dédié "stratégie marketplace/anti-fraude" — comblé par ce document.
- **À faire en continu** : identifier les nouveaux besoins au fil du projet (ex. un skill précis sur le moteur de recherche choisi, sur la conformité DAC7, sur un framework retenu), rechercher s'il existe une ressource fiable, l'auditer avant installation (même processus de sécurité que le 2026-07-26 : pas d'installation sans vérification), et tenir cette section à jour avec ce qui a été ajouté et pourquoi.
- **Veille technologique** : suivre les évolutions techniques pertinentes (moteurs de recherche, frameworks marketplace, outils anti-fraude) pour garder les choix du §14 à jour plutôt que figés une fois pour toutes.

## 16. Journal d'avancement quotidien

*Chaque session de travail (manuelle ou automatisée) ajoute une entrée datée ici : ce qui a été fait, ce qui a été décidé, ce qui reste ouvert.*

- **2026-07-27** — Création du document v1 (positionnement, concurrence, segments, modèle économique, UX, technique, légal, acquisition, roadmap, organisation, risques). Mise en place prévue d'un agent quotidien automatisé pour faire avancer le document en continu.

## 17. File d'attente des prochaines actions (pour les sessions automatisées)

*Liste vivante. Chaque session quotidienne prend l'action la plus prioritaire encore "ouverte", la traite en profondeur, la marque "traitée" avec un résumé, ajoute une entrée au §16, et peut ajouter de nouvelles actions découvertes en cours de route. Une seule action approfondie par jour, pas un survol de plusieurs — la qualité prime sur le volume.*

1. [ouvert] Modéliser le coût d'infrastructure par annonce/par pro pour fixer un prix pro réaliste (§5)
2. [ouvert] Comparer 3-4 moteurs de recherche candidats (Meilisearch, Algolia, Typesense, natif Cloudflare) pour le cas d'usage annonces géolocalisées (§14)
3. [ouvert] Détailler les obligations légales précises (LCEN, RGPD, identification vendeurs pro, DAC7) avec sources à jour (§8)
4. [ouvert] Étudier des cas comparables à l'étranger (sites d'annonces auto ayant réussi à se différencier d'un leader établi) pour en tirer des enseignements
5. [ouvert] Chiffrer un premier budget prévisionnel Phase 1 (MVP + lancement régional) (§13)
6. [ouvert] Définir précisément les paliers d'abonnement pro (nombre de véhicules, prix, options) en repère explicite face à la grille LBC actuelle (§5)
7. [ouvert] Rechercher si des skills spécifiques manquent pour le moteur de recherche/stack retenus, une fois choisis (§15)
8. [ouvert] Veille concurrentielle LBC — premier point structuré (prix, nouvelles fonctionnalités, communication) (§3)
9. [ouvert] Détailler le plan de recrutement des 10-20 premiers garages pilotes (script d'approche, argumentaire face à la frustration tarifaire LBC du 27/04/2026) (§9)
10. [ouvert] Étudier la faisabilité technique et légale du système d'avis/réputation vendeur (différenciateur confiance mentionné en §6)

---

## Annexe — Sources de la recherche marché (2026-07-26)

- LSA Conso — chiffres clés Leboncoin
- L'Essentiel de l'Éco — Leboncoin, l'envers d'une réussite française
- Adevinta — résultats annuels 2023
- leboncoinsolutionspro.fr — offres automobile
- Annu Moteurs — tarifs annonces Leboncoin 2026
- leboncoin corporate — communiqués de presse 20 ans
