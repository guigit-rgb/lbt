/**
 * Écrit les quatre e-mails du dépôt dans des fichiers HTML, pour les ouvrir
 * dans un navigateur — `./node_modules/.bin/tsx scripts/apercu-email.ts [dossier]`
 * (dossier par défaut : `.apercu-email/`, ignoré par git).
 *
 * POURQUOI CE SCRIPT EXISTE, alors que `verif-email.ts` contrôle déjà tout ce
 * qui se contrôle par programme : parce qu'un e-mail est un document RENDU, et
 * qu'aucune assertion ne voit ce qu'un lecteur voit. La §14.10 (Résultat n°7)
 * l'a appris à ses dépens sur l'en-tête du site — un bouton qui recouvrait un
 * lien depuis des semaines, invisible pour tous les contrôles SQL du dépôt et
 * trouvé en trente secondes en pilotant un vrai navigateur. Le même principe
 * vaut ici, en pire : personne ne relit un e-mail transactionnel après sa mise
 * en service.
 *
 * N'envoie rien, ne lit pas la base, ne prend aucune clé d'API.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { rendre, type Message } from "@/lib/email/gabarit";
import {
  alerteRecherche,
  motDePasseOublie,
  nouveauMessage,
  verificationAdresse,
} from "@/lib/email/messages";

process.env.EMAIL_DOMAINE ??= "lebontruc.fr";

const EXEMPLES: [string, Message][] = [
  [
    "1-mot-de-passe-oublie",
    motDePasseOublie({ lien: "https://lebontruc.fr/compte/reinitialiser?jeton=demo", validiteMinutes: 30 }),
  ],
  [
    "2-nouveau-message",
    nouveauMessage({
      nomExpediteur: "Camille D.",
      titreAnnonce: "Renault Clio IV 1.5 dCi 90 ch — 2016, 118 000 km",
      extrait:
        "Bonjour, votre Clio est-elle toujours disponible ? Je peux passer la voir samedi matin si cela vous convient. Avez-vous le carnet d'entretien ?",
      lien: "https://lebontruc.fr/compte/messages/demo",
      premierContact: true,
    }),
  ],
  [
    "3-alerte-recherche",
    alerteRecherche({
      libelleRecherche: "clio essence · Bordeaux",
      dateEnregistrement: "12/03/2026",
      annonces: [
        { titre: "Renault Clio IV 1.2 16v 75 ch", prix: "7 900 €", lieu: "Bordeaux", href: "https://lebontruc.fr/annonces/1" },
        { titre: "Renault Clio III 1.2 TCe", prix: "4 250 €", lieu: "Mérignac", href: "https://lebontruc.fr/annonces/2" },
        { titre: "Renault Clio V TCe 100", prix: "13 990 €", lieu: "Pessac", href: "https://lebontruc.fr/annonces/3" },
      ],
      lienRecherche: "https://lebontruc.fr/vehicules?marque=RENAULT&modele=Clio",
      lienDesabonnement: "https://lebontruc.fr/api/alertes/desabonnement?id=demo&s=demo",
    }),
  ],
  [
    "4-verification-adresse",
    verificationAdresse({ lien: "https://lebontruc.fr/compte/verifier?jeton=demo", validiteHeures: 48 }),
  ],
];

const dossier = process.argv[2] ?? ".apercu-email";
mkdirSync(dossier, { recursive: true });

for (const [nom, message] of EXEMPLES) {
  const rendu = rendre(message);
  writeFileSync(join(dossier, `${nom}.html`), rendu.html, "utf-8");
  writeFileSync(join(dossier, `${nom}.txt`), `Objet : ${rendu.sujet}\n\n${rendu.texte}\n`, "utf-8");
  console.log(`  ${nom.padEnd(24)} ${rendu.html.length} octets HTML, ${rendu.texte.length} car. texte`);
}

console.log(`\nÉcrit dans ${dossier}/ — ouvrir les .html dans un navigateur, lire les .txt tels quels.`);
