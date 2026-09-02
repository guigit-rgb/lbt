import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Instancié à la première requête, pas au chargement du module — même raison
// que `lib/stripe.ts` (cahier des charges §14.12, action §17 n°217) : `next
// build` évalue ce module pour collecter les routes API, et `neon()` REFUSE
// une chaîne vide dès le chargement. Conséquence mesurée le 2026-09-02 :
// `npm run build` échouait sur `/api/ai/recherche-vehicule` sans
// `DATABASE_URL`, ce qui obligeait la CI — et les cinq contrôles hors base de
// `scripts/verif-*.ts`, qui n'ouvrent aucune connexion — à porter une valeur
// factice. Une compilation ne doit pas dépendre d'un secret de production.
//
// Différence avec `lib/stripe.ts` : les méthodes sont **liées** à l'instance
// réelle avant d'être rendues. Sans cela, `db.select(...)` s'exécuterait avec
// `this` = le mandataire, et le jour où drizzle utilisera un champ privé
// (`#x`, inaccessible à travers un Proxy) l'appel lèverait une erreur de type
// à l'exécution, très loin de sa cause.
type BaseDeDonnees = ReturnType<typeof creer>;

function creer() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL n'est pas définie : aucune requête ne peut être servie. " +
        "Une compilation (`next build`) et les contrôles `scripts/verif-*.ts` " +
        "n'en ont pas besoin ; une requête réelle, si.",
    );
  }
  return drizzle({ client: neon(url), schema });
}

let instance: BaseDeDonnees | undefined;

export const db = new Proxy({} as BaseDeDonnees, {
  get(_cible, propriete) {
    instance ??= creer();
    const valeur = Reflect.get(instance as object, propriete);
    return typeof valeur === "function" ? valeur.bind(instance) : valeur;
  },
}) as BaseDeDonnees;
