import Link from "next/link";
import { SignupForm } from "./SignupForm";

export default function InscriptionPage() {
  return (
    <main style={{ maxWidth: 480, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Créer un compte</h1>
      <SignupForm />
      <p style={{ marginTop: "1.5rem" }}>
        Déjà un compte ? <Link href="/compte/connexion">Connectez-vous</Link>
      </p>
    </main>
  );
}
