"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { ACC, ILL, SERVICES } from "@/data/services";
import { svcHref } from "@/lib/ui";

// Le illustrazioni sono le stesse dell'accordion (che resta nel DOM, nascosto): gli id interni (clipPath ecc.) vanno resi unici.
const uniqueIds = (svg: string) => svg.replace(/(id="|url\(#|href="#)([\w-]+)/g, "$1sh-$2");

/**
 * /servizi su desktop: scorrendo la pagina in verticale la striscia dei servizi si sposta di lato (il riquadro resta fermo,
 * "sticky", mentre le schede scorrono). Tutto in CSS con animation-timeline (vedi "Servizi: scroll orizzontale" in site.css):
 * si muove solo mentre l'utente scorre. Dove il browser non lo supporta, su mobile/tablet e con prefers-reduced-motion
 * resta l'accordion di sempre (e questa sezione è nascosta).
 * Da tastiera: quando una scheda riceve il focus la pagina scorre fino a mostrarla.
 */
export function ServicesScroll() {
  const sec = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = sec.current;
    const p = pin.current;
    if (!s || !p) return;
    const onFocus = (e: FocusEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>(".sh-card");
      if (!card || getComputedStyle(s).display === "none") return;
      p.scrollLeft = 0; // il browser avrebbe spostato il contenitore: lo spostamento lo decide lo scroll della pagina
      const i = Number(card.dataset.i);
      const cw = card.getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(card.parentElement!).columnGap) || 0;
      const dist = s.offsetHeight - window.innerHeight; // il movimento orizzontale è 1:1 con lo scroll
      const top = s.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + Math.min(Math.max(0, i * (cw + gap) - cw * 0.15), dist), behavior: "auto" });
    };
    s.addEventListener("focusin", onFocus);
    return () => s.removeEventListener("focusin", onFocus);
  }, []);

  return (
    <section className="sh" ref={sec} aria-label="Servizi" style={{ "--n": SERVICES.length } as CSSProperties}>
      <div className="sh__pin" ref={pin}>
        <ol className="sh__track">
          {SERVICES.map((s, i) => {
            const c = ACC[s.id];
            return (
              <li key={s.id} className={`sh-card ${c[0]}`} data-i={i}>
                <span className="sh-card__n" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="sh-card__t">{s.name}</h3>
                {ILL[s.id] ? <div className="sh-card__ill" aria-hidden="true" dangerouslySetInnerHTML={{ __html: uniqueIds(ILL[s.id]) }} /> : null}
                <ul className="sh-card__tags">
                  {s.tags.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <Link className="sh-card__more" href={svcHref(s.id)}>
                  Scopri il servizio <span aria-hidden="true">→</span>
                </Link>
              </li>
            );
          })}
        </ol>
        <div className="sh__bar" aria-hidden="true"></div>
      </div>
    </section>
  );
}
