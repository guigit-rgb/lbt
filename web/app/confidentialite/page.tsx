import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DocumentLegalVue from "@/components/DocumentLegalVue";
import { CONFIDENTIALITE } from "@/lib/legal/confidentialite";

export const metadata: Metadata = {
  title: `${CONFIDENTIALITE.titre} — lebontruc.fr`,
  description: CONFIDENTIALITE.sousTitre,
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="wrap legal-main">
        <DocumentLegalVue doc={CONFIDENTIALITE} />
      </main>
      <SiteFooter />
    </>
  );
}
