import Link from "next/link";
import { OublieForm } from "./OublieForm";

export const metadata = { title: "Mot de passe oublié — lebontruc" };

export default function MotDePasseOubliePage() {
  return (
    <main style={{ maxWidth: 480, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Mot de passe oublié</h1>
      <p style={{ color: "var(--text-muted, #69727d)" }}>
        Indiquez l&apos;adresse de votre compte : nous vous enverrons un lien pour choisir un nouveau
        mot de passe.
      </p>
      <OublieForm />
      <p style={{ marginTop: "1.5rem" }}>
        <Link href="/compte/connexion">Retour à la connexion</Link>
      </p>
    </main>
  );
}
