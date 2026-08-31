import Link from "next/link";
import { ReinitialiserForm } from "./ReinitialiserForm";

export const metadata = { title: "Nouveau mot de passe — lebontruc" };

export default async function ReinitialiserPage({
  searchParams,
}: {
  searchParams: Promise<{ jeton?: string }>;
}) {
  const { jeton } = await searchParams;

  if (!jeton) {
    return (
      <main style={{ maxWidth: 480, margin: "4rem auto", padding: "0 1rem" }}>
        <h1>Lien incomplet</h1>
        <p>
          Ce lien ne contient pas de jeton de réinitialisation.{" "}
          <Link href="/compte/mot-de-passe-oublie">Refaire une demande</Link>.
        </p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 480, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Choisir un nouveau mot de passe</h1>
      <ReinitialiserForm jeton={jeton} />
    </main>
  );
}
