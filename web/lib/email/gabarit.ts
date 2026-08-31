/**
 * Le gabarit unique des e-mails de LBT (cahier des charges §14.11, action §17
 * n°211 — « poser un gabarit unique »).
 *
 * UN SEUL GABARIT, PAS UN PAR MESSAGE, et ce n'est pas une économie de temps :
 * un gabarit par message, c'est quatre endroits où oublier la ligne de motif
 * du §6.4 (R7 point 2), quatre endroits où oublier l'échappement, et quatre
 * rendus qui divergent au premier changement de charte. Ici, un message est
 * une liste de blocs typés ; la mise en forme, l'échappement, la version texte
 * et le pied de page obligatoire sont produits par cette fonction et par elle
 * seule.
 *
 * TROIS CONTRAINTES DE FOND, dans l'ordre où elles ont coûté cher à d'autres :
 *
 *  1. **Version texte obligatoire, jamais dérivée du HTML par une bibliothèque.**
 *     Un message `multipart/alternative` dont la partie texte manque ou est un
 *     dépotoir de balises est un signal de spam classique. Chaque bloc sait se
 *     rendre en texte ; c'est deux lignes de plus par bloc et zéro dépendance.
 *  2. **Aucune image, aucune fonte distante, aucun script.** Le §6.4 (R6 point
 *     4) a déjà décidé que l'engagement se mesure au clic et jamais à
 *     l'ouverture (la protection de la confidentialité d'Apple Mail précharge
 *     les pixels). Un gabarit sans image est donc cohérent avec la mesure, et
 *     il traverse Outlook sans se casser.
 *  3. **Tout ce qui vient d'un utilisateur est échappé ici.** Titres d'annonce,
 *     noms affichés, corps de message, libellés de recherche : ce sont des
 *     chaînes saisies par des tiers, et un e-mail est un document HTML rendu
 *     par un client qu'on ne contrôle pas.
 */

import { CONFIGURATION_FLUX, type Flux } from "./flux";

// --- Palette, alignée sur app/globals.css (--brand-orange, --brand-navy) ----
const ORANGE = "#ff6e14";
const ENCRE = "#19202a";
const GRIS = "#69727d";
const TRAIT = "#e4e7ec";
const FOND = "#f4f5f7";

export type Bloc =
  | { type: "paragraphe"; texte: string }
  | { type: "bouton"; libelle: string; href: string }
  /** Repli visible quand le bouton ne se clique pas (webmails d'entreprise). */
  | { type: "lien_brut"; href: string }
  /** Extrait d'un contenu écrit par un tiers — toujours visuellement isolé. */
  | { type: "citation"; texte: string; auteur?: string }
  | { type: "annonce"; titre: string; prix?: string; lieu?: string; href: string }
  | { type: "secondaire"; texte: string };

export interface Message {
  flux: Flux;
  /** Objet du message. Contrainte fournisseur : ≥ 10 caractères (§14.11 R5). */
  sujet: string;
  /**
   * Ligne d'aperçu affichée par le client de messagerie à côté de l'objet.
   * Sans elle, l'aperçu montre le premier texte du gabarit, c'est-à-dire le
   * titre — donc deux fois la même chose.
   */
  apercu: string;
  titre: string;
  blocs: Bloc[];
  /**
   * Ligne de motif, obligatoire sur le flux `alertes` (§6.4 R7 point 2) :
   * « vous recevez ce message parce que vous avez enregistré la recherche … ».
   * Facultative ailleurs, mais la poser coûte une phrase et évite la question
   * « pourquoi je reçois ça ».
   */
  motif?: string;
  /** URL de désabonnement — exigée sur un flux désabonnable, interdite sinon. */
  desabonnement?: string;
}

export interface EmailRendu {
  sujet: string;
  html: string;
  texte: string;
  /** En-têtes à poser en plus de `From`/`To`/`Subject`. */
  entetes: Record<string, string>;
}

/** Échappement HTML. Le `&` d'abord, sinon on ré-échappe les entités posées. */
export function echapperHtml(valeur: string): string {
  return valeur
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Une URL n'est jamais insérée dans un `href` sans être vérifiée. Le cas à ne
 * pas laisser passer est `javascript:` (certains clients de messagerie de
 * bureau l'exécutent encore) ; le cas fréquent est une URL relative construite
 * par erreur, qui ne mène nulle part depuis une boîte mail. Les deux se
 * traitent par la même règle : seul `http`/`https` absolu passe.
 */
export function urlSure(href: string): string {
  try {
    const url = new URL(href);
    if (url.protocol === "http:" || url.protocol === "https:") return url.toString();
  } catch {
    // URL invalide — on tombe dans le repli ci-dessous.
  }
  return "#";
}

function paragrapheHtml(contenu: string, couleur = ENCRE, taille = "15px"): string {
  return `<p style="margin:0 0 16px;font-size:${taille};line-height:1.55;color:${couleur};">${contenu}</p>`;
}

function blocHtml(bloc: Bloc): string {
  switch (bloc.type) {
    case "paragraphe":
      return paragrapheHtml(echapperHtml(bloc.texte));

    case "secondaire":
      return paragrapheHtml(echapperHtml(bloc.texte), GRIS, "13px");

    case "bouton": {
      const href = urlSure(bloc.href);
      // Un bouton en `<table>` et non en `<div>` : Outlook (moteur Word)
      // ignore `padding` sur un élément de bloc, et le bouton se réduit alors
      // au texte. C'est le défaut le plus fréquent des gabarits d'e-mail.
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px;"><tr><td style="border-radius:6px;background:${ORANGE};"><a href="${echapperHtml(href)}" style="display:inline-block;padding:12px 22px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:6px;">${echapperHtml(bloc.libelle)}</a></td></tr></table>`;
    }

    case "lien_brut": {
      const href = urlSure(bloc.href);
      return `<p style="margin:0 0 16px;font-size:12px;line-height:1.5;color:${GRIS};word-break:break-all;">${echapperHtml(href)}</p>`;
    }

    case "citation": {
      const auteur = bloc.auteur
        ? `<p style="margin:8px 0 0;font-size:13px;color:${GRIS};">— ${echapperHtml(bloc.auteur)}</p>`
        : "";
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 16px;"><tr><td style="border-left:3px solid ${TRAIT};padding:2px 0 2px 14px;"><p style="margin:0;font-size:15px;line-height:1.55;color:${ENCRE};white-space:pre-wrap;">${echapperHtml(bloc.texte)}</p>${auteur}</td></tr></table>`;
    }

    case "annonce": {
      const href = urlSure(bloc.href);
      const details = [bloc.prix, bloc.lieu]
        .filter((v): v is string => Boolean(v))
        .map(echapperHtml)
        .join(" · ");
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 10px;"><tr><td style="border:1px solid ${TRAIT};border-radius:6px;padding:12px 14px;"><a href="${echapperHtml(href)}" style="font-size:15px;font-weight:600;color:${ENCRE};text-decoration:none;">${echapperHtml(bloc.titre)}</a>${details ? `<p style="margin:4px 0 0;font-size:13px;color:${GRIS};">${details}</p>` : ""}</td></tr></table>`;
    }
  }
}

function blocTexte(bloc: Bloc): string {
  switch (bloc.type) {
    case "paragraphe":
    case "secondaire":
      return bloc.texte;
    case "bouton":
      return `${bloc.libelle} : ${urlSure(bloc.href)}`;
    case "lien_brut":
      return urlSure(bloc.href);
    case "citation":
      return bloc.texte
        .split("\n")
        .map((ligne) => `> ${ligne}`)
        .join("\n") + (bloc.auteur ? `\n> — ${bloc.auteur}` : "");
    case "annonce":
      return [bloc.titre, [bloc.prix, bloc.lieu].filter(Boolean).join(" · "), urlSure(bloc.href)]
        .filter(Boolean)
        .join("\n");
  }
}

/**
 * Mentions de pied de page. Volontairement minimales et vraies : LBT n'a pas
 * encore de page de mentions légales (§13.2 : « aucune page de mentions
 * légales, de CGU, de CGV ni de politique de confidentialité n'existe »), et
 * un lien mort en pied d'e-mail est pire qu'un lien absent. Les liens
 * apparaîtront quand les pages existeront → action n°66.
 */
function piedTexte(): string {
  return "lebontruc — petites annonces. Message automatique, merci de ne pas y répondre.";
}

export function rendre(message: Message): EmailRendu {
  const config = CONFIGURATION_FLUX[message.flux];

  if (message.desabonnement && !config.desabonnable) {
    // Garde-fou, pas confort : proposer de se désabonner d'un e-mail de
    // réinitialisation de mot de passe, c'est proposer de couper le seul canal
    // de récupération de compte (§6.4 R6 point 3).
    throw new Error(`Le flux « ${message.flux} » n'est pas désabonnable.`);
  }

  const corpsHtml = message.blocs.map(blocHtml).join("\n");
  const motifHtml = message.motif ? paragrapheHtml(echapperHtml(message.motif), GRIS, "12px") : "";
  const desabonnementHtml = message.desabonnement
    ? `<p style="margin:0 0 6px;font-size:12px;line-height:1.5;color:${GRIS};"><a href="${echapperHtml(urlSure(message.desabonnement))}" style="color:${GRIS};">Ne plus recevoir cette alerte</a></p>`
    : "";

  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${echapperHtml(message.sujet)}</title>
</head>
<body style="margin:0;padding:0;background:${FOND};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${echapperHtml(message.apercu)}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${FOND};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;background:#ffffff;border:1px solid ${TRAIT};border-radius:8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<tr><td style="padding:20px 24px 0;">
<span style="font-size:19px;font-weight:700;color:${ORANGE};letter-spacing:-0.3px;">lebontruc</span>
</td></tr>
<tr><td style="padding:16px 24px 4px;">
<h1 style="margin:0 0 14px;font-size:20px;line-height:1.3;color:${ENCRE};font-weight:700;">${echapperHtml(message.titre)}</h1>
${corpsHtml}
</td></tr>
<tr><td style="padding:8px 24px 20px;border-top:1px solid ${TRAIT};">
${motifHtml}${desabonnementHtml}
<p style="margin:0;font-size:12px;line-height:1.5;color:${GRIS};">${echapperHtml(piedTexte())}</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  // Blocs séparés par une ligne vide : une liste de dix annonces collées les
  // unes aux autres est illisible en texte seul, et le texte seul est ce que
  // reçoivent les clients de messagerie configurés ainsi — pas un repli
  // théorique.
  const texte = [
    message.titre,
    "",
    message.blocs.map(blocTexte).join("\n\n"),
    "",
    "—",
    ...(message.motif ? [message.motif] : []),
    ...(message.desabonnement ? [`Ne plus recevoir cette alerte : ${urlSure(message.desabonnement)}`] : []),
    piedTexte(),
  ].join("\n");

  // `List-Unsubscribe` + `List-Unsubscribe-Post` : la désinscription en un clic
  // de la RFC 8058, exigée par Google et Yahoo au-delà de 5 000 messages par
  // jour vers un même fournisseur (§6.4 R6). Posée dès le premier envoi et pas
  // au moment où le seuil est atteint : une réputation ne se rattrape pas.
  const entetes: Record<string, string> = {
    "X-LBT-Flux": message.flux,
    // Un message de service n'a pas à déclencher de réponse d'absence.
    "X-Auto-Response-Suppress": "OOF, AutoReply",
    "Auto-Submitted": "auto-generated",
  };
  if (message.desabonnement) {
    entetes["List-Unsubscribe"] = `<${urlSure(message.desabonnement)}>`;
    entetes["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }

  return { sujet: message.sujet, html, texte, entetes };
}
