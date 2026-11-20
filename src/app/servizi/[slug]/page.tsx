import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectList } from "@/components/ProjectList";
import { Cta, Head, Pager } from "@/components/blocks";
import { FEAT, ICONS, SERVICES, SVC_CAT, svcById } from "@/data/services";
import { PROJECTS } from "@/data/projects";
import { svcHref, vars } from "@/lib/ui";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = svcById((await params).slug);
  return { title: s?.name };
}

export default async function Servizio({ params }: { params: Promise<{ slug: string }> }) {
  const s = svcById((await params).slug);
  if (!s) notFound();

  const i = SERVICES.indexOf(s);
  const prev = SERVICES[(i + SERVICES.length - 1) % SERVICES.length];
  const next = SERVICES[(i + 1) % SERVICES.length];
  const feat = FEAT[s.id];
  const items: [string, string, string][] = feat ? feat.items : s.tags.map((x) => [x, "bulb", ""]);
  const cat = SVC_CAT[s.id];
  const list = PROJECTS.filter((p) => cat && p.cats.includes(cat));

  return (
    <>
      <section className="svc-hero on-brand">
        <div className="wrap">
          <div>
            <h1 className="pc-reveal" style={vars({ "--i": 1 })}>
              {s.name}
            </h1>
            <p className="lead pc-reveal" style={vars({ "--i": 2 })}>
              {s.p1}
            </p>
          </div>
          <div className="pc-bubble pc-bubble--lg bb pc-reveal" style={vars({ "--i": 3 })}>
            <p className="bb-t">{s.p2 || s.boost}</p>
          </div>
        </div>
      </section>
      <section className="sec feat-sec">
        <div className="wrap">
          <div className="feat-head pc-reveal">
            <h2>Cosa facciamo</h2>
            <p>{feat?.intro ?? ""}</p>
          </div>
          <ul className="feat">
            {items.map((f, k) => (
              <li key={f[0]} className="pc-reveal" style={vars({ "--i": k % 3 })}>
                <span className="feat-ic">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d={ICONS[f[1]]} />
                  </svg>
                </span>
                <h3>{f[0]}</h3>
                <p>{f[2]}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="sec svc-proj">
        <div className="wrap">
          <Head title={"Progetti di " + s.name} />
          {list.length ? (
            <ProjectList list={list} mode="service" />
          ) : (
            <p className="svc-proj-empty pc-reveal">I progetti di {s.name} arrivano presto.</p>
          )}
          <div className="svc-proj-cta pc-reveal">
            <Link className="pc-btn pc-btn--ghost" href="/portfolio">
              Vedi tutto il portfolio <span className="pc-btn__arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
      <Pager
        label="Altri servizi"
        prev={prev.name}
        next={next.name}
        prevHref={svcHref(prev.id)}
        nextHref={svcHref(next.id)}
        prevLabel="← Servizio precedente"
        nextLabel="Servizio successivo →"
      />
      <Cta />
    </>
  );
}
