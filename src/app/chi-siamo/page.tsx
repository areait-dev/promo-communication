import type { Metadata } from "next";
import Link from "next/link";
import { ElasticGrid } from "@/components/ElasticGrid";
import { Ill } from "@/components/Ill";
import { Star } from "@/components/Star";
import { Cta, Marquee } from "@/components/blocks";
import { vars } from "@/lib/ui";
import { PageFx } from "@/components/PageFx";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Chi siamo",
  path: "/chi-siamo",
  description:
    "La Unit di Comunicazione & Marketing di Promotergroup: un team creativo che conosce le imprese dall’interno e le aiuta a rendere visibile ciò che vale.",
});

export default function ChiSiamo() {
  return (
    <>
      <section className="about-hero ctl-host">
        <ElasticGrid />
        <Star className="pc-star--spin bigstar" />
        <div className="wrap" style={{ position: "relative" }}>
          <h1 className="pc-reveal" style={vars({ "--i": 1 })}>
            Tutto è cominciato dentro un’impresa
          </h1>
          <p className="lead pc-reveal" style={vars({ "--i": 2 })}>
            La nostra storia comincia <em>inside</em>: siamo la Unit di Comunicazione &amp; Marketing di Promotergroup. Da lì abbiamo
            imparato a <strong>guardare le imprese da vicino, molto da vicino</strong>.
          </p>
          <p className="lead pc-reveal" style={vars({ "--i": 3, marginTop: "20px" })}>
            Abbiamo visto come nascono le decisioni, quanta strada c’è dietro un risultato e quante buone idee restano chiuse in un
            cassetto, mentre altre diventano progetti veri. Per questo, quando parliamo di imprese,{" "}
            <strong>sappiamo di cosa parliamo</strong>.
          </p>
        </div>
        <PageFx />
      </section>
      <section className="sec alt">
        <div className="wrap split">
          <div className="pc-bubble pc-bubble--lg big-bubble bulb-bubble pc-reveal">
            <div className="bulb-box">
              <Ill name="teamico" />
            </div>
            <p className="q">Un team di professionisti</p>
          </div>
          <div className="pc-reveal" style={vars({ "--i": 1 })}>
            <p className="p-lg">
              Creativi, copywriter, graphic designer, gente che parla fluentemente la lingua degli algoritmi e chi con i giornalisti
              si dà del tu. Ognuno arriva con il suo background, il suo stile e qualche sana fissazione.
            </p>
            <p className="p">
              A tenerci insieme è un modo di lavorare: <strong>comunicare in modo efficace</strong>, così che il valore di un brand
              arrivi intero (e integro) al destinatario. Senza fronzoli, senza giri di parole. Autentici, come piace a noi.
            </p>
            <Link className="pc-btn pc-btn--ghost" href="/team">
              Conosci il team <span className="pc-btn__arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="wrap split split-rev">
          <div className="pc-reveal">
            <p className="p-lg">
              Ogni giorno imprese e persone fanno cose importanti. Le fanno, le dicono, ci mettono la faccia. Poi, troppo spesso,
              tutto resta chiuso in ufficio, non arriva a chi dovrebbe, o ci arriva storto.
            </p>
            <p className="p">
              <strong>Noi accendiamo la luce</strong>. Diamo forma, voce e spazio a quello che fai, a quello che dici e a quello che
              gli altri raccontano di te. In pratica <strong>raccontiamo ‘imprese’ quotidiane</strong>, in tutti i sensi.
            </p>
          </div>
          <div className="pc-bubble pc-bubble--lg pc-bubble--accent big-bubble bulb-bubble pc-reveal" style={vars({ "--i": 1 })}>
            <div className="bulb-box">
              <Ill name="bulb" />
            </div>
            <p className="q">Rendere visibile ciò che vale</p>
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="wrap split">
          <div className="pc-bubble pc-bubble--lg pc-bubble--light big-bubble bulb-bubble pc-reveal">
            <div className="bulb-box">
              <Ill name="wand" />
            </div>
            <p className="q">Come lavoriamo (senza bacchetta magica)</p>
          </div>
          <div className="pc-reveal" style={vars({ "--i": 1 })}>
            <p className="p-lg">
              Si parte sempre da un caffè, o da un brief, che è la stessa cosa ma con più appunti. Ascoltiamo la tua storia e il
              mercato in cui ti muovi, e da lì disegniamo la strategia. È lei a scegliere gli strumenti, non il contrario.
            </p>
            <p className="p">Poi teniamo gli occhi sui risultati, per capire cosa funziona e alzare l’asticella un passo alla volta.</p>
          </div>
        </div>
      </section>
      <Marquee />
      <Cta />
    </>
  );
}
