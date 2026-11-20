"use client";

import Link from "next/link";
import { useEffect, useRef, useState, ViewTransition } from "react";
import { ACC, ILL, SERVICES } from "@/data/services";
import { motionOff, prefersReduced, svcHref, vars } from "@/lib/ui";

export function Accordion() {
  const root = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [open, setOpen] = useState(0);
  const [opening, setOpening] = useState(-1);
  const openRef = useRef(0);
  const openingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Disposizione: come i segnalibri di un libro, le linguette prima della card aperta stanno a sinistra, le altre a destra.
  useEffect(() => {
    openRef.current = open;
    const layout = () => {
      const ps = panels.current.filter(Boolean) as HTMLDivElement[];
      const k = openRef.current;
      if (!window.matchMedia("(min-width: 961px)").matches) {
        ps.forEach((x, i) => {
          x.style.left = "";
          x.style.width = "";
          x.style.height = i === k ? (x.querySelector(".acc-b") as HTMLElement).scrollHeight + "px" : "";
        });
        return;
      }
      const n = ps.length - 1, w = 33.3333 / n;
      ps.forEach((x, i) => {
        x.style.height = "";
        if (i < k) { x.style.left = i * w + "%"; x.style.width = w + "%"; }
        else if (i === k) { x.style.left = k * w + "%"; x.style.width = "66.6667%"; }
        else { x.style.left = k * w + 66.6667 + (i - k - 1) * w + "%"; x.style.width = w + "%"; }
      });
    };
    layout();
    window.addEventListener("resize", layout);
    return () => window.removeEventListener("resize", layout);
  }, [open]);

  function select(i: number) {
    if (!window.matchMedia("(min-width: 961px)").matches && i !== open) {
      setOpening(i);
      clearTimeout(openingTimer.current);
      openingTimer.current = setTimeout(() => setOpening(-1), 1050);
    }
    setOpen(i);
  }

  // Penna che scrive il tracciato (Brand Identity)
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const svgs = Array.from(host.querySelectorAll<SVGSVGElement>(".svc-ill--pen"));
    if (!svgs.length) return;
    const reduce = prefersReduced();
    const items = svgs.map((sv) => {
      const c = sv.querySelector<SVGPathElement>(".crv")!;
      const L = c.getTotalLength();
      c.style.strokeDasharray = String(L);
      return {
        sv, c, L,
        pen: sv.querySelector<SVGGElement>(".pen")!,
        pts: Array.from(sv.querySelectorAll<SVGElement>(".pt")),
        open: false,
        t0: 0,
      };
    });
    type Item = (typeof items)[number];
    const CYCLE = 5000;
    function draw(it: Item, k: number, penOp: number, allOp: number) {
      it.c.style.strokeDashoffset = String(it.L * (1 - k));
      it.c.style.opacity = String(allOp);
      const p = it.c.getPointAtLength(it.L * k);
      const p2 = it.c.getPointAtLength(Math.min(it.L, it.L * k + 1));
      const p1 = it.c.getPointAtLength(Math.max(0, it.L * k - 1));
      const ang = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
      it.pen.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${ang * 0.25 + 18})`);
      it.pen.style.opacity = String(penOp);
      it.pts.forEach((el) => {
        el.style.opacity = String((k >= +el.getAttribute("data-at")! ? 1 : 0) * allOp);
        el.style.transition = "opacity .25s";
      });
    }
    if (reduce) {
      items.forEach((it) => draw(it, 1, 1, 1));
      return;
    }
    let raf = 0;
    function frame(now: number) {
      if (motionOff()) {
        items.forEach((it) => draw(it, 1, 1, 1));
        raf = requestAnimationFrame(frame);
        return;
      }
      items.forEach((it) => {
        const isOpen = !!it.sv.closest(".acc-p.is-open");
        if (isOpen && !it.open) it.t0 = now + 500;
        it.open = isOpen;
        if (!isOpen) return draw(it, 0, 0, 0);
        let u = (now - it.t0) / CYCLE;
        if (u < 0) return draw(it, 0, 0, 0);
        u = u % 1;
        // entrata 0-24%, azione 24-80%, pausa fino all'88%, dissolvenza 88-96%
        if (u < 0.24) draw(it, 0, u / 0.24, 1);
        else if (u < 0.8) {
          const q = (u - 0.24) / 0.56;
          draw(it, q < 0.5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2, 1, 1);
        } else if (u < 0.88) draw(it, 1, 1, 1);
        else if (u < 0.96) {
          const f = 1 - (u - 0.88) / 0.08;
          draw(it, 1, f, f);
        } else draw(it, 0, 0, 0);
      });
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  function onKey(e: React.KeyboardEvent, i: number) {
    const n = SERVICES.length;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % n;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + n) % n;
    if (next !== null) {
      e.preventDefault();
      select(next);
      tabs.current[next]?.focus();
    }
  }

  return (
    <section className="acc-sec">
      <div className="acc pc-reveal" style={vars({ "--i": 2 })} role="tablist" aria-label="Servizi" ref={root}>
        {SERVICES.map((s, i) => {
          const c = ACC[s.id];
          const big = s.boost + " & " + s.name + " & ";
          return (
            <div
              key={s.id}
              ref={(el) => { panels.current[i] = el; }}
              className={`acc-p ${c[0]}${i === open ? " is-open" : ""}${i === opening ? " is-opening" : ""}`}
              data-i={i}
            >
              <button
                ref={(el) => { tabs.current[i] = el; }}
                className="acc-tab"
                type="button"
                role="tab"
                aria-selected={i === open}
                aria-controls={`accb-${i}`}
                id={`acct-${i}`}
                onClick={() => select(i)}
                onKeyDown={(e) => onKey(e, i)}
              >
                <span className="acc-ini">{c[1]}</span>
                <span className="acc-v">{s.name}</span>
              </button>
              <div className="acc-b" id={`accb-${i}`} role="tabpanel" aria-labelledby={`acct-${i}`}>
                <span className="acc-ini acc-ini--b">{c[1]}</span>
                <div className="acc-mq" aria-hidden="true">
                  <div className="acc-mq-t">
                    <span>{big}</span>
                    <span>{big}</span>
                  </div>
                </div>
                <ViewTransition name={`svc-title-${s.id}`} share="pc-morph" default="none">
                  <h3 className="acc-name">{s.name}</h3>
                </ViewTransition>
                <div className="acc-bottom">
                  {ILL[s.id] ? (
                    <div className="acc-img acc-img--ill" dangerouslySetInnerHTML={{ __html: ILL[s.id] }} />
                  ) : (
                    <div className="acc-img">
                      <span>Immagine del servizio</span>
                    </div>
                  )}
                  <div className="acc-list">
                    <ul>
                      {s.tags.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                    <Link className="acc-more" href={svcHref(s.id)}>
                      <span className="hl">Scopri</span> <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
