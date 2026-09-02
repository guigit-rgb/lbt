import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Instance drizzle **sans pilote**, réservée aux contrôles `scripts/verif-*.ts`
 * (cahier des charges §14.12, action §17 n°217).
 *
 * Pourquoi elle existe. Quatre des cinq contrôles hors base du dépôt
 * (`verif-recherche-sql`, `verif-recherche-prefixe`, `verif-normaliseur-auto`,
 * `verif-deduction-vehicule`) n'appellent que `.toSQL()` : ils vérifient la
 * **forme** du SQL émis, jamais son résultat. Ils importaient pourtant le
 * client de production, ce qui les obligeait à porter une `DATABASE_URL`
 * factice — un détail documenté dans l'en-tête de chacun, et un piège : un
 * contrôle qui exige une chaîne de connexion peut, à une ligne près, en ouvrir
 * une. `drizzle.mock()` n'a aucun pilote (son `$client` est typé comme
 * indisponible), donc l'accident devient structurellement impossible.
 *
 * NE JAMAIS l'importer depuis `app/`, `components/` ou le reste de `lib/` :
 * toute requête émise sur cette instance lèverait une erreur à l'exécution.
 * Le client réel est `lib/db/client.ts`.
 */
export const dbSqlSeul = drizzle.mock({ schema });
