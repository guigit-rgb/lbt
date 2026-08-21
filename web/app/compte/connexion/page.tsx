import AuthCard from "@/components/AuthCard";
import { destinationInterne } from "@/lib/auth-redirect";
import { LoginForm } from "./LoginForm";

// Titre contextuel, sur le modèle de la référence lacentrale.fr : quand le
// visiteur a été intercepté par `proxy.ts` en cliquant « Déposer une annonce »,
// l'écran le dit et le ramène ensuite là où il allait. Le libellé n'est donc
// pas décoratif — il décrit la destination réellement mémorisée.
export default async function ConnexionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const next = destinationInterne(sp.next);
  const versDepot = next?.startsWith("/compte/annonces/nouvelle") ?? false;

  return (
    <AuthCard
      onglet="connexion"
      titre={versDepot ? "Dépôt d'annonce" : "Mon compte"}
      lede={
        versDepot
          ? "Identifiez-vous pour publier une annonce."
          : "Identifiez-vous pour retrouver vos annonces et vos messages."
      }
      next={next}
    >
      <LoginForm next={next} />
    </AuthCard>
  );
}
