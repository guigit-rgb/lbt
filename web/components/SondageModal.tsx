"use client";

import { useState } from "react";
import { soumettreFeedback } from "@/lib/actions/feedback";

const ECHELLE = ["Très facile", "Facile", "Neutre", "Difficile", "Très difficile"];

interface SondageModalProps {
  contexte: string;
  question: string;
  onClose: () => void;
}

export default function SondageModal({ contexte, question, onClose }: SondageModalProps) {
  const [envoye, setEnvoye] = useState(false);
  const [pending, setPending] = useState(false);

  async function repondre(reponse: string) {
    setPending(true);
    await soumettreFeedback(contexte, reponse);
    setPending(false);
    setEnvoye(true);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "var(--paper, #fff)",
          color: "var(--ink, #111)",
          borderRadius: "12px",
          padding: "1.75rem",
          maxWidth: 420,
          width: "90%",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Fermer"
          style={{ float: "right", background: "none", border: "none", fontSize: "1.1rem" }}
        >
          ✕
        </button>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Parlez-nous de votre expérience</h2>

        {envoye ? (
          <>
            <p>Merci pour votre réponse 😊</p>
            <button onClick={onClose} style={{ marginTop: "1rem" }}>
              Fermer
            </button>
          </>
        ) : (
          <>
            <p style={{ marginBottom: "0.75rem" }}>{question}</p>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {ECHELLE.map((option) => (
                <button
                  key={option}
                  disabled={pending}
                  onClick={() => repondre(option)}
                  style={{ textAlign: "left", padding: "0.5rem 0.75rem" }}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
