import type { DocumentLegal } from "./types";

/**
 * Mentions légales — LCEN (art. 6-III), **article 48 de la loi SREN
 * n° 2024-449 du 21 mai 2024** (§8.1, Résultat n°10) et points de contact du
 * DSA (art. 11 et 12, §8.1 Résultat n°3).
 *
 * Le point qui n'est pas de la routine : depuis la loi SREN, il ne suffit plus
 * de nommer son hébergeur, il faut nommer **les prestataires qui stockent les
 * données des utilisateurs**. La liste ci-dessous est celle du dépôt au
 * 2026-09-03 (`lib/storage/`, `lib/db/client.ts`, `lib/email/`, `lib/stripe.ts`)
 * et non une liste souhaitée : Typesense Cloud, cité au §8.1 comme prestataire
 * à mentionner, n'y figure pas parce que la recherche est servie par
 * PostgreSQL depuis la §14.7 et que Typesense n'est déployé nulle part.
 */
export const MENTIONS_LEGALES: DocumentLegal = {
  id: "mentions-legales",
  chemin: "/mentions-legales",
  titre: "Mentions légales",
  sousTitre:
    "Qui édite LeBonTruc, qui l'héberge, qui stocke les données, et à qui écrire.",
  version: "1.0",
  date: "2026-09-03",
  fondement: [
    "Loi n° 2004-575 du 21 juin 2004 (LCEN), art. 6-III",
    "Loi n° 2024-449 du 21 mai 2024 (SREN), art. 48",
    "Règlement (UE) 2022/2065 (DSA), art. 11 et 12",
  ],
  piedDePage: true,
  sections: [
    {
      titre: "Éditeur du service",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Le site **lebontruc.fr** est édité par **Courlis**, société par actions simplifiée unipersonnelle (SASU) au capital de [[à figer : montant du capital social]], immatriculée au registre du commerce et des sociétés de [[à figer : ville du greffe]] sous le numéro [[à figer : numéro SIREN]], dont le siège social est situé [[à figer : adresse complète du siège]].",
        },
        {
          type: "liste",
          items: [
            "**Numéro de TVA intracommunautaire** : [[à figer : numéro de TVA]]",
            "**Président et directeur de la publication** : Nicolas Therond",
            "**Adresse électronique de contact** : [[à figer : adresse de contact générale]]",
            "**Téléphone** : [[à figer : numéro de téléphone]]",
          ],
        },
        {
          type: "paragraphe",
          texte:
            "LeBonTruc est un **service de mise en relation**. Il n'encaisse aucun paiement entre acheteurs et vendeurs, n'enregistre aucune commande, n'organise aucune livraison et n'est partie à aucune vente conclue entre ses utilisateurs. Ce choix est décrit en détail dans les [conditions générales d'utilisation](/cgu).",
        },
      ],
    },
    {
      titre: "Hébergement et stockage des données",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "L'article 48 de la loi n° 2024-449 du 21 mai 2024 impose de nommer, outre l'hébergeur, **les personnes qui assurent le stockage des données traitées** dans le cadre de l'édition du service. Voici la liste complète, tenue à jour à chaque changement d'infrastructure.",
        },
        {
          type: "tableau",
          entetes: ["Rôle", "Prestataire", "Localisation des données"],
          lignes: [
            [
              "Hébergement de l'application",
              "[[à figer : raison sociale et adresse de l'hébergeur applicatif]]",
              "[[à figer : région d'hébergement]]",
            ],
            [
              "Base de données",
              "[[à figer : raison sociale et adresse du fournisseur de base de données]]",
              "[[à figer : région de la base]]",
            ],
            [
              "Stockage des photos d'annonces",
              "[[à figer : raison sociale et adresse du fournisseur de stockage objet]]",
              "[[à figer : région du stockage objet]]",
            ],
            [
              "Envoi des e-mails du service",
              "Scaleway SAS, BP 438, 75366 Paris Cedex 08, France",
              "France (région fr-par)",
            ],
            [
              "Paiement des options payantes",
              "[[à figer : entité Stripe contractante et son adresse]]",
              "[[à figer : localisation du traitement des paiements]]",
            ],
          ],
        },
        {
          type: "encadre",
          titre: "Pourquoi ce tableau est incomplet aujourd'hui",
          texte:
            "Les mentions **à figer** ne sont pas des oublis de rédaction : le service n'est pas encore déployé en production et les contrats correspondants ne sont pas signés. Ce document ne peut pas être publié à l'ouverture du service tant qu'elles subsistent — la page [informations légales](/legal) en affiche le compte exact.",
        },
      ],
    },
    {
      titre: "Points de contact",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Le règlement (UE) 2022/2065 impose deux points de contact distincts, et ils ne peuvent pas être confondus.",
        },
        {
          type: "liste",
          items: [
            "**Point de contact pour les autorités** (art. 11) — autorités des États membres, Commission européenne et comité européen des services numériques : [[à figer : adresse électronique dédiée aux autorités]]. Langue de communication acceptée : le français et l'anglais.",
            "**Point de contact pour les utilisateurs** (art. 12) — toute personne qui utilise le service : [[à figer : adresse électronique du support]]. Cette voie **n'est pas un robot conversationnel** : une personne de l'équipe y répond, et l'assistant automatique décrit dans les [conditions générales d'utilisation](/cgu) ne peut pas s'y substituer.",
            "**Signalement d'un contenu illicite** (art. 16) : le formulaire de signalement est accessible depuis chaque annonce, et sa procédure est décrite dans les [conditions générales d'utilisation](/cgu).",
          ],
        },
      ],
    },
    {
      titre: "Propriété intellectuelle",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "La structure du site, ses textes, sa charte graphique et ses développements sont la propriété de la société Courlis. Les photographies et les textes des annonces restent la propriété de leurs auteurs, qui concèdent à LeBonTruc, par la publication de leur annonce, le droit de les reproduire et de les afficher **pour les besoins du service et pour la durée de l'annonce**, y compris sous forme de vignettes redimensionnées et de variantes floutées (plaques d'immatriculation, visages).",
        },
      ],
    },
    {
      titre: "Médiation de la consommation",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Conformément aux articles L. 611-1 et suivants du code de la consommation, un consommateur peut recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d'un litige l'opposant à LeBonTruc. Le médiateur désigné est [[à figer : nom et coordonnées du médiateur de la consommation, adhésion à souscrire]].",
        },
      ],
    },
  ],
};
