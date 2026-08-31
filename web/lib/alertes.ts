/**
 * Lot d'alertes sur recherche sauvegardée (cahier des charges §6.4, §14.11
 * message n°3 ; action §17 n°211).
 *
 * CE QUE CE MODULE EST, ET SURTOUT CE QU'IL N'EST PAS. La §6.4 chiffre le lot
 * complet des alertes à ≈ 16 j-h : digest quotidien, double opt-in, pause par
 * engagement à 60/90/120 jours, filigrane par annonce (`alerte_annonce_envoyee`),
 * plafonds par compte, web push, tableau de bord de délivrabilité par flux.
 * L'action n°211 n'en demande qu'une chose : **câbler l'envoi**. Ce module
 * fait donc l'appariement en lot et rien d'autre, avec deux garde-fous du §6.4
 * qui coûtent une ligne chacun et qu'il aurait été absurde de différer (le
 * plafond de 10 annonces par message, et le fait de ne jamais écrire à une
 * adresse non confirmée).
 *
 * LE FILIGRANE EST UNE DATE, PAS UNE TABLE. La §6.4 prévoit
 * `alerte_annonce_envoyee` pour garantir qu'une annonce n'est jamais envoyée
 * deux fois à la même alerte. Ici, le filigrane est `dernier_envoi_a` et la
 * garantie est plus faible : une annonce republiée, ou dont la `created_at`
 * serait réécrite, peut repasser. C'est assumé pour le pilote — et c'est écrit
 * dans les limites de la §14.11 plutôt que caché.
 */

import { and, count, desc, eq, gt, isNotNull } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { annonces, recherchesSauvegardees, users, type Categorie } from "@/lib/db/schema";
import { buildAnnonceConditions } from "@/lib/annonce-filters";
import { getFiltersForCategory } from "@/lib/listing-config";
import { envoyerEmail } from "@/lib/email/envoi";
import { lienAbsolu } from "@/lib/email/lien";
import { ALERTE_MAX_ANNONCES, alerteRecherche, type AnnonceAlerte } from "@/lib/email/messages";
import { signerDesabonnement } from "@/lib/jetons-email";

/** Ne jamais dépasser ce que le §6.4 (R6) autorise par compte et par jour. */
export const ALERTES_MAX_PAR_COMPTE_ET_PAR_JOUR = 3;

export interface ResultatLot {
  alertesExaminees: number;
  alertesAvecResultat: number;
  emailsEnvoyes: number;
  emailsEchoues: number;
  annoncesSignalees: number;
}

function formaterPrix(prixCents: number | null): string | null {
  if (prixCents == null) return null;
  return `${Math.round(prixCents / 100).toLocaleString("fr-FR")} €`;
}

function formaterDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function libelleCourt(categorie: Categorie, filtres: Record<string, string>): string {
  // Volontairement plus court que `libelleFiltres()` de `lib/recherches.ts` :
  // celui-ci va dans un OBJET d'e-mail et dans la ligne de motif, où trente
  // caractères de plus font la différence entre une phrase lisible et une
  // ligne tronquée par le client de messagerie.
  const morceaux: string[] = [];
  if (filtres.q) morceaux.push(filtres.q);
  if (filtres.marque) morceaux.push(filtres.marque.split(",").join("/"));
  if (filtres.modele) morceaux.push(filtres.modele.split(",").join("/"));
  if (filtres.localisation) morceaux.push(filtres.localisation);
  if (morceaux.length === 0) morceaux.push(getFiltersForCategory(categorie).label);
  return morceaux.join(" · ");
}

/**
 * Prépare et envoie le lot. `simulation = true` : tout est calculé, rien n'est
 * envoyé et aucun filigrane n'est déplacé — c'est le mode qui permet de
 * regarder ce que le premier lot ferait avant de le faire, comme le rattrapage
 * de la §14.9 (`scripts/backfill-marque-modele.ts`).
 */
export async function envoyerLotAlertes(options: { simulation: boolean }): Promise<ResultatLot> {
  const resultat: ResultatLot = {
    alertesExaminees: 0,
    alertesAvecResultat: 0,
    emailsEnvoyes: 0,
    emailsEchoues: 0,
    annoncesSignalees: 0,
  };

  const lignes = await db
    .select({
      id: recherchesSauvegardees.id,
      categorie: recherchesSauvegardees.categorie,
      filtres: recherchesSauvegardees.filtres,
      tri: recherchesSauvegardees.tri,
      createdAt: recherchesSauvegardees.createdAt,
      dernierEnvoiA: recherchesSauvegardees.dernierEnvoiA,
      email: users.email,
      nom: users.displayName,
    })
    .from(recherchesSauvegardees)
    .innerJoin(users, eq(users.id, recherchesSauvegardees.userId))
    .where(
      and(
        eq(recherchesSauvegardees.alerteActive, true),
        // Le §6.4 (R7, obligation n°1) : jamais d'alerte vers une adresse dont
        // rien ne prouve qu'elle appartient à l'inscrit. Une adresse non
        // confirmée qui reçoit une alerte, c'est un signalement pour courrier
        // indésirable gratuit contre notre propre domaine d'envoi.
        isNotNull(users.emailVerifieA)
      )
    );

  // Plafond par compte et par jour (§6.4 R6). Compté sur ce lot seul : un lot
  // par jour est le régime prévu, donc le compte du lot est le compte du jour.
  const envoyesParCompte = new Map<string, number>();

  for (const ligne of lignes) {
    resultat.alertesExaminees++;

    const filtres = (ligne.filtres ?? {}) as Record<string, string>;
    const filigrane = ligne.dernierEnvoiA ?? ligne.createdAt;

    const conditions = buildAnnonceConditions(ligne.categorie, filtres);
    const trouvees = await db
      .select({
        id: annonces.id,
        titre: annonces.titre,
        prixCents: annonces.prixCents,
        ville: annonces.ville,
      })
      .from(annonces)
      .innerJoin(users, eq(annonces.userId, users.id))
      .where(and(...conditions, gt(annonces.createdAt, filigrane)))
      // Ordre publié dans l'e-mail lui-même et au document de la §8.2 :
      // date de publication décroissante, aucun boost, aucun score de
      // popularité (§6.4 R7 point 3). Ne pas remplacer par `buildAnnonceOrderBy`,
      // qui applique le tri choisi par l'utilisateur pour l'affichage — un
      // e-mail n'est pas une page, et son classement est un engagement écrit.
      .orderBy(desc(annonces.createdAt))
      .limit(ALERTE_MAX_ANNONCES + 1);

    if (trouvees.length === 0) continue;

    resultat.alertesAvecResultat++;
    resultat.annoncesSignalees += Math.min(trouvees.length, ALERTE_MAX_ANNONCES);

    const dejaEnvoyes = envoyesParCompte.get(ligne.email) ?? 0;
    if (dejaEnvoyes >= ALERTES_MAX_PAR_COMPTE_ET_PAR_JOUR) {
      // Le §6.4 prévoit de REGROUPER les alertes excédentaires dans un seul
      // message ; ce module se contente de ne pas envoyer et de laisser le
      // filigrane en place, si bien que rien n'est perdu : les annonces
      // repartiront au prochain lot. Le regroupement est du lot §6.4 T1.
      continue;
    }

    const params = new URLSearchParams(filtres);
    const liste: AnnonceAlerte[] = trouvees.map((a) => ({
      titre: a.titre,
      prix: formaterPrix(a.prixCents),
      lieu: a.ville,
      href: lienAbsolu(`/annonces/${a.id}`),
    }));

    const message = alerteRecherche({
      libelleRecherche: libelleCourt(ligne.categorie, filtres),
      dateEnregistrement: formaterDate(ligne.createdAt),
      annonces: liste,
      lienRecherche: lienAbsolu(`/${ligne.categorie}${params.toString() ? `?${params}` : ""}`),
      lienDesabonnement: lienAbsolu(
        `/api/alertes/desabonnement?id=${ligne.id}&s=${signerDesabonnement(ligne.id)}`
      ),
    });

    if (options.simulation) {
      resultat.emailsEnvoyes++;
      envoyesParCompte.set(ligne.email, dejaEnvoyes + 1);
      continue;
    }

    const envoi = await envoyerEmail({
      destinataire: ligne.email,
      nomDestinataire: ligne.nom,
      message,
    });

    if (envoi.envoye) {
      resultat.emailsEnvoyes++;
      envoyesParCompte.set(ligne.email, dejaEnvoyes + 1);
      // Le filigrane n'avance QU'APRÈS un envoi réussi. L'avancer d'abord
      // serait plus simple et perdrait silencieusement des annonces à chaque
      // panne de l'expéditeur — exactement le défaut que la boîte d'envoi de
      // la §14.11 (R6) existe pour empêcher.
      await db
        .update(recherchesSauvegardees)
        .set({ dernierEnvoiA: new Date() })
        .where(eq(recherchesSauvegardees.id, ligne.id));
    } else {
      resultat.emailsEchoues++;
    }
  }

  return resultat;
}

/** Désactive une alerte — appelé par la désinscription en un clic (RFC 8058). */
export async function desactiverAlerte(rechercheId: string): Promise<boolean> {
  const lignes = await db
    .update(recherchesSauvegardees)
    .set({ alerteActive: false })
    .where(eq(recherchesSauvegardees.id, rechercheId))
    .returning({ id: recherchesSauvegardees.id });
  return lignes.length > 0;
}

/** Nombre d'alertes actives — sert au tableau de bord `/admin`. */
export async function compterAlertesActives(): Promise<number> {
  const [{ value }] = await db
    .select({ value: count() })
    .from(recherchesSauvegardees)
    .where(eq(recherchesSauvegardees.alerteActive, true));
  return value;
}
