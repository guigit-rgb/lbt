# Cahier des charges — LBT (lebontruc.fr / .com)
### Devenir un concurrent sérieux de LeBonCoin (LBC) en 24-36 mois

*Document vivant — dernière mise à jour : 2026-07-30. Porté par Nicolas Therond (PDG RETRO+), en phase de conception avec Claude. Pas encore d'équipe technique affectée.*

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

**À faire avant de figer les prix :** ce modèle est établi ; reste à définir les paliers d'abonnement pro (action §17 n°6) et le budget de coûts fixes réel (action §17 n°5), qui déterminent ensemble le seuil de rentabilité.

---

## 6. Exigences produit / UX

Parité d'ergonomie avec LBC = prérequis silencieux, pas un argument de vente. Fonctions attendues au MVP :
- Dépôt d'annonce en < 2 minutes (formulaire court, upload photos multiple, géolocalisation auto)
- Recherche et filtres rapides (prix, localisation/rayon km, marque/modèle/année pour l'auto, état, etc.)
- Messagerie intégrée acheteur-vendeur (ne pas exposer les coordonnées perso par défaut — argument confiance)
- Fiche "vitrine pro" pour les garages (comme l'E-Vitrine LBC, mais moins chère)
- Système d'avis/réputation vendeur — argument de confiance différenciant sur l'auto (LBC n'a pas de système de notation robuste)
- **Floutage automatique de la plaque d'immatriculation au dépôt (arbitré le 2026-07-29, cf. §7.1)** : obligation de fait côté RGPD (position CNIL), protection du vendeur contre la « doublette » et l'annonce clone, **coût marginal nul** puisque le détecteur est déjà dans la chaîne de modération. **LBC ne le propose pas nativement** (les vendeurs passent par des applis tierces ou floutent à la main) → différenciateur produit gratuit, à afficher explicitement dans le parcours de dépôt.
- Signalement au dépôt des photos déjà vues ailleurs sur LBT (déduplication pHash) — protection acheteur contre l'annonce clone
- Notifications (nouvelle réponse, baisse de prix sur une recherche sauvegardée, etc.)
- **Publication immédiate comme engagement produit (arbitré le 2026-07-30, cf. §7.2)** : cible **médiane < 5 min, 95 % < 15 min**, et **publication par défaut** — le blocage avant publication est plafonné à 2 % des dépôts. Corollaire : le parcours doit assumer la modération *après* publication (statut visible de l'annonce, exposé des motifs en langage clair, bouton de réclamation) plutôt qu'une salle d'attente.
- **Formulaire de signalement public sur chaque annonce (obligation DSA art. 16)** avec accusé de réception et notification de la décision au signaleur — ce n'est pas une fonctionnalité optionnelle du MVP
- Version mobile web irréprochable dès le MVP (la majorité du trafic annonces est mobile) ; appli native à évaluer en phase 2

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
| Fraude sur l'auto ternit la réputation avant même le lancement | Friction-fee ciblé + modération humaine dès le MVP, pas en rattrapage. **Ajout du 2026-07-29 :** déduplication par hachage perceptuel dès le jour 1 (§7.1) — la photo réutilisée est la signature n°1 de l'annonce frauduleuse et aucune API de modération ne la détecte |
| Exposition RGPD par les photos elles-mêmes (plaques, visages, adresses) — risque de plainte CNIL indépendant de toute fraude | Floutage automatique des plaques et des visages au dépôt, intégré à la chaîne de modération (§7.1, §8). Le taux de détection du modèle devient un indicateur de conformité, à mesurer avant lancement (action §17 n°16) |
| Dilution : vouloir couvrir trop de verticales trop vite | Discipline de phasage (§4) — collection seulement après l'auto, pas en parallèle dès le M1 |
| **Sur-modération : destruction du dépôt légitime par excès de zèle algorithmique** — risque dominant identifié le 2026-07-30 (l'Appeals Centre Europe infirme **52 % des décisions de retrait** des plateformes qu'il examine). Sans effet de réseau, un vendeur injustement bloqué est perdu définitivement | Principe « publier par défaut, bloquer par exception » (§7.2) : blocage a priori plafonné à 2 % des dépôts, précision > 90 % exigée pour toute règle de blocage, taux d'infirmation en réclamation traité comme un indicateur de **calibration des seuils** |
| Aspect juridique sous-estimé | Point juridique avant lancement public (§8), pas après un incident. **Précisé le 2026-07-30** : la base juridique a changé (loi SREN 2024 → DSA art. 16 et s.), et les art. 14/16/17 imposent des livrables rédactionnels sur le chemin critique du lancement |
| **Signalement de masse malveillant entre garages concurrents** sur une place de marché auto | Suspension du traitement des signalements manifestement infondés répétés, après avertissement (conception art. 23, §7.2) |
| Absence de ressource technique dédiée | Décision claire sur le déclenchement de l'implication de l'équipe RETRO+ (§11) |

---

## 13. Plan de ressources (matériel & humain)

*À construire progressivement par les sessions de travail quotidiennes (voir §17). Le volet "coûts variables" est chiffré depuis le 2026-07-28 (§5.1) ; le volet "coûts fixes" (équipe, budget par phase) reste à faire — c'est lui qui détermine le seuil de rentabilité.*

**Acquis du 2026-07-30 (§7.2) — trajectoire d'effectif modération + support :** 0,01 ETP au palier pilote (S1), **0,07 ETP au palier régional** (S2, ~10 h/mois de modération) et **~1,5 ETP au palier national** (S3 : 0,73 ETP de modération + 0,75 ETP de support, ≈ 4 600 €/mois chargés). Conséquence pour l'action n°5 : l'hypothèse « 0,5 ETP modération/support » du scénario F = 15 000 €/mois tient jusqu'au palier régional **mais pas au national**. Décision associée : **modération gardée en interne** (files légales et réclamations), seule la file de revue ciblée est externalisable en débordement au-delà du palier régional — le BPO est 2 à 6× moins cher par élément mais n'a pas la connaissance du marché français de l'occasion, qui est précisément l'avantage de Nicolas.

**Acquis du 2026-07-28 (§5.1) :** l'infra technique fixe reste modeste (~250-400 €/mois au palier régional M12 : 2 VPS applicatifs, Postgres managé, VM Meilisearch, monitoring, Brevo). Le poste dominant de la structure de coûts est **humain** : modération et support représentent ~80 % du coût marginal par annonce. Dimensionner l'équipe modération/support est donc un arbitrage plus structurant que n'importe quel choix d'hébergeur.

- Besoins humains par phase (dev, design, modération/support, commercial garages...)
- Quand et comment impliquer l'équipe RETRO+ (Fabien, les 3 ingénieurs 3IL, l'admin sys) vs recruter/externaliser spécifiquement pour LBT
- Besoins matériels/infra (hébergement, stockage images, coûts variables par annonce/par utilisateur)
- Budget prévisionnel par phase

## 14. Choix technologiques

*À trancher progressivement — ne pas figer avant d'avoir comparé les options. Point de départ : les skills déjà installés couvrent Cloudflare (Workers/D1/R2/Images) et Vercel/Next.js, deux stacks capables de scalabilité rapide sans lourdeur DevOps initiale, mais rien n'est encore choisi.*

- Stack backend/frontend
- **Moteur de recherche — arbitré le 2026-07-31 (§14.1) : Typesense, auto-hébergé, un nœud, indexé depuis Postgres.** Départagé non par la performance (au volume de LBT les quatre candidats sont surdimensionnés) mais par deux besoins métier — **boost commercial au moment de la requête** (`_eval()` et curation, absents de Meilisearch qui n'a pas de pinning natif) et **tolérance aux fautes réglable par champ** (indispensable sur les références chiffrées : 308/208/508, A3/A4) — et par la **trajectoire de licence** : Meilisearch a placé sharding et réplication dans une *Enterprise Edition* sous BSL 1.1 interdite en production sans accord commercial, là où Typesense garde le clustering Raft dans l'open source. **Algolia écarté le 2026-07-28** (facturation à la requête, incompatible avec un trafic particulier gratuit). **Elasticsearch/OpenSearch écartés** : coût d'exploitation JVM disproportionné sans admin sys dédié ; leur seul avantage structurel (le percolateur, pour les alertes « nouvelle annonce ») se contourne trivialement à notre volume. **Postgres seul écarté** comme cible, mais reste le repli si le MVP doit sortir plus vite.
- Hébergement et scalabilité
- **Couche image — arbitré le 2026-07-28** : object storage à egress nul + variantes pré-générées au dépôt + CDN. Cloudflare Images en mode stockage Cloudflare écarté (facturation à la livraison, ~40× plus cher au palier national). Alternatives européennes valables si la souveraineté prime : Scaleway Object Storage (~0,011 €/Go-mois, hébergement France, ISO 27001/HDS) ou Bunny Storage+CDN (0,01 $/Go). Le poste étant à ~0,001 €/annonce, **le choix peut se faire sur la souveraineté plutôt que sur le prix**.
- **Modération de contenu — arbitré le 2026-07-29 (§7.1)** : cascade auto-hébergée sur CPU (pHash ou PDQ pour la déduplication, `Falconsai/nsfw_image_detection` en ONNX INT8 pour le NSFW, YOLOv11 fine-tuné plaques + OpenCV pour le floutage, PaddleOCR pour le texte incrusté) sur un serveur 4 vCPU à ~25 €/mois, **sans GPU** ; complétée par un appel à Claude Haiku 4.5 (~0,0016 $/image) sur l'image de couverture et les images signalées uniquement. **Écartés** : Hive (~690 €/mois à S3, pas de tarif public), Sightengine (~470 €/mois), Google Vision SafeSearch (~345 €/mois), AWS Rekognition (~230 €/mois — et arrêt du Batch Image Content Moderation aux nouveaux clients au 30/04/2026), Azure Content Safety (~172 €/mois) : tous conçus pour l'UGC social (nudité/violence) et aveugles à nos trois risques réels (photo volée, plaque visible, coordonnées incrustées). **Cloudflare Workers AI : non tranché**, coût par image non confirmable (doc officielle inaccessible depuis l'environnement d'exécution).
- **Back-office de modération — non tranché (identifié le 2026-07-30, §7.2)** : la politique de modération suppose un outil de *case management* capable de gérer 4 files avec SLA, de produire l'enregistrement structuré de chaque décision (exigence DSA art. 17) et d'instruire les réclamations. Construire (spécification simple, ~10 champs, maîtrise totale) ou acheter (Tremau, Checkstep et autres éditeurs Trust & Safety — aucun tarif recherché à ce stade) : arbitrage à faire → action §17 n°24.
- Paiement/escrow (si applicable, hors MVP)

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

## 16. Journal d'avancement quotidien

*Chaque session de travail (manuelle ou automatisée) ajoute une entrée datée ici : ce qui a été fait, ce qui a été décidé, ce qui reste ouvert.*

- **2026-07-27** — Création du document v1 (positionnement, concurrence, segments, modèle économique, UX, technique, légal, acquisition, roadmap, organisation, risques). Mise en place prévue d'un agent quotidien automatisé pour faire avancer le document en continu.
- **2026-07-28** — **Action §17 n°1 traitée : modèle de coût d'infrastructure par annonce et par pro** (nouvelle §5.1, tarifs sourcés en annexe). Cinq conclusions : (1) l'architecture image détermine tout — variantes pré-générées + object storage à egress nul = ~40× moins cher que Cloudflare Images au palier national, et coût insensible au trafic ; (2) le socle technique d'une annonce ne coûte que **~0,041 €** ; (3) le coût marginal réel est **~0,19 €/annonce dont ~80 % humain** (modération + support) — le levier de coût est l'automatisation de la modération, pas les serveurs ; (4) un garage pro coûte **~10 €/mois** en variable direct contre **1 780 €/mois facturés par LBC** pour le même périmètre : marge brute ~90 % dès 99 €/mois, le prix pro n'est pas contraint par les coûts ; (5) le vrai arbitrage est le seuil de rentabilité — à 149 €/mois et 15 k€/mois de coûts fixes, il faut **108 garages**, ce qui valide la cohérence de l'objectif M12 (200 garages) du §2. **Décisions techniques dérivées** : Algolia et Cloudflare Images (mode stockage) écartés du §14 ; recommandation de cadrage à 149 €/mois pour l'action n°6. **Découverte annexe** : sources secondaires indiquant que LBC a réduit les photos gratuites à 3 et limiterait les particuliers à 2 annonces auto gratuites/an — à confirmer (nouvelle action n°13), potentiel axe de différenciation à coût nul pour LBT.

- **2026-07-29** — **Action §17 n°11 traitée : modération automatique des images** (nouvelle §7.1, sources en annexe). Le résultat le plus important est un recadrage, pas un prix : **les API de modération commerciales (Hive, Sightengine, AWS Rekognition, Azure, Google Vision) sont conçues pour l'UGC social — nudité, violence, armes — et ne couvrent aucun des trois risques réels d'une annonce auto** : photo volée/réutilisée (arnaque n°1, exige du hachage perceptuel), plaque d'immatriculation visible (obligation RGPD/CNIL, exige un détecteur + floutage), coordonnées incrustées dans l'image (exige de l'OCR). Le choix n'était donc pas « quelle API » mais « quelle chaîne construire ». **Architecture retenue** : cascade auto-hébergée sur **un seul serveur 4 vCPU à ~25 €/mois, sans GPU** (pHash/PDQ + ViT NSFW en ONNX INT8 + YOLOv11 plaques + PaddleOCR ≈ 25 h de CPU/mois sur 720 disponibles au palier national), complétée par un modèle vision-langage (Claude Haiku 4.5, ~0,0016 $/image) appelé **uniquement sur l'image de couverture et les images signalées** (~53 €/mois) pour la compréhension sémantique. **Total ~78 €/mois à 250 k images/mois, soit 0,003 €/annonce contre 0,018 € estimé la veille** ; le sous-total technique du §5.1 passe à ~0,026 €/annonce et le coût marginal total à ~0,175 €, dont ~85 % d'humain — la conclusion du 2026-07-28 est renforcée. **GPU écarté** : auto-héberger un VLM coûterait 577 à 889 €/mois contre ~53 € pour l'API. **Différenciateur produit tombé de l'analyse** : le détecteur de plaques étant déjà présent pour raison légale, **le floutage automatique au dépôt est gratuit — et LBC ne le propose pas nativement** (les vendeurs passent par des applis tierces) ; argument de confiance immédiat, ajouté au §6. **Découvertes juridiques** (§8) : position CNIL sur les plaques ; DSA art. 16-17 (notification/action et motivation des décisions) applicables dès le jour 1 et contraignant l'outillage de modération, tandis que les art. 19 et 29 excluent les micro/petites entreprises des obligations de transparence et de traçabilité des vendeurs pros, avec une prolongation de 12 mois après la perte du statut. **Limite majeure assumée** : les taux de faux positifs/négatifs des modèles ouverts n'ont pas été évalués sur des photos de véhicules françaises — c'est le paramètre le plus décisif et il ne s'obtient que par mesure (nouvelle action n°16).

- **2026-07-30** — **Action §17 n°12 traitée : politique de modération** (nouvelle §7.2). L'action était mal posée : le « taux d'échantillonnage humain » n'est pas un paramètre à choisir, c'est le **résultat** d'un budget d'heures réparti sur des files dont trois sont non compressibles. **Architecture retenue : 4 files + 1 file de réclamations** — pré-modération (≤ 2 % des dépôts, 100 % revue, SLA < 4 h), signalements DSA art. 16 (100 %, < 24 h ; < 4 h si grave), **audit aléatoire de 2 % des annonces auto-validées** (seule mesure non biaisée du taux de faux négatifs), revue ciblée élastique (scénario central 20 %, priorisée par score × prix du véhicule), réclamations art. 20 (< 48 h, par une autre personne). **Principe directeur contre-intuitif : le risque dominant est la sur-modération, pas la sous-modération** — l'Appeals Centre Europe infirme **52 % des décisions de retrait** des plateformes qu'il examine (59 % toutes décisions confondues), et sans effet de réseau un vendeur injustement bloqué est perdu définitivement. D'où « **publier par défaut, bloquer par exception** », précision > 90 % exigée pour toute règle de blocage a priori, et le taux d'infirmation en réclamation traité comme un indicateur de **calibration des seuils** et non de performance des modérateurs. **Chiffrage** : ~1 h/mois au pilote, ~10 h/mois au palier régional, **0,73 ETP (~2 220 €/mois) au palier national** ; 2,5 ETP si l'on revoit 100 % des annonces. **Correction du §5.1** : le coût de modération humaine passe de 0,058 à **0,089 €/annonce (+53 %)** — le modèle du 28/07 omettait les signalements, les réclamations et l'audit, dont deux sont des obligations légales. Coût marginal par annonce : **~0,21 € dont ~87 % d'humain** ; le coût par garage pro passe de 10,0 à 10,3 €/mois et **aucune conclusion du §5.1 ne bascule** (seuil de 108 garages à 149 €/mois inchangé). **Décision retenue : 100 % de revue humaine jusqu'à ~1 000 annonces/mois** — non par prudence (cela coûte 3,4 h/mois) mais parce que c'est ce qui produit la mesure de prévalence et le jeu de données étiqueté dont l'action n°16 a besoin : le pilote *est* la campagne de mesure. **Modération gardée en interne** (BPO 2 à 6× moins cher par élément mais sans connaissance du marché français de l'occasion — l'avantage de Nicolas est ici structurel). **Découverte juridique majeure (§8) : la LCEN n'est plus la base juridique de la modération** — la loi SREN n° 2024-449 du 21 mai 2024 a abrogé les dispositions générales de l'art. 6 LCEN sur la notification des contenus illicites (l'ancien 6.I.8 devenant 6-3) ; ce sont les art. 6 et 16 et suivants du DSA qui s'appliquent, et l'**art. 14 impose de publier la politique de modération** dans un format lisible par machine, sans exclusion pour les petites entreprises. **Conséquence produit** : le friction-fee anti-fraude du §5 se révèle être avant tout un **signal de modération** (une empreinte bancaire vérifiée vaut mieux que n'importe quel modèle de vision) — il doit donc être vendu comme un accélérateur de publication, pas comme une taxe. **Limite d'environnement** : les sources officielles clés (`eur-lex`, `legifrance`, `cnil.fr`, rapport de transparence DSA de LBC sur `img.leboncoin.fr`, rapports DSA d'eBay) sont **bloquées par la politique réseau** de l'environnement d'exécution — le DSA a été travaillé sur sites miroirs, à revérifier en session locale (action n°21).

- **2026-07-31** — **Action §17 n°2 traitée : comparatif des moteurs de recherche** (nouvelle **§14.1**). **Le résultat structurant est un recadrage du critère de choix : au volume de LBT, la recherche n'est pas un problème d'échelle.** Le stock actif est de 500 annonces au pilote, 5 000 au régional et **50 000 au palier national** (§5.1) — soit ~60 Mo de données indexables. Typesense (index tout en RAM, 2-3× le jeu de données) demande **~150 Mo**, Meilisearch (LMDB mappé en mémoire) moins encore, et Elasticsearch part de 1-8 Go de plancher JVM *quoi qu'on indexe*. **Les trois tiennent sur un VPS à 7-17 €/mois** pour un poste budgété 50 €. Conclusion de méthode : **tout arbitrage fondé sur des benchmarks de latence ou de scalabilité est hors sujet** — le seuil où l'écart RAM entre Typesense et Meilisearch deviendrait un argument est à ~2 M de documents, un ordre de grandeur au-dessus du plan à 36 mois. **Décision : Typesense**, départagé sur deux besoins métier et un risque de licence, aucun n'étant un critère de performance : (1) **boost commercial au moment de la requête** — `_eval()` (« optional filtering ») et curation/épinglage permettent de remonter conditionnellement les annonces des pros payants et de l'A/B tester sans réindexer, là où Meilisearch n'a **pas de pinning natif** et n'expose que des règles de ranking statiques définies au niveau de l'index ; (2) **tolérance aux fautes réglable par champ** (`num_typos=2,0,0`) — critique sur les références chiffrées de l'automobile (**308/208/508, A3/A4, C3/C4** sont à une substitution les uns des autres), là où Meilisearch n'offre qu'un `disableOnNumbers` global depuis la v1.15 ; (3) **trajectoire de licence — et ici le réflexe « MIT > GPL » est faux pour notre usage** : la GPL-3.0 de Typesense n'impose rien à LBT puisque nous exploitons le moteur comme service réseau sans le distribuer (la GPL, contrairement à l'AGPL, se déclenche à la distribution), tandis que **Meilisearch a placé sharding et réplication dans une Enterprise Edition sous BSL 1.1** (`LICENSE-EE` du dépôt : usage non-production uniquement, accord commercial requis en production, bascule MIT à 4 ans), quand Typesense garde le **clustering Raft dans l'open source**. **Écartés** : Elasticsearch/OpenSearch (coût d'exploitation JVM disproportionné sans admin sys — leur seul avantage structurel, le **percolateur** pour les alertes « nouvelle annonce », se contourne en SQL à 35 nouvelles annonces/heure ; si ES devenait nécessaire, **OpenSearch** est le défaut, Apache-2.0 contre le triple licence AGPL/ELv2/SSPL d'Elastic) ; **Postgres seul** (suffisant au pilote, mais la charge de recherche concurrencerait la charge transactionnelle et la réécriture ultérieure coûterait des semaines pour un composant à 7-17 €/mois) ; **la pile native Cloudflare** (D1/FTS5 + Vectorize : ni facettes, ni fautes de frappe, ni géo). **Deux décisions d'architecture dérivées** : (a) **les compteurs des pages SEO viennent d'un `COUNT` Postgres**, jamais du moteur — Meilisearch plafonne l'exhaustivité à `maxTotalHits` (1 000 par défaut) et Typesense échantillonne les facettes ; (b) **trois conditions de réversibilité** posées dès la première ligne de code (moteur jamais source de vérité, module d'abstraction interne, réindexation complète routinière) qui ramènent un changement de moteur à quelques jours — ce qui autorise à trancher sans sur-débattre. **Adoption en deux temps** : Typesense Cloud pendant le MVP et le pilote (~22-50 $/mois — payer pour ne pas opérer un serveur tant qu'aucune ressource technique n'est affectée, §11), auto-hébergé un nœud ensuite. **Limite majeure assumée** : la **pertinence en français** (lemmatisation, accents, vocabulaire automobile) n'a pas été évaluée et n'est mesurable que sur nos données — c'est probablement plus déterminant que tout le comparatif (nouvelle action n°27). **Biais de sources signalé** : l'essentiel des comparatifs « X vs Y » indexés est publié par les éditeurs eux-mêmes (les pages « Typesense pricing » les mieux classées sont sur `meilisearch.com` ; la page de comparaison de Typesense affirme encore que Meilisearch « n'est pas production-ready ») — le travail s'est appuyé en priorité sur la documentation technique et sur le fichier de licence lu directement dans le dépôt. **Limite d'environnement, inchangée depuis le 28/07** : `typesense.org`, `cloud.typesense.org` et `meilisearch.com/docs` renvoient un **403**.

## 17. File d'attente des prochaines actions (pour les sessions automatisées)

*Liste vivante. Chaque session quotidienne prend l'action la plus prioritaire encore "ouverte", la traite en profondeur, la marque "traitée" avec un résumé, ajoute une entrée au §16, et peut ajouter de nouvelles actions découvertes en cours de route. Une seule action approfondie par jour, pas un survol de plusieurs — la qualité prime sur le volume.*

1. [**traité 2026-07-28**] Modéliser le coût d'infrastructure par annonce/par pro pour fixer un prix pro réaliste (§5) → nouvelle §5.1. Coût marginal ~0,19 €/annonce (dont 80 % humain) et ~10 €/mois par garage pro. Le prix pro n'est pas contraint par les coûts mais par le seuil de rentabilité : 108 garages à 149 €/mois pour 15 k€/mois de coûts fixes. Architecture image et moteur de recherche partiellement arbitrés par le coût (§7, §14).
2. [**traité 2026-07-31**] Comparer 3-4 moteurs de recherche candidats pour le cas d'usage annonces géolocalisées → nouvelle **§14.1**. **Décision : Typesense**, auto-hébergé un nœud, indexé depuis Postgres (Typesense Cloud pendant le MVP tant qu'aucune ressource technique n'est affectée). Recadrage central : **au volume de LBT (50 000 annonces actives à M24, ~60 Mo indexables) aucun candidat n'est contraint par la performance** — les trois moteurs dédiés tiennent sur un VPS à 7-17 €/mois, donc l'arbitrage se joue sur les fonctions métier, pas sur les benchmarks. Départagé par : **boost commercial au moment de la requête** (`_eval()` + curation, absents de Meilisearch), **tolérance aux fautes par champ** (308/208/508), et **trajectoire de licence** (Meilisearch a placé sharding et réplication en Enterprise Edition sous BSL 1.1 ; Typesense garde Raft dans l'OSS — et sa GPL-3.0 n'impose rien à un service réseau non distribué). Écartés : Elasticsearch/OpenSearch (JVM disproportionnée ; le percolateur se contourne en SQL), Postgres seul (repli MVP), pile Cloudflare. Dérivés : compteurs SEO depuis Postgres, trois conditions de réversibilité
3. [ouvert] Détailler les obligations légales précises (LCEN, RGPD, identification vendeurs pro, DAC7) avec sources à jour (§8)
4. [ouvert] Étudier des cas comparables à l'étranger (sites d'annonces auto ayant réussi à se différencier d'un leader établi) pour en tirer des enseignements
5. [ouvert] Chiffrer un premier budget prévisionnel Phase 1 (MVP + lancement régional) (§13)
6. [ouvert] Définir précisément les paliers d'abonnement pro (nombre de véhicules, prix, options) en repère explicite face à la grille LBC actuelle (§5)
7. [**partiellement traité 2026-07-31**] Rechercher si des skills spécifiques manquent pour le moteur de recherche/stack retenus, une fois choisis (§15). **Volet moteur de recherche réglé** : besoin d'un skill **Typesense** et, plus important, d'un skill **pertinence de recherche e-commerce en français** — tous deux inscrits au §15 pour une session locale. Reste ouvert pour le reste de la stack (framework applicatif, ORM, file d'attente), non encore choisie
8. [ouvert] Veille concurrentielle LBC — premier point structuré (prix, nouvelles fonctionnalités, communication) (§3)
9. [ouvert] Détailler le plan de recrutement des 10-20 premiers garages pilotes (script d'approche, argumentaire face à la frustration tarifaire LBC du 27/04/2026) (§9)
10. [ouvert] Étudier la faisabilité technique et légale du système d'avis/réputation vendeur (différenciateur confiance mentionné en §6)
11. [**traité 2026-07-29**] Comparer les options de modération automatique d'images à 250 k opérations/mois → nouvelle §7.1. Conclusion structurante : **les API commerciales ne couvrent aucun de nos trois risques réels** (photo volée, plaque visible, coordonnées incrustées) — elles ne peuvent pas être le socle. Architecture retenue : cascade auto-hébergée sur un serveur CPU à ~25 €/mois (pHash, ViT NSFW, YOLOv11 plaques + floutage, OCR — **sans GPU**) + VLM sélectif à ~53 €/mois. **0,003 €/annonce** au lieu de 0,018 €. Différenciateur produit gratuit identifié : floutage automatique des plaques, absent de LBC (§6). Découvertes juridiques CNIL + DSA reportées en §8.
12. [**traité 2026-07-30**] Définir la politique de modération → nouvelle **§7.2**. 4 files + réclamations, **« publier par défaut, bloquer par exception »** (≤ 2 % de blocage a priori) parce que **la sur-modération est le risque dominant** (Appeals Centre Europe : 52 % des retraits infirmés). Audit aléatoire de 2 % des auto-validées = seule mesure non biaisée des faux négatifs. **100 % de revue humaine jusqu'à ~1 000 annonces/mois** (3,4 h/mois, et cela produit le jeu de données de l'action n°16), puis 0,73 ETP au palier national. **Coût de modération corrigé : 0,089 €/annonce au lieu de 0,058 € — le §5.1 omettait les files légalement obligatoires** ; coût marginal total ~0,21 €/annonce. Modération gardée en interne. Base juridique corrigée : DSA art. 16 et s., plus la LCEN (loi SREN 2024) — cf. §8
13. [ouvert] Vérifier sur sources officielles LBC les quotas particuliers 2026 : nombre de photos gratuites (3 ?) et nombre d'annonces auto gratuites par an (2 puis ~8 € ?) — impact direct sur l'argumentaire de différenciation (§3)
14. [ouvert] Modéliser la déflection du support (FAQ, self-service, réponses automatisées) : 2ᵉ poste du coût marginal par annonce (0,092 €, soit ~48 % du total) (§6, §13)
15. [ouvert] Vérifier les tarifs Sightengine, Meilisearch Cloud et Cloudflare Images sur leurs pages officielles (les chiffres du 2026-07-28 viennent d'agrégateurs tiers ; `developers.cloudflare.com` renvoyait un 403 depuis l'environnement d'exécution) et revalider le taux de change USD/EUR retenu (0,92). **Ajouté le 2026-07-29** : y joindre Cloudflare Workers AI (neurones par classification d'image — non confirmé, fourchette 3 à 55 €/mois au palier S3, écart trop large pour décider), AWS Rekognition (paliers + confirmation du périmètre après l'arrêt du Batch Image Content Moderation aux nouveaux clients le 30/04/2026), Hive et Azure Content Safety. **Étendu le 2026-07-31** : y joindre **Typesense Cloud** (grille horaire RAM/CPU + bande passante, `cloud.typesense.org` en 403) et les **tarifs Hetzner Cloud après la hausse d'avril 2026** (CX33, CPX31), les deux chiffres du §14.1 provenant d'agrégateurs
16. [ouvert] **Priorité haute** — Constituer un jeu de test de 300-500 photos de véhicules réelles (le garage de Nicolas est la source évidente : photos de vitrine, intérieurs, moteurs, plaques sous différents angles, éclairages, états) et **mesurer les taux de faux positifs / faux négatifs** des modèles retenus en §7.1 : détection de plaques (un raté = exposition RGPD), NSFW (un faux positif = travail humain inutile), OCR. C'est le paramètre le plus décisif de l'architecture de modération et il ne s'obtient que par mesure — à faire avant tout développement
17. [ouvert] Déterminer si LBT relèvera du statut **micro ou petite entreprise** au sens de la recommandation 2003/361/CE (< 50 salariés et CA ou bilan ≤ 10 M€), donc exclue des obligations DSA Section 3 (art. 19) et Section 4 (art. 29), et à quelle échéance du plan le seuil serait franchi — l'exclusion se prolongeant 12 mois après la perte du statut, c'est une date à inscrire dans la roadmap (§8, §10)
18. [ouvert] Spécifier le **pipeline de dépôt d'annonce** de bout en bout : ordre des étages de la §7.1, latence cible par étage (budget total < 60 s à la publication), comportement en cas d'indisponibilité d'un modèle (publier et re-modérer, ou bloquer ?), file d'attente asynchrone vs synchrone, et journalisation des décisions exigée par le DSA art. 17 (§7, §8)
19. [ouvert] Concevoir l'**index de déduplication d'images** : quel hachage (pHash 64 bits vs PDQ 256 bits), quel seuil de distance de Hamming, quelle structure d'index à 5 M d'images en base, et quelle politique en cas de correspondance (blocage, signalement, avertissement à l'acheteur) (§7.1)
20. [ouvert] Évaluer une **recherche d'image inversée externe** (au-delà de notre propre base) pour détecter les photos reprises d'autres plateformes — faisabilité technique, légalité, coût. C'est le seul angle mort restant de l'anti-fraude photo (§7.1)
21. [ouvert] **Priorité haute — à faire en session locale** (les sources officielles sont bloquées depuis l'environnement automatisé) : revérifier sur **EUR-Lex** le texte exact des art. 6, 14, 16, 17, 18, 19, 20, 21, 23 et 29 du DSA et sur **Légifrance** l'état de la LCEN après la loi SREN n° 2024-449 du 21/05/2024, puis rédiger les livrables : **CGU décrivant la politique de modération (art. 14, format lisible par machine)**, formulaire et procédure de signalement (art. 16), **modèles d'exposé des motifs par motif de décision (art. 17)**, procédure de réclamation (art. 20). Ces livrables sont sur le chemin critique du lancement public (§8, §7.2)
22. [ouvert] Spécifier le **back-office de modération** : les 4 files avec leurs SLA, l'enregistrement structuré de décision de la §7.2 (13 champs, dont origine et moyens automatisés — exigence art. 17), la conservation 12 mois, l'interface de revue (raccourcis, décisions en un clic, débit cible 80 annonces/h) et le tableau de bord des indicateurs de la §7.2. À croiser avec l'action n°18 (pipeline de dépôt)
23. [ouvert] Définir la **grille de sanctions graduées et les règles anti-abus** en détail (§7.2 en donne le squelette) : seuils de récidive, durées de suspension, gestion des faux comptes après suspension, et traitement des **signalements malveillants entre garages concurrents** — risque spécifique à une place de marché auto
24. [ouvert] Arbitrer **construire ou acheter le back-office de modération** : chiffrer les éditeurs Trust & Safety du marché (Tremau, Checkstep, ActiveFence et autres) contre un développement interne. Repère de cadrage : le besoin est de 0,73 ETP au palier national, un outil facturé à l'élément modéré serait donc probablement disproportionné (§14)
25. [ouvert] **Trouver les données de référence manquantes du §7.2** : taux de signalement pour 1 000 annonces et taux de réclamation sur une place de marché d'annonces. Les rapports de transparence DSA de **LBC France** (`img.leboncoin.fr`), **eBay** (`static.ebayinc.com`) et des places de marché européennes (Wallapop, Marktplaats/Adevinta, OLX) contiennent ces chiffres mais sont **bloqués depuis l'environnement automatisé** → à récupérer en session locale. À défaut, ces deux taux ne s'obtiendront qu'au pilote
26. [ouvert] Évaluer l'intégration de **HistoVec** (service public gratuit d'historique des véhicules) au parcours de dépôt : la fraude au compteur touche ~10,6 % du parc français (carVertical) et une voiture au kilométrage trafiqué se vend ~39 % au-dessus de sa valeur réelle — **aucun contrôle de photo ne détecte cela**, mais un historique administratif attaché à l'annonce le rendrait beaucoup plus difficile. Différenciateur confiance potentiellement fort sur l'auto, à croiser avec l'action n°10 (avis/réputation vendeur) (§6)
27. [ouvert] **Priorité haute — spécifier le schéma d'index et la pertinence de la recherche auto** (§14.1) : champs indexés et leur poids, champs facettables et triables, `num_typos` par champ, `distinct` par vendeur (empêcher un garage de saturer une page de résultats), stratégie de tri par défaut (fraîcheur ? pertinence ? distance amortie par `exclude_radius` ?), et surtout un **dictionnaire de synonymes automobile français** — break/SW/estate, 4x4/SUV, BVA/EDC/DSG/boîte auto, HDI/dCi/TDI/diesel, « Clio 3 »/« Clio III », utilitaire/fourgon/camionnette. **C'est un actif métier que Nicolas peut produire seul et que LBC exploite mal** : sur une verticale unique, la pertinence sémantique est un différenciateur accessible, contrairement à l'effet de réseau. À valider par un jeu de 50 requêtes annotées sur les données du pilote
28. [ouvert] Concevoir les **alertes sur recherche sauvegardée** (« préviens-moi dès qu'un Kangoo diesel < 8 000 € apparaît dans 50 km ») : stockage des critères, évaluation en lot côté Postgres (le moteur retenu n'a pas de percolateur, §14.1), fréquence, plafonnement anti-spam, coût email (Brevo, déjà à 0,00075 €/email au §5.1) et articulation avec la notification de baisse de prix du §6. Fonction attendue sur un site d'annonces et levier de rétention — c'est ce qui fait revenir un acheteur qui n'a pas trouvé du premier coup
29. [ouvert] Définir les **options de visibilité payantes** que le moteur devra servir (remontée en tête, mise en avant, « à la une ») : lesquelles, à quel prix, avec quelle limite de densité par page de résultats pour ne pas dégrader la pertinence — la mécanique technique existe (`_eval()`, curation), c'est la politique commerciale qui manque. À traiter **avec** l'action n°6 (paliers d'abonnement pro), pas séparément
30. [ouvert] Spécifier l'**indexeur Postgres → Typesense** : déclenchement (événement de publication, modification de prix, vente, expiration), cohérence en cas d'échec, réindexation complète scriptée, et la **couche d'abstraction interne** `search` qui conditionne la réversibilité du choix du §14.1. À croiser avec l'action n°18 (pipeline de dépôt d'annonce) — une annonce entre dans l'index au même moment où elle sort de la chaîne de modération

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
