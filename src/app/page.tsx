import Link from "next/link";
import { Boost } from "@/components/Boost";
import { ContactForm } from "@/components/ContactForm";
import { ElasticGrid } from "@/components/ElasticGrid";
import { Slider } from "@/components/Slider";
import { Star } from "@/components/Star";
import { Head, JoinCard, Marquee, SvcList, TeamCard } from "@/components/blocks";
import { HOME_ORDER } from "@/data/services";
import { TEAM } from "@/data/team";
import { vars } from "@/lib/ui";

export default function Home() {
  return (
    <>
      <section className="hero hero-elastic">
        <ElasticGrid />
        <Star className="pc-star--spin bigstar" />
        <div className="wrap" style={{ position: "relative" }}>
          <div className="pc-reveal" style={vars({ "--i": 1 })}>
            <Boost words={["Brand", "Reputation", "Idea", "Event", "Business"]} tag="h1" />
          </div>
          <p className="lead hero-lead pc-reveal" style={vars({ "--i": 2 })}>
            Diamo forma, voce e spazio a quello che la tua impresa fa ogni giorno.
          </p>
          <div className="ctas pc-reveal" style={vars({ "--i": 3 })}>
            <Link className="pc-btn pc-btn--accent" href="/contatti">
              Raccontaci la tua idea <span className="pc-btn__arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
      <Marquee />
      <section className="sec alt sec-story">
        <div className="wrap split">
          <div className="pc-bubble pc-bubble--lg big-bubble pc-reveal">
            <p className="q">
              La nostra storia comincia <em>inside</em>
            </p>
          </div>
          <div className="pc-reveal" style={vars({ "--i": 1 })}>
            <p className="p-lg">
              Prima di raccontarle le imprese, le abbiamo viste lavorare. Arriviamo da <strong>Promotergroup Spa.</strong>, un gruppo
              di consulenza che ogni giorno affianca centinaia di organizzazioni, e da lì ci portiamo dietro una cosa preziosa:
              sappiamo quanta fatica c’è dietro un buon risultato. Nel 2026 abbiamo deciso di metterla in vetrina.
            </p>
            <Link className="pc-btn" href="/chi-siamo">
              Leggi di più: Chi siamo <span className="pc-btn__arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          <Head title="Progetti che abbiamo fatto (e che rifaremmo domani)" />
          <Slider />
        </div>
      </section>
      <section className="sec alt">
        <div className="wrap">
          <Head title="Cosa mettiamo in boost" />
          <SvcList ids={HOME_ORDER} />
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          <Head title="Il team" />
          <div className="team-grid">
            {TEAM.map((t, i) => (
              <TeamCard key={t.n} t={t} i={i} />
            ))}
            <JoinCard />
          </div>
        </div>
      </section>
      <section className="sec alt">
        <div className="wrap contact contact-home">
          <div>
            <Head title="Raccontaci la tua idea, noi mettiamo il boost!" />
          </div>
          <div className="form">
            <ContactForm kind="home" />
          </div>
        </div>
      </section>
    </>
  );
}
