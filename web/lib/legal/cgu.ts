import type { DocumentLegal } from "./types";

/**
 * Conditions générales d'utilisation — le document que l'article 14 du DSA
 * rend obligatoire, et dont la §7.2 (politique de modération) est la matière.
 *
 * Deux règles de rédaction héritées du cahier des charges, et aucune n'est
 * cosmétique :
 *
 *  1. **§8.1, Résultat n°3, correction n°1** — la procédure de réclamation
 *     de l'article 20 du DSA ne s'applique pas à LBT (art. 19, dispense des
 *     micro et petites entreprises). Elle est offerte quand même, mais elle
 *     doit être écrite comme un **engagement volontaire**, jamais comme une
 *     conformité réglementaire : s'obliger plus qu'on ne le doit sans en tirer
 *     l'argument serait la pire des deux options.
 *  2. **§8.6, Résultat n°1** — le libellé de l'information sur l'assistant
 *     automatisé (art. 50 du règlement (UE) 2024/1689) est arrêté au mot près
 *     et « ne doit pas être paraphrasé ». Il est repris ici tel quel, et le
 *     contrôle `scripts/verif-pages-legales.ts` vérifie qu'il l'est resté.
 */
export const CGU: DocumentLegal = {
  id: "cgu",
  chemin: "/cgu",
  titre: "Conditions générales d'utilisation",
  sousTitre:
    "Ce que LeBonTruc fait, ce qu'il ne fait pas, comment les annonces sont contrôlées et comment contester une décision.",
  version: "1.0",
  date: "2026-09-03",
  fondement: [
    "Règlement (UE) 2022/2065 (DSA), art. 6, 8, 14, 16, 17 et 18",
    "Règlement (UE) 2024/1689 (IA), art. 50",
    "Code de la consommation, art. L. 111-7",
  ],
  piedDePage: true,
  sections: [
    {
      titre: "1. Ce qu'est LeBonTruc, et ce qu'il n'est pas",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "LeBonTruc est un service de **petites annonces**. Nous publions les annonces que vous déposez et nous mettons en relation acheteurs et vendeurs. Nous ne sommes **pas** partie aux ventes : nous n'encaissons aucun paiement, ne prenons aucune commande, n'organisons aucune livraison, ne vérifions pas l'état des biens et ne garantissons ni leur existence ni leur conformité.",
        },
        {
          type: "paragraphe",
          texte:
            "Cette position n'est pas une précaution de rédaction, c'est le modèle du service : la vente se conclut entre vous, hors de LeBonTruc. Les conséquences vous concernent directement — elles sont décrites sur la page [droits et obligations des vendeurs et des acheteurs](/droits-et-obligations).",
        },
        {
          type: "paragraphe",
          texte:
            "Au sens du règlement (UE) 2022/2065, LeBonTruc est un **service d'hébergement** et une **plateforme en ligne**. À ce titre, nous ne sommes pas responsables des contenus que vous déposez, à condition d'agir promptement pour les retirer dès que nous avons connaissance de leur caractère illicite. Nous n'exerçons **aucune surveillance générale** des annonces : la loi ne l'impose pas et nous ne le faisons pas.",
        },
      ],
    },
    {
      titre: "2. Compte, dépôt et règles de publication",
      blocs: [
        {
          type: "liste",
          items: [
            "Le dépôt d'une annonce suppose un compte et une adresse électronique confirmée.",
            "Vous garantissez être en droit de vendre le bien proposé et que votre annonce est exacte. Une annonce doit décrire **un seul** bien réellement disponible.",
            "Un vendeur qui agit à titre professionnel doit se déclarer comme tel. Se présenter comme un particulier alors que l'on vend à titre professionnel est **interdit par la loi** et entraîne le retrait des annonces (voir la page [droits et obligations](/droits-et-obligations)).",
            "Pour un véhicule, le formulaire impose le **mois et l'année** de première mise en circulation, le kilométrage — accompagné de la mention **« non garanti »** lorsqu'il ne peut être justifié — et le **prix toutes taxes comprises effectivement demandé**. Ces exigences viennent du décret n° 78-993 du 4 octobre 1978 ; elles s'imposent au vendeur, et notre formulaire est construit pour qu'il ne puisse pas les oublier.",
            "Sont notamment interdits : les biens dont la vente est illégale, les contrefaçons, les véhicules dont vous n'êtes pas propriétaire, les annonces trompeuses sur le prix, l'état, le kilométrage ou l'origine du bien, les coordonnées placées dans les photos, les annonces déposées en série pour occuper les résultats, et l'usage du service pour une autre finalité que la vente ou le don du bien décrit.",
          ],
        },
      ],
    },
    {
      titre: "3. Comment les annonces sont contrôlées",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "L'article 14 du règlement (UE) 2022/2065 impose de décrire **les politiques, procédures, mesures et outils utilisés aux fins de la modération, y compris la prise de décision fondée sur des algorithmes et le réexamen par un être humain**. Voici cette description.",
        },
        {
          type: "paragraphe",
          texte:
            "**Le principe est la publication.** Une annonce déposée est publiée, puis contrôlée. Nous ne retenons avant publication que les annonces qui déclenchent un signal grave, et nous nous imposons de ne pas dépasser **2 % des dépôts** retenus de cette façon. La raison est mesurable : sur les plateformes qui publient leurs chiffres, environ **la moitié des retraits contestés sont infirmés en appel** — la sur-modération est un risque au moins aussi sérieux que la sous-modération, et elle frappe des vendeurs de bonne foi.",
        },
        {
          type: "tableau",
          entetes: ["Ce que nous contrôlons", "Comment", "Dans quel délai"],
          lignes: [
            [
              "Annonces retenant un signal grave (véhicule déclaré volé, faux document, image manifestement interdite, photo déjà publiée à l'identique par un autre compte)",
              "Détection automatique, puis **décision prise par une personne**, toujours",
              "Moins de 4 heures ouvrées, la moitié en moins d'une heure",
            ],
            [
              "Signalements reçus d'utilisateurs ou d'autorités",
              "**Examen humain systématique**",
              "Moins de 24 heures ; moins de 4 heures pour une injonction d'autorité",
            ],
            [
              "Annonces publiées portant un signal intermédiaire (prix très inférieur à la cote, coordonnées dans une photo, texte partiellement recopié)",
              "Détection automatique, revue humaine par ordre de priorité",
              "Sans délai garanti — cette file s'ajuste aux moyens disponibles",
            ],
            [
              "Contrôle de qualité par tirage aléatoire d'annonces publiées automatiquement",
              "Examen humain",
              "Chaque semaine",
            ],
            [
              "Floutage des plaques d'immatriculation et des visages, retrait des coordonnées GPS des photos",
              "**Traitement automatique appliqué à toutes les photos**",
              "À la publication",
            ],
          ],
        },
        {
          type: "encadre",
          titre: "Aucune décision défavorable n'est prise par une machine seule",
          texte:
            "Les outils automatiques **trient et priorisent** ; ils ne décident pas. Tout retrait, toute restriction et toute suspension est décidée par une personne de l'équipe, qui en assume la motivation. Le floutage des plaques et des visages est la seule intervention entièrement automatique, et ce n'est pas une décision de modération : votre annonce reste publiée, aucune sanction n'y est attachée, et l'image d'origine reste la vôtre.",
        },
      ],
    },
    {
      titre: "4. Signaler un contenu",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Toute personne peut signaler une annonce qu'elle estime illicite, depuis le bouton présent sur chaque annonce ou en écrivant à [[à figer : adresse électronique de signalement]]. Pour être exploitable, un signalement doit comporter : l'adresse de l'annonce, le motif, vos nom et adresse électronique, et une déclaration de bonne foi.",
        },
        {
          type: "liste",
          items: [
            "Vous recevez un **accusé de réception** sans retard indu.",
            "Vous recevez la **décision motivée** prise à la suite de votre signalement, ainsi que les voies de recours ouvertes contre elle.",
            "Les signalements sont traités **de manière diligente, non arbitraire et objective**.",
            "Les signalements manifestement infondés et répétés peuvent conduire à la suspension du traitement de vos signalements, après avertissement.",
          ],
        },
        {
          type: "paragraphe",
          texte:
            "Lorsque nous soupçonnons une infraction pénale **menaçant la vie ou la sécurité des personnes**, nous en informons les autorités compétentes, conformément à l'article 18 du règlement (UE) 2022/2065. Les tentatives d'escroquerie, qui n'entrent pas dans ce champ, sont orientées vers les dispositifs de signalement de la police et de la gendarmerie.",
        },
      ],
    },
    {
      titre: "5. Ce qui vous est dit quand une décision vous concerne",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Toute décision de retrait, de restriction ou de suspension vous est notifiée avec, conformément à l'article 17 du règlement (UE) 2022/2065 :",
        },
        {
          type: "liste",
          items: [
            "les **faits et circonstances** sur lesquels elle repose ;",
            "si elle fait suite à un **signalement** ou à un contrôle de notre initiative ;",
            "si des **moyens automatisés** ont été utilisés pour la détecter ou pour la prendre ;",
            "la **clause de ces conditions générales ou la disposition légale** invoquée ;",
            "les **voies de recours** ouvertes, y compris la voie judiciaire.",
          ],
        },
        {
          type: "paragraphe",
          texte:
            "Les décisions et leurs motifs sont conservés **douze mois**, afin que vous puissiez les contester utilement et que nous puissions justifier de notre pratique.",
        },
      ],
    },
    {
      titre: "6. Sanctions, et comment les contester",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Les sanctions sont graduées, et l'avertissement préalable est la règle : **premier manquement** — avertissement motivé ; **deuxième** — suspension du dépôt pendant 7 jours ; **troisième** — suspension du compte. Un contenu manifestement illicite (véhicule volé, faux papiers) entraîne une suspension immédiate, sans gradation.",
        },
        {
          type: "encadre",
          titre: "Une réclamation que nous offrons, et que la loi ne nous impose pas",
          texte:
            "Le système interne de réclamation de l'article 20 du règlement (UE) 2022/2065 ne s'applique pas aux petites entreprises, et LeBonTruc en est une. **Nous l'ouvrons quand même**, gratuitement, pendant **six mois** après la décision : votre contestation est réexaminée par une personne différente de celle qui a décidé. Nous le faisons parce qu'un taux d'infirmation élevé est le seul signal fiable qu'un seuil de détection est mal réglé — la réclamation nous sert autant qu'elle vous sert. Cet engagement est **volontaire** ; il deviendra une obligation légale si LeBonTruc dépasse la taille d'une petite entreprise.",
        },
      ],
    },
    {
      titre: "7. Intelligence artificielle",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Nous utilisons des outils automatiques pour analyser les photos et les textes d'annonces, pour flouter les plaques et les visages, et pour vous aider à rédiger. Quand vous échangez avec notre assistance, le premier message est celui-ci, et il n'est pas paraphrasé :",
        },
        {
          type: "encadre",
          titre: "Message affiché dès la première interaction avec l'assistance",
          texte:
            "« Vous échangez avec l'assistant automatique de LBT — une intelligence artificielle. Il peut se tromper. À tout moment, écrivez **« un humain »** : votre demande sera transmise à une personne de l'équipe. »",
        },
        {
          type: "liste",
          items: [
            "Écrire **« un humain »** en toutes lettres suffit à sortir de l'assistant : ce n'est pas seulement un bouton.",
            "L'aide à la rédaction d'annonce **part de vos données déclarées** et ne les invente pas. Le texte proposé vous est soumis : il n'est publié qu'après votre validation, et il reste votre annonce.",
            "Nous ne proposons **aucun outil de retouche des photos**. Une photo déclarant avoir été générée ou retouchée par une intelligence artificielle est signalée à notre modération.",
          ],
        },
      ],
    },
    {
      titre: "8. Modification de ces conditions",
      blocs: [
        {
          type: "paragraphe",
          texte:
            "Toute modification de ce document est publiée avec sa **date et son numéro de version**, et les versions précédentes restent consultables. Les vendeurs professionnels sont prévenus **au moins 30 jours à l'avance** de toute modification les concernant, dans les conditions décrites par les [conditions générales de vente professionnelles](/cgv-pro).",
        },
        {
          type: "paragraphe",
          texte:
            "Le droit applicable est le droit français. Les modalités de classement des annonces sont décrites dans une page dédiée : [comment les annonces sont classées](/classement). Le traitement de vos données personnelles est décrit dans la [politique de confidentialité](/confidentialite).",
        },
      ],
    },
  ],
};
