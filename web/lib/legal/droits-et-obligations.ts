import type { DocumentLegal } from "./types";

/**
 * Droits et obligations des vendeurs et des acheteurs — la page que l'action
 * §17 n°212 ne listait pas, et qui est pourtant la seule du lot dont
 * l'obligation ne connaît **aucun seuil de taille** (§8.1, Résultat n°6).
 *
 * Elle satisfait trois obligations d'un seul texte, comme le §8.1
 * (Résultat n°2) l'avait prévu :
 *
 *  - **art. L. 111-7, 3° du code de la consommation** : la qualité de
 *    l'annonceur (professionnel ou non) **et les droits et obligations des
 *    parties en matière civile et fiscale** ;
 *  - **art. 242 bis du CGI**, dont le volet déclaratif a été remplacé par
 *    DPI-DAC7 mais dont le volet **information des utilisateurs survit**, et
 *    dont le critère — mettre en relation en vue de la vente d'un bien — est
 *    rempli par LBT par définition ;
 *  - **décret n° 78-993 du 4 octobre 1978**, qui prescrit le contenu de la
 *    dénomination de vente d'un véhicule d'occasion **y compris en publicité**.
 *
 * Le repère d'exécution justifie à lui seul la page : enquête DGCCRF de
 * janvier 2021 à mars 2022 sur environ 2 200 établissements de vente de
 * véhicules — **64 % en anomalie**, plus de 1 600 avertissements, 1 500
 * injonctions, 320 procès-verbaux pénaux, et une attention particulière portée
 * aux annonces publiées en ligne (§8.1, Résultat n°7).
 */
export const DROITS_ET_OBLIGATIONS: DocumentLegal = {
  id: "droits-et-obligations",
  chemin: "/droits-et-obligations",
  titre: "Vendeur professionnel ou particulier : vos droits et vos obligations",
  sousTitre:
    "Ce que change la qualité du vendeur pour l'acheteur, ce que la loi impose au vendeur, et ce que le fisc attend de chacun.",
  version: "1.0",
  date: "2026-09-03",
  fondement: [
    "Code de la consommation, art. L. 111-7, 3° ; décret n° 2017-1434 du 29 septembre 2017",
    "Code général des impôts, art. 242 bis (volet information)",
    "Décret n° 78-993 du 4 octobre 1978",
  ],
  piedDePage: true,
  sections: [
    {
      titre: "1. Chaque annonce indique si le vendeur est un professionnel",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Sur LeBonTruc, particuliers et professionnels apparaissent dans les **mêmes listes de résultats**, et la mention **« Pro »** figure sur l'annonce comme sur la page du vendeur. Ce n'est pas une facilité d'affichage : la loi impose d'indiquer la qualité de l'annonceur, parce qu'elle change vos droits du tout au tout.",
        },
        {
          type: "tableau",
          entetes: ["Vous achetez à…", "Garantie légale de conformité", "Vices cachés", "Droit de rétractation"],
          lignes: [
            [
              "un **professionnel**",
              "**Oui** — 2 ans à compter de la délivrance, à sa charge",
              "Oui",
              "**Non** pour un achat sur place ; oui, 14 jours, pour une vente conclue entièrement à distance",
            ],
            [
              "un **particulier**",
              "**Non** — cette garantie n'existe pas entre particuliers",
              "Oui, mais la preuve vous incombe et une clause d'exclusion est valable entre particuliers",
              "**Non**, jamais",
            ],
          ],
        },
        {
          type: "encadre",
          titre: "Se faire passer pour un particulier est une pratique commerciale trompeuse",
          texte:
            "Un professionnel qui se présente comme un particulier prive l'acheteur de la garantie légale, du droit de rétractation et de son recours. C'est interdit par le code de la consommation, et c'est l'une des pratiques que la répression des fraudes recherche en priorité dans les annonces de véhicules. **Nous recherchons activement ces comptes** (nombre d'annonces simultanées, rotation du stock, réutilisation d'un même numéro, récurrence des lieux de prise de vue) et nous retirons leurs annonces jusqu'à régularisation.",
        },
      ],
    },
    {
      titre: "2. Ce que la loi impose à toute annonce de véhicule d'occasion",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Le décret n° 78-993 du 4 octobre 1978 régit la **publicité** autant que le bon de commande. Il s'applique donc à votre annonce, que vous soyez professionnel **ou particulier**. Notre formulaire de dépôt est construit pour que vous ne puissiez pas l'oublier.",
        },
        {
          type: "liste",
          items: [
            "La **marque**, le **type**, le **modèle**, la **version** et, le cas échéant, la variante ;",
            "le **mois et l'année** de première mise en circulation — le mois, pas seulement l'année ;",
            "le **kilométrage total parcouru**, suivi de la mention **« non garanti »** si vous ne pouvez pas le justifier ;",
            "le **prix de vente toutes taxes comprises** effectivement demandé.",
          ],
        },
        {
          type: "paragraphe",
          texte:
            "Est interdite toute présentation de nature à créer une confusion sur la nature du véhicule, sa marque, son type, son origine, **le mois et l'année de première mise en circulation** ou **le kilométrage**. Tout vendeur, professionnel ou non, doit en outre remettre à l'acheteur un document écrit reprenant ces indications.",
        },
        {
          type: "paragraphe",
          texte:
            "Trois documents restent à la charge du vendeur et ne transitent pas par LeBonTruc : le **certificat de situation administrative** de moins de 15 jours, le **procès-verbal de contrôle technique** de moins de 6 mois pour un véhicule de plus de 4 ans, et le **certificat de cession**.",
        },
      ],
    },
    {
      titre: "3. Vos obligations fiscales et sociales",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "L'article 242 bis du code général des impôts impose à un site de mise en relation d'informer ses utilisateurs de leurs obligations fiscales et sociales. Voici cette information. **LeBonTruc ne connaît ni le montant, ni la réalité de vos ventes** — il n'encaisse rien et n'observe aucune transaction : nous ne vous adressons donc aucun récapitulatif annuel, et nous ne déclarons vos ventes à personne.",
        },
        {
          type: "liste",
          items: [
            "**Vous vendez un bien personnel d'occasion** (votre voiture, un meuble, un vêtement) : la cession n'est en principe pas imposable. Les métaux précieux, bijoux et objets d'art ou de collection suivent des régimes propres.",
            "**Vous vendez de façon répétée des biens achetés pour être revendus** : l'activité peut être requalifiée en activité professionnelle, avec les conséquences fiscales et sociales correspondantes — quel que soit le statut affiché sur votre annonce.",
            "**Vous êtes un professionnel** : vos obligations habituelles s'appliquent intégralement (TVA, y compris le régime de la marge propre au négoce de véhicules d'occasion, déclarations, comptabilité).",
          ],
        },
        {
          type: "paragraphe",
          texte:
            "Les sites de référence sont [impots.gouv.fr](https://www.impots.gouv.fr) et [urssaf.fr](https://www.urssaf.fr). Ce paragraphe est une information générale et ne remplace pas un conseil adapté à votre situation.",
        },
      ],
    },
    {
      titre: "4. Conseils d'achat et de vente",
      blocs: [
        {
          type: "liste",
          items: [
            "**Ne versez jamais d'acompte à distance** avant d'avoir vu le véhicule et vérifié l'identité du vendeur.",
            "Défiez-vous d'un prix très inférieur au marché, d'un vendeur pressé, d'un paiement demandé par virement à l'étranger ou par un service de transport « sécurisé ».",
            "Le rapport **HistoVec**, gratuit et fourni par l'État, permet au vendeur de vous transmettre l'historique administratif du véhicule. Un vendeur qui refuse de le fournir mérite une question.",
            "Signalez toute annonce suspecte : le bouton figure sur chaque annonce et la procédure est décrite dans les [conditions générales d'utilisation](/cgu).",
          ],
        },
      ],
    },
  ],
};
