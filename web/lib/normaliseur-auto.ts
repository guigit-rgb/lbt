import { plierAccents } from "./recherche-texte";
import { MARQUES_CATALOGUE } from "./marques";

/**
 * Normaliseur de requête auto — implémentation de la §14.3 du cahier des
 * charges (action §17 n°221), transposée de Typesense vers le modèle de
 * filtres réellement en place (`lib/annonce-filters.ts`).
 *
 * Ce que fait ce module, et pourquoi il existe : sur la verticale automobile,
 * une requête d'acheteur n'est presque jamais du texte libre. « clio 3 essence
 * moins de 8000 € » ne contient aucune chaîne à scorer — c'est une marque, un
 * modèle, une génération, une énergie et un plafond de prix, c'est-à-dire cinq
 * *filtres* déguisés en mots. La §14.3 a mesuré sur 50 requêtes que 82 % des
 * requêtes auto normalisées ne laissent plus un seul terme à chercher en texte.
 * Avant ce module, tout partait en `websearch_to_tsquery` (§14.7) : cela
 * « fonctionne » parce que le titre contient les mêmes mots, mais c'est du
 * scoring de chaînes là où il faut des égalités, et un mot absent du titre
 * (« essence » écrit « Essence » nulle part, l'énergie étant un attribut)
 * suffit à vider la page.
 *
 * Trois règles gouvernent tout le fichier. Elles viennent de mesures faites en
 * §14.3, pas d'intuitions, et aucune n'est négociable :
 *
 *  1. **On préfère un filtre manquant à un filtre faux.** Un mauvais tri
 *     dégrade un classement ; un filtre faux vide le résultat et l'acheteur
 *     part sans comprendre. Toute ambiguïté résiduelle se résout donc en
 *     laissant le terme en texte, ou en l'abandonnant — jamais en devinant.
 *  2. **Le nombre nu à deux chiffres n'est JAMAIS un département** (§14.3,
 *     Résultat n°5). `clio 4 dci 90` ne doit pas filtrer sur le Territoire de
 *     Belfort, `audi a3 35 tdi` pas sur l'Ille-et-Vilaine. Un filtre
 *     géographique n'est produit que sur un marqueur explicite : code postal à
 *     5 chiffres, `dép. 87`, `(87)`, « dans le 87 », ou une préposition de lieu.
 *  3. **Les bigrammes de facettes sont reconnus avant les mots vides**
 *     (§14.3, Résultat n°8). `auto` est du bruit dans « voiture auto occasion »
 *     et un signal fort dans « boîte auto » ; le retirer trop tôt casse une
 *     requête qui marchait. C'est l'ordre des passes ci-dessous, et c'est la
 *     raison pour laquelle il ne doit pas être réarrangé « pour lisibilité ».
 *
 * Écarts assumés par rapport à la §14.3, imposés par le schéma réel :
 *
 *  - **la génération n'a pas de champ** (`annonces` ne porte ni colonne
 *    `generation` ni clé d'attribut). `clio 3` reconnaît donc la génération,
 *    l'affiche à l'acheteur, et **retire le token du texte** au lieu d'émettre
 *    un filtre : le laisser dans `q` garantissait zéro résultat (le vecteur
 *    d'une annonce « Clio III » ne contient pas « 3 »). Idem pour « 5 places »
 *    et « 3 portes ». Voir action n°225 ;
 *  - **le rayon n'est pas déductible d'un nom de lieu** faute de géocodage hors
 *    ligne : « dans 30 km de Bordeaux » produit `localisation=bordeaux`, pas un
 *    couple lat/lng + rayon (action n°227) ;
 *  - **aucun référentiel de communes** n'est embarqué (le paquet
 *    `@etalab/decoupage-administratif` de la §14.3, Résultat n°2, n'est pas une
 *    dépendance du dépôt et la politique réseau §14.6 interdit de l'installer
 *    depuis une session automatisée). La géographie ne repose donc que sur les
 *    marqueurs explicites de la règle 2 — ce qui, par construction, ne produit
 *    aucune des 27 collisions auto/carte mesurées en §14.3 (Résultat n°7).
 */

// ---------------------------------------------------------------------------
// Référentiels
// ---------------------------------------------------------------------------

/** Marques : couche 1 du référentiel de la §14.3 (Résultat n°1), et la seule
 *  qui soit déjà résolue dans le dépôt — le catalogue de `lib/marques.ts` est
 *  celui fourni par Nicolas, donc plus fiable que les 66 marques écrites à la
 *  main par le prototype de la §14.3. Il est indexé ici sous forme pliée. */
const MARQUES_PAR_CLE = new Map<string, string[]>();
for (const marque of MARQUES_CATALOGUE) {
  const cle = plierAccents(marque);
  MARQUES_PAR_CLE.set(cle, [...(MARQUES_PAR_CLE.get(cle) ?? []), marque]);
}

/**
 * Alias de marques → valeurs de filtre à émettre. Deux besoins distincts, et
 * c'est ce qui explique que la cible soit une *liste* et non une chaîne :
 *
 *  - l'usage courant ne cite pas la marque comme le catalogue (« vw », « alfa »,
 *    « mercedes ») ;
 *  - les annonces déjà en base ne portent pas toujours la valeur du catalogue.
 *    Le jeu de démonstration écrit `Mercedes`, le catalogue dit `MERCEDES-BENZ` :
 *    le filtre `marque` acceptant plusieurs valeurs (`in (...)`, insensible à la
 *    casse), un alias peut couvrir les deux orthographes sans arbitrage.
 */
const ALIAS_MARQUES: Record<string, string[]> = {
  vw: ["VOLKSWAGEN"],
  volks: ["VOLKSWAGEN"],
  mercedes: ["MERCEDES-BENZ", "MERCEDES-AMG", "MERCEDES"],
  "mercedes benz": ["MERCEDES-BENZ", "MERCEDES"],
  benz: ["MERCEDES-BENZ", "MERCEDES"],
  alfa: ["ALFA ROMEO"],
  "land rover": ["LAND ROVER"],
  landrover: ["LAND ROVER"],
  "rolls royce": ["ROLLS-ROYCE", "ROLLS ROYCE"],
  "aston martin": ["ASTON MARTIN"],
  "austin healey": ["AUSTIN HEALEY"],
  chevy: ["CHEVROLET"],
  citroen: ["CITROEN", "CITROËN"],
  skoda: ["SKODA", "ŠKODA"],
  vauxhall: ["OPEL"],
  toyot: ["TOYOTA"],
  "mg motor": ["MG", "MG/MG MOTOR"],
  "lynk co": ["LYNK&CO", "LYNK & CO"],
  "santana motor": ["SANTANA"],
};

/** Marques et alias dans une seule table. Sert à l'étage 5a (reconnaissance
 *  exacte) **et** à l'étage 8a (rattrapage flou) : sans les alias, une faute
 *  frappée sur un alias ne se corrige jamais — `mercedez` ne trouve rien, parce
 *  que le catalogue ne contient que `MERCEDES-BENZ`, dont il est à cinq
 *  substitutions. Le cas a été trouvé par le jeu de non-régression, pas par
 *  relecture. */
const MARQUES_LOOKUP = new Map<string, string[]>(MARQUES_PAR_CLE);
for (const [cle, valeurs] of Object.entries(ALIAS_MARQUES)) MARQUES_LOOKUP.set(cle, valeurs);

/**
 * Modèles : couche 2 du référentiel de la §14.3 (Résultat n°1). Écrite à la
 * main, marché français de l'occasion — pas téléchargée. La §14.3 avait
 * disséqué le seul jeu communautaire disponible (`DanielKohut/car-data`) et
 * conclu qu'il était **inutilisable** : JSON invalide, granularité incohérente
 * (`Golf I (Mk1)`… mais pas `Golf`), fautes d'orthographe, et surtout **aucun
 * utilitaire** — ni Trafic, ni Master, ni Boxer, alors que le VU d'occasion
 * pèse ~900 000 immatriculations par an en France et qu'un garage indépendant
 * en vend. Cette table part donc de l'autre bout : les modèles que l'on trouve
 * effectivement en occasion en France, utilitaires compris.
 *
 * Ce n'est pas le référentiel définitif, et la §14.3 a déjà dit lequel le sera :
 * la couche 3, **extraite des flux de stock des professionnels** (§7.3), qui a
 * la propriété qu'aucune base d'homologation n'a — ne contenir que ce qui est
 * réellement en vente. Le parseur de flux et ce module devront partager cette
 * table (§14.3, Résultat n°1 in fine ; action n°50).
 */
const MODELES: Record<string, readonly string[]> = {
  RENAULT: [
    "Twingo", "Clio", "Captur", "Megane", "Mégane", "Scenic", "Scénic", "Grand Scenic", "Kadjar",
    "Austral", "Arkana", "Espace", "Laguna", "Talisman", "Zoe", "Zoé", "Rafale", "Symbioz",
    "Koleos", "Modus", "Fluence", "Vel Satis", "Safrane", "Avantime", "Latitude", "Wind",
    "Kangoo", "Trafic", "Master", "Express", "Twizy", "Duster",
  ],
  PEUGEOT: [
    "106", "107", "108", "205", "206", "207", "208", "2008", "301", "306", "307", "308", "3008",
    "405", "406", "407", "408", "4007", "4008", "5008", "508", "605", "607", "806", "807", "1007",
    "RCZ", "Partner", "Rifter", "Expert", "Traveller", "Boxer", "Bipper", "iOn", "e-208", "e-2008",
  ],
  CITROEN: [
    "AX", "Saxo", "C1", "C2", "C3", "C3 Aircross", "C3 Picasso", "C4", "C4 Picasso",
    "Grand C4 Picasso", "C4 Cactus", "C4 Aircross", "C4 SpaceTourer", "C5", "C5 Aircross", "C5 X",
    "C6", "C8", "C15", "C25", "Xsara", "Xsara Picasso", "Xantia", "ZX", "BX", "Visa", "Evasion",
    "Berlingo", "Jumpy", "Jumper", "Nemo", "SpaceTourer", "Ami", "Mehari", "Méhari", "2CV",
    "e-C4", "ë-C4",
  ],
  DS: ["DS3", "DS4", "DS5", "DS7", "DS9", "DS3 Crossback", "DS7 Crossback", "DS4 Crossback"],
  VOLKSWAGEN: [
    "Up", "Polo", "Golf", "Jetta", "Bora", "Vento", "Passat", "Arteon", "Scirocco", "Beetle",
    "Coccinelle", "Tiguan", "Touran", "Touareg", "Sharan", "T-Roc", "T-Cross", "Taigo", "ID.3",
    "ID.4", "ID.5", "ID.7", "Caddy", "Transporter", "Multivan", "Crafter", "Amarok", "Caravelle",
    "California", "Fox", "Lupo",
  ],
  AUDI: [
    "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q4", "Q5", "Q7", "Q8", "TT", "R8",
    "S3", "S4", "S5", "RS3", "RS4", "RS6", "e-tron", "Q4 e-tron", "A3 Sportback", "A4 Allroad", "A6 Allroad",
  ],
  BMW: [
    "Serie 1", "Série 1", "Serie 2", "Série 2", "Serie 3", "Série 3", "Serie 4", "Série 4",
    "Serie 5", "Série 5", "Serie 6", "Série 6", "Serie 7", "Série 7", "Serie 8", "Série 8",
    "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z3", "Z4", "i3", "i4", "i5", "iX", "iX1", "iX3",
    "M2", "M3", "M4", "M5", "Active Tourer", "Gran Tourer",
  ],
  "MERCEDES-BENZ": [
    "Classe A", "Classe B", "Classe C", "Classe E", "Classe S", "Classe G", "Classe V",
    "CLA", "CLS", "CLK", "GLA", "GLB", "GLC", "GLE", "GLK", "GLS", "ML", "SLK", "SLC", "SL",
    "EQA", "EQB", "EQC", "Vito", "Viano", "Sprinter", "Citan", "Vaneo",
  ],
  DACIA: ["Sandero", "Logan", "Duster", "Lodgy", "Dokker", "Spring", "Jogger", "Bigster"],
  TOYOTA: [
    "Aygo", "Aygo X", "Yaris", "Yaris Cross", "Corolla", "Auris", "Avensis", "RAV4", "C-HR",
    "Prius", "Hilux", "Land Cruiser", "Proace", "Verso", "Camry", "Highlander", "bZ4X",
  ],
  FORD: [
    "Ka", "Fiesta", "Focus", "Puma", "Kuga", "Mondeo", "C-Max", "S-Max", "Galaxy", "EcoSport",
    "Explorer", "Mustang", "Ranger", "Transit", "Transit Custom", "Transit Connect", "Tourneo",
    "Fusion", "B-Max", "Escort",
  ],
  OPEL: [
    "Corsa", "Adam", "Karl", "Agila", "Astra", "Vectra", "Insignia", "Mokka", "Crossland",
    "Grandland", "Zafira", "Meriva", "Antara", "Tigra", "Combo", "Vivaro", "Movano", "Frontera",
  ],
  FIAT: [
    "500", "500L", "500X", "500C", "Panda", "Punto", "Grande Punto", "Tipo", "Bravo", "Stilo",
    "Croma", "Multipla", "Qubo", "Sedici", "Uno", "Freemont", "Doblo", "Ducato", "Fiorino",
    "Talento", "Scudo", "Idea", "124 Spider",
  ],
  ABARTH: ["595", "695", "500 Abarth"],
  NISSAN: [
    "Micra", "Note", "Juke", "Qashqai", "X-Trail", "Leaf", "Ariya", "Pulsar", "Almera", "Primera",
    "Navara", "NV200", "Primastar", "Interstar", "Kubistar", "Terrano", "Murano",
  ],
  KIA: [
    "Picanto", "Rio", "Ceed", "ProCeed", "XCeed", "Sportage", "Sorento", "Niro", "Stonic", "Soul",
    "Venga", "Carens", "Cerato", "EV3", "EV6", "EV9",
  ],
  HYUNDAI: [
    "i10", "i20", "i30", "i40", "ix20", "ix35", "Tucson", "Kona", "Santa Fe", "Bayon", "Ioniq",
    "Ioniq 5", "Ioniq 6", "Getz", "Accent", "Atos", "Matrix",
  ],
  SEAT: ["Ibiza", "Leon", "León", "Arona", "Ateca", "Tarraco", "Alhambra", "Altea", "Toledo", "Mii", "Exeo", "Cordoba"],
  CUPRA: ["Formentor", "Born", "Terramar", "Tavascan", "Leon", "León", "Ateca", "Ibiza"],
  SKODA: [
    "Fabia", "Octavia", "Superb", "Rapid", "Scala", "Kamiq", "Karoq", "Kodiaq", "Yeti", "Roomster",
    "Citigo", "Enyaq", "Elroq", "Felicia",
  ],
  VOLVO: [
    "V40", "V50", "V60", "V70", "V90", "S40", "S60", "S80", "S90", "XC40", "XC60", "XC70", "XC90",
    "C30", "C40", "EX30", "EX40",
  ],
  MINI: ["Cooper", "Countryman", "Clubman", "Paceman", "Cabrio", "One"],
  SUZUKI: ["Swift", "Vitara", "Grand Vitara", "Jimny", "Ignis", "S-Cross", "Baleno", "Alto", "SX4", "Celerio", "Splash"],
  HONDA: ["Civic", "Jazz", "CR-V", "HR-V", "Accord", "e:Ny1", "ZR-V"],
  MAZDA: ["CX-3", "CX-30", "CX-5", "CX-60", "CX-7", "MX-5", "MX-30", "Demio", "Premacy"],
  MITSUBISHI: ["Space Star", "ASX", "Outlander", "L200", "Pajero", "Colt", "Eclipse Cross", "Lancer"],
  SUBARU: ["Forester", "Impreza", "Outback", "Legacy", "Levorg", "Solterra"],
  JEEP: ["Renegade", "Compass", "Wrangler", "Cherokee", "Grand Cherokee", "Avenger", "Patriot"],
  "ALFA ROMEO": ["Giulietta", "Giulia", "Mito", "MiTo", "Stelvio", "Tonale", "147", "156", "159", "Brera", "Junior"],
  LANCIA: ["Ypsilon", "Delta", "Musa", "Phedra"],
  TESLA: ["Model 3", "Model S", "Model X", "Model Y"],
  MG: ["ZS", "HS", "MG3", "MG4", "MG5", "EHS", "Marvel R", "Cyberster"],
  SMART: ["Fortwo", "Forfour", "Roadster", "#1", "#3"],
  "LAND ROVER": [
    "Defender", "Discovery", "Discovery Sport", "Range Rover", "Range Rover Sport",
    "Range Rover Evoque", "Range Rover Velar", "Evoque", "Velar", "Freelander",
  ],
  PORSCHE: ["911", "718", "Boxster", "Cayman", "Cayenne", "Macan", "Panamera", "Taycan", "944", "968"],
  JAGUAR: ["XE", "XF", "XJ", "F-Pace", "E-Pace", "I-Pace", "F-Type", "X-Type", "S-Type"],
  LEXUS: ["CT", "IS", "NX", "RX", "UX", "LS", "GS", "RZ"],
  IVECO: ["Daily", "Eurocargo"],
  MAN: ["TGE"],
  AIXAM: ["Crossline", "Minauto", "GTO", "Sensation"],
  LIGIER: ["JS50", "JS60", "JS RC", "Nova"],
  MICROCAR: ["M8", "M.Go", "Due", "Dué", "Cargo"],
  CHATENET: ["CH26", "CH30", "CH32", "CH40", "Barooder", "Speedino"],
  POLESTAR: ["Polestar 2", "Polestar 3", "Polestar 4"],
  BYD: ["Atto 3", "Dolphin", "Seal", "Seal U", "Han", "Tang"],
  CHEVROLET: ["Aveo", "Cruze", "Captiva", "Spark", "Matiz", "Orlando", "Trax"],
  DAEWOO: ["Matiz", "Lanos", "Nubira", "Kalos"],
  DAIHATSU: ["Terios", "Sirion", "Cuore", "Materia"],
  ROVER: ["Streetwise", "Freight Rover"],
  SAAB: ["9-3", "9-5"],
  SSANGYONG: ["Korando", "Rexton", "Tivoli", "Actyon", "Musso"],
  ALPINE: ["A110", "A310", "A610"],
  MASERATI: ["Ghibli", "Levante", "Grecale", "Quattroporte"],
  INFINITI: ["Q30", "Q50", "QX30"],
  GENESIS: ["G70", "GV70", "GV80"],
  LADA: ["Niva", "Samara", "Kalina"],
  TALBOT: ["Samba", "Horizon", "Solara"],
};

/** Alias de modèles → couple (marque, valeurs). C'est la table qui « fait la
 *  différence entre 90 % et 98 % de reconnaissance » (§14.3, Résultat n°1) :
 *  les codes commerciaux allemands (`320` = Série 3), les orthographes sans
 *  accent, les abréviations d'usage. Volontairement courte : chaque entrée doit
 *  être justifiée par un usage réel, pas par la complétude. */
const ALIAS_MODELES: Record<string, { marque: string; valeurs: string[] }> = {
  // BMW : le code commercial à trois chiffres est ce que les vendeurs écrivent.
  "116": { marque: "BMW", valeurs: ["Serie 1", "Série 1"] },
  "118": { marque: "BMW", valeurs: ["Serie 1", "Série 1"] },
  "120": { marque: "BMW", valeurs: ["Serie 1", "Série 1"] },
  "218": { marque: "BMW", valeurs: ["Serie 2", "Série 2"] },
  "220": { marque: "BMW", valeurs: ["Serie 2", "Série 2"] },
  "316": { marque: "BMW", valeurs: ["Serie 3", "Série 3"] },
  "318": { marque: "BMW", valeurs: ["Serie 3", "Série 3"] },
  "320": { marque: "BMW", valeurs: ["Serie 3", "Série 3"] },
  "325": { marque: "BMW", valeurs: ["Serie 3", "Série 3"] },
  "330": { marque: "BMW", valeurs: ["Serie 3", "Série 3"] },
  "420": { marque: "BMW", valeurs: ["Serie 4", "Série 4"] },
  "520": { marque: "BMW", valeurs: ["Serie 5", "Série 5"] },
  "525": { marque: "BMW", valeurs: ["Serie 5", "Série 5"] },
  "530": { marque: "BMW", valeurs: ["Serie 5", "Série 5"] },
  "730": { marque: "BMW", valeurs: ["Serie 7", "Série 7"] },
  serie1: { marque: "BMW", valeurs: ["Serie 1", "Série 1"] },
  serie3: { marque: "BMW", valeurs: ["Serie 3", "Série 3"] },
  serie5: { marque: "BMW", valeurs: ["Serie 5", "Série 5"] },
  // Mercedes : « classe a » et « classea » s'écrivent aussi « a class ».
  classea: { marque: "MERCEDES-BENZ", valeurs: ["Classe A"] },
  classec: { marque: "MERCEDES-BENZ", valeurs: ["Classe C"] },
  classee: { marque: "MERCEDES-BENZ", valeurs: ["Classe E"] },
  // Citroën / Peugeot : le « picasso » nu désigne toujours un C4 ou un Xsara.
  picasso: { marque: "CITROEN", valeurs: ["C4 Picasso", "Grand C4 Picasso", "Xsara Picasso", "C3 Picasso"] },
  // Renault : orthographes sans accent déjà couvertes par le pliage, mais
  // « megane 4 » et « scenic 3 » s'écrivent aussi collés.
  clio4: { marque: "RENAULT", valeurs: ["Clio"] },
  clio3: { marque: "RENAULT", valeurs: ["Clio"] },
  // Land Rover : « evoque » nu est un Range Rover Evoque.
  evoque: { marque: "LAND ROVER", valeurs: ["Range Rover Evoque", "Evoque"] },
  // Tesla : « model3 » collé est fréquent.
  model3: { marque: "TESLA", valeurs: ["Model 3"] },
  modely: { marque: "TESLA", valeurs: ["Model Y"] },
  // VW : « id3 » sans point est l'écriture la plus courante.
  id3: { marque: "VOLKSWAGEN", valeurs: ["ID.3"] },
  id4: { marque: "VOLKSWAGEN", valeurs: ["ID.4"] },
  // Utilitaires : « traffic » avec deux f est l'orthographe fautive la plus
  // répandue du Trafic, et elle est trop courte pour le rattrapage flou.
  traffic: { marque: "RENAULT", valeurs: ["Trafic"] },
};

/** Index inversé clé pliée → candidats. Une même clé peut appartenir à
 *  plusieurs marques (`Duster` chez Dacia et Renault selon le millésime,
 *  `Combo` chez Opel et Fiat, `Leon` chez Seat et Cupra) : c'est pour cela que
 *  la valeur est une liste et que l'inférence de marque est *abandonnée* dès
 *  qu'elle est ambiguë (voir `reconnaitreModele`). */
interface CandidatModele {
  marque: string;
  valeur: string;
}
const MODELES_PAR_CLE = new Map<string, CandidatModele[]>();
function indexerModele(cle: string, candidat: CandidatModele) {
  const existants = MODELES_PAR_CLE.get(cle) ?? [];
  if (!existants.some((c) => c.marque === candidat.marque && c.valeur === candidat.valeur)) {
    existants.push(candidat);
  }
  MODELES_PAR_CLE.set(cle, existants);
}
for (const [marque, modeles] of Object.entries(MODELES)) {
  for (const modele of modeles) indexerModele(plierAccents(modele), { marque, valeur: modele });
}
for (const [cle, { marque, valeurs }] of Object.entries(ALIAS_MODELES)) {
  for (const valeur of valeurs) indexerModele(cle, { marque, valeur });
}

/**
 * Clés de modèle interdites, et c'est le garde-fou le plus important du
 * fichier. Un modèle purement numérique de 1 ou 2 chiffres est indistinguable
 * d'une génération, d'une puissance ou d'un code de département : la §14.3
 * (Résultat n°5) a mesuré que **36 codes de département sont aussi des noms de
 * modèles purement numériques**, et Renault a commercialisé les 4, 5, 6, 9, 11,
 * 12, 14, 16, 17, 18, 19, 21, 25 et 30. Ces clés ne sont donc jamais indexées.
 * Les clés alphanumériques courtes (`A3`, `C4`, `X5`, `Q3`, `i20`, `ZS`) le
 * sont : la présence d'une lettre lève l'ambiguïté avec un nombre nu.
 */
function cleModeleAdmissible(cle: string): boolean {
  if (/^\d+$/.test(cle)) return cle.length >= 3;
  return cle.length >= 2;
}
for (const cle of [...MODELES_PAR_CLE.keys()]) {
  if (!cleModeleAdmissible(cle)) MODELES_PAR_CLE.delete(cle);
}

/** Taille du référentiel réellement embarqué, après élagage des clés
 *  inadmissibles. Exposée parce que c'est le chiffre à surveiller : la §14.3
 *  (Résultat n°4) a fondé la décision « module et non service dédié » sur le
 *  fait que tout tient en mémoire du processus. */
export const TAILLE_REFERENTIEL = () => ({
  marques: MARQUES_LOOKUP.size,
  modeles: MODELES_PAR_CLE.size,
});

/** Nombre de mots du plus long n-gramme de modèle indexé (« grand c4 picasso »,
 *  « range rover evoque » → 3). Détermine la largeur de la fenêtre glissante. */
const LARGEUR_MAX_MODELE = Math.max(...[...MODELES_PAR_CLE.keys()].map((c) => c.split(" ").length));

// --- lexiques de facettes -------------------------------------------------
// Les valeurs cibles sont celles réellement stockées (lib/vehicule-types.ts et
// components/NouvelleAnnonceForm.tsx) : une valeur inventée ici produirait un
// filtre syntaxiquement correct et sémantiquement vide.

const CARBURANT_PAR_CLE: Record<string, string> = {
  essence: "Essence", sp95: "Essence", sp98: "Essence",
  diesel: "Diesel", gazole: "Diesel", gasoil: "Diesel", tdi: "Diesel", hdi: "Diesel",
  hybride: "Hybride", hybrid: "Hybride", phev: "Hybride", hev: "Hybride", "full hybrid": "Hybride",
  electrique: "Électrique", electric: "Électrique", ev: "Électrique", "100 electrique": "Électrique",
};
// `tdi`/`hdi` sont dans la table ci-dessus par choix mesuré : ce sont des
// motorisations, donc en principe du champ `version` (§14.3, Résultat n°9),
// mais elles n'existent QUE sur des diesels — l'information d'énergie qu'elles
// portent est certaine, et un acheteur qui tape « a3 tdi » veut un diesel.

const BOITE_PAR_CLE: Record<string, string> = {
  automatique: "Automatique", auto: "Automatique", bva: "Automatique", dsg: "Automatique",
  edc: "Automatique", eat8: "Automatique", eat6: "Automatique", tiptronic: "Automatique",
  manuelle: "Manuelle", manuel: "Manuelle", bvm: "Manuelle",
};
// ATTENTION (§14.3, Résultat n°8) : `auto` n'est PAS reconnu comme boîte
// automatique en unigramme — seulement dans les bigrammes ci-dessous. Seul
// « boîte auto » est un signal ; « voiture auto occasion » est du bruit.
const BOITE_BIGRAMMES: Record<string, string> = {
  "boite auto": "Automatique", "boite automatique": "Automatique", "bv auto": "Automatique",
  "boite manuelle": "Manuelle", "bv manuelle": "Manuelle",
};

const TYPE_VEHICULE_PAR_CLE: Record<string, string> = {
  berline: "Berline", citadine: "Citadine", suv: "SUV / 4x4", "4x4": "SUV / 4x4",
  break: "Break", coupe: "Coupé", cabriolet: "Cabriolet", cabrio: "Cabriolet",
  monospace: "Monospace", utilitaire: "Utilitaire", fourgon: "Utilitaire",
  fourgonnette: "Utilitaire", camionnette: "Utilitaire", moto: "Moto",
};

/** Mots vides du domaine. Rappel du piège mesuré en §14.3 (Résultat n°8) :
 *  `auto` et `autos` ont été **retirés** de cette liste, parce que leur retrait
 *  cassait « boîte auto ». `automobile` y reste. */
const MOTS_VIDES = new Set([
  "voiture", "voitures", "occasion", "occasions", "vehicule", "vehicules", "automobile",
  "vends", "vend", "vendre", "achat", "acheter", "annonce", "annonces", "pas", "cher",
  "particulier", "bon", "plan", "affaire", "de", "du", "des", "le", "la", "les", "un", "une",
  "et", "ou", "en", "au", "aux", "avec", "pour", "d", "l",
]);

/** Prépositions qui déclarent une intention géographique. C'est le seul chemin
 *  par lequel un nom de lieu peut produire un filtre : la §14.3 (Résultat n°7)
 *  a mesuré 27 collisions entre le vocabulaire auto et la carte de France
 *  (`Cayenne`, `Léon`, `Versailles`, `Calais`…) et tranché que « la priorité va
 *  au vocabulaire automobile, la géographie ne l'emporte que sur marqueur
 *  explicite d'intention géographique ». */
const PREPOSITIONS_LIEU = new Set(["a", "vers", "sur", "pres", "proche", "autour", "region", "secteur"]);

// ---------------------------------------------------------------------------
// Sortie
// ---------------------------------------------------------------------------

export interface ElementReconnu {
  /** Clé de filtre produite, ou pseudo-clé pour un élément reconnu mais non
   *  filtrable (`generation`, `places`, `portes`, `rayon`). */
  champ: string;
  /** Libellé affiché à l'acheteur (« Marque », « Énergie », « Génération »). */
  libelle: string;
  /** Valeur affichée. */
  valeur: string;
  /** `false` = reconnu mais aucun champ ne peut le porter : le token est retiré
   *  du texte et l'acheteur en est informé, plutôt qu'un filtre faux ou un
   *  terme qui garantirait zéro résultat. */
  filtrable: boolean;
  /** Précision affichée entre parenthèses pour un élément non filtrable — la
   *  raison, pas seulement le fait. « Génération : 3 (critère indisponible) »
   *  se comprend ; « Génération : 3 (non filtrable) » n'explique rien. */
  note?: string;
}

export interface Normalisation {
  /** Paramètres de filtre dérivés, au format exact de l'URL de la page
   *  catégorie (donc consommables tels quels par `buildAnnonceConditions`). */
  derives: Record<string, string>;
  /** Ce qui reste à chercher en texte, ou `null` si tout est devenu filtre —
   *  c'est l'indicateur des 82 % de la §14.3 (Résultat n°4). */
  residu: string | null;
  /** Ce qui a été compris, pour l'affichage. */
  reconnus: ElementReconnu[];
  /** Journal du Résultat n°9 de la §14.3 : « le résidu est l'indicateur à
   *  instrumenter en production ». À brancher sur le journal d'événements
   *  (action n°79). */
  journal: {
    tokens: number;
    tokensConsommes: number;
    residuTokens: string[];
    correctionsFloues: { avant: string; apres: string }[];
  };
}

// ---------------------------------------------------------------------------
// Outils
// ---------------------------------------------------------------------------

/** Distance de Levenshtein bornée. Bornée et non complète parce que seule la
 *  réponse « ≤ plafond » nous intéresse : au-delà on abandonne, ce qui évite de
 *  remplir une matrice pour rien sur des chaînes visiblement différentes.
 *  La §14.3 (Résultat n°6) a explicitement écarté le `difflib` du prototype
 *  (ratio de sous-séquences) au profit de Levenshtein pour la production. */
export function levenshteinBorne(a: string, b: string, plafond: number): number {
  if (Math.abs(a.length - b.length) > plafond) return plafond + 1;
  let precedente = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const courante = [i, ...new Array<number>(b.length).fill(0)];
    let minLigne = i;
    for (let j = 1; j <= b.length; j++) {
      courante[j] = Math.min(
        precedente[j] + 1,
        courante[j - 1] + 1,
        precedente[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      minLigne = Math.min(minLigne, courante[j]);
    }
    if (minLigne > plafond) return plafond + 1;
    precedente = courante;
  }
  return precedente[b.length];
}

/** Les trois garde-fous du rattrapage flou (§14.3, Résultat n°6), dans l'ordre
 *  où ils ont été mesurés :
 *   - jamais sur un token contenant un chiffre (`308`/`208`/`508`, `A3`/`A4`,
 *     `C3`/`C4` sont à une substitution les uns des autres — c'est l'argument
 *     qui avait fait choisir Typesense au §14.1, il s'applique ici à
 *     l'identique) ;
 *   - jamais sur un token de moins de 4 caractères, pour la même raison ;
 *   - plafond de 1 en dessous de 8 caractères, 2 au-delà. */
function plafondFlou(token: string): number | null {
  if (token.length < 4) return null;
  if (/\d/.test(token)) return null;
  return token.length < 8 ? 1 : 2;
}

/** Mots que le rattrapage flou n'a PAS le droit de corriger. Trouvé par la
 *  mesure, comme tout le reste de ce fichier, et c'est le pire faux positif
 *  rencontré : « voiture auto occasion » devenait `modele=Alto` (Suzuki Alto, à
 *  une transposition de « auto ») et « voiture pas cher » devenait
 *  `marque=CHERY`. Un mot vide du domaine est, par définition, à faible
 *  information : lui laisser produire un filtre est le scénario exact que la
 *  règle n°1 du fichier interdit. C'est le Résultat n°8 de la §14.3 sous une
 *  troisième forme — la liste de mots vides ne sert pas seulement à nettoyer le
 *  résidu, elle protège aussi le correcteur. */
const JAMAIS_CORRIGES = new Set([...MOTS_VIDES, "auto", "autos"]);

function meilleureCorrection(token: string, cles: Iterable<string>): string | null {
  if (JAMAIS_CORRIGES.has(token)) return null;
  const plafond = plafondFlou(token);
  if (plafond === null) return null;
  let meilleure: string | null = null;
  let meilleurScore = plafond + 1;
  for (const cle of cles) {
    if (cle.includes(" ") || /\d/.test(cle) || cle.length < 4) continue;
    const d = levenshteinBorne(token, cle, plafond);
    if (d < meilleurScore) {
      meilleurScore = d;
      meilleure = cle;
    } else if (d === meilleurScore && meilleure !== null && cle !== meilleure) {
      // Ex æquo : on renonce. Une correction ambiguë est un filtre faux en
      // puissance, et la règle n°1 du fichier tranche contre.
      meilleure = null;
    }
  }
  return meilleurScore <= plafond ? meilleure : null;
}

/** Nombre écrit à la française : « 10 000 », « 10.000 », « 10,000 ». */
function lireNombre(brut: string): number | null {
  const chiffres = brut.replace(/[ ., ]/g, "");
  if (!/^\d+$/.test(chiffres)) return null;
  const valeur = Number(chiffres);
  return Number.isFinite(valeur) ? valeur : null;
}

const ROMAINS: Record<string, number> = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8 };

// ---------------------------------------------------------------------------
// Le normaliseur
// ---------------------------------------------------------------------------

/**
 * Normalise une requête de recherche automobile. Fonction pure, sans accès
 * base ni réseau : le référentiel entier tient en mémoire du processus (§14.3,
 * Résultat n°4 — « tout le référentiel tient dans moins de 75 Ko compressés »,
 * ce qui a clos le débat « service dédié ou module » en faveur du module).
 */
export interface OptionsNormalisation {
  /** Une marque est déjà fixée par ailleurs (filtre explicite de l'acheteur, ou
   *  déduction d'un passage précédent). */
  marqueConnue?: boolean;
  /** Un modèle est déjà fixé par ailleurs. */
  modeleConnu?: boolean;
}

export function normaliserRequeteAuto(entree: string, options: OptionsNormalisation = {}): Normalisation {
  const derives: Record<string, string> = {};
  const reconnus: ElementReconnu[] = [];
  const correctionsFloues: { avant: string; apres: string }[] = [];

  const ajouter = (champ: string, libelle: string, valeur: string, filtrable = true, note?: string) => {
    if (!reconnus.some((r) => r.champ === champ && r.valeur === valeur)) {
      reconnus.push({ champ, libelle, valeur, filtrable, note });
    }
  };
  /** Un filtre déjà posé n'est jamais écrasé : le premier marqueur rencontré
   *  gagne, ce qui rend la fonction stable quand la même requête est
   *  re-normalisée (voir `appliquerNormaliseur`). */
  const poser = (cle: string, valeur: string) => {
    if (derives[cle] === undefined) derives[cle] = valeur;
  };

  // --- étage 1 : repliage ------------------------------------------------
  // Même table que l'indexation plein texte (§14.7, Résultat n°1) : le pliage
  // est ce qui rend le `num_typos=0` du §14.2 inoffensif sur les marques.
  let chaine = plierAccents(entree)
    .replace(/[’ʼ]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/ /g, " ");

  // --- étage 2 : expressions avant tokens --------------------------------
  // Un seuil en langage naturel est une *expression*, pas un mot : reconnu et
  // retiré de la chaîne avant tout découpage, sans quoi ses chiffres iront
  // alimenter les faux positifs de l'étage 5 (§14.3, Résultat n°5).

  // « entre 5000 et 10000 € » — traité avant les seuils simples, dont il
  // contient les mots-clés.
  chaine = chaine.replace(
    /\bentre\s+([0-9][0-9 .,]*)\s*(?:€|euros?|k€?|kms?)?\s+et\s+([0-9][0-9 .,]*)\s*(k€|keuros?|kms?|kw|ch(?:evaux)?|cv|k|€|euros?|eur)?(?![a-z0-9])/g,
    (_m, bas: string, haut: string, unite: string | undefined) => {
      const a = lireNombre(bas);
      const b = lireNombre(haut);
      if (a === null || b === null) return " ";
      appliquerSeuil("min", Math.min(a, b), unite, poser, ajouter);
      appliquerSeuil("max", Math.max(a, b), unite, poser, ajouter);
      return " ";
    }
  );

  const DIRECTIONS_MAX = /moins de|- ?de|maxi(?:mum)?|max\.?|jusqu'a|sous|budget|inferieur a|<=?/;
  const DIRECTIONS_MIN = /plus de|a partir de|au moins|mini(?:mum)?|depuis|superieur a|>=?/;
  // ORDRE SIGNIFICATIF : les unités les plus longues d'abord. `k` placé avant
  // `km` mangerait le « k » de « 150 000 km » et laisserait un « m » orphelin —
  // le seuil serait lu comme un prix de 150 000 € au lieu d'un kilométrage.
  const UNITES = /k€|keuros?|kms?|kw|ch(?:evaux)?|cv|k|€|euros?|eur/;

  // Forme préfixée : « moins de 10 000 € », « à partir de 2018 », « - de 100 000 km ».
  // `(?<![a-z0-9])` et non `\b` : `\b` ne matche pas devant le tiret de « - de »
  // (deux caractères non-mot consécutifs), et laisserait donc passer la forme la
  // plus fréquente sur les places d'annonces françaises.
  chaine = chaine.replace(
    new RegExp(
      `(?<![a-z0-9])(${DIRECTIONS_MAX.source}|${DIRECTIONS_MIN.source})\\s*([0-9][0-9 .,]*)\\s*(?:(${UNITES.source})(?![a-z0-9]))?`,
      "g"
    ),
    (_m, direction: string, nombre: string, unite: string | undefined) => {
      const valeur = lireNombre(nombre);
      if (valeur === null) return " ";
      const sens = new RegExp(`^(?:${DIRECTIONS_MIN.source})$`).test(direction.trim()) ? "min" : "max";
      appliquerSeuil(sens, valeur, unite, poser, ajouter);
      return " ";
    }
  );

  // Forme suffixée : « 10 000 € max », « 150 000 km maxi ».
  chaine = chaine.replace(
    new RegExp(
      `\\b([0-9][0-9 .,]*)\\s*(${UNITES.source})(?![a-z0-9])\\s*(${DIRECTIONS_MAX.source}|${DIRECTIONS_MIN.source})`,
      "g"
    ),
    (_m, nombre: string, unite: string, direction: string) => {
      const valeur = lireNombre(nombre);
      if (valeur === null) return " ";
      const sens = new RegExp(`^(?:${DIRECTIONS_MIN.source})$`).test(direction.trim()) ? "min" : "max";
      appliquerSeuil(sens, valeur, unite, poser, ajouter);
      return " ";
    }
  );

  // Rayon autour d'un lieu : « dans 30 km de Bordeaux », « dans un rayon de
  // 50 km autour de Limoges ». Le rayon lui-même n'est PAS filtrable — il
  // exige un couple lat/lng, donc un géocodage que ce module ne fait pas
  // (action n°227) ; seul le nom de lieu est retenu.
  chaine = chaine.replace(
    /\bdans\s+(?:un\s+rayon\s+de\s+)?([0-9]{1,3})\s*kms?\s+(?:de|autour de|d')\s*([a-z' -]{3,40})/g,
    (_m, rayon: string, lieu: string) => {
      poser("localisation", lieu.trim());
      ajouter("localisation", "Localisation", lieu.trim());
      ajouter("rayon", "Rayon", `${rayon} km`, false, "rayon non appliqué, faute de géocodage");
      return " ";
    }
  );

  // --- étage 3 : marqueurs explicites ------------------------------------
  // Département sous forme explicite. C'est le SEUL chemin vers un filtre
  // géographique numérique : « dép. 87 », « (87) », « dans le 87 »,
  // « département 87 ». Un « 87 » nu, jamais (§14.3, Résultat n°5).
  chaine = chaine.replace(
    /\b(?:dep\.?|dept\.?|departement|dans le|du)\s*(0[1-9]|[1-8][0-9]|9[0-5]|2[ab]|97[1-6])\b/g,
    (_m, dep: string) => {
      poser("codePostal", dep);
      ajouter("codePostal", "Département", dep);
      return " ";
    }
  );
  chaine = chaine.replace(/\((0[1-9]|[1-8][0-9]|9[0-5]|2[ab]|97[1-6])\)/g, (_m, dep: string) => {
    poser("codePostal", dep);
    ajouter("codePostal", "Département", dep);
    return " ";
  });

  // Puissance avec unité. Intervalle et non égalité : personne ne cherche
  // exactement 90 ch (§14.3, Résultat n°3, étage 3).
  chaine = chaine.replace(/\b([0-9]{1,3})\s*(ch|chevaux|cv|kw)\b/g, (_m, nombre: string, unite: string) => {
    const brut = Number(nombre);
    // « 5 cv », « 7 cv » : puissance *fiscale*, qui n'a pas de champ au schéma
    // et qui n'est pas une puissance DIN. En dessous de 40, on ne filtre pas.
    if (unite === "cv" && brut < 40) return " ";
    const din = unite === "kw" ? Math.round(brut * 1.36) : brut;
    if (din < 40 || din > 900) return " ";
    poser("puissanceDin_min", String(Math.max(0, din - 10)));
    poser("puissanceDin_max", String(din + 10));
    ajouter("puissanceDin", "Puissance", `${din} ch (±10)`);
    return " ";
  });

  // Seuil à unité nue, sans mot de direction : « clio 150 000 km »,
  // « golf 8000 € ». Traité comme un **plafond** — un acheteur qui cite un
  // kilométrage ou un prix dans un champ de recherche donne ce qu'il accepte au
  // maximum, pas un minimum. Cette règle a un second effet, qui est la vraie
  // raison de sa présence ici : sans elle, « 90000 km » serait ramassé par la
  // règle du code postal juste en dessous et l'acheteur se retrouverait filtré
  // sur le Territoire de Belfort — le faux positif silencieux de la §14.3
  // (Résultat n°5), dans une variante que le prototype n'avait pas vue.
  chaine = chaine.replace(/\b([0-9][0-9 .,]*)\s*(kms?)(?![a-z0-9])/g, (_m, nombre: string) => {
    const valeur = lireNombre(nombre);
    if (valeur === null) return " ";
    appliquerSeuil("max", valeur, "km", poser, ajouter);
    return " ";
  });
  chaine = chaine.replace(/\b([0-9][0-9 .,]*)\s*(k€|k|€|euros?)(?!\s*kms?\b)(?![a-z0-9])/g, (_m, nombre: string, unite: string) => {
    const valeur = lireNombre(nombre);
    if (valeur === null) return " ";
    appliquerSeuil("max", valeur, unite, poser, ajouter);
    return " ";
  });

  // Code postal à 5 chiffres — marqueur non ambigu au sens de la §14.3, et
  // filtré en préfixe par `buildAnnonceConditions` (donc « 87000 » comme
  // « 87 » fonctionnent). Collision assumée et documentée : un prix nu écrit
  // sans unité (« clio 33000 ») sera lu comme un code postal. Un acheteur qui
  // donne un budget écrit « 33000 € » ou « moins de 33000 » neuf fois sur dix,
  // et ces deux formes sont consommées à l'étage 2, avant d'arriver ici.
  chaine = chaine.replace(/\b((?:0[1-9]|[1-8][0-9]|9[0-8])[0-9]{3})\b(?!\s*(?:km|€|euro|ch|cv|kw))/g, (_m, cp: string) => {
    poser("codePostal", cp);
    ajouter("codePostal", "Code postal", cp);
    return " ";
  });

  // --- découpage ---------------------------------------------------------
  // `.` et `-` conservés à l'intérieur d'un token (`id.3`, `t-roc`, `cx-5`,
  // `e-208`, `4x4`, `s-max`), retirés en bordure.
  const tokens = chaine
    .split(/[^a-z0-9.\-+&#:]+/)
    .map((t) => t.replace(/^[.\-+&#:]+|[.\-+&#:]+$/g, ""))
    .filter(Boolean);
  const consommes = new Array<boolean>(tokens.length).fill(false);
  const cle = (debut: number, longueur: number) => tokens.slice(debut, debut + longueur).join(" ");
  const libre = (debut: number, longueur: number) => consommes.slice(debut, debut + longueur).every((c) => !c);
  const consommer = (debut: number, longueur: number) => {
    for (let i = debut; i < debut + longueur; i++) consommes[i] = true;
  };

  // --- étage 4a : bigrammes de facettes, AVANT les mots vides ------------
  // C'est le Résultat n°8 de la §14.3, et l'ordre est le résultat lui-même :
  // la v2 du prototype avait cassé « suv 7 places boite auto » en retirant
  // `auto` comme mot vide avant d'avoir reconnu « boîte auto ».
  for (let i = 0; i < tokens.length - 1; i++) {
    if (!libre(i, 2)) continue;
    const bigramme = cle(i, 2);
    const boite = BOITE_BIGRAMMES[bigramme];
    if (boite) {
      poser("boite", boite);
      ajouter("boite", "Boîte", boite);
      consommer(i, 2);
      continue;
    }
    if (bigramme === "sans permis") {
      poser("permis", "Sans permis (voiturette)");
      ajouter("permis", "Permis", "Sans permis (voiturette)");
      consommer(i, 2);
      continue;
    }
    // « 5 places », « 3 portes » : reconnus pour empêcher le nombre de devenir
    // une génération (le bug « kangoo 5 places » de la §14.3, Résultat n°5),
    // mais aucun champ ne les porte → non filtrables, donc retirés du texte.
    const nombrePlaces = /^([2-9])$/.exec(tokens[i]);
    if (nombrePlaces && (tokens[i + 1] === "places" || tokens[i + 1] === "place")) {
      ajouter("places", "Places", nombrePlaces[1], false, "critère indisponible");
      consommer(i, 2);
      continue;
    }
    if (nombrePlaces && (tokens[i + 1] === "portes" || tokens[i + 1] === "porte")) {
      ajouter("portes", "Portes", nombrePlaces[1], false, "critère indisponible");
      consommer(i, 2);
    }
  }

  // --- étage 4b : réservation des modèles multi-mots ---------------------
  // Un nom de modèle peut CONTENIR un nom de marque : « range rover evoque »
  // contient `Rover`, qui est une marque du catalogue. Sans cette passe, la
  // reconnaissance de marque consommait « rover », après quoi le trigramme
  // « range rover evoque » ne pouvait plus être vu — sortie mesurée :
  // `marque=ROVER`, résidu « range », c'est-à-dire un filtre faux ET un terme
  // qui vide la page. Les indices couverts par un n-gramme de modèle de deux
  // mots ou plus sont donc réservés : la passe marque les saute, la passe
  // modèle les reprend.
  const reserves = new Array<boolean>(tokens.length).fill(false);
  for (let longueur = Math.min(LARGEUR_MAX_MODELE, tokens.length); longueur >= 2; longueur--) {
    for (let i = 0; i + longueur <= tokens.length; i++) {
      if (!libre(i, longueur)) continue;
      if (!MODELES_PAR_CLE.has(cle(i, longueur))) continue;
      if (reserves.slice(i, i + longueur).some((r) => r)) continue;
      for (let j = i; j < i + longueur; j++) reserves[j] = true;
    }
  }

  // --- étage 5a : marque (bigramme puis unigramme) -----------------------
  let marqueReconnue: string | null = null;
  for (let longueur = 2; longueur >= 1 && marqueReconnue === null; longueur--) {
    for (let i = 0; i + longueur <= tokens.length; i++) {
      if (!libre(i, longueur)) continue;
      if (reserves.slice(i, i + longueur).some((r) => r)) continue;
      const k = cle(i, longueur);
      const valeurs = MARQUES_LOOKUP.get(k);
      if (!valeurs) continue;
      marqueReconnue = valeurs[0];
      poser("marque", valeurs.join(","));
      ajouter("marque", "Marque", valeurs[0]);
      consommer(i, longueur);
      break;
    }
  }

  // --- étage 5b : modèle (trigramme → bigramme → unigramme) --------------
  const modelesRetenus: string[] = [];
  let indexDernierModele = -1;
  for (let longueur = Math.min(LARGEUR_MAX_MODELE, tokens.length); longueur >= 1; longueur--) {
    for (let i = 0; i + longueur <= tokens.length; i++) {
      if (!libre(i, longueur)) continue;
      const candidats = MODELES_PAR_CLE.get(cle(i, longueur));
      if (!candidats) continue;
      // Priorité à la marque déjà reconnue en cas d'homonymie de modèle
      // (§14.3, Résultat n°3, étage 5) : « porsche cayenne » est un Cayenne,
      // pas autre chose ; « seat leon » un Leon Seat et non Cupra.
      const pertinents = marqueReconnue
        ? candidats.filter((c) => c.marque === marqueReconnue)
        : candidats;
      const retenus = pertinents.length > 0 ? pertinents : candidats;
      for (const c of retenus) if (!modelesRetenus.includes(c.valeur)) modelesRetenus.push(c.valeur);
      // Inférence de marque à partir du modèle : seulement si elle est
      // *certaine*. Deux raisons de s'en abstenir sinon — une marque fausse est
      // un filtre faux (règle n°1), et une marque inférée n'ajoute aucune
      // précision à un filtre modèle qui vient du même mot.
      const marques = new Set(retenus.map((c) => c.marque));
      if (marqueReconnue === null && marques.size === 1) {
        const seule = [...marques][0];
        // Ne pas poser `marque` : l'annonce dont la colonne `marque` est vide
        // mais le modèle rempli serait exclue pour rien. On le signale
        // seulement à l'affichage.
        ajouter("marqueDeduite", "Marque", seule, false, "déduite du modèle, non filtrée");
      }
      // Un préfixe électrique (`e-208`, `ë-C4`, `e-tron`) porte l'énergie.
      if (/^(e|ë)[-.]/.test(cle(i, longueur))) {
        poser("carburant", "Électrique");
        ajouter("carburant", "Énergie", "Électrique");
      }
      consommer(i, longueur);
      indexDernierModele = i + longueur - 1;
    }
  }
  if (modelesRetenus.length > 0) {
    poser("modele", modelesRetenus.join(","));
    ajouter("modele", "Modèle", modelesRetenus[0]);
  }

  // --- étage 6 : génération ----------------------------------------------
  // Chiffre romain ou arabe SUIVANT un modèle. Reconnue, affichée, retirée du
  // texte — mais pas filtrée : `annonces` n'a aucun champ `generation`
  // (action n°225). La laisser dans `q` serait pire que l'abandonner : le
  // vecteur d'une annonce « Clio III » ne contient pas « 3 », donc le terme
  // garantirait zéro résultat. « phase 2 » est traité comme une génération.
  if (indexDernierModele >= 0 && indexDernierModele + 1 < tokens.length) {
    let i = indexDernierModele + 1;
    if (tokens[i] === "phase" && i + 1 < tokens.length) i++;
    if (libre(i, 1)) {
      const t = tokens[i];
      const romain = ROMAINS[t];
      const arabe = /^[1-8]$/.test(t) ? Number(t) : null;
      const generation = romain ?? arabe;
      if (generation !== undefined && generation !== null) {
        ajouter("generation", "Génération", String(generation), false, "critère indisponible au schéma");
        consommer(indexDernierModele + 1, i - indexDernierModele);
      }
    }
  }

  // --- étage 7 : facettes simples ---------------------------------------
  for (let i = 0; i < tokens.length; i++) {
    if (consommes[i]) continue;
    const t = tokens[i];
    const carburant = CARBURANT_PAR_CLE[t];
    if (carburant) {
      poser("carburant", carburant);
      ajouter("carburant", "Énergie", carburant);
      consommes[i] = true;
      continue;
    }
    // `auto` exclu ici par construction : il n'est boîte automatique qu'en
    // bigramme (étage 4a). Le lexique unigramme ne contient que des formes
    // sans ambiguïté (`automatique`, `bva`, `dsg`…).
    const boite = t === "auto" || t === "autos" ? undefined : BOITE_PAR_CLE[t];
    if (boite) {
      poser("boite", boite);
      ajouter("boite", "Boîte", boite);
      consommes[i] = true;
      continue;
    }
    const type = TYPE_VEHICULE_PAR_CLE[t];
    if (type) {
      poser("typeVehicule", type);
      ajouter("typeVehicule", "Type", type);
      consommes[i] = true;
      continue;
    }
    // Année nue. Après l'étage 5 : un modèle gagne toujours sur une année, ce
    // qui règle la seule collision réelle du marché français — la **Peugeot
    // 2008**, qui est à la fois un nom de modèle et un millésime plausible.
    if (/^(19[5-9][0-9]|20[0-2][0-9])$/.test(t)) {
      poser("annee_min", t);
      poser("annee_max", t);
      ajouter("annee", "Année", t);
      consommes[i] = true;
    }
  }

  // --- étage 7b : lieu sur préposition explicite -------------------------
  for (let i = 0; i < tokens.length - 1; i++) {
    if (consommes[i] || consommes[i + 1]) continue;
    if (!PREPOSITIONS_LIEU.has(tokens[i])) continue;
    let j = i + 1;
    // « près de Lyon », « autour de Limoges » : la préposition composée.
    if ((tokens[j] === "de" || tokens[j] === "d") && j + 1 < tokens.length) j++;
    const lieu = tokens[j];
    if (!lieu || consommes[j] || lieu.length < 3 || /\d/.test(lieu)) continue;
    // Un mot du vocabulaire auto n'est jamais un lieu, même derrière « à » :
    // c'est l'a priori du domaine de la §14.3 (Résultat n°7).
    if (MARQUES_PAR_CLE.has(lieu) || MODELES_PAR_CLE.has(lieu) || MOTS_VIDES.has(lieu)) continue;
    if (derives.localisation === undefined) {
      poser("localisation", lieu);
      ajouter("localisation", "Localisation", lieu);
      consommer(i, j - i + 1);
    }
  }

  // --- étage 8a : rattrapage flou --------------------------------------
  // Toute la tolérance aux fautes vit ici : une égalité de filtre n'en a
  // aucune (§14.3, Résultat n°6), donc `peugot 3008` doit être corrigé avant
  // l'émission du filtre ou ne jamais être reconnu.
  for (let i = 0; i < tokens.length; i++) {
    if (consommes[i]) continue;
    const t = tokens[i];
    if (marqueReconnue === null && !options.marqueConnue) {
      const correction = meilleureCorrection(t, MARQUES_LOOKUP.keys());
      if (correction) {
        const valeurs = MARQUES_LOOKUP.get(correction) as string[];
        marqueReconnue = valeurs[0];
        poser("marque", valeurs.join(","));
        ajouter("marque", "Marque", valeurs[0]);
        correctionsFloues.push({ avant: t, apres: correction });
        consommes[i] = true;
        continue;
      }
    }
    // Le rattrapage flou sur les modèles ne s'exécute pas si un modèle est
    // déjà connu — ni reconnu dans cette requête, ni fixé par le contexte. Ce
    // n'est pas une optimisation : c'est ce qui rend `appliquerNormaliseur`
    // idempotente. Sur « citroën c3 picaso », le premier passage reconnaît C3
    // et laisse « picaso » en résidu (limite mesurée en §14.3, Résultat n°6 :
    // la faute porte sur le second terme d'un bigramme) ; sans cette garde, un
    // second passage sur le seul résidu corrigerait « picaso » et changerait le
    // résultat de la page selon le nombre d'appels.
    if (modelesRetenus.length === 0 && !options.modeleConnu) {
      const correction = meilleureCorrection(t, MODELES_PAR_CLE.keys());
      if (correction) {
        const candidats = MODELES_PAR_CLE.get(correction) as CandidatModele[];
        const pertinents = marqueReconnue ? candidats.filter((c) => c.marque === marqueReconnue) : candidats;
        const retenus = pertinents.length > 0 ? pertinents : candidats;
        for (const c of retenus) if (!modelesRetenus.includes(c.valeur)) modelesRetenus.push(c.valeur);
        poser("modele", modelesRetenus.join(","));
        ajouter("modele", "Modèle", modelesRetenus[0]);
        correctionsFloues.push({ avant: t, apres: correction });
        consommes[i] = true;
      }
    }
  }

  // --- étage 8b : mots vides, puis résidu -------------------------------
  const residuTokens: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    if (consommes[i]) continue;
    if (MOTS_VIDES.has(tokens[i])) continue;
    residuTokens.push(tokens[i]);
  }

  // Le résidu n'est pas un échec (§14.3, Résultat n°9) : « gt line », « allure »,
  // « shine », « bluehdi », « dci » sont des finitions et des motorisations
  // commerciales, c'est-à-dire le champ `version` du §14.2 — ce qui n'est pas
  // énumérable reste du texte. Un normaliseur qui viderait `q` à 100 % serait
  // un mauvais normaliseur.
  const residu = residuTokens.length > 0 ? residuTokens.join(" ") : null;

  return {
    derives,
    residu,
    reconnus,
    journal: {
      tokens: tokens.length,
      tokensConsommes: consommes.filter(Boolean).length,
      residuTokens,
      correctionsFloues,
    },
  };
}

/**
 * Classement d'un seuil numérique. Séparé parce qu'il est appelé par trois
 * formes syntaxiques et que sa règle d'unité est une mesure de terrain :
 * « moins de 100 km » signifie 100 000 km, jamais 100 — un seuil kilométrique
 * entre 10 et 999 est multiplié par 1 000 ; « 10 k » et « 10 000 € » sont le
 * même prix (§14.3, Résultat n°3, étage 2).
 */
function appliquerSeuil(
  sens: "min" | "max",
  valeurBrute: number,
  unite: string | undefined,
  poser: (cle: string, valeur: string) => void,
  ajouter: (champ: string, libelle: string, valeur: string, filtrable?: boolean) => void
) {
  const u = (unite ?? "").trim();
  const suffixe = sens === "min" ? "min" : "max";
  const libelleSens = sens === "min" ? "à partir de" : "jusqu'à";

  if (u === "km" || u === "kms") {
    const km = valeurBrute >= 10 && valeurBrute < 1000 ? valeurBrute * 1000 : valeurBrute;
    poser(`kilometrage_${suffixe}`, String(km));
    ajouter("kilometrage", "Kilométrage", `${libelleSens} ${km.toLocaleString("fr-FR")} km`);
    return;
  }
  if (u === "ch" || u === "chevaux" || u === "cv") {
    if (valeurBrute < 40 || valeurBrute > 900) return;
    poser(`puissanceDin_${suffixe}`, String(valeurBrute));
    ajouter("puissanceDin", "Puissance", `${libelleSens} ${valeurBrute} ch`);
    return;
  }
  if (u === "k" || u === "k€" || u === "keuro" || u === "keuros") {
    const prix = valeurBrute < 1000 ? valeurBrute * 1000 : valeurBrute;
    poser(`prix_${suffixe}`, String(prix));
    ajouter("prix", "Prix", `${libelleSens} ${prix.toLocaleString("fr-FR")} €`);
    return;
  }
  if (u === "€" || u === "euro" || u === "euros" || u === "eur") {
    poser(`prix_${suffixe}`, String(valeurBrute));
    ajouter("prix", "Prix", `${libelleSens} ${valeurBrute.toLocaleString("fr-FR")} €`);
    return;
  }
  // Sans unité. Un nombre dans la plage des millésimes est une année (« à
  // partir de 2018 ») ; tout le reste est un prix (« moins de 8000 »). Le seul
  // cas réellement ambigu — « moins de 100 000 », qui peut être un prix ou un
  // kilométrage — est tranché en faveur du prix, parce qu'un acheteur qui parle
  // kilométrage écrit presque toujours « km ».
  if (valeurBrute >= 1950 && valeurBrute <= 2029) {
    poser(`annee_${suffixe}`, String(valeurBrute));
    ajouter("annee", "Année", `${libelleSens} ${valeurBrute}`);
    return;
  }
  poser(`prix_${suffixe}`, String(valeurBrute));
  ajouter("prix", "Prix", `${libelleSens} ${valeurBrute.toLocaleString("fr-FR")} €`);
}

// ---------------------------------------------------------------------------
// Branchement
// ---------------------------------------------------------------------------

/** Clés de paramètres que le normaliseur a le droit de produire. Sert de
 *  contrôle : une clé inventée ici serait ignorée par `buildAnnonceConditions`
 *  sans le moindre signal. */
export const CLES_DERIVABLES = [
  "marque", "modele", "carburant", "boite", "typeVehicule", "permis",
  "annee_min", "annee_max", "prix_min", "prix_max",
  "kilometrage_min", "kilometrage_max", "puissanceDin_min", "puissanceDin_max",
  "codePostal", "localisation",
] as const;

/**
 * Applique le normaliseur aux paramètres d'une recherche. **Idempotente** : le
 * `q` de sortie est le résidu, sur lequel une seconde exécution ne reconnaît
 * plus rien (par construction : tout ce qui était reconnaissable a été
 * consommé), et un paramètre déjà présent n'est jamais écrasé. C'est ce qui
 * autorise à l'appeler à la fois dans `buildAnnonceConditions` — pour que les
 * trois lecteurs des mêmes filtres (page catégorie, page `/recherche`,
 * comptage des recherches sauvegardées) ne puissent pas diverger — et dans la
 * page, qui a besoin du même résultat pour l'affichage et les compteurs.
 *
 * Deux bornes au périmètre, toutes deux volontaires :
 *
 *  - **verticale automobile uniquement.** Le catalogue de LBT est complet
 *    depuis le 2026-08-17 (§4.2) : « clio » sur Mode ne doit pas produire
 *    `marque=RENAULT`, et sur la recherche transverse `/recherche` un filtre
 *    `marque` exclurait d'un coup toutes les rubriques non automobiles — ce qui
 *    est exactement le contraire du rôle d'orientation que la §14.7
 *    (Résultat n°5) donne à cette page.
 *  - **`?brut=1` désactive la normalisation.** C'est l'échappatoire offerte à
 *    l'acheteur depuis l'état vide : si les filtres déduits ne rendent rien, un
 *    lien lui rend la recherche en texte intégral. Un normaliseur sans porte de
 *    sortie est un normaliseur qu'on ne peut pas déboguer en production.
 */
export function appliquerNormaliseur(
  categorie: string | null,
  params: Record<string, string | undefined>
): Record<string, string | undefined> {
  if (categorie !== "vehicules") return params;
  if (params.brut === "1") return params;
  const q = params.q;
  if (!q || !q.trim()) return params;

  const normalisation = normaliserRequeteAuto(q, {
    marqueConnue: Boolean(params.marque),
    modeleConnu: Boolean(params.modele),
  });
  if (normalisation.reconnus.length === 0) return params;

  const sortie: Record<string, string | undefined> = { ...params };
  for (const [k, v] of Object.entries(normalisation.derives)) {
    if (!sortie[k]) sortie[k] = v;
  }
  sortie.q = normalisation.residu ?? undefined;
  return sortie;
}
