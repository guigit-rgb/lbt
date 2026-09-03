import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DocumentLegalVue from "@/components/DocumentLegalVue";
import { COOKIES } from "@/lib/legal/cookies";

export const metadata: Metadata = {
  title: `${COOKIES.titre} — lebontruc.fr`,
  description: COOKIES.sousTitre,
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="wrap legal-main">
        <DocumentLegalVue doc={COOKIES} />
      </main>
      <SiteFooter />
    </>
  );
}
