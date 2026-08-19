"use client";

import { useState } from "react";
import SondageModal from "@/components/SondageModal";

export function AnnonceFeedbackGate() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <SondageModal
      contexte="depot_annonce"
      question="À quel point a-t-il été facile de déposer votre annonce ?"
      onClose={() => setVisible(false)}
    />
  );
}
