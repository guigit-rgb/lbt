import { NextResponse } from "next/server";
import { desactiverAlerte } from "@/lib/alertes";
import { verifierDesabonnement } from "@/lib/jetons-email";

/**
 * Désinscription en un clic (RFC 8058, exigée par Google et Yahoo — §6.4 R6).
 *
 * DEUX VERBES, ET LES DEUX SONT OBLIGATOIRES POUR DES RAISONS DIFFÉRENTES.
 *
 *  - **POST** est celui qu'appelle le fournisseur de messagerie lui-même,
 *    depuis ses serveurs, quand l'utilisateur clique le bouton « Se
 *    désabonner » que Gmail affiche à côté de l'expéditeur. Il n'y a ni
 *    session, ni cookie, ni interface : le corps vaut
 *    `List-Unsubscribe=One-Click` et la réponse doit être un 2xx. Une page de
 *    confirmation ici serait un manquement — la RFC interdit d'exiger un geste
 *    supplémentaire.
 *  - **GET** est le lien texte en pied d'e-mail, cliqué par un humain dans son
 *    navigateur. Il agit et redirige vers une page qui le dit.
 *
 * AUCUNE AUTHENTIFICATION, ET C'EST VOULU : quelqu'un qui reçoit un e-mail
 * non désiré ne doit pas avoir à se connecter pour le faire cesser. Ce qui
 * remplace la session est la **signature HMAC** de l'identifiant d'alerte
 * (`lib/jetons-email.ts`) : sans elle, n'importe qui désabonnerait n'importe
 * quelle alerte en énumérant des identifiants.
 *
 * Le désabonnement ne touche QUE cette alerte (§6.4 R6 point 3) — jamais le
 * flux transactionnel, jamais la messagerie, jamais les autres alertes du
 * même compte.
 */

async function traiter(request: Request): Promise<{ ok: boolean; motif?: string }> {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const signature = url.searchParams.get("s");

  if (!id || !signature) return { ok: false, motif: "lien incomplet" };
  if (!verifierDesabonnement(id, signature)) return { ok: false, motif: "lien invalide" };

  const desactivee = await desactiverAlerte(id);
  // Une alerte déjà supprimée par son auteur rend `false` : ce n'est pas une
  // erreur du point de vue de celui qui clique — il ne recevra plus rien, ce
  // qui est exactement ce qu'il demandait.
  return { ok: true, motif: desactivee ? undefined : "alerte déjà supprimée" };
}

export async function POST(request: Request): Promise<Response> {
  const resultat = await traiter(request);
  // Toujours 200 sur une signature valide, même si l'alerte n'existe plus :
  // un 4xx pousserait certains fournisseurs à considérer que le mécanisme de
  // désinscription est cassé, ce qui pèse sur la réputation de l'expéditeur —
  // le contraire du but poursuivi.
  return resultat.ok
    ? new NextResponse(null, { status: 200 })
    : NextResponse.json({ erreur: resultat.motif }, { status: 400 });
}

export async function GET(request: Request): Promise<Response> {
  const resultat = await traiter(request);
  const cible = new URL("/compte/recherches", request.url);
  cible.searchParams.set("desabonnement", resultat.ok ? "ok" : "erreur");
  return NextResponse.redirect(cible, { status: 303 });
}
