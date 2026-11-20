import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { vars } from "@/lib/ui";

export const metadata: Metadata = { title: "Contatti" };

export default function Contatti() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: "var(--space-12)" }}>
        <div className="wrap">
          <h1 className="pc-reveal page-h1" style={vars({ "--i": 1 })}>
            Raccontaci il tuo progetto
          </h1>
        </div>
      </section>
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap contact">
          <div className="form">
            <ContactForm kind="contact" />
          </div>
          <div className="info pc-reveal" style={vars({ "--i": 1 })}>
            <p className="info-row">
              <svg className="info-ic" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
              </svg>
              <span>
                <a href="tel:+390932862613">+39 0932 862613</a>
              </span>
            </p>
            <p className="info-row">
              <svg className="info-ic" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
              </svg>
              <span>
                Via del Carrubo sn
                <br />
                Vittoria (RG)
              </span>
            </p>
            <p className="info-row">
              <svg className="info-ic" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3.5 12a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0M15.5 6a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0M15.5 18a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6" />
              </svg>
              <span>
                <a href="#" data-soon>Facebook</a> · <a href="#" data-soon>Instagram</a> · <a href="#" data-soon>LinkedIn</a> ·{" "}
                <a href="#" data-soon>YouTube</a>
              </span>
            </p>
            <p style={{ font: "400 15px/1.5 var(--font-body)", color: "var(--ink-muted)" }}>
              PromoCommunication è un brand di Promotergroup S.p.a.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
