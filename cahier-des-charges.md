# Cahier des charges — LBT (lebontruc.fr / .com)
### Devenir un concurrent sérieux de LeBonCoin (LBC) en 24-36 mois

*Document vivant — dernière mise à jour : 2026-08-01. Porté par Nicolas Therond (PDG RETRO+), en phase de conception avec Claude. Pas encore d'équipe technique affectée.*

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
| Mois 12 | Auto national particuliers + premiers garages pros payants (objectif : **200 comptes pros *payants*** — soit ~300 comptes pros au total avec le palier gratuit ; **reformulé le 2026-08-01, §5.2** : « 200 garages abonnés » supposait implicitement que tous soient au palier médian à 149 €, ce qui surestimait le CA de ~10 %). Objectif produit associé, plus opérationnel : **5 contacts acheteurs qualifiés par garage et par mois** |
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
- **Le concurrent pertinent sur l'auto n'est pas seulement LBC (constat du 2026-08-02, §14.2 Résultat n°10)** : **La Centrale a déjà mis en production une recherche en langage naturel** (« j'ai trois enfants et je cherche une voiture spacieuse à moins de 15 000 € dans un rayon de 40 km autour de Marseille ») et revendique une vingtaine de cas d'usage IA en production, dont un assistant de pricing pour les professionnels depuis juin 2025. **Conséquence sur le positionnement : le différenciateur « LBT comprend mieux le français automobile » ne sera pas tenable face à La Centrale**, il ne l'est que face à LBC. L'avantage défendable reste le couple prix pro / garantie contacts (§5.2), pas la sémantique. À intégrer à la veille : suivre La Centrale au moins autant que LBC sur la verticale auto.

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
| Dépôt d'annonce | Gratuit, illimité en durée | Gratuit jusqu'à 3 véhicules en ligne (palier Découverte), abonnement au-delà — **arbitré le 2026-08-01, §5.2** |
| Modification | Gratuite (comme LBC aujourd'hui — ne pas réinventer une friction qui n'existe pas chez le concurrent) | Gratuite |
| Mise en avant / boost | Payant, prix d'appel < LBC (ex. 0,99-4,99€ vs 1,99-7,99€ chez LBC) | **Inclus en quota mensuel dans les paliers, jamais vendu à l'unité au MVP (§5.2)** |
| Anti-fraude auto | **Friction-fee symbolique ciblé uniquement sur l'auto** (montant à tester : 0,50-1€), justifié auprès de l'utilisateur comme mesure anti-arnaque, pas comme frais caché | — |
| Abonnement vitrine pro | — | **Grille arrêtée le 2026-08-01 (§5.2)** : 5 paliers à l'**emplacement** (véhicules en ligne), 0 / 79 / 149 / 249 / 399 € HT/mois, **sans engagement**, **garantie contacts** (« jamais plus de 30 € le contact, ou le mois est offert »). Repère LBC : 1 780 €/mois pour 20 véhicules = 89 €/véhicule |

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
| Moteur de recherche | 0,002 | ~50 €/mois budgétés. **Révisé le 2026-07-31 (§14.1)** : Typesense auto-hébergé sur un VPS 4 vCPU / 8 Go, **7 à 17 €/mois** — soit ~0,0006 €/annonce. Le poste reste inscrit à 0,002 € par prudence (marge × 3) |
| Modération automatique (10 images + texte) | ~~0,018~~ → **0,003** | ~~11 opérations × 0,002 $ (Sightengine)~~ — **révisé le 2026-07-29, cf. §7.1** : cascade auto-hébergée (25 €/mois) + VLM sélectif (53 €/mois) |
| Emails transactionnels | 0,006 | 8 emails × 0,00075 € (Brevo, 15 €/20 000) |
| **Sous-total technique** | ~~**~0,041 €**~~ → **~0,026 €** | |

**Tout le socle technique d'une annonce coûte 4 centimes**, dont près de la moitié en modération automatique d'images — de loin le premier poste variable "technique". **Mise à jour du 2026-07-29 (§7.1) :** l'architecture de modération retenue ramène ce poste de 0,018 à ~0,003 €/annonce, et le sous-total technique à **~0,026 €**. Le coût marginal total par annonce passe de 0,19 € à **~0,175 €**, dont ~85 % d'humain — la conclusion du Résultat n°3 est renforcée, pas modifiée. **Puis révisé à ~0,21 € le 2026-07-30** (§7.2) après prise en compte des files de modération légalement obligatoires : la part humaine monte à ~87 %.

#### Résultat n°3 — le coût marginal réel est humain

Coût chargé d'un modérateur/agent support en France : salaire brut moyen ~26 350 €/an (Indeed/Glassdoor 2026) + ~40 % de charges patronales ≈ **37 000 €/an chargé**, soit **~23 €/h** sur ~1 600 h travaillées.

| Poste | Hypothèse | €/annonce |
|---|---|---|
| Modération humaine | 20 % des annonces revues (flaggées + signalements), 80 annonces/h | ~~0,058~~ → **0,089** |
| Support utilisateur | 3 % des annonces génèrent un ticket de 8 min | 0,092 |
| **Total avec l'humain** | | ~~**~0,19 €/annonce**~~ → **~0,21 €** |

**Révision du 2026-07-30 (§7.2) :** ce chiffrage de la modération humaine était **incomplet** — il ne comptait que la revue proactive de 20 % des annonces et omettait trois files non compressibles, dont deux sont des **obligations légales** : le traitement des signalements (DSA art. 16), les réclamations (art. 20) et l'audit qualité par échantillonnage aléatoire. Le coût réel du scénario central est de **0,089 €/annonce (+53 %)**, et le coût marginal total de **~0,21 €/annonce dont ~87 % d'humain**. Aucune conclusion ci-dessous ne bascule (cf. §7.2, Résultat n°4).

**Variante "modération humaine à 100 %"** (choix de qualité/anti-fraude assumé) : **0,42 €/annonce** — le coût est multiplié par plus de deux, sans que l'infra bouge d'un centime.

→ **~80 % du coût marginal d'une annonce est humain.** Le levier de coût de LBT n'est donc pas l'infrastructure mais **le taux d'automatisation de la modération et la déflection du support**. C'est là qu'il faut investir en ingénierie, pas dans l'optimisation des serveurs.

#### Résultat n°4 — coût marginal par garage pro

Hypothèses : vitrine de 20 véhicules, 50 % de renouvellement mensuel (10 nouvelles annonces/mois), trafic par annonce ×2 vs particulier, 1 contact support de 15 min/mois, encaissement CB/SEPA européen ~1,5 % + 0,25 €.

| Poste | €/mois par garage |
|---|---|
| Coût marginal des annonces (10/mois × ~0,21 € — révisé le 2026-07-30) | 2,07 |
| Support pro dédié (15 min × 23 €/h) | 5,75 |
| Frais d'encaissement (sur un abonnement à 149 €) | 2,50 |
| **Total coût variable direct** | **~10,3 €/mois** |

**Repère : LBC facture 1 780 €/mois pour 20 véhicules. Le coût variable réel de LBT pour le même service est de ~10 €/mois.** La marge brute unitaire est de ~90 % dès 99 €/mois. **Le prix pro n'est donc en aucun cas contraint par les coûts d'infrastructure** — il est contraint par le nombre de pros nécessaires pour couvrir les coûts fixes.

#### Résultat n°5 — le vrai arbitrage : seuil de rentabilité, pas coût unitaire

Nombre de garages nécessaires pour couvrir les coûts fixes mensuels **F** à un prix pro **P** (marge unitaire = P − 10 €, révisé à P − 10,3 € le 2026-07-30 — sans effet sur les seuils ci-dessous) :

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

**À faire avant de figer les prix :** ce modèle est établi ; ~~reste à définir les paliers d'abonnement pro (action §17 n°6)~~ → **fait le 2026-08-01, cf. §5.2** ; reste le budget de coûts fixes réel (action §17 n°5), qui détermine avec la grille le seuil de rentabilité.

---

### 5.2 Paliers d'abonnement pro et options de visibilité (établi le 2026-08-01)

*Actions §17 n°6 et n°29, traitées ensemble comme le prescrivait la §14.1. Objet : transformer le cadrage « ~149 €/mois » du §5.1 en une grille commercialisable, et définir la politique de visibilité payante que le moteur devra servir. Sources en annexe — **la qualité des sources est très inégale sur ce sujet et c'est en soi un résultat**, cf. Limites.*

#### Résultat n°0 — la grille tarifaire auto de LBC n'a pas pu être établie, et c'est un problème de méthode à régler

Il faut le dire avant tout le reste : **aucune source fiable n'a permis de reconstituer la grille pro automobile de LBC.** Les trois pages qui la porteraient — `leboncoinsolutionspro.fr/automobile/`, l'article officiel du centre d'aide « Présentation des offres commerciales leboncoin pour les professionnels de l'Automobile » (`assistance.leboncoin.info`) et les CGV Pro (`leboncoin.fr/dc/cgv_pro`) — renvoient toutes un **403 de la politique réseau** de l'environnement d'exécution. LBC ne publie de toute façon ses tarifs pro que dans l'espace professionnel connecté.

Les montants qui circulent sur les agrégateurs (« Starter 29 €/mois pour 15-50 annonces », « Business 79 €/mois », « Pack Local 39 € HT ») sont **incohérents entre eux et de trois ordres de grandeur en dessous de la facture réelle de Nicolas** : ce sont vraisemblablement des packs génériques petites annonces, pas la grille automobile. **Ils ne doivent pas être utilisés.**

→ Le seul repère solide reste **la facture de Nicolas : 1 780 €/mois pour une vitrine de 20 véhicules**, soit **89 €/véhicule/mois**. C'est une source de première main, et c'est précisément l'avantage informationnel du projet. Mais son périmètre exact n'est pas documenté (HT ou TTC ? options de visibilité incluses ? engagement ? mono ou multi-région ?) — **et toute la §5.2 en dépend**. → action §17 n°33, la moins chère et la plus rentable de la file : relire une facture.

#### Résultat n°1 — un garage n'achète pas un abonnement, il achète des contacts. Le « ×12 moins cher » n'est pas une position défendable

C'est le recadrage central de l'action, et il contredit le raccourci retenu jusqu'ici dans ce document.

Le référentiel de prix réel du marché n'est pas la facture du portail, c'est le **coût par contact acheteur** (lead). Les données disponibles :

| Donnée | Valeur | Source |
|---|---|---|
| Taux de transformation d'un lead VO en vente | **15,9 %** (2022, contre 14,6 % en 2021) | Baromètre des leads Carvivo, via Journal Auto |
| Répartition des leads VO par source | LBC **103 774** contacts, La Centrale **74 610**, sites des concessionnaires **55 277** | idem — LBC ≈ **44 %** des leads de ces trois sources |
| Coût par lead considéré comme « bon tarif » dans l'automobile | **~35 € HT** (fourchette observée 5-120 € selon exclusivité et ciblage) | baromètre CPL sectoriel (agrégateur, non vérifié) |
| Marge brute d'un VO revendu à un particulier | **1 400 à 1 800 €**, soit 10-15 % du prix | agrégateurs, non vérifié |
| Marché VO France 2025 | **5,53 M** de voitures particulières d'occasion vendues (77 % des achats de VP), dont ~1,94 M via un professionnel | SDES / ministère, via recherche |

Appliqué au garage type du §5.1 (20 véhicules, 50 % de rotation, soit **10 ventes/mois**) :

- 10 ventes ÷ 15,9 % = **~63 contacts/mois nécessaires**, toutes sources confondues.
- Si LBC livrait la totalité de ces contacts : 1 780 € ÷ 63 = **28 €/contact** — *sous* le repère marché.
- Si LBC en livre sa part Carvivo (44 %, soit ~28 contacts) : 1 780 € ÷ 28 = **~64 €/contact** — ~1,8× le repère marché.

→ **LBC est cher d'un facteur ~2 au contact, pas d'un facteur 12.** Le facteur 12 est un rapport de factures ; le rapport de valeur est bien plus serré. Un garagiste sait compter en coût par contact : lui vendre « 12× moins cher » l'amènera à conclure, à juste titre, **« donc 12× moins d'audience »**. En B2B, un prix cassé annoncé comme tel est un signal de faible valeur, et LBT partira effectivement avec une audience faible : l'argument se retournerait immédiatement.

→ **Le seuil qui compte est ailleurs, et il est étonnamment bas.** Pour qu'un abonnement LBT à 149 €/mois revienne moins cher au contact que le repère marché de 35 €, il suffit que LBT livre **4,3 contacts qualifiés par mois**. Pour battre la borne haute de LBC (64 €/contact) : **2,3 contacts/mois**. Pour battre sa borne basse (28 €/contact) : **5,3 contacts/mois**.

**Cinq contacts qualifiés par garage et par mois : voilà le vrai objectif produit de la phase 1.** Au palier régional (20 garages pilotes), cela représente 100 contacts/mois à produire — un objectif d'audience concret, mesurable dès la première semaine, et bien plus opérationnel que « 500 annonces actives ».

#### Résultat n°2 — le blocage amont n'est pas le prix, c'est la multidiffusion

Deuxième découverte, et elle conditionne la mise en marché plus que la grille elle-même : **un garage ne saisit pas ses annonces à la main sur chaque portail.** Il pousse son stock via un outil de multidiffusion — **Ubiflow** (le plus installé), **Kepler VO**, **Stockway** pour l'utilitaire/industriel, ou le module de son logiciel de gestion (DMS) — qui génère un flux XML enrichi des photos et le transmet à chaque destination : LBC, La Centrale, ParuVendu Auto, Ouest-France Auto, son propre site vitrine.

Conséquences directes, dans les deux sens :

- **Si LBT n'est pas une destination de ces outils**, le coût d'entrée pour un garage n'est pas 149 €/mois : c'est **ressaisir 20 à 60 véhicules à la main, puis les maintenir à jour**. Aucune grille tarifaire, même gratuite, ne compense cela. C'est le vrai facteur bloquant de l'acquisition pro, et il n'apparaissait nulle part dans ce document.
- **Si LBT est une destination**, l'ajout de LBT au flux existant est **une case à cocher**. Le coût marginal d'essayer LBT tombe à zéro — et un palier gratuit devient alors quasi irrésistible, puisque le garage ne risque ni argent ni temps.

→ **Deux prérequis, à traiter avant toute action commerciale** (action §17 n°31) : (a) accepter dès le MVP un **flux d'ingestion standard** (XML/CSV + API REST, photos par URL) plutôt qu'imposer une saisie web ; (b) se faire référencer comme destination chez Ubiflow, Kepler VO et Stockway. Ce n'est pas du développement lourd, mais c'est un délai de partenariat à lancer tôt.

#### Résultat n°3 — la grille : l'emplacement, pas le crédit

**Unité de facturation retenue : l'emplacement, c'est-à-dire le nombre de véhicules simultanément en ligne.** Pas le crédit d'annonce, pas la publication à l'unité. Raison décisive : LBC vient de démontrer le contraire par l'exemple — la suppression des crédits à la carte le 27/04/2026 et le système de quota (où **un renouvellement d'annonce consomme le quota comme une publication**, et où republier pour tester un prix ou une photo gaspille des unités) est exactement la mécanique qui produit la colère exploitée en §9. L'emplacement est prévisible, se compte à vue et correspond à la façon dont un garage pense son stock.

**Grille proposée — prix HT/mois, sans engagement :**

| Palier | Véhicules en ligne | Prix HT/mois | €/véhicule/mois (au plafond) | vs LBC (89 €/véh.) | Contacts garantis/mois | € max/contact |
|---|---|---|---|---|---|---|
| **Découverte** | jusqu'à 3 | **0 €** | 0 | — | — | — |
| **Garage** | 4 à 15 | **79 €** | 5,27 € | **×17** | 3 | 26,3 € |
| **Garage+** | 16 à 30 | **149 €** | 4,97 € | **×18** | 5 | 29,8 € |
| **Concession** | 31 à 60 | **249 €** | 4,15 € | **×21** | 9 | 27,7 € |
| **Groupe** | 61 à 120 | **399 €** | 3,33 € | **×27** | 15 | 26,6 € |
| Au-delà de 120 | sur devis | ~2,50-3 €/véhicule | | | proportionnel | |

Le palier **Garage+ à 149 € correspond exactement au périmètre de la facture de Nicolas** (20 véhicules) : 7,45 €/véhicule contre 89 €, soit le **×12** du §5.1 — cohérence conservée avec le cadrage antérieur, à ceci près que ce ratio ne doit plus être l'argument de vente (Résultat n°1).

**Marge par palier**, en reprenant les coûts variables du §5.1 (0,21 €/annonce, support 23 €/h, prélèvement SEPA ~0,35 € au lieu de 1,5 % + 0,25 € en CB) :

| Palier | Nouvelles annonces/mois | Support inclus | Coût variable/mois | Marge brute |
|---|---|---|---|---|
| Découverte | ~1,5 | **aucun** (self-service strict) | **~0,30 €** | — |
| Garage | ~7 | 15 min | 7,6 € | **90 %** |
| Garage+ | ~12 | 15 min | 8,6 € | **94 %** |
| Concession | ~23 | 30 min | 16,7 € | **93 %** |
| Groupe | ~45 | 60 min | 32,8 € | **92 %** |

→ **Le palier gratuit ne coûte rien — à une condition, qui est une décision et pas un détail : pas de support humain dédié.** Avec support (5,75 €/mois), 500 comptes gratuits coûteraient **2 875 €/mois**, soit ~10 % de l'objectif de CA M12 ; sans support, **160 €/mois**. Le coût du palier gratuit est intégralement une décision de politique de support, pas une conséquence de l'infrastructure.

*Rappel de conformité (§8) : un vendeur professionnel doit être identifié comme tel indépendamment de tout paiement. Le palier gratuit ne dispense d'aucune obligation d'identification.*

#### Résultat n°4 — quatre règles de conception, dont une qui n'existe pas chez les concurrents

1. **Sans engagement, résiliable au mois.** LBC facture mensuellement *pendant 12 mois*. Le marginal d'un pro étant de ~10 €/mois, l'absence d'engagement ne coûte presque rien et constitue le contre-argument le plus direct au ressentiment identifié en §9. Contrepartie de trésorerie : **prépaiement annuel = 2 mois offerts** (−16,7 %).
2. **Tout inclus.** Les options de visibilité sont comprises en quota mensuel (Résultat n°5), jamais vendues en supplément aux pros au MVP. Facturer un abonnement *puis* la visibilité reproduit exactement la double facturation reprochée à LBC, et le §5.1 a montré que ces options ne coûtent rien à servir.
3. **Garantie contacts — l'engagement différenciant.** *« Si LBT ne vous apporte pas le nombre de contacts garantis de votre palier dans le mois, le mois est offert. »* Aux seuils de la grille, le prix maximum payé par contact est de **26 à 30 €** — toujours sous le repère marché de 35 € et sous les deux bornes estimées de LBC. La règle publiable est simple : **« jamais plus de 30 € le contact, ou c'est gratuit ».** Elle est honnête au démarrage (quand l'audience est faible, LBT ne facture pas — ce qui est de toute façon la seule position tenable), auto-calibrée par région, et son coût maximal est le coût variable d'un pro, soit ~10 €.
4. **Prélèvement SEPA par défaut**, carte en repli. Sur un abonnement à 79 €, la CB coûte 1,44 € contre ~0,35 € en SEPA — marginal en valeur absolue, mais c'est 1,4 point de marge sur le palier d'entrée, celui qui portera le volume.

#### Résultat n°5 — options de visibilité : la garantie contacts est aussi le garde-fou anti-sur-monétisation

**Décision : aucune option de visibilité vendue à l'unité aux professionnels au MVP.** Chaque palier inclut un quota mensuel de **remontées en tête de liste** (≈ 1 par tranche de 6 emplacements) : 2/mois pour Garage, 5 pour Garage+, 12 pour Concession, 25 pour Groupe. Côté **particuliers**, les boosts restent vendus à l'unité à 0,99-4,99 € (§5) : c'est là qu'est réellement le marché du boost à l'unité, et le grief tarifaire ne porte pas sur ce segment.

Trois mécaniques, adossées à ce que le moteur retenu sait faire (§14.1) :

| Mécanique | Implémentation Typesense | Statut MVP |
|---|---|---|
| **Remontée en tête** — regain temporaire de fraîcheur, décroissant sur 48 h | boost `_eval()` décroissant | **Oui**, en quota inclus |
| **Vitrine mise en avant** — la boutique du garage remonte sur les recherches locales | `_eval()` sur le champ vendeur + curation | **Oui**, incluse aux paliers Concession et Groupe |
| **Épinglage sur requête** — position achetée sur « Clio 5 diesel Nantes » | curation / pinning natif | **Non au MVP.** Réservé comme levier ultérieur : c'est la mécanique qui dégrade le plus vite la confiance de l'acheteur |

**Plafond de densité, à traiter comme une règle produit non négociable : au plus 1 résultat sponsorisé dans les 5 premiers, et 20 % maximum par page de résultats, toujours étiquetés « Sponsorisé ».**

Le raisonnement n'est pas moral, il est mécanique et c'est le point élégant de cette action : **la garantie contacts du Résultat n°4 rend la sur-monétisation directement coûteuse.** Saturer les pages de résultats dégrade la pertinence → l'acheteur contacte moins → le nombre de contacts livrés tombe sous le seuil garanti → **les mois deviennent gratuits**. Les deux décisions se verrouillent l'une l'autre : LBT ne peut pas s'enrichir en dégradant l'expérience acheteur, parce que sa propre grille le lui facture. C'est exactement le garde-fou qui a manqué à LBC.

*Point de conformité à vérifier (action §17 n°21) : les DSA art. 26 (identification claire de la publicité) et art. 27 (paramètres principaux des systèmes de recommandation à publier) relèvent de la Section 3, dont l'art. 19 exclut les micro et petites entreprises (§8). Ces deux obligations ne s'imposeraient donc probablement pas à LBT au démarrage — **mais l'étiquetage et la publication des règles de classement ne coûtent rien et sont cohérents avec l'art. 14, déjà applicable**. À faire par défaut plutôt qu'à décider plus tard sous contrainte.*

#### Résultat n°6 — correction de l'objectif du §2 : « 200 garages » ne fait pas 29 800 €

Le §5.1 a calculé le seuil de rentabilité en supposant **200 garages × 149 €**. Avec une grille à cinq paliers dont un gratuit, cette hypothèse est fausse : elle suppose que tous les pros sont au palier médian.

Mix hypothétique à M12 (répartition **non sourcée** — voir action §17 n°34), sur **200 comptes payants** :

| Palier | Part | Comptes | CA/mois |
|---|---|---|---|
| Garage (79 €) | 53 % | 106 | 8 374 € |
| Garage+ (149 €) | 29 % | 58 | 8 642 € |
| Concession (249 €) | 14 % | 28 | 6 972 € |
| Groupe (399 €) | 4 % | 8 | 3 192 € |
| **Total** | | **200** | **27 180 €** — ARPA **136 €** |

Marge unitaire moyenne : 136 − 10,2 = **125,8 €**. Seuil de rentabilité recalculé : **119 comptes payants** pour F = 15 000 €/mois (contre 108 en §5.1), **239** pour F = 30 000 €.

→ **Aucune conclusion du §5.1 ne bascule**, mais l'objectif du §2 doit être reformulé : **« 200 garages abonnés » devient « 200 comptes pros payants », soit environ 300 comptes pros au total** en comptant le palier Découverte. La nuance est exactement du même ordre que celle du 2026-07-30 sur la modération : une hypothèse implicite qui gonfle un objectif de ~10 %.

#### Séquence de mise en marché — la grille publiée dès le premier jour, la facturation déclenchée par la valeur

Le paradoxe du démarrage à froid est aussi un paradoxe tarifaire : au pilote, LBT ne livre pas de contacts, donc **aucun prix n'est justifiable**. La solution retenue n'est pas une promotion de lancement, c'est l'application littérale de la garantie du Résultat n°4 :

| Phase | Ce que paie un garage | Pourquoi |
|---|---|---|
| **M4-6 — pilote** | 0 €, **grille complète publiée dès le départ** | L'audience n'existe pas encore. Les 10-20 pilotes viennent du réseau personnel de Nicolas (§9) : leur cacher le prix futur détruirait la relation. On annonce le prix *et* la règle qui fait qu'il ne s'applique pas encore. |
| **M7-12 — ouverture régionale** | Facturation qui **s'active d'elle-même**, mois par mois, dès que le seuil de contacts garantis est franchi | Ce n'est pas une promotion qui expire — c'est un prix indexé sur la valeur livrée. Aucune négociation, aucune date couperet, aucun sentiment de piège. |
| **M13+** | Grille pleine, garantie **maintenue à titre permanent** | La garantie n'est pas un dispositif de lancement : c'est l'engagement de marque qui distingue durablement LBT de LBC. |

**Ne jamais ouvrir un entretien commercial par le prix.** L'ordre d'argumentation qui découle du Résultat n°1 : (1) la garantie contacts — « vous ne payez que si ça marche » ; (2) l'absence d'engagement ; (3) l'ajout au flux Ubiflow existant, sans ressaisie ; (4) *et seulement ensuite* le prix. Le tarif est l'argument de conclusion, jamais celui d'ouverture. → à intégrer au script d'approche de l'action §17 n°9.

#### Limites et incertitudes assumées

- **La grille pro de LBC n'a pas été établie** (Résultat n°0). Tout le comparatif repose sur une facture unique, non relue, dont on ignore si les 1 780 € sont HT ou TTC — un écart de 20 % sur le repère central. → action n°33.
- **Le repère de 35 € HT par lead n'est pas vérifié** : il provient d'un agrégateur dont la page est en 403, et la fourchette observée (5-120 €) est trop large pour être structurante. C'est pourtant le pivot du Résultat n°1. Une seule source solide suffirait à l'ancrer.
- **Les données Carvivo datent de 2022** — bonne presse professionnelle, mais quatre ans. Le taux de transformation et la répartition des sources de leads ont pu bouger, notamment avec la montée des sites propres des concessionnaires (55 277 leads déjà en 2022).
- **La répartition des pros par taille de stock n'est pas sourcée** : le mix de CA du Résultat n°6, donc le seuil de 119 comptes, en dépend entièrement. → action n°34.
- **La garantie contacts suppose un compteur incontestable.** Sans définition opposable du « contact qualifié » et sans instrumentation anti-fraude, elle devient une source de litige avec les clients plutôt qu'un argument. → action n°32, à traiter **avant** toute vente.
- **Le taux de conversion du palier gratuit vers les paliers payants est inconnu** et n'a pas d'équivalent public dans ce secteur. Si les pros restent massivement à 3 véhicules affichés pour ne pas payer, la grille se vide par le bas — risque à surveiller dès le pilote via la distribution réelle des stocks affichés.
- **Sources officielles inaccessibles depuis l'environnement d'exécution** (403 de la politique réseau, confirmé par le point de contrôle du proxy — il s'agit bien de refus de politique d'entreprise et non d'incidents) : `leboncoinsolutionspro.fr`, `assistance.leboncoin.info`, `leboncoin.fr/dc/cgv_pro`, `autoactu.com`, `clubic.com`, `fiches-auto.fr`, `dealabs.com`, `scalecity.fr`. La liste du §15 s'allonge : **l'ensemble du domaine leboncoin.fr est inaccessible**, ce qui rend toute veille concurrentielle sérieuse (action n°8) impossible depuis les sessions automatisées.

---

## 6. Exigences produit / UX

Parité d'ergonomie avec LBC = prérequis silencieux, pas un argument de vente. Fonctions attendues au MVP :
- Dépôt d'annonce en < 2 minutes (formulaire court, upload photos multiple, géolocalisation auto)
- Recherche et filtres rapides (prix, localisation/rayon km, marque/modèle/année pour l'auto, état, etc.)
- Messagerie intégrée acheteur-vendeur (ne pas exposer les coordonnées perso par défaut — argument confiance)
- Fiche "vitrine pro" pour les garages (comme l'E-Vitrine LBC, mais moins chère)
- **Ingestion d'un flux de stock VO (XML/CSV + API REST, photos par URL) dès le MVP — arbitré le 2026-08-01 (§5.2)** : un garage ne saisit pas ses annonces à la main, il pousse son stock via Ubiflow, Kepler VO, Stockway ou son DMS. Sans flux, le coût d'entrée réel n'est pas le prix de l'abonnement mais la ressaisie de 20 à 60 véhicules — **aucune grille tarifaire ne compense cela**. Ce n'est donc pas une fonctionnalité pro « avancée », c'est la condition d'existence du segment pro
- **Compteur de contacts qualifiés visible par le garage (§5.2)** : la garantie contacts (« jamais plus de 30 € le contact, ou le mois est offert ») n'a de valeur commerciale que si le pro voit le compteur en temps réel dans son espace, avec le détail des contacts décomptés
- **Étiquetage « Sponsorisé » et plafond de densité sur les résultats** : au plus 1 résultat sponsorisé dans les 5 premiers, 20 % maximum par page (§5.2)
- Système d'avis/réputation vendeur — argument de confiance différenciant sur l'auto (LBC n'a pas de système de notation robuste)
- **Floutage automatique de la plaque d'immatriculation au dépôt (arbitré le 2026-07-29, cf. §7.1)** : obligation de fait côté RGPD (position CNIL), protection du vendeur contre la « doublette » et l'annonce clone, **coût marginal nul** puisque le détecteur est déjà dans la chaîne de modération. **LBC ne le propose pas nativement** (les vendeurs passent par des applis tierces ou floutent à la main) → différenciateur produit gratuit, à afficher explicitement dans le parcours de dépôt.
- Signalement au dépôt des photos déjà vues ailleurs sur LBT (déduplication pHash) — protection acheteur contre l'annonce clone
- Notifications (nouvelle réponse, baisse de prix sur une recherche sauvegardée, etc.)
- **Publication immédiate comme engagement produit (arbitré le 2026-07-30, cf. §7.2)** : cible **médiane < 5 min, 95 % < 15 min**, et **publication par défaut** — le blocage avant publication est plafonné à 2 % des dépôts. Corollaire : le parcours doit assumer la modération *après* publication (statut visible de l'annonce, exposé des motifs en langage clair, bouton de réclamation) plutôt qu'une salle d'attente.
- **Formulaire de signalement public sur chaque annonce (obligation DSA art. 16)** avec accusé de réception et notification de la décision au signaleur — ce n'est pas une fonctionnalité optionnelle du MVP
- Version mobile web irréprochable dès le MVP (la majorité du trafic annonces est mobile) ; appli native à évaluer en phase 2
- **Comportement de la recherche — trois exigences arbitrées le 2026-08-02 (§14.2)** : (a) **zéro résultat assumé et explicite** plutôt que des résultats élargis en silence — le moteur sait retirer un mot de la requête pour éviter le zéro-résultat (« clio 3 diesel » → « clio 3 », affichant des essences sans le dire), ce comportement est désactivé (`drop_tokens_threshold=0`) et remplacé par un bouton **« élargir la recherche »** qui annonce ce qu'il abandonne ; le raisonnement n'est pas ergonomique mais financier — un résultat hors critère dégrade le ratio de la garantie contacts du §5.2. (b) **Ordre des facettes déduit du marché** : prix, marque/modèle, **énergie**, **boîte de vitesses**, km/année, carrosserie/places, puis confiance (garantie, première main, transmission) — la boîte automatique n'est plus un critère de niche (54 % des voitures neuves immatriculées en 2025) et **Crit'Air est un attribut affiché, pas un filtre de premier rang** (suppression des ZFE votée le 28/05/2025). (c) Une requête entièrement composée de mots vides (« voiture occasion ») **bascule sur la navigation par facettes** au lieu de renvoyer un zéro résultat.
- **Compteur de contacts qualifiés visible par le garage** — déjà exigé par la garantie du §5.2 (action §17 n°32) ; à croiser avec la métrique « contacts par vue de fiche » qui sert aussi d'indicateur de pertinence de la recherche (§14.2, Résultat n°11).

---

## 7. Exigences techniques

*Section à approfondir avec un profil technique (Fabien ou un développeur, une fois le concept validé) — ce qui suit est un cadrage de haut niveau, pas une architecture définitive.*

- Architecture : application web scalable, recherche full-text + filtres géographiques performants dès le départ (le moteur de recherche est le cœur du produit d'un site d'annonces)
- Hébergement : prévoir une infra capable de monter en charge sans refonte (auto-scaling) — plusieurs skills installés couvrent Cloudflare (Workers, D1, R2, Images) et Vercel/Next.js, pertinents pour un déploiement rapide et scalable sans lourdeur DevOps initiale
- **Images (arbitré le 2026-07-28, cf. §5.1)** : pré-générer les variantes (master 2048px, 1200px, vignette) **au moment du dépôt**, les stocker en object storage à egress nul (R2) et les servir derrière le CDN. Ne PAS utiliser un service facturé à la livraison ou à la transformation à la volée : l'écart est de ~40× au palier national, et cette architecture rend le coût insensible au trafic — condition d'un modèle gratuit côté particuliers.
- **Modération automatique — arbitré le 2026-07-29 (cf. §7.1)** : cascade auto-hébergée sur CPU (pHash/dedup, NSFW ViT, détection + floutage de plaques, OCR ciblé — ~25 €/mois, **sans GPU**) + appel à un modèle vision-langage **uniquement sur l'image de couverture et les images signalées** (~53 €/mois). ~0,003 €/annonce contre 0,018 € avec une API commerciale. Les API de modération du marché ne couvrent quasiment aucun de nos risques réels (photo volée, plaque, texte incrusté) — elles ne peuvent pas être le socle.
- **Politique et outillage de modération — arbitré le 2026-07-30 (cf. §7.2)** : quatre files (pré-modération, signalements art. 16, audit aléatoire, revue ciblée élastique) + file de réclamations ; **publier par défaut, bloquer par exception** (≤ 2 % des dépôts) ; back-office produisant un **enregistrement structuré par décision** (origine, moyens automatisés, base légale, motif envoyé — exigence art. 17), conservé 12 mois. Coût : **0,089 €/annonce**, 0,73 ETP au palier national.
- Modération de contenu : outillage (automatique + humain) pour détecter annonces frauduleuses/interdites dès le lancement — obligation légale, pas une option (voir §8)
- Paiement : si LBT propose un jour un paiement sécurisé/livraison (comme LBC depuis 2018 avec Adyen), prévoir l'intégration d'un prestataire de paiement agréé — hors MVP, à anticiper dans l'architecture
- SEO technique : indexation des annonces, pages géolocalisées, temps de chargement — condition de la stratégie d'acquisition gratuite (§9)

**Gap identifié :** aucun des 341 skills installés ne couvre spécifiquement "stratégie de liquidité marketplace / anti-fraude" — ce savoir-faire vit dans ce document, pas dans un skill générique.

### 7.1 Modération automatique des images — comparatif chiffré (établi le 2026-07-29)

*Action §17 n°11. Hypothèse de volume : palier S3 du §5.1 = 25 000 annonces/mois × 10 photos = **250 000 images/mois** + 25 000 textes. Conversion 1 USD = 0,92 EUR. Sources en annexe.*

#### Résultat n°1 — les API de modération commerciales ne couvrent quasiment aucun de nos risques réels

C'est la conclusion qui reconfigure toute l'action. Les API de modération du marché (Sightengine, Hive, AWS Rekognition, Azure Content Safety, Google Vision SafeSearch) sont conçues pour les réseaux sociaux et l'UGC grand public : **nudité, violence, armes, drogues, gore, contenu haineux, détection d'images générées par IA**. Or sur une verticale automobile, la nudité n'est pas le risque : elle est marginale.

Les risques réels d'une annonce auto, et leur couverture par ces API :

| Risque réel LBT | Couvert par une API de modération commerciale ? |
|---|---|
| **Photo volée / réutilisée** depuis une autre annonce (LBC, LaCentrale, un site étranger) — signature n°1 de l'arnaque à l'acompte | **Non.** Nécessite du **hachage perceptuel** (pHash/dHash/PDQ) contre notre propre base + éventuellement une recherche d'image inversée. Aucune API de modération ne le fait. |
| **Plaque d'immatriculation visible** — la CNIL indique qu'« en principe, un particulier ne peut pas publier sur internet la photographie d'un véhicule sans flouter sa plaque » (donnée personnelle au sens de l'art. 4-2 RGPD) | **Non.** Nécessite un détecteur de plaques + floutage. |
| **Visage / personne identifiable / n° de rue** en arrière-plan (RGPD) | Partiellement (détection de visages chez AWS/Azure), pas le floutage. |
| **Numéro de téléphone, e-mail, URL incrustés dans l'image** pour contourner la messagerie de la plateforme | **Non** pour la plupart ; nécessite de l'OCR (facturé en supplément chez Google/AWS). |
| **Photo d'écran / photo d'une autre annonce** (capture d'écran recadrée) | **Non.** |
| **Incohérence photo ↔ annonce** (une Clio annoncée, une Golf photographiée ; véhicule accidenté non déclaré) | **Non.** Nécessite un modèle vision-langage. |
| **Filigrane d'un concurrent** sur la photo | **Non.** |
| Nudité / violence / armes | **Oui** — c'est leur cœur de métier, et c'est notre risque le plus faible. |

→ **Le choix n'est donc pas « quelle API de modération ». Il faut construire une chaîne de traitement dont l'essentiel n'est pas achetable sur étagère.** Une API commerciale reste utile en filet de sécurité (contenu manifestement interdit sur une plateforme grand public), mais elle ne peut pas être le socle.

#### Résultat n°2 — comparatif des coûts au palier S3 (250 000 images/mois)

| Option | Tarif unitaire | Coût mensuel S3 | Ce qu'elle détecte |
|---|---|---|---|
| **Hive** (visual moderation) | 3,00 $/1 000 images | **~690 €** | NSFW, violence, armes, IA-généré. Pas de liste de prix publique (devis commercial). |
| **Sightengine** (retenu comme hypothèse en §5.1) | plan Pro 399 $/mois (200 k opérations) + 0,0015 $/op au-delà | **~470 €** (511 $) | NSFW, armes, offensif, IA-généré, OCR. 1 modèle sur 1 image = 1 opération → les coûts se cumulent par modèle activé. |
| **Google Cloud Vision** — SafeSearch | 1,50 $/1 000 unités (source officielle) | **~345 €** ; **+345 €** si l'on ajoute l'OCR (`Text Detection`, même tarif) | NSFW uniquement, sauf ajout d'autres features. |
| **AWS Rekognition** — Content Moderation | 0,001 $/image (1er million), 0,0008 $ au-delà | **~230 €** ; ×2 si l'on ajoute `DetectText` | NSFW/violence + détection de visages. ⚠️ Amazon a **arrêté le *Batch* Image Content Moderation pour les nouveaux clients au 30/04/2026** — l'API synchrone reste, mais à vérifier avant tout engagement. |
| **Azure AI Content Safety** — Image | 0,75 $/1 000 images | **~172 €** | NSFW, violence, automutilation, haine. Prix de référence : le tarif réel dépend de la région/devise (calculateur Azure). |
| **Cloudflare Workers AI** | 0,011 $/1 000 neurones | **non chiffrable de façon fiable** — le nombre de neurones par classification d'image n'a **pas pu être confirmé** sur la doc officielle (403 sur `developers.cloudflare.com` depuis l'environnement d'exécution). Les agrégateurs donnent des chiffres contradictoires (500 à 8 300 classifications pour 10 000 neurones/jour offerts), soit une fourchette de **3 à 55 €/mois** — écart trop large pour décider. | Classifieurs génériques + modèles vision-langage. |
| **Modèle vision-langage à l'appel — Claude Haiku 4.5** (1 $/MTok entrée, 5 $/MTok sortie) | ~1 190 tokens d'entrée pour une image redimensionnée en 768×768 (≈ (768×768)/750 = 786 tokens) + prompt ≈ 400, sortie ≈ 80 → **~0,0016 $/image** | **~300 €** si passé sur les 250 k images | **Tout le raisonnement sémantique** : cohérence photo↔annonce, photo d'écran, filigrane, texte incrusté, état du véhicule. C'est la seule option qui traite les risques du Résultat n°1 côté « compréhension ». |
| **Stack auto-hébergée sur CPU** (voir Résultat n°3) | 1 serveur dédié 4 vCPU (Hetzner CCX23, déjà sourcé en §5.1) | **~25 €** | pHash/dedup, NSFW, détection + floutage de plaques, OCR. |

Deux précisions sur le modèle vision-langage, qui changent son dimensionnement :
- **Le cache de prompt ne sert à rien ici** : le préfixe minimum cacheable sur Haiku 4.5 est de 4 096 tokens, or notre prompt de modération fait ~400 tokens. Padder le prompt pour déclencher le cache coûterait plus cher que l'économie.
- **L'API Batch (−50 %) n'est pas utilisable au dépôt** : la plupart des lots aboutissent en moins d'une heure, avec un maximum de 24 h — incompatible avec une modération à la publication (cible < 1 minute). Elle reste pertinente pour un **repasse nocturne d'audit** sur les annonces déjà publiées, à moitié prix.

#### Résultat n°3 — la stack auto-hébergée tient sur un seul serveur CPU à 25 €/mois, sans GPU

Les quatre traitements que les API ne fournissent pas sont tous réalisables avec des modèles ouverts, et — c'est le point non évident — **aucun ne nécessite de GPU au palier national** :

| Étage | Outil / modèle | Coût CPU estimé à 250 k images/mois |
|---|---|---|
| Déduplication / photo volée | `pHash` (GPLv3) ou `imagehash` (Python), ou **PDQ** (Meta, open-sourcé en 2019, empreinte 256 bits) — DCT sur image 32×32, robuste au recadrage léger, à la recompression JPEG et aux filigranes | quelques millisecondes/image, négligeable |
| Classification NSFW | `Falconsai/nsfw_image_detection` — ViT-base 224px, 98,04 % de justesse annoncée sur son jeu d'évaluation, Apache-2.0 ; exporté en ONNX INT8 | ~6 ms/image (p50, benchmark tiers sur Ryzen 7 5800H, INT8 vs 24,8 ms FP32) → **~25 min de CPU/mois** |
| Détection + floutage de plaques | YOLOv11 fine-tuné plaques (ex. `morsetechlab/yolov11-license-plate-detection`, entraîné sur 10 125 images Roboflow) + OpenCV pour le floutage | ~50 ms/image → **~3,5 h de CPU/mois** |
| OCR (téléphone/e-mail/URL incrustés) | PaddleOCR ou Tesseract, appliqué uniquement aux zones de texte détectées | ~0,3 s/image → **~21 h de CPU/mois** |

Total : **~25 h de CPU/mois**, alors qu'un seul cœur en fournit ~720 h. Un serveur 4 vCPU dédiés à 24,49 €/mois absorbe l'ensemble avec une marge de plus de 100×. **Un GPU (Scaleway L4 à 0,79 €/h ≈ 577 €/mois en continu, ou Hetzner GEX131 à 889 €/mois) n'est justifié que pour auto-héberger un modèle vision-langage — ce qui coûterait 7 à 20× plus cher que les ~50 €/mois de l'appel API équivalent. À ne pas faire.**

#### Résultat n°4 — architecture recommandée : cascade auto-hébergée + VLM sélectif

Au lieu de payer un modèle sur chacune des 250 000 images, on filtre en cascade et on ne paie que ce qui a besoin de compréhension sémantique :

| Étage | Sur quoi | Coût S3 |
|---|---|---|
| **0. Empreintes** — pHash de chaque image, comparaison à la base ; contrôle EXIF, dimensions, ratio de compression | 250 000 images | ~0 € |
| **1. Sécurité + conformité auto-hébergées** — NSFW (ViT), détection de plaques → **floutage automatique**, détection de visages, OCR ciblé | 250 000 images | inclus dans les 25 €/mois du serveur |
| **2. Compréhension sémantique (VLM à l'appel)** — cohérence photo ↔ marque/modèle/état déclarés, photo d'écran, filigrane concurrent, incohérence de lot | **1 image de couverture par annonce (25 000) + les images signalées par l'étage 1 (hyp. 5 % des 225 000 restantes = 11 250)** = 36 250 appels | 36 250 × 0,0016 $ ≈ 58 $ ≈ **~53 €** |
| **3. Revue humaine** | uniquement ce qui reste incertain — voir action §17 n°12 | §5.1 (0,058 €/annonce à 20 % de revue) |

**Coût technique total de la modération au palier S3 : ~78 €/mois, soit ~0,0031 €/annonce.**

#### Conséquences sur le modèle de coûts du §5.1

| Poste | §5.1 (2026-07-28) | Révisé (2026-07-29) |
|---|---|---|
| Modération automatique | 0,018 €/annonce (Sightengine, 11 opérations) | **0,003 €/annonce** |
| **Sous-total technique par annonce** | 0,041 € | **~0,026 €** |
| Coût marginal total par annonce (avec l'humain) | 0,19 € | **~0,175 €** → révisé à **~0,21 €** le 2026-07-30 (§7.2) |

L'économie absolue est modeste (~390 €/mois au palier national) et ne change **aucune** conclusion du §5.1 : le coût marginal reste humain à ~85 %, et le prix pro reste non contraint par les coûts. **La vraie valeur de cette architecture n'est pas le prix, c'est la couverture** : elle traite la photo volée, la plaque et le texte incrusté — les trois risques qu'aucune API commerciale ne couvre et qui sont, eux, existentiels pour la réputation d'une plateforme auto naissante.

#### Un différenciateur produit tombé de cette analyse

La détection de plaques étant déjà dans la chaîne pour raison légale, **le floutage automatique des plaques au dépôt ne coûte rien de plus — et LBC ne le propose pas nativement.** Les vendeurs LBC doivent passer par des applications tierces (Plakach, Redacted, FacePixelizer…) ou flouter à la main. Or laisser une plaque visible avec la marque, le modèle et l'année expose le vendeur à la **« doublette »** (usurpation de plaque) et donne à un fraudeur tout le nécessaire pour fabriquer une annonce clone. **« LBT floute votre plaque automatiquement »** est un argument de confiance concret, gratuit, immédiatement compréhensible, et opposable à LBC. À intégrer au §6 et à l'argumentaire du §9.

#### Limites et incertitudes assumées

- Les débits CPU (6 ms pour le ViT, 50 ms pour YOLOv11, 0,3 s pour l'OCR) sont des **ordres de grandeur issus de benchmarks tiers sur d'autres matériels**, pas des mesures sur notre stack. Même en se trompant d'un facteur 10, la conclusion « un serveur CPU suffit » tient (250 h/mois sur 720 disponibles). À mesurer au pilote.
- L'hypothèse de **5 % d'images signalées** à l'étage 1 (qui pilote le coût du VLM) n'est pas sourcée. À 20 % de signalement, l'étage 2 passerait à ~110 €/mois — sans remettre en cause l'architecture.
- Le calcul de tokens image de Haiku 4.5 (≈ (largeur × hauteur)/750) est un ordre de grandeur ; le tarif 1 $/5 $ par million de tokens est en revanche ferme.
- **Les taux de faux positifs et faux négatifs des modèles ouverts retenus n'ont pas été évalués sur des photos de véhicules françaises.** C'est le paramètre le plus décisif et il ne peut être obtenu que par mesure : un modèle de plaques qui rate 10 % des plaques crée une exposition RGPD, un modèle NSFW qui déclenche à tort sur des photos d'intérieur de véhicule crée du travail humain. → nouvelle action §17 n°16.
- Tarifs Hive, Sightengine (paliers Growth/Pro) et Azure issus d'agrégateurs tiers ; seuls **Google Cloud Vision** (page officielle) et les tarifs Claude sont confirmés à la source. Les pages Cloudflare, AWS Rekognition et Sightengine renvoient un 403 depuis l'environnement d'exécution.

### 7.2 Politique de modération — files, seuils, débits et coûts (établie le 2026-07-30)

*Action §17 n°12 (priorité haute). La §7.1 a défini **avec quoi** on modère ; la §7.2 définit **qui décide quoi, dans quel délai, et ce que ça coûte**. Volumes : paliers S1/S2/S3 du §5.1. Sources en annexe.*

#### Résultat n°1 — la base juridique de la modération n'est plus la LCEN, c'est le DSA

Point à corriger avant toute rédaction de CGU : **la loi SREN (n° 2024-449 du 21 mai 2024) a abrogé les dispositions générales de l'article 6 de la LCEN** relatives à la notification des contenus manifestement illicites à l'hébergeur (conditions de la connaissance présumée des faits, interdiction d'une obligation générale de surveillance, obligations de transparence et de mise en place d'un dispositif de signalement) ; l'ancien art. 6.I.8 est devenu l'art. 6-3. Le formalisme de notification « à la française » que l'on trouve encore dans beaucoup de modèles de CGU **n'a plus de fondement** : c'est le régime des **art. 6 et 16 et suivants du DSA** qui s'applique depuis le 17/02/2024. Écrire la politique de modération de LBT sur l'ancien modèle LCEN serait une non-conformité d'entrée de jeu.

Trois obligations s'imposent à LBT **dès la première annonce publiée**, indépendamment de sa taille (elles relèvent des Sections 1 et 2 du Chapitre III, non couvertes par l'exclusion micro/petite entreprise des art. 19 et 29 — cf. §8) :

| Article | Ce que ça impose concrètement à LBT | Traduction produit |
|---|---|---|
| **Art. 14 — conditions générales** | Décrire dans les CGU « les politiques, procédures, mesures et outils utilisés aux fins de la modération des contenus, **y compris la prise de décision fondée sur des algorithmes et le réexamen par un être humain** », en langage clair et dans un format accessible **et lisible par machine** | Le contenu de cette §7.2 doit être **publié**, pas seulement documenté en interne. Une politique de modération non publiée est une infraction à l'art. 14. |
| **Art. 16 — notification et action** | Mécanisme de signalement accessible, utilisable, **électronique**, permettant une notification suffisamment motivée (URL, motif, identité et e-mail du notifiant, déclaration de bonne foi) ; **accusé de réception sans retard indu** ; **notification de la décision** au notifiant, avec information sur les voies de recours ; traitement « en temps opportun, de manière diligente, non arbitraire et objective » | Un formulaire de signalement + **deux e-mails automatiques par signalement** (accusé de réception, décision). C'est un poste de coût technique et humain, à budgéter (cf. Résultat n°4). |
| **Art. 17 — exposé des motifs** | Toute décision de modération doit être notifiée à l'utilisateur concerné avec : les faits et circonstances, **si la décision découle d'un signalement (art. 16) ou d'une investigation d'initiative**, **si des moyens automatisés ont été utilisés**, la base légale ou la clause contractuelle invoquée, et les voies de recours | **Contrainte d'architecture directe** : l'outil de modération doit produire un enregistrement structuré par décision, pas un simple « supprimer ». Le champ « moyens automatisés : oui/non/partiellement » doit être renseigné par le système, pas ressaisi à la main. |

Deux obligations ne s'appliqueront **pas** tant que LBT est micro ou petite entreprise (art. 19), mais doivent être **conçues dès maintenant** — les rebrancher après coup coûte plus cher que de les prévoir :
- **Art. 20 — système interne de traitement des réclamations** : gratuit, électronique, ouvert **6 mois** après la décision, traité de façon diligente et non arbitraire, et **sous la supervision de personnel qualifié — pas uniquement par des moyens automatisés**.
- **Art. 23 — mesures contre les utilisations abusives** : suspension, **après avertissement préalable**, des utilisateurs qui fournissent fréquemment du contenu manifestement illicite, et **symétriquement** suspension du traitement des signalements émis par ceux qui envoient fréquemment des signalements manifestement infondés.

À noter enfin l'**art. 18** (applicable dès le jour 1) : obligation d'informer les autorités en cas de soupçon d'infraction pénale **menaçant la vie ou la sécurité des personnes**. Son déclencheur est étroit — une escroquerie à l'acompte n'entre pas dans ce champ. L'escalade des fraudes vers les autorités (plateforme **THÉSÉE** pour les e-escroqueries, PHAROS pour les contenus illicites) relève donc d'une politique interne, pas d'une obligation art. 18.

#### Résultat n°2 — le risque dominant est la **sur**-modération, pas la sous-modération

C'est le principe qui structure toute la politique, et il va à l'encontre de l'intuition « plateforme naissante = modérer serré ».

- L'**Appeals Centre Europe** (organe de règlement extrajudiciaire au sens de l'art. 21 du DSA) a publié en 2026 son 2ᵉ rapport de transparence : sur ~3 000 décisions où il a pu examiner le contenu, **il a donné tort à la plateforme dans 59 % des cas** — **52 % pour les décisions de retrait** et 63 % pour les décisions de laisser en ligne. Son premier rapport (nov. 2024 – août 2025) donnait raison à l'utilisateur dans **plus de 3 cas sur 4**. Ces chiffres portent sur des réseaux sociaux, pas sur des places de marché : ils ne sont pas transposables tels quels, mais ils établissent qu'**une décision de retrait sur deux est mal fondée chez des acteurs qui ont des équipes Trust & Safety de plusieurs milliers de personnes**.
- Le faux positif est le grief le plus documenté contre la modération automatique de LBC (annonce légitime supprimée par déclenchement algorithmique erroné, cf. §3 et annexe).
- L'asymétrie économique est brutale côté LBT : un **faux positif** coûte un vendeur perdu (probablement définitivement — nous n'avons aucun effet de réseau pour le retenir) **+ un ticket de support à 0,092 €** ; un **faux négatif** sur un risque non critique coûte un préjudice réputationnel diffus. Le calcul s'inverse uniquement sur les risques **existentiels** : escroquerie à l'acompte, plaque non floutée (exposition CNIL), contenu manifestement illicite.

→ **Règle directrice : publier par défaut, bloquer par exception.** Le blocage *avant* publication est réservé à des signaux dont la **précision mesurée** est élevée ; tout le reste est publié puis revu. Corollaire opérationnel : le **taux d'infirmation en réclamation devient un indicateur de calibration des seuils**, pas un indicateur de performance des modérateurs (cf. Résultat n°5).

#### Résultat n°3 — quatre files, dont une seule est élastique

Le paramètre « taux d'échantillonnage humain » de l'action n°12 était mal posé : ce n'est pas un taux à choisir, c'est le **résultat** d'un budget d'heures réparti sur quatre files dont trois sont non compressibles.

| File | Contenu | Volume | Revue humaine | SLA cible |
|---|---|---|---|---|
| **A — pré-modération (blocage)** | Annonces retenues avant publication sur un signal de niveau 1 | **cible ≤ 2 %** des dépôts | **100 %** | **< 4 h ouvrées**, médiane < 1 h |
| **B — signalements (art. 16)** | Signalements utilisateurs + injonctions d'autorités | hyp. **1 %** des dépôts (à mesurer) | **100 %** — obligation légale | **< 24 h** ; **< 4 h** pour les catégories graves (véhicule volé, faux papiers, contenu illicite) |
| **C — audit qualité par échantillonnage aléatoire** | Tirage aléatoire d'annonces **auto-validées** | **2 %** des auto-validées | **100 %** | hebdomadaire, hors flux |
| **D — revue ciblée par score (élastique)** | Annonces publiées dont le score de risque est entre T1 et T2, **priorisées par score × prix du véhicule** (le préjudice croît avec le prix) | variable, **scénario central 20 %** des dépôts | budget résiduel | **< 4 h** après publication |
| **R — réclamations (art. 20)** | Contestations des décisions défavorables | hyp. **15 %** des décisions défavorables | 100 %, **par une personne différente de celle qui a décidé** | **< 48 h** |

**La file C est le cœur du dispositif et c'est la moins intuitive.** Sans échantillon aléatoire d'annonces auto-validées, on ne connaît **jamais** le taux de faux négatifs : on ne voit que ce que les modèles ont attrapé et ce que les utilisateurs ont signalé — deux populations biaisées. La file C coûte 4 h/mois au palier national (voir Résultat n°4) et c'est elle qui produit la donnée nécessaire à la calibration des seuils **et** au jeu de test de l'action n°16.

#### Règles d'auto-validation et niveaux de signaux

**Auto-validation (publication immédiate) si TOUTES les conditions sont réunies :** aucun signal de niveau 1 ou 2 ; score composite < T1 ; empreinte pHash sans correspondance sous le seuil de Hamming avec une annonce active d'un **autre** compte ; contrôle de cohérence du VLM sur l'image de couverture conforme aux marque/modèle déclarés ; **et** au moins un signal de confiance sur le compte (ancienneté > 30 j, ou une annonce déjà validée, ou **moyen de paiement vérifié**).

| Niveau | Signaux | Décision |
|---|---|---|
| **1 — blocage avant publication** (file A) | Correspondance pHash **exacte** avec une annonce active d'un autre compte ; score NSFW > 0,98 ; véhicule signalé volé ; faux document (carte grise, contrôle technique) ; catégorie interdite | Retenue + revue humaine **avant** mise en ligne |
| **2 — publier + revue prioritaire < 4 h** (file D haute) | Prix < 50 % de la cote du modèle ; primo-vendeur **sans paiement vérifié** sur un véhicule > 15 000 € ; OCR détectant téléphone / e-mail / URL incrusté ; VLM signalant une incohérence photo ↔ annonce, une photo d'écran ou un filigrane concurrent | Publication immédiate, revue sous 4 h |
| **3 — publier + audit asynchrone** (file D basse) | EXIF absent ou incohérent, texte partiellement dupliqué d'une autre annonce, correspondance pHash **partielle** (Hamming intermédiaire) | Revue best-effort selon budget |
| **4 — traitement automatique, sans décision de modération** | **Floutage de plaque et de visage**, suppression des EXIF GPS, normalisation des images | Appliqué silencieusement, **jamais un motif de blocage** |

**Le niveau 4 est un choix de principe** : le floutage de plaque est un *traitement* que la plateforme applique, pas une faute que l'on reproche au vendeur. Une annonce n'est jamais bloquée parce qu'une plaque est visible — elle est floutée et publiée. Cela évite d'exposer LBT au pire des deux mondes (une friction pour l'utilisateur **et** un risque RGPD si le modèle rate la plaque).

**Le « paiement vérifié » comme signal de modération** — conséquence non anticipée du friction-fee anti-fraude du §5 : sa valeur réelle n'est pas budgétaire (à 0,50-1 €, il couvre 2,5 à 5× le coût marginal d'une annonce, cf. §5.1), elle est **informationnelle**. Une empreinte bancaire vérifiée est un signal d'identité plus fiable que n'importe quel modèle de vision, et c'est lui qui permet d'auto-valider massivement au lieu de mettre en file. **Le friction-fee doit donc être dimensionné et communiqué comme un mécanisme de confiance qui accélère la publication** (« annonce vérifiée, en ligne immédiatement ») — pas comme une taxe. C'est aussi ce qui le rend acceptable.

#### Résultat n°4 — chiffrage : la modération complète tient dans 0,7 ETP au palier national

Débits retenus (hypothèses de travail, à mesurer au pilote — c'est le paramètre le plus sensible du modèle, déjà signalé en §5.1) : revue d'annonce **45 s** (80/h) ; traitement d'un signalement **3 min** (20/h) ; audit qualité **30 s** (120/h) ; réclamation **6 min** (10/h). Base : 1 ETP = 1 600 h/an = **133 h/mois**, coût chargé **23 €/h** (§5.1).

| Palier | Files fixes A+B+C+R | + file D à 20 % | **Total h/mois** | ETP | €/mois | **€/annonce** |
|---|---|---|---|---|---|---|
| **S1 — pilote (250 annonces/mois)** | 0,3 h | 0,6 h | **~1 h** | 0,01 | ~22 € | 0,089 |
| **S2 — régional (2 500/mois)** | 3,4 h | 6,3 h | **~9,7 h** | 0,07 | ~223 € | 0,089 |
| **S3 — national (25 000/mois)** | 34 h | 62,5 h | **~97 h** | **0,73** | ~2 222 € | 0,089 |

Trois variantes au palier S3, pour cadrer l'arbitrage :

| Scénario | h/mois | ETP | €/mois | €/annonce |
|---|---|---|---|---|
| **Minimal** — files légales seules (A+B+C+R), aucune revue proactive | 34 | 0,26 | 784 € | 0,031 |
| **Central** — + 20 % de revue ciblée | 97 | 0,73 | 2 222 € | **0,089** |
| **Maximal** — 100 % des annonces revues avant ou après publication | 336 | 2,5 | 7 736 € | 0,309 |

**Correction du §5.1 :** le modèle du 2026-07-28 chiffrait la modération humaine à **0,058 €/annonce** (20 % des annonces × 0,29 € par revue). Il **omettait les trois files non compressibles** — signalements, réclamations et audit qualité — qui sont pour deux d'entre elles des **obligations légales** (art. 16 et 20), pas des options. Le coût réel du scénario central est de **0,089 €/annonce, soit +53 %**.

| Poste | §5.1 (28/07) | §7.1 (29/07) | **Révisé (30/07)** |
|---|---|---|---|
| Technique | 0,041 € | 0,026 € | 0,026 € |
| Modération humaine | 0,058 € | 0,058 € | **0,089 €** |
| Support utilisateur | 0,092 € | 0,092 € | 0,092 € |
| **Coût marginal par annonce** | 0,19 € | 0,175 € | **~0,21 €** |
| Part humaine | ~80 % | ~85 % | **~87 %** |

**Aucune conclusion du §5.1 ne bascule** : le coût marginal par garage pro passe de ~10,0 à ~10,3 €/mois (10 annonces × 0,21 € + 5,75 € de support pro + 2,50 € d'encaissement), la marge brute reste de ~93 % à 149 €/mois et le seuil de 108 garages est inchangé. En revanche **la trajectoire d'effectif se précise** : au palier S3, modération (0,73 ETP) + support (750 tickets × 8 min = 100 h = 0,75 ETP) ≈ **1,5 ETP**, soit ~4 600 €/mois chargés. L'hypothèse « 0,5 ETP modération/support » du scénario F = 15 000 €/mois (§5.1, Résultat n°5) est cohérente jusqu'au palier régional, **mais pas au palier national** : à retenir pour l'action n°5 (budget prévisionnel).

#### Résultat n°5 — au pilote, on revoit 100 % des annonces, et ce n'est pas par prudence

Le scénario « maximal » coûte **3,4 h/mois au palier S1** — moins d'une demi-journée, ~78 €. À ce prix, la question n'est pas de savoir si on peut se le payer, mais ce qu'on en retire :

1. C'est la seule façon de **mesurer la prévalence réelle** des fraudes et infractions sur notre propre trafic — chiffre dont personne ne dispose et qui conditionne tous les seuils.
2. Cela **produit le jeu de données étiqueté** dont l'action n°16 a besoin pour mesurer les taux de faux positifs/négatifs des modèles de la §7.1. Les deux actions convergent : le pilote *est* la campagne de mesure.
3. Cela permet de calibrer les seuils T1/T2 **sur des données réelles** au lieu de les fixer a priori.

→ **Politique retenue : 100 % de revue humaine jusqu'à ~1 000 annonces/mois, puis bascule progressive vers le scénario central**, la bascule étant conditionnée à une précision mesurée et non à une date. Nicolas — garagiste — est ici le modérateur le plus qualifié disponible : juger si une annonce auto est plausible (prix, cohérence modèle/kilométrage/état, plausibilité du vendeur) exige une connaissance du marché français de l'occasion que ni un modèle ni un prestataire offshore n'ont.

#### Résultat n°6 — faire ou acheter : garder la modération en interne au moins jusqu'au palier régional

Les benchmarks du marché (agrégateurs, fiabilité moyenne) situent la **revue humaine externalisée à 0,05-0,15 $ par élément** contre **0,29 € par annonce revue en interne** (23 €/h ÷ 80/h) — soit un facteur 2 à 6 en faveur du BPO, obtenu par l'arbitrage salarial offshore. Ce n'est pas le bon arbitrage ici :

- Le jugement demandé (« cette annonce de Clio à 3 500 € est-elle une arnaque ? ») est **spécifique au marché français de l'occasion**. C'est exactement ce qu'un prestataire généraliste n'a pas, et exactement l'avantage de LBT.
- L'art. 20 exige que les réclamations soient traitées **sous la supervision de personnel qualifié**. Externaliser la file R sans supervision interne est un risque de conformité.
- Le volume ne le justifie pas : 0,73 ETP au palier national. Un BPO qui économise 60 % sur 2 200 €/mois fait gagner ~1 300 €/mois, au prix d'une perte de qualité sur le cœur du produit.

→ **Décision : files A, B et R en interne à tous les paliers. Seule la file D (élastique, à faible enjeu) est externalisable en débordement, et seulement à partir du palier national.**

#### Journalisation des décisions (contrainte art. 17) et données personnelles

Chaque décision de modération doit produire un enregistrement structuré, exigence directement issue de l'art. 17 :

`id_décision`, `id_annonce`, `id_utilisateur`, `horodatage`, `type` (blocage avant publication / retrait / restriction de visibilité / suspension de compte / refus de signalement), `origine` (**signalement art. 16 / initiative propre / injonction d'autorité**), `moyens_automatisés` (**non / partiels / entièrement**), `règle_déclenchée` + score, `base` (clause des CGU **ou** fondement légal), `motif_utilisateur` (texte de l'exposé des motifs envoyé), `agent`, `réclamation_liée`, `résultat_réclamation`.

Deux points d'attention :
- **Rédiger des exposés des motifs en langage clair, par modèle et par motif.** « Votre annonce ne respecte pas nos règles » ne satisfait pas l'art. 17 (les faits et circonstances doivent être exposés) et alimente mécaniquement la file R.
- **Conservation : 12 mois.** L'art. 20 ouvre la réclamation pendant 6 mois ; il faut pouvoir instruire une réclamation déposée au 6ᵉ mois, plus la durée d'un éventuel litige. Ces journaux contiennent des données personnelles : durée de conservation à déclarer, finalité limitée à la modération et à la défense de nos droits.

#### Indicateurs de pilotage et seuils d'alerte

| Indicateur | Cible | Interprétation si hors cible |
|---|---|---|
| Taux de blocage avant publication (file A) | **≤ 2 %** des dépôts | > 3 % : seuil T2 trop bas → on détruit du dépôt légitime |
| Précision par règle de niveau 1 | **> 90 %** | Sous 90 %, la règle sort du blocage a priori et redescend en file D |
| Taux d'infirmation en réclamation (file R) | **< 20 %** | > 20 % : **problème de calibration des seuils**, pas de performance des modérateurs (cf. Résultat n°2) |
| Prévalence mesurée par l'audit (file C) | à établir au pilote | C'est la seule mesure non biaisée du taux de faux négatifs |
| Délai médian de publication | **< 5 min**, 95 % < 15 min | Repère concurrent : une source secondaire non vérifiée attribue à LBC 92 % d'annonces validées en < 15 min, 6 % en 2-24 h, 2 % en > 24 h |
| Délai de traitement des signalements | médiane < 6 h, 95 % < 24 h | Obligation art. 16 (« sans retard indu ») |
| Backlog des files A et B en fin de journée | **0** | Un backlog sur A retarde des publications, sur B c'est un manquement DSA |
| Coût de modération par annonce | **≤ 0,09 €** | Au-delà, la file D absorbe trop : resserrer T1 ou automatiser davantage |

#### Sanctions graduées et anti-abus (conception art. 23, applicable plus tard)

- **Vendeurs** : 1ᵉʳ manquement → avertissement + exposé des motifs ; 2ᵉ → suspension du dépôt 7 jours ; 3ᵉ → suspension du compte, **toujours après avertissement préalable** et avec voie de réclamation ouverte. Contenu manifestement illicite (véhicule volé, faux papiers) → suspension immédiate, sans gradation.
- **Signaleurs** : suspension du traitement des signalements après avertissement en cas de signalements manifestement infondés répétés. Nécessaire dès le lancement dans un contexte concurrentiel : le signalement de masse entre garages concurrents est un risque prévisible sur une place de marché auto.

#### Limites et incertitudes assumées

- **Trois hypothèses de volume ne sont pas sourcées et pilotent tout le chiffrage** : taux de signalement (1 % des dépôts), taux de réclamation (15 % des décisions défavorables) et débits par tâche (45 s / 3 min / 30 s / 6 min). Aucune donnée publique n'a été trouvée sur le taux de signalement d'une place de marché d'annonces — le rapport de transparence DSA de LBC France existe mais **son hébergeur `img.leboncoin.fr` est bloqué par la politique réseau de l'environnement d'exécution** ; les rapports DSA d'eBay (`static.ebayinc.com`) le sont également. → action §17 n°25.
- Les taux d'infirmation de l'Appeals Centre Europe (59 % global, 52 % sur les retraits) portent sur des **réseaux sociaux** : ils fondent le principe d'asymétrie du Résultat n°2, pas une cible chiffrée pour LBT.
- Les seuils numériques proposés (T1/T2, prix < 50 % de la cote, véhicule > 15 000 €, NSFW > 0,98, 2 % d'audit) sont des **points de départ à recalibrer sur les données du pilote**, pas des valeurs démontrées.
- Le comparatif « faire ou acheter » repose sur une fourchette de prix BPO issue d'agrégateurs (0,05-0,15 $/élément), sans devis. À revérifier si l'externalisation devient d'actualité.
- **Sources officielles inaccessibles depuis l'environnement d'exécution** (403 de la politique réseau) : `eur-lex.europa.eu`, `www.legifrance.gouv.fr`, `www.cnil.fr`, `huggingface.co`, `img.leboncoin.fr`, `static.ebayinc.com`. Le texte du DSA a donc été travaillé via des sites miroirs du règlement (dsa-act.eu, dsa-library.com, eu-digital-services-act.com, doctrine.fr) et des analyses de cabinets d'avocats. **Les articles cités doivent être revérifiés sur EUR-Lex lors d'une session locale** avant rédaction des CGU. → action §17 n°21.

---

## 8. Confiance, sécurité & conformité légale

**À ne pas sous-estimer — c'est ce qui peut bloquer un lancement, pas le manque de code.**
- Statut d'hébergeur vs éditeur de contenu (loi LCEN) : obligations de modération et de retrait rapide de contenu illicite
- RGPD : données personnelles des utilisateurs (comptes, messages, localisation)
- Identification des vendeurs professionnels (obligation légale en France depuis 2023 pour les places de marché en ligne)
- Obligations fiscales de déclaration (type DAC7) si LBT facilite des transactions entre particuliers au-delà de certains seuils
- CGU/CGV adaptées, notamment sur la responsabilité en cas de fraude entre utilisateurs

**Découvertes du 2026-07-29** (en marge de l'action n°11 ; le traitement complet reste l'action §17 n°3) :
- **Plaques d'immatriculation = données personnelles.** La CNIL indique qu'« en principe, un particulier ne peut pas publier sur internet la photographie d'un véhicule sans flouter sa plaque d'immatriculation », la plaque permettant d'identifier indirectement le propriétaire (art. 4-2 RGPD). Les seules exceptions relèvent d'une mission d'intérêt public (avis de recherche). **Conséquence pour LBT : le floutage automatique au dépôt n'est pas une option produit, c'est une mesure de conformité** — et il est intégré à l'architecture de modération (§7.1) pour un coût marginal nul.
- **DSA (règlement 2022/2065, pleinement applicable depuis le 17/02/2024), sanctions jusqu'à 6 % du CA mondial, ARCOM comme autorité en France.** Deux blocs à distinguer :
  - **Applicable à LBT dès le premier jour** (Section 2, services d'hébergement) : mécanisme de **notification et action** permettant à toute personne de signaler un contenu illicite (art. 16), et **motivation** de chaque décision de modération communiquée à l'utilisateur concerné (art. 17). → contrainte d'architecture directe : l'outillage de modération doit produire et conserver une décision motivée par action, pas seulement supprimer.
  - **Probablement non applicable au démarrage** : l'**art. 19 exclut les micro et petites entreprises** des obligations de la Section 3 (dont le rapport de transparence annuel et la transmission des décisions à la base de données de transparence de la Commission, art. 24 — à l'exception de l'art. 24(3)) ; l'**art. 29** exclut de même les micro/petites entreprises des obligations Section 4 propres aux places de marché (traçabilité des vendeurs professionnels). **L'exclusion se prolonge 12 mois après la perte du statut** — donc le passage de seuil est une échéance à anticiper, pas une surprise. → nouvelle action §17 n°17.

**Découvertes du 2026-07-30** (action n°12, §7.2) — deux corrections importantes de cette section :
- **La LCEN n'est plus la base juridique de la modération.** La **loi SREN n° 2024-449 du 21 mai 2024** a abrogé les dispositions générales de l'article 6 de la LCEN sur la notification des contenus manifestement illicites (connaissance présumée des faits, interdiction d'une obligation générale de surveillance, obligations de transparence et dispositif de signalement) ; l'ancien art. 6.I.8 est devenu l'art. 6-3. **Ce sont les art. 6 et 16 et suivants du DSA qui s'appliquent.** Toute rédaction de CGU ou de procédure de signalement calquée sur l'ancien formalisme LCEN serait non conforme. Le statut d'hébergeur reste pertinent (régime de responsabilité, retrait prompt dès connaissance effective), mais sa source est désormais l'art. 6 du DSA.
- **L'art. 14 du DSA impose de publier la politique de modération**, y compris la description de la prise de décision algorithmique et du réexamen humain, en langage clair **et dans un format lisible par machine**. Cette obligation s'applique à **tous** les fournisseurs de services intermédiaires, sans exclusion pour les petites entreprises : la §7.2 est donc un document destiné à être publié, pas seulement un document interne.
- **Art. 18** : l'obligation d'informer les autorités est limitée aux soupçons d'infraction **menaçant la vie ou la sécurité des personnes** — une escroquerie à l'acompte n'entre pas dans ce champ. L'escalade des fraudes (THÉSÉE pour les e-escroqueries, PHAROS pour les contenus illicites) relève d'une politique interne à définir, pas d'une obligation art. 18.

**Action :** prévoir un point avec un juriste (ou Fabien s'il a la compétence) avant le lancement public, pas après. **Priorité confirmée le 2026-07-30 :** les art. 14, 16 et 17 du DSA imposent des livrables rédactionnels (CGU, formulaire de signalement, modèles d'exposé des motifs) qui conditionnent l'ouverture publique — ils sont sur le chemin critique du lancement, au même titre que le code.

---

## 9. Stratégie d'acquisition / bootstrap (résoudre le problème de démarrage à froid)

1. **Hyper-local d'abord** : concentrer les premières annonces sur la région de Nicolas plutôt que viser le national — la densité perçue convainc plus qu'une couverture large et vide.
2. **Levier `collectionneur.net`** : trafic croisé dès le lancement (bannière, mention, newsletter existante) même si la verticale initiale (auto) diffère — capitaliser sur l'audience existante plutôt que partir de zéro.
3. **Réseau personnel de garagistes** : Nicolas peut recruter les 10-20 premiers garages pros pilotes directement via ses relations professionnelles — bien plus efficace qu'une acquisition froide.
4. **SEO dès le jour 1** : les skills `seo-audit`, `programmatic-seo`, `seo-keyword-cluster-builder` sont directement mobilisables pour construire la visibilité organique en parallèle du produit.
5. **Frustration LBC pro comme argument commercial** : le changement tarifaire du 27/04/2026 (suppression des crédits à la carte) est un point d'entrée concret pour démarcher des garages mécontents. Le mécanisme précis à exploiter (identifié le 2026-08-01) : sous le système de quota, **un renouvellement d'annonce consomme une unité comme une publication**, et republier pour tester un prix ou de nouvelles photos gaspille du quota — c'est-à-dire que LBC facture au garage le fait de bien faire son métier. Des professionnels retirent publiquement leurs annonces (cas cité : Brochard Automobile, « hausses répétées difficilement justifiables »).
6. **Se référencer chez les multidiffuseurs AVANT de démarcher (ajouté le 2026-08-01, §5.2)** : Ubiflow, Kepler VO et Stockway sont les tuyaux par lesquels le stock des garages arrive sur les portails. Tant que LBT n'en est pas une destination, chaque signature exige une ressaisie manuelle du stock et le pilote plafonnera au réseau personnel de Nicolas. Une fois destination, essayer LBT est **une case à cocher** — et le palier gratuit devient sans risque pour le garage. C'est le levier d'acquisition pro au meilleur rapport effort/résultat de toute cette section.
7. **Ordre d'argumentation imposé (§5.2)** : garantie contacts → sans engagement → ajout au flux existant → *et seulement ensuite* le prix. Ouvrir sur « 12× moins cher que LBC » fait entendre « 12× moins d'audience », ce qui sera vrai au démarrage.

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
| Fraude sur l'auto ternit la réputation avant même le lancement | Friction-fee ciblé + modération humaine dès le MVP, pas en rattrapage. **Ajout du 2026-07-29 :** déduplication par hachage perceptuel dès le jour 1 (§7.1) — la photo réutilisée est la signature n°1 de l'annonce frauduleuse et aucune API de modération ne la détecte |
| Exposition RGPD par les photos elles-mêmes (plaques, visages, adresses) — risque de plainte CNIL indépendant de toute fraude | Floutage automatique des plaques et des visages au dépôt, intégré à la chaîne de modération (§7.1, §8). Le taux de détection du modèle devient un indicateur de conformité, à mesurer avant lancement (action §17 n°16) |
| Dilution : vouloir couvrir trop de verticales trop vite | Discipline de phasage (§4) — collection seulement après l'auto, pas en parallèle dès le M1 |
| **Sur-modération : destruction du dépôt légitime par excès de zèle algorithmique** — risque dominant identifié le 2026-07-30 (l'Appeals Centre Europe infirme **52 % des décisions de retrait** des plateformes qu'il examine). Sans effet de réseau, un vendeur injustement bloqué est perdu définitivement | Principe « publier par défaut, bloquer par exception » (§7.2) : blocage a priori plafonné à 2 % des dépôts, précision > 90 % exigée pour toute règle de blocage, taux d'infirmation en réclamation traité comme un indicateur de **calibration des seuils** |
| Aspect juridique sous-estimé | Point juridique avant lancement public (§8), pas après un incident. **Précisé le 2026-07-30** : la base juridique a changé (loi SREN 2024 → DSA art. 16 et s.), et les art. 14/16/17 imposent des livrables rédactionnels sur le chemin critique du lancement |
| **Signalement de masse malveillant entre garages concurrents** sur une place de marché auto | Suspension du traitement des signalements manifestement infondés répétés, après avertissement (conception art. 23, §7.2) |
| **LBT absent des outils de multidiffusion (Ubiflow, Kepler VO, Stockway)** — identifié le 2026-08-01. Le coût d'entrée d'un garage devient la ressaisie manuelle de son stock, que ni la gratuité ni la garantie contacts ne compensent. Risque de plafonnement du pilote au seul réseau personnel de Nicolas | Flux d'ingestion XML/CSV + API dès le MVP (§6) et référencement comme destination chez les trois multidiffuseurs, à engager tôt car c'est un délai de partenariat et non de développement (§5.2, action n°31) |
| **Le « prix cassé » lu comme un signal de faible audience** (§5.2) — en B2B, annoncer 12× moins cher qu'un leader fait conclure à 12× moins d'audience, ce qui sera exact au démarrage | Ne jamais ouvrir sur le prix : vendre la **garantie contacts** (« jamais plus de 30 € le contact, ou le mois est offert »), qui transforme l'audience faible d'un aveu en argument. Le tarif est l'argument de conclusion |
| **Litige sur la garantie contacts** : sans définition opposable du « contact qualifié » ni instrumentation anti-fraude, la garantie devient une source de conflit client au lieu d'un argument | Spécifier et instrumenter le compteur **avant** la première vente (action n°32) ; compteur visible en temps réel côté garage (§6) |
| Absence de ressource technique dédiée | Décision claire sur le déclenchement de l'implication de l'équipe RETRO+ (§11) |

---

## 13. Plan de ressources (matériel & humain)

*À construire progressivement par les sessions de travail quotidiennes (voir §17). Le volet "coûts variables" est chiffré depuis le 2026-07-28 (§5.1) ; le volet "coûts fixes" (équipe, budget par phase) reste à faire — c'est lui qui détermine le seuil de rentabilité.*

**Acquis du 2026-08-01 (§5.2) — côté recettes :** la grille pro est arrêtée (5 paliers, 0/79/149/249/399 € HT) et donne un **ARPA hypothétique de 136 €** pour une marge unitaire de ~126 €. Le seuil de rentabilité est donc de **119 comptes pros payants** à F = 15 000 €/mois et **239** à F = 30 000 €/mois (contre 108 et 216 estimés en §5.1, qui supposaient tous les pros au palier médian). L'action n°5 dispose désormais des deux moitiés de l'équation : il ne manque que le budget de coûts fixes lui-même. **Deux postes de coût nouveaux à y inscrire** : le référencement/intégration chez les multidiffuseurs (Ubiflow, Kepler VO, Stockway — coût inconnu, possiblement une commission ou un abonnement côté portail) et le **coût du palier gratuit, qui est entièrement une décision de support** : 160 €/mois en self-service strict, 2 875 €/mois si les comptes gratuits ouvrent droit au support humain.

**Acquis du 2026-07-30 (§7.2) — trajectoire d'effectif modération + support :** 0,01 ETP au palier pilote (S1), **0,07 ETP au palier régional** (S2, ~10 h/mois de modération) et **~1,5 ETP au palier national** (S3 : 0,73 ETP de modération + 0,75 ETP de support, ≈ 4 600 €/mois chargés). Conséquence pour l'action n°5 : l'hypothèse « 0,5 ETP modération/support » du scénario F = 15 000 €/mois tient jusqu'au palier régional **mais pas au national**. Décision associée : **modération gardée en interne** (files légales et réclamations), seule la file de revue ciblée est externalisable en débordement au-delà du palier régional — le BPO est 2 à 6× moins cher par élément mais n'a pas la connaissance du marché français de l'occasion, qui est précisément l'avantage de Nicolas.

**Acquis du 2026-07-28 (§5.1) :** l'infra technique fixe reste modeste (~250-400 €/mois au palier régional M12 : 2 VPS applicatifs, Postgres managé, VM Meilisearch, monitoring, Brevo). Le poste dominant de la structure de coûts est **humain** : modération et support représentent ~80 % du coût marginal par annonce. Dimensionner l'équipe modération/support est donc un arbitrage plus structurant que n'importe quel choix d'hébergeur.

- Besoins humains par phase (dev, design, modération/support, commercial garages...)
- Quand et comment impliquer l'équipe RETRO+ (Fabien, les 3 ingénieurs 3IL, l'admin sys) vs recruter/externaliser spécifiquement pour LBT
- Besoins matériels/infra (hébergement, stockage images, coûts variables par annonce/par utilisateur)
- Budget prévisionnel par phase

## 14. Choix technologiques

*À trancher progressivement — ne pas figer avant d'avoir comparé les options. Point de départ : les skills déjà installés couvrent Cloudflare (Workers/D1/R2/Images) et Vercel/Next.js, deux stacks capables de scalabilité rapide sans lourdeur DevOps initiale, mais rien n'est encore choisi.*

- Stack backend/frontend
- **Schéma d'index et pertinence de la recherche — arbitré le 2026-08-02 (§14.2)** : collection `annonces_auto` de ~40 champs (`range_index` sur prix/km/année, `default_sorting_field: score_popularite`, `max_candidates` porté à 10), `text_match_type=max_weight` avec `query_by_weights=8,6,2,1`, **`enable_typos_for_numerical_tokens=false` et `enable_typos_for_alpha_numerical_tokens=false`** (meilleur mécanisme que le `num_typos` par champ pour protéger 308/208 et A3/A4), **`drop_tokens_threshold=0`** (jamais de résultats élargis en silence), `group_by=vendeur_id` + `group_limit=2` sur les listes triées par fraîcheur, `locale`/`stem` **uniquement** sur la description (le repli des diacritiques est voulu sur marque/modèle), jeu de synonymes automobile français d'environ 130 entrées avec règle d'asymétrie (SUV ⊅ 4x4). **Contrainte dure : 3 champs de tri maximum par requête** — d'où l'impossibilité de coder le plafond de densité publicitaire dans le moteur (§5.2).
- **Moteur de recherche — arbitré le 2026-07-31 (§14.1) : Typesense, auto-hébergé, un nœud, indexé depuis Postgres.** Départagé non par la performance (au volume de LBT les quatre candidats sont surdimensionnés) mais par deux besoins métier — **boost commercial au moment de la requête** (`_eval()` et curation, absents de Meilisearch qui n'a pas de pinning natif) et **tolérance aux fautes réglable par champ** (indispensable sur les références chiffrées : 308/208/508, A3/A4) — et par la **trajectoire de licence** : Meilisearch a placé sharding et réplication dans une *Enterprise Edition* sous BSL 1.1 interdite en production sans accord commercial, là où Typesense garde le clustering Raft dans l'open source. **Algolia écarté le 2026-07-28** (facturation à la requête, incompatible avec un trafic particulier gratuit). **Elasticsearch/OpenSearch écartés** : coût d'exploitation JVM disproportionné sans admin sys dédié ; leur seul avantage structurel (le percolateur, pour les alertes « nouvelle annonce ») se contourne trivialement à notre volume. **Postgres seul écarté** comme cible, mais reste le repli si le MVP doit sortir plus vite.
- Hébergement et scalabilité
- **Couche image — arbitré le 2026-07-28** : object storage à egress nul + variantes pré-générées au dépôt + CDN. Cloudflare Images en mode stockage Cloudflare écarté (facturation à la livraison, ~40× plus cher au palier national). Alternatives européennes valables si la souveraineté prime : Scaleway Object Storage (~0,011 €/Go-mois, hébergement France, ISO 27001/HDS) ou Bunny Storage+CDN (0,01 $/Go). Le poste étant à ~0,001 €/annonce, **le choix peut se faire sur la souveraineté plutôt que sur le prix**.
- **Modération de contenu — arbitré le 2026-07-29 (§7.1)** : cascade auto-hébergée sur CPU (pHash ou PDQ pour la déduplication, `Falconsai/nsfw_image_detection` en ONNX INT8 pour le NSFW, YOLOv11 fine-tuné plaques + OpenCV pour le floutage, PaddleOCR pour le texte incrusté) sur un serveur 4 vCPU à ~25 €/mois, **sans GPU** ; complétée par un appel à Claude Haiku 4.5 (~0,0016 $/image) sur l'image de couverture et les images signalées uniquement. **Écartés** : Hive (~690 €/mois à S3, pas de tarif public), Sightengine (~470 €/mois), Google Vision SafeSearch (~345 €/mois), AWS Rekognition (~230 €/mois — et arrêt du Batch Image Content Moderation aux nouveaux clients au 30/04/2026), Azure Content Safety (~172 €/mois) : tous conçus pour l'UGC social (nudité/violence) et aveugles à nos trois risques réels (photo volée, plaque visible, coordonnées incrustées). **Cloudflare Workers AI : non tranché**, coût par image non confirmable (doc officielle inaccessible depuis l'environnement d'exécution).
- **Back-office de modération — non tranché (identifié le 2026-07-30, §7.2)** : la politique de modération suppose un outil de *case management* capable de gérer 4 files avec SLA, de produire l'enregistrement structuré de chaque décision (exigence DSA art. 17) et d'instruire les réclamations. Construire (spécification simple, ~10 champs, maîtrise totale) ou acheter (Tremau, Checkstep et autres éditeurs Trust & Safety — aucun tarif recherché à ce stade) : arbitrage à faire → action §17 n°24.
- **Options de visibilité servies par le moteur — arbitré le 2026-08-01 (§5.2)** : deux mécaniques au MVP, la **remontée en tête** (boost `_eval()` décroissant sur 48 h) et la **vitrine mise en avant** (`_eval()` sur le champ vendeur + curation, incluse aux paliers Concession et Groupe) ; l'**épinglage sur requête** (curation/pinning natif) est techniquement disponible mais **écarté du MVP** — c'est la mécanique qui dégrade le plus vite la confiance de l'acheteur. Plafond de densité codé en dur dans la couche `search` : 1 sponsorisé maximum dans les 5 premiers résultats, 20 % maximum par page, étiquetage systématique.
- **Ingestion de flux de stock VO — nouveau chantier identifié le 2026-08-01 (§5.2)** : parseur XML/CSV multi-formats + API REST, récupération des photos par URL, réconciliation par référence véhicule, gestion des retraits (véhicule vendu) et des mises à jour de prix. À croiser avec l'action n°30 (indexeur Postgres → Typesense) et n°18 (pipeline de dépôt) : **un flux pro entre par le même tuyau de modération qu'un dépôt particulier**, avec un débit très différent (un garage pousse 60 véhicules d'un coup à l'inscription).
- Paiement/escrow (si applicable, hors MVP). **Précision du 2026-08-01** : côté encaissement des abonnements pros, **prélèvement SEPA par défaut** (~0,35 €) plutôt que CB (1,5 % + 0,25 €) — 1,4 point de marge sur le palier d'entrée à 79 €, qui portera le volume.

---

### 14.1 Moteur de recherche — comparatif et arbitrage (établi le 2026-07-31)

*Action §17 n°2. Candidats évalués : **Meilisearch**, **Typesense**, **Elasticsearch / OpenSearch**, **Postgres seul** (`tsvector` + `pg_trgm` + PostGIS) et **la pile native Cloudflare** (D1/FTS5 + Vectorize). Algolia était déjà écarté le 2026-07-28 sur son modèle de facturation. Sources en annexe.*

#### Résultat n°1 — au volume de LBT, la recherche n'est pas un problème d'échelle, et c'est la conclusion la plus importante

Les hypothèses de volume du §5.1 donnent un **stock actif de 500 annonces au pilote (S1), 5 000 au palier régional (S2) et 50 000 au palier national auto (S3)**. Ce n'est pas un ordre de grandeur où un moteur de recherche souffre — c'est un ordre de grandeur où il s'ennuie.

Chiffrage : une annonce auto indexable pèse ~1,2 Ko de contenu réellement recherchable (titre, description tronquée, marque, modèle, version, énergie, boîte, année, km, prix, code postal, coordonnées, ~15 attributs facettables). À S3 : **~60 Mo de données utiles**.

| Moteur | Modèle mémoire | RAM nécessaire à S3 (50 k annonces) | RAM à 500 k annonces (S3 × 10, collection incluse) |
|---|---|---|---|
| **Typesense** | index **entièrement en RAM**, règle de dimensionnement **2× à 3× le jeu de données** | **~120-180 Mo** | ~1,2-1,8 Go |
| **Meilisearch** | LMDB **mappé en mémoire**, le système d'exploitation gère le cache ; un ratio RAM/disque de **1/3, voire 1/10**, reste acceptable selon l'éditeur | **< 100 Mo** | < 1 Go |
| **Elasticsearch / OpenSearch** | JVM + heap | **1 à 8 Go de plancher**, indépendamment de nos données | idem |
| **Postgres seul** | déjà provisionné (source de vérité) | +0 | +0 |

→ **Les trois moteurs dédiés tiennent sur un VPS à 7-17 €/mois** (Hetzner CX33 4 vCPU / 8 Go ≈ 6,49 €/mois, CPX31 4 vCPU / 8 Go ≈ 16,49 €/mois après la hausse d'avril 2026), pour un poste budgété à 50 €/mois au §5.1. **Aucun benchmark de latence ou de débit ne peut donc départager les candidats pour LBT** : tout raisonnement du type « X fait 22 ms de p50 sur 10 M de documents » est hors sujet. C'est le piège classique du choix de moteur de recherche — arbitrer sur des chiffres de scalabilité qu'on n'atteindra pas avant plusieurs années, au lieu d'arbitrer sur les fonctions dont le produit a besoin dès le premier jour.

**Seuil de bascule assumé** : la RAM de Typesense croît linéairement avec les données, celle de Meilisearch non. L'écart ne devient un argument qu'au-delà de **~2 millions de documents** (≈ 5 Go de RAM), soit un ordre de grandeur au-dessus du plan à 36 mois. Si le périmètre changeait radicalement (agrégation de flux de concessionnaires, verticale collection très volumineuse), il faudrait rouvrir ce point.

#### Résultat n°2 — le vrai workload n'est pas la recherche plein texte, c'est le filtre-tri-facette

Sur un site d'annonces, la majorité du trafic n'arrive pas par la barre de recherche : il arrive par des **pages catégorie + filtres**, souvent triées par date, et — pour LBT — par des **pages SEO géolocalisées** (§9, stratégie d'acquisition organique dès le jour 1) du type « Renault Clio d'occasion en Haute-Garonne ». Trois conséquences de conception :

1. **La primitive critique est « filtrer sur 8-10 facettes + trier par date/prix/distance », pas « scorer du texte ».** Les trois moteurs dédiés le font nativement ; Postgres le fait aussi, mais les facettes multiples avec comptages y sont coûteuses en SQL.
2. **Le géo est un filtre, pas un tri par pertinence.** Tous les candidats couvrent le besoin réel (rayon en km, boîte englobante, tri par distance) : Typesense via `filter_by: location:(lat, lng, 30 km)` avec tri par distance, options `exclude_radius` (égaliser les distances dans un rayon donné pour départager sur un autre champ) et `precision` (regrouper par paquets) ; Meilisearch via `_geoRadius`, `_geoBoundingBox` et désormais `_geoPolygon` (recherche par zone dessinée sur une carte). **Le tri par distance pure est d'ailleurs un mauvais défaut pour l'auto** : on n'achète pas une voiture parce qu'elle est 4 km plus près. `exclude_radius` (Typesense) est exactement l'outil qui correspond — « tout ce qui est dans 50 km est à égalité, on départage sur le prix ou la fraîcheur ».
3. **Les compteurs exacts affichés sur les pages SEO ne doivent PAS venir du moteur.** Meilisearch ne renvoie par défaut qu'un `estimatedTotalHits` et plafonne l'exhaustivité à `maxTotalHits` (**1 000 par défaut** ; l'éditeur avertit qu'au-delà de 20 000 les requêtes peuvent prendre des secondes) ; Typesense **échantillonne** les comptages de facettes au-delà d'un seuil pour tenir la latence, et `max_facet_values` masque le nombre total de valeurs. → **Décision d'architecture : les compteurs affichés (« 1 247 Clio en Haute-Garonne ») viennent d'un `COUNT` Postgres mis en cache, le moteur ne sert que les résultats de la page.** À 50 000 annonces ces plafonds ne mordent jamais, mais la règle évite d'inscrire une dette dans le SEO.

#### Résultat n°3 — deux besoins métier départagent réellement, et aucun n'est un critère de performance

**a) Le boost commercial au moment de la requête.** LBT vendra de la visibilité aux garages (§5 : abonnements pros, options ; §17 n°6). Un moteur doit donc pouvoir remonter conditionnellement certaines annonces, en faire varier la règle par requête, et permettre de l'A/B tester sans réindexer.

| | Typesense | Meilisearch |
|---|---|---|
| Boost conditionnel **par requête** | **Oui** — `_eval(<expression>)` comme critère de `sort_by` (« optional filtering ») ; l'expression a la syntaxe d'un `filter_by` et se combine (`_eval(is_pro:true && boost_actif:true):desc, date_publication:desc`) | **Non** — les règles de ranking personnalisées sont définies **au niveau de l'index** et sont donc statiques |
| Épinglage / masquage de résultats | **Oui** — `pinned_hits`, `hidden_hits`, jeux de curation (règles déclenchées par requête ou par filtre) | **Pas de support natif** de la promotion/épinglage ; contournement par une règle de ranking personnalisée en tête de liste, donc par un score pré-calculé et réindexé |

C'est l'écart le plus net du comparatif, et il porte sur la mécanique de monétisation, pas sur un détail technique.

**b) La tolérance aux fautes de frappe sur les références chiffrées.** Dans l'automobile, une faute autorisée sur un nombre est catastrophique pour la pertinence : **308 / 208 / 508**, **A3 / A4**, **C3 / C4**, **Série 1 / Série 3**, millésime **2014 / 2015** sont tous à une seule substitution les uns des autres. Les deux moteurs savent traiter le problème, avec une granularité différente :

- **Typesense** : `num_typos` **par champ et par requête** (`query_by=titre,modele,version` avec `num_typos=2,0,0`), plus `min_len_1typo` / `min_len_2typo`. On garde donc la tolérance sur le titre libre et on la coupe sur les champs de référence.
- **Meilisearch** : `typoTolerance.disableOnNumbers` (depuis la **v1.15**), réglage **global par index** — l'éditeur documente explicitement le faux positif « 2024 renvoie 2025 ou 2004 ». Suffisant, mais tout ou rien sur les nombres, et sans distinction entre champs.

#### Résultat n°4 — le vrai risque de licence n'est pas la GPL de Typesense, c'est la trajectoire de Meilisearch

Le réflexe est de préférer le MIT de Meilisearch à la GPL-3.0 de Typesense. **Pour notre déploiement, c'est l'inverse.**

- **La GPL-3.0 de Typesense n'impose rien à LBT.** Nous n'embarquons ni ne distribuons le moteur : nous l'exécutons comme **service réseau** derrière notre propre API. La GPL-3.0 (contrairement à l'AGPL) déclenche ses obligations de copyleft **à la distribution** d'un binaire ou d'un dérivé, pas à l'exposition d'un service en ligne. Le sujet ne se poserait que si LBT distribuait un logiciel intégrant Typesense — ce qui n'est dans aucun scénario du §10.
- **Meilisearch est passé à un double licence.** Le cœur reste MIT, mais une **Enterprise Edition** a été introduite sous **Business Source License 1.1** (fichier `LICENSE-EE` du dépôt : *Licensor* Meili SAS, *Licensed Work* = tout fichier marqué EE dans les modules `enterprise_editions`, *Additional Use Grant* = **usage non-production uniquement**, *Change Date* = 4 ans après publication, *Change License* = MIT). **Le sharding et la réplication sont dans l'EE** : les utiliser en production exige un accord commercial (des licences EE gratuites sont annoncées pour les projets indépendants et les associations, sur demande). Typesense, lui, garde le **clustering Raft dans la version open source** (3 nœuds minimum pour tolérer une panne).
- **À notre échelle, ni le sharding ni la haute disponibilité ne sont nécessaires** : un nœud unique suffit, et le moteur n'est jamais source de vérité — il se reconstruit depuis Postgres en quelques minutes à 50 000 documents. **Ce n'est donc pas un blocage aujourd'hui, c'est un signal sur la direction du projet** : chez Meilisearch le chemin de montée en charge devient payant et le périmètre EE peut s'élargir ; chez Typesense il reste dans l'open source. Pour un projet sans équipe technique dédiée (§11) qui doit éviter les renégociations contractuelles à froid, le signal compte.

**Note de méthode importante** : l'essentiel de la littérature comparative « X vs Y » indexée sur ces moteurs est **publiée par les éditeurs eux-mêmes**. La page de comparaison de Typesense affirme encore que Meilisearch « n'est pas production-ready » et n'a pas de réplication — c'est faux en 2026 ; les pages « Typesense pricing » et « Typesense review » les mieux classées sont hébergées sur `meilisearch.com`. Les conclusions ci-dessus s'appuient donc en priorité sur la **documentation technique** et sur le **fichier de licence lu directement dans le dépôt**, pas sur les comparatifs éditeurs.

#### Résultat n°5 — Elasticsearch / OpenSearch : un seul argument structurel, et il se contourne

Le coût d'exploitation (JVM, plancher de 1 à 8 Go de RAM, analyseurs à configurer, cluster à opérer et à mettre à jour) est **disproportionné** face à 50 000 documents et à une organisation qui n'a **aucune ressource technique affectée** (§11). Mais il existe un avantage fonctionnel réel, qu'il faut nommer plutôt que balayer :

**Le percolateur** (`percolate query`) — la « recherche inversée » : on indexe des *requêtes* et on leur soumet un *document*. C'est l'implémentation canonique des **alertes « nouvelle annonce correspondant à ma recherche »**, fonctionnalité attendue sur un site d'annonces (elle est déjà listée au §6) et que LBC propose. **Ni Meilisearch ni Typesense n'ont d'équivalent.**

Pourquoi cela ne justifie pas Elasticsearch pour autant : à S3, **25 000 nouvelles annonces/mois ≈ 35 par heure**, et une recherche sauvegardée sur l'auto est à ~90 % un **filtre structuré** (marque, modèle, prix max, année min, km max, rayon) — pas une requête plein texte. Elle s'évalue donc **directement en SQL sur Postgres**, en lot, à chaque publication ou toutes les 15 minutes. Le coût est celui des emails, déjà modélisé au §5.1 (Brevo, 0,00075 €/email). → **Le besoin est réel, la solution Elasticsearch est surdimensionnée.** À rouvrir seulement si les alertes deviennent temps réel et se comptent en centaines de milliers.

**Si Elasticsearch devenait un jour nécessaire, le choix par défaut est OpenSearch** : Apache-2.0 sous la Linux Foundation, sans zone grise, là où Elasticsearch est depuis août 2024 en triple licence AGPLv3 / ELv2 / SSPL avec des fonctions avancées réservées aux abonnements payants.

#### Résultat n°6 — Postgres seul, et la pile native Cloudflare

**Postgres seul** (`tsvector` + `pg_trgm` + PostGIS) est **techniquement suffisant pour le pilote** : à 500 annonces actives, filtres et rayon géographique se traitent en SQL sans effort. Ses limites sont connues et documentées : pas de vraie tolérance aux fautes tenant compte de la proximité des mots, pas de recherche instantanée par préfixe sous les 50 ms, facettes multiples coûteuses, et surtout **la charge de recherche entre en concurrence avec la charge transactionnelle sur la même instance**.

**Recommandation : adopter le moteur dédié dès le MVP, pas au palier régional.** Le composant coûte 7-17 €/mois et un service à démarrer ; la réécriture du front de recherche, des facettes et des pages SEO coûte des semaines. Le repli « Postgres seul » reste ouvert si le MVP fermé doit sortir plus vite que prévu — mais alors il faut poser dès le départ une **couche d'abstraction interne** (un module `search` avec deux implémentations), condition pour que la bascule reste une affaire de jours.

**La pile native Cloudflare est écartée** : il n'existe pas de produit de recherche Cloudflare. Ce qui s'en approche est un assemblage **D1 (SQLite FTS5, classement BM25) + Vectorize** pour la partie sémantique. FTS5 n'offre ni facettes, ni tolérance aux fautes, ni géo — et D1 est une base SQLite avec ses propres plafonds de taille. Cela reste un choix raisonnable pour de la recherche documentaire sur un site de contenu, pas pour le cœur produit d'un site d'annonces.

#### Décision retenue

**Typesense, un nœud, indexé depuis Postgres qui reste la source de vérité — en deux temps :**

1. **MVP et pilote (M4-12) : Typesense Cloud** (~22-50 $/mois selon la configuration RAM/CPU, facturé à l'heure). Tant qu'aucune ressource technique n'est affectée (§11), **payer pour ne pas opérer un serveur est le bon arbitrage** : le montant tient largement dans les 50 €/mois budgétés au §5.1, et l'API est identique à celle de la version auto-hébergée.
2. **Bascule en auto-hébergé** au moment où l'équipe RETRO+ est impliquée (fin de la phase de cahier des charges, §11) : un VPS 4 vCPU / 8 Go à **7-17 €/mois**, un seul nœud, sans haute disponibilité — l'index se reconstruit depuis Postgres. Le clustering Raft à 3 nœuds ne se justifiera qu'à partir du moment où une indisponibilité de recherche de 10 minutes deviendra inacceptable, ce qui n'est pas le cas avant le palier national.

**Conditions de réversibilité, à respecter dès la première ligne de code** : (a) le moteur n'est **jamais** source de vérité — tout est reconstructible depuis Postgres ; (b) l'accès au moteur passe par un **module d'abstraction interne** (`search.query()`, `search.index()`), jamais par des appels dispersés dans le code produit ; (c) le schéma d'index est **versionné** et la réindexation complète est un script routinier, pas une opération exceptionnelle. Sous ces trois conditions, changer de moteur est un chantier de quelques jours — ce qui autorise à trancher maintenant sans sur-débattre.

#### Conséquences sur les autres sections

- **§5.1** : le poste « moteur de recherche » passe de 50 €/mois estimés à **7-50 €/mois réels** selon la phase. L'écart est négligeable sur le coût marginal par annonce (0,002 € → ~0,0006 €), qui reste inscrit à 0,002 € par prudence. **Aucune conclusion du §5.1 ne bascule.**
- **§6** : les alertes sur recherche sauvegardée (déjà listées) sont confirmées comme un développement **Postgres + batch**, pas une fonction du moteur de recherche.
- **§9 (SEO)** : les compteurs des pages géolocalisées viennent de Postgres, pas du moteur.
- **§15** : le besoin de skill « Meilisearch » identifié le 2026-07-28 devient un besoin de skill **Typesense**.

#### Limites et incertitudes assumées

- **Aucun test n'a été exécuté.** Ce comparatif est documentaire. Le seul essai qui trancherait vraiment — indexer 5 000 annonces auto réelles et mesurer la pertinence perçue sur 50 requêtes typiques (« clio 3 essence », « 3008 gt line 2019 », « utilitaire diesel toulouse ») — demande des données que le pilote produira.
- **La qualité de la pertinence en français n'a pas été évaluée.** Aucun des moteurs testés n'a été comparé sur le lemmatisation/l'accentuation du français ni sur le vocabulaire automobile. C'est probablement plus déterminant que tout ce qui précède, et cela ne se mesure que sur nos données.
- **Les hypothèses de volume viennent du §5.1 et ne sont pas validées.** Toute la démonstration du Résultat n°1 repose sur 50 000 annonces actives à M24. Un changement d'ordre de grandeur rouvrirait l'arbitrage.
- **Tarifs cloud issus d'agrégateurs.** Les prix Hetzner (CX33 6,49 €, CPX31 16,49 €, après la hausse d'avril 2026) et Typesense Cloud (~22-50 $/mois) proviennent de sources tierces : `typesense.org`, `cloud.typesense.org` et `meilisearch.com/docs` renvoient tous un **403** depuis l'environnement d'exécution des sessions automatisées (même limite que les 28, 29 et 30/07). Seul le fichier `LICENSE-EE` de Meilisearch a pu être lu directement, sur `raw.githubusercontent.com`. → à revalider en session locale (action §17 n°15, étendue).
- **Le percolateur d'Elasticsearch a été écarté sur un raisonnement de volume, pas sur une implémentation.** Si les alertes devenaient un axe produit majeur (ce qui est plausible sur l'auto : « préviens-moi dès qu'un Kangoo diesel < 8 000 € apparaît dans 50 km »), le sujet mérite une conception propre → nouvelle action §17 n°28.

### 14.2 Schéma d'index et pertinence de la recherche auto (établi le 2026-08-02)

*Action §17 n°27. Objet : champs indexés et poids, facettes et tris, tolérance aux fautes par champ, `distinct` par vendeur, tri par défaut, dictionnaire de synonymes automobile français. **Particularité de méthode : contrairement aux sections précédentes, celle-ci est adossée à la documentation officielle Typesense lue intégralement en source primaire** (voir Résultat n°0). Sources en annexe.*

#### Résultat n°0 — les « 403 » qui bloquent 7 actions de la file ne viennent pas des sites, ils viennent de notre propre configuration

C'est le résultat le plus rentable de la journée et il n'a rien à voir avec la recherche.

Depuis le 2026-07-28, quatre sections de ce document concluent par la même phrase : « source inaccessible depuis l'environnement d'exécution (403) ». Sept actions de la §17 sont classées bloquées ou partiellement bloquées pour ce motif (n°8, 13, 15, 21, 25, 33, 34), dont la veille concurrentielle LBC et la vérification des textes DSA sur EUR-Lex. L'interprétation retenue jusqu'ici était que les sites refusaient les requêtes d'un agent automatisé.

**C'est faux.** Le diagnostic exact, obtenu en interrogeant le proxy de l'environnement :

```
$ curl -sS "$HTTPS_PROXY/__agentproxy/status"
"recentRelayFailures": [
  { "kind": "connect_rejected",
    "detail": "gateway answered 403 to CONNECT (policy denial or upstream failure)",
    "host": "data.gouv.fr:443" },
  { ... "host": "www.lacentrale.fr:443" },
  { ... "host": "public.opendatasoft.com:443" }
]
```

Le 403 est émis par **la passerelle réseau de l'environnement d'exécution**, avant que la requête n'atteigne le site. Ce n'est pas un blocage anti-bot : c'est un refus de la politique réseau choisie à la création de l'environnement, qui n'autorise qu'une liste blanche. Vérification par sondage :

| Hôte | Résultat |
|---|---|
| `raw.githubusercontent.com`, `api.github.com`, `github.com`, `gitlab.com`, `pypi.org` | **autorisés** |
| `data.gouv.fr`, `data.ademe.fr`, `public.opendatasoft.com`, `lacentrale.fr`, `typesense.org`, `fr.wikipedia.org`, `carlabelling.ademe.fr` | refusés par la politique (`connect_rejected`) |

**Trois conséquences immédiates :**

1. **Le déblocage coûte un changement de configuration, pas une session locale.** La politique réseau est un paramètre de l'environnement d'exécution Claude Code on the web (documenté sur `code.claude.com/docs/en/claude-code-on-the-web`), modifiable par Nicolas. Élargir la liste blanche — ou passer en accès sortant non restreint — rend faisables en session automatisée les actions n°13 (quotas LBC), n°15 (tarifs Cloudflare/Typesense/Hetzner), n°21 (EUR-Lex et Légifrance), n°25 (rapports de transparence DSA), n°34 (distribution du stock VO). **C'est la nouvelle action n°35, et c'est la moins chère de toute la file.** Réserve honnête : une fois le réseau ouvert, certains sites (`leboncoin.fr` en particulier) opposeront peut-être un vrai blocage anti-bot — mais on ne le sait pas encore, et aujourd'hui on ne l'a jamais testé.
2. **Les mentions « 403 » des §5.2, §7.1 et §14.1 sont à relire avec cette correction.** Elles n'invalident aucune conclusion, mais elles attribuaient à des tiers une limite qui est la nôtre.
3. **Le contournement est déjà exploitable sans rien changer.** La documentation technique de la plupart des logiciels libres est versionnée sur GitHub, donc accessible. L'intégralité de la documentation Typesense v30.2 a été lue directement dans son dépôt source (`raw.githubusercontent.com/typesense/typesense-website/master/docs-site/content/30.2/…`) : ~500 Ko de documentation officielle, y compris les valeurs par défaut de chaque paramètre. **Toute cette section est donc sourcée en primaire**, là où le §14.1 de la veille devait s'appuyer sur des agrégateurs. La même méthode s'applique à Postgres, Meilisearch, YOLO, PaddleOCR et la plupart des choix du §14.

#### Résultat n°1 — sur l'automobile, la pertinence n'est pas un problème de scoring de texte, c'est un problème de reconnaissance d'entités

C'est le recadrage central de la section, et il change l'ordre des chantiers.

Les requêtes réelles d'un acheteur auto ne sont pas du langage : ce sont **des listes de valeurs de facettes écrites sans les facettes**. « clio 3 essence », « 3008 gt line 2019 », « utilitaire diesel toulouse », « kangoo 5 places boite auto », « c3 moins de 100000 km ». Décomposons :

| Requête | Marque | Modèle | Génération | Énergie | Boîte | Finition | Année | Lieu | Texte libre restant |
|---|---|---|---|---|---|---|---|---|---|
| `clio 3 essence` | Renault (implicite) | Clio | 3 | essence | | | | | **rien** |
| `3008 gt line 2019` | Peugeot (implicite) | 3008 | | | | GT Line | 2019 | | **rien** |
| `utilitaire diesel toulouse` | | | | diesel | | | | Toulouse | **rien** (carrosserie=utilitaire) |
| `kangoo 5 places boite auto` | Renault | Kangoo | | | auto | | | | **rien** (places=5) |

**Dans la majorité des requêtes auto, il ne reste aucun texte libre à scorer.** Le moteur de recherche plein texte est sollicité pour un travail qui n'est pas le sien : il compare des chaînes là où il faudrait appliquer des filtres. D'où trois conséquences de conception, dans cet ordre :

1. **La brique la plus rentable est un normaliseur de requête** : minuscules, retrait des accents, chiffres romains → arabes (`Clio III` → `Clio 3`), reconnaissance marque/modèle/génération sur un référentiel, reconnaissance des codes commerciaux (HDi, dCi, TCe, EDC…), extraction des seuils numériques (« moins de 100000 km », « - de 10000 € »), reconnaissance des communes et départements. Ce qui est reconnu part en `filter_by`, ce qui reste part en `q`. **Cette brique est du code à nous, testable, versionné** — pas une configuration du moteur.
2. **Typesense sait faire une partie de ce travail nativement, et c'est utile pour la longue traîne** : la curation supporte le **filtrage dynamique**, c'est-à-dire des règles à variables (`"rule": {"query": "{marque} occasion", "match": "contains"}` → `"filter_by": "marque:={marque}"`) avec `remove_matched_tokens: true`, qui retire le token de la requête après l'avoir converti en filtre. Contrainte documentée : **les champs utilisés en filtrage dynamique doivent être déclarés `facet: true`** dans le schéma. À réserver aux cas que le normaliseur ne couvre pas, parce qu'une règle de curation vit dans le moteur — donc hors de git, et perdue à la réindexation si le script d'export n'est pas fait.
3. **Le référentiel marque/modèle/version est un prérequis, pas un détail.** Piste gratuite et française identifiée : la base **ADEME Car Labelling** (données UTAC d'homologation, mise à jour trimestrielle, contient marque, modèle, dénomination commerciale, n° CNIT, énergie), publiée sur `data.gouv.fr` et `data.ademe.fr`. Elle ne couvre que les véhicules commercialisés neufs et pas les finitions de tout le parc VO, mais elle donne une colonne vertébrale normalisée gratuitement. **Non téléchargée à ce stade** — le domaine est refusé par la politique réseau (Résultat n°0). À croiser avec les données du pilote, qui sont la seule source de vérité sur ce que les gens tapent réellement.

#### Résultat n°2 — le schéma d'index

Collection `annonces_auto`. Le principe directeur : **un champ n'est indexé que si une fonction produit s'appuie dessus**, parce que chaque champ interrogeable coûte de la RAM (index intégralement en mémoire, §14.1) et surtout du bruit de pertinence.

| Champ | Type | `index` | `facet` | `sort` | `query_by` | Notes / justification |
|---|---|---|---|---|---|---|
| `id` | string | ✓ | | | | = identifiant Postgres de l'annonce, jamais généré par le moteur |
| `titre` | string | ✓ | | | **1er** | titre normalisé « Marque Modèle Version Année » ; poids le plus fort |
| `version` | string | ✓ | ✓ | | **2e** | finition/motorisation brute (« 1.5 BlueHDi 100 S&S Business ») — champ le plus sale, venu des flux pros |
| `description_courte` | string | ✓ | | | **3e** | description tronquée à ~600 caractères ; `locale: "fr"`, `stem: true` |
| `marque` | string | ✓ | ✓ | | (via filtre) | `num_typos=0` |
| `modele` | string | ✓ | ✓ | | (via filtre) | `num_typos=0` |
| `generation` | string | ✓ | ✓ | | | « 3 », « III », « phase 2 » → normalisé en amont |
| `carrosserie` | string | ✓ | ✓ | | | citadine / berline / break / SUV / monospace / coupé / cabriolet / utilitaire |
| `energie` | string | ✓ | ✓ | | | facette de 1er rang (diesel = 44 % du VO, cf. Résultat n°9) |
| `boite` | string | ✓ | ✓ | | | facette de 1er rang (54 % des VN 2025 en automatique) |
| `transmission` | string | ✓ | ✓ | | | 2 roues motrices / 4x4 — **distinct de `carrosserie`**, cf. Résultat n°7 |
| `annee` | int32 | ✓ | ✓ | ✓ | | `range_index: true` |
| `km` | int32 | ✓ | ✓ | ✓ | | `range_index: true` |
| `prix` | int32 | ✓ | ✓ | ✓ | | en euros entiers ; `range_index: true` |
| `prix_precedent` | int32 | ✓ | | | | alimente la notification de baisse de prix (§6) |
| `baisse_prix` | bool | ✓ | ✓ | | | badge « prix baissé » — filtrable, c'est un motif de tri produit |
| `puissance_fiscale`, `puissance_din` | int32 | ✓ | ✓ | ✓ | | |
| `portes`, `places` | int32 | ✓ | ✓ | | | « 7 places » est une requête fréquente en familial |
| `couleur` | string | ✓ | ✓ | | | |
| `critair` | int32 | ✓ | ✓ | | | **attribut affiché, pas filtre de 1er rang** (Résultat n°9) |
| `premiere_main` | bool | ✓ | ✓ | | | |
| `garantie_mois` | int32 | ✓ | ✓ | | | différenciateur pro |
| `histovec_verifie` | bool | ✓ | ✓ | | | prépare l'action n°26 ; coût nul si le champ existe dès le départ |
| `plaque_floutee` | bool | ✓ | | | | badge confiance (§7.1) |
| `photos_count` | int32 | ✓ | | ✓ | | entre dans `score_popularite` |
| `vendeur_id` | string | ✓ | ✓ | | | **indispensable au `group_by`** (Résultat n°6) |
| `vendeur_type` | string | ✓ | ✓ | | | `particulier` / `pro` |
| `vendeur_nom` | string | ✓ | ✓ | | 4e (poids faible) | permet « garage dupont » comme requête |
| `palier` | string | ✓ | ✓ | | | palier d'abonnement (§5.2) — sert au `_eval` |
| `boost_actif` | bool | ✓ | ✓ | | | remontée en tête achetée, fenêtre 48 h (§5.2) |
| `boost_expire_at` | int64 | ✓ | | ✓ | | timestamp Unix ; permet de faire décroître le boost |
| `vitrine` | bool | ✓ | ✓ | | | vitrine mise en avant incluse aux paliers hauts |
| `code_postal` | string | ✓ | ✓ | | | |
| `departement`, `region` | string | ✓ | ✓ | | | **indispensables aux pages SEO géolocalisées** (§9) |
| `location` | geopoint | ✓ | | ✓ | | `[lat, lng]` du code postal, pas de l'adresse exacte (RGPD) |
| `date_mise_en_ligne` | int64 | ✓ | | ✓ | | première publication — **jamais modifiée** |
| `date_mise_en_avant` | int64 | ✓ | | ✓ | | date de tri « fraîcheur » — cf. Résultat n°6, anti-abus de rafraîchissement |
| `date_maj` | int64 | ✓ | | ✓ | | |
| `score_popularite` | int32 | ✓ | | ✓ | | **`default_sorting_field`** — cf. ci-dessous |
| `score_qualite` | int32 | ✓ | | ✓ | | complétude de la fiche ; sert aussi à la revue ciblée de modération (§7.2) |

**Trois choix de schéma qui ne sont pas évidents :**

- **`range_index: true` sur `prix`, `km`, `annee`.** Option documentée (« index optimisé pour le filtrage par intervalle », défaut `false`). Ce sont exactement nos trois filtres à intervalle systématiques ; l'oublier est une dette silencieuse.
- **`default_sorting_field: score_popularite`.** Ce champ ne sert pas qu'au tri par défaut : la documentation précise qu'il départage les **variantes de préfixe et de fautes de frappe**, Typesense ne retenant par défaut que les **4 meilleures** (`max_candidates`, défaut 4). Sans `default_sorting_field`, « top » = les variantes ayant le plus d'annonces ; avec, = les plus populaires. Concrètement : la frappe « cli » doit proposer « clio » et pas un modèle rare. Corollaire : **porter `max_candidates` de 4 à ~10 sur la barre de recherche** — au volume de LBT le coût est nul (§14.1) et 4 candidats est trop peu pour un catalogue de modèles.
- **`score_popularite` doit être un entier calculé côté Postgres et réindexé par lot** (vues, contacts, complétude, fraîcheur), jamais recalculé à la requête. Il n'a pas besoin d'être frais à la minute.

#### Résultat n°3 — poids des champs et mode d'agrégation : `max_weight`, pas le défaut

Typesense calcule un score de correspondance **par champ** (fréquence des tokens, distance d'édition, proximité des tokens, ordre des champs dans `query_by`, poids de `query_by_weights`), puis les agrège en un score par document selon `text_match_type` :

| Mode | Mécanique | Effet sur l'auto |
|---|---|---|
| `max_score` (défaut) | le **meilleur** score de champ représente le document ; les poids ne servent qu'à départager les égalités | une description bavarde qui répète « clio » dix fois peut battre une vraie Clio dont le titre matche une seule fois |
| **`max_weight`** | le score du **champ le plus lourd** représente le document | une correspondance dans `titre`/`version` prime sur une correspondance dans `description` — **c'est ce qu'on veut** |
| `sum_score` | somme pondérée de tous les champs | favorise les annonces verbeuses |

**Réglage retenu pour la barre de recherche :**

```
query_by         = titre,version,description_courte,vendeur_nom
query_by_weights = 8,6,2,1
text_match_type  = max_weight
prioritize_token_position     = true      # défaut false
prioritize_num_matching_fields = false    # défaut true
prioritize_exact_match         = true     # défaut true, à conserver
```

Les deux paramètres modifiés par rapport au défaut méritent leur justification :

- **`prioritize_token_position=true`** : nos titres commencent par « Marque Modèle Version ». Récompenser une correspondance en début de champ, c'est récompenser « c'est bien ce modèle » plutôt que « ce modèle est cité en passant ».
- **`prioritize_num_matching_fields=false`** : ce paramètre (activé par défaut) favorise les documents dont les mots de la requête apparaissent dans **plus** de champs. Or nos champs sont volontairement redondants — `titre` contient marque, modèle et version, et la description les répète presque toujours. Le défaut récompense donc la redondance rédactionnelle, pas la pertinence. C'est un cas où le réglage par défaut de Typesense, pensé pour des catalogues à champs disjoints, est contre-productif sur des annonces.

**Contrainte dure découverte dans la documentation, et elle est structurante : `sort_by` accepte au maximum 3 champs de tri.** `_text_match` en consomme un. On ne peut donc pas empiler « sponsorisés d'abord + pertinence + fraîcheur + distance » : il faut choisir 3 critères, et le boost commercial doit se contenter d'**une seule** expression `_eval` (à valeurs multiples, cf. Résultat n°5). Cette contrainte à elle seule impose de sortir le plafond de densité publicitaire du moteur.

#### Résultat n°4 — tolérance aux fautes : deux paramètres globaux font mieux que le `num_typos` par champ, et cela corrige le §14.1

Le §14.1 a retenu Typesense en partie pour son `num_typos` **par champ** (`num_typos=2,0,0`), face au `disableOnNumbers` global de Meilisearch. La lecture de la documentation complète montre que **Typesense a aussi les deux réglages globaux, et qu'ils sont mieux ciblés que le `num_typos` par champ** :

| Paramètre | Défaut | Réglage LBT | Effet |
|---|---|---|---|
| `enable_typos_for_numerical_tokens` | `true` | **`false`** | tue définitivement 308→208, 2014→2015 |
| `enable_typos_for_alpha_numerical_tokens` | `true` | **`false`** | tue A3→A4, C3→C4, 320d→320i |
| `num_typos` (par champ) | `2` partout | `2,2,1,0` sur `titre,version,description,vendeur_nom` | garde la tolérance sur les mots |
| `min_len_1typo` | `4` | `4` (conservé) | « kango »→« kangoo » fonctionne |
| `min_len_2typo` | `7` | `7` (conservé) | protège déjà les mots courts de la double faute |
| `typo_tokens_threshold` | `1` | `1` (conservé) | les variantes fautives ne sont cherchées que si l'exact ne donne rien |
| `drop_tokens_threshold` | `1` | **`0`** | voir ci-dessous |
| `split_join_tokens` | déclenché si 0 résultat | conservé | « 4 x 4 » ↔ « 4x4 », « twin air » ↔ « twinair » |

**La décision la plus importante de ce résultat est `drop_tokens_threshold=0`.** Par défaut, si une requête à plusieurs mots ne rend pas au moins 1 résultat, Typesense **retire des mots** jusqu'à en trouver — de gauche à droite ou de droite à gauche, en commençant par les mots les plus rares. Sur des annonces auto, c'est un piège : « clio 3 **diesel** » sans résultat devient « clio 3 » et affiche des Clio essence, sans le dire. L'acheteur ne voit pas que son critère a été abandonné.

Le raisonnement qui tranche n'est pas ergonomique, il est financier : **la §5.2 nous fait garantir un coût plafond par contact (« jamais plus de 30 € le contact, ou le mois est offert »)**. Un résultat hors critère produit soit aucun contact, soit un contact non qualifié — dans les deux cas, il dégrade le ratio qui déclenche la garantie. **Une recherche imprécise nous coûte directement de l'argent.** D'où : zéro résultat assumé, message explicite, et un bouton « élargir la recherche » qui refait la requête avec `drop_tokens_threshold=1` **en le disant** (nouvelle exigence §6).

**Réserve honnête** : le comportement du tokenizer par défaut sur `1.5 dCi`, `e-208`, `ë-C4`, `GT Line+` et `C4 Picasso` **n'est pas déductible de la documentation**. `symbols_to_index` (indexer `+` pour « GT Line+ ») et `token_separators` (couper sur `-` pour que « e-208 » soit trouvé par « 208 ») sont documentés, mais l'effet du point décimal sur « 1.5 » ne l'est pas. Ne pas deviner : c'est un test de 30 minutes sur un nœud local, à faire avant d'écrire le schéma définitif → action n°39.

#### Résultat n°5 — le tri par défaut, et pourquoi le plafond de densité publicitaire ne peut pas vivre dans le moteur

**Trois contextes, trois `sort_by`, chacun dans le budget de 3 champs :**

```
# 1. Page catégorie / page SEO géolocalisée (pas de requête texte) — défaut = fraîcheur
sort_by = _eval([ (boost_actif:true):2, (vitrine:true):1 ]):desc, date_mise_en_avant:desc

# 2. Recherche texte — pertinence par paliers, popularité en départage
sort_by = _text_match(buckets: 10):desc, score_popularite:desc, date_mise_en_avant:desc

# 3. Recherche géolocalisée — la distance en paliers, pas en mètres
filter_by = location:(43.6045, 1.4442, 50 km) && energie:=Diesel
sort_by   = location(43.6045, 1.4442, exclude_radius: 30 km):asc, prix:asc, date_mise_en_avant:desc
```

Deux mécaniques valent d'être explicitées :

- **`_text_match(buckets: 10)`** : Typesense découpe les résultats en 10 groupes de pertinence égale, puis laisse le critère suivant réordonner **à l'intérieur** de chaque groupe. C'est la seule façon propre de mélanger pertinence et popularité sans que l'une écrase l'autre. `bucket_size: N` existe aussi (paliers de taille fixe).
- **`exclude_radius: 30 km`** : tout ce qui est dans 30 km est réputé à égale distance, on départage sur le prix. Le §14.1 avait identifié l'outil ; le voici câblé. Corollaire non évident : **le tri géographique consomme un des trois slots**, donc une recherche géolocalisée ne peut pas en plus trier par pertinence texte — il faut choisir. Retenu : sur une requête texte **avec** rayon, la pertinence gagne et la distance passe en filtre seul.

**Et voici la conséquence architecturale que la §5.2 n'avait pas vue.** La décision du 2026-08-01 impose un plafond de densité : *« 1 sponsorisé maximum dans les 5 premiers résultats, 20 % maximum par page, étiquetage systématique »*. **Ce plafond est inexprimable en `sort_by`.** `_eval` est un critère de tri global : il place **tous** les documents `boost_actif:true` devant tous les autres. Si 40 garages boostent le même jour sur la même requête, la première page est intégralement sponsorisée — exactement ce que la §5.2 interdit.

Le plafond doit donc être implémenté dans le module `search` (couche d'abstraction imposée par le §14.1), et sa mécanique est plus subtile qu'un filtre d'affichage :

1. **Deux requêtes**, pas une : la liste organique (`filter_by: … && boost_actif:false`) et la liste sponsorisée (`filter_by: … && boost_actif:true`), chacune paginée indépendamment.
2. **Entrelacement à positions fixes et déterministes** : par exemple slot 3 sur la page 1, slots 3 et 8 sur les suivantes. La fonction d'entrelacement doit être une fonction pure de `(numéro de page, rang)`, sinon **la pagination se casse** : un sponsorisé inséré page 1 décale la liste organique et fait réapparaître ou disparaître une annonce page 2. C'est le bug classique des régies publicitaires et il est invisible en test manuel sur une seule page.
3. **Offsets calculés, pas déduits** : la page *n* de la liste organique demande `offset = (n-1) × (per_page − nb_sponsorisés_par_page)`. À noter : **`per_page` est plafonné à 250** par le moteur — largement suffisant, mais la sur-récupération doit rester dans cette borne.
4. **L'étiquetage et le comptage vivent au même endroit**, ce qui permet de journaliser le taux réel de sponsorisés servis — l'indicateur qui prouve que le plafond est respecté.

→ nouvelle action n°37. Le coût est d'une demi-journée de développement ; le coût de ne pas le faire est le différenciateur de confiance du §5.2.

#### Résultat n°6 — `distinct` n'existe pas chez Typesense, et le vrai risque vient du flux pro

L'action n°27 demandait « `distinct` par vendeur (empêcher un garage de saturer une page de résultats) ». **Le paramètre `distinct` est un concept Algolia/Meilisearch ; Typesense n'en a pas.** L'équivalent est `group_by` + `group_limit`, et la documentation le présente explicitement pour deux usages : la déduplication et la **« correction du déséquilibre » quand les résultats sont dominés par un même type de document**.

```
group_by = vendeur_id
group_limit = 2
group_missing_values = false
```

Trois pièges documentés, tous à absorber dans la couche `search` :

1. **`per_page` compte alors des groupes, pas des résultats.** Une page de 20 devient 20 groupes × jusqu'à 2 annonces = jusqu'à 40 annonces. La pagination affichée doit être recalculée.
2. **Depuis la v29, `found` devient une approximation** en mode `group_by`, sauf si l'on force `group_max_candidates`. Or nos compteurs SEO viennent déjà de Postgres (§14.1) — cohérent, mais il faut que le code ne lise jamais `found` pour un affichage public.
3. **La forme de la réponse change** (`grouped_hits` imbriqués au lieu de `hits` plats). La couche `search` doit normaliser les deux formes, sinon le choix d'activer ou non le groupement devient un changement de contrat pour tout le front.

**Mais le vrai problème n'est pas celui que l'action posait.** Il est apparu en croisant avec l'action n°31 (ingestion de flux de stock VO) : **un garage qui s'inscrit pousse 40 à 60 véhicules d'un coup par flux Ubiflow.** Tous entrent dans l'index dans la même minute, donc avec la même `date_publication`. Sur une page triée par fraîcheur — le tri par défaut —, **la page 1 devient un seul garage**, sans que personne n'ait acheté de visibilité. Au palier pilote (500 annonces actives), un seul import suffit à monopoliser tout le site.

Trois correctifs, dont deux ne coûtent rien s'ils sont décidés maintenant :

- **`group_by=vendeur_id, group_limit=2` activé sur les listes triées par fraîcheur**, désactivé sur les recherches filtrées explicites (si l'acheteur cherche « Kangoo diesel Toulouse », il veut voir les 6 Kangoo du même garage).
- **Étaler `date_mise_en_avant` à l'import en masse** : soit répartir les véhicules sur la fenêtre d'import, soit reprendre la date réelle de première mise en vente fournie par le flux. Un import n'est pas un événement éditorial.
- **Séparer `date_mise_en_ligne` (immuable), `date_maj` (technique) et `date_mise_en_avant` (tri fraîcheur)** — trois champs déjà au schéma du Résultat n°2. C'est aussi le garde-fou anti-rafraîchissement : une modification de prix ne doit pas remettre l'annonce en tête, sinon le flux XML d'un garage qui réévalue son stock chaque nuit occupe la première page tous les matins. Grief exact que la §5.2 reproche à LBC, à ne pas reproduire.

→ nouvelle action n°38, à traiter avec la n°31.

#### Résultat n°7 — le dictionnaire de synonymes automobile français, et la règle d'asymétrie qui le rend sûr

C'est l'actif métier de l'action n°27 : quelque chose que Nicolas produit seul, que LBC exploite mal, et qui ne dépend d'aucune ressource technique.

**Mécanique Typesense (v29+) à connaître avant d'écrire une entrée :**

| Point | Ce que dit la documentation | Conséquence pour LBT |
|---|---|---|
| Les synonymes sont des **jeux** (`synonym_sets`), créés indépendamment puis **liés à la collection** via son champ `synonym_sets` | L'ancienne route `/collections/{c}/synonyms` a disparu ; les clés d'API scopées `synonyms:*` ne donnent **pas** accès aux nouvelles routes | à prévoir dans le script de provisionnement, sinon la réindexation perd les synonymes |
| **Multidirectionnel** : `break ⇄ SW ⇄ estate` — chercher l'un ramène les autres | symétrique, sûr quand les termes sont vraiment équivalents | usage majoritaire |
| **Unidirectionnel** (`root`) : chercher `root` ramène les `synonyms`, pas l'inverse | c'est **l'outil de sécurité** du dictionnaire | cf. règle d'asymétrie ci-dessous |
| Les synonymes ne s'appliquent qu'aux tokens de **`q`**, jamais à `filter_by` | dès que le normaliseur convertit « diesel » en filtre, le synonyme ne joue plus | le dictionnaire sert surtout à atteindre le champ `version` **brut** des flux pros |
| Une phrase entre guillemets **désactive** les synonymes | `"Série 1"` cherche littéralement | à documenter dans l'aide à la recherche |
| Un synonyme portant un `locale` ne s'applique que si le champ le plus lourd a le même `locale` | nos champs de référence n'ont **pas** de locale (Résultat n°8) | **laisser `locale` vide** sur toutes les entrées, sinon elles ne se déclenchent jamais |
| `synonym_num_typos` (défaut `0`) | résolution des synonymes sur mots corrigés | laisser à `0` : « bva » ne doit pas se déclencher sur « bwa » |

**La règle d'asymétrie — le seul point du dictionnaire où une erreur coûte des ventes.** Un synonyme multidirectionnel entre deux termes qui ne sont pas équivalents crée des faux positifs invisibles. Le cas d'école : **SUV et 4x4 ne sont pas synonymes.** La majorité des SUV vendus sont à deux roues motrices. Un acheteur qui tape « 4x4 » veut de la motricité (montagne, chantier, remorque) : lui servir des SUV traction avant est une promesse non tenue. L'inverse est inoffensif — qui cherche « SUV » accepte volontiers un 4x4.

→ **`root: "suv"` → `["suv", "crossover", "tout terrain", "4x4"]` en unidirectionnel. Et surtout PAS `root: "4x4"` → `["suv"]`.** La motricité réelle est portée par le champ `transmission`, séparé de `carrosserie` au schéma pour cette raison précise.

**Dictionnaire de démarrage (~130 entrées, à valider sur les données du pilote).**

*Carrosserie — multidirectionnel :*
| Famille | Entrées |
|---|---|
| break | break, sw, estate, touring, avant, variant, kombi, familiale |
| monospace | monospace, van, mpv, ludospace |
| citadine | citadine, petite voiture, petite citadine, mini-citadine |
| berline | berline, tricorps, sedan |
| cabriolet | cabriolet, décapotable, roadster, convertible, spider |
| utilitaire | utilitaire, fourgon, fourgonnette, camionnette, vu, vul |
| pick-up | pick-up, pickup, plateau, benne |

*Énergie et motorisation — unidirectionnel depuis le terme générique vers les codes commerciaux :*
| `root` | `synonyms` |
|---|---|
| diesel | diesel, gazole, gasoil, hdi, bluehdi, dci, tdi, cdi, jtd, multijet, d-4d, crdi, tdci, dti, di-d |
| essence | essence, sans plomb, sp95, sp98, tce, thp, tsi, tfsi, vti, puretech, mpi, gdi, vvt |
| hybride | hybride, hev, mhev, hybride léger, full hybrid, e-tech, hsd |
| hybride rechargeable | hybride rechargeable, phev, plug-in, plug in, recharge |
| électrique | électrique, electrique, ev, bev, zéro émission, e-tense, ze |
| gpl | gpl, lpg, bicarburation, bicarburant |

*Boîte de vitesses — multidirectionnel (les codes constructeurs désignent bien tous une boîte automatique) :*
| Famille | Entrées |
|---|---|
| automatique | automatique, auto, bva, bvas, eat6, eat8, eat, dsg, s-tronic, tiptronic, powershift, cvt, e-cvt, dct, pdk, multitronic, tct, 4matic n'est pas de la boîte (exclu) |
| robotisée | robotisée, edc, dct, easytronic, sensodrive, dualogic, mmt |
| manuelle | manuelle, bvm, mécanique, bvm5, bvm6 |

*Transmission — unidirectionnel, jamais l'inverse (cf. règle d'asymétrie) :*
| `root` | `synonyms` |
|---|---|
| 4x4 | 4x4, 4wd, awd, quattro, 4motion, xdrive, 4matic, all4, symmetrical awd, intégrale, 4 roues motrices |
| suv | suv, crossover, tout terrain, tout-terrain, 4x4 |

*Finitions génériques — multidirectionnel dans chaque famille, pour atteindre le champ `version` brut :*
GT Line / GTLine / GT-Line · R-Line / RLine · S-Line / SLine · M Sport / MSport / Pack M · AMG Line / Pack AMG · Business / Pro / Entreprise · Zen / Life / Access / Authentique · Intens / Initiale / Exclusive / Excellence · Feel / Shine / Live (Citroën) · Allure / Active / Style (Peugeot) · Titanium / Trend / ST-Line (Ford) · Ambiente / Ambition / Style (Škoda)

*Marques — multidirectionnel (les diacritiques sont déjà repliés, cf. Résultat n°8) :*
vw / volkswagen · merco / mercedes / mercedes-benz / mb · bm / bmw / bem · citroen / citroën · skoda / škoda · alfa / alfa romeo · land / land rover · range / range rover · vw utilitaire / vw vu · ds / ds automobiles · mini / austin mini · peug / peugeot · renault / rno

*Génération et millésime — à traiter dans le normaliseur, pas en synonymes :*
`III` ⇄ `3`, `II` ⇄ `2`, `IV` ⇄ `4` ; « Clio 3 » = « Clio III » = « Clio 2010-2012 » ; « phase 2 » / « ph2 » / « restylée ». Raison : ce sont des règles de **réécriture** systématiques (romain↔arabe), pas des équivalences lexicales — les coder en synonymes multiplierait les entrées par le nombre de modèles.

*Vocabulaire d'usage et familier — unidirectionnel vers des filtres, via le normaliseur plutôt que des synonymes :*
« 7 places » / « familiale » / « grande famille » → `places:>=7` · « voiture sans permis » / « vsp » → carrosserie dédiée · « pas cher » / « petit prix » / « premier prix » → tri prix croissant, pas un filtre · « faible kilométrage » → `km:<80000` · « pour jeune conducteur » → `puissance_fiscale:<=5`

**Entrées à ne PAS créer (liste à maintenir autant que le dictionnaire lui-même) :**
`4x4 → suv` (motricité), `automatique → cvt` seul (une CVT n'est pas ce que veut tout le monde), `break → monospace` (volumes différents), `diesel → hybride diesel` (mélange deux marchés), `électrique → hybride` (erreur d'achat majeure), `utilitaire → pick-up` (usages disjoints), et **aucun synonyme entre modèles** (« Clio → Twingo » serait de la substitution commerciale, pas de la recherche : cela dégrade la confiance et donc la garantie contacts du §5.2).

**Jeu de mots vides (`stopwords`, applicable à `q` uniquement) :** `vends`, `à vendre`, `a vendre`, `occasion`, `voiture`, `auto`, `automobile`, `annonce`, `véhicule`, `bon état`, `urgent`, `cause double emploi`. Attention documentée : les mots vides sont **retirés de la requête** — une requête entièrement composée de mots vides (« voiture occasion ») devient vide ; la couche `search` doit alors basculer sur une navigation par facettes plutôt que renvoyer un zéro résultat.

#### Résultat n°8 — français : ne PAS mettre `locale: "fr"` sur les champs de référence, et pourquoi

C'est le piège le plus contre-intuitif de la section, et il se déduit de l'interaction de deux paramètres.

La documentation de localisation est explicite : **sans `locale`, un champ est traité comme de l'anglais, et les diacritiques des caractères accentués européens sont automatiquement retirés** ; avec un `locale` non anglais, la tokenisation ICU **préserve** les diacritiques, et une correspondance accentuée exacte est priorisée. La doc ajoute qu'en l'absence de correspondance accentuée, la tolérance aux fautes rattrape la version non accentuée.

Or nous avons décidé au Résultat n°4 de mettre **`num_typos=0` sur `marque` et `modele`**. Le filet de sécurité disparaît donc : avec `locale: "fr"` sur `marque`, **« citroen » ne trouverait plus « Citroën »**, ni « skoda » « Škoda », ni « bleu ciel métallisé » sa variante non accentuée. Un Français sur deux ne tape pas les accents dans une barre de recherche.

**Décision :**

| Champ | `locale` | `stem` | Raison |
|---|---|---|---|
| `marque`, `modele`, `version`, `generation`, `titre` | **absent** | `false` | repli des diacritiques voulu (citroen = Citroën) ; pas de racinisation sur des noms propres |
| `description_courte` | **`"fr"`** | **`true`** | seul champ de vraie prose française ; la tolérance aux fautes y est active, donc le repli accentué est assuré |
| tout le reste | absent | `false` | champs de facette, indexés verbatim |

Précision utile pour `description_courte` : la langue du racineur est **déduite du `locale` du champ** (Snowball). Sans `locale`, `stem: true` appliquerait les règles anglaises à du texte français — pire que pas de racinisation. La documentation avertit par ailleurs que la racinisation algorithmique « peut dégrader la pertinence sur les noms de marques, noms propres et lieux », ce qui est exactement le contenu d'une annonce auto : si le Snowball français sur-racinise (« berline »/« berlin »), le repli est un **dictionnaire de racinisation personnalisé** (`stem_dictionary`, format JSONL `{"word": …, "root": …}`), qui donne un contrôle exact sans effet de bord.

#### Résultat n°9 — facettes : l'ordre se déduit du marché, et deux corrections

**Ce que dit la documentation sur les facettes (et qui corrige le §14.1) :** l'échantillonnage des comptages de facettes est **désactivé par défaut** (`facet_sample_percent = 100`, `facet_sample_threshold = 0`) — il s'active à la demande, il n'est pas subi. Le §14.1 affirmait que « Typesense échantillonne les comptages au-delà d'un seuil » : c'est inexact. En revanche, deux plafonds réels subsistent : **`max_facet_values` vaut 10 par défaut** (masquant les valeurs suivantes), et la stratégie `top_values` (retenue automatiquement par `facet_strategy: automatic` sur les gros volumes) **ne renvoie pas un `total_values` exact**. **La décision du §14.1 — compteurs publics servis par un `COUNT` Postgres mis en cache — reste donc la bonne, mais pour ces deux motifs et non pour l'échantillonnage.**

Réglages retenus : `max_facet_values=100` sur marque et modèle (il y a plus de 10 marques), `facet_strategy=exhaustive` (à 50 000 documents la documentation la donne comme optimale), `facet_query` + `facet_query_num_typos` pour la recherche dans une facette (« tapez votre marque »).

**Ordre des facettes, déduit de données de marché plutôt que d'intuition** (sources en annexe, issues d'extraits de résultats de recherche — voir Limites) :

| Rang | Facette | Justification chiffrée |
|---|---|---|
| 1 | **prix** | critère d'entrée universel |
| 2 | **marque / modèle** | l'essentiel des requêtes en contiennent un (Résultat n°1) |
| 3 | **énergie** | le diesel reste **44 % des ventes VO** en 2025, contre 4,8 % du neuf : la structure de la demande VO est radicalement différente du neuf |
| 4 | **boîte de vitesses** | **54 % des voitures neuves immatriculées en 2025 sont automatiques** (PFA), contre 25 % en 2016 et 8 % en 2004 — ces véhicules arrivent en VO maintenant. La boîte cesse d'être un critère de niche ; l'enterrer dans « plus de critères » est une erreur de conception à 5 ans |
| 5 | km, année | |
| 6 | carrosserie, places | |
| 7 | garantie, première main, transmission | différenciateurs de confiance (§6) |
| — | **Crit'Air : attribut affiché, pas facette de premier rang** | l'Assemblée nationale a voté la **suppression des ZFE le 28/05/2025** dans le cadre de la loi de simplification. L'avenir de la vignette est incertain. Garder le champ (`critair` est au schéma, il coûte 4 octets) et l'afficher, mais ne pas en faire un filtre structurant — et ne pas construire d'argument marketing dessus |

Le parc VO français vieillit (**âge moyen 11,1 ans**) et le marché de l'occasion pèse **5,5 M de transactions en 2025 (+0,9 %), soit 77 % des achats de voitures** : le stock adressable est très majoritairement composé de véhicules anciens, diesel et à boîte manuelle, alors que la demande bascule vers l'automatique. C'est un écart d'offre et de demande que la recherche doit rendre visible, pas masquer.

#### Résultat n°10 — La Centrale a déjà déployé la recherche en langage naturel, et le chiffrage dit de ne pas la copier au MVP

Découverte de veille concurrentielle, tombée de cette action. **La Centrale a mis en production une recherche en langage naturel** intégrée à son parcours (exemple documenté par la presse spécialisée : « j'ai trois enfants et je cherche une voiture spacieuse à moins de 15 000 euros dans un rayon de 40 km autour de Marseille »), et revendique une vingtaine de cas d'usage IA en production dont un assistant de pricing pour les professionnels. Le concurrent le plus proche de LBT sur la verticale auto est donc déjà sur le terrain de la pertinence sémantique — **la fenêtre identifiée par l'action n°27 est plus étroite qu'on ne le pensait**, et l'avantage ne sera pas « LBT comprend le français », il sera « LBT comprend le français sur son périmètre pour un coût marginal nul ».

**Chiffrage, parce que c'est lui qui tranche.** Faire analyser chaque requête par un modèle de langage : ~600 tokens d'entrée (consigne + requête + référentiel abrégé) et ~60 de sortie. Aux tarifs Claude Haiku 4.5 (1 $/MTok en entrée, 5 $/MTok en sortie) :

| Configuration | Coût / requête | À S3 (1,5 M visites/mois ≈ 2 à 4 M requêtes) |
|---|---|---|
| Appel systématique, sans cache | ~0,0009 $ ≈ **0,0008 €** | **1 600 à 3 200 €/mois** |
| Appel systématique, avec mise en cache du prompt (lecture ≈ 0,1× l'entrée) | ~0,0005 $ ≈ **0,0004 €** | 800 à 1 600 €/mois |
| **Appel uniquement sur la traîne à zéro/faible résultat (~8 % des requêtes) + cache par requête normalisée** | idem à l'unité | **60 à 130 €/mois** |

Mise en regard : la chaîne de modération complète du §7.1 coûte **78 €/mois** au même palier. Un appel LLM systématique coûterait donc **20 à 40 fois toute la modération**, pour un gain qui, sur les requêtes structurées du Résultat n°1, est nul — le normaliseur fait le même travail gratuitement.

**Décision :** normaliseur + synonymes + curation d'abord (coût marginal zéro) ; **analyse par LLM en repli uniquement sur les requêtes à zéro ou très faible résultat**, avec mise en cache par chaîne de requête normalisée (la distribution des requêtes est très concentrée : quelques milliers de requêtes distinctes couvrent l'essentiel du trafic). Au pilote, ce repli coûte moins d'un euro par mois — donc on peut le construire tôt et le mesurer, à condition de ne jamais le mettre sur le chemin par défaut. Les tarifs Haiku 4.5 sont à revérifier à la mise en œuvre.

#### Résultat n°11 — protocole de mesure : 50 requêtes annotées, et la règle qui va avec

Tout ce qui précède est de la conception documentaire. Rien n'a été testé (aucun nœud Typesense n'a été démarré). Le paramètre décisif — la pertinence perçue en français sur du vocabulaire automobile — ne s'obtient que par mesure, et **le jeu de test est constructible dès aujourd'hui, avant toute ligne de code**.

**Composition du jeu de 50 requêtes** (Nicolas peut l'écrire seul, à partir des demandes téléphoniques réelles de son garage — c'est la meilleure source disponible et elle est gratuite) :

| Nb | Type | Exemples |
|---|---|---|
| 15 | marque + modèle simples | `clio`, `kangoo`, `golf 7`, `3008` |
| 8 | avec génération ou millésime | `clio 3`, `clio III`, `golf VII`, `208 2019` |
| 7 | avec finition ou motorisation | `3008 gt line`, `308 1.5 bluehdi`, `a3 s-line` |
| 5 | références chiffrées proches | `308` (ne doit jamais rendre de 208), `a4`, `c4`, `série 3` |
| 5 | fautes de frappe plausibles | `kango`, `twingoo`, `citroen c3`, `peugot 208` |
| 5 | langage naturel / usage | `voiture 7 places pas cher`, `petite voiture automatique` |
| 5 | géolocalisées | `utilitaire diesel toulouse`, `kangoo 31` |

**Indicateurs, dans cet ordre de priorité :**
1. **taux de zéro-résultat** (la métrique la plus actionnable : chaque zéro est une entrée manquante du dictionnaire ou du normaliseur) ;
2. **précision@5** annotée à la main (combien des 5 premiers résultats sont pertinents) ;
3. taux de clic sur les 3 premiers résultats, une fois le pilote en trafic ;
4. **contacts par vue de fiche** — la seule métrique qui relie la pertinence à la §5.2, donc à la garantie contacts, donc au chiffre d'affaires.

**Règle de gouvernance à inscrire maintenant : aucun changement du schéma d'index, des poids de champs ou du dictionnaire de synonymes ne part en production sans un nouveau passage des 50 requêtes.** C'est la seule protection contre le mode de défaillance classique de la recherche — une amélioration locale qui dégrade silencieusement dix autres requêtes. → action n°40.

#### Conséquences sur les autres sections

- **§5.2 (options de visibilité)** : le plafond de densité (1 sponsorisé dans les 5 premiers, 20 % par page) **n'est pas implémentable dans le moteur** ; il exige une couche d'entrelacement déterministe côté application, avec une contrainte de pagination non triviale → action n°37. La décision reste valide, son coût de mise en œuvre était sous-estimé.
- **§6 (UX)** : trois exigences nouvelles — (a) zéro résultat explicite plutôt que résultats élargis en silence, avec un bouton « élargir la recherche » qui le dit ; (b) ordre de facettes énergie puis boîte de vitesses en tête, Crit'Air rétrogradé en attribut affiché ; (c) une requête entièrement composée de mots vides bascule sur la navigation par facettes.
- **§7.2 (modération)** : `score_qualite`, déjà nécessaire à la pertinence, alimente aussi la priorisation de la file de revue ciblée — un seul champ pour deux usages.
- **§9 (acquisition)** : `departement` et `region` sont indexés et facettables, condition des pages SEO géolocalisées ; les compteurs affichés viennent de Postgres (confirmé, avec une justification corrigée — cf. Résultat n°9).
- **§14 et §14.1** : deux corrections. (a) La tolérance aux fautes se règle mieux par `enable_typos_for_numerical_tokens=false` et `enable_typos_for_alpha_numerical_tokens=false` que par `num_typos` par champ — l'argument de départage face à Meilisearch reste valide mais le mécanisme retenu change. (b) Typesense **n'échantillonne pas** les comptages de facettes par défaut ; les plafonds réels sont `max_facet_values=10` et le `total_values` approximatif de la stratégie `top_values`. La décision « compteurs depuis Postgres » ne bascule pas. Nouvelle contrainte dure à retenir : **3 champs de tri maximum** par requête.
- **§17** : sept actions étaient classées bloquées pour un motif erroné (Résultat n°0) → action n°35 en tête de file.

#### Limites et incertitudes assumées

- **Aucun test exécuté.** Aucun nœud Typesense n'a été démarré, aucun document indexé. Toute cette section est de la conception adossée à la documentation officielle. Le comportement du tokenizer sur `1.5 dCi`, `e-208`, `ë-C4`, `GT Line+` **n'est pas déductible de la documentation** et doit être mesuré (action n°39).
- **Le dictionnaire de synonymes est une hypothèse de vocabulaire, pas une observation.** Il vient de la connaissance du domaine, pas des requêtes réelles des acheteurs — que seul le pilote produira. Il faut s'attendre à ce que 20 à 30 % des entrées soient inutiles et qu'un nombre équivalent manque.
- **Le référentiel marque/modèle/version n'existe pas encore.** La piste ADEME Car Labelling est identifiée mais **n'a pas pu être téléchargée** (politique réseau, Résultat n°0) : son contenu exact — notamment la granularité des dénominations commerciales et sa couverture du parc ancien — reste à vérifier.
- **Les chiffres de marché (5,5 M de transactions VO 2025, diesel 44 % du VO, 54 % de boîtes automatiques dans le neuf, âge moyen 11,1 ans, suppression des ZFE votée le 28/05/2025) proviennent d'extraits de résultats de recherche, pas de pages sources consultées** — les domaines concernés sont refusés par la politique réseau. Ils sont cohérents entre eux et avec des ordres de grandeur connus, mais ils doivent être revérifiés sur AAA-Data, la PFA et le SDES avant tout usage externe (argumentaire commercial, communication). L'état exact du droit sur les ZFE fin 2026 est en particulier à confirmer.
- **Le chiffrage de l'analyse LLM repose sur une hypothèse de volume de requêtes** (2 à 4 recherches par visite, dérivée des 1,5 M visites/mois du §5.1, elles-mêmes non validées) et sur des tarifs à revérifier. La conclusion — deux ordres de grandeur d'écart entre l'appel systématique et l'appel en repli — est robuste à un facteur 2 sur l'un ou l'autre.
- **`score_popularite` est un champ sans formule.** Sa composition (vues, contacts, complétude, fraîcheur, et leurs poids) n'est pas définie et ne peut pas l'être sans données. Au pilote, une valeur constante suffit : le champ doit exister au schéma, sa formule peut attendre.
- **Rien n'a été vérifié sur la façon dont LBC ou La Centrale traitent réellement ces requêtes.** L'affirmation du §14.1 selon laquelle « LBC exploite mal la pertinence sémantique » n'est toujours pas étayée par un test comparatif — et le Résultat n°10 montre qu'elle est déjà fausse pour La Centrale.

---

## 15. Skills nécessaires au projet — veille & gestion

- Bibliothèque actuelle : 341 skills installés le 2026-07-26 (voir [[installed-skills-library]] en mémoire), audités et liés entre eux.
- Gap connu : pas de skill dédié "stratégie marketplace/anti-fraude" — comblé par ce document.
- **À faire en continu** : identifier les nouveaux besoins au fil du projet (ex. un skill précis sur le moteur de recherche choisi, sur la conformité DAC7, sur un framework retenu), rechercher s'il existe une ressource fiable, l'auditer avant installation (même processus de sécurité que le 2026-07-26 : pas d'installation sans vérification), et tenir cette section à jour avec ce qui a été ajouté et pourquoi.
- **Veille technologique** : suivre les évolutions techniques pertinentes (moteurs de recherche, frameworks marketplace, outils anti-fraude) pour garder les choix du §14 à jour plutôt que figés une fois pour toutes.
- **Besoins identifiés le 2026-07-28** (pour une session locale future, l'agent quotidien n'a pas accès au dossier de skills) :
  - ~~Un skill **modération de contenu automatisée**~~ → **partiellement comblé le 2026-07-29 par la §7.1** (comparaison d'API et architecture retenue). Reste utile pour la partie *workflow* (seuils, escalade, revue humaine), qui relève de l'action §17 n°12.
  - Un skill **FinOps / modélisation de coûts cloud** serait utile mais le travail du 2026-07-28 a été fait sans, à la main : priorité basse.
  - ~~Un skill **Meilisearch**~~ → **précisé le 2026-07-31 : le moteur retenu est Typesense (§14.1), le besoin est donc un skill Typesense** (schéma de collection, `filter_by`/`sort_by`, `_eval()`, curation, géo, synonymes, adaptateur InstantSearch).
- **Besoins identifiés le 2026-07-29** (session locale future) :
  - **Priorité haute — un skill « inférence vision auto-hébergée »** : export ONNX / quantification INT8, service d'inférence Python (FastAPI + onnxruntime), YOLO fine-tuning et déploiement, OpenCV. C'est la brique technique centrale de l'architecture de modération retenue (§7.1) et rien dans la bibliothèque actuelle ne la couvre.
  - Un skill **hachage perceptuel / détection de doublons d'images à l'échelle** (pHash, PDQ, index de recherche par distance de Hamming) — c'est la brique anti-fraude n°1 et elle est spécifique.
  - Un skill **conformité DSA** (notification et action, motivation des décisions, seuils micro/petite entreprise des art. 19 et 29) — à croiser avec l'action §17 n°3. **Priorité relevée le 2026-07-30 : haute.** Le travail de la §7.2 a montré que les art. 14, 16, 17 et 20 dictent directement le produit (CGU publiées et lisibles par machine, formulaire de signalement, exposés des motifs, système de réclamation) et que la base juridique a changé en 2024 (loi SREN) — un domaine où travailler de mémoire est dangereux.
- **Besoins identifiés le 2026-07-30** (session locale future) :
  - **Contrainte d'environnement à traiter en priorité, avant tout besoin de skill** : la politique réseau de l'environnement d'exécution des sessions automatisées bloque (403) les sources officielles les plus utiles au projet — `eur-lex.europa.eu`, `www.legifrance.gouv.fr`, `www.cnil.fr`, `huggingface.co`, `img.leboncoin.fr` (rapport de transparence DSA de LBC), `static.ebayinc.com`, ainsi que `developers.cloudflare.com`, `aws.amazon.com` et `azure.microsoft.com` (déjà constaté les 28 et 29/07). Les recherches passent, les consultations directes non. **Toute vérification sur texte officiel doit donc être faite en session locale** — c'est la limite structurelle des sessions automatisées, pas un incident ponctuel.
  - Un skill **rédaction de CGU / politique de modération conformes au DSA** (art. 14, 16, 17, 20, 23) avec modèles d'exposé des motifs — livrable rédactionnel sur le chemin critique du lancement (§8).
- **Besoins identifiés le 2026-07-31** (session locale future) :
  - **Priorité moyenne — un skill `Typesense`** : modélisation de collection, `filter_by` / `sort_by` multi-critères, `_eval()` et curation, géo (`exclude_radius`, `precision`), synonymes, `num_typos` par champ, adaptateur InstantSearch, exploitation en production (un nœud puis Raft). Remplace le besoin « Meilisearch » du 2026-07-28.
  - Un skill **pertinence de recherche e-commerce en français** (synonymes, lemmatisation, évaluation de pertinence par jeu de requêtes annotées) — c'est la limite explicitement assumée du §14.1 et rien ne la couvre. Plus utile que le skill moteur lui-même : le moteur s'apprend en une journée, la pertinence est un métier.
  - Pas de nouveau besoin d'outillage FinOps : le §14.1 s'est fait sans, comme le §5.1.
- **Besoins identifiés le 2026-08-01** (session locale future) :
  - **Priorité haute — un skill « flux et multidiffusion automobile »** : formats de flux VO du marché français (Ubiflow, Kepler VO, Stockway, exports DMS), champs standards d'un véhicule d'occasion, réconciliation et gestion des retraits. C'est la brique qui conditionne l'existence même du segment pro (§5.2, Résultat n°2) et rien dans la bibliothèque ne la couvre — ni ne peut la couvrir sans documentation obtenue auprès des multidiffuseurs eux-mêmes. **Ce besoin est autant commercial que technique : il commence par un appel à Ubiflow.**
  - Un skill **packaging et pricing SaaS/marketplace B2B** (construction de paliers, ARPA et mix, garanties de performance, migration tarifaire) serait utile ; le §5.2 s'est fait sans, à la main. Priorité moyenne.
  - **Aggravation de la contrainte réseau, à traiter avant tout** : l'**intégralité du domaine `leboncoin.fr`** est désormais constatée inaccessible depuis les sessions automatisées (`leboncoinsolutionspro.fr`, `assistance.leboncoin.info`, `leboncoin.fr/dc/cgv_pro`), ainsi que la presse spécialisée (`autoactu.com`, `clubic.com`, `fiches-auto.fr`) et les forums professionnels (`dealabs.com`). **Conséquence directe : l'action n°8 (veille concurrentielle LBC) est structurellement infaisable depuis l'agent quotidien** — il faut soit la basculer en session locale, soit lui donner une autre source (alertes e-mail, capture manuelle par Nicolas depuis son propre espace pro LBC, qui est de toute façon la meilleure source du marché).

- **Besoins identifiés le 2026-08-02** (session locale future) :
  - **Ce n'est pas un skill qu'il faut, c'est un réglage** : la contrainte réseau notée le 2026-08-01 comme « aggravation » est en réalité **notre propre politique réseau d'environnement d'exécution** et non un blocage des sites (§14.2, Résultat n°0). Elle se corrige par configuration → action §17 n°35. **Corollaire de méthode immédiatement réutilisable : la documentation technique de la plupart des logiciels libres est versionnée sur GitHub, donc accessible malgré la politique** — l'intégralité de la documentation Typesense v30.2 (~500 Ko) a été lue dans `raw.githubusercontent.com/typesense/typesense-website`. Même méthode applicable à Postgres, Meilisearch, YOLO, PaddleOCR, et à tout choix du §14.
  - **Précision du besoin de skill Typesense** : viser l'API **v30.x** et non les tutoriels antérieurs — les synonymes sont passés de `/collections/{c}/synonyms` à des **jeux de synonymes** (`/synonym_sets`) liés à la collection, la curation à des **jeux de curation** (`curation_sets`), et le comportement de `group_by` a changé en v29 (`found` devient approximatif). Un skill adossé à la documentation v28 ou antérieure produira du code faux.
  - Un skill **pertinence de recherche e-commerce en français** reste le besoin le plus utile et le moins couvert (analyse de requêtes, dictionnaires de synonymes, jeux de test annotés, mesure de la pertinence perçue) ; la §14.2 a été faite sans, à la main.
  - Un skill **référentiels de données automobiles françaises** (ADEME Car Labelling, CNIT, SIV, AAA-Data, Eurotax/Autovista) serait directement rentable pour les actions n°36 et n°34. Priorité moyenne.

## 16. Journal d'avancement quotidien

*Chaque session de travail (manuelle ou automatisée) ajoute une entrée datée ici : ce qui a été fait, ce qui a été décidé, ce qui reste ouvert.*

- **2026-07-27** — Création du document v1 (positionnement, concurrence, segments, modèle économique, UX, technique, légal, acquisition, roadmap, organisation, risques). Mise en place prévue d'un agent quotidien automatisé pour faire avancer le document en continu.
- **2026-07-28** — **Action §17 n°1 traitée : modèle de coût d'infrastructure par annonce et par pro** (nouvelle §5.1, tarifs sourcés en annexe). Cinq conclusions : (1) l'architecture image détermine tout — variantes pré-générées + object storage à egress nul = ~40× moins cher que Cloudflare Images au palier national, et coût insensible au trafic ; (2) le socle technique d'une annonce ne coûte que **~0,041 €** ; (3) le coût marginal réel est **~0,19 €/annonce dont ~80 % humain** (modération + support) — le levier de coût est l'automatisation de la modération, pas les serveurs ; (4) un garage pro coûte **~10 €/mois** en variable direct contre **1 780 €/mois facturés par LBC** pour le même périmètre : marge brute ~90 % dès 99 €/mois, le prix pro n'est pas contraint par les coûts ; (5) le vrai arbitrage est le seuil de rentabilité — à 149 €/mois et 15 k€/mois de coûts fixes, il faut **108 garages**, ce qui valide la cohérence de l'objectif M12 (200 garages) du §2. **Décisions techniques dérivées** : Algolia et Cloudflare Images (mode stockage) écartés du §14 ; recommandation de cadrage à 149 €/mois pour l'action n°6. **Découverte annexe** : sources secondaires indiquant que LBC a réduit les photos gratuites à 3 et limiterait les particuliers à 2 annonces auto gratuites/an — à confirmer (nouvelle action n°13), potentiel axe de différenciation à coût nul pour LBT.

- **2026-07-29** — **Action §17 n°11 traitée : modération automatique des images** (nouvelle §7.1, sources en annexe). Le résultat le plus important est un recadrage, pas un prix : **les API de modération commerciales (Hive, Sightengine, AWS Rekognition, Azure, Google Vision) sont conçues pour l'UGC social — nudité, violence, armes — et ne couvrent aucun des trois risques réels d'une annonce auto** : photo volée/réutilisée (arnaque n°1, exige du hachage perceptuel), plaque d'immatriculation visible (obligation RGPD/CNIL, exige un détecteur + floutage), coordonnées incrustées dans l'image (exige de l'OCR). Le choix n'était donc pas « quelle API » mais « quelle chaîne construire ». **Architecture retenue** : cascade auto-hébergée sur **un seul serveur 4 vCPU à ~25 €/mois, sans GPU** (pHash/PDQ + ViT NSFW en ONNX INT8 + YOLOv11 plaques + PaddleOCR ≈ 25 h de CPU/mois sur 720 disponibles au palier national), complétée par un modèle vision-langage (Claude Haiku 4.5, ~0,0016 $/image) appelé **uniquement sur l'image de couverture et les images signalées** (~53 €/mois) pour la compréhension sémantique. **Total ~78 €/mois à 250 k images/mois, soit 0,003 €/annonce contre 0,018 € estimé la veille** ; le sous-total technique du §5.1 passe à ~0,026 €/annonce et le coût marginal total à ~0,175 €, dont ~85 % d'humain — la conclusion du 2026-07-28 est renforcée. **GPU écarté** : auto-héberger un VLM coûterait 577 à 889 €/mois contre ~53 € pour l'API. **Différenciateur produit tombé de l'analyse** : le détecteur de plaques étant déjà présent pour raison légale, **le floutage automatique au dépôt est gratuit — et LBC ne le propose pas nativement** (les vendeurs passent par des applis tierces) ; argument de confiance immédiat, ajouté au §6. **Découvertes juridiques** (§8) : position CNIL sur les plaques ; DSA art. 16-17 (notification/action et motivation des décisions) applicables dès le jour 1 et contraignant l'outillage de modération, tandis que les art. 19 et 29 excluent les micro/petites entreprises des obligations de transparence et de traçabilité des vendeurs pros, avec une prolongation de 12 mois après la perte du statut. **Limite majeure assumée** : les taux de faux positifs/négatifs des modèles ouverts n'ont pas été évalués sur des photos de véhicules françaises — c'est le paramètre le plus décisif et il ne s'obtient que par mesure (nouvelle action n°16).

- **2026-07-30** — **Action §17 n°12 traitée : politique de modération** (nouvelle §7.2). L'action était mal posée : le « taux d'échantillonnage humain » n'est pas un paramètre à choisir, c'est le **résultat** d'un budget d'heures réparti sur des files dont trois sont non compressibles. **Architecture retenue : 4 files + 1 file de réclamations** — pré-modération (≤ 2 % des dépôts, 100 % revue, SLA < 4 h), signalements DSA art. 16 (100 %, < 24 h ; < 4 h si grave), **audit aléatoire de 2 % des annonces auto-validées** (seule mesure non biaisée du taux de faux négatifs), revue ciblée élastique (scénario central 20 %, priorisée par score × prix du véhicule), réclamations art. 20 (< 48 h, par une autre personne). **Principe directeur contre-intuitif : le risque dominant est la sur-modération, pas la sous-modération** — l'Appeals Centre Europe infirme **52 % des décisions de retrait** des plateformes qu'il examine (59 % toutes décisions confondues), et sans effet de réseau un vendeur injustement bloqué est perdu définitivement. D'où « **publier par défaut, bloquer par exception** », précision > 90 % exigée pour toute règle de blocage a priori, et le taux d'infirmation en réclamation traité comme un indicateur de **calibration des seuils** et non de performance des modérateurs. **Chiffrage** : ~1 h/mois au pilote, ~10 h/mois au palier régional, **0,73 ETP (~2 220 €/mois) au palier national** ; 2,5 ETP si l'on revoit 100 % des annonces. **Correction du §5.1** : le coût de modération humaine passe de 0,058 à **0,089 €/annonce (+53 %)** — le modèle du 28/07 omettait les signalements, les réclamations et l'audit, dont deux sont des obligations légales. Coût marginal par annonce : **~0,21 € dont ~87 % d'humain** ; le coût par garage pro passe de 10,0 à 10,3 €/mois et **aucune conclusion du §5.1 ne bascule** (seuil de 108 garages à 149 €/mois inchangé). **Décision retenue : 100 % de revue humaine jusqu'à ~1 000 annonces/mois** — non par prudence (cela coûte 3,4 h/mois) mais parce que c'est ce qui produit la mesure de prévalence et le jeu de données étiqueté dont l'action n°16 a besoin : le pilote *est* la campagne de mesure. **Modération gardée en interne** (BPO 2 à 6× moins cher par élément mais sans connaissance du marché français de l'occasion — l'avantage de Nicolas est ici structurel). **Découverte juridique majeure (§8) : la LCEN n'est plus la base juridique de la modération** — la loi SREN n° 2024-449 du 21 mai 2024 a abrogé les dispositions générales de l'art. 6 LCEN sur la notification des contenus illicites (l'ancien 6.I.8 devenant 6-3) ; ce sont les art. 6 et 16 et suivants du DSA qui s'appliquent, et l'**art. 14 impose de publier la politique de modération** dans un format lisible par machine, sans exclusion pour les petites entreprises. **Conséquence produit** : le friction-fee anti-fraude du §5 se révèle être avant tout un **signal de modération** (une empreinte bancaire vérifiée vaut mieux que n'importe quel modèle de vision) — il doit donc être vendu comme un accélérateur de publication, pas comme une taxe. **Limite d'environnement** : les sources officielles clés (`eur-lex`, `legifrance`, `cnil.fr`, rapport de transparence DSA de LBC sur `img.leboncoin.fr`, rapports DSA d'eBay) sont **bloquées par la politique réseau** de l'environnement d'exécution — le DSA a été travaillé sur sites miroirs, à revérifier en session locale (action n°21).

- **2026-07-31** — **Action §17 n°2 traitée : comparatif des moteurs de recherche** (nouvelle **§14.1**). **Le résultat structurant est un recadrage du critère de choix : au volume de LBT, la recherche n'est pas un problème d'échelle.** Le stock actif est de 500 annonces au pilote, 5 000 au régional et **50 000 au palier national** (§5.1) — soit ~60 Mo de données indexables. Typesense (index tout en RAM, 2-3× le jeu de données) demande **~150 Mo**, Meilisearch (LMDB mappé en mémoire) moins encore, et Elasticsearch part de 1-8 Go de plancher JVM *quoi qu'on indexe*. **Les trois tiennent sur un VPS à 7-17 €/mois** pour un poste budgété 50 €. Conclusion de méthode : **tout arbitrage fondé sur des benchmarks de latence ou de scalabilité est hors sujet** — le seuil où l'écart RAM entre Typesense et Meilisearch deviendrait un argument est à ~2 M de documents, un ordre de grandeur au-dessus du plan à 36 mois. **Décision : Typesense**, départagé sur deux besoins métier et un risque de licence, aucun n'étant un critère de performance : (1) **boost commercial au moment de la requête** — `_eval()` (« optional filtering ») et curation/épinglage permettent de remonter conditionnellement les annonces des pros payants et de l'A/B tester sans réindexer, là où Meilisearch n'a **pas de pinning natif** et n'expose que des règles de ranking statiques définies au niveau de l'index ; (2) **tolérance aux fautes réglable par champ** (`num_typos=2,0,0`) — critique sur les références chiffrées de l'automobile (**308/208/508, A3/A4, C3/C4** sont à une substitution les uns des autres), là où Meilisearch n'offre qu'un `disableOnNumbers` global depuis la v1.15 ; (3) **trajectoire de licence — et ici le réflexe « MIT > GPL » est faux pour notre usage** : la GPL-3.0 de Typesense n'impose rien à LBT puisque nous exploitons le moteur comme service réseau sans le distribuer (la GPL, contrairement à l'AGPL, se déclenche à la distribution), tandis que **Meilisearch a placé sharding et réplication dans une Enterprise Edition sous BSL 1.1** (`LICENSE-EE` du dépôt : usage non-production uniquement, accord commercial requis en production, bascule MIT à 4 ans), quand Typesense garde le **clustering Raft dans l'open source**. **Écartés** : Elasticsearch/OpenSearch (coût d'exploitation JVM disproportionné sans admin sys — leur seul avantage structurel, le **percolateur** pour les alertes « nouvelle annonce », se contourne en SQL à 35 nouvelles annonces/heure ; si ES devenait nécessaire, **OpenSearch** est le défaut, Apache-2.0 contre le triple licence AGPL/ELv2/SSPL d'Elastic) ; **Postgres seul** (suffisant au pilote, mais la charge de recherche concurrencerait la charge transactionnelle et la réécriture ultérieure coûterait des semaines pour un composant à 7-17 €/mois) ; **la pile native Cloudflare** (D1/FTS5 + Vectorize : ni facettes, ni fautes de frappe, ni géo). **Deux décisions d'architecture dérivées** : (a) **les compteurs des pages SEO viennent d'un `COUNT` Postgres**, jamais du moteur — Meilisearch plafonne l'exhaustivité à `maxTotalHits` (1 000 par défaut) et Typesense échantillonne les facettes ; (b) **trois conditions de réversibilité** posées dès la première ligne de code (moteur jamais source de vérité, module d'abstraction interne, réindexation complète routinière) qui ramènent un changement de moteur à quelques jours — ce qui autorise à trancher sans sur-débattre. **Adoption en deux temps** : Typesense Cloud pendant le MVP et le pilote (~22-50 $/mois — payer pour ne pas opérer un serveur tant qu'aucune ressource technique n'est affectée, §11), auto-hébergé un nœud ensuite. **Limite majeure assumée** : la **pertinence en français** (lemmatisation, accents, vocabulaire automobile) n'a pas été évaluée et n'est mesurable que sur nos données — c'est probablement plus déterminant que tout le comparatif (nouvelle action n°27). **Biais de sources signalé** : l'essentiel des comparatifs « X vs Y » indexés est publié par les éditeurs eux-mêmes (les pages « Typesense pricing » les mieux classées sont sur `meilisearch.com` ; la page de comparaison de Typesense affirme encore que Meilisearch « n'est pas production-ready ») — le travail s'est appuyé en priorité sur la documentation technique et sur le fichier de licence lu directement dans le dépôt. **Limite d'environnement, inchangée depuis le 28/07** : `typesense.org`, `cloud.typesense.org` et `meilisearch.com/docs` renvoient un **403**.

- **2026-08-01** — **Actions §17 n°6 et n°29 traitées ensemble : paliers d'abonnement pro et options de visibilité** (nouvelle **§5.2**). **Le résultat structurant contredit un raccourci de ce document : « 12× moins cher que LBC » n'est pas une position défendable.** Un garage n'achète pas un abonnement, il achète des contacts acheteurs — et le référentiel du marché est le **coût par lead**. Avec un taux de transformation VO de **15,9 %** (baromètre Carvivo 2022) et un repère de **~35 € HT le lead**, le garage type du §5.1 (20 véhicules, 10 ventes/mois) a besoin de **~63 contacts/mois** ; la facture LBC de 1 780 € revient donc à **28 €/contact** si LBC les livre tous, **~64 €** si LBC en livre sa part de marché des leads (44 %, Carvivo). **LBC est cher d'un facteur ~2 au contact, pas d'un facteur 12** — le facteur 12 est un rapport de factures, pas de valeur. Annoncé tel quel à un garagiste, il fait entendre « 12× moins d'audience », ce qui sera vrai au démarrage. **Le seuil qui compte est étonnamment bas : à 149 €/mois, LBT devient rationnel dès ~5 contacts qualifiés/mois** — soit 100 contacts/mois pour 20 garages pilotes. C'est le vrai objectif produit de la phase 1, ajouté au §2. **Deuxième découverte, en amont du prix : le blocage n'est pas tarifaire, il est logistique.** Un garage ne saisit pas ses annonces à la main, il pousse son stock en flux XML via **Ubiflow, Kepler VO ou Stockway**. Tant que LBT n'est pas une destination de ces outils, le coût d'entrée réel est la ressaisie de 20 à 60 véhicules, que **ni la gratuité ni aucune garantie ne compensent** ; une fois destination, essayer LBT est une case à cocher. Nouveau chantier produit (§6), nouveau risque (§12), nouveau levier d'acquisition en tête du §9, action n°31. **Grille retenue** : unité = **l'emplacement** (véhicules en ligne), jamais le crédit — LBC vient de prouver le contraire par l'exemple, son quota décomptant les renouvellements comme des publications. Cinq paliers HT/mois **sans engagement** : Découverte ≤ 3 véh. **0 €**, Garage 4-15 **79 €**, Garage+ 16-30 **149 €**, Concession 31-60 **249 €**, Groupe 61-120 **399 €** — marge brute **90 à 94 %**, et le palier gratuit ne coûte que **0,30 €/mois par compte à condition qu'il n'ouvre droit à aucun support humain** (avec support : 2 875 €/mois pour 500 comptes, soit 10 % de l'objectif de CA M12 — le coût du gratuit est une décision de support, pas une fatalité). **Différenciateur central retenu : la garantie contacts** — « jamais plus de 30 € le contact, ou le mois est offert » — qui rend l'audience faible du démarrage inoffensive au lieu d'en faire un aveu, s'auto-calibre par région, et coûte au maximum ~10 €. **Options de visibilité (action n°29) : aucune vente à l'unité aux pros au MVP**, quota mensuel inclus par palier ; épinglage sur requête écarté ; plafond de densité 1 sponsorisé dans les 5 premiers et 20 % par page. Le point élégant : **la garantie contacts est aussi le garde-fou anti-sur-monétisation** — saturer les résultats dégrade la pertinence, donc les contacts, donc déclenche les mois gratuits ; LBT ne peut pas s'enrichir en dégradant l'expérience acheteur. **Correction du §2** : « 200 garages abonnés » supposait tous les pros au palier médian ; avec un mix réaliste l'ARPA est de **136 €** et non 149 €, le CA M12 de **27 180 €** et le seuil de rentabilité de **119 comptes payants** (contre 108) — l'objectif devient « 200 comptes pros **payants** », ~300 comptes au total. **Séquence de mise en marché** : grille complète publiée dès le pilote mais facturation qui **s'active d'elle-même** au franchissement du seuil de contacts — pas une promotion qui expire, un prix indexé sur la valeur livrée. **Résultat négatif assumé et important : la grille pro automobile de LBC n'a pas pu être établie** — `leboncoinsolutionspro.fr`, `assistance.leboncoin.info` et les CGV Pro sont toutes en 403, et les montants des agrégateurs (« 29 € », « 79 € ») sont incohérents et trois ordres de grandeur sous la facture réelle : ils ne doivent pas être utilisés. **Le seul repère solide est la facture de Nicolas, qui n'a jamais été relue** (HT ou TTC ? périmètre ? engagement ?) alors que toute la §5.2 en dépend — action n°33, la moins chère de la file. **Limite d'environnement aggravée** : l'intégralité du domaine `leboncoin.fr` et la presse spécialisée auto étant bloquées, **l'action n°8 (veille concurrentielle LBC) est structurellement infaisable depuis l'agent quotidien** (§15).

- **2026-08-02** — **Action §17 n°27 traitée : schéma d'index et pertinence de la recherche auto** (nouvelle **§14.2**). **Le résultat le plus rentable de la session ne concerne pas la recherche : les « 403 » invoqués depuis le 2026-07-28 pour bloquer sept actions de la file ne viennent pas des sites, ils viennent de la politique réseau de notre propre environnement d'exécution.** Le proxy le dit explicitement (`connect_rejected` / « gateway answered 403 to CONNECT (policy denial) ») ; seuls GitHub, GitLab et PyPI sont en liste blanche. Élargir cette liste est un réglage à la portée de Nicolas et débloque les actions n°8, 13, 15, 21, 25, 33 et 34 → **nouvelle action n°35, la moins chère de la file**. Corollaire déjà exploité : la documentation officielle Typesense v30.2 (~500 Ko) a été lue dans son dépôt source sur `raw.githubusercontent.com`, **si bien que cette section est la première du document à être intégralement sourcée en primaire**. **Sur le fond, le recadrage central est que la pertinence auto n'est pas un problème de scoring de texte mais de reconnaissance d'entités** : dans « clio 3 essence », « 3008 gt line 2019 » ou « utilitaire diesel toulouse », **il ne reste aucun texte libre à scorer** — tous les tokens sont des valeurs de facettes écrites sans les facettes. La brique la plus rentable est donc un **normaliseur de requête** (code à nous, versionné, testable), complété par le **filtrage dynamique** de la curation Typesense pour la longue traîne. **Livrables** : schéma de ~40 champs (`range_index` sur prix/km/année, `default_sorting_field: score_popularite` — qui sert aussi à choisir les variantes de préfixe, `max_candidates` porté de 4 à 10), poids `8,6,2,1` avec **`text_match_type=max_weight`** (le défaut `max_score` laisse une description bavarde battre un titre pertinent), `prioritize_num_matching_fields=false` (nos champs sont volontairement redondants : le défaut récompense la verbosité), trois `sort_by` de référence, et un **dictionnaire de ~130 entrées** avec la règle qui le rend sûr — **l'asymétrie** : `root: suv` → 4x4 oui, l'inverse jamais, parce que la plupart des SUV sont à deux roues motrices et qu'un acheteur de 4x4 achète de la motricité. **Trois corrections du §14.1** : (a) la tolérance aux fautes se règle mieux par les deux paramètres **globaux** `enable_typos_for_numerical_tokens=false` et `enable_typos_for_alpha_numerical_tokens=false` que par le `num_typos` par champ ; (b) Typesense **n'échantillonne pas** les comptages de facettes par défaut (les vrais plafonds sont `max_facet_values=10` et le `total_values` approximatif de `top_values`) — la décision « compteurs depuis Postgres » tient, sa justification était fausse ; (c) contrainte dure jamais notée : **3 champs de tri maximum par requête**. **Deux décisions contre-intuitives, chacune adossée à une interaction de paramètres** : **`drop_tokens_threshold=0`** — refuser que le moteur retire silencieusement un mot pour éviter le zéro-résultat, parce qu'un résultat hors critère dégrade le ratio de la **garantie contacts du §5.2 et nous coûte donc directement de l'argent** ; et **pas de `locale: "fr"` sur marque/modèle** — sans locale les diacritiques sont repliés (« citroen » trouve « Citroën »), avec locale ils sont préservés et, comme nous y avons mis `num_typos=0`, le filet de rattrapage disparaît. **Deux bugs évités avant d'exister** : le plafond de densité publicitaire du §5.2 (1 sponsorisé dans les 5 premiers, 20 % par page) est **inexprimable dans le moteur** — `_eval` place *tous* les boostés devant — et exige une couche d'entrelacement déterministe côté application, sous peine de casser la pagination (action n°37) ; et un garage qui pousse 60 véhicules par flux Ubiflow **monopolise la page 1** d'une liste triée par fraîcheur (action n°38, à traiter avec la n°31). **Veille concurrentielle tombée de l'analyse : La Centrale a déjà déployé la recherche en langage naturel en production** — la fenêtre du différenciateur « pertinence » est plus étroite qu'estimé, et le chiffrage tranche contre l'imitation : un appel LLM systématique coûterait **1 600 à 3 200 €/mois au palier national, soit 20 à 40× toute la chaîne de modération (78 €/mois)**, pour un gain nul sur des requêtes structurées → LLM **en repli uniquement sur la traîne à zéro résultat** (~8 %) avec cache, soit 60 à 130 €/mois. Enfin, l'ordre des facettes est déduit de données de marché et non d'intuition : **le diesel reste 44 % du VO** quand il est tombé à 4,8 % du neuf, **54 % des voitures neuves immatriculées en 2025 sont automatiques** (contre 8 % en 2004) — la boîte de vitesses devient une facette de premier rang —, et **Crit'Air est rétrogradé en attribut affiché** après le vote de suppression des ZFE du 28/05/2025. Six nouvelles actions (n°35 à 40), dont trois que Nicolas peut faire seul et sans code.

## 17. File d'attente des prochaines actions (pour les sessions automatisées)

*Liste vivante. Chaque session quotidienne prend l'action la plus prioritaire encore "ouverte", la traite en profondeur, la marque "traitée" avec un résumé, ajoute une entrée au §16, et peut ajouter de nouvelles actions découvertes en cours de route. Une seule action approfondie par jour, pas un survol de plusieurs — la qualité prime sur le volume.*

1. [**traité 2026-07-28**] Modéliser le coût d'infrastructure par annonce/par pro pour fixer un prix pro réaliste (§5) → nouvelle §5.1. Coût marginal ~0,19 €/annonce (dont 80 % humain) et ~10 €/mois par garage pro. Le prix pro n'est pas contraint par les coûts mais par le seuil de rentabilité : 108 garages à 149 €/mois pour 15 k€/mois de coûts fixes. Architecture image et moteur de recherche partiellement arbitrés par le coût (§7, §14).
2. [**traité 2026-07-31**] Comparer 3-4 moteurs de recherche candidats pour le cas d'usage annonces géolocalisées → nouvelle **§14.1**. **Décision : Typesense**, auto-hébergé un nœud, indexé depuis Postgres (Typesense Cloud pendant le MVP tant qu'aucune ressource technique n'est affectée). Recadrage central : **au volume de LBT (50 000 annonces actives à M24, ~60 Mo indexables) aucun candidat n'est contraint par la performance** — les trois moteurs dédiés tiennent sur un VPS à 7-17 €/mois, donc l'arbitrage se joue sur les fonctions métier, pas sur les benchmarks. Départagé par : **boost commercial au moment de la requête** (`_eval()` + curation, absents de Meilisearch), **tolérance aux fautes par champ** (308/208/508), et **trajectoire de licence** (Meilisearch a placé sharding et réplication en Enterprise Edition sous BSL 1.1 ; Typesense garde Raft dans l'OSS — et sa GPL-3.0 n'impose rien à un service réseau non distribué). Écartés : Elasticsearch/OpenSearch (JVM disproportionnée ; le percolateur se contourne en SQL), Postgres seul (repli MVP), pile Cloudflare. Dérivés : compteurs SEO depuis Postgres, trois conditions de réversibilité
3. [ouvert] Détailler les obligations légales précises (LCEN, RGPD, identification vendeurs pro, DAC7) avec sources à jour (§8)
4. [ouvert] Étudier des cas comparables à l'étranger (sites d'annonces auto ayant réussi à se différencier d'un leader établi) pour en tirer des enseignements
5. [ouvert] Chiffrer un premier budget prévisionnel Phase 1 (MVP + lancement régional) (§13)
6. [**traité 2026-08-01**] Définir précisément les paliers d'abonnement pro → nouvelle **§5.2**, traitée avec l'action n°29. **Grille : 5 paliers à l'emplacement, sans engagement — 0 € (≤3 véh.) / 79 € (4-15) / 149 € (16-30) / 249 € (31-60) / 399 € (61-120), HT/mois**, marge 90-94 %, prélèvement SEPA par défaut. **Recadrage central : le référentiel de prix est le coût par contact, pas la facture du concurrent** — LBC est cher d'un facteur ~2 au contact (28-64 €/contact contre un repère marché de 35 €), pas de 12, et « 12× moins cher » s'entend « 12× moins d'audience ». **Différenciateur retenu : la garantie contacts** (« jamais plus de 30 € le contact, ou le mois est offert »), qui rend l'audience faible du démarrage inoffensive. Seuil de rationalité pour un garage : **5 contacts qualifiés/mois**. Corrections dérivées : ARPA 136 € (et non 149 €), seuil de rentabilité 119 comptes payants, objectif §2 reformulé en « 200 comptes pros *payants* ». **Non obtenu : la grille pro auto de LBC** (403 sur tout le domaine leboncoin.fr) → action n°33
7. [**partiellement traité 2026-07-31**] Rechercher si des skills spécifiques manquent pour le moteur de recherche/stack retenus, une fois choisis (§15). **Volet moteur de recherche réglé** : besoin d'un skill **Typesense** et, plus important, d'un skill **pertinence de recherche e-commerce en français** — tous deux inscrits au §15 pour une session locale. Reste ouvert pour le reste de la stack (framework applicatif, ORM, file d'attente), non encore choisie
8. [**bloqué depuis l'agent quotidien — à rebasculer**] Veille concurrentielle LBC — premier point structuré (prix, nouvelles fonctionnalités, communication) (§3). **Constat du 2026-08-01 : l'intégralité du domaine `leboncoin.fr` (dont `leboncoinsolutionspro.fr` et `assistance.leboncoin.info`) et la presse spécialisée auto (`autoactu.com`, `clubic.com`, `fiches-auto.fr`) sont en 403** — cette action est structurellement infaisable en session automatisée. À traiter soit en session locale, soit par une autre source : **Nicolas dispose d'un accès à son propre espace pro LBC, qui est la meilleure source du marché** (grille réelle, options, conditions) — une capture trimestrielle de sa part vaut mieux que toute recherche web **Correction du 2026-08-02 (§14.2, Résultat n°0) : le blocage n'est pas le fait des sites, c'est la politique réseau de notre environnement d'exécution — voir action n°35, qui rend cette action faisable en session automatisée.**
9. [ouvert] Détailler le plan de recrutement des 10-20 premiers garages pilotes (script d'approche, argumentaire face à la frustration tarifaire LBC du 27/04/2026) (§9). **Enrichi le 2026-08-01 (§5.2)** : l'ordre d'argumentation est désormais fixé (garantie contacts → sans engagement → ajout au flux Ubiflow sans ressaisie → prix en conclusion, jamais en ouverture), et le grief LBC précis à exploiter est identifié (le quota décompte les renouvellements comme des publications). Prérequis dur : l'action n°31, sans laquelle le script se heurtera à « je ne vais pas ressaisir mon stock »
10. [ouvert] Étudier la faisabilité technique et légale du système d'avis/réputation vendeur (différenciateur confiance mentionné en §6)
11. [**traité 2026-07-29**] Comparer les options de modération automatique d'images à 250 k opérations/mois → nouvelle §7.1. Conclusion structurante : **les API commerciales ne couvrent aucun de nos trois risques réels** (photo volée, plaque visible, coordonnées incrustées) — elles ne peuvent pas être le socle. Architecture retenue : cascade auto-hébergée sur un serveur CPU à ~25 €/mois (pHash, ViT NSFW, YOLOv11 plaques + floutage, OCR — **sans GPU**) + VLM sélectif à ~53 €/mois. **0,003 €/annonce** au lieu de 0,018 €. Différenciateur produit gratuit identifié : floutage automatique des plaques, absent de LBC (§6). Découvertes juridiques CNIL + DSA reportées en §8.
12. [**traité 2026-07-30**] Définir la politique de modération → nouvelle **§7.2**. 4 files + réclamations, **« publier par défaut, bloquer par exception »** (≤ 2 % de blocage a priori) parce que **la sur-modération est le risque dominant** (Appeals Centre Europe : 52 % des retraits infirmés). Audit aléatoire de 2 % des auto-validées = seule mesure non biaisée des faux négatifs. **100 % de revue humaine jusqu'à ~1 000 annonces/mois** (3,4 h/mois, et cela produit le jeu de données de l'action n°16), puis 0,73 ETP au palier national. **Coût de modération corrigé : 0,089 €/annonce au lieu de 0,058 € — le §5.1 omettait les files légalement obligatoires** ; coût marginal total ~0,21 €/annonce. Modération gardée en interne. Base juridique corrigée : DSA art. 16 et s., plus la LCEN (loi SREN 2024) — cf. §8
13. [ouvert] Vérifier sur sources officielles LBC les quotas particuliers 2026 : nombre de photos gratuites (3 ?) et nombre d'annonces auto gratuites par an (2 puis ~8 € ?) — impact direct sur l'argumentaire de différenciation (§3) **Correction du 2026-08-02 (§14.2, Résultat n°0) : le blocage n'est pas le fait des sites, c'est la politique réseau de notre environnement d'exécution — voir action n°35, qui rend cette action faisable en session automatisée.**
14. [ouvert] Modéliser la déflection du support (FAQ, self-service, réponses automatisées) : 2ᵉ poste du coût marginal par annonce (0,092 €, soit ~48 % du total) (§6, §13)
15. [ouvert] Vérifier les tarifs Sightengine, Meilisearch Cloud et Cloudflare Images sur leurs pages officielles (les chiffres du 2026-07-28 viennent d'agrégateurs tiers ; `developers.cloudflare.com` renvoyait un 403 depuis l'environnement d'exécution) et revalider le taux de change USD/EUR retenu (0,92). **Ajouté le 2026-07-29** : y joindre Cloudflare Workers AI (neurones par classification d'image — non confirmé, fourchette 3 à 55 €/mois au palier S3, écart trop large pour décider), AWS Rekognition (paliers + confirmation du périmètre après l'arrêt du Batch Image Content Moderation aux nouveaux clients le 30/04/2026), Hive et Azure Content Safety. **Étendu le 2026-07-31** : y joindre **Typesense Cloud** (grille horaire RAM/CPU + bande passante, `cloud.typesense.org` en 403) et les **tarifs Hetzner Cloud après la hausse d'avril 2026** (CX33, CPX31), les deux chiffres du §14.1 provenant d'agrégateurs **Correction du 2026-08-02 (§14.2, Résultat n°0) : le blocage n'est pas le fait des sites, c'est la politique réseau de notre environnement d'exécution — voir action n°35, qui rend cette action faisable en session automatisée.**
16. [ouvert] **Priorité haute** — Constituer un jeu de test de 300-500 photos de véhicules réelles (le garage de Nicolas est la source évidente : photos de vitrine, intérieurs, moteurs, plaques sous différents angles, éclairages, états) et **mesurer les taux de faux positifs / faux négatifs** des modèles retenus en §7.1 : détection de plaques (un raté = exposition RGPD), NSFW (un faux positif = travail humain inutile), OCR. C'est le paramètre le plus décisif de l'architecture de modération et il ne s'obtient que par mesure — à faire avant tout développement
17. [ouvert] Déterminer si LBT relèvera du statut **micro ou petite entreprise** au sens de la recommandation 2003/361/CE (< 50 salariés et CA ou bilan ≤ 10 M€), donc exclue des obligations DSA Section 3 (art. 19) et Section 4 (art. 29), et à quelle échéance du plan le seuil serait franchi — l'exclusion se prolongeant 12 mois après la perte du statut, c'est une date à inscrire dans la roadmap (§8, §10)
18. [ouvert] Spécifier le **pipeline de dépôt d'annonce** de bout en bout : ordre des étages de la §7.1, latence cible par étage (budget total < 60 s à la publication), comportement en cas d'indisponibilité d'un modèle (publier et re-modérer, ou bloquer ?), file d'attente asynchrone vs synchrone, et journalisation des décisions exigée par le DSA art. 17 (§7, §8)
19. [ouvert] Concevoir l'**index de déduplication d'images** : quel hachage (pHash 64 bits vs PDQ 256 bits), quel seuil de distance de Hamming, quelle structure d'index à 5 M d'images en base, et quelle politique en cas de correspondance (blocage, signalement, avertissement à l'acheteur) (§7.1)
20. [ouvert] Évaluer une **recherche d'image inversée externe** (au-delà de notre propre base) pour détecter les photos reprises d'autres plateformes — faisabilité technique, légalité, coût. C'est le seul angle mort restant de l'anti-fraude photo (§7.1)
21. [ouvert] **Priorité haute — à faire en session locale** (les sources officielles sont bloquées depuis l'environnement automatisé) : revérifier sur **EUR-Lex** le texte exact des art. 6, 14, 16, 17, 18, 19, 20, 21, 23 et 29 du DSA et sur **Légifrance** l'état de la LCEN après la loi SREN n° 2024-449 du 21/05/2024, puis rédiger les livrables : **CGU décrivant la politique de modération (art. 14, format lisible par machine)**, formulaire et procédure de signalement (art. 16), **modèles d'exposé des motifs par motif de décision (art. 17)**, procédure de réclamation (art. 20). Ces livrables sont sur le chemin critique du lancement public (§8, §7.2) **Correction du 2026-08-02 (§14.2, Résultat n°0) : le blocage n'est pas le fait des sites, c'est la politique réseau de notre environnement d'exécution — voir action n°35, qui rend cette action faisable en session automatisée.**
22. [ouvert] Spécifier le **back-office de modération** : les 4 files avec leurs SLA, l'enregistrement structuré de décision de la §7.2 (13 champs, dont origine et moyens automatisés — exigence art. 17), la conservation 12 mois, l'interface de revue (raccourcis, décisions en un clic, débit cible 80 annonces/h) et le tableau de bord des indicateurs de la §7.2. À croiser avec l'action n°18 (pipeline de dépôt)
23. [ouvert] Définir la **grille de sanctions graduées et les règles anti-abus** en détail (§7.2 en donne le squelette) : seuils de récidive, durées de suspension, gestion des faux comptes après suspension, et traitement des **signalements malveillants entre garages concurrents** — risque spécifique à une place de marché auto
24. [ouvert] Arbitrer **construire ou acheter le back-office de modération** : chiffrer les éditeurs Trust & Safety du marché (Tremau, Checkstep, ActiveFence et autres) contre un développement interne. Repère de cadrage : le besoin est de 0,73 ETP au palier national, un outil facturé à l'élément modéré serait donc probablement disproportionné (§14)
25. [ouvert] **Trouver les données de référence manquantes du §7.2** : taux de signalement pour 1 000 annonces et taux de réclamation sur une place de marché d'annonces. Les rapports de transparence DSA de **LBC France** (`img.leboncoin.fr`), **eBay** (`static.ebayinc.com`) et des places de marché européennes (Wallapop, Marktplaats/Adevinta, OLX) contiennent ces chiffres mais sont **bloqués depuis l'environnement automatisé** → à récupérer en session locale. À défaut, ces deux taux ne s'obtiendront qu'au pilote **Correction du 2026-08-02 (§14.2, Résultat n°0) : le blocage n'est pas le fait des sites, c'est la politique réseau de notre environnement d'exécution — voir action n°35, qui rend cette action faisable en session automatisée.**
26. [ouvert] Évaluer l'intégration de **HistoVec** (service public gratuit d'historique des véhicules) au parcours de dépôt : la fraude au compteur touche ~10,6 % du parc français (carVertical) et une voiture au kilométrage trafiqué se vend ~39 % au-dessus de sa valeur réelle — **aucun contrôle de photo ne détecte cela**, mais un historique administratif attaché à l'annonce le rendrait beaucoup plus difficile. Différenciateur confiance potentiellement fort sur l'auto, à croiser avec l'action n°10 (avis/réputation vendeur) (§6)
27. [**traité 2026-08-02**] Spécifier le schéma d'index et la pertinence de la recherche auto → nouvelle **§14.2**, adossée à la documentation officielle Typesense v30.2 lue en source primaire. **Recadrage central : sur l'automobile, la pertinence n'est pas un problème de scoring de texte mais de reconnaissance d'entités** — dans la majorité des requêtes (« clio 3 essence », « 3008 gt line 2019 ») il ne reste aucun texte libre à scorer, tous les tokens sont des valeurs de facettes. La brique la plus rentable est donc un **normaliseur de requête** (code à nous, versionné), complété par le filtrage dynamique de la curation pour la longue traîne. Livrables : schéma de ~40 champs, poids et `text_match_type=max_weight`, réglages de tolérance aux fautes (**correction du §14.1** : les deux paramètres globaux `enable_typos_for_*_tokens=false` valent mieux que le `num_typos` par champ), `drop_tokens_threshold=0` justifié par la garantie contacts du §5.2, trois `sort_by` de référence, `group_by=vendeur_id` (Typesense n'a pas de `distinct`), dictionnaire de ~130 entrées avec **règle d'asymétrie** (`root: suv` → 4x4, jamais l'inverse), et décision `locale`/`stem` contre-intuitive (pas de `locale: fr` sur marque/modèle, sinon « citroen » ne trouve plus « Citroën » puisque `num_typos=0` y supprime le filet). **Trois découvertes structurantes hors périmètre** : (a) les 403 qui bloquent 7 actions viennent de notre propre politique réseau → action n°35 ; (b) le plafond de densité publicitaire du §5.2 est inexprimable dans le moteur (3 champs de tri maximum) → action n°37 ; (c) un import de flux pro monopolise la page 1 → action n°38
28. [ouvert] Concevoir les **alertes sur recherche sauvegardée** (« préviens-moi dès qu'un Kangoo diesel < 8 000 € apparaît dans 50 km ») : stockage des critères, évaluation en lot côté Postgres (le moteur retenu n'a pas de percolateur, §14.1), fréquence, plafonnement anti-spam, coût email (Brevo, déjà à 0,00075 €/email au §5.1) et articulation avec la notification de baisse de prix du §6. Fonction attendue sur un site d'annonces et levier de rétention — c'est ce qui fait revenir un acheteur qui n'a pas trouvé du premier coup
29. [**traité 2026-08-01**] Définir les **options de visibilité payantes** → **§5.2, Résultat n°5**, traité avec l'action n°6 comme prescrit. **Décision : aucune vente à l'unité aux pros au MVP**, quota mensuel inclus par palier (≈ 1 remontée par tranche de 6 emplacements) ; boosts à l'unité conservés côté **particuliers** (0,99-4,99 €). Deux mécaniques au MVP (remontée en tête via `_eval()` décroissant sur 48 h, vitrine mise en avant incluse aux paliers hauts) ; **épinglage sur requête écarté** malgré sa disponibilité technique. **Plafond de densité non négociable : 1 sponsorisé maximum dans les 5 premiers résultats, 20 % par page, étiquetage systématique** — à coder dans la couche d'abstraction `search` (§14). Justification mécanique plutôt que morale : **la garantie contacts rend la sur-monétisation directement coûteuse** (moins de pertinence → moins de contacts → mois offerts). DSA art. 26/27 probablement non applicables (Section 3, exclusion micro/petite entreprise) mais à respecter par défaut → à vérifier avec l'action n°21
30. [ouvert] Spécifier l'**indexeur Postgres → Typesense** : déclenchement (événement de publication, modification de prix, vente, expiration), cohérence en cas d'échec, réindexation complète scriptée, et la **couche d'abstraction interne** `search` qui conditionne la réversibilité du choix du §14.1. À croiser avec l'action n°18 (pipeline de dépôt d'annonce) — une annonce entre dans l'index au même moment où elle sort de la chaîne de modération
31. [ouvert] **Priorité haute — prérequis de toute vente pro (§5.2, Résultat n°2)** : spécifier l'**ingestion de flux de stock VO** (parseur XML/CSV multi-formats + API REST, photos par URL, réconciliation par référence véhicule, retrait à la vente, mise à jour de prix) **et engager le référencement de LBT comme destination chez Ubiflow, Kepler VO et Stockway**. Le volet partenariat est le plus long et le moins technique : il commence par un appel. Sans lui, le coût d'entrée d'un garage reste la ressaisie manuelle de son stock et le pilote plafonnera au réseau personnel de Nicolas. À croiser avec les actions n°18 (pipeline de dépôt) et n°30 (indexeur) : un flux pro entre par le même tuyau de modération qu'un dépôt particulier, mais un garage pousse 60 véhicules d'un coup à l'inscription
32. [ouvert] **Priorité haute — à faire avant la première vente** : définir et instrumenter le **« contact qualifié »** sur lequel repose la garantie contacts du §5.2 (« jamais plus de 30 € le contact, ou le mois est offert ») : définition opposable inscrite aux CGV pro, déduplication par acheteur sur 30 jours, comptage des messages et des affichages de numéro, exclusion des contacts frauduleux ou automatisés, compteur temps réel visible par le garage (§6), et procédure de crédit du mois. Sans compteur incontestable, la garantie devient une source de litige au lieu d'un argument
33. [ouvert] **La moins chère et la plus rentable de la file** — **relire la facture LBC réelle de Nicolas** et documenter : montant **HT ou TTC**, périmètre exact (nombre d'emplacements, options de visibilité incluses ou facturées à part, mono ou multi-région), durée d'engagement, date. **Toute la §5.2 repose sur ce seul repère de 1 780 €/mois pour 20 véhicules**, jamais vérifié, alors que l'écart HT/TTC seul vaut 20 %. Y joindre, si Nicolas y a accès depuis son espace pro, une capture de la grille automobile complète — inaccessible depuis l'agent quotidien (403 sur tout `leboncoin.fr`) et introuvable ailleurs de façon fiable **Correction du 2026-08-02 (§14.2, Résultat n°0) : le blocage n'est pas le fait des sites, c'est la politique réseau de notre environnement d'exécution — voir action n°35, qui rend cette action faisable en session automatisée.**
34. [ouvert] Trouver une **distribution sourcée de la taille du stock VO des professionnels français** (nombre de véhicules simultanément en vente par établissement). C'est cette répartition qui détermine le mix de CA du §5.2 — donc l'ARPA de 136 € et le seuil de 119 comptes payants, aujourd'hui posés sur une hypothèse non sourcée. Pistes : ANFA (chiffres clés de la branche), Mobilians, AAA-Data, ou un comptage direct des vitrines pro d'un portail existant sur la région pilote — **cette dernière méthode est faisable sans aucune source tierce et donnerait en prime la liste nominative des prospects de l'action n°9**
35. [ouvert] **Priorité maximale — la plus rentable de toute la file, et elle coûte un réglage** : **élargir la politique réseau de l'environnement d'exécution des sessions automatisées**. Le diagnostic du 2026-08-02 (§14.2, Résultat n°0) établit que les « 403 » invoqués depuis le 2026-07-28 sont émis par **la passerelle réseau de notre propre environnement** (`connect_rejected` / « gateway answered 403 to CONNECT (policy denial) »), pas par les sites : seuls GitHub, GitLab et PyPI sont dans la liste blanche. Élargir la liste — ou passer en accès sortant non restreint, paramétrable par Nicolas, cf. `code.claude.com/docs/en/claude-code-on-the-web` — débloque en session automatisée les actions **n°8, 13, 15, 21, 25, 33 et 34**. Réserve : certains sites (`leboncoin.fr`) opposeront peut-être ensuite un vrai blocage anti-bot, ce qui n'a jamais été testé
36. [ouvert] **Priorité haute — spécifier le normaliseur de requête auto** (§14.2, Résultat n°1) : chiffres romains → arabes, repli des accents, reconnaissance marque/modèle/génération sur référentiel, reconnaissance des codes commerciaux (HDi, dCi, TCe, EDC…), extraction des seuils numériques (« moins de 100 000 km », « - de 10 000 € »), reconnaissance des communes et départements, et ce qui part en `filter_by` vs ce qui reste en `q`. Prérequis : constituer le **référentiel marque/modèle/version** — piste gratuite identifiée, la base **ADEME Car Labelling** (données UTAC d'homologation : marque, modèle, dénomination commerciale, CNIT, énergie ; trimestrielle ; sur `data.gouv.fr` et `data.ademe.fr`), **non téléchargée** faute d'accès réseau (action n°35), et dont la couverture du parc VO ancien reste à vérifier
37. [ouvert] **Priorité haute — coder la couche d'entrelacement des annonces sponsorisées** (§14.2, Résultat n°5) : le plafond de densité décidé au §5.2 (1 sponsorisé maximum dans les 5 premiers, 20 % par page, étiquetage) **ne peut pas s'exprimer en `sort_by`** — `_eval` place *tous* les boostés devant, et le moteur n'accepte que 3 champs de tri. Il faut deux requêtes (organique / sponsorisé) et un entrelacement à positions fixes qui soit une **fonction pure de (page, rang)**, sinon la pagination fait réapparaître ou disparaître des annonces d'une page à l'autre. Y joindre la journalisation du taux réel de sponsorisés servis, seule preuve que le plafond est respecté. `per_page` est plafonné à 250 par le moteur
38. [ouvert] **À traiter avec l'action n°31 — un import de flux pro monopolise la page 1** (§14.2, Résultat n°6) : un garage qui s'inscrit pousse 40 à 60 véhicules dans la même minute, donc avec la même date, et sature une liste triée par fraîcheur (au pilote, 500 annonces actives : un seul import suffit). Correctifs : `group_by=vendeur_id` + `group_limit=2` sur les listes triées par fraîcheur (désactivé sur les recherches filtrées explicites), **étalement de `date_mise_en_avant` à l'import en masse**, et séparation des trois dates (`date_mise_en_ligne` immuable / `date_maj` technique / `date_mise_en_avant` de tri) qui sert aussi de garde-fou anti-rafraîchissement — grief exact reproché à LBC au §5.2
39. [ouvert] **Test de 30 minutes, à faire avant d'écrire le schéma définitif** (§14.2, Résultat n°4) : démarrer un nœud Typesense local et mesurer le comportement du tokenizer par défaut sur `1.5 dCi`, `e-208`, `ë-C4`, `GT Line+`, `C4 Picasso`, `Clio III` — l'effet du point décimal et du tiret **n'est pas déductible de la documentation**, et il détermine les réglages `symbols_to_index` et `token_separators`. Ne pas deviner
40. [ouvert] **Constituer le jeu de 50 requêtes annotées — Nicolas peut le faire seul, dès maintenant, sans code** (§14.2, Résultat n°11) : composition fixée (15 marque+modèle, 8 avec génération, 7 avec finition, 5 références chiffrées proches, 5 fautes de frappe, 5 langage naturel, 5 géolocalisées), à écrire depuis les demandes téléphoniques réelles de son garage. Indicateurs par ordre de priorité : taux de zéro-résultat, précision@5, clic sur les 3 premiers, **contacts par vue de fiche** (seule métrique qui relie la pertinence à la garantie du §5.2). Règle de gouvernance associée : aucun changement de schéma, de poids ou de synonymes en production sans repasser les 50 requêtes

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

## Annexe — Sources de la modération automatique §7.1 (recherche web du 2026-07-29)

| Donnée retenue | Valeur | Source | Fiabilité |
|---|---|---|---|
| Google Cloud Vision — SafeSearch et Text Detection (OCR) | 1 000 unités/mois gratuites, puis **1,50 $/1 000** (1 001 – 5 M), 0,60 $/1 000 au-delà de 5 M — **par feature** | [cloud.google.com/vision/pricing](https://cloud.google.com/vision/pricing) | **Page officielle** |
| Sightengine | Starter 29 $/mois (10 k opérations) ; Growth 99 $/mois (40 k) + 0,002 $/op ; Pro 399 $/mois (200 k) + 0,0015 $/op. **1 modèle sur 1 image = 1 opération** ; détection IA/deepfake = 5 op, liveness = 10 op | [checkthat.ai — Sightengine Pricing 2026](https://checkthat.ai/brands/sightengine/pricing), [saasworthy](https://www.saasworthy.com/product/sightengine/pricing), [sightengine.com/pricing](https://sightengine.com/pricing) (403 depuis l'environnement d'exécution) | Agrégateurs tiers |
| AWS Rekognition — Content Moderation (Image APIs) | **0,001 $/image** (1er million/mois), 0,0008 $ au-delà. **Streaming Video Analysis et Batch Image Content Moderation arrêtés pour les nouveaux clients au 30/04/2026** | [aws.amazon.com/rekognition/pricing](https://aws.amazon.com/rekognition/pricing/) (403), [checkthat.ai](https://checkthat.ai/brands/amazon-rekognition/pricing), [astuto.ai](https://www.astuto.ai/blogs/amazon-rekognition-pricing-and-optimization) | Agrégateurs tiers |
| Azure AI Content Safety — Image | **0,75 $/1 000 images** (standard pay-as-you-go) ; prix réel dépendant de la région/devise via le calculateur Azure | [azure.microsoft.com — Content Safety pricing](https://azure.microsoft.com/en-us/pricing/details/content-safety/) (403), [oreateai](https://www.oreateai.com/blog/demystifying-azure-ai-content-safety-pricing-keeping-your-digital-spaces-clean/84e401553234165a4b26dca410a2e1cd) | Agrégateur tiers |
| Hive — Visual Moderation | **3,00 $/1 000 images** (0,006 $/scan). Pas de liste de prix publique ni d'offre gratuite : devis commercial | [thehive.ai/models/hive/visual-moderation](https://thehive.ai/models/hive/visual-moderation), [thehive.ai/pricing](https://thehive.ai/pricing) | Agrégateur tiers |
| Cloudflare Workers AI | 0,011 $/1 000 neurones ; 10 000 neurones/jour offerts. **Nombre de neurones par classification d'image non confirmé** (sources contradictoires : 500 à 8 300 classifications pour 10 k neurones) | [developers.cloudflare.com/workers-ai/platform/pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/) (403), [mecanik.dev](https://mecanik.dev/en/posts/cloudflare-workers-ai-run-ai-models-at-the-edge-in-2026/), [costbench](https://costbench.com/software/llm-api-providers/cloudflare-workers-ai/) | **Non tranché** |
| Claude Haiku 4.5 — modèle vision-langage | **1,00 $/M tokens en entrée, 5,00 $/M en sortie**. Tokens image ≈ (largeur × hauteur)/750. API Batch : −50 %, lots généralement < 1 h, maximum 24 h. Préfixe minimum cacheable : 4 096 tokens | Documentation Claude API (skill `claude-api`, catalogue de modèles au 2026-06-24) | **Source de référence** |
| Modèle NSFW auto-hébergé | `Falconsai/nsfw_image_detection` — ViT-base-patch16-224 fine-tuné, 80 000 images d'entraînement, 98,04 % de justesse sur son jeu d'évaluation, 224×224, Apache-2.0 | [huggingface.co/Falconsai/nsfw_image_detection](https://huggingface.co/Falconsai/nsfw_image_detection), [github.com/steelcityamir/safe-content-ai](https://github.com/steelcityamir/safe-content-ai) | Fiche de modèle officielle |
| Débit CPU d'un transformeur vision quantifié | **6,1 ms/image (p50) en ONNX Runtime INT8** contre 24,8 ms en FP32, AMD Ryzen 7 5800H, batch 1 | [philschmid.de — Accelerate ViT with Quantization using Optimum](https://www.philschmid.de/optimizing-vision-transformer) (403), snippet de recherche | **Ordre de grandeur — à remesurer** |
| Détection de plaques (open source) | YOLOv11 fine-tuné sur 10 125 images Roboflow ; alternatives YOLOv8 (dashcam_anonymizer, video-privacy-blur) avec floutage OpenCV | [morsetechlab/yolov11-license-plate-detection](https://huggingface.co/morsetechlab/yolov11-license-plate-detection), [varungupta31/dashcam_anonymizer](https://github.com/varungupta31/dashcam_anonymizer), [MengWoods/video-privacy-blur](https://github.com/MengWoods/video-privacy-blur) | Dépôts publics |
| Hachage perceptuel | `pHash` (GPLv3, DCT sur image 32×32 → empreinte 64 bits, robuste à la recompression JPEG, au redimensionnement et aux petits filigranes ; sensible aux miroirs, recadrages et décalages de couleur) ; `imagehash` (Python, aHash/dHash/wavelet) ; **PDQ** (Meta, open-sourcé en 2019, 256 bits) | [phash.org](http://phash.org/), [Grokipedia — Perceptual hashing](https://grokipedia.com/page/Perceptual_hashing), [PHASER (ScienceDirect)](https://www.sciencedirect.com/science/article/pii/S2666281723001993) | Sources techniques |
| GPU (au cas où) | Scaleway L4 à partir de **0,79 €/GPU/heure** (~577 €/mois en continu) ; Hetzner GEX131 (RTX PRO 6000 Blackwell Max-Q) **889 €/mois** ; GEX44 (RTX 4000 SFF Ada, 184 €/mois) indisponible en juillet 2026 | [scaleway.com/en/pricing/gpu](https://www.scaleway.com/en/pricing/gpu/), [hetzner.com — serveurs GPU](https://www.hetzner.com/dedicated-rootserver/matrix-gpu/), [gpuhosted — Hetzner GPU Review 2026](https://gpuhosted.com/en/hetzner-gpu-review/) | Pages officielles + agrégateur |
| Plaque d'immatriculation = donnée personnelle | « En principe, un particulier ne peut pas publier sur internet la photographie d'un véhicule sans flouter sa plaque d'immatriculation » — identification indirecte du propriétaire, art. 4-2 RGPD ; exception pour mission d'intérêt public | [CNIL — CNIL Direct, question 1816](https://www.cnil.fr/fr/cnil-direct/question/1816), [CNIL — Immatriculation et infractions](https://www.cnil.fr/fr/immatriculation-et-infractions), [Le Dall Avocat](https://www.ledall-avocat.fr/droit-prendre-photo-voiture-flouter-plaque/) | **Source officielle CNIL** |
| LBC ne floute pas les plaques nativement | Les vendeurs recourent à des applications tierces (Plakach — détection et masquage automatiques en ~1 s hors ligne, Redacted, ImageBlur, FacePixelizer) ou floutent à la main. Risque cité : la « doublette » (usurpation de plaque) permettant de fabriquer une annonce clone | [mesplaques.fr](https://www.mesplaques.fr/blog/pourquoi-flouter-plaque-immatriculation/), [keplervo.com](https://www.keplervo.com/fr/blog/pourquoi-masquer-sa-plaque-d-immatriculation-sur-une-annonce), [cartaplac.com](https://www.cartaplac.com/article/plaques-d-immatriculation-pourquoi-les-cacher-sur-les-photos-/741) | Sources secondaires convergentes |
| DSA — obligations de modération | Pleinement applicable depuis le **17/02/2024** à toutes les plateformes en ligne. Mécanisme de notification et action ; motivation des décisions de modération ; rapport de transparence annuel ; enregistrement à la base de données de transparence de la Commission (art. 24.5). Sanctions jusqu'à **6 % du CA mondial**, ARCOM autorité compétente en France | [ARCOM — DSA : obligations et services concernés](https://www.arcom.fr/espace-professionnel/reglement-sur-les-services-numeriques-ou-dsa-obligations-et-services-concernes), [ARCOM — enregistrement art. 24.5](https://www.arcom.fr/espace-professionnel/reglement-sur-les-services-numeriques-ou-dsa-enregistrement-dune-plateforme-en-ligne-sur-la-base-de-donnees-de-transparence-art-245), [Haas Avocats](https://www.haas-avocats.com/e-commerce-plateformes-les-obligations-juridiques-en-2026/) | **Source officielle (ARCOM)** |
| DSA — exclusion des micro et petites entreprises | **Art. 19** : la Section 3 (dont art. 24, rapports de transparence) ne s'applique pas aux micro et petites entreprises au sens de la recommandation 2003/361/CE, à l'exception de l'art. 24(3) ; l'exclusion se prolonge **12 mois après la perte du statut**, sauf désignation comme très grande plateforme (art. 33). **Art. 29** : exclusion équivalente pour la Section 4 (places de marché) | [eu-digital-services-act.com — Article 19](https://www.eu-digital-services-act.com/Digital_Services_Act_Article_19.html), [CMS DigitalLaws — Article 19](https://www.cms-digitallaws.com/en/dsa/article-19/), [dsa-library.com — Article 29](https://dsa-library.com/article/29/) | Texte du règlement |
| Modération LBC (contexte concurrentiel) — *source du 2026-07-29* | Système hybride : algorithmes en analyse instantanée (texte, images, géolocalisation, métadonnées des fichiers) + modérateurs humains sur les publications suspectes. ~600 collaborateurs techniques (data, IA, ingénierie logicielle). Pas de chiffre public sur le nombre de modérateurs ni sur le taux d'automatisation | [Boursorama — comment l'IA révolutionne Leboncoin](https://www.boursorama.com/budget/conso/actualites/comment-l-ia-revolutionne-leboncoin-les-astuces-pour-acheter-plus-vite-et-mieux-0dd2b58cefb0c3aa72c4898622a6c853), [reservoir.live — quand la modération automatique déraille](https://www.reservoir.live/leboncoin-et-lia-quand-la-moderation-automatique-deraille/) | Sources secondaires |

## Annexe — Sources de la politique de modération §7.2 (recherche web du 2026-07-30)

*Avertissement de méthode : la politique réseau de l'environnement d'exécution a renvoyé un **403 sur toutes les sources officielles utiles** ce jour (`eur-lex.europa.eu`, `www.legifrance.gouv.fr`, `www.cnil.fr`, `img.leboncoin.fr`, `static.ebayinc.com`, `huggingface.co`). Le texte du DSA a donc été travaillé via des sites miroirs du règlement et des analyses de cabinets d'avocats français, ce qui est suffisant pour concevoir la politique mais **pas pour rédiger des CGU** → action §17 n°21.*

| Donnée retenue | Valeur | Source | Fiabilité |
|---|---|---|---|
| DSA art. 14 — conditions générales | Obligation de décrire dans les CGU « les politiques, procédures, mesures et outils utilisés aux fins de la modération des contenus, **y compris la prise de décision fondée sur des algorithmes et le réexamen par un être humain** » et les règles de procédure du système interne de traitement des réclamations ; langage clair, **format accessible et lisible par machine** ; s'applique à **tous** les fournisseurs de services intermédiaires | [dsa-library.com — Article 14](https://dsa-library.com/article/14/), [eu-digital-services-act.com — Article 14](https://www.eu-digital-services-act.com/Digital_Services_Act_Article_14.html), [Gouache Avocats — ce que le DSA change pour les CG](https://www.gouache.fr/ressources/que-change-le-dsa-pour-la-redaction-de-conditions-generales/) | Sites miroirs du règlement + analyse d'avocats |
| DSA art. 16 — notification et action | Mécanisme accessible, utilisable, **électronique** ; contenu exigé de la notification (motivation suffisante, URL, nom et e-mail du notifiant, déclaration de bonne foi) ; **accusé de réception sans retard indu** ; notification de la décision avec information sur les voies de recours ; traitement « en temps opportun, de manière diligente, non arbitraire et objective » | [doctrine.fr — Article 16](https://www.doctrine.fr/l/texts/eu/reglements/EULEGEDCB6D9A557DFE2ACD6E/articles/EULEGARTI398DDFF10A57A75813E1), [eu-digital-services-act.com — Article 16](https://www.eu-digital-services-act.com/Digital_Services_Act_Article_16.html), [SHIFT Avocats — les obligations spécifiques des hébergeurs](https://shift-avocats.com/dsa-obligations-hebergeurs/) | Sites miroirs du règlement |
| DSA art. 17 — exposé des motifs | Contenu obligatoire de la décision notifiée : faits et circonstances ; **si la décision découle d'un signalement art. 16 ou d'une investigation d'initiative** ; **si des moyens automatisés ont été utilisés** ; base légale ou clause contractuelle invoquée et explication ; voies de recours | [dsa-act.eu — Article 17 (FR)](https://dsa-act.eu/fr/article-17-expose-des-motifs/), [dsa-library.com — Article 17](https://dsa-library.com/article/17/), [eu-digital-services-act.com — Article 17](https://www.eu-digital-services-act.com/Digital_Services_Act_Article_17.html) | Sites miroirs du règlement |
| DSA art. 20 — réclamations internes | Système gratuit, électronique, ouvert **6 mois** après la décision ; traitement diligent, non discriminatoire et non arbitraire ; décisions prises **sous la supervision de personnel qualifié, pas uniquement par des moyens automatisés** | [dsa-act.eu — Article 20 (FR)](https://dsa-act.eu/fr/article-20-systeme-interne-de-traitement-des-reclamations/), [dsa-library.com — Article 20](https://dsa-library.com/article/20/) | Sites miroirs du règlement |
| DSA art. 23 — utilisations abusives | Suspension **après avertissement préalable** des utilisateurs fournissant fréquemment du contenu manifestement illicite ; **symétriquement** suspension du traitement des signalements/réclamations manifestement infondés répétés | [eu-digital-services-act.com — Article 23](https://www.eu-digital-services-act.com/Digital_Services_Act_Article_23.html) | Site miroir du règlement |
| **Abrogation des dispositions de l'art. 6 LCEN par la loi SREN** | La **loi n° 2024-449 du 21 mai 2024** (SREN) a abrogé les dispositions générales de l'art. 6 LCEN relatives à la notification des contenus manifestement illicites (connaissance présumée des faits, interdiction d'une obligation générale de surveillance, obligations de transparence et dispositif de signalement) ; l'ancien art. 6.I.8 est devenu l'**art. 6-3**. Ce sont désormais les **art. 6 et 16 et s. du DSA** qui s'appliquent | [Pascal Reynaud, avocat IP/IT — où sont passées les dispositions de l'art. 6 LCEN ?](https://www.reynaud-avocat.com/2024/07/25/o%C3%B9-sont-pass%C3%A9es-les-dispositions-de-l-article-6-de-la-lcen-relatif-%C3%A0-la-responsabilit%C3%A9-des-h%C3%A9bergeurs-sur-internet/), [Village de la Justice — le nouvel art. 6.I.8 (désormais 6-3) de la LCEN](https://www.village-justice.com/articles/nouvel-article-lcen-pour-retrait-plus-dynamique-des-contenus-ligne,40611.html), [DLA Piper — l'impact du DSA sur la directive e-commerce et la LCEN](https://www.dlapiper.com/fr-fr/insights/publications/le-digital-services-act-en-plusieurs-episodes/limpact-du-digital-services-act-sur-la-directive-e-commerce-et-la-lcen), [Pechenard & Associés — comparaison art. 6-I-2 LCEN / art. 6 DSA](https://www.pechenard.com/rappel-succinct-des-obligations-et-responsabilites-des-plateformes-internet/) | Analyses convergentes de cabinets d'avocats — **à confirmer sur Légifrance** |
| **Taux d'infirmation des décisions de modération** | Appeals Centre Europe (organe art. 21), 2ᵉ rapport de transparence (avr. 2025 – mars 2026) : sur ~3 000 décisions examinées, désaccord avec la plateforme dans **59 %** des cas — **52 % sur les décisions de retrait**, 63 % sur les décisions de laisser en ligne. 1ᵉʳ rapport (nov. 2024 – août 2025) : ~10 000 plaintes reçues, 3 300 dans le champ, 1 500 décisions rendues, utilisateur suivi dans **plus de 3 cas sur 4** | [appealscentre.eu — premier rapport de transparence](https://www.appealscentre.eu/impact/), [Courthouse News — EU watchdog overturns social media giants in most user appeals](https://www.courthousenews.com/eu-watchdog-overturns-social-media-giants-in-most-user-appeals/), [Irish Legal News](https://www.irishlegal.com/articles/over-150-decisions-issued-by-appeals-centre-europe) | Rapport d'un organe DSA — **périmètre réseaux sociaux, pas places de marché** |
| Coût de la revue humaine externalisée | **0,05-0,15 $ par élément** en revue humaine contre 0,0001-0,001 $ en modération automatique ; prestataires facturant 50-99 $/h côté conseil ; > 500 000 modérateurs employés par les grands BPO (Teleperformance, Concentrix, TaskUs, Accenture…) | [Superpower — Content Moderation Services 2026](https://superpower.social/blogs/content-moderation-services-complete-guide), [1840 & Co — Guide to Content Moderation Outsourcing](https://www.1840andco.com/blog/guide-to-content-moderation-outsourcing), [Clutch — Content Moderation Pricing](https://clutch.co/content-moderation/pricing) | Agrégateurs — ordre de grandeur, pas de devis |
| Indicateurs de modération (définitions) | Average Handling Time / Average Reviewing Time, profondeur et délai d'attente de file, SLA de revue, mesure sur sous-ensembles homogènes plutôt qu'en moyenne globale | [TSPA — Metrics for Content Moderation](https://www.tspa.org/curriculum/ts-fundamentals/content-moderation-and-operations/metrics-for-content-moderation/), [GetStream — Moderation Metrics & KPIs](https://getstream.io/blog/moderation-performance-metrics/) | Référentiel professionnel — **aucun benchmark numérique universel** |
| Délais de publication LBC (repère concurrent) | « La plupart du temps quelques minutes à quelques heures, jusqu'à 24 h » ; **92 % des annonces validées automatiquement en < 15 min, 6 % en validation manuelle de 2 à 24 h, 2 % > 24 h** ; après 3 refus consécutifs, passage automatique en validation manuelle | [technolafargue.fr — annonce LeBonCoin en vérification, combien de temps ?](https://technolafargue.fr/annonce-leboncoin-en-cours-de-verification-combien-de-temps-attendre-et-que-faire-si-ca-bloque/) | **Faible** — blog secondaire attribuant ces chiffres à des « statistiques internes » de LBC, non vérifiables. À traiter comme un ordre de grandeur, jamais comme une donnée |
| Fraude au compteur sur le marché français de l'occasion | FIA : **1 véhicule d'occasion sur 10** vendu en France a un compteur trafiqué ; carVertical : **10,6 %** du parc français présente un kilométrage altéré, jusqu'à 17 % sur les millésimes 1998-2005 ; un véhicule au compteur trafiqué se vend en moyenne **+39,2 %** au-dessus de sa valeur réelle | [Caradisiac — plus d'une voiture sur dix aurait un compteur trafiqué](https://www.caradisiac.com/plus-d-une-voiture-sur-dix-aurait-un-compteur-trafique-204520.htm), [Auto Infos — étude carVertical sur les manipulations de compteurs](https://www.auto-infos.fr/article/vo-carvertical-revele-une-etude-sur-les-manipulations-de-compteurs.170174), [AM Today](https://www.am-today.com/article/fraude-au-compteur-les-francais-paient-en-moyenne-40-trop-cher-leur-voiture-doccasion) | Presse professionnelle citant une étude d'éditeur (carVertical est vendeur de rapports d'historique — **conflit d'intérêt à garder en tête**) |
| Rapport de transparence DSA de LBC France | Existe et couvre l'année 2024 (activités de modération d'initiative propre + signalements utilisateurs + injonctions d'autorités), publié en PDF sur `img.leboncoin.fr` | [leboncoin — Confiance et Sécurité](https://www.leboncoin.fr/dc/charte_de_bonne_conduite) | **Non consulté — hôte bloqué (403) par la politique réseau de l'environnement** → action §17 n°25 |
| Rapports de transparence DSA d'eBay (repère marketplace) | Période 17/02/2024 – 31/12/2024 : **6 105 injonctions d'agir** contre des contenus illicites (dont 5 914 émises par l'Allemagne), **délai médian d'accusé de réception 0 h**, **délai médian de résolution 2 h**, 7 005 demandes d'information | [eBay Inc. — Digital Services Act](https://www.ebayinc.com/company/digital-services-act/) (rapports quantitatif et qualitatif sur `static.ebayinc.com`, **403 depuis l'environnement**) | Chiffres issus d'extraits de recherche, **rapport non consulté directement** |

## Annexe — Sources du comparatif des moteurs de recherche §14.1 (recherche web du 2026-07-31)

*Avertissement de méthode n°1 — **biais éditeur** : la quasi-totalité de la littérature « X vs Y » indexée sur ces moteurs est publiée par les éditeurs eux-mêmes. Les pages « Typesense pricing » et « Typesense review » les mieux classées sont hébergées sur `meilisearch.com` ; la page de comparaison de `typesense.org` affirme encore que Meilisearch « n'est pas production-ready » et n'a pas de réplication, ce qui est faux en 2026. Les conclusions du §14.1 s'appuient donc en priorité sur la documentation technique et sur les fichiers de licence.*

*Avertissement de méthode n°2 — **environnement** : `typesense.org`, `cloud.typesense.org` et `www.meilisearch.com/docs` renvoient un **403** depuis l'environnement d'exécution des sessions automatisées (même limite que les 28, 29 et 30/07). Leur contenu a été lu via extraits de recherche. Seul `raw.githubusercontent.com` était accessible — le fichier `LICENSE-EE` a donc pu être vérifié directement.*

| Donnée retenue | Valeur | Source | Fiabilité |
|---|---|---|---|
| **Meilisearch Enterprise Edition — BSL 1.1** | *Licensor* : Meili SAS. *Licensed Work* : « Any file explicitly marked as "Enterprise Edition (EE)" or "governed by the Business Source License" residing in `enterprise_editions` modules/folders ». *Additional Use Grant* : « You may use, modify, and distribute the Licensed Work for **non-production purposes only**, such as testing, development, or evaluation ». *Change Date* : 4 ans après publication. *Change License* : MIT | [github.com/meilisearch/meilisearch — LICENSE-EE](https://raw.githubusercontent.com/meilisearch/meilisearch/main/LICENSE-EE) | **Fichier de licence lu directement — source de référence** |
| Périmètre de l'Enterprise Edition Meilisearch | Sharding et réplication requièrent l'Enterprise Edition (v1.37+) ; le cœur reste MIT ; licences EE gratuites annoncées sur demande pour les projets indépendants et les associations | [meilisearch.com — Introducing the Meilisearch Enterprise Edition license](https://www.meilisearch.com/blog/enterprise-license), [meilisearch.com/docs — Replication and sharding](https://www.meilisearch.com/docs/resources/self_hosting/sharding/overview) (403), [meilisearch.com — Scale without limits](https://www.meilisearch.com/blog/sharding-replication) | Annonce de l'éditeur — cohérente avec le fichier de licence |
| Typesense — licence et clustering | GPL-3.0. Clustering **Raft dans la version open source** ; minimum **3 nœuds** pour tolérer la panne d'un nœud, 5 pour en tolérer deux (latences d'écriture plus élevées) | [typesense.org — High Availability](https://typesense.org/docs/guide/high-availability.html) (403), [github.com/typesense/typesense — issue #116 « Why the license GPL-3.0 ? »](https://github.com/typesense/typesense/issues/116) | Documentation + dépôt |
| Typesense — dimensionnement mémoire | Index **entièrement en RAM** : « if your dataset size is X MB, you'd typically need **2X-3X MB RAM** ». Exemple communautaire : 2,5 M d'enregistrements ≈ 1,8 Go | [typesense.org — System Requirements](https://typesense.org/docs/guide/system-requirements.html) (403), [Typesense Cloud Help Center — Choosing how much memory you need](https://cloud-help-center.typesense.org/article/22-choosing-how-much-memory-you-need), [github.com/typesense/typesense — issue #162](https://github.com/typesense/typesense/issues/162) | Documentation éditeur |
| Meilisearch — dimensionnement mémoire | LMDB **mappé en mémoire** : le système d'exploitation gère la RAM réellement allouée ; l'éditeur observe qu'un ratio **RAM/disque de ~1/3 n'affecte pas les performances, et que ~1/10 convient à de nombreuses charges** ; le moteur ne plante pas si l'index dépasse la RAM | [meilisearch.com/docs — Storage](https://www.meilisearch.com/docs/learn/engine/storage) (403), [meilisearch.com — Squeezing millions of documents in 128 TB of virtual memory](https://www.meilisearch.com/blog/dynamic-virtual-address-management) | Documentation éditeur |
| Typesense — boost conditionnel `_eval()` | « You can sort documents based on any expressions that evaluate to either true or false, using the special `_eval(<expression>)` operation as a `sort_by` parameter » ; syntaxe identique à `filter_by`, combinable (« optional filtering »). Curation : `pinned_hits`, `hidden_hits`, règles d'override déclenchées par requête ou par filtre | [typesense.org — Ranking and Relevance](https://typesense.org/docs/guide/ranking-and-relevance.html) (403), [typesense.org — Curation](https://typesense.org/docs/30.2/api/curation.html) (403) | Documentation éditeur, via extraits |
| Meilisearch — absence d'épinglage natif | « Meilisearch does not offer native support for promoting, pinning, and boosting specific documents » ; contournement par une règle de ranking personnalisée (`attribut:desc`) placée en tête des ranking rules, donc définie **au niveau de l'index** | [meilisearch.com/docs — Custom ranking rules](https://www.meilisearch.com/docs/capabilities/full_text_search/relevancy/custom_ranking_rules) (403), [github.com/meilisearch/documentation — issue #922](https://github.com/meilisearch/documentation/issues/922) | Documentation éditeur + suivi de la demande |
| Typesense — tolérance aux fautes par champ | `num_typos` acceptant des valeurs séparées par des virgules, une par champ de `query_by` (ex. `num_typos=2,0,0`) ; `min_len_1typo` / `min_len_2typo` ; `typo_tokens_threshold`. Cas d'usage documenté : références produit, numéros de téléphone | [typesense.org — Ranking and Relevance](https://typesense.org/docs/guide/ranking-and-relevance.html) (403), [github.com/typesense/typesense — issue #262](https://github.com/typesense/typesense/issues/262) | Documentation éditeur |
| Meilisearch — `typoTolerance.disableOnNumbers` | Introduit en **v1.15.0** ; réglage **global par index** ; faux positif documenté par l'éditeur : « a search for 2024 matching documents containing 2025 or 2004 » | [meilisearch.com/docs — Typo tolerance](https://www.meilisearch.com/docs/capabilities/full_text_search/relevancy/typo_tolerance_settings) (403), [Release v1.15.0](https://github.com/meilisearch/meilisearch/releases/tag/v1.15.0) | Notes de version |
| Typesense — géo | `filter_by: location:(lat, lng, N km)`, polygones et boîtes englobantes, tri par distance ; **`exclude_radius`** (tous les documents d'un rayon donné à égalité, départagés par un autre champ) et **`precision`** (regroupement en paquets). Ordre imposé : [latitude, longitude] | [typesense.org — GeoSearch](https://typesense.org/docs/30.2/api/geosearch.html) (403) | Documentation éditeur |
| Meilisearch — géo | `_geoRadius` (avec paramètre `resolution`), `_geoBoundingBox` (stable depuis le 03/04/2023), **`_geoPolygon`** (zone quelconque, ≥ 3 points, documents GeoJSON), tri `_geoPoint` | [meilisearch.com/docs — Geosearch](https://www.meilisearch.com/docs/learn/filtering_and_sorting/geosearch) (403), [meilisearch.com/docs — Geo search overview](https://www.meilisearch.com/docs/capabilities/geo_search/overview) (403) | Documentation éditeur |
| Meilisearch — exhaustivité des résultats | `estimatedTotalHits` par défaut ; `totalHits` exact seulement si `page`/`hitsPerPage` sont fournis ; **`maxTotalHits` = 1 000 par défaut**, borne l'exhaustivité elle-même ; l'éditeur avertit qu'au-delà de **20 000** les requêtes peuvent prendre des secondes | [meilisearch.com/docs — Search API](https://meilisearch.com/docs/reference/api/search) (403), [meilisearch.com/docs — Pagination](https://meilisearch.com/docs/guides/front_end/pagination) (403), [github.com/meilisearch/documentation — issue #1784](https://github.com/meilisearch/documentation/issues/1784) | Documentation éditeur |
| Typesense — exhaustivité des facettes | Comptages de facettes **estimés par échantillonnage** au-delà d'un seuil, pour tenir la latence sur de grands ensembles ; `max_facet_values` limite les valeurs renvoyées sans indiquer le total | [typesense.org — Search API](https://typesense.org/docs/30.2/api/search.html) (403), [github.com/typesense/typesense — issue #1698](https://github.com/typesense/typesense/issues/1698), [issue #290](https://github.com/typesense/typesense/issues/290) | Documentation + dépôt |
| Elasticsearch — percolateur | Recherche inversée : on indexe des requêtes et on leur soumet un document. Usage canonique : alertes sur recherche sauvegardée dans une place de marché (exemple ACV : notification des acheteurs dont la recherche correspond à une nouvelle enchère automobile) | [Opster — Elasticsearch Percolate Query](https://opster.com/guides/elasticsearch/search-apis/elasticsearch-percolate-query/), [ACV Tech Blog — Using Elasticsearch Percolate for User Notifications](https://acv.engineering/posts/elasticsearch-percolate/), [Medium — Building Smart Marketplace Alerts with ElasticSearch Percolate Queries](https://medium.com/@abdel.elamel/building-smart-marketplace-alerts-with-elasticsearch-percolate-queries-fc4770c7f6c2) | Retours d'expérience techniques |
| Elasticsearch / OpenSearch — licences | Elasticsearch en **triple licence AGPLv3 / ELv2 / SSPL depuis août 2024** (AGPLv3 approuvée OSI), fonctions avancées liées aux abonnements payants. OpenSearch reste **Apache-2.0**, sous la **OpenSearch Software Foundation** (Linux Foundation, septembre 2024) | [pulse.support — OpenSearch vs Elasticsearch 2026](https://pulse.support/kb/opensearch-vs-elasticsearch), [BigData Boutique — OpenSearch vs Elasticsearch Compared (2026)](https://bigdataboutique.com/blog/opensearch-vs-elasticsearch-compared), [SigNoz — Elasticsearch vs OpenSearch 2026](https://signoz.io/comparisons/elasticsearch-vs-opensearch/) | Analyses tierces convergentes |
| Postgres seul — limites en recherche | Pas de vraie tolérance aux fautes avec conscience de la proximité des mots (`pg_trgm` n'y suffit pas) ; pas optimisé pour la recherche instantanée sous 50 ms ; facettes multiples complexes et coûteuses ; **la charge de recherche concurrence la charge transactionnelle sur la même instance** | [meilisearch.com — When does Postgres stop being good enough for full text search?](https://www.meilisearch.com/blog/postgres-full-text-search-limitations), [Supabase — Postgres Full Text Search vs the rest](https://supabase.com/blog/postgres-full-text-search-vs-the-rest), [Nomadz — PostgreSQL FTS vs dedicated search engines](https://nomadz.pl/en/blog/postgres-full-text-search-or-meilisearch-vs-typesense) | Une source éditeur (biais assumé) + deux tiers |
| Pile Cloudflare | Aucun produit de recherche dédié ; l'assemblage courant est **D1 (SQLite FTS5, classement BM25) + Vectorize** pour l'hybride lexical/sémantique. Ni facettes, ni tolérance aux fautes, ni géo | [Boris Tane — Contextual RAG on Cloudflare Workers](https://boristane.com/blog/cloudflare-contextual-rag/), [Kent C. Dodds — Implementing Hybrid Semantic + Lexical Search](https://kentcdodds.com/blog/implementing-hybrid-semantic-lexical-search), [developers.cloudflare.com/vectorize](https://developers.cloudflare.com/vectorize/) (403) | Retours d'expérience techniques |
| Tarifs Typesense Cloud | Facturation **horaire** selon la configuration RAM/CPU, plus la bande passante. ~21,6 $/mois (Small), ~50 $/mois (Medium : 4 Go de RAM, vCPU dédiés) | [aiproductivity — Typesense Pricing 2026](https://aiproductivity.ai/pricing/typesense/), [cloud-help-center.typesense.org — Billing Process](https://cloud-help-center.typesense.org/article/25-billing-process), [cloud.typesense.org/pricing](https://cloud.typesense.org/pricing) (403) | Agrégateurs — **à revérifier**, action §17 n°15 |
| Tarifs Meilisearch Cloud | Quatre niveaux : open source auto-hébergé (gratuit), Cloud à l'usage à partir de ~30 $/mois, Cloud à la ressource à partir de ~23 $/mois, Enterprise sur devis. Pro : 1 M de documents, 10 M de requêtes/mois | [aiproductivity — Meilisearch Pricing 2026](https://aiproductivity.ai/pricing/meilisearch/), [G2 — Meilisearch pricing](https://www.g2.com/products/meilisearch/pricing) | Agrégateurs — **à revérifier** |
| Tarifs VPS (auto-hébergement) | Hetzner Cloud, après la hausse du **1ᵉʳ avril 2026** : **CX33** (4 vCPU partagés, 8 Go, 80 Go) ≈ **6,49 €/mois** ; **CPX31** (4 vCPU, 8 Go, 160 Go) ≈ **16,49 €/mois** | [Northflank — Hetzner cloud server price increases in 2026](https://northflank.com/blog/hetzner-cloud-server-price-increases), [bitdoze — Hetzner Cloud Pricing After the April 2026 Increase](https://www.bitdoze.com/hetzner-cloud-cost-optimized-plans/), [costgoat — calculateur Hetzner (juil. 2026)](https://costgoat.com/pricing/hetzner) | Agrégateurs — **à revérifier**, action §17 n°15 |

## Annexe — Sources de la grille tarifaire pro §5.2 (recherche web du 2026-08-01)

*Avertissement de méthode : **c'est la section la plus mal sourcée du document à ce jour**, et ce n'est pas faute de recherche. Les tarifs professionnels des portails auto français ne sont pas publics (LBC ne publie les siens que dans l'espace pro connecté), et les pages qui s'en approchent sont bloquées par la politique réseau. Les repères économiques du secteur (coût par lead, marge VO) circulent surtout via des agrégateurs de contenu. Chaque ligne ci-dessous porte donc son niveau de confiance, et les conclusions du §5.2 sont construites pour rester valides sur une fourchette large plutôt que sur un chiffre exact.*

| Donnée retenue | Valeur | Source | Confiance |
|---|---|---|---|
| Facture LBC pro de référence | **1 780 €/mois pour 20 véhicules** (= 89 €/véhicule/mois) | Facture de Nicolas Therond (RETRO+), non relue | **Première main, mais périmètre non documenté** → action n°33 |
| Taux de transformation d'un lead VO en vente | **15,9 %** en 2022 (14,6 % en 2021) | [Journal Auto — Carvivo publie son baromètre des leads 2022](https://journalauto.com/services/carvivo-publie-son-barometre-des-leads-2022/) | Bonne (presse professionnelle + baromètre nommé), mais **données 2022** |
| Répartition des leads VO par source | LBC **103 774** contacts, La Centrale **74 610**, sites concessionnaires **55 277** → LBC ≈ 44 % | idem (baromètre Carvivo, groupes de distribution France + Benelux) | idem — sert à borner, pas à trancher |
| Dégradation ultérieure de la conversion | La conversion des leads VO s'est dégradée fin 2023 ; leads en baisse en 2023 | [Journal Auto — La conversion des leads VO s'est dégradée fin 2023](https://journalauto.com/services/la-conversion-des-leads-vo-sest-degradee-fin-2023/) | Signale que 15,9 % est probablement un **plafond** |
| Coût par lead automobile | **~35 € HT** cité comme « bon tarif » ; fourchette observée **5-120 €** selon exclusivité et ciblage | [scalecity — Baromètre du coût par lead 2026](https://scalecity.fr/barometre-cout-par-lead/) (403 à la consultation directe), [Journal Auto — Réduire le coût d'acquisition des leads VO](https://journalauto.com/distribution/reduire-le-cout-dacquisition-des-leads-vo-de-quoi-seduire-les-concessionnaires/) | **Faible** — agrégateur non consultable. **Pivot du Résultat n°1, à confirmer** |
| Marge brute d'un VO revendu à particulier | **1 400 à 1 800 €**, soit 10-15 % du prix ; marge brute pro maintenue autour de 10-12 % en 2024 | [Super French — Marge vendeur voiture occasion](https://www.superfrench.fr/marge-vendeur-voiture-occasion-maximisez-profit-2025/), [L'Argus — Baromètre occasion](https://www.largus.fr/pros/actualite-automobile/barometre-occasion-la-profession-dans-l-escalier-de-la-baisse-des-prix-30029937.html) | Faible à moyenne — sert d'ordre de grandeur (le portail coûte ~1 % de la marge) |
| Marché VO France 2025 | **5,53 M** de voitures particulières d'occasion (77 % des achats de VP, +0,9 %), âge moyen 11,1 ans ; **~1,94 M** achetées via un professionnel | [SDES / ministère — Immatriculations de voitures en 2025](https://www.statistiques.developpement-durable.gouv.fr/immatriculations-de-voitures-en-2025-le-marche-du-neuf-baisse-celui-de-loccasion-resiste), [L'Argus — Les indicateurs clés du marché VO](https://www.largus.fr/pros/actualite-automobile/voitures-d-occasion-les-principaux-indicateurs-cles-du-marche-en-france-30045867.html) | **Bonne** (source publique) |
| Taille du parc professionnel | 12 934 points de vente concessionnaires (2025) ; branche des services de l'automobile ≈ **140 700 entreprises / 480 000 salariés** ; 397 684 salariés dans « commerce et réparation » au 30/06/2025 | [ANFA — Chiffres clés 2025 de la branche](https://www.anfa-auto.fr/actualites/lanfa-publie-les-chiffres-cles-2025-de-la-branche-des-services-de-lautomobile), [Mobilians](https://www.mobilians.fr/organisation/) | Moyenne — **aucune de ces sources ne donne la distribution du stock VO par établissement** → action n°34 |
| Multidiffusion — acteurs et fonctionnement | **Ubiflow** (le plus installé), **Kepler VO**, **Stockway** (utilitaire/industriel) ; flux **XML / API REST** + photos, destinations LBC, La Centrale, ParuVendu Auto, Ouest-France Auto, site du garage ; règles de diffusion conditionnelles (prix, photo, garantie, type) | [Ubiflow — Diffusion d'annonces automobiles](https://www.ubiflow.net/blog/diffusion-dannonces-automobiles-augmenter-visibilite), [Ubiflow — Vendez plus rapidement votre stock VO](https://www.ubiflow.net/blog/specialiste-vo-diffusion-annonces-stock-vo), [Kepler VO](https://www.keplervo.com/fr/multidiffusion-annonces-auto), [Stockway](https://stockway.pro/) | **Bonne** — sources éditeurs, mais convergentes et descriptives d'un fait de marché |
| Mécanique du quota LBC 2026 | Depuis le **27/04/2026**, frais d'insertion au-delà d'un quota pour les comptes sans abonnement ; **un renouvellement consomme le quota comme une publication** ; supprimer et republier pour tester prix ou photos gaspille des unités ; montants cités pour l'auto particulier : **79,90 €** la publication, **26,90 €** la modification | [Annu Moteurs](https://www.annumoteurs.net/annonce-leboncoin-payante-en-2026-tarifs-limites-et-astuces-cachees/), [SEQUR](https://sequr.fr/blog/prix-annonce-leboncoin-particulier-2026), [Blog du GCF](https://www.blog-du-gcf.fr/tout-savoir-sur-les-nouveaux-tarifs-des-annonces-leboncoin-pour-particuliers-en-2026/) | **Faible** (agrégateurs concordants mais non officiels) — recoupe l'action n°13, toujours ouverte |
| Réaction des professionnels | Retrait public d'annonces par des négociants (cas cité : Brochard Automobile — « hausses répétées difficilement justifiables ») | [fiches-auto.fr — Leboncoin : des abus sur les tarifs des annonces auto ?](https://www.fiches-auto.fr/articles-auto/nouveautes-automobiles/s-3991-leboncoin-des-abus-sur-les-tarifs-des-annonces-auto-.php) (403), [forum-auto Caradisiac](https://forum-auto.caradisiac.com/topic/417117-avis-augmentation-tarif-leboncoin/) (403) | Faible — anecdotique, mais concordant avec le §3 (épisode 2013) |
| Options de visibilité La Centrale | Dépôt gratuit, options payantes ; **> 7 €** la remontée en tête de liste ; emplacement privilégié sur critères de recherche pour les pros | [La Centrale — Règle de fonctionnement / classement](https://www.lacentrale.fr/informations/information-classement), [offre-pro.lacentrale.fr](https://offre-pro.lacentrale.fr/) | Faible — ordre de grandeur seulement |
| **Grille pro automobile de LBC** | **NON OBTENUE** | [leboncoinsolutionspro.fr/automobile/](https://leboncoinsolutionspro.fr/automobile/) (403), [assistance.leboncoin.info — Présentation des offres commerciales Automobile](https://assistance.leboncoin.info/hc/fr/articles/27896546571922-Pr%C3%A9sentation-des-offres-commerciales-leboncoin-pour-les-professionnels-de-l-Automobile) (403), [leboncoin.fr/dc/cgv_pro](https://www.leboncoin.fr/dc/cgv_pro) (403) | **Nulle.** Les montants d'agrégateurs (« Starter 29 € », « Business 79 €», « Pack Local 39 € HT ») sont incohérents entre eux et trois ordres de grandeur sous la facture réelle : **ne pas les utiliser** |

**Hôtes bloqués par la politique réseau (403) lors de cette session**, confirmés comme refus de politique d'entreprise via le point de contrôle du proxy et non comme incidents : `leboncoinsolutionspro.fr`, `assistance.leboncoin.info`, `www.leboncoin.fr`, `www.autoactu.com`, `www.clubic.com`, `www.fiches-auto.fr`, `forum-auto.caradisiac.com`, `www.dealabs.com`, `scalecity.fr`. S'ajoutent aux hôtes déjà recensés les 28, 29, 30 et 31 juillet (§15).

## Annexe — Sources du schéma d'index et de la pertinence §14.2 (2026-08-02)

**Source primaire — documentation officielle Typesense v30.2, lue directement dans son dépôt source.** L'accès à `typesense.org` étant refusé par la politique réseau de l'environnement (voir §14.2, Résultat n°0), les fichiers sources de la documentation ont été récupérés sur `raw.githubusercontent.com/typesense/typesense-website/master/docs-site/content/30.2/` — c'est-à-dire **la même source que le site publié**, sans intermédiaire :

- `api/search.md` (158 Ko) — tous les paramètres de recherche et leurs valeurs par défaut : `query_by`, `query_by_weights`, `text_match_type`, `num_typos` (défaut 2), `min_len_1typo` (4), `min_len_2typo` (7), `typo_tokens_threshold` (1), `drop_tokens_threshold` (1), `enable_typos_for_numerical_tokens` (true), `enable_typos_for_alpha_numerical_tokens` (true), `split_join_tokens`, `prioritize_exact_match` (true), `prioritize_token_position` (false), `prioritize_num_matching_fields` (true), `max_candidates` (4), `sort_by` (**maximum 3 champs**), `group_by` / `group_limit` (3) / `group_missing_values` / `group_max_candidates`, `facet_by`, `max_facet_values` (10), `facet_strategy` (`automatic`), `facet_sample_percent` (**100 — échantillonnage désactivé par défaut**), `facet_query`, `facet_query_num_typos` (2), `per_page` (10, **plafonné à 250**), `exhaustive_search`, `stopwords`, `pinned_hits` / `hidden_hits`, `filter_curated_hits`, `infix`.
- `api/collections.md` (77 Ko) — options de champ : `facet`, `optional`, `index`, `store`, `sort`, `range_index` (défaut `false`), `stem`, `stem_dictionary`, `locale`, `token_separators`, `symbols_to_index`, `default_sorting_field` (et son rôle dans le choix des variantes de préfixe et de fautes de frappe), `enable_nested_fields`, `synonym_sets`, `curation_sets`.
- `api/curation.md` (50 Ko) — jeux de curation, `pinned_hits`/`hidden_hits`, **filtrage dynamique** (`{variable}` dans `rule.query` + `filter_by` + `remove_matched_tokens`, et l'exigence `facet: true` sur les champs concernés), tri dynamique, `curation_tags`, `stop_processing`, `effective_from_ts`.
- `api/synonyms.md` (23 Ko) — **jeux de synonymes** (`/synonym_sets`, nouvelle route depuis la v29 ; les clés d'API scopées `synonyms:*` ne l'ouvrent pas), multidirectionnel vs unidirectionnel (`root`), `locale` par entrée (appliqué uniquement si le champ le plus lourd a le même `locale`), `synonym_num_typos` (0), non-application aux phrases entre guillemets et à `filter_by`.
- `api/geosearch.md` (14 Ko) — `geopoint`, `filter_by: location:(lat, lng, N km)`, tri par distance, **`exclude_radius`**, `precision`.
- `api/stopwords.md`, `api/documents.md`, `api/stemming.md` (racinisation Snowball, langue déduite du `locale` du champ ; avertissement sur la dégradation de pertinence sur noms propres et lieux ; dictionnaires personnalisés en JSONL).
- `guide/ranking-and-relevance.md` — critères de classement, composition du score par champ, `max_score` / `max_weight` / `sum_score`, `_text_match(buckets: N)` et `bucket_size`, `_eval()` simple et à scores multiples (`_eval([ (a):3, (b):2 ])`), départage par champs utilisateur.
- `guide/locale.md` — comportement par défaut « anglais » et **repli automatique des diacritiques** ; préservation des diacritiques sous ICU pour les locales non anglaises ; rattrapage par la tolérance aux fautes ; `pre_segmented_query`.
- `guide/tips-for-searching-common-types-of-data.md` — usages de `token_separators` et `symbols_to_index`.

**Diagnostic réseau (Résultat n°0)** : sortie de `curl -sS "$HTTPS_PROXY/__agentproxy/status"` dans l'environnement d'exécution, et sondage HTTP de 13 domaines. Documentation de référence de la configuration : `code.claude.com/docs/en/claude-code-on-the-web` (politique réseau des environnements).

**Tarifs Claude Haiku 4.5** (Résultat n°10) : 1 $/MTok en entrée, 5 $/MTok en sortie ; lecture de cache ≈ 0,1× l'entrée, écriture 1,25× (TTL 5 min) ou 2× (TTL 1 h). Catalogue de modèles daté du 2026-06-24. **À revérifier à la mise en œuvre.**

**Sources de marché — extraits de résultats de recherche uniquement, pages non consultées** (domaines refusés par la politique réseau ; à revérifier via l'action n°35 avant tout usage externe) :

- Marché VO 2025 : **5,5 M de transactions (+0,9 %), 77 % des achats de voitures**, âge moyen du parc VO **11,1 ans**, **diesel 44 % des ventes VO** contre 4,8 % du neuf (essence 21,9 %, hybride 42,5 % du neuf) — extraits de `aaa-data.fr`, `statistiques.developpement-durable.gouv.fr` (SDES), `plaques24.fr`, `bymycar.fr`.
- Boîtes automatiques : **54 % des voitures neuves immatriculées en 2025**, contre 25 % en 2016 et 8 % en 2004 (chiffres attribués à la **PFA**) — extraits de `autojm.fr`, `adicie.com`, `auto-infos.fr`. Marché du neuf 2025 : 1,665 M d'immatriculations (−5,2 % vs 2024).
- ZFE : suppression votée par la commission spéciale de l'Assemblée nationale le **27/03/2025** puis en séance le **28/05/2025** (98 voix contre 51) dans le projet de loi de simplification de la vie économique ; devenir de la vignette Crit'Air incertain — extraits de `guichetcartegrise.com`, `france3-regions.franceinfo.fr`, `carte-grise-france.fr`, `mieuxrespirerenville.gouv.fr`.
- La Centrale, recherche en langage naturel et IA en production (Résultat n°10) — extraits de `larevuedudigital.com`, `lemondeinformatique.fr`, `caradisiac.com`, `journalauto.com`, `auto-infos.fr`. Éléments retenus : recherche « texte libre » en langage naturel intégrée au parcours acheteur, ~20 cas d'usage IA en production, assistant de pricing (Pilot Price) pour les professionnels depuis juin 2025.
- Référentiel véhicules : **ADEME Car Labelling** / « Émissions de CO2 et de polluants des véhicules commercialisés en France » — données UTAC d'homologation acquises annuellement par l'ADEME depuis 2001, contenant gammes, marques, modèles, n° CNIT et type d'énergie ; mise à jour trimestrielle ; publiée sur `data.gouv.fr`, `data.ademe.fr` et divers portails Opendatasoft. **Existence et périmètre établis par extraits ; fichier non téléchargé.**

**Note de méthode** : la §14.2 distingue explicitement ce qui vient de la documentation officielle (paramètres, valeurs par défaut, contraintes du moteur — fiable), ce qui vient d'extraits de recherche (chiffres de marché — à revérifier), et ce qui vient de la connaissance du domaine (le dictionnaire de synonymes — hypothèse à valider sur les données du pilote).
