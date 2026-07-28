# Cahier des charges — LBT (lebontruc.fr / .com)
### Devenir un concurrent sérieux de LeBonCoin (LBC) en 24-36 mois

*Document vivant — dernière mise à jour : 2026-07-28. Porté par Nicolas Therond (PDG RETRO+), en phase de conception avec Claude. Pas encore d'équipe technique affectée.*

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
- **Restriction des photos gratuites (à confirmer sur source officielle)** : plusieurs sources secondaires de 2026 indiquent que LBC est passé de 5 à **3 photos gratuites** pour les particuliers sur la majorité des catégories, les photos supplémentaires (jusqu'à 10 ou 20 selon le pack) étant payantes. Une source mentionne aussi un **quota de 2 annonces auto gratuites par an pour les particuliers, puis ~8 € par publication**. Si confirmé, c'est un point de friction majeur et un axe de différenciation direct pour LBT (photos illimitées ou 10-15 gratuites — le modèle de coût du §5.1 montre que cela ne coûte rien : le stockage image représente 0,001 €/annonce).
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

### 5.1 Modèle de coût marginal par annonce et par pro (établi le 2026-07-28)

*Sources tarifaires : recherche web du 2026-07-28, listées en annexe. Conversion retenue : **1 USD = 0,92 EUR** (hypothèse de travail à revalider). Ce modèle chiffre le **coût marginal** (ce que coûte une annonce ou un pro de plus), pas les coûts fixes (équipe, marketing, juridique) — ceux-ci relèvent du §13.*

#### Hypothèses de volume (à valider avec les données réelles du pilote)

| Palier | Nouvelles annonces/mois | Stock actif (durée de vie 60 j) | Visites/mois | Garages pros |
|---|---|---|---|---|
| **S1 — pilote régional (M6)** | 250 | 500 | 15 000 | 0-20 |
| **S2 — régional établi (M12)** | 2 500 | 5 000 | 150 000 | 200 |
| **S3 — national auto (M24)** | 25 000 | 50 000 | 1 500 000 | 1 500 |

Hypothèses par annonce : **10 photos** (choix produit assumé, cf. §3 — LBC est descendu à 3 photos gratuites), master WebP 2048px ≈ 400 Ko + 2 variantes (1200px ≈ 120 Ko, vignette ≈ 15 Ko) ; **250 vues de fiche + 2 500 impressions vignette** sur la durée de vie ; conservation 12 mois (2 mois actifs + archive).

#### Résultat n°1 — la livraison d'images est le poste où l'architecture change tout

Coût mensuel de la couche image **au palier S3**, selon l'architecture :

| Architecture | Coût mensuel S3 | Le coût croît avec… |
|---|---|---|
| Cloudflare Images (stockage Cloudflare) — 5 $/100k images stockées + **1 $/100k images livrées** | **~875 $ livraison + 175 $ stockage = ~1 050 $** | le **trafic** |
| R2 + Image Transformations à la volée — 0,50 $/1 000 transformations uniques (5 000 offertes) | ~375 $ | le **nombre d'images** |
| Bunny Storage + CDN Europe — 0,01 $/Go stocké + 0,01 $/Go livré | ~50 $ (3,95 To/mois) | le **volume livré** |
| **R2 + variantes pré-générées au dépôt, servies derrière le CDN Cloudflare (egress 0 $)** | **~20 $** (1 To stocké + opérations d'écriture) | ~rien |

→ **Recommandation ferme : pré-générer les 3 variantes au moment du dépôt (sharp côté serveur), les stocker en object storage, et les servir derrière un CDN à egress nul.** L'écart est de **~40× face à Cloudflare Images**, et surtout cette architecture rend le coût **quasi insensible au trafic** — propriété indispensable quand le côté particulier est gratuit et que le trafic est l'objectif. Le coût CPU de la pré-génération est négligeable : 30 redimensionnements × ~0,5 s = 15 s CPU par annonce, soit **~14 % d'un cœur** à 25 000 annonces/mois.

→ **À ne pas faire** : Cloudflare Images en mode stockage Cloudflare (facturé à la livraison), et Algolia côté recherche (facturé à la requête) — deux modèles où le succès du produit gratuit fait exploser la facture.

#### Résultat n°2 — l'infrastructure technique pure est un non-sujet

| Poste | €/annonce (S3, architecture recommandée) | Base de calcul |
|---|---|---|
| Stockage images (12 mois) | 0,001 | 5,35 Mo × 12 mois × 0,015 $/Go-mois (R2) |
| Livraison images | ~0,000 | egress R2 = 0 $ |
| Transformation images | ~0,000 | pré-génération auto-hébergée |
| Compute web/API | 0,002 | ~10 000 requêtes/annonce, Workers 0,30 $/M req + 0,02 $/M ms CPU |
| Base de données | 0,012 | Postgres managé ~300 €/mois à S3 |
| Moteur de recherche | 0,002 | Meilisearch auto-hébergé, ~50 €/mois (50k docs = charge triviale) |
| Modération automatique (10 images + texte) | **0,018** | 11 opérations × 0,002 $ (Sightengine, tarif d'overage) |
| Emails transactionnels | 0,006 | 8 emails × 0,00075 € (Brevo, 15 €/20 000) |
| **Sous-total technique** | **~0,041 €** | |

**Tout le socle technique d'une annonce coûte 4 centimes**, dont près de la moitié en modération automatique d'images — de loin le premier poste variable "technique".

#### Résultat n°3 — le coût marginal réel est humain

Coût chargé d'un modérateur/agent support en France : salaire brut moyen ~26 350 €/an (Indeed/Glassdoor 2026) + ~40 % de charges patronales ≈ **37 000 €/an chargé**, soit **~23 €/h** sur ~1 600 h travaillées.

| Poste | Hypothèse | €/annonce |
|---|---|---|
| Modération humaine | 20 % des annonces revues (flaggées + signalements), 80 annonces/h | 0,058 |
| Support utilisateur | 3 % des annonces génèrent un ticket de 8 min | 0,092 |
| **Total avec l'humain** | | **~0,19 €/annonce** |

**Variante "modération humaine à 100 %"** (choix de qualité/anti-fraude assumé) : **0,42 €/annonce** — le coût est multiplié par plus de deux, sans que l'infra bouge d'un centime.

→ **~80 % du coût marginal d'une annonce est humain.** Le levier de coût de LBT n'est donc pas l'infrastructure mais **le taux d'automatisation de la modération et la déflection du support**. C'est là qu'il faut investir en ingénierie, pas dans l'optimisation des serveurs.

#### Résultat n°4 — coût marginal par garage pro

Hypothèses : vitrine de 20 véhicules, 50 % de renouvellement mensuel (10 nouvelles annonces/mois), trafic par annonce ×2 vs particulier, 1 contact support de 15 min/mois, encaissement CB/SEPA européen ~1,5 % + 0,25 €.

| Poste | €/mois par garage |
|---|---|
| Coût marginal des annonces (10/mois × ~0,19 €) | 1,90 |
| Support pro dédié (15 min × 23 €/h) | 5,75 |
| Frais d'encaissement (sur un abonnement à 149 €) | 2,50 |
| **Total coût variable direct** | **~10 €/mois** |

**Repère : LBC facture 1 780 €/mois pour 20 véhicules. Le coût variable réel de LBT pour le même service est de ~10 €/mois.** La marge brute unitaire est de ~90 % dès 99 €/mois. **Le prix pro n'est donc en aucun cas contraint par les coûts d'infrastructure** — il est contraint par le nombre de pros nécessaires pour couvrir les coûts fixes.

#### Résultat n°5 — le vrai arbitrage : seuil de rentabilité, pas coût unitaire

Nombre de garages nécessaires pour couvrir les coûts fixes mensuels **F** à un prix pro **P** (marge unitaire = P − 10 €) :

| Coûts fixes mensuels | P = 99 € | P = 149 € | P = 199 € |
|---|---|---|---|
| **F = 15 000 €** (équipe réduite : 2 devs + 0,5 ETP modération/support + infra + outils) | 169 garages | **108 garages** | 79 garages |
| **F = 30 000 €** (équipe étoffée, an 2) | 337 garages | 216 garages | 159 garages |

**Cohérence avec le §2 :** l'objectif M12 de **200 garages abonnés** à 149 €/mois représente ~29 800 € de CA mensuel — de quoi financer une structure à ~28 000 €/mois de coûts fixes. L'objectif du §2 et une grille tarifaire à 149 € sont donc mutuellement cohérents. À 49 €/mois, il faudrait 385 garages pour la même structure : **casser le prix trop bas déplace la difficulté du produit vers la vente**, sans améliorer la marge unitaire (déjà à 90 %).

#### Conséquences directes sur les décisions en attente

1. **Prix pro (action §17 n°6)** : cadrage recommandé autour de **149 €/mois pour ~20 véhicules** (≈ 12× moins cher que LBC), à décliner en paliers. Aucun risque de marge unitaire ; l'argument est le seuil commercial, pas le coût.
2. **Friction-fee anti-fraude auto (§5)** : à 0,50-1 €, il couvre **2,5 à 5× le coût marginal complet d'une annonce**. Son dimensionnement doit donc se décider sur des critères d'**efficacité anti-fraude et d'acceptabilité**, jamais sur la couverture des coûts — et sa communication doit être irréprochable sous peine d'annuler l'argument "gratuité réelle".
3. **Gratuité particuliers** : économiquement soutenable sans réserve. À S3, l'ensemble des annonces particuliers coûte quelques milliers d'euros par mois, majoritairement en salaires de modération.
4. **Choix techniques (§14)** : deux options sont éliminées par ce modèle (Cloudflare Images en mode stockage, Algolia). L'action n°2 de la §17 peut donc se concentrer sur Meilisearch / Typesense / Elasticsearch auto-hébergés.

#### Limites et incertitudes assumées

- Le comptage exact des "images delivered" de Cloudflare Images (requêtes servies depuis le cache facturées ou non) n'a **pas pu être vérifié sur la documentation officielle** (403 sur `developers.cloudflare.com` depuis l'environnement d'exécution). Hypothèse haute retenue ; la conclusion ne change pas, l'architecture recommandée évite le poste entièrement.
- Le trafic par annonce (250 vues) et le débit de modération (80 annonces/h) sont des **hypothèses non sourcées**. Le premier a un impact quasi nul dans l'architecture retenue ; le second est le paramètre le plus sensible du modèle et doit être mesuré dès le pilote.
- Les tarifs Sightengine et Meilisearch Cloud proviennent d'agrégateurs tiers, pas des pages officielles. À revérifier avant tout engagement.

**À faire avant de figer les prix :** ce modèle est établi ; reste à définir les paliers d'abonnement pro (action §17 n°6) et le budget de coûts fixes réel (action §17 n°5), qui déterminent ensemble le seuil de rentabilité.

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
- **Images (arbitré le 2026-07-28, cf. §5.1)** : pré-générer les variantes (master 2048px, 1200px, vignette) **au moment du dépôt**, les stocker en object storage à egress nul (R2) et les servir derrière le CDN. Ne PAS utiliser un service facturé à la livraison ou à la transformation à la volée : l'écart est de ~40× au palier national, et cette architecture rend le coût insensible au trafic — condition d'un modèle gratuit côté particuliers.
- **Modération automatique = premier poste de coût variable technique** (~0,018 €/annonce, soit ~45 % du coût technique d'une annonce, cf. §5.1) : c'est le seul poste infra qui mérite une optimisation sérieuse (comparaison API commerciale vs modèle auto-hébergé).
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

*À construire progressivement par les sessions de travail quotidiennes (voir §17). Le volet "coûts variables" est chiffré depuis le 2026-07-28 (§5.1) ; le volet "coûts fixes" (équipe, budget par phase) reste à faire — c'est lui qui détermine le seuil de rentabilité.*

**Acquis du 2026-07-28 (§5.1) :** l'infra technique fixe reste modeste (~250-400 €/mois au palier régional M12 : 2 VPS applicatifs, Postgres managé, VM Meilisearch, monitoring, Brevo). Le poste dominant de la structure de coûts est **humain** : modération et support représentent ~80 % du coût marginal par annonce. Dimensionner l'équipe modération/support est donc un arbitrage plus structurant que n'importe quel choix d'hébergeur.

- Besoins humains par phase (dev, design, modération/support, commercial garages...)
- Quand et comment impliquer l'équipe RETRO+ (Fabien, les 3 ingénieurs 3IL, l'admin sys) vs recruter/externaliser spécifiquement pour LBT
- Besoins matériels/infra (hébergement, stockage images, coûts variables par annonce/par utilisateur)
- Budget prévisionnel par phase

## 14. Choix technologiques

*À trancher progressivement — ne pas figer avant d'avoir comparé les options. Point de départ : les skills déjà installés couvrent Cloudflare (Workers/D1/R2/Images) et Vercel/Next.js, deux stacks capables de scalabilité rapide sans lourdeur DevOps initiale, mais rien n'est encore choisi.*

- Stack backend/frontend
- Moteur de recherche (le cœur produit d'un site d'annonces — évaluer Meilisearch, Typesense, Elasticsearch. **Algolia écarté le 2026-07-28** : facturation à la requête de recherche, donc coût qui croît avec le trafic gratuit des particuliers — modèle économique incompatible avec le nôtre, cf. §5.1)
- Hébergement et scalabilité
- **Couche image — arbitré le 2026-07-28** : object storage à egress nul + variantes pré-générées au dépôt + CDN. Cloudflare Images en mode stockage Cloudflare écarté (facturation à la livraison, ~40× plus cher au palier national). Alternatives européennes valables si la souveraineté prime : Scaleway Object Storage (~0,011 €/Go-mois, hébergement France, ISO 27001/HDS) ou Bunny Storage+CDN (0,01 $/Go). Le poste étant à ~0,001 €/annonce, **le choix peut se faire sur la souveraineté plutôt que sur le prix**.
- Modération de contenu (outillage automatique + humain) — **poste variable n°1**, cf. §5.1 et action §17 n°11
- Paiement/escrow (si applicable, hors MVP)

## 15. Skills nécessaires au projet — veille & gestion

- Bibliothèque actuelle : 341 skills installés le 2026-07-26 (voir [[installed-skills-library]] en mémoire), audités et liés entre eux.
- Gap connu : pas de skill dédié "stratégie marketplace/anti-fraude" — comblé par ce document.
- **À faire en continu** : identifier les nouveaux besoins au fil du projet (ex. un skill précis sur le moteur de recherche choisi, sur la conformité DAC7, sur un framework retenu), rechercher s'il existe une ressource fiable, l'auditer avant installation (même processus de sécurité que le 2026-07-26 : pas d'installation sans vérification), et tenir cette section à jour avec ce qui a été ajouté et pourquoi.
- **Veille technologique** : suivre les évolutions techniques pertinentes (moteurs de recherche, frameworks marketplace, outils anti-fraude) pour garder les choix du §14 à jour plutôt que figés une fois pour toutes.
- **Besoins identifiés le 2026-07-28** (pour une session locale future, l'agent quotidien n'a pas accès au dossier de skills) :
  - Un skill **modération de contenu automatisée** (comparaison d'API, modèles auto-hébergés, seuils, workflow de revue humaine) — c'est le premier poste de coût variable du projet (§5.1), et aucun skill connu ne le couvre.
  - Un skill **FinOps / modélisation de coûts cloud** serait utile mais le travail du 2026-07-28 a été fait sans, à la main : priorité basse.
  - Un skill **Meilisearch** (ou sur le moteur finalement retenu) une fois l'action §17 n°2 tranchée.

## 16. Journal d'avancement quotidien

*Chaque session de travail (manuelle ou automatisée) ajoute une entrée datée ici : ce qui a été fait, ce qui a été décidé, ce qui reste ouvert.*

- **2026-07-27** — Création du document v1 (positionnement, concurrence, segments, modèle économique, UX, technique, légal, acquisition, roadmap, organisation, risques). Mise en place prévue d'un agent quotidien automatisé pour faire avancer le document en continu.
- **2026-07-28** — **Action §17 n°1 traitée : modèle de coût d'infrastructure par annonce et par pro** (nouvelle §5.1, tarifs sourcés en annexe). Cinq conclusions : (1) l'architecture image détermine tout — variantes pré-générées + object storage à egress nul = ~40× moins cher que Cloudflare Images au palier national, et coût insensible au trafic ; (2) le socle technique d'une annonce ne coûte que **~0,041 €** ; (3) le coût marginal réel est **~0,19 €/annonce dont ~80 % humain** (modération + support) — le levier de coût est l'automatisation de la modération, pas les serveurs ; (4) un garage pro coûte **~10 €/mois** en variable direct contre **1 780 €/mois facturés par LBC** pour le même périmètre : marge brute ~90 % dès 99 €/mois, le prix pro n'est pas contraint par les coûts ; (5) le vrai arbitrage est le seuil de rentabilité — à 149 €/mois et 15 k€/mois de coûts fixes, il faut **108 garages**, ce qui valide la cohérence de l'objectif M12 (200 garages) du §2. **Décisions techniques dérivées** : Algolia et Cloudflare Images (mode stockage) écartés du §14 ; recommandation de cadrage à 149 €/mois pour l'action n°6. **Découverte annexe** : sources secondaires indiquant que LBC a réduit les photos gratuites à 3 et limiterait les particuliers à 2 annonces auto gratuites/an — à confirmer (nouvelle action n°13), potentiel axe de différenciation à coût nul pour LBT.

## 17. File d'attente des prochaines actions (pour les sessions automatisées)

*Liste vivante. Chaque session quotidienne prend l'action la plus prioritaire encore "ouverte", la traite en profondeur, la marque "traitée" avec un résumé, ajoute une entrée au §16, et peut ajouter de nouvelles actions découvertes en cours de route. Une seule action approfondie par jour, pas un survol de plusieurs — la qualité prime sur le volume.*

1. [**traité 2026-07-28**] Modéliser le coût d'infrastructure par annonce/par pro pour fixer un prix pro réaliste (§5) → nouvelle §5.1. Coût marginal ~0,19 €/annonce (dont 80 % humain) et ~10 €/mois par garage pro. Le prix pro n'est pas contraint par les coûts mais par le seuil de rentabilité : 108 garages à 149 €/mois pour 15 k€/mois de coûts fixes. Architecture image et moteur de recherche partiellement arbitrés par le coût (§7, §14).
2. [ouvert] Comparer 3-4 moteurs de recherche candidats (Meilisearch, Typesense, Elasticsearch, natif Cloudflare) pour le cas d'usage annonces géolocalisées (§14) — **Algolia écarté le 2026-07-28** (facturation à la requête)
3. [ouvert] Détailler les obligations légales précises (LCEN, RGPD, identification vendeurs pro, DAC7) avec sources à jour (§8)
4. [ouvert] Étudier des cas comparables à l'étranger (sites d'annonces auto ayant réussi à se différencier d'un leader établi) pour en tirer des enseignements
5. [ouvert] Chiffrer un premier budget prévisionnel Phase 1 (MVP + lancement régional) (§13)
6. [ouvert] Définir précisément les paliers d'abonnement pro (nombre de véhicules, prix, options) en repère explicite face à la grille LBC actuelle (§5)
7. [ouvert] Rechercher si des skills spécifiques manquent pour le moteur de recherche/stack retenus, une fois choisis (§15)
8. [ouvert] Veille concurrentielle LBC — premier point structuré (prix, nouvelles fonctionnalités, communication) (§3)
9. [ouvert] Détailler le plan de recrutement des 10-20 premiers garages pilotes (script d'approche, argumentaire face à la frustration tarifaire LBC du 27/04/2026) (§9)
10. [ouvert] Étudier la faisabilité technique et légale du système d'avis/réputation vendeur (différenciateur confiance mentionné en §6)
11. [ouvert] **Priorité haute** — Comparer les options de modération automatique d'images à 250 k opérations/mois (API commerciales type Sightengine/Hive vs modèle open-source auto-hébergé vs Workers AI) : premier poste de coût variable technique du projet, ~0,018 €/annonce (§7, §14)
12. [ouvert] **Priorité haute** — Définir la politique de modération : taux d'échantillonnage humain, règles d'auto-validation, traitement des signalements, débit cible par modérateur. C'est le driver n°1 du coût marginal (0,058 à 0,29 €/annonce selon le taux de revue humaine) et un sujet de conformité (§8)
13. [ouvert] Vérifier sur sources officielles LBC les quotas particuliers 2026 : nombre de photos gratuites (3 ?) et nombre d'annonces auto gratuites par an (2 puis ~8 € ?) — impact direct sur l'argumentaire de différenciation (§3)
14. [ouvert] Modéliser la déflection du support (FAQ, self-service, réponses automatisées) : 2ᵉ poste du coût marginal par annonce (0,092 €, soit ~48 % du total) (§6, §13)
15. [ouvert] Vérifier les tarifs Sightengine, Meilisearch Cloud et Cloudflare Images sur leurs pages officielles (les chiffres du 2026-07-28 viennent d'agrégateurs tiers ; `developers.cloudflare.com` renvoyait un 403 depuis l'environnement d'exécution) et revalider le taux de change USD/EUR retenu (0,92)

---

## Annexe — Sources de la recherche marché (2026-07-26)

- LSA Conso — chiffres clés Leboncoin
- L'Essentiel de l'Éco — Leboncoin, l'envers d'une réussite française
- Adevinta — résultats annuels 2023
- leboncoinsolutionspro.fr — offres automobile
- Annu Moteurs — tarifs annonces Leboncoin 2026
- leboncoin corporate — communiqués de presse 20 ans

## Annexe — Sources tarifaires du modèle de coûts §5.1 (recherche web du 2026-07-28)

| Donnée retenue | Valeur | Source |
|---|---|---|
| Cloudflare R2 — stockage Standard | 0,015 $/Go-mois, **egress 0 $**, Class A 4,50 $/M, Class B 0,36 $/M | [EgressCost — Cloudflare R2 Pricing 2026](https://egresscost.com/cloudflare/), [Mecanik — R2 Pricing Explained](https://mecanik.dev/en/posts/cloudflare-r2-pricing-explained-real-costs-vs-s3-and-backblaze/) |
| Cloudflare Images | 5 $/100k images stockées + **1 $/100k images livrées** | [theimagecdn — Cloudflare Images Pricing 2026](https://theimagecdn.com/docs/cloudflare-images-pricing), [FlareCalc](https://flarecalc.com/calculators/images/) |
| Cloudflare Image Transformations | 5 000 transformations uniques offertes/mois, puis **0,50 $/1 000 uniques** | [Cloudflare Community — Understanding image transformation pricing](https://community.cloudflare.com/t/understanding-image-transformation-pricing/667692) |
| Cloudflare Workers Paid | 5 $/mois (10 M requêtes + 30 M ms CPU inclus), puis 0,30 $/M req et 0,02 $/M ms | [srvrlss.io — Cloudflare Workers Pricing 2026](https://www.srvrlss.io/provider/cloudflare/), [makerkit — calculateur](https://makerkit.dev/pricing-calculator/cloudflare) |
| Bunny Storage + CDN Europe | 0,01 $/Go stocké (par région) + 0,01 $/Go livré (réseau Standard) | [bunny.net — Storage pricing](https://bunny.net/pricing/storage/), [costbench — Bunny CDN Pricing 2026](https://costbench.com/software/cdn-edge/bunny-cdn/) |
| Scaleway Object Storage | ~0,01 €/Go-mois, +10 % au 1ᵉʳ juin 2026 (Standard Multi-AZ) ; France, ISO 27001 + HDS | [Silicon.fr — hausse des prix Scaleway](https://www.silicon.fr/cloud-1370/scaleway-hausse-prix-227020), [Journal du Net — pricing du stockage cloud](https://www.journaldunet.com/cloud/1423764-pricing-du-stockage-cloud-scaleway-prend-le-contre-pied-du-marche/) |
| Hetzner Cloud CCX23 (4 vCPU dédiés, 16 Go, 160 Go NVMe) | 24,49 €/mois | [whtop — Hetzner CCX23](https://www.whtop.com/plans/hetzner.com/128291), [costgoat — calculateur Hetzner](https://costgoat.com/pricing/hetzner) |
| Meilisearch Cloud | gratuit 10k docs ; Build 30 $/mois (100k docs) ; Grow 200 $/mois (1M docs) | [aiproductivity — Meilisearch Pricing 2026](https://aiproductivity.ai/pricing/meilisearch/), [buildmvpfast](https://www.buildmvpfast.com/alternatives/meilisearch) |
| Sightengine (modération image/texte) | Starter 29 $/mois pour 10k opérations ; **overage 0,002 $/opération** | [checkthat.ai — Sightengine Pricing 2026](https://checkthat.ai/brands/sightengine/pricing), [sightengine.com/pricing](https://sightengine.com/pricing) |
| Brevo (emails transactionnels) | à partir de 15 €/mois pour 20 000 emails → **0,00075 €/email** | [smtpedia — Brevo Pricing 2026](https://smtpedia.com/brevo-pricing/), [Hack'celeration — combien coûte Brevo](https://hackceleration.com/fr/labs/combien-coute-brevo) |
| Coût chargé d'un modérateur/agent support France | brut moyen ~26 350 €/an + ~40 % de charges ≈ 37 000 €/an ≈ **23 €/h** | [Indeed — salaire modérateur](https://fr.indeed.com/career/mod%C3%A9rateur/salaries), [expert-comptable-tpe — coût réel d'un salarié 2026](https://www.expert-comptable-tpe.fr/articles/cout-reel-travail-employe-smic-declare-en-france/) |
| Quotas photos/annonces LBC particuliers (**à confirmer**) | 3 photos gratuites ; auto : 2 annonces gratuites/an puis ~8 € | [Annu Moteurs — annonce Leboncoin payante en 2026](https://www.annumoteurs.net/annonce-leboncoin-payante-en-2026-tarifs-limites-et-astuces-cachees/), [assistance.leboncoin.info — pack photos supplémentaires](https://assistance.leboncoin.info/hc/fr/articles/360000388745-Comment-souscrire-au-Pack-Photos-suppl%C3%A9mentaires) |
