import type { DocumentLegal } from "./types";

/**
 * Traceurs — et le point le plus contre-intuitif du lot livré le 2026-09-03.
 *
 * L'action §17 n°212 énumérait « les quatre pages légales … et bandeau
 * traceurs ». **Le bandeau ne doit pas être construit** : le §8.3
 * (Résultat n°5) a tranché le 2026-08-08 pour une mesure d'audience
 * **exemptée de consentement** au sens de la délibération CNIL n° 2020-091
 * (Matomo auto-hébergé, IP tronquée, aucun croisement, aucun tiers), et en a
 * tiré « aucun bandeau de consentement au MVP » — décision de conformité qui
 * est aussi la meilleure décision de conversion gratuite du dossier.
 *
 * **Mais l'exemption elle-même impose deux choses**, et c'est ce que l'action
 * n°212 avait inversé : l'information des visiteurs **et** un mécanisme
 * d'opposition accessible. Autrement dit, l'exemption supprime le bandeau et
 * rend cette page-ci obligatoire. Elle n'est donc pas la cinquième page d'une
 * liste de quatre : elle est la contrepartie de la décision du §8.3.
 */
export const COOKIES: DocumentLegal = {
  id: "cookies",
  chemin: "/cookies",
  titre: "Traceurs et mesure d'audience",
  sousTitre:
    "Pourquoi LeBonTruc n'affiche pas de bandeau cookies, ce qu'il dépose malgré tout, et comment vous y opposer.",
  version: "1.0",
  date: "2026-09-03",
  fondement: [
    "Loi n° 78-17 du 6 janvier 1978, art. 82",
    "Délibération CNIL n° 2020-091 du 17 septembre 2020 (exemption des outils de mesure d'audience)",
  ],
  piedDePage: true,
  sections: [
    {
      titre: "1. Pourquoi il n'y a pas de bandeau",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Un bandeau de consentement est obligatoire dès qu'un site dépose ou lit sur votre terminal quelque chose qui n'est **pas strictement nécessaire** au service que vous avez demandé. Le critère n'est pas la publicité : un site qui n'affiche aucune bannière mais installe un outil de mesure non exempté est en infraction.",
        },
        {
          type: "paragraphe",
          texte:
            "**Nous avons choisi de rester du bon côté de ce critère plutôt que de vous demander l'autorisation.** LeBonTruc n'affiche aucune publicité de tiers, n'utilise aucune régie, ne dépose aucun traceur publicitaire et ne suit votre navigation sur aucun autre site. Il n'y a donc rien à vous faire accepter, et pas de bandeau à cliquer avant de voir une annonce.",
        },
      ],
    },
    {
      titre: "2. Ce qui est déposé sur votre terminal",
      blocs: [
        {
          type: "tableau",
          entetes: ["Traceur", "À quoi il sert", "Durée", "Consentement"],
          lignes: [
            [
              "Cookie de session",
              "Vous garder connecté d'une page à l'autre",
              "Durée de la session, ou la durée que vous avez choisie en cochant « rester connecté »",
              "Strictement nécessaire — exempté",
            ],
            [
              "Préférences d'affichage",
              "Retenir votre tri, vos filtres et votre mode d'affichage",
              "12 mois",
              "Strictement nécessaire — exempté",
            ],
            [
              "Protection contre les abus",
              "Limiter les envois automatisés de formulaires",
              "Session",
              "Strictement nécessaire — exempté",
            ],
            [
              "Mesure d'audience",
              "Compter les visites et les pages vues, pour notre seul compte",
              "Traceur 13 mois, données brutes 25 mois",
              "**Exempté** au titre de la délibération CNIL n° 2020-091",
            ],
            [
              "Historique de navigation d'un visiteur non connecté",
              "Vous remontrer les annonces vues **pendant la visite en cours**",
              "Effacé à la fermeture de l'onglet",
              "Strictement nécessaire — exempté",
            ],
          ],
        },
        {
          type: "encadre",
          titre: "État au 2026-09-03",
          texte:
            "Le service n'est pas encore ouvert au public et **aucun outil de mesure d'audience n'y est installé à ce jour**. Ce tableau décrit ce qui sera déposé à l'ouverture ; il sera mis à jour, avec sa date et sa version, le jour où l'outil sera effectivement en service.",
        },
      ],
    },
    {
      titre: "3. Les conditions que nous respectons pour nous en tenir à l'exemption",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "L'exemption n'est pas un statut, c'est une liste de conditions cumulatives. Perdre une seule d'entre elles ferait revenir l'obligation de consentement — et le bandeau avec elle.",
        },
        {
          type: "liste",
          items: [
            "La mesure d'audience sert **uniquement à produire des statistiques anonymes pour notre propre compte**.",
            "L'outil est **hébergé par nos soins** ; les données ne sont transmises à aucun tiers.",
            "Votre **adresse IP est tronquée** avant tout enregistrement.",
            "Les données de mesure ne sont **croisées avec aucun autre traitement**, ni avec votre compte, ni avec vos annonces, ni avec vos recherches.",
            "Le traceur vit au plus **13 mois** et n'est pas prolongé automatiquement ; les données brutes sont conservées au plus **25 mois**.",
            "Aucun **suivi d'un site à l'autre**, y compris vers un site partenaire ou un site frère.",
          ],
        },
      ],
    },
    {
      titre: "4. Vous y opposer",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "L'exemption impose de vous laisser un moyen simple de refuser la mesure d'audience. Vous pouvez : [[à figer : lien du mécanisme d'opposition à la mesure d'audience, à brancher en même temps que l'outil]]. Refuser ne dégrade en rien le service : aucune fonctionnalité de LeBonTruc n'en dépend.",
        },
        {
          type: "paragraphe",
          texte:
            "Vous pouvez également configurer votre navigateur pour bloquer ou effacer les cookies. Attention : bloquer le cookie de session vous empêchera de rester connecté et donc de déposer une annonce ou d'écrire à un vendeur.",
        },
      ],
    },
    {
      titre: "5. Ce que nous faisons à la place de la publicité ciblée",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Beaucoup de sites d'annonces personnalisent leur page d'accueil en croisant des traceurs publicitaires avec votre historique de navigation. Nous procédons autrement, et la différence est nette :",
        },
        {
          type: "liste",
          items: [
            "**Si vous êtes connecté**, les annonces vues récemment et les suggestions sont calculées à partir de votre activité sur votre compte, côté serveur, dans le cadre du service que vous avez demandé — sans traceur publicitaire.",
            "**Si vous n'êtes pas connecté**, la mémoire s'arrête à la visite en cours : nous ne reconstituons pas votre historique d'une visite à l'autre.",
          ],
        },
        {
          type: "paragraphe",
          texte:
            "Le détail des traitements correspondants figure dans la [politique de confidentialité](/confidentialite).",
        },
      ],
    },
  ],
};
