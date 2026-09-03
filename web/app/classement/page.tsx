import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DocumentLegalVue from "@/components/DocumentLegalVue";
import { CLASSEMENT } from "@/lib/legal/classement";

export const metadata: Metadata = {
  title: `${CLASSEMENT.titre} — lebontruc.fr`,
  description: CLASSEMENT.sousTitre,
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="wrap legal-main">
        <DocumentLegalVue doc={CLASSEMENT} />
      </main>
      <SiteFooter />
    </>
  );
}
