import { and, ilike, or, sql, type SQL } from "drizzle-orm";
import { annonces } from "@/lib/db/schema";
import { MAX_LONGUEUR_REQUETE } from "@/lib/search-constants";

// Recherche plein texte de la V0, en SQL.
//
// Le moteur retenu par le cahier des charges (§14.1) est Typesense, avec un
// tri en paliers `_text_match(buckets: 10)` puis popularité puis fraîcheur
// (§14.2, Résultat n°5). Rien de tout cela n'existe encore : ni index, ni
// score de popularité, ni normaliseur de requête. En attendant, la barre de
// recherche de l'en-tête ne renvoyait nulle part (`action="#"`), ce qui est
// pire que le résultat approximatif ci-dessous.
//
// Ce que cette couche fait, et ses limites assumées :
//   - un `ILIKE '%mot%'` par mot sur sept colonnes, donc aucune tolérance aux
//     fautes de frappe, aucune racinisation (« pneus » ne trouve pas « pneu »)
//     et aucune synonymie ;
//   - deux paliers de pertinence seulement (titre puis description), là où le
//     §14.2 en prévoit dix ;
//   - un balayage séquentiel : sans index trigramme, le coût croît
//     linéairement avec le catalogue. Acceptable aux volumes actuels, à
//     remplacer par le vrai moteur avant la mise en production.
// Tout est isolé ici pour que ce remplacement ne touche qu'un fichier.

// Au-delà de huit mots, chaque mot supplémentaire ajoute une clause `ILIKE`
// sur sept colonnes sans rien apporter à la précision du résultat.
const MAX_MOTS = 8;

// Colonnes visées par la recherche. `titre`, `marque` et `modele` composent le
// libellé affiché d'une annonce (cf. `annonceToRowData`) : un mot qui tombe
// dans l'une des trois est donc visible directement dans les résultats, ce qui
// justifie de les traiter comme un seul palier de pertinence.
const COLONNES_TITRE = [annonces.titre, annonces.marque, annonces.modele] as const;
const COLONNES_SECONDAIRES = [
  annonces.description,
  annonces.sousCategorie,
  annonces.typeAnimal,
  annonces.ville,
] as const;

// `%` et `_` sont les jokers de LIKE. Sans échappement, une requête réduite à
// « % » ramènerait tout le catalogue et « _ » n'importe quel caractère : ce
// n'est pas une injection (Drizzle paramètre la valeur) mais ce n'est pas non
// plus ce que l'utilisateur a demandé.
function motif(mot: string): string {
  return `%${mot.replace(/[\\%_]/g, (caractere) => `\\${caractere}`)}%`;
}

export function motsRecherche(q: string): string[] {
  return q.trim().slice(0, MAX_LONGUEUR_REQUETE).split(/\s+/).filter(Boolean).slice(0, MAX_MOTS);
}

// Chaque mot doit apparaître quelque part (ET entre les mots, OU entre les
// colonnes) : « clio diesel » ne doit pas ramener toutes les Clio.
export function conditionRecherche(mots: string[]): SQL | undefined {
  return and(
    ...mots.map((mot) => {
      const p = motif(mot);
      return or(...[...COLONNES_TITRE, ...COLONNES_SECONDAIRES].map((colonne) => ilike(colonne, p)));
    })
  );
}

// Palier de pertinence, à utiliser en `asc()` : 0 quand tous les mots tombent
// dans le libellé de l'annonce, 1 quand l'un d'eux n'est que dans la
// description ou la ville. La fraîcheur départage à l'intérieur de chaque
// palier, comme le fait le tri par défaut d'une page catégorie.
export function ordrePertinence(mots: string[]): SQL {
  if (mots.length === 0) return sql`0`;
  const surLeLibelle = and(
    ...mots.map((mot) => {
      const p = motif(mot);
      return or(...COLONNES_TITRE.map((colonne) => ilike(colonne, p)));
    })
  );
  return sql`case when ${surLeLibelle} then 0 else 1 end`;
}
