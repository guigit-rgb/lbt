import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DocumentLegalVue from "@/components/DocumentLegalVue";
import { CGU } from "@/lib/legal/cgu";

export const metadata: Metadata = {
  title: `${CGU.titre} — lebontruc.fr`,
  description: CGU.sousTitre,
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="wrap legal-main">
        <DocumentLegalVue doc={CGU} />
      </main>
      <SiteFooter />
    </>
  );
}
