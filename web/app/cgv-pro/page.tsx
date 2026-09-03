import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DocumentLegalVue from "@/components/DocumentLegalVue";
import { CGV_PRO } from "@/lib/legal/cgv-pro";

export const metadata: Metadata = {
  title: `${CGV_PRO.titre} — lebontruc.fr`,
  description: CGV_PRO.sousTitre,
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="wrap legal-main">
        <DocumentLegalVue doc={CGV_PRO} />
      </main>
      <SiteFooter />
    </>
  );
}
