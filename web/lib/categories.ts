import type { Categorie } from "./db/schema";

export interface MegaMenuLink {
  label: string;
  href?: string;
}

export interface MegaMenuGroup {
  heading?: string;
  headingHref?: string;
  links: MegaMenuLink[];
}

export interface MegaMenuEntry {
  categorie: Categorie;
  label: string;
  icon: string;
  columns: MegaMenuGroup[][];
  allHref?: string;
  allLabel?: string;
}

export const MEGA_MENU: MegaMenuEntry[] = [
  {
    categorie: "vehicules",
    label: "Véhicules",
    icon: "🚗",
    allLabel: "Tout Véhicules",
    columns: [
      [
        {
          heading: "Voitures",
          links: [
            { label: "Audi" },
            { label: "BMW" },
            { label: "Mercedes" },
            { label: "Peugeot" },
            { label: "Renault" },
            { label: "Volkswagen" },
          ],
        },
        {
          heading: "Motos",
          links: [
            { label: "BMW" },
            { label: "Honda" },
            { label: "Kawasaki" },
            { label: "Suzuki" },
            { label: "Yamaha" },
          ],
        },
      ],
      [
        { heading: "Caravaning", links: [] },
        { heading: "Utilitaires", links: [] },
        { heading: "Camions", links: [] },
        { heading: "Nautisme", links: [] },
        { heading: "Vélos", links: [] },
      ],
      [
        { heading: "Équipement auto", links: [] },
        { heading: "Équipement moto", links: [] },
        { heading: "Équipement caravaning", links: [] },
        { heading: "Équipement nautisme", links: [] },
        { links: [{ label: "Équipements vélos" }] },
        { heading: "Services de réparations mécaniques", links: [] },
      ],
    ],
  },
  {
    categorie: "immobilier",
    label: "Immobilier",
    icon: "🏠",
    allLabel: "Tout Immobilier",
    columns: [
      [
        {
          heading: "Ventes immobilières",
          links: [{ label: "Appartement" }, { label: "Maison" }, { label: "Terrain" }],
        },
        {
          heading: "Immobilier Neuf",
          links: [
            { label: "Appartement" },
            { label: "Maison" },
            { label: "Programmes logements neufs" },
            { label: "Promoteurs immobiliers" },
          ],
        },
      ],
      [
        {
          heading: "Locations",
          links: [{ label: "Appartement" }, { label: "Maison" }, { label: "Parking" }],
        },
        { links: [{ label: "Colocations" }] },
        { links: [{ label: "Bureaux & Commerces" }] },
        { links: [{ label: "Services de déménagement" }] },
      ],
    ],
  },
  {
    categorie: "locations-vacances",
    label: "Locations de vacances",
    icon: "🏖️",
    columns: [
      [
        {
          heading: "Types d'hébergements",
          links: [
            { label: "Maisons et villas" },
            { label: "Appartements" },
            { label: "Chalets" },
            { label: "Chambres d'hôtes" },
            { label: "Campings" },
          ],
        },
        {
          heading: "Caractéristiques recherchées",
          links: [{ label: "Piscine" }, { label: "Jardin" }, { label: "Animaux acceptés" }],
        },
        {
          heading: "Nombre de voyageurs",
          links: [
            { label: "Solo" },
            { label: "À deux" },
            { label: "À quatre" },
            { label: "À six" },
            { label: "Plus de six" },
          ],
        },
      ],
    ],
  },
  {
    categorie: "emploi",
    label: "Emploi",
    icon: "💼",
    allLabel: "Tout Emploi",
    columns: [
      [
        {
          heading: "Offres d'emploi",
          links: [
            { label: "Intérim" },
            { label: "CDI" },
            { label: "CDD" },
            { label: "Bénévolat" },
            { label: "Autre (indépendant, apprentissage, stage...)" },
          ],
        },
        { links: [{ label: "Formations professionnelles" }] },
        { links: [{ label: "Profil Candidat" }] },
      ],
    ],
  },
  {
    categorie: "mode",
    label: "Mode",
    icon: "👕",
    allLabel: "Tout Mode",
    columns: [
      [
        {
          heading: "Vêtements",
          links: [{ label: "Femme" }, { label: "Maternité" }, { label: "Homme" }, { label: "Enfant" }],
        },
        {
          heading: "Chaussures",
          links: [{ label: "Femme" }, { label: "Homme" }, { label: "Enfant" }],
        },
      ],
      [
        {
          heading: "Montres & Bijoux",
          links: [{ label: "Femme" }, { label: "Homme" }, { label: "Enfant" }, { label: "Mixte" }],
        },
        {
          heading: "Accessoires & Bagagerie",
          links: [{ label: "Femme" }, { label: "Homme" }, { label: "Enfant" }, { label: "Mixte" }],
        },
      ],
    ],
  },
  {
    categorie: "maison-jardin",
    label: "Maison & jardin",
    icon: "🛋️",
    allLabel: "Tout Maison & Jardin",
    columns: [
      [
        {
          heading: "Ameublement",
          links: [
            { label: "Armoire" },
            { label: "Buffet" },
            { label: "Canapé" },
            { label: "Chaise, tabouret et banc" },
            { label: "Fauteuil" },
            { label: "Lit" },
            { label: "Meuble de cuisine" },
            { label: "Table de salle à manger" },
          ],
        },
        { links: [{ label: "Papeterie & Fournitures scolaires" }] },
      ],
      [
        {
          heading: "Électroménager",
          links: [
            { label: "Aspirateur" },
            { label: "Congélateur" },
            { label: "Four" },
            { label: "Lave-linge" },
            { label: "Lave-vaisselle" },
            { label: "Micro-ondes" },
            { label: "Réfrigérateur" },
          ],
        },
        {
          heading: "Arts de la table",
          links: [{ label: "Assiette" }, { label: "Service de vaisselle" }, { label: "Verre" }],
        },
      ],
      [
        {
          heading: "Décoration",
          links: [
            { label: "Applique" },
            { label: "Horloge, pendule et réveil" },
            { label: "Lampadaire" },
            { label: "Lampe à poser" },
            { label: "Lustre" },
            { label: "Miroir" },
            { label: "Rideaux, voilage et store" },
            { label: "Sculpture et statue" },
            { label: "Suspension" },
            { label: "Tableau et toile" },
            { label: "Tapis" },
            { label: "Vase, cache pot et céramique" },
          ],
        },
      ],
      [
        {
          heading: "Linge de maison",
          links: [
            { label: "Équipement du lit" },
            { label: "Déco textile" },
            { label: "Linge de bain" },
            { label: "Linge de lit" },
            { label: "Linge de table" },
            { label: "Autre" },
          ],
        },
        { links: [{ label: "Bricolage" }] },
        { links: [{ label: "Jardin & Plantes" }] },
        { links: [{ label: "Services de jardinerie & bricolage" }] },
      ],
    ],
  },
  {
    categorie: "electronique",
    label: "Électronique",
    icon: "🔌",
    allLabel: "Tout Électronique",
    columns: [
      [
        { links: [{ label: "Ordinateurs" }] },
        { links: [{ label: "Accessoires informatique" }] },
        { links: [{ label: "Tablettes & Liseuses" }] },
        {
          heading: "Photo, audio & vidéo",
          links: [
            { label: "Télévision" },
            { label: "Enceintes" },
            { label: "Appareil photo" },
            { label: "Casque" },
            { label: "Vidéoprojecteur" },
            { label: "Accessoires" },
            { label: "Écouteurs" },
          ],
        },
      ],
      [
        {
          heading: "Téléphones & Objets connectés",
          links: [
            { label: "Apple" },
            { label: "Samsung" },
            { label: "Huawei" },
            { label: "Sony" },
            { label: "One plus" },
            { label: "Google" },
          ],
        },
        { links: [{ label: "Accessoires téléphone & Objets connectés" }] },
        { links: [{ label: "Consoles" }] },
        { links: [{ label: "Jeux vidéo" }] },
      ],
      [{ links: [{ label: "Électroménager" }] }, { links: [{ label: "Services de réparations électroniques" }] }],
    ],
  },
  {
    categorie: "materiel-pro",
    label: "Matériel pro",
    icon: "🛠️",
    allLabel: "Tout Matériel professionnel",
    columns: [
      [
        { links: [{ label: "Tracteurs" }] },
        { links: [{ label: "Matériel agricole" }] },
        { links: [{ label: "BTP - Chantier gros-œuvre" }] },
        { links: [{ label: "Poids lourds" }] },
        { links: [{ label: "Manutention - Levage" }] },
        { links: [{ label: "Matériel médical" }] },
      ],
      [
        { links: [{ label: "Équipements industriels" }] },
        { links: [{ label: "Équipements pour restaurants & hôtels" }] },
        { links: [{ label: "Équipements & Fournitures de bureau" }] },
        { links: [{ label: "Équipements pour commerces & marchés" }] },
      ],
    ],
  },
  {
    categorie: "loisirs",
    label: "Loisirs",
    icon: "🎨",
    allLabel: "Tout Loisirs",
    columns: [
      [
        {
          links: [
            { label: "Antiquités" },
            { label: "Artistes & Musiciens" },
            { label: "Billetterie" },
            { label: "Collection" },
            { label: "CD - Musique" },
            { label: "DVD - Films" },
            { label: "Instruments de musique" },
            { label: "Livres" },
            { label: "Modélisme" },
            { label: "Vins & Gastronomie" },
          ],
        },
      ],
      [
        {
          heading: "Jeux & Jouets",
          links: [
            { label: "Jeux de société" },
            { label: "Poupées et accessoires" },
            { label: "Porteurs, trotteurs et draisiennes" },
            { label: "Jouets d'éveil" },
            { label: "Cuisines et dînettes" },
            { label: "Jeux de construction" },
            { label: "Voitures et circuits" },
            { label: "Puzzle" },
          ],
        },
        { links: [{ label: "Loisirs créatifs" }] },
      ],
      [
        { links: [{ label: "Sport & Plein air" }] },
        {
          heading: "Vélos",
          links: [
            { label: "Vélo de route" },
            { label: "VTT" },
            { label: "Vélo électrique" },
            { label: "Vélo enfant" },
            { label: "VTC" },
            { label: "Vélo de ville" },
          ],
        },
        { links: [{ label: "Équipements vélos" }] },
      ],
    ],
  },
  {
    categorie: "animaux",
    label: "Animaux",
    icon: "🐾",
    columns: [
      [
        {
          heading: "Animaux",
          links: [{ label: "Animaux" }, { label: "Accessoires animaux" }, { label: "Animaux perdus" }],
        },
      ],
    ],
  },
  {
    categorie: "famille",
    label: "Famille",
    icon: "👪",
    allLabel: "Tout Famille",
    columns: [
      [
        {
          heading: "Équipement bébé",
          links: [{ label: "Poussette" }, { label: "Siège auto" }],
        },
        {
          heading: "Mobilier enfant",
          links: [{ label: "Baignoire" }, { label: "Chaise haute" }, { label: "Lit bébé" }],
        },
      ],
      [
        {
          heading: "Vêtements bébé",
          links: [
            { label: "0 mois à 3 mois" },
            { label: "3 mois à 6 mois" },
            { label: "6 mois à 9 mois" },
            { label: "9 mois à 12 mois" },
            { label: "12 mois à 18 mois" },
            { label: "18 mois à 24 mois" },
            { label: "Plus de 24 mois" },
          ],
        },
        { links: [{ label: "Vêtements enfants" }] },
        { links: [{ label: "Vêtements maternité" }] },
      ],
      [
        { links: [{ label: "Chaussures enfants" }] },
        { links: [{ label: "Montres & bijoux enfants" }] },
        { links: [{ label: "Accessoires & bagagerie enfants" }] },
        { links: [{ label: "Jeux & Jouets" }] },
        { links: [{ label: "Baby-Sitting" }] },
      ],
    ],
  },
  {
    categorie: "services",
    label: "Services",
    icon: "🛎️",
    columns: [
      [
        {
          links: [
            { label: "Services de déménagement" },
            { label: "Services de réparations mécaniques" },
            { label: "Services de jardinerie & bricolage" },
            { label: "Services à la personne" },
            { label: "Services aux animaux" },
            { label: "Baby-Sitting" },
            { label: "Artistes & Musiciens" },
            { label: "Services évènementiels" },
            { label: "Services de réparations électroniques" },
            { label: "Entraide entre voisins" },
            { label: "Billetterie" },
            { label: "Évènements" },
            { label: "Covoiturage" },
            { label: "Cours particuliers" },
            { label: "Autres services" },
          ],
        },
      ],
    ],
  },
];

export const AUTRES_ENTRY = { categorie: "autres" as Categorie, label: "Autres", icon: "···" };
export const DONS_ENTRY = { categorie: "dons" as Categorie, label: "Dons", icon: "🎁" };
