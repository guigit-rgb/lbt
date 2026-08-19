import {
  pgTable,
  uuid,
  text,
  integer,
  smallint,
  boolean,
  jsonb,
  timestamp,
  bigserial,
  primaryKey,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

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
    titre: text("titre").notNull(),
    description: text("description").notNull(),
    prixCents: integer("prix_cents"),
    ville: text("ville"),
    codePostal: text("code_postal"),
    etat: text("etat", { enum: ["brouillon", "en_ligne", "retiree"] })
      .notNull()
      .default("brouillon"),
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
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
  },
  (table) => [
    index("annonces_categorie_etat_idx").on(table.categorie, table.etat),
    index("annonces_user_idx").on(table.userId),
  ]
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
