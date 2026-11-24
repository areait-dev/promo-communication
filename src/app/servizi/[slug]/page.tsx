import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { ProjectList } from "@/components/ProjectList";
import { Head, Pager } from "@/components/blocks";
import { ContactPageForm } from "@/components/ContactPageForm";
import { ContactPanel } from "@/components/ContactPanel";
import { FEAT, ICONS, SERVICES, SVC_CAT, svcById } from "@/data/services";
import { PROJECTS } from "@/data/projects";
import { svcHref, vars } from "@/lib/ui";
import { PageFx } from "@/components/PageFx";

// Tutti gli slug sono noti in fase di build (generateStaticParams): la pagina e' statica, niente Suspense con fallback
// (farebbe comparire un fallback prima del contenuto e romperebbe l'elemento condiviso voce -> hero).
export const instant = false;

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
      <section className="svc-hero on-brand ctl-host">
        <div className="wrap">
          <div>
            {/* destinazione dell'elemento condiviso: niente reveal, deve esserci subito */}
            <ViewTransition name={`svc-title-${s.id}`} share="pc-morph" default="none">
              <h1>{s.name}</h1>
            </ViewTransition>
            <p className="lead pc-reveal" style={vars({ "--i": 2 })}>
              {s.p1}
            </p>
          </div>
          <div className="pc-bubble pc-bubble--lg bb pc-reveal" style={vars({ "--i": 3 })}>
            <p className="bb-t">{s.p2 || s.boost}</p>
          </div>
        </div>
        <PageFx />
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
      <section className="sec ct-sec" id="info">
        <div className="wrap">
          <Head title={"Vuoi saperne di più su " + s.name + "?"} />
          <p className="lead pc-reveal" style={vars({ "--i": 1, marginTop: "16px", marginBottom: "32px" })}>
            Scrivici due righe: ti rispondiamo entro 24 ore lavorative.
          </p>
        </div>
        <div className="wrap ct-grid">
          <ContactPageForm defaultService={s.id} />
          <ContactPanel />
        </div>
      </section>
    </>
  );
}
