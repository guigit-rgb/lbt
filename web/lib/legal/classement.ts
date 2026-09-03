import type { DocumentLegal } from "./types";

/**
 * Comment les annonces sont classées — transcription du texte v1.0 rédigé au
 * §8.2 (Résultat n°5), livrable de l'article 5 du règlement (UE) 2019/1150
 * (P2B) et de l'article L. 111-7 du code de la consommation.
 *
 * **Trois passages du texte du 2026-08-05 ne sont PAS repris tels quels, et
 * c'est le résultat principal de la session du 2026-09-03 (§8.9).** Le §8.2
 * décrivait la popularité comme reposant notamment sur « le nombre de contacts
 * qu'une annonce a réellement générés » et en tirait la phrase « un vendeur
 * professionnel qui ne répond pas à ses acheteurs voit donc ses annonces
 * descendre ». Le §8.8 (Résultat n°4), écrit le 2026-09-01, range précisément
 * ces deux traitements — composante « contacts » de `score_popularite` et
 * miroir public du taux de réponse — dans le **IV de l'article L. 32-3 du
 * CPCE** : traitement de l'identité des correspondants à des fins
 * d'« amélioration du service apporté à l'utilisateur », interdit sans
 * consentement exprès renouvelé chaque année (décret n° 2017-428).
 *
 * Or le §8.8 (Résultat n°2) établit que **la finalité écrite est le fait
 * générateur du régime**, et le §8.8 (Résultat n°6) que la sanction de
 * référence est pénale (art. 226-15 du code pénal) et que son élément
 * intentionnel — « de mauvaise foi » — se combat par une finalité déclarée
 * cohérente avec le code. Publier la phrase du §8.2 dans un document
 * contractuel reviendrait donc à **déclarer par écrit le traitement que le IV
 * interdit**, dans la pièce même qui devait servir de défense. La description
 * ci-dessous décrit la popularité sans sa composante « contacts » — ce qui
 * est aussi ce que demande l'action §17 n°250.
 */
export const CLASSEMENT: DocumentLegal = {
  id: "classement",
  chemin: "/classement",
  titre: "Comment les annonces sont classées",
  sousTitre:
    "Ce qui décide de l'ordre des annonces, ce que la mise en avant change, et ce qu'aucun paiement ne peut acheter.",
  version: "1.0",
  date: "2026-09-03",
  fondement: [
    "Règlement (UE) 2019/1150 (P2B), art. 5",
    "Code de la consommation, art. L. 111-7 ; décret n° 2017-1434 du 29 septembre 2017",
  ],
  piedDePage: true,
  sections: [
    {
      titre: "1. Le principe, en trois phrases",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "L'ordre des annonces dépend de ce que vous cherchez, et de rien d'autre : de la fraîcheur quand vous parcourez une catégorie, de la correspondance avec vos mots quand vous faites une recherche, de la distance quand vous cherchez autour de chez vous.",
        },
        {
          type: "paragraphe",
          texte:
            "**Aucune somme versée à LeBonTruc ne modifie l'ordre des annonces dans la liste de résultats.** Les annonces mises en avant par un vendeur ne sont pas classées avec les autres : elles sont **insérées à des emplacements fixes, en nombre limité, et signalées par la mention « Sponsorisé »**.",
        },
        {
          type: "paragraphe",
          texte:
            "Le montant de l'abonnement d'un professionnel n'a aucun effet sur le classement de ses annonces.",
        },
      ],
    },
    {
      titre: "2. Ce qui décide de l'ordre, selon la situation",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "**a) Vous parcourez une catégorie ou une page de ville, sans avoir tapé de recherche.** Les annonces sont classées **de la plus récente à la plus ancienne**, d'après leur date de mise en avant. Deux précisions qui comptent :",
        },
        {
          type: "liste",
          items: [
            "Modifier une annonce (baisser un prix, ajouter une photo) **ne la remet pas en tête**. Seule une première publication, ou une remontée en tête utilisée par le vendeur, met à jour cette date.",
            "Un même vendeur n'occupe **jamais plus de 2 emplacements** sur une même page de ce type. Ses autres annonces restent accessibles depuis sa page vendeur et par la recherche. Cette règle existe pour qu'un professionnel qui met en ligne 50 véhicules le même matin ne remplisse pas la page à lui seul.",
          ],
        },
        {
          type: "paragraphe",
          texte:
            "**b) Vous avez tapé une recherche.** Les annonces sont d'abord classées **par correspondance avec les mots que vous avez saisis**. La correspondance est appréciée par groupes : à l'intérieur d'un groupe d'annonces qui correspondent aussi bien, c'est la **popularité** qui départage, puis la **fraîcheur**.",
        },
        {
          type: "liste",
          items: [
            "Un mot trouvé dans le **titre** compte davantage qu'un mot trouvé dans la **version** du véhicule, qui compte davantage que dans la **description**, qui compte davantage que dans le **nom du vendeur**. Nous procédons ainsi parce qu'un titre est descriptif et concis, tandis qu'une description peut répéter un modèle sans que l'annonce le concerne.",
            "Répéter un mot dans la description **ne fait pas monter** une annonce.",
            "La **popularité** d'une annonce se calcule à partir du nombre de fois où elle a été affichée dans les résultats et consultée, du nombre de photos, du remplissage de la fiche et de sa fraîcheur. Elle départage la pertinence parce qu'entre deux annonces qui correspondent également à votre recherche, celle que les acheteurs consultent est, en moyenne, la mieux renseignée et la plus disponible. **Elle ne tient compte ni des messages échangés, ni des appels, ni du fait qu'un vendeur réponde ou non.** Chaque professionnel peut consulter dans son tableau de bord le détail de ce qui compose ce score pour chacune de ses annonces.",
          ],
        },
        {
          type: "paragraphe",
          texte:
            "**c) Vous cherchez dans un rayon autour d'une ville.** Les annonces sont classées **par distance**, mais par paliers : **tout ce qui se trouve à moins de 30 km est considéré comme également proche**, et c'est alors le **prix croissant** qui départage, puis la fraîcheur. Un vendeur à 4 km n'a aucun avantage sur un vendeur à 22 km. Si vous avez tapé une recherche **et** choisi un rayon, c'est la correspondance avec vos mots qui l'emporte, la distance servant alors uniquement à écarter ce qui est hors du rayon.",
        },
      ],
    },
    {
      titre: "3. Ce que la mise en avant change — et ce qu'elle ne change pas",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Un vendeur peut faire **remonter une annonce en tête** pendant 48 heures. Les professionnels disposent chaque mois d'un nombre de remontées inclus dans leur abonnement ; les particuliers peuvent en acheter à l'unité.",
        },
        {
          type: "paragraphe",
          texte:
            "**Ce que cela change :** l'annonce est éligible aux emplacements réservés aux annonces sponsorisées. Entre plusieurs annonces sponsorisées éligibles, la plus récemment remontée passe devant, et l'avantage décroît sur les 48 heures. **Ce que cela ne change pas :** le classement de toutes les autres annonces, y compris celles du même vendeur. Une remontée n'écarte aucune annonce organique de la page ; elle occupe un emplacement supplémentaire, signalé.",
        },
        {
          type: "encadre",
          titre: "Les limites que nous nous imposons, et que vous pouvez vérifier",
          texte:
            "**au plus 1 annonce sponsorisée dans les 5 premiers résultats** ; **au plus 20 % des résultats d'une page** ; **la mention « Sponsorisé » sur chacune**, toujours ; **des emplacements fixes** — une annonce sponsorisée ne déplace jamais une annonce organique d'une page à l'autre.",
        },
        {
          type: "paragraphe",
          texte:
            "Nous nous imposons ces limites parce que notre modèle nous y oblige : nos abonnements professionnels sont facturés en fonction des contacts réellement apportés (voir les [conditions générales de vente professionnelles](/cgv-pro)). Dégrader vos résultats pour vendre de la visibilité réduirait le nombre de contacts, donc nos propres recettes.",
        },
        {
          type: "paragraphe",
          texte:
            "**Les paliers d'abonnement Concession et Groupe donnent droit à une « vitrine »** : la boutique du vendeur peut apparaître dans un bandeau intitulé « Des professionnels près de chez vous », distinct de la liste de résultats et signalé comme tel. Ce bandeau ne modifie pas l'ordre des annonces et n'occupe aucun de leurs emplacements.",
        },
        {
          type: "paragraphe",
          texte:
            "**Nous ne vendons pas de position sur une recherche donnée.** Il n'est pas possible, sur LeBonTruc, d'acheter la première place sur « Clio 5 diesel Nantes » ni sur aucune autre requête.",
        },
      ],
    },
    {
      titre: "4. Ce qui n'entre dans aucun classement",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Pour lever toute ambiguïté, les éléments suivants **n'ont aucun effet** sur l'ordre des annonces : le montant de l'abonnement du vendeur ; son ancienneté sur LeBonTruc ; le fait qu'il soit professionnel ou particulier ; le nombre de véhicules qu'il met en ligne ; le fait qu'il utilise ou non un logiciel de multidiffusion ; **les messages, appels et demandes de contact reçus par une annonce** ; et toute relation commerciale entre LeBonTruc et un tiers.",
        },
        {
          type: "paragraphe",
          texte:
            "**LeBonTruc ne publie pas ses propres annonces et n'applique aucun traitement plus favorable à une annonce en raison d'un lien capitalistique ou contractuel.** [[à figer : confirmation que LeBonTruc ne publiera aucune annonce pour son propre compte ni pour celui d'une société liée — à trancher avant l'ouverture]]",
        },
      ],
    },
    {
      titre: "5. Une recherche peut ne donner aucun résultat, et c'est volontaire",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Si vous cherchez « clio 3 diesel » et qu'aucune annonce ne correspond aux trois critères, nous affichons **zéro résultat** et vous proposons d'élargir la recherche — plutôt que de vous montrer des Clio essence sans vous le dire. Nous corrigeons les fautes de frappe sur les mots, **mais jamais sur les chiffres et les références** : « 308 » ne devient pas « 208 », « A3 » ne devient pas « A4 ».",
        },
      ],
    },
    {
      titre: "6. Ce que nous ne publions pas",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Nous ne publions ni le code, ni les pondérations numériques exactes, ni le détail des règles de détection des annonces frauduleuses et des tentatives de manipulation du classement. Le règlement (UE) 2019/1150 ne l'exige pas, et publier ces éléments permettrait de les contourner au détriment des acheteurs. Tout ce qui influence l'ordre de manière significative est en revanche décrit ci-dessus.",
        },
      ],
    },
    {
      titre: "7. Modifications",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Toute modification de cette page est publiée avec sa date et son numéro de version, et les versions précédentes restent consultables. **Les vendeurs professionnels sont prévenus au moins 30 jours à l'avance** de toute modification affectant le classement de leurs annonces.",
        },
      ],
    },
    {
      titre: "8. Si vous n'êtes pas d'accord",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Un vendeur professionnel qui estime que le classement de ses annonces ne correspond pas à cette description peut nous écrire à [[à figer : adresse électronique de réclamation classement]]. Nous répondons sous [[à figer : délai de réponse en jours ouvrés]], en indiquant les éléments mesurés sur ses annonces. Les données d'affichage, de consultation et de complétude qui composent le score de popularité sont consultables à tout moment dans son tableau de bord.",
        },
      ],
    },
  ],
};
