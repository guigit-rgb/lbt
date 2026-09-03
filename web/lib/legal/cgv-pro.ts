import type { DocumentLegal } from "./types";

/**
 * Conditions générales de vente professionnelles — le dossier P2B
 * (règlement (UE) 2019/1150), articles 3, 4, 5, 7 et 9, identifiés au §8.1
 * (Résultat n°5) comme « le régime que le document avait entièrement manqué ».
 *
 * Deux choix de rédaction sont hérités et ne doivent pas être « simplifiés » :
 *
 *  1. **Préavis de 30 jours partout**, alors que l'article 3 du P2B n'en exige
 *     que 15 pour une modification des conditions générales. Le §5.3 avait
 *     déjà retenu 30 jours pour la définition du contact qualifié, et le §8.2
 *     (Résultat n°5, remarques au relecteur) tranche : « une seule règle de
 *     préavis pour toutes les annexes contractuelles vaut mieux que deux, et
 *     la plus protectrice est celle qui se défend ».
 *  2. **La finalité du comptage des contacts est écrite comme l'exécution du
 *     contrat, jamais comme une statistique ni comme une amélioration du
 *     service** (§8.8, Résultats n°2 et n°4). Ce n'est pas une nuance de style :
 *     c'est ce qui range le traitement hors du IV de l'article L. 32-3 du CPCE.
 */
export const CGV_PRO: DocumentLegal = {
  id: "cgv-pro",
  chemin: "/cgv-pro",
  titre: "Conditions générales de vente professionnelles",
  sousTitre:
    "Le contrat des vendeurs professionnels : paliers, prix, comptage des contacts, suspension, résiliation et accès aux données.",
  version: "1.0",
  date: "2026-09-03",
  fondement: [
    "Règlement (UE) 2019/1150 (P2B), art. 3, 4, 5, 7 et 9",
    "Code de commerce, pratiques restrictives de concurrence (loi n° 2020-1508 du 3 décembre 2020)",
  ],
  piedDePage: true,
  sections: [
    {
      titre: "1. Qui est concerné",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Ces conditions s'appliquent à tout **vendeur professionnel** utilisant LeBonTruc, qu'il soit abonné ou non. Le palier **Découverte** est gratuit : il n'en dispense pas. Un vendeur professionnel doit être identifié comme tel indépendamment de tout paiement, et cette obligation ne se négocie pas.",
        },
        {
          type: "paragraphe",
          texte:
            "Ces conditions complètent les [conditions générales d'utilisation](/cgu), qui s'appliquent à tous. En cas de contradiction sur un point professionnel, le présent document prévaut.",
        },
      ],
    },
    {
      titre: "2. Paliers et prix",
      blocs: [
        {
          type: "tableau",
          entetes: [
            "Palier",
            "Véhicules en ligne",
            "Prix HT / mois",
            "Remontées en tête incluses / mois",
            "Seuil de plein tarif (contacts)",
          ],
          lignes: [
            ["Découverte", "jusqu'à 3", "0 €", "—", "—"],
            ["Garage", "4 à 15", "79 €", "2", "3"],
            ["Garage+", "16 à 30", "149 €", "5", "5"],
            ["Concession", "31 à 60", "249 €", "12", "9"],
            ["Groupe", "61 à 120", "399 €", "25", "15"],
            ["Au-delà de 120", "sur devis", "sur devis", "proportionnel", "proportionnel"],
          ],
        },
        {
          type: "liste",
          items: [
            "**Sans engagement de durée, résiliable au mois.** Aucune période minimale de 12 mois.",
            "**Tout inclus** : les options de visibilité sont comprises dans le quota mensuel du palier. Aucune option de visibilité n'est vendue à l'unité à un professionnel.",
            "**Prépaiement annuel : deux mois offerts.**",
            "Prélèvement SEPA par défaut, carte bancaire en repli.",
          ],
        },
      ],
    },
    {
      titre: "3. La règle de prix : jamais plus de 30 € le contact",
      blocs: [
        {
          type: "encadre",
          titre: "La formule, et elle est la seule",
          texte:
            "**Facture du mois = le plus petit des deux montants suivants : le prix de votre palier, ou 30 € HT multipliés par le nombre de contacts qualifiés du mois.** Un mois à deux contacts sur un palier à 149 € est facturé 60 €.",
        },
        {
          type: "paragraphe",
          texte:
            "Ce n'est pas une garantie de résultat assortie d'un geste commercial : c'est **le prix lui-même**. Il n'y a donc ni avoir, ni réclamation à déposer, ni mois « offert » : le montant facturé est calculé chaque mois à partir du décompte des contacts.",
        },
        {
          type: "paragraphe",
          texte:
            "**Ce qu'est un contact qualifié** est défini dans l'annexe « Contact qualifié », qui fait partie du contrat, et qui énumère limitativement les interactions comptées et celles qui sont exclues (doublons, messages-type, contacts émis par le vendeur lui-même ou par ses proches). [[à figer : publication de l'annexe « Contact qualifié v1.0 » et de son lien]]",
        },
        {
          type: "paragraphe",
          texte:
            "**Pourquoi nous comptons ces contacts, et pour quoi nous ne les utilisons pas.** Le comptage a une seule finalité : **déterminer le prix de votre abonnement et vous permettre de le vérifier**. C'est l'exécution du présent contrat, et rien d'autre. Ces données **ne servent ni à établir des statistiques, ni à améliorer le service, ni à classer les annonces** : le classement décrit à la page [comment les annonces sont classées](/classement) n'en tient aucun compte, et aucun taux de réponse calculé à partir d'elles n'est publié.",
        },
        {
          type: "paragraphe",
          texte:
            "**La charge de la preuve du comptage pèse sur nous.** Le détail des contacts d'un mois est consultable dans votre tableau de bord, ligne par ligne, pendant toute la période où il peut être contesté. Une contestation portant sur le décompte suspend le recouvrement de la fraction contestée jusqu'à sa réponse.",
        },
      ],
    },
    {
      titre: "4. Classement des annonces",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Les principaux paramètres qui déterminent le classement de vos annonces, les raisons de leur importance relative et l'effet exact de toute somme versée à LeBonTruc sont décrits à la page [comment les annonces sont classées](/classement), **qui fait partie intégrante du présent contrat**. Deux points en sont rappelés ici parce qu'ils touchent directement votre facture :",
        },
        {
          type: "liste",
          items: [
            "**Le montant de votre abonnement n'a aucun effet sur le classement de vos annonces.** Un palier plus cher donne plus de véhicules en ligne et plus de remontées incluses ; il n'achète aucun rang.",
            "**Un même vendeur n'occupe jamais plus de 2 emplacements sur une page de liste triée par fraîcheur.** Si vous poussez 50 véhicules par flux le même matin, vous en verrez 2 en tête de page — les autres restent accessibles par la recherche et par votre page vendeur. Cette règle protège les petits garages ; elle vous est opposable comme elle l'est à vos concurrents.",
          ],
        },
      ],
    },
    {
      titre: "5. Traitement différencié",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "L'article 7 du règlement (UE) 2019/1150 impose de décrire tout traitement plus favorable réservé par la plateforme à ses propres offres ou à certains professionnels. **LeBonTruc ne publie aucune annonce pour son propre compte et n'accorde aucun avantage de classement, de visibilité ou de tarif à un professionnel en raison d'un lien capitalistique ou contractuel avec lui.** [[à figer : confirmation, avant l'ouverture, qu'aucune société liée au dirigeant ne déposera d'annonce]]",
        },
      ],
    },
    {
      titre: "6. Accès à vos données",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "L'article 9 du même règlement impose de décrire les données auxquelles vous avez accès. Vous disposez, dans votre tableau de bord et pendant toute la durée du contrat :",
        },
        {
          type: "liste",
          items: [
            "du **détail des contacts qualifiés** de chaque mois, avec la date et l'annonce concernée ;",
            "du nombre d'affichages et de consultations de chacune de vos annonces ;",
            "des **composantes du score de popularité** de chacune de vos annonces ;",
            "de l'historique de vos factures et de vos remontées en tête utilisées ;",
            "de l'**export de vos annonces** dans un format réutilisable, y compris après résiliation, pendant 30 jours.",
          ],
        },
      ],
    },
    {
      titre: "7. Restriction, suspension, résiliation",
      blocs: [
        {
          type: "liste",
          items: [
            "**Motifs de restriction ou de suspension** : manquement aux [conditions générales d'utilisation](/cgu) après avertissement, dépôt de contenus manifestement illicites, fraude au comptage des contacts, défaut de paiement après relance, ou fausse déclaration sur la qualité de professionnel.",
            "**Toute décision vous est motivée par écrit avant de prendre effet**, sauf contenu manifestement illicite, où la suspension est immédiate et la motivation transmise sans délai.",
            "**Résiliation à votre initiative** : à tout moment, effective à la fin du mois en cours, sans frais ni justification.",
            "**Résiliation à l'initiative de LeBonTruc** : **préavis de 30 jours**, motivé, sauf manquement grave ou illicéité manifeste.",
            "Vos annonces restent exportables pendant 30 jours après la fin du contrat.",
          ],
        },
      ],
    },
    {
      titre: "8. Modification du contrat",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Toute modification du présent document, de la page [comment les annonces sont classées](/classement) ou de l'annexe « Contact qualifié » vous est notifiée **au moins 30 jours avant son entrée en vigueur**, sur un support durable. Le règlement (UE) 2019/1150 n'impose que 15 jours ; nous retenons 30 jours pour toutes nos annexes contractuelles, sans exception. Pendant ce préavis, vous pouvez résilier sans frais.",
        },
        {
          type: "paragraphe",
          texte:
            "Les versions antérieures restent consultables, avec leur date d'application. Toute modification affectant le calcul du prix ou le classement fait l'objet d'une notification distincte, et non d'une simple mise à jour de page.",
        },
      ],
    },
    {
      titre: "9. Facturation, litiges et droit applicable",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Les factures sont émises mensuellement à terme échu, une fois le décompte des contacts arrêté. Les prix sont exprimés hors taxes. Le droit applicable est le droit français. À défaut d'accord amiable, le litige relève des tribunaux compétents de [[à figer : ressort du tribunal compétent]].",
        },
        {
          type: "paragraphe",
          texte:
            "LeBonTruc étant une petite entreprise au sens du règlement (UE) 2019/1150, il n'est tenu ni de mettre en place un système interne de traitement des plaintes (art. 11), ni de désigner des médiateurs dans ses conditions générales (art. 12). Les réclamations relatives au classement et au comptage des contacts sont néanmoins traitées dans les conditions décrites aux articles 3 et 4 ci-dessus.",
        },
      ],
    },
  ],
};
