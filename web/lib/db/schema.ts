import {
  pgTable,
  uuid,
  text,
  integer,
  smallint,
  boolean,
  jsonb,
  real,
  timestamp,
  bigserial,
  primaryKey,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const CATEGORIES = [
  "vehicules",
  "immobilier",
  "locations-vacances",
  "emploi",
  "mode",
  "maison-jardin",
  "electronique",
  "materiel-pro",
  "loisirs",
  "animaux",
  "famille",
  "services",
  "autres",
  "dons",
] as const;

export type Categorie = (typeof CATEGORIES)[number];

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name").notNull(),
  role: text("role", { enum: ["user", "admin"] })
    .notNull()
    .default("user"),
  // Statut professionnel auto-déclaré (pas de vérification SIRET auprès d'un
  // registre officiel) : le badge "Pro" affiché sur les annonces reflète
  // seulement ce que le vendeur a coché dans son profil.
  estPro: boolean("est_pro").notNull().default(false),
  siret: text("siret"),
  // Facultatif — un vendeur sans numéro renseigné n'affiche simplement pas
  // le bouton "Voir le numéro" sur ses annonces (pas de valeur bidon).
  telephone: text("telephone"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const invites = pgTable("invites", {
  code: text("code").primaryKey(),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const annonces = pgTable(
  "annonces",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    categorie: text("categorie", { enum: CATEGORIES }).notNull(),
    typeAnnonce: text("type_annonce", { enum: ["offre", "demande"] })
      .notNull()
      .default("offre"),
    titre: text("titre").notNull(),
    description: text("description").notNull(),
    prixCents: integer("prix_cents"),
    ville: text("ville"),
    codePostal: text("code_postal"),
    // Géocodage automatique (ville + code postal, API adresse.data.gouv.fr)
    // au dépôt/à la modification — jamais saisi à la main, jamais l'adresse
    // exacte du vendeur (LBT ne la collecte pas). Nul tant que le géocodage
    // n'a pas encore eu lieu (annonces créées avant cette fonctionnalité).
    lat: real("lat"),
    lng: real("lng"),
    // Quatre fins de vie distinctes, et une seule est une décision de LBT
    // (cf. cahier des charges §6.6 Résultat n°0, §6.7) :
    //   - `vendue`             : l'auteur déclare la vente
    //   - `retiree_par_auteur` : l'auteur retire son annonce (ex-`retiree`)
    //   - `expiree`            : l'horloge
    //   - `retiree`            : RÉSERVÉ à la décision restrictive de LBT
    //                            (exposé des motifs art. 17 du DSA + file R).
    // Ne jamais écrire `retiree` depuis une action de l'utilisateur : le
    // registre de décision et le rapport de transparence public se lisent sur
    // cette valeur, et la distinction ne se rétro-ajoute pas.
    etat: text("etat", {
      enum: [
        "brouillon",
        "en_ligne",
        "en_pause",
        "vendue",
        "retiree_par_auteur",
        "expiree",
        "retiree",
      ],
    })
      .notNull()
      .default("brouillon"),
    vues: integer("vues").notNull().default(0),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    // Date d'entrée dans une fin de vie, quelle qu'elle soit. `updatedAt` ne
    // peut pas en tenir lieu : toute écriture ultérieure l'écrase, alors que
    // l'analyse de durée de vie (§6.6 Résultat n°5) a besoin de la date de
    // l'événement *ou* de la censure. Nul tant que l'annonce est vivante.
    finVieAt: timestamp("fin_vie_at", { withTimezone: true }),
    // Véhicules
    marque: text("marque"),
    modele: text("modele"),
    annee: smallint("annee"),
    kilometrage: integer("kilometrage"),
    // Loisirs
    sousCategorie: text("sous_categorie"),
    etatProduit: text("etat_produit"),
    avisExpert: boolean("avis_expert").notNull().default(false),
    // Animaux
    typeAnimal: text("type_animal"),
    // Catégories génériques (11 restantes)
    attributs: jsonb("attributs").notNull().default({}),
    // "Annonce urgente" (§5, Résultat n°6) : même geste commercial que le
    // boost déjà décidé (remontée 48h), avec en plus un badge visible et un
    // critère de recherche filtrable. Nul ou expiré = pas de badge.
    urgentJusqua: timestamp("urgent_jusqua", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
  },
  (table) => [
    index("annonces_categorie_etat_idx").on(table.categorie, table.etat),
    index("annonces_user_idx").on(table.userId),
    // Recherche plein texte (§14.7). L'expression doit rester **identique au
    // caractère près** à `EXPRESSION_VECTEUR` de lib/recherche-texte.ts : un
    // index d'expression n'est utilisé par Postgres que si l'expression de la
    // requête lui correspond exactement. Une divergence ne casse rien de
    // visible — la recherche continue en balayage séquentiel — d'où le
    // contrôle `EXPLAIN` en fin de scripts/migration-2026-08-27-recherche-plein-texte.sql.
    //
    // Déclaré ici *et* dans le script de migration, à dessein. `drizzle-kit
    // generate` sait bien émettre cet index d'expression — vérifié le
    // 2026-08-27, il sort le `CREATE INDEX ... USING gin (to_tsvector(...))`
    // attendu —, mais la déclaration reste indispensable pour une autre
    // raison : sans elle, le prochain `db:push` verrait l'index comme un objet
    // inconnu de la base et le supprimerait, silencieusement.
    index("annonces_recherche_idx").using(
      "gin",
      sql`to_tsvector('french', translate(lower(coalesce(${table.titre}, '') || ' ' || coalesce(${table.description}, '')), 'àâäáãåçéèêëíìîïñòóôöõùúûüýÿ', 'aaaaaaceeeeiiiinooooouuuuyy'))`
    ),
  ]
);

// Trajectoire de prix d'une annonce (couche « P0 » du cahier des charges,
// §6.6 Résultat n°3). Une ligne par prix *observé*, jamais d'`update` : le
// dernier prix affiché est le `prix_cents` le plus récent, et les baisses
// successives sont le signal de surévaluation le plus exhaustif que le site
// puisse produire — il ne dépend d'aucune réponse du vendeur. Avant cette
// table, `modifierAnnonce` écrasait `annonces.prix_cents` et la trajectoire
// était perdue définitivement.
export const annoncePrixHistorique = pgTable(
  "annonce_prix_historique",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    annonceId: uuid("annonce_id")
      .notNull()
      .references(() => annonces.id, { onDelete: "cascade" }),
    prixCents: integer("prix_cents"),
    // `depot` : première publication ; `modification_auteur` : écran Modifier ;
    // `flux_pro` : réconciliation des flux de stock VO (§7.3, toutes les 4 h) ;
    // `back_office` : correction par la modération (§7.5).
    source: text("source", {
      enum: ["depot", "modification_auteur", "flux_pro", "back_office"],
    }).notNull(),
    observeA: timestamp("observe_a", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("annonce_prix_historique_annonce_idx").on(table.annonceId, table.observeA)]
);

export const annonceImages = pgTable(
  "annonce_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    annonceId: uuid("annonce_id")
      .notNull()
      .references(() => annonces.id, { onDelete: "cascade" }),
    storageKeyOriginal: text("storage_key_original").notNull(),
    urlThumb: text("url_thumb"),
    urlMedium: text("url_medium"),
    urlLarge: text("url_large"),
    position: smallint("position").notNull().default(0),
    status: text("status", {
      enum: ["pending", "processing", "ready", "failed"],
    })
      .notNull()
      .default("pending"),
    exifStripped: boolean("exif_stripped").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("annonce_images_annonce_idx").on(table.annonceId)]
);

// Paiements que LBT encaisse pour son propre compte (modification payante,
// annonce urgente/boost — plus tard l'abonnement pro). Ne couvre jamais un
// paiement entre acheteur et vendeur du véhicule (hors MVP, cf. cahier des
// charges §6.6 Résultat n°7c) : ce cloisonnement est volontaire.
export const paiements = pgTable(
  "paiements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    annonceId: uuid("annonce_id").references(() => annonces.id, { onDelete: "cascade" }),
    type: text("type", { enum: ["modification", "urgent"] }).notNull(),
    montantCents: integer("montant_cents").notNull(),
    statut: text("statut", { enum: ["en_attente", "paye", "echec", "annule"] })
      .notNull()
      .default("en_attente"),
    stripeSessionId: text("stripe_session_id").notNull().unique(),
    // Pour `type = "modification"` : les champs à écrire sur l'annonce une
    // fois le paiement confirmé — jamais appliqués avant, pour ne jamais
    // modifier gratuitement si la carte est refusée ou l'utilisateur ferme
    // l'onglet Stripe.
    donnees: jsonb("donnees").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    payeA: timestamp("paye_a", { withTimezone: true }),
  },
  (table) => [index("paiements_user_idx").on(table.userId)]
);

// Journal de la recherche en langage naturel de l'accueil (§ widget
// RechercheVehiculesWidget) — jusqu'ici aucune trace de son usage n'existait
// nulle part (ni compteur, ni log), question posée par Nicolas le 2026-08-22.
export const recherchesIa = pgTable(
  "recherches_ia",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    texte: text("texte").notNull(),
    filtresExtraits: jsonb("filtres_extraits").notNull().default({}),
    ip: text("ip"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("recherches_ia_created_idx").on(table.createdAt)]
);

export const travaux = pgTable(
  "travaux",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    type: text("type").notNull(),
    payload: jsonb("payload").notNull(),
    etat: text("etat", {
      enum: ["en_attente", "en_cours", "termine", "echec"],
    })
      .notNull()
      .default("en_attente"),
    tentative: smallint("tentative").notNull().default(0),
    disponibleA: timestamp("disponible_a", { withTimezone: true }).notNull().defaultNow(),
    verrouPar: text("verrou_par"),
    verrouA: timestamp("verrou_a", { withTimezone: true }),
    erreur: text("erreur"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("travaux_etat_disponible_idx").on(table.etat, table.disponibleA)]
);

export const feedback = pgTable("feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  contexte: text("contexte").notNull(),
  reponse: text("reponse").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const favoris = pgTable(
  "favoris",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    annonceId: uuid("annonce_id")
      .notNull()
      .references(() => annonces.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.annonceId] })]
);

export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    annonceId: uuid("annonce_id")
      .notNull()
      .references(() => annonces.id, { onDelete: "cascade" }),
    acheteurId: uuid("acheteur_id")
      .notNull()
      .references(() => users.id),
    vendeurId: uuid("vendeur_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("conversations_annonce_acheteur_idx").on(table.annonceId, table.acheteurId),
  ]
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    readAt: timestamp("read_at", { withTimezone: true }),
  },
  (table) => [index("messages_conversation_idx").on(table.conversationId)]
);

// Journal des mises en relation acheteur → vendeur (cahier des charges §5.3
// Résultat n°6, version dégradée de l'action §17 n°209). C'est l'instrument
// de mesure de λ — le nombre de contacts livrés par garage et par mois — donc
// le seul critère de sortie du go/no-go (§13.2 Résultat n°3). Avant cette
// table, LBT ne produisait aucune trace de contact, pas même un log.
//
// AJOUT SEUL. Jamais d'`update`, jamais de `delete` : la §5.3 fait du compteur
// le résultat d'une fonction pure rejouable appliquée à ce journal, et une
// ligne modifiée après coup rend tout l'historique de facturation
// incontestable au mauvais sens du terme.
//
// CE QUI N'EST PAS ICI, ET C'EST VOLONTAIRE : ni `statut`, ni
// `motif_exclusion`, ni le code `Q1..Q4 / N1..N8` de la §5.3. Ce sont des
// *sorties* de `compter(evenements, periode, version_regles)`, pas des faits.
// Les figer à l'écriture interdirait précisément le rejeu que la §5.3 exige
// (un mois clos doit se recalculer avec la version de règles de ce mois-là).
// Le journal ne porte donc que les faits dont les règles ont besoin :
// l'événement, le canal, le vendeur, l'annonce, et l'état de vérification de
// l'acheteur à l'instant du contact.
export const evenementContact = pgTable(
  "evenement_contact",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    horodatageUtc: timestamp("horodatage_utc", { withTimezone: true }).notNull().defaultNow(),
    // Fait observé, pas qualification. Correspondance avec la §5.3 :
    //   - `affichage_numero`     → N2 (intention, jamais un contact facturable :
    //                               le garage ne peut ni le voir ni le contester)
    //   - `premier_message`      → Q1, sous réserve de `acheteur_verifie`
    //   - `notification_interet` → N1 (geste de favori, pas une prise de contact)
    // `appel_abouti` et `formulaire` viendront avec le CPaaS (lot complet §5.3).
    evenement: text("evenement", {
      enum: ["affichage_numero", "premier_message", "notification_interet"],
    }).notNull(),
    canal: text("canal", { enum: ["telephone", "messagerie", "formulaire"] }).notNull(),
    idVendeur: uuid("id_vendeur")
      .notNull()
      .references(() => users.id),
    idAnnonce: uuid("id_annonce").references(() => annonces.id, { onDelete: "set null" }),
    // Instantané du statut pro du vendeur au moment du contact. `users.est_pro`
    // est modifiable à tout instant : lu au moment de la facturation, il ferait
    // basculer rétroactivement des contacts d'un régime à l'autre.
    vendeurEstPro: boolean("vendeur_est_pro").notNull().default(false),
    // Empreinte HMAC-SHA256 de l'identifiant de l'acheteur (§5.3 R6, §8.7 R4).
    // Le numéro E.164 n'est pas encore disponible (pas d'OTP au MVP) : voir
    // `empreinte_source`, qui dit de quoi l'empreinte est calculée et donc ce
    // que la déduplication vaut réellement.
    empreinteAcheteur: text("empreinte_acheteur").notNull(),
    // `telephone_verifie` : OTP (cible §5.3 R4) — déduplication par personne.
    //   `compte`         : identifiant du compte connecté — déduplication par
    //                      compte, contournable par création de comptes.
    //   `navigateur`     : IP + user-agent d'un visiteur non connecté — ce
    //                      n'est PAS une identité : même IP partagée = même
    //                      empreinte, navigation privée = empreinte neuve.
    // Un comptage qui mélangerait les trois sources produirait un λ faux sans
    // le dire ; cette colonne est ce qui permet de les compter séparément.
    empreinteSource: text("empreinte_source", {
      enum: ["telephone_verifie", "compte", "navigateur"],
    }).notNull(),
    // Condition du Q1 de la §5.3, enregistrée comme fait et non déduite plus
    // tard : faux partout tant que l'OTP acheteur n'existe pas.
    acheteurVerifie: boolean("acheteur_verifie").notNull().default(false),
    // Clé de déduplication `(empreinte_acheteur, id_vendeur)` sur 30 jours
    // glissants (§5.3 R2). Stockée plutôt que calculée pour rester stable
    // quand le poivre tournera (action n°202).
    cleDedup: text("cle_dedup").notNull(),
    // Lien vers la preuve, jamais la preuve : identifiant de conversation pour
    // la messagerie, futur identifiant de CDR pour le téléphone.
    idPreuve: text("id_preuve"),
    // Tronqué à 120 caractères à l'écriture : sert à écarter les robots
    // (§5.3 R5), pas à profiler.
    userAgentTronque: text("user_agent_tronque"),
    // Version du jeu de règles en vigueur à l'instant de l'événement — sans
    // elle, une évolution des règles réécrit l'historique de facturation.
    versionRegles: text("version_regles").notNull().default("v0-degradee"),
  },
  (table) => [
    index("evenement_contact_vendeur_idx").on(table.idVendeur, table.horodatageUtc),
    index("evenement_contact_dedup_idx").on(table.cleDedup, table.horodatageUtc),
  ]
);

export const recherchesSauvegardees = pgTable(
  "recherches_sauvegardees",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    categorie: text("categorie", { enum: CATEGORIES }).notNull(),
    // Valeurs de filtre telles que saisies dans l'URL (mêmes clés que
    // `getFiltersForCategory()`), pas de schéma dédié par catégorie — la
    // page catégorie sait déjà les réinterpréter.
    filtres: jsonb("filtres").notNull().default({}),
    tri: text("tri").notNull().default("pertinence"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("recherches_sauvegardees_user_idx").on(table.userId)]
);
