import Link from "next/link";
import { LoginForm } from "./LoginForm";

export default function ConnexionPage() {
  return (
    <main style={{ maxWidth: 480, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Se connecter</h1>
      <LoginForm />
      <p style={{ marginTop: "1.5rem" }}>
        Pas encore de compte ? <Link href="/compte/inscription">Inscrivez-vous</Link>
      </p>
    </main>
  );
}
