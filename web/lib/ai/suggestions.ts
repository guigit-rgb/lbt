import Anthropic from "@anthropic-ai/sdk";
import { MEGA_MENU, AUTRES_ENTRY, DONS_ENTRY } from "@/lib/categories";
import { CATEGORIES, type Categorie } from "@/lib/db/schema";

const MODEL = "claude-haiku-4-5";

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export interface CategorySuggestion {
  categorie: Categorie;
  sousCategorie?: string;
  label: string;
}

// Liste des 14 catégories, avec leur libellé uniquement — PAS les sous-menus
// (qui mélangent marques de véhicules, en-têtes sans lien, etc., et ne
// correspondent pas à un champ `sousCategorie` réel dans le schéma). Seule
// `loisirs` a une vraie colonne `sousCategorie` en base : on lui donne donc
// en plus la liste de ses sous-catégories concrètes (mêmes libellés que le
// menu déroulant du formulaire de dépôt), pour rester cohérent.
function buildTaxonomyText(): string {
  const lines = MEGA_MENU.map((entry) => `${entry.categorie} (${entry.label})`);
  lines.push(`${AUTRES_ENTRY.categorie} (${AUTRES_ENTRY.label})`);
  lines.push(`${DONS_ENTRY.categorie} (${DONS_ENTRY.label})`);

  const loisirs = MEGA_MENU.find((e) => e.categorie === "loisirs");
  if (loisirs) {
    const sousCategories = new Set<string>();
    for (const column of loisirs.columns) {
      for (const group of column) {
        for (const link of group.links) {
          sousCategories.add(link.label);
        }
      }
    }
    lines.push(`Sous-catégories possibles pour "loisirs" uniquement : ${[...sousCategories].join(", ")}`);
  }

  return lines.join("\n");
}

const SUGGEST_TOOL: Anthropic.Tool = {
  name: "suggerer_categories",
  description: "Renvoie jusqu'à 3 suggestions de catégorie/sous-catégorie pour une annonce.",
  input_schema: {
    type: "object",
    properties: {
      suggestions: {
        type: "array",
        maxItems: 3,
        items: {
          type: "object",
          properties: {
            categorie: { type: "string", enum: [...CATEGORIES] },
            sousCategorie: { type: "string" },
            label: {
              type: "string",
              description: "Libellé court affiché à l'utilisateur, ex: 'Véhicules > Voitures'",
            },
          },
          required: ["categorie", "label"],
        },
      },
    },
    required: ["suggestions"],
  },
};

export async function suggererCategorie(titre: string): Promise<CategorySuggestion[]> {
  const taxonomy = buildTaxonomyText();

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 512,
    tools: [SUGGEST_TOOL],
    tool_choice: { type: "tool", name: "suggerer_categories" },
    messages: [
      {
        role: "user",
        content: [
          "Voici le titre d'une annonce de petites annonces qu'un vendeur est en train de rédiger :",
          `"${titre}"`,
          "",
          "Voici les 14 catégories disponibles sur le site (une par ligne, format 'slug (Libellé)') :",
          taxonomy,
          "",
          "Suggère jusqu'à 3 catégories les plus probables pour ce titre, en utilisant uniquement des valeurs de `categorie` qui existent ci-dessus (le slug, pas le libellé). N'utilise `sousCategorie` QUE si `categorie` vaut \"loisirs\", avec une valeur prise dans la liste des sous-catégories loisirs ci-dessus ; pour toute autre catégorie, omets `sousCategorie` (les marques de véhicules ne sont PAS des sous-catégories, ne les utilise jamais ici). `label` doit être un libellé court lisible, ex 'Véhicules' ou 'Loisirs > Sport & Plein air'.",
        ].join("\n"),
      },
    ],
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );
  if (!toolUse) {
    return [];
  }

  const input = toolUse.input as { suggestions?: unknown };
  if (!Array.isArray(input.suggestions)) {
    return [];
  }

  const categorieSet = new Set<string>(CATEGORIES);
  const results: CategorySuggestion[] = [];
  for (const raw of input.suggestions) {
    if (
      raw &&
      typeof raw === "object" &&
      "categorie" in raw &&
      typeof raw.categorie === "string" &&
      categorieSet.has(raw.categorie) &&
      "label" in raw &&
      typeof raw.label === "string"
    ) {
      // Défensif : même si le prompt l'interdit, on ignore sousCategorie
      // hors "loisirs" — c'est la seule catégorie qui a cette colonne en base.
      const sousCategorie =
        raw.categorie === "loisirs" && "sousCategorie" in raw && typeof raw.sousCategorie === "string"
          ? raw.sousCategorie
          : undefined;
      results.push({ categorie: raw.categorie as Categorie, sousCategorie, label: raw.label });
    }
  }
  return results.slice(0, 3);
}

export interface DescriptionFields {
  titre: string;
  categorieLabel: string;
  details?: Record<string, string>;
}

export async function genererDescription(fields: DescriptionFields): Promise<string> {
  const detailsLines = fields.details
    ? Object.entries(fields.details)
        .filter(([, value]) => value)
        .map(([key, value]) => `- ${key}: ${value}`)
        .join("\n")
    : "";

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 400,
    messages: [
      {
        role: "user",
        content: [
          "Rédige une description d'annonce de petites annonces en français, à la première personne, honnête et concrète (pas de superlatifs vides), 3 à 5 phrases maximum.",
          `Titre : ${fields.titre}`,
          `Catégorie : ${fields.categorieLabel}`,
          detailsLines ? `Détails connus :\n${detailsLines}` : "",
          "",
          "Réponds uniquement avec le texte de la description, sans titre ni guillemets.",
        ]
          .filter(Boolean)
          .join("\n"),
      },
    ],
  });

  const textBlock = response.content.find(
    (block): block is Anthropic.TextBlock => block.type === "text"
  );
  return textBlock?.text.trim() ?? "";
}
