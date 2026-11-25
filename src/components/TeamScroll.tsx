"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { initials, type Member } from "@/data/team";

/** Sezione Team: il testo scorre, la card a lato cambia con il membro al centro dello schermo. */
export function TeamScroll({ team: TEAM }: { team: Member[] }) {
  const sec = useRef<HTMLElement>(null);
  const items = useRef<(HTMLElement | null)[]>([]);
  const [cur, setCur] = useState(0);
  const n = TEAM.length;

  useEffect(() => {
    const check = () => {
      const el = sec.current;
      if (!el || window.innerWidth <= 900) return; // mobile: elenco normale
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      setCur(Math.min(n, Math.floor(p * (n + 1))));
    };
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; check(); });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    check();
    return () => { window.removeEventListener("resize", onScroll); window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [n]);

  const on = (i: number) => (i === cur ? " is-on" : "");
  return (
    <section className="ssr" data-tone={cur % 5} ref={sec} style={{ ["--n" as string]: n + 1 }}>
      <div className="ssr-stage">
      <div className="wrap ssr-grid">
        <div className="ssr-text">
          {TEAM.map((m, i) => (
            <article key={m.n} className={"ssr-item" + on(i)} data-i={i} ref={(el) => { items.current[i] = el; }}>
              <h2 className="ssr-name">{m.n}</h2>
              {m.r ? <p className="ssr-role">{m.r}</p> : null}
              <p className="ssr-desc" dangerouslySetInnerHTML={{ __html: m.b }} />
              <div className={`ssr-ph ssr-ph--m ph ph-${m.c}${m.img ? " has-img" : ""}`} aria-hidden="true">
                {m.img ? <img src={m.img} alt="" /> : initials(m.n)}
              </div>
            </article>
          ))}
          <article className={"ssr-item ssr-join" + on(n)} data-i={n} ref={(el) => { items.current[n] = el; }}>
            <h2 className="ssr-name">La prossima vignetta potresti essere tu</h2>
            <p className="ssr-role">Posizioni aperte</p>
            <p className="ssr-desc">
              Cerchiamo persone curiose, con idee chiare e voglia di mettersi in gioco. Se pensi di poter dare una spinta al
              nostro team, mandaci il tuo CV e raccontaci chi sei.
            </p>
            <p style={{ marginTop: 28 }}>
              <Link className="pc-btn pc-btn--accent" href="/lavora-con-noi">
                Candidati <span className="pc-btn__arrow">→</span>
              </Link>
            </p>
            <div className="ssr-ph ssr-ph--m ssr-ph--join" aria-hidden="true">
              <span>La prossima vignetta potresti essere tu</span>
            </div>
          </article>
        </div>
        <div className="ssr-side" aria-hidden="true">
          <div className="ssr-card">
            {TEAM.map((m, i) => (
              <div key={m.n} className={`ssr-ph ph ph-${m.c}${on(i)}${m.img ? " has-img" : ""}`} data-i={i}>
                {m.img ? (
                 
                  <img src={m.img} alt={m.n} />
                ) : (
                  <>
                    <span>{initials(m.n)}</span>
                    <small>Foto di {m.n.split(" ")[0]}</small>
                  </>
                )}
              </div>
            ))}
            <div className={"ssr-ph ssr-ph--join" + on(n)} data-i={n}>
              <span>
                Lavora
                <br />
                con noi
              </span>
              <small>Posizioni aperte e candidature spontanee</small>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
