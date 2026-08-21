import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { annonces, recherchesSauvegardees, type Categorie } from "@/lib/db/schema";
import { getFiltersForCategory } from "@/lib/listing-config";
import { buildAnnonceConditions } from "@/lib/annonce-filters";

export interface RechercheSauvegardee {
  id: string;
  categorie: Categorie;
  categorieLabel: string;
  libelleFiltres: string;
  href: string;
  nombreResultats: number;
}

// Un résumé lisible des filtres choisis ("Marque : Renault, Prix : 0-20 000")
// à partir des libellés déjà définis dans lib/listing-config.ts — jamais
// dupliqués ici.
function libelleFiltres(categorie: Categorie, filtres: Record<string, string>): string {
  const config = getFiltersForCategory(categorie);
  const morceaux: string[] = [];

  if (filtres.localisation) morceaux.push(filtres.localisation);

  for (const filtre of config.filters) {
    if (filtre.widget === "select" && filtres[filtre.key]) {
      morceaux.push(`${filtre.label} : ${filtres[filtre.key]}`);
    }
    if (filtre.widget === "range") {
      const min = filtres[`${filtre.key}_min`];
      const max = filtres[`${filtre.key}_max`];
      if (min || max) morceaux.push(`${filtre.label} : ${min || "0"}–${max || "∞"}`);
    }
  }

  return morceaux.length > 0 ? morceaux.join(" · ") : "Toutes les annonces";
}

export async function listerRecherchesSauvegardees(userId: string): Promise<RechercheSauvegardee[]> {
  const rows = await db
    .select()
    .from(recherchesSauvegardees)
    .where(eq(recherchesSauvegardees.userId, userId))
    .orderBy(desc(recherchesSauvegardees.createdAt));

  return Promise.all(
    rows.map(async (r) => {
      const filtres = r.filtres as Record<string, string>;
      const conditions = buildAnnonceConditions(r.categorie, filtres);
      const [{ value: nombreResultats }] = await db
        .select({ value: count() })
        .from(annonces)
        .where(and(...conditions));

      const params = new URLSearchParams(filtres);
      if (r.tri !== "pertinence") params.set("tri", r.tri);
      const query = params.toString();

      return {
        id: r.id,
        categorie: r.categorie,
        categorieLabel: getFiltersForCategory(r.categorie).label,
        libelleFiltres: libelleFiltres(r.categorie, filtres),
        href: `/${r.categorie}${query ? `?${query}` : ""}`,
        nombreResultats,
      };
    })
  );
}
