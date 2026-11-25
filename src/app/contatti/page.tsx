import type { Metadata } from "next";
import { ContactPageForm } from "@/components/ContactPageForm";
import { ContactPanel } from "@/components/ContactPanel";
import { PageFx } from "@/components/PageFx";
import { CONTACT_LEAD } from "@/data/contact";
import { vars } from "@/lib/ui";
import { pageMeta } from "@/lib/seo";
import { getContent } from "@/lib/content";

export const metadata: Metadata = pageMeta({
  title: "Contatti",
  path: "/contatti",
  description:
    "Scrivici due righe: ti rispondiamo entro 24 ore lavorative con una prima idea. Siamo a Vittoria (RG), in Via del Carrubo.",
});

export default async function Contatti() {
  const { services, contact } = await getContent();
  return (
    <>
      <section className="hero ct-hero ctl-host">
        <div className="wrap">
          <h1 className="pc-reveal page-h1" style={vars({ "--i": 1 })}>
            Raccontaci il tuo progetto
          </h1>
          <p className="lead pc-reveal" style={vars({ "--i": 2 })}>
            {CONTACT_LEAD}
          </p>
        </div>
        <PageFx />
      </section>

      <section className="sec ct-sec">
        <div className="wrap ct-grid">
          <ContactPageForm services={services.list} phone={contact.phone} />
          <ContactPanel />
        </div>
      </section>
    </>
  );
}
