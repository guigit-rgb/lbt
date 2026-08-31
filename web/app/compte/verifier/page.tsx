import Link from "next/link";
import { verifierAdresse } from "@/lib/actions/mot-de-passe";

export const metadata = { title: "Confirmation d'adresse — lebontruc" };

// La confirmation d'adresse est le seul des quatre messages dont le clic
// PRODUIT un effet sans formulaire. Le jeton est donc consommé au rendu de la
// page, et il est à usage unique (§14.11 R8) : un second passage affiche
// « déjà confirmée », ce qui est vrai et rassurant, plutôt qu'une erreur.
export default async function VerifierPage({
  searchParams,
}: {
  searchParams: Promise<{ jeton?: string }>;
}) {
  const { jeton } = await searchParams;
  const resultat = jeton
    ? await verifierAdresse(jeton)
    : ({ verifie: false, motif: "Ce lien ne contient pas de jeton." } as const);

  return (
    <main style={{ maxWidth: 480, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>{resultat.verifie ? "Adresse confirmée" : "Confirmation impossible"}</h1>
      <p>
        {resultat.verifie
          ? "Merci. Vous recevrez désormais les messages de vos acheteurs et vos alertes à cette adresse."
          : resultat.motif}
      </p>
      <p style={{ marginTop: "1.5rem" }}>
        <Link href="/compte/profil">Aller à mon profil</Link>
      </p>
    </main>
  );
}
