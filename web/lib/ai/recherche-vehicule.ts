import Anthropic from "@anthropic-ai/sdk";
import { MARQUES_CATALOGUE } from "@/lib/marques";
import { TYPES_VEHICULE, CARBURANTS, BOITES } from "@/lib/vehicule-types";

const MODEL = "claude-haiku-4-5";

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export interface FiltresRecherche {
  typeVehicule?: string;
  marque?: string;
  carburant?: string;
  boite?: string;
  prix_min?: number;
  prix_max?: number;
  annee_min?: number;
  annee_max?: number;
}

// "Toutes les valeurs des paramètres extraits doivent venir de ces listes" est
// imposé par le schéma de l'outil (enum), pas seulement demandé dans le
// texte — Claude ne peut pas halluciner une marque ou un type absents du
// catalogue LBT, le tool_choice force l'appel et le typage de l'input.
const OUTIL_FILTRES: Anthropic.Tool = {
  name: "extraire_filtres",
  description: "Extrait les critères de recherche véhicule exprimés dans une phrase en langage naturel.",
  input_schema: {
    type: "object",
    properties: {
      typeVehicule: { type: "string", enum: [...TYPES_VEHICULE] },
      marque: { type: "string", enum: [...MARQUES_CATALOGUE] },
      carburant: { type: "string", enum: [...CARBURANTS] },
      boite: { type: "string", enum: [...BOITES] },
      prix_min: { type: "number", description: "Prix minimum en euros" },
      prix_max: { type: "number", description: "Prix maximum en euros" },
      annee_min: { type: "number", description: "Année-modèle minimum, ex. 2015" },
      annee_max: { type: "number", description: "Année-modèle maximum" },
    },
  },
};

// Point de vigilance coût/abus (cahier des charges, décision du 2026-08-22) :
// cette fonction est appelée depuis une route publique sans authentification
// (app/api/ai/recherche-vehicule/route.ts) — TOUJOURS passer par
// lib/rate-limit.ts avant de l'appeler, ne jamais l'exposer sans ce garde-fou.
export async function extraireFiltresRecherche(texte: string): Promise<FiltresRecherche> {
  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 300,
    tools: [OUTIL_FILTRES],
    tool_choice: { type: "tool", name: "extraire_filtres" },
    messages: [
      {
        role: "user",
        content: [
          "Un internaute décrit la voiture qu'il cherche sur un site de petites annonces automobiles. Extrait uniquement les critères qu'il exprime clairement — n'invente rien, laisse un champ absent si la phrase ne le précise pas.",
          `Phrase : "${texte}"`,
        ].join("\n"),
      },
    ],
  });

  const toolUse = response.content.find((block): block is Anthropic.ToolUseBlock => block.type === "tool_use");
  if (!toolUse) return {};

  const input = toolUse.input as Record<string, unknown>;
  const resultat: FiltresRecherche = {};
  if (typeof input.typeVehicule === "string") resultat.typeVehicule = input.typeVehicule;
  if (typeof input.marque === "string") resultat.marque = input.marque;
  if (typeof input.carburant === "string") resultat.carburant = input.carburant;
  if (typeof input.boite === "string") resultat.boite = input.boite;
  if (typeof input.prix_min === "number") resultat.prix_min = input.prix_min;
  if (typeof input.prix_max === "number") resultat.prix_max = input.prix_max;
  if (typeof input.annee_min === "number") resultat.annee_min = input.annee_min;
  if (typeof input.annee_max === "number") resultat.annee_max = input.annee_max;
  return resultat;
}
