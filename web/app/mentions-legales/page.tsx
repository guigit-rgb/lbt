import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DocumentLegalVue from "@/components/DocumentLegalVue";
import { MENTIONS_LEGALES } from "@/lib/legal/mentions-legales";

export const metadata: Metadata = {
  title: `${MENTIONS_LEGALES.titre} — lebontruc.fr`,
  description: MENTIONS_LEGALES.sousTitre,
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="wrap legal-main">
        <DocumentLegalVue doc={MENTIONS_LEGALES} />
      </main>
      <SiteFooter />
    </>
  );
}
