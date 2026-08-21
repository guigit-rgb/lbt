"use client";

import { signOut } from "next-auth/react";

export function DeconnexionButton({ className = "btn btn-outline" }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => signOut({ callbackUrl: "/" })}>
      Me déconnecter
    </button>
  );
}
