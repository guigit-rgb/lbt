import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DocumentLegalVue from "@/components/DocumentLegalVue";
import { DROITS_ET_OBLIGATIONS } from "@/lib/legal/droits-et-obligations";

export const metadata: Metadata = {
  title: `${DROITS_ET_OBLIGATIONS.titre} — lebontruc.fr`,
  description: DROITS_ET_OBLIGATIONS.sousTitre,
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="wrap legal-main">
        <DocumentLegalVue doc={DROITS_ET_OBLIGATIONS} />
      </main>
      <SiteFooter />
    </>
  );
}
