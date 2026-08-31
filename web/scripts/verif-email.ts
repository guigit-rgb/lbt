/**
 * Contrôle HORS BASE et HORS RÉSEAU des e-mails transactionnels
 * (§14.11, action §17 n°211) — `./node_modules/.bin/tsx scripts/verif-email.ts`.
 *
 * Ne se connecte à rien, n'envoie rien. Cinq familles de contrôles, et les
 * trois premières sont celles qu'aucun essai manuel n'attraperait de façon
 * fiable (il faudrait relire quatre gabarits à chaque changement) :
 *
 *  1. **routage des flux** — chaque message part du bon sous-domaine, et seul
 *     le flux `alertes` porte une désinscription (§6.4 R6) ;
 *  2. **échappement** — un titre d'annonce ou un corps de message hostile ne
 *     peut pas injecter de balise dans le HTML ni de retour à la ligne dans un
 *     en-tête ;
 *  3. **contrainte de fournisseur** — objet d'au moins 10 caractères, exigé
 *     par l'API de Scaleway TEM (§14.11 R5), sur les quatre messages et dans
 *     leurs cas limites (titre d'annonce d'un caractère, une seule annonce) ;
 *  4. **version texte** — jamais vide, jamais du HTML, et tout lien du HTML
 *     s'y retrouve (un message dont la partie texte est un dépotoir de balises
 *     est un signal de courrier indésirable classique) ;
 *  5. **liens absolus** — aucun lien relatif ne doit survivre : dans une boîte
 *     mail, il ne mène nulle part.
 */
import { CONFIGURATION_FLUX, FLUX, adresseExpediteur } from "@/lib/email/flux";
import { echapperHtml, rendre, urlSure, type Message } from "@/lib/email/gabarit";
import {
  ALERTE_MAX_ANNONCES,
  alerteRecherche,
  motDePasseOublie,
  nettoyerEntete,
  nouveauMessage,
  tronquer,
  verificationAdresse,
} from "@/lib/email/messages";
import { SUJET_LONGUEUR_MINIMALE, sujetValide, transportsDisponibles } from "@/lib/email/expediteur";

let echecs = 0;
function verifier(intitule: string, condition: boolean, detail?: string) {
  console.log(`${condition ? "  ok  " : "ÉCHEC "} ${intitule}${!condition && detail ? ` — ${detail}` : ""}`);
  if (!condition) echecs++;
}

// L'environnement n'a ni domaine ni secret : on les pose ici pour que le
// contrôle soit reproductible et indépendant de la machine.
process.env.EMAIL_DOMAINE = "lebontruc.fr";
process.env.EMAIL_SITE_URL = "https://lebontruc.fr";

const HOSTILE = `<script>alert(1)</script> "guillemets" & 'apostrophes'`;

// Les quatre messages du dépôt, dans l'ordre de l'action n°211.
const QUATRE: [string, Message][] = [
  ["mot de passe oublié", motDePasseOublie({ lien: "https://lebontruc.fr/compte/reinitialiser?jeton=x", validiteMinutes: 30 })],
  [
    "nouveau message",
    nouveauMessage({
      nomExpediteur: "Camille",
      titreAnnonce: "Renault Clio IV 1.5 dCi 90 ch",
      extrait: "Bonjour, l'annonce est-elle toujours disponible ?",
      lien: "https://lebontruc.fr/compte/messages/abc",
      premierContact: true,
    }),
  ],
  [
    "alerte de recherche",
    alerteRecherche({
      libelleRecherche: "Clio essence · Bordeaux",
      dateEnregistrement: "12/03/2026",
      annonces: [
        { titre: "Clio IV essence", prix: "7 900 €", lieu: "Bordeaux", href: "https://lebontruc.fr/annonces/1" },
        { titre: "Clio III", prix: null, lieu: null, href: "https://lebontruc.fr/annonces/2" },
      ],
      lienRecherche: "https://lebontruc.fr/vehicules?marque=RENAULT",
      lienDesabonnement: "https://lebontruc.fr/api/alertes/desabonnement?id=1&s=ab",
    }),
  ],
  ["vérification d'adresse", verificationAdresse({ lien: "https://lebontruc.fr/compte/verifier?jeton=x", validiteHeures: 48 })],
];

// ---------------------------------------------------------------------------
// 1. Routage des flux
// ---------------------------------------------------------------------------
console.log("\n--- routage des flux ---");

for (const flux of FLUX) {
  const adresse = adresseExpediteur(flux);
  const config = CONFIGURATION_FLUX[flux];
  verifier(
    `flux « ${flux} » → ${adresse}`,
    adresse === `${config.boite}@${config.sousDomaine}.lebontruc.fr`,
    adresse
  );
}
verifier(
  "les trois sous-domaines sont distincts (§6.4 R6 point 1)",
  new Set(FLUX.map((f) => CONFIGURATION_FLUX[f].sousDomaine)).size === FLUX.length
);
verifier("seul le flux « alertes » est désabonnable", FLUX.filter((f) => CONFIGURATION_FLUX[f].desabonnable).join() === "alertes");

const parFlux = Object.fromEntries(QUATRE.map(([nom, m]) => [nom, m.flux]));
verifier("« mot de passe oublié » part du flux transactionnel", parFlux["mot de passe oublié"] === "transactionnel");
verifier("« nouveau message » part du flux contacts (le flux à ne jamais dégrader)", parFlux["nouveau message"] === "contacts");
verifier("« alerte de recherche » part du flux alertes", parFlux["alerte de recherche"] === "alertes");
verifier("« vérification d'adresse » part du flux transactionnel", parFlux["vérification d'adresse"] === "transactionnel");

// Le garde-fou du gabarit : une désinscription sur un flux non désabonnable
// doit lever, pas être ignorée en silence.
let aLeve = false;
try {
  rendre({ ...QUATRE[0][1], desabonnement: "https://lebontruc.fr/x" });
} catch {
  aLeve = true;
}
verifier("un lien de désabonnement sur le flux transactionnel est REFUSÉ", aLeve);

// ---------------------------------------------------------------------------
// 2. Échappement et injection d'en-tête
// ---------------------------------------------------------------------------
console.log("\n--- échappement et injection d'en-tête ---");

const hostile = nouveauMessage({
  nomExpediteur: `Mallory\r\nBcc: victime@example.com`,
  titreAnnonce: HOSTILE,
  extrait: `<img src=x onerror="alert(1)">\nDeuxième ligne`,
  lien: "https://lebontruc.fr/compte/messages/abc",
  premierContact: true,
});
const renduHostile = rendre(hostile);

verifier("l'objet ne contient aucun retour à la ligne", !/[\r\n]/.test(renduHostile.sujet), JSON.stringify(renduHostile.sujet));
verifier("le `Bcc:` injecté dans le nom ne survit pas dans l'objet", !renduHostile.sujet.includes("Bcc:"));
verifier(
  "aucune balise <script> ouvrante dans le HTML rendu",
  !/<script/i.test(renduHostile.html)
);
// PIÈGE DE MÉTHODE, et c'est la même leçon que le Résultat n°6 de la §14.10 :
// la première rédaction de ce contrôle cherchait l'absence de la sous-chaîne
// « onerror= » dans le HTML — et échouait sur une sortie PARFAITEMENT échappée,
// puisque `&lt;img src=x onerror=&quot;…&quot;&gt;` contient bien ces huit
// caractères, en texte inoffensif. Un contrôle qui teste l'absence d'une
// sous-chaîne générique n'est pas un contrôle. La bonne question n'est pas
// « le mot apparaît-il ? » mais « apparaît-il DANS UNE BALISE ? » : on extrait
// donc les balises réellement émises et on regarde ce qu'elles portent.
const balises = renduHostile.html.match(/<[a-zA-Z][^>]*>/g) ?? [];
verifier(
  `aucune des ${balises.length} balises émises ne porte de gestionnaire d'événement`,
  balises.every((b) => !/\son[a-z]+\s*=/i.test(b)),
  balises.find((b) => /\son[a-z]+\s*=/i.test(b))
);
verifier(
  "aucune des balises émises n'est un <script> ou une <iframe>",
  balises.every((b) => !/^<\s*(script|iframe|object|embed)/i.test(b))
);
verifier(
  "la charge hostile est bien présente, mais sous forme échappée",
  renduHostile.html.includes("onerror=&quot;alert(1)&quot;")
);
verifier(
  "le corps hostile apparaît bien, mais échappé",
  renduHostile.html.includes("&lt;img src=x")
);
verifier("échapperHtml traite le & avant les autres entités", echapperHtml("<&>") === "&lt;&amp;&gt;");
verifier("nettoyerEntete conserve les tirets", nettoyerEntete("Clio IV 1.5 dCi 90-ch") === "Clio IV 1.5 dCi 90-ch");
verifier(
  "nettoyerEntete supprime CR et LF",
  nettoyerEntete("a\r\nb") === "a b",
  JSON.stringify(nettoyerEntete("a\r\nb"))
);
verifier("urlSure neutralise javascript:", urlSure("javascript:alert(1)") === "#");
verifier("urlSure neutralise une URL relative", urlSure("/compte/messages/1") === "#");
verifier("urlSure laisse passer https", urlSure("https://lebontruc.fr/a") === "https://lebontruc.fr/a");
verifier(
  "tronquer coupe sans casser un mot et pose une ellipse",
  tronquer("Renault Clio IV 1.5 dCi 90 ch très bon état", 20).endsWith("…") &&
    tronquer("Renault Clio IV 1.5 dCi 90 ch très bon état", 20).length <= 21
);

// ---------------------------------------------------------------------------
// 3. Contrainte de fournisseur sur l'objet (§14.11 R5)
// ---------------------------------------------------------------------------
console.log(`\n--- objet : au moins ${SUJET_LONGUEUR_MINIMALE} caractères (API Scaleway TEM) ---`);

for (const [nom, message] of QUATRE) {
  verifier(
    `objet de « ${nom} » (${message.sujet.length} car.)`,
    sujetValide(message.sujet),
    JSON.stringify(message.sujet)
  );
}

// Les cas limites, qui sont les seuls susceptibles de faire descendre l'objet
// sous le plancher : un titre d'annonce d'un seul caractère, une seule annonce
// dans l'alerte, un libellé de recherche vide.
const limites: [string, Message][] = [
  [
    "titre d'annonce d'un caractère",
    nouveauMessage({ nomExpediteur: "A", titreAnnonce: "X", extrait: "?", lien: "https://lebontruc.fr/a", premierContact: false }),
  ],
  [
    "alerte à une seule annonce",
    alerteRecherche({
      libelleRecherche: "",
      dateEnregistrement: "01/01/2026",
      annonces: [{ titre: "X", prix: null, lieu: null, href: "https://lebontruc.fr/a" }],
      lienRecherche: "https://lebontruc.fr/vehicules",
      lienDesabonnement: "https://lebontruc.fr/api/alertes/desabonnement?id=1&s=ab",
    }),
  ],
];
for (const [nom, message] of limites) {
  verifier(`objet limite — ${nom} (${message.sujet.length} car.)`, sujetValide(message.sujet), JSON.stringify(message.sujet));
}

// ---------------------------------------------------------------------------
// 4. Version texte, en-têtes, plafond d'annonces
// ---------------------------------------------------------------------------
console.log("\n--- version texte et en-têtes ---");

for (const [nom, message] of QUATRE) {
  const rendu = rendre(message);
  verifier(`« ${nom} » a une version texte non vide`, rendu.texte.trim().length > 40);
  verifier(`« ${nom} » : la version texte ne contient pas de balise`, !/<[a-z/]/i.test(rendu.texte));
  verifier(`« ${nom} » porte l'en-tête X-LBT-Flux`, rendu.entetes["X-LBT-Flux"] === message.flux);
  verifier(`« ${nom} » se déclare auto-généré`, rendu.entetes["Auto-Submitted"] === "auto-generated");

  // Tout lien cliquable du HTML doit se retrouver en clair dans le texte :
  // sinon un destinataire en mode texte seul n'a aucun moyen d'agir.
  const liensHtml = [...rendu.html.matchAll(/href="(https:[^"]+)"/g)].map((m) =>
    m[1].replace(/&amp;/g, "&")
  );
  const manquants = liensHtml.filter((l) => !rendu.texte.includes(l));
  verifier(`« ${nom} » : les ${liensHtml.length} liens du HTML sont dans le texte`, manquants.length === 0, manquants.join(" "));
}

const renduAlerte = rendre(QUATRE[2][1]);
verifier(
  "l'alerte porte List-Unsubscribe et List-Unsubscribe-Post (RFC 8058)",
  renduAlerte.entetes["List-Unsubscribe"]?.startsWith("<https://") === true &&
    renduAlerte.entetes["List-Unsubscribe-Post"] === "List-Unsubscribe=One-Click"
);
verifier(
  "l'alerte porte la ligne de motif datée (§6.4 R7 point 2)",
  renduAlerte.texte.includes("vous avez enregistré la recherche") && renduAlerte.texte.includes("le 12/03/2026")
);
verifier(
  "l'alerte publie son ordre d'affichage (§6.4 R7 point 3)",
  renduAlerte.texte.includes("de la plus récente à la plus ancienne") &&
    renduAlerte.texte.includes("Aucune mise en avant payante")
);

for (const [nom, message] of QUATRE) {
  if (message.flux === "alertes") continue;
  const rendu = rendre(message);
  verifier(`« ${nom} » ne porte AUCUN List-Unsubscribe`, rendu.entetes["List-Unsubscribe"] === undefined);
}

const trop = alerteRecherche({
  libelleRecherche: "Tout",
  dateEnregistrement: "01/01/2026",
  annonces: Array.from({ length: 25 }, (_, i) => ({
    titre: `Annonce ${i + 1}`,
    prix: "1 000 €",
    lieu: "Bordeaux",
    href: `https://lebontruc.fr/annonces/${i + 1}`,
  })),
  lienRecherche: "https://lebontruc.fr/vehicules",
  lienDesabonnement: "https://lebontruc.fr/api/alertes/desabonnement?id=1&s=ab",
});
const renduTrop = rendre(trop);
verifier(
  `plafond de ${ALERTE_MAX_ANNONCES} annonces par e-mail respecté (§6.4 R6)`,
  trop.blocs.filter((b) => b.type === "annonce").length === ALERTE_MAX_ANNONCES
);
verifier("le reste est annoncé et non caché", renduTrop.texte.includes("et 15 autres annonces"));
verifier(`l'objet reflète le plafond, pas le total`, trop.sujet.startsWith(`${ALERTE_MAX_ANNONCES} nouvelles annonces`), trop.sujet);

// ---------------------------------------------------------------------------
// 5. Liens absolus et transports disponibles
// ---------------------------------------------------------------------------
console.log("\n--- liens et transports ---");

for (const [nom, message] of QUATRE) {
  const rendu = rendre(message);
  verifier(`« ${nom} » ne contient aucun href="#" (lien relatif ou refusé)`, !rendu.html.includes('href="#"'));
}
verifier(
  "les trois transports sont enregistrés",
  ["scaleway", "brevo", "journal"].every((t) => transportsDisponibles().includes(t)),
  transportsDisponibles().join(", ")
);

// Aperçu lisible, pour l'œil humain.
console.log("\n--- aperçu des quatre objets ---");
for (const [nom, message] of QUATRE) {
  console.log(`  ${nom.padEnd(24)} [${message.flux}] ${message.sujet}`);
}

console.log(`\n${echecs === 0 ? "Tous les contrôles passent." : `${echecs} contrôle(s) en échec.`}`);
process.exit(echecs === 0 ? 0 : 1);
