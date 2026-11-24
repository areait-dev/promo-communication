import type { Metadata } from "next";
import { ContactPageForm } from "@/components/ContactPageForm";
import { ContactPanel } from "@/components/ContactPanel";
import { PageFx } from "@/components/PageFx";
import { CONTACT_LEAD } from "@/data/contact";
import { vars } from "@/lib/ui";

export const metadata: Metadata = { title: "Contatti" };

export default function Contatti() {
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
          <ContactPageForm />
          <ContactPanel />
        </div>
      </section>
    </>
  );
}
