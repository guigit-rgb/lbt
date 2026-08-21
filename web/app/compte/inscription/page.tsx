import AuthCard from "@/components/AuthCard";
import { destinationInterne } from "@/lib/auth-redirect";
import { SignupForm } from "./SignupForm";

export default async function InscriptionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const next = destinationInterne(sp.next);
  const versDepot = next?.startsWith("/compte/annonces/nouvelle") ?? false;

  return (
    <AuthCard
      onglet="inscription"
      titre={versDepot ? "Dépôt d'annonce" : "Créer un compte"}
      lede={
        versDepot
          ? "Créez votre compte pour publier une annonce."
          : "Quelques secondes, et vos annonces vous suivent."
      }
      next={next}
    >
      <SignupForm next={next} />
    </AuthCard>
  );
}
