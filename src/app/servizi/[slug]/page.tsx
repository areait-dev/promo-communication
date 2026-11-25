import type { Metadata } from "next";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { ProjectList } from "@/components/ProjectList";
import { Head } from "@/components/blocks";
import { ContactPageForm } from "@/components/ContactPageForm";
import { ContactPanel } from "@/components/ContactPanel";
import { getContent, getPublishedContent, serviceById } from "@/lib/content";
import { vars } from "@/lib/ui";
import { PageFx } from "@/components/PageFx";
import { pageMeta, snip } from "@/lib/seo";

// Tutti gli slug sono noti in fase di build (generateStaticParams): la pagina e' statica, niente Suspense con fallback
// (farebbe comparire un fallback prima del contenuto e romperebbe l'elemento condiviso voce -> hero).
export const instant = false;

export async function generateStaticParams() {
  return (await getPublishedContent()).services.list.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = await getContent();
  const s = serviceById(c, (await params).slug);
  return s ? pageMeta({ title: s.name, path: `/servizi/${s.id}`, description: snip(s.p1), seo: c.seo[`/servizi/${s.id}`] }) : {};
}

export default async function Servizio({ params }: { params: Promise<{ slug: string }> }) {
  const c = await getContent();
  const s = serviceById(c, (await params).slug);
  if (!s) notFound();

  const cat = c.services.cat[s.id];
  const list = c.projects.filter((p) => cat && p.cats.includes(cat));

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
      <section className="sec svc-proj">
        <div className="wrap">
          <Head title={"Progetti di " + s.name} />
          {list.length ? (
            <ProjectList list={list} mode="service" />
          ) : (
            <p className="svc-proj-empty pc-reveal">I progetti di {s.name} arrivano presto.</p>
          )}
        </div>
      </section>
      <section className="sec ct-sec" id="info">
        <div className="wrap">
          <Head title={"Vuoi saperne di più su " + s.name + "?"} />
          <p className="lead pc-reveal" style={vars({ "--i": 1, marginTop: "16px", marginBottom: "32px" })}>
            Scrivici due righe: ti rispondiamo entro 24 ore lavorative.
          </p>
        </div>
        <div className="wrap ct-grid">
          <ContactPageForm defaultService={s.id} services={c.services.list} phone={c.contact.phone} />
          <ContactPanel />
        </div>
      </section>
    </>
  );
}
