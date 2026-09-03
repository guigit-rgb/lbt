import type { DocumentLegal } from "./types";

/**
 * Politique de confidentialité — et c'est le document qui a une fonction que
 * les cinq autres n'ont pas.
 *
 * **§8.8, Résultat n°2 (« corollaire de rédaction ») et Résultat n°6.** Dans le
 * dispositif de l'article L. 32-3 du CPCE, le III (affichage, tri,
 * acheminement, détection de contenus non sollicités) et le IV (publicité,
 * statistiques, amélioration du service) décrivent **le même objet** et ne
 * diffèrent que par la liste des finalités. Une même ligne de code bascule de
 * l'autorisation à l'interdiction selon le mot qu'on lui écrit. Et la sanction
 * de référence n'est pas administrative mais **pénale** — article 226-15 du
 * code pénal, un an d'emprisonnement et 45 000 € d'amende, dont le premier
 * destinataire est une personne physique — avec un élément intentionnel
 * (« de mauvaise foi ») qui se combat par une finalité déclarée,
 * contractualisée et cohérente avec le code.
 *
 * D'où la règle que l'action §17 n°253 pose et que ce fichier applique :
 * **cette page n'est pas un document d'affichage, c'est une pièce de
 * défense.** Trois conséquences concrètes, toutes vérifiées par
 * `scripts/verif-pages-legales.ts` :
 *
 *  a. la section « Correspondances » porte une table **finalité → traitement →
 *     paragraphe de L. 32-3**, dérivée du tableau du §8.8 (Résultat n°4) ;
 *  b. le détecteur de messages-type et la modération des messages ne sont
 *     **jamais** présentés comme une « amélioration du service » — ce sont des
 *     dispositifs de sécurité et de détection de contenus non sollicités, ce
 *     qui les range dans le III et leur donne un ancrage textuel positif ;
 *  c. aucune finalité statistique n'est déclarée sur des données de
 *     correspondance : le paramètre λ du go/no-go se calcule sur l'arrêté
 *     mensuel agrégé, jamais sur le journal d'événements (action n°248).
 */
export const CONFIDENTIALITE: DocumentLegal = {
  id: "confidentialite",
  chemin: "/confidentialite",
  titre: "Politique de confidentialité",
  sousTitre:
    "Quelles données nous traitons, pourquoi exactement, combien de temps, avec qui, et ce que vous pouvez exiger.",
  version: "1.0",
  date: "2026-09-03",
  fondement: [
    "Règlement (UE) 2016/679 (RGPD), art. 12 à 22 et 30",
    "Loi n° 78-17 du 6 janvier 1978 modifiée",
    "Code des postes et des communications électroniques, art. L. 32-3 ; décret n° 2017-428 du 28 mars 2017",
    "Décret n° 2021-1362 du 20 octobre 2021 (conservation des données d'identification)",
  ],
  piedDePage: true,
  sections: [
    {
      titre: "1. Qui est responsable, et à qui écrire",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Le responsable du traitement est la société **Courlis**, éditrice de LeBonTruc, dont les coordonnées figurent dans les [mentions légales](/mentions-legales). Pour toute question ou pour exercer vos droits : [[à figer : adresse électronique dédiée à la protection des données]].",
        },
        {
          type: "paragraphe",
          texte:
            "LeBonTruc n'a pas désigné de délégué à la protection des données : aucun des trois cas de l'article 37 du RGPD n'est aujourd'hui rempli. Cette position sera réexaminée au passage à une audience nationale, où le suivi régulier et systématique à grande échelle deviendrait difficile à contester.",
        },
      ],
    },
    {
      titre: "2. Ce que nous traitons, et pour quelle finalité exactement",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Chaque ligne dit **une** finalité. C'est volontaire : une finalité vague autorise tout et ne protège personne, et sur les données d'échange entre acheteurs et vendeurs, la finalité écrite détermine à elle seule le régime applicable (section 4 ci-dessous).",
        },
        {
          type: "tableau",
          entetes: ["Traitement", "Finalité", "Base légale", "Durée en base active"],
          lignes: [
            [
              "Compte, authentification, vérification du numéro SIREN",
              "Fournir le service",
              "Exécution du contrat",
              "Durée du compte",
            ],
            [
              "Publication et gestion des annonces",
              "Exécution du contrat",
              "Exécution du contrat",
              "Durée de l'annonce + 12 mois",
            ],
            [
              "Analyse automatique des photos et des textes déposés",
              "**Sécurité du service et détection de contenus illicites ou non sollicités**",
              "Obligation légale (DSA) et intérêt légitime",
              "12 mois (journal)",
            ],
            [
              "Décisions de modération et sanctions",
              "Retirer, restreindre, suspendre — et pouvoir le justifier",
              "Obligation légale et intérêt légitime",
              "12 mois",
            ],
            [
              "Messagerie entre acheteur et vendeur",
              "**Acheminer et afficher vos correspondances**",
              "Exécution du contrat",
              "24 mois",
            ],
            [
              "Détection des messages-type d'escroquerie",
              "**Sécurité : détecter des contenus non sollicités et des tentatives de fraude**",
              "Intérêt légitime",
              "24 mois",
            ],
            [
              "Décompte des mises en relation d'un vendeur professionnel",
              "**Déterminer le prix de son abonnement et lui permettre de le vérifier**",
              "Exécution du contrat professionnel",
              "24 mois (détail pseudonymisé)",
            ],
            [
              "Vérification du numéro de téléphone par code SMS",
              "Fiabilité du décompte et lutte contre la fraude",
              "Intérêt légitime",
              "24 mois (empreinte)",
            ],
            [
              "Alertes sur recherche sauvegardée",
              "Vous envoyer les annonces que vous avez demandé à suivre",
              "Exécution d'un service que vous avez demandé",
              "Mise en pause à 90 jours sans clic, critères effacés à 120 jours",
            ],
            [
              "Facturation, mandat SEPA, recouvrement",
              "Obligation comptable",
              "Obligation légale",
              "10 ans",
            ],
            [
              "Mesure d'audience du site",
              "Compter les visites, pour notre seul compte",
              "Exemption de consentement (voir la page [traceurs](/cookies))",
              "13 mois (traceur), 25 mois (données brutes)",
            ],
            [
              "Conservation des données d'identification des contributeurs",
              "Répondre à une réquisition judiciaire",
              "Obligation légale",
              "1 an après la contribution",
            ],
          ],
        },
        {
          type: "encadre",
          titre: "Ce que nous ne faisons pas",
          texte:
            "Nous ne vendons aucune donnée. Nous n'affichons aucune publicité de tiers. Nous ne construisons **aucun profil publicitaire**. Nous ne suivons pas votre navigation d'un site à l'autre. Aucune décision produisant des effets juridiques à votre égard — retrait d'annonce, suspension de compte — n'est prise **par un traitement entièrement automatisé** : une personne décide, et vous pouvez la contester (voir les [conditions générales d'utilisation](/cgu)).",
        },
      ],
    },
    {
      titre: "3. Le décompte des mises en relation, dit en clair",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "C'est le seul traitement de ce document dont la finalité n'est pas celle que vous avez en tête en l'utilisant, et il mérite donc d'être expliqué plutôt que rangé dans un tableau.",
        },
        {
          type: "paragraphe",
          texte:
            "Quand vous contactez un vendeur **professionnel**, nous enregistrons **qu'un contact a eu lieu**, à quelle date et sur quelle annonce. Ce décompte sert à calculer la facture de ce professionnel, selon la règle décrite dans les [conditions générales de vente professionnelles](/cgv-pro) : il ne paie jamais plus de 30 € par contact reçu. **Vos interactions servent donc à établir le prix payé par un tiers**, et il est normal que vous le sachiez avant d'appeler, non après.",
        },
        {
          type: "liste",
          items: [
            "Nous n'enregistrons **aucune conversation téléphonique**.",
            "Votre numéro n'est pas conservé en clair dans ce décompte : il y figure sous forme d'**empreinte**, qui permet de reconnaître deux appels du même numéro sans permettre de le lire.",
            "Le vendeur voit **le nombre** de contacts et l'annonce concernée, pas une analyse de votre comportement.",
            "Ce décompte n'entre dans **aucun classement** et ne produit **aucun indicateur public** sur un vendeur.",
          ],
        },
      ],
    },
    {
      titre: "4. Correspondances : quelle finalité, quel régime",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "L'article L. 32-3 du code des postes et des communications électroniques protège le secret de vos correspondances en ligne — **leur contenu, mais aussi l'identité des correspondants**. Il autorise expressément certains traitements (III) et en interdit d'autres sauf consentement exprès renouvelé chaque année (IV). Ce qui range un traitement dans l'un ou dans l'autre est **sa finalité**. Voici donc la nôtre, traitement par traitement.",
        },
        {
          type: "tableau",
          entetes: ["Ce que nous faisons", "Pour quelle finalité", "Régime"],
          lignes: [
            [
              "Afficher vos messages, les trier par fil, les acheminer au destinataire, vous en notifier",
              "Affichage, tri et acheminement des correspondances",
              "**III de l'article L. 32-3** — expressément autorisé",
            ],
            [
              "Détecter les messages-type d'escroquerie et les envois en masse",
              "**Détection de contenus non sollicités**, sécurité des utilisateurs",
              "**III de l'article L. 32-3** — expressément autorisé",
            ],
            [
              "Compter les mises en relation d'un vendeur professionnel",
              "Exécution du contrat qui nous lie à ce professionnel : déterminer le prix",
              "Hors du III et hors du IV — fondé sur l'exécution du contrat, aucune divulgation à un tiers autre que le correspondant lui-même",
            ],
            [
              "Publier un taux de réponse d'un vendeur, calculé sur ses échanges",
              "Sans objet",
              "**Nous ne le faisons pas.** Une telle publication relèverait du IV (amélioration du service) et supposerait un consentement exprès annuel",
            ],
            [
              "Faire entrer les messages ou les appels dans le classement des annonces",
              "Sans objet",
              "**Nous ne le faisons pas.** Voir la page [comment les annonces sont classées](/classement)",
            ],
            [
              "Produire des statistiques à partir de l'identité des correspondants",
              "Sans objet",
              "**Nous ne le faisons pas.** Nos indicateurs de pilotage sont calculés sur des totaux mensuels agrégés, jamais sur le journal des échanges",
            ],
          ],
        },
        {
          type: "encadre",
          titre: "Pourquoi cette table figure ici",
          texte:
            "Parce que sur ce point précis, **la finalité écrite est ce qui détermine le régime applicable**, et non la donnée touchée. Trois des six lignes ci-dessus disent ce que nous ne faisons pas : ce sont des engagements, et leur violation serait constatable dans notre code autant que dans ce texte.",
        },
      ],
    },
    {
      titre: "5. Combien de temps, et ce que « supprimer » veut dire",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Nos données passent par trois étages, et les mélanger serait vous induire en erreur.",
        },
        {
          type: "liste",
          items: [
            "**Base active** — la donnée sert au quotidien, elle est lisible par le service et par notre support. Les durées figurent dans le tableau de la section 2.",
            "**Archivage intermédiaire** — la donnée ne sert plus qu'en cas de litige ou d'obligation légale. Elle est déplacée dans un espace séparé, à accès nominatif et journalisé, hors d'atteinte de l'application. C'est là que vivent la prescription de 5 ans et l'année imposée par le décret n° 2021-1362.",
            "**Suppression ou anonymisation** — au terme de l'archivage. Une empreinte réversible avec une clé n'est **pas** une donnée anonyme, et nous ne la présentons pas comme telle.",
          ],
        },
        {
          type: "encadre",
          titre: "Supprimer votre compte ne supprime pas tout, et voici quoi",
          texte:
            "Quand vous supprimez votre compte, nous supprimons votre profil, vos annonces et votre visibilité publique **immédiatement**. Mais le décret n° 2021-1362 du 20 octobre 2021 nous impose de conserver **un an** les données permettant d'identifier l'auteur d'un contenu mis en ligne — adresse électronique, adresse IP et horodatage du dépôt — y compris après la clôture de votre compte. Ces données passent en archivage : elles ne sont plus accessibles au service, et ne peuvent être consultées que sur réquisition. Nous préférons vous le dire que vous affirmer un effacement total qui n'en serait pas un.",
        },
      ],
    },
    {
      titre: "6. Qui d'autre y accède",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Nous faisons appel à des sous-traitants, liés par un contrat conforme à l'article 28 du RGPD. Aucun n'a le droit d'utiliser vos données pour son propre compte.",
        },
        {
          type: "tableau",
          entetes: ["Sous-traitant", "Pour quoi", "Localisation"],
          lignes: [
            [
              "Hébergeur applicatif, base de données et stockage des photos",
              "Faire fonctionner le service",
              "Voir le tableau des [mentions légales](/mentions-legales)",
            ],
            [
              "Scaleway (Transactional Email)",
              "Envoi des e-mails du service",
              "France",
            ],
            [
              "Prestataire de paiement",
              "Encaissement des abonnements et des options payantes",
              "[[à figer : localisation du traitement des paiements]]",
            ],
            [
              "Fournisseur du modèle d'analyse d'images",
              "Détecter les contenus interdits sur les photos déposées",
              "**Hors Union européenne** — voir ci-dessous",
            ],
            [
              "Prestataire de téléphonie (numéros de mise en relation)",
              "Mettre en relation sans divulguer votre numéro",
              "[[à figer : prestataire de téléphonie retenu et localisation]]",
            ],
          ],
        },
        {
          type: "paragraphe",
          texte:
            "**Le seul transfert hors Union européenne** est celui des images soumises à l'analyse automatique de modération. Il est encadré par les clauses contractuelles types de la Commission européenne et par le cadre de protection des données UE–États-Unis. Les images transmises sont les **variantes déjà floutées** (plaques d'immatriculation et visages), jamais les originales, et elles ne sont pas conservées par le sous-traitant pour son propre compte.",
        },
        {
          type: "paragraphe",
          texte:
            "Nous communiquons également des données aux **autorités judiciaires et administratives** lorsqu'une réquisition régulière nous y oblige, et aux **autorités compétentes** lorsque nous soupçonnons une infraction menaçant la vie ou la sécurité des personnes.",
        },
      ],
    },
    {
      titre: "7. Vos droits",
      blocs: [
        {
          type: "liste",
          items: [
            "**Accès** à vos données et **copie** de celles-ci ;",
            "**Rectification** d'une donnée inexacte ;",
            "**Effacement**, dans les limites décrites à la section 5 ;",
            "**Limitation** du traitement et **opposition**, notamment à tout traitement fondé sur notre intérêt légitime ;",
            "**Portabilité** de vos annonces et de vos données de compte, dans un format réutilisable ;",
            "**Retrait de votre consentement** à tout moment lorsqu'un traitement en repose sur un ;",
            "**Directives** relatives au sort de vos données après votre décès.",
          ],
        },
        {
          type: "paragraphe",
          texte:
            "Écrivez à [[à figer : adresse électronique dédiée à la protection des données]]. Nous répondons dans un délai d'un mois. Vous pouvez à tout moment introduire une réclamation auprès de la **CNIL** (3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 — [www.cnil.fr](https://www.cnil.fr)).",
        },
      ],
    },
    {
      titre: "8. Sécurité et modifications",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Les mots de passe sont stockés sous forme de condensats calculés avec une fonction lente ; les accès aux données de production sont nominatifs. Les coordonnées GPS contenues dans vos photos sont **retirées avant publication**, et les plaques d'immatriculation et visages sont floutés automatiquement.",
        },
        {
          type: "paragraphe",
          texte:
            "Toute modification de cette page est publiée avec sa date et son numéro de version, et les versions précédentes restent consultables. Une modification qui étendrait la finalité d'un traitement existant vous serait notifiée, et non simplement mise en ligne.",
        },
      ],
    },
  ],
};
