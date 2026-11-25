import type { Metadata } from "next";
import { CareersForm } from "@/components/CareersForm";
import { ContactPanel } from "@/components/ContactPanel";
import { PageFx } from "@/components/PageFx";
import { CAREERS_LEAD, CAREERS_TITLE } from "@/data/careers";
import { getContent } from "@/lib/content";
import { vars } from "@/lib/ui";
import { seoMeta } from "@/lib/seo";

export const generateMetadata = (): Promise<Metadata> => seoMeta({
  title: "Lavora con noi",
  path: "/lavora-con-noi",
  description:
    "Cerchiamo persone curiose, con idee chiare e voglia di mettersi in gioco. Manda il tuo CV a PromoCommunication e raccontaci chi sei.",
});

export default async function LavoraConNoi() {
  const { roles: OPEN_ROLES, areas, contact } = await getContent();
  return (
    <>
      <section className="hero ct-hero ctl-host">
        <div className="wrap">
          <h1 className="pc-reveal page-h1" style={vars({ "--i": 1 })}>
            {CAREERS_TITLE}
          </h1>
          <p className="lead pc-reveal" style={vars({ "--i": 2 })}>
            {CAREERS_LEAD}
          </p>
        </div>
        <PageFx />
      </section>

      {OPEN_ROLES.length > 0 && (
        <section className="sec cr-roles-sec" aria-labelledby="cr-roles-h">
          <div className="wrap">
            <h2 id="cr-roles-h" className="cr-h pc-reveal">
              Posizioni aperte
            </h2>
            <ul className="cr-roles">
              {OPEN_ROLES.map((r, i) => (
                <li key={r.title} className="cr-role pc-reveal" style={vars({ "--i": Math.min(i, 3) })}>
                  <div>
                    <p className="cr-role__area">{r.area}</p>
                    <h3 className="cr-role__title">{r.title}</h3>
                    {r.where && <p className="cr-role__where">{r.where}</p>}
                    <p className="cr-role__desc">{r.desc}</p>
                  </div>
                  <a className="pc-btn pc-btn--ghost" href="#candidati">
                    Candidati <span className="pc-btn__arrow">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="sec ct-sec">
        <div className="wrap ct-grid">
          <CareersForm areas={areas} phone={contact.phone} />
          <ContactPanel />
        </div>
      </section>
    </>
  );
}
