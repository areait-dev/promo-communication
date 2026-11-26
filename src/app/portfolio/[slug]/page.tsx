import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import { Cta, Pager } from "@/components/blocks";
import { getContent, getPublishedContent, projectById } from "@/lib/content";
import { projHref, vars } from "@/lib/ui";
import { PageFx } from "@/components/PageFx";
import { ProjectImage } from "@/components/ProjectImage";
import { pageMeta, snip } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs } from "@/lib/structured-data";

// Solo i progetti pubblicati (con anteprima): gli altri danno 404.
// Tutti gli slug sono noti in fase di build (generateStaticParams): la pagina e' statica, niente Suspense con fallback
// (farebbe comparire un fallback prima del contenuto e romperebbe l'elemento condiviso card -> hero).
export const instant = false;

export async function generateStaticParams() {
  return (await getPublishedContent()).projects.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = await getContent();
  const p = projectById(c, (await params).slug);
  return p
    ? pageMeta({ title: p.name, path: `/portfolio/${p.id}`, description: snip(p.intro || `${p.name}: un progetto di Promo Communication.`), seo: c.seo[`/portfolio/${p.id}`], image: p.cover ? { url: `/portfolio/${p.id}/og.jpg`, width: 1200, height: 630, alt: `${p.name}${p.kind ? `: ${p.kind}` : ""}` } : undefined })
    : { title: "Pagina non trovata" };
}

export default async function Progetto({ params }: { params: Promise<{ slug: string }> }) {
  const { projects: PROJECTS } = await getContent();
  const slug = (await params).slug;
  const p = PROJECTS.find((x) => x.id === slug);
  if (!p) notFound();

  const i = PROJECTS.indexOf(p);
  const prev = PROJECTS[(i + PROJECTS.length - 1) % PROJECTS.length];
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  const pager = (
    <Pager
      label="Altri progetti"
      prev={prev.name}
      next={next.name}
      prevHref={projHref(prev.id)}
      nextHref={projHref(next.id)}
      prevLabel="← Progetto precedente"
      nextLabel="Progetto successivo →"
    />
  );
  const meta = (
    <dl className="pj-meta pc-reveal" style={vars({ "--i": 2 })}>
      <div>
        <dt>Cliente</dt>
        <dd>{p.client}</dd>
      </div>
      <div>
        <dt>Servizi</dt>
        <dd>{p.cats.join(" · ")}</dd>
      </div>
    </dl>
  );
  // Copertina: riquadro largo circa il 90% dello schermo, 4/3 fino a 900px e 16/7 oltre, con ritaglio "cover".
  // L'immagine va quindi chiesta piu' larga del riquadro quando e' piu' panoramica di lui, per non sgranarla.
  const dim = (s: string) => p.dims?.[s];
  const coverDim = dim(p.cover!);
  const ratio = coverDim ? coverDim[0] / coverDim[1] : 1;
  const coverSizes = `(max-width: 900px) ${Math.ceil(90 * Math.max(1, ratio * (3 / 4)))}vw, ${Math.ceil(90 * Math.max(1, ratio * (7 / 16)))}vw`;
  // Immagini che tengono la loro larghezza naturale (CSS width: auto): "sizes" non deve superare quella del file.
  const natural = (s: string, max = "100vw") => {
    const d = dim(s);
    return d ? `min(${d[0]}px, ${max})` : undefined;
  };
  const back = (
    <Link className="pj-back pc-reveal" href="/portfolio">
      ← Tutti i progetti
    </Link>
  );

  return (
    <>
      <section className="pj-hero ctl-host">
        <div className="wrap">
          {back}
          <p className="pj-cat pc-reveal">{p.kind}</p>
          {/* titolo e cover sono la destinazione dell'elemento condiviso: niente reveal, devono esserci subito */}
          <ViewTransition name={`pf-title-${p.id}`} share="pc-morph" default="none">
            <h1 className="pj-title">{p.name}</h1>
          </ViewTransition>
          {meta}
        </div>
        <div className="wrap">
          <div className="pj-cover">
            <ViewTransition name={`pf-img-${p.id}`} share="pc-morph" default="none">
              <ProjectImage src={p.cover!} dim={coverDim} alt={p.name} sizes={coverSizes} loading="eager" fetchPriority="high" />
            </ViewTransition>
          </div>
        </div>
        <PageFx />
      </section>
      <section className="sec pj-body">
        <div className="wrap pj-cols2">
          <div className="pc-reveal">
            <h2>Il cliente</h2>
            <p>{p.intro}</p>
          </div>
          <div className="pc-reveal" style={vars({ "--i": 1 })}>
            <h2>Cosa abbiamo fatto</h2>
            <p>{p.work}</p>
            {p.tags && (
              <ul className="pj-tags">
                {p.tags.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
      {p.blocks ? (
        <section className="sec pj-blocks" style={{ paddingTop: 0 }}>
          <div className="wrap">
            {p.blocks.map((b, k) => {
              const alt = p.name + (b.cap ? " – " + b.cap : "");
              const cap = b.cap ? <figcaption>{b.cap}</figcaption> : null;
              if (b.imgs)
                return (
                  <figure key={k} className={"pj-blk pj-blk--row" + (b.pair ? " pj-blk--pair" : "") + " pc-reveal"}>
                    <div className="pj-row">
                      {b.imgs.map((s) => (
                        <ProjectImage
                          key={s}
                          src={s}
                          dim={dim(s)}
                          alt={alt}
                          natural={!b.pair}
                          sizes={b.pair ? "(max-width: 760px) 90vw, 45vw" : `(max-width: 600px) ${natural(s)}, ${natural(s, "560px")}`}
                          loading="lazy"
                        />
                      ))}
                    </div>
                    {cap}
                  </figure>
                );
              return (
                <figure key={k} className={"pj-blk pc-reveal" + (b.fit === "contain" ? " pj-blk--contain" : "")}>
                  <ProjectImage src={b.img!} dim={dim(b.img!)} alt={alt} natural={b.fit === "contain"} sizes={b.fit === "contain" ? natural(b.img!) : "90vw"} loading="lazy" />
                  {cap}
                </figure>
              );
            })}
          </div>
        </section>
      ) : p.cover !== p.img ? (
        <section className="sec pj-gallery" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="pj-grid">
              <div className="pj-img pc-reveal">
                <ProjectImage src={p.img!} dim={dim(p.img!)} alt="" sizes="(max-width: 460px) 90vw, 420px" loading="lazy" />
              </div>
            </div>
          </div>
        </section>
      ) : null}
      {pager}
      <Cta />
      <JsonLd data={breadcrumbs([["Portfolio", "/portfolio"], [p.name, `/portfolio/${p.id}`]])} />
    </>
  );
}
