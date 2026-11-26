import type { Metadata } from "next";
import Link from "next/link";
import { Boost } from "@/components/Boost";
import { ContactForm } from "@/components/ContactForm";
import { ElasticGrid } from "@/components/ElasticGrid";
import { Slider } from "@/components/Slider";
import { SocialLinks } from "@/components/SocialLinks";
import { Star } from "@/components/Star";
import { Head, JoinCard, Marquee, TeamCard } from "@/components/blocks";
import { SvcIndex } from "@/components/SvcIndex";
import { getContent } from "@/lib/content";
import { svcHref, vars } from "@/lib/ui";
import { PageFx } from "@/components/PageFx";
import { HOME_DESC, HOME_TITLE, seoMeta } from "@/lib/seo";

// Titolo e descrizione: quelli scritti in Yoast nella pagina "Home", se compilati.
export const generateMetadata = (): Promise<Metadata> => seoMeta({ title: HOME_TITLE, description: HOME_DESC, path: "/", absolute: true });

export default async function Home() {
  const { projects, services, team: TEAM, contact } = await getContent();
  const { email: EMAIL, phone: PHONE, address: ADDRESS } = contact;
  return (
    <>
      <section className="hero hero-elastic ctl-host">
        <ElasticGrid />
        <Star className="pc-star--spin bigstar" />
        <div className="wrap" style={{ position: "relative" }}>
          <div className="pc-reveal" style={vars({ "--i": 1 })}>
            <Boost
              words={["Brand", "Reputation", "Idea", "Event", "Campaign", "Business"]}
              hrefs={[svcHref("brand-identity"), svcHref("brand-reputation"), "/contatti", svcHref("event-management"), svcHref("comunicazione-politica"), "/servizi"]}
              tag="h1"
            />
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
        <PageFx />
      </section>
      <Marquee />
      <section className="sec alt sec-story">
        <div className="wrap split">
          <div className="pc-bubble pc-bubble--lg big-bubble pc-reveal">
            <p className="q">
              La nostra storia comincia <em>inside</em>
            </p>
            <p className="q-sub">Nati dentro Promotergroup S.p.a., al fianco delle imprese ogni giorno.</p>
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
          <Slider projects={projects} />
        </div>
      </section>
      <section className="sec alt">
        <div className="wrap">
          <Head title="Cosa mettiamo in boost" />
          <SvcIndex />
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
            <ul className="contact-list pc-reveal" style={vars({ "--i": 1 })}>
              {EMAIL && (
                <li>
                  <span className="contact-list__k">Email</span>
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </li>
              )}
              <li>
                <span className="contact-list__k">Telefono</span>
                <a href={PHONE.href}>{PHONE.label}</a>
              </li>
              <li>
                <span className="contact-list__k">Indirizzo</span>
                <address>
                  {ADDRESS[0]}
                  <br />
                  {ADDRESS[1]}
                </address>
              </li>
              <li>
                <span className="contact-list__k">Social</span>
                <SocialLinks />
              </li>
            </ul>
          </div>
          <div className="form">
            <ContactForm services={services.list} phone={PHONE} />
          </div>
        </div>
      </section>
    </>
  );
}
