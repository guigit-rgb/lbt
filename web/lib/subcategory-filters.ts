import type { FilterField } from "./filter-field";
import { ETATS_PRODUIT, TYPES_ANIMAUX } from "./produit-types";
import type { Categorie } from "./db/schema";

// Filtres spécifiques à chaque sous-catégorie leboncoin.fr (relevé fourni par
// Nicolas le 2026-08-23, hors Immobilier et Véhicules déjà traités) — un
// fichier unique plutôt qu'un par catégorie pour garder une vue d'ensemble.
//
// Simplifications assumées (voir résumé donné à Nicolas) :
// - Les filtres "référentiel propre" que leboncoin ne détaille pas
//   explicitement (Marque, Produit, Matière, Style, Format... sans liste
//   donnée) restent des filtres dérivés des annonces existantes, sans
//   catalogue figé — comme "Modèle" pour les véhicules aujourd'hui. Seuls
//   les filtres à valeurs explicitement énumérées dans le relevé (Type de
//   contrat, Type de vélo, tranches d'âge bébé, États...) ont un catalogue.
// - "Étendre à la livraison" (case à cocher) suppose une fonctionnalité de
//   livraison qui n'existe pas du tout sur LBT (aucun transporteur, aucun
//   flux logistique) — non repris, ce serait un nouveau chantier à part.
// - "Statut de l'annonce" n'a pas de valeurs données par leboncoin et ne
//   correspond à rien d'actionnable ici (le catalogue ne montre déjà que les
//   annonces en ligne) — non repris.
// - Locations de vacances : seuls les filtres de liste (Type de bien, Type
//   d'hébergement, Équipements extérieurs, Services, Capacité) sont repris.
//   Destination/Dates/Voyageurs/Paiement en ligne supposent une recherche
//   cartographique avec réservation de dates, absente de LBT — hors scope.

const ETAT: FilterField = { key: "etat_produit", label: "État", widget: "select", catalogue: ETATS_PRODUIT };
const DONS: FilterField = { key: "dons", label: "Dons uniquement", widget: "checkbox", catalogue: ["1"] };
const PRODUIT: FilterField = { key: "produit", label: "Produit", widget: "checkbox" };
const MARQUE_GENERIQUE: FilterField = { key: "marqueProduit", label: "Marque", widget: "checkbox" };
const COULEUR: FilterField = { key: "couleur", label: "Couleur", widget: "checkbox" };
const MATIERE: FilterField = { key: "matiere", label: "Matière", widget: "checkbox" };
const UNIVERS = (catalogue?: readonly string[]): FilterField => ({ key: "univers", label: "Univers", widget: "checkbox", catalogue });
const TYPE_GENERIQUE = (label = "Type", catalogue?: readonly string[]): FilterField => ({
  key: "type",
  label,
  widget: "checkbox",
  catalogue,
});

export interface SubCategoryDef {
  sousCategorie: string;
  fields: FilterField[];
}

// ---------------------------------------------------------------------------
// 1. Matériel professionnel
// ---------------------------------------------------------------------------
const MATERIEL_PRO: SubCategoryDef[] = [
  {
    sousCategorie: "Tracteurs",
    fields: [
      MARQUE_GENERIQUE,
      { key: "annee", label: "Année", widget: "range" },
      { key: "puissance", label: "Puissance (ch)", widget: "range" },
      { key: "heures", label: "Heures", widget: "range" },
    ],
  },
  {
    sousCategorie: "Matériel agricole",
    fields: [
      TYPE_GENERIQUE("Type de matériel"),
      MARQUE_GENERIQUE,
      { key: "heures", label: "Heures", widget: "range" },
      { key: "puissance", label: "Puissance (ch)", widget: "range" },
      { key: "annee", label: "Année", widget: "range" },
    ],
  },
  {
    sousCategorie: "BTP - Chantier gros-œuvre",
    fields: [
      TYPE_GENERIQUE("Type de matériel"),
      MARQUE_GENERIQUE,
      { key: "annee", label: "Année", widget: "range" },
      { key: "poids", label: "Poids (T)", widget: "range" },
      { key: "heures", label: "Heures", widget: "range" },
      { key: "puissance", label: "Puissance (ch)", widget: "range" },
    ],
  },
  { sousCategorie: "Poids lourds", fields: [TYPE_GENERIQUE("Type de matériel")] },
  {
    sousCategorie: "Manutention - Levage",
    fields: [
      { key: "carburant", label: "Énergie", widget: "checkbox" },
      { key: "kilometrage", label: "Kilométrage (km)", widget: "range" },
      { key: "puissance", label: "Puissance (ch)", widget: "range" },
      { key: "annee", label: "Année", widget: "range" },
    ],
  },
  { sousCategorie: "Matériel médical", fields: [] },
  { sousCategorie: "Équipements industriels", fields: [] },
  { sousCategorie: "Équipements pour restaurants & hôtels", fields: [] },
  { sousCategorie: "Équipements & Fournitures de bureau", fields: [] },
  { sousCategorie: "Équipements pour commerces & marchés", fields: [] },
];

// ---------------------------------------------------------------------------
// 2. Électronique
// ---------------------------------------------------------------------------
const PROTECTION_PANNE: FilterField = { key: "protectionPanne", label: "Protection Panne", widget: "checkbox", catalogue: ["Oui"] };

// Référencée par le menu Électronique ET le menu Maison & Jardin sur
// leboncoin.fr (mêmes filtres des deux côtés — cf. relevé fourni).
const ELECTROMENAGER_FIELDS: FilterField[] = [
  MARQUE_GENERIQUE,
  TYPE_GENERIQUE(),
  { key: "typePose", label: "Type de pose", widget: "checkbox" },
  {
    key: "produit",
    label: "Produit",
    widget: "checkbox",
    catalogue: ["Aspirateur", "Congélateur", "Four", "Lave-linge", "Lave-vaisselle", "Micro-ondes", "Réfrigérateur"],
  },
  COULEUR,
  ETAT,
  PROTECTION_PANNE,
];

const ELECTRONIQUE: SubCategoryDef[] = [
  {
    sousCategorie: "Ordinateurs",
    fields: [MARQUE_GENERIQUE, TYPE_GENERIQUE(), { key: "tailleEcran", label: "Taille d'écran", widget: "checkbox" }, ETAT, PROTECTION_PANNE],
  },
  {
    sousCategorie: "Accessoires informatique",
    fields: [MARQUE_GENERIQUE, PRODUIT, { key: "tailleEcran", label: "Taille d'écran", widget: "checkbox" }, ETAT],
  },
  {
    sousCategorie: "Tablettes & Liseuses",
    fields: [
      PRODUIT,
      MARQUE_GENERIQUE,
      { key: "tailleEcran", label: "Taille de l'écran", widget: "checkbox" },
      { key: "capaciteStockage", label: "Capacité de stockage", widget: "checkbox" },
      COULEUR,
      ETAT,
      PROTECTION_PANNE,
    ],
  },
  {
    sousCategorie: "Photo, audio & vidéo",
    fields: [
      MARQUE_GENERIQUE,
      {
        key: "produit",
        label: "Produit",
        widget: "checkbox",
        catalogue: ["Télévision", "Enceintes", "Appareil photo", "Casque", "Vidéoprojecteur", "Accessoires", "Écouteurs"],
      },
      COULEUR,
      ETAT,
      PROTECTION_PANNE,
    ],
  },
  {
    sousCategorie: "Téléphones & Objets connectés",
    fields: [
      { key: "marqueProduit", label: "Marque", widget: "checkbox", catalogue: ["Apple", "Samsung", "Huawei", "Sony", "One plus", "Google"] },
      { key: "modeleProduit", label: "Modèle", widget: "checkbox" },
      PRODUIT,
      { key: "capaciteStockage", label: "Capacité de stockage", widget: "checkbox" },
      COULEUR,
      ETAT,
      PROTECTION_PANNE,
    ],
  },
  {
    sousCategorie: "Accessoires téléphone & Objets connectés",
    fields: [PRODUIT, { key: "compatibilite", label: "Compatibilité", widget: "checkbox" }, COULEUR, ETAT],
  },
  {
    sousCategorie: "Consoles",
    fields: [TYPE_GENERIQUE(), MARQUE_GENERIQUE, { key: "plateforme", label: "Plateforme", widget: "checkbox" }, COULEUR, ETAT, PROTECTION_PANNE],
  },
  { sousCategorie: "Jeux vidéo", fields: [{ key: "plateforme", label: "Plateforme", widget: "checkbox" }, ETAT] },
  { sousCategorie: "Électroménager", fields: ELECTROMENAGER_FIELDS },
  { sousCategorie: "Services de réparations électroniques", fields: [] },
];

// ---------------------------------------------------------------------------
// 3. Emploi
// ---------------------------------------------------------------------------
const EMPLOI: SubCategoryDef[] = [
  {
    sousCategorie: "Offres d'emploi",
    fields: [
      {
        key: "typeContrat",
        label: "Type de contrat",
        widget: "checkbox",
        catalogue: ["Intérim", "CDI", "CDD", "Bénévolat", "Autre (indépendant, apprentissage, stage...)"],
      },
      { key: "secteurActivite", label: "Secteur d'activité", widget: "checkbox" },
      { key: "fonction", label: "Fonction", widget: "checkbox" },
      { key: "experience", label: "Expérience", widget: "checkbox" },
      { key: "niveauEtudes", label: "Niveau d'études", widget: "checkbox" },
      { key: "tempsTravail", label: "Temps de travail", widget: "checkbox", catalogue: ["Temps plein", "Temps partiel"] },
    ],
  },
  {
    sousCategorie: "Formations professionnelles",
    fields: [
      { key: "eligibleCpf", label: "Éligible CPF", widget: "checkbox", catalogue: ["Oui"] },
      { key: "domaineFormation", label: "Domaine de formation", widget: "checkbox" },
      { key: "typeEnseignement", label: "Type d'enseignement", widget: "checkbox" },
    ],
  },
];

// ---------------------------------------------------------------------------
// 4. Mode — "Univers" repris des sous-menus déjà validés (lib/categories.ts)
// ---------------------------------------------------------------------------
const MODE: SubCategoryDef[] = [
  {
    sousCategorie: "Vêtements",
    fields: [
      UNIVERS(["Femme", "Maternité", "Homme", "Enfant"]),
      { key: "taille", label: "Taille", widget: "checkbox" },
      TYPE_GENERIQUE("Type de vêtement"),
      MARQUE_GENERIQUE,
      COULEUR,
      ETAT,
      DONS,
    ],
  },
  {
    sousCategorie: "Chaussures",
    fields: [
      UNIVERS(["Femme", "Homme", "Enfant"]),
      { key: "pointure", label: "Pointure", widget: "checkbox" },
      TYPE_GENERIQUE("Type de chaussure"),
      MARQUE_GENERIQUE,
      COULEUR,
      ETAT,
      DONS,
    ],
  },
  {
    sousCategorie: "Montres & Bijoux",
    fields: [PRODUIT, UNIVERS(["Femme", "Homme", "Enfant", "Mixte"]), MARQUE_GENERIQUE, MATIERE, ETAT, DONS],
  },
  {
    sousCategorie: "Accessoires & Bagagerie",
    fields: [PRODUIT, UNIVERS(["Femme", "Homme", "Enfant", "Mixte"]), MARQUE_GENERIQUE, COULEUR, MATIERE, ETAT, DONS],
  },
];

// ---------------------------------------------------------------------------
// 5. Maison & Jardin
// ---------------------------------------------------------------------------
const MAISON_JARDIN: SubCategoryDef[] = [
  { sousCategorie: "Ameublement", fields: [{ key: "piece", label: "Pièce", widget: "checkbox" }, PRODUIT, MATIERE, COULEUR, MARQUE_GENERIQUE, ETAT, DONS] },
  { sousCategorie: "Papeterie & Fournitures scolaires", fields: [PRODUIT, MARQUE_GENERIQUE, ETAT, DONS] },
  { sousCategorie: "Arts de la table", fields: [PRODUIT, MARQUE_GENERIQUE, MATIERE, COULEUR, ETAT, DONS] },
  { sousCategorie: "Décoration", fields: [PRODUIT, MATIERE, { key: "style", label: "Style", widget: "checkbox" }, COULEUR, ETAT, DONS] },
  {
    sousCategorie: "Linge de maison",
    fields: [TYPE_GENERIQUE(), PRODUIT, MATIERE, { key: "dimensions", label: "Dimensions", widget: "checkbox" }, COULEUR, ETAT],
  },
  { sousCategorie: "Bricolage", fields: [PRODUIT, ETAT, DONS] },
  { sousCategorie: "Jardin & Plantes", fields: [PRODUIT, ETAT, DONS] },
  { sousCategorie: "Services de jardinerie & bricolage", fields: [TYPE_GENERIQUE("Type de service")] },
  // Même sous-catégorie que dans le menu Électronique (cf. ELECTROMENAGER_FIELDS).
  { sousCategorie: "Électroménager", fields: ELECTROMENAGER_FIELDS },
];

// ---------------------------------------------------------------------------
// 6. Famille
// ---------------------------------------------------------------------------
const FAMILLE: SubCategoryDef[] = [
  {
    sousCategorie: "Équipement bébé",
    fields: [{ key: "produit", label: "Produit", widget: "checkbox", catalogue: ["Poussette", "Siège auto"] }, MARQUE_GENERIQUE, COULEUR, ETAT, DONS],
  },
  {
    sousCategorie: "Mobilier enfant",
    fields: [
      { key: "produit", label: "Produit", widget: "checkbox", catalogue: ["Baignoire", "Chaise haute", "Lit bébé"] },
      TYPE_GENERIQUE(),
      MARQUE_GENERIQUE,
      COULEUR,
      ETAT,
    ],
  },
  {
    sousCategorie: "Vêtements bébé",
    fields: [
      { key: "genreBebe", label: "Genre", widget: "checkbox" },
      TYPE_GENERIQUE("Type de vêtement"),
      {
        key: "trancheAge",
        label: "Taille",
        widget: "checkbox",
        catalogue: [
          "0 mois à 3 mois",
          "3 mois à 6 mois",
          "6 mois à 9 mois",
          "9 mois à 12 mois",
          "12 mois à 18 mois",
          "18 mois à 24 mois",
          "Plus de 24 mois",
        ],
      },
      MARQUE_GENERIQUE,
      COULEUR,
      ETAT,
    ],
  },
  { sousCategorie: "Baby-Sitting", fields: [] },
];

// ---------------------------------------------------------------------------
// 7. Loisirs
// ---------------------------------------------------------------------------
const LOISIRS: SubCategoryDef[] = [
  { sousCategorie: "Antiquités", fields: [PRODUIT, MATIERE, { key: "epoque", label: "Époque", widget: "checkbox" }, { key: "style", label: "Style", widget: "checkbox" }, ETAT, DONS] },
  { sousCategorie: "Artistes & Musiciens", fields: [] },
  { sousCategorie: "Billetterie", fields: [TYPE_GENERIQUE("Type de billet/évènement")] },
  { sousCategorie: "Collection", fields: [PRODUIT, { key: "epoque", label: "Époque", widget: "checkbox" }, { key: "conditionnement", label: "Conditionnement", widget: "checkbox" }, ETAT, DONS] },
  { sousCategorie: "CD - Musique", fields: [{ key: "support", label: "Support", widget: "checkbox" }, { key: "genre", label: "Genre", widget: "checkbox" }, ETAT, DONS] },
  {
    sousCategorie: "DVD - Films",
    fields: [
      { key: "support", label: "Support", widget: "checkbox" },
      { key: "genre", label: "Genre", widget: "checkbox" },
      { key: "edition", label: "Édition/Version", widget: "checkbox" },
      { key: "packaging", label: "Packaging/Boîtier", widget: "checkbox" },
      ETAT,
      DONS,
    ],
  },
  { sousCategorie: "Instruments de musique", fields: [UNIVERS(), PRODUIT, MARQUE_GENERIQUE, { key: "niveau", label: "Niveau", widget: "checkbox" }, ETAT, DONS] },
  { sousCategorie: "Livres", fields: [{ key: "format", label: "Format", widget: "checkbox" }, { key: "genre", label: "Genre", widget: "checkbox" }, { key: "langue", label: "Langue", widget: "checkbox" }, ETAT, DONS] },
  { sousCategorie: "Modélisme", fields: [PRODUIT, { key: "echelle", label: "Échelle", widget: "checkbox" }, MARQUE_GENERIQUE, ETAT, DONS] },
  { sousCategorie: "Vins & Gastronomie", fields: [UNIVERS(), ETAT, DONS] },
  { sousCategorie: "Loisirs créatifs", fields: [PRODUIT, { key: "cible", label: "Cible", widget: "checkbox" }, ETAT, DONS] },
  { sousCategorie: "Sport & Plein air", fields: [{ key: "activite", label: "Activité", widget: "checkbox" }, PRODUIT, MARQUE_GENERIQUE, ETAT, DONS] },
  { sousCategorie: "Équipements vélos", fields: [UNIVERS(), PRODUIT, MARQUE_GENERIQUE, { key: "taille", label: "Taille", widget: "checkbox" }, ETAT, DONS] },
  // "Jeux & Jouets" et "Vélos" ne sont PAS eux-mêmes des valeurs de
  // sous_categorie : le dépôt d'annonce Loisirs (NouvelleAnnonceForm,
  // LOISIRS_SOUS_CATEGORIES) aplatit déjà le méga-menu jusqu'aux éléments
  // terminaux ("Vélo de route", "Jeux de société"...) — mécanisme antérieur
  // à cette session, conservé tel quel pour ne rien casser sur les annonces
  // déjà déposées. Le filtre "Produit"/"Type de vélo" du relevé leboncoin
  // devient donc inutile ici : l'élément terminal EST déjà cette valeur.
  ...(["Vélo de route", "VTT", "Vélo électrique", "Vélo enfant", "VTC", "Vélo de ville"] as const).map((sousCategorie) => ({
    sousCategorie,
    fields: [UNIVERS(), { key: "tailleVelo", label: "Taille de vélo", widget: "checkbox" as const }, { key: "tailleRoue", label: "Taille de roue", widget: "checkbox" as const }, MARQUE_GENERIQUE, COULEUR, ETAT, DONS],
  })),
  ...(
    [
      "Jeux de société",
      "Poupées et accessoires",
      "Porteurs, trotteurs et draisiennes",
      "Jouets d'éveil",
      "Cuisines et dînettes",
      "Jeux de construction",
      "Voitures et circuits",
      "Puzzle",
    ] as const
  ).map((sousCategorie) => ({
    sousCategorie,
    fields: [{ key: "age", label: "Âge", widget: "checkbox" as const }, MARQUE_GENERIQUE, MATIERE, ETAT, DONS],
  })),
];

// ---------------------------------------------------------------------------
// 8. Locations de vacances — filtres de liste seulement, voir note en tête de
// fichier pour ce qui est délibérément absent (recherche cartographique).
// ---------------------------------------------------------------------------
const LOCATIONS_VACANCES: FilterField[] = [
  { key: "typeBien", label: "Type de bien", widget: "checkbox", catalogue: ["Maison/Villa", "Appartement", "Chalet"] },
  { key: "typeHebergement", label: "Type d'hébergement", widget: "checkbox", catalogue: ["Chambre d'hôtes", "Camping"] },
  { key: "exterieur", label: "Équipements extérieurs", widget: "checkbox", catalogue: ["Piscine", "Jardin"] },
  { key: "servicesInclus", label: "Services", widget: "checkbox", catalogue: ["Animaux acceptés"] },
  { key: "capacite", label: "Capacité", widget: "checkbox", catalogue: ["Solo", "À deux", "À quatre", "À six", "Plus de six"] },
];

// ---------------------------------------------------------------------------
// 9. Services — presque toutes n'ont qu'un filtre "Type" en plus du socle
// commun (Prix, Tri, Offres/Demandes, Type de vendeurs, Urgentes), déjà
// rendus par défaut pour toutes les catégories (CategoryFilters.tsx).
// ---------------------------------------------------------------------------
const SERVICES: SubCategoryDef[] = [
  { sousCategorie: "Services de déménagement", fields: [] },
  { sousCategorie: "Services de réparations mécaniques", fields: [] },
  { sousCategorie: "Services de jardinerie & bricolage", fields: [TYPE_GENERIQUE("Type de service")] },
  { sousCategorie: "Services à la personne", fields: [] },
  { sousCategorie: "Services aux animaux", fields: [TYPE_GENERIQUE("Type de service")] },
  { sousCategorie: "Baby-Sitting", fields: [] },
  { sousCategorie: "Artistes & Musiciens", fields: [] },
  { sousCategorie: "Services évènementiels", fields: [] },
  { sousCategorie: "Services de réparations électroniques", fields: [] },
  { sousCategorie: "Billetterie", fields: [TYPE_GENERIQUE("Type de billet/évènement")] },
  { sousCategorie: "Entraide entre voisins", fields: [TYPE_GENERIQUE()] },
  { sousCategorie: "Évènements", fields: [] },
  { sousCategorie: "Covoiturage", fields: [] },
  { sousCategorie: "Cours particuliers", fields: [TYPE_GENERIQUE("Matière")] },
  { sousCategorie: "Autres services", fields: [] },
];
// Catégories "Services" sans filtre Prix (entraide/évènements souvent
// gratuits) — utilisé par lib/listing-config.ts pour omettre PRIX_FILTER.
export const SERVICES_SANS_PRIX = ["Entraide entre voisins", "Évènements", "Autres services"] as const;

// ---------------------------------------------------------------------------
// 10. Animaux — les 3 "sous-catégories" du méga-menu sont déjà les seules
// valeurs de sous_categorie pour categorie=animaux (lib/categories.ts).
// ---------------------------------------------------------------------------
const TYPE_ANIMAL: FilterField = { key: "type_animal", label: "Type d'animal", widget: "select", catalogue: TYPES_ANIMAUX };
const ANIMAUX: SubCategoryDef[] = [
  { sousCategorie: "Animaux", fields: [TYPE_ANIMAL] },
  { sousCategorie: "Accessoires animaux", fields: [TYPE_ANIMAL, ETAT, DONS] },
  { sousCategorie: "Animaux perdus", fields: [] },
];

// ---------------------------------------------------------------------------
// Regroupement par catégorie, consommé par lib/listing-config.ts
// ---------------------------------------------------------------------------
function toRecord(defs: SubCategoryDef[]): Record<string, FilterField[]> {
  return Object.fromEntries(defs.map((d) => [d.sousCategorie, d.fields]));
}

export const SOUS_CATEGORIES: Partial<Record<Categorie, readonly string[]>> = {
  "materiel-pro": MATERIEL_PRO.map((d) => d.sousCategorie),
  electronique: ELECTRONIQUE.map((d) => d.sousCategorie),
  emploi: EMPLOI.map((d) => d.sousCategorie),
  mode: MODE.map((d) => d.sousCategorie),
  "maison-jardin": MAISON_JARDIN.map((d) => d.sousCategorie),
  famille: FAMILLE.map((d) => d.sousCategorie),
  loisirs: LOISIRS.map((d) => d.sousCategorie),
  services: SERVICES.map((d) => d.sousCategorie),
  animaux: ANIMAUX.map((d) => d.sousCategorie),
};

export const SUBCATEGORY_FILTERS: Partial<Record<Categorie, Record<string, FilterField[]>>> = {
  "materiel-pro": toRecord(MATERIEL_PRO),
  electronique: toRecord(ELECTRONIQUE),
  emploi: toRecord(EMPLOI),
  mode: toRecord(MODE),
  "maison-jardin": toRecord(MAISON_JARDIN),
  famille: toRecord(FAMILLE),
  loisirs: toRecord(LOISIRS),
  services: toRecord(SERVICES),
  animaux: toRecord(ANIMAUX),
};

export { LOCATIONS_VACANCES, DONS };
