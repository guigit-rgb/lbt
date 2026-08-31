/**
 * Lot quotidien d'alertes sur recherche sauvegardée (§6.4, §14.11).
 *
 *   ./node_modules/.bin/tsx scripts/envoyer-alertes.ts            (simulation)
 *   ./node_modules/.bin/tsx scripts/envoyer-alertes.ts --envoyer  (envoi réel)
 *
 * SIMULATION PAR DÉFAUT, comme le rattrapage de la §14.9 : la première
 * exécution en production enverra un lot dont personne n'a jamais vu la
 * taille, et un lot d'alertes raté ne se rattrape pas (une plainte pour
 * courrier indésirable est définitive). La simulation calcule tout, n'envoie
 * rien et ne déplace aucun filigrane.
 *
 * Exige `DATABASE_URL` — donc inexécutable en session automatisée, comme tous
 * les scripts qui touchent la base. Destiné à une tâche périodique (une fois
 * par jour) une fois l'expéditeur configuré ; c'est le point d'accroche que
 * reprendra le *worker* de l'action n°115.
 */
import { envoyerLotAlertes } from "@/lib/alertes";

const envoyer = process.argv.includes("--envoyer");

async function principal(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL absent — ce script lit et écrit en base.");
    process.exit(1);
  }

  console.log(envoyer ? "Mode ENVOI RÉEL." : "Mode simulation (ajouter --envoyer pour envoyer).");
  const debut = Date.now();
  const resultat = await envoyerLotAlertes({ simulation: !envoyer });

  console.log(`
  Alertes examinées ............ ${resultat.alertesExaminees}
  Alertes avec du nouveau ...... ${resultat.alertesAvecResultat}
  E-mails ${envoyer ? "envoyés" : "qui seraient envoyés"} ......${envoyer ? "..." : ""} ${resultat.emailsEnvoyes}
  E-mails en échec ............. ${resultat.emailsEchoues}
  Annonces signalées ........... ${resultat.annoncesSignalees}
  Durée ........................ ${((Date.now() - debut) / 1000).toFixed(1)} s`);

  if (resultat.emailsEchoues > 0) process.exit(1);
}

void principal();
