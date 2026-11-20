import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cta, Pager } from "@/components/blocks";
import { PROJECTS, pImg, projById } from "@/data/projects";
import { projHref, vars } from "@/lib/ui";

// Solo i progetti pubblicati (con anteprima): gli altri danno 404.
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = projById((await params).slug);
  return { title: p?.name };
}

export default async function Progetto({ params }: { params: Promise<{ slug: string }> }) {
  const p = projById((await params).slug);
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
  const back = (
    <Link className="pj-back pc-reveal" href="/portfolio">
      ← Tutti i progetti
    </Link>
  );

  return (
    <>
      <section className="pj-hero">
        <div className="wrap">
          {back}
          <p className="pj-cat pc-reveal">{p.kind}</p>
          <h1 className="pj-title pc-reveal" style={vars({ "--i": 1 })}>
            {p.name}
          </h1>
          {meta}
        </div>
        <div className="wrap">
          <div className="pj-cover pc-reveal" style={vars({ "--i": 3 })}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pImg(p.cover!)} alt={p.name} />
          </div>
        </div>
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
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={s} src={pImg(s)} alt={alt} loading="lazy" />
                      ))}
                    </div>
                    {cap}
                  </figure>
                );
              return (
                <figure key={k} className={"pj-blk pc-reveal" + (b.fit === "contain" ? " pj-blk--contain" : "")}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pImg(b.img!)} alt={alt} loading="lazy" />
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pImg(p.img!)} alt="" />
              </div>
            </div>
          </div>
        </section>
      ) : null}
      {pager}
      <Cta />
    </>
  );
}
