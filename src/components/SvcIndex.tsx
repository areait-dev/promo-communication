"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useSyncExternalStore, ViewTransition } from "react";
import { createPortal } from "react-dom";
import { PROJECTS, pImg } from "@/data/projects";
import { ACC, SVC_CAT, svcById } from "@/data/services";
import { prefersReduced, svcHref, vars } from "@/lib/ui";

/**
 * Elenco "Cosa mettiamo in boost". Con mouse (hover + puntatore fine): la riga si sposta, l'etichetta "boost your"
 * scorre dentro (CSS) e un'anteprima segue il cursore con un leggero ritardo (lerp con requestAnimationFrame).
 * L'anteprima e' la copertina di un progetto della stessa categoria; per i servizi senza progetti c'e' una card
 * con le iniziali, nei colori della fisarmonica.
 */
export function SvcIndex({ ids }: { ids: string[] }) {
  const ul = useRef<HTMLUListElement>(null);
  const prev = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const items = useMemo(
    () =>
      ids.map((id) => {
        const s = svcById(id)!;
        const cat = SVC_CAT[id];
        const p = cat ? PROJECTS.find((x) => x.cats.includes(cat)) : undefined;
        return { s, img: p?.img ? pImg(p.img) : null, acc: ACC[id] };
      }),
    [ids],
  );

  useEffect(() => {
    const list = ul.current, box = prev.current;
    if (!mounted || !list || !box) return;
    if (prefersReduced() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const cards = box.querySelectorAll<HTMLElement>(".pc-svc-prev__i");
    const W = 200, H = 150, GAP = 28, LERP = 0.14;
    let mx = 0, my = 0, x = 0, y = 0, op = 0, top = 0, s = 0.9, ts = 0.9, nameRight = 0, active = -1;
    let raf = 0;

    const target = () => ({
      x: Math.min(Math.max(8, window.innerWidth - W - 16), Math.max(mx + GAP, nameRight + GAP)),
      y: Math.max(8, Math.min(window.innerHeight - H - 8, my - H / 2)),
    });
    const loop = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const show = (i: number, row: Element | null) => {
      const was = active;
      active = i;
      // fine del TESTO del titolo (la cella e' larga tutta la colonna): l'anteprima non lo copre mai
      const t = row?.querySelector(".pc-index__t");
      if (t) {
        const range = document.createRange();
        range.selectNodeContents(t);
        nameRight = range.getBoundingClientRect().right;
      }
      cards.forEach((c, k) => c.classList.toggle("is-on", k === i));
      if (i >= 0) {
        top = 1; ts = 1;
        if (was < 0) { const tg = target(); x = tg.x; y = tg.y; s = 0.9; }
      } else { top = 0; ts = 0.9; }
      loop();
    };
    function frame() {
      raf = 0;
      const tg = target();
      x += (tg.x - x) * LERP;
      y += (tg.y - y) * LERP;
      s += (ts - s) * 0.18;
      op += (top - op) * 0.2;
      box!.style.transform = `translate3d(${x}px,${y}px,0) scale(${s})`;
      box!.style.opacity = String(op);
      if (Math.abs(tg.x - x) > 0.3 || Math.abs(tg.y - y) > 0.3 || Math.abs(ts - s) > 0.003 || Math.abs(top - op) > 0.01) loop();
    }
    const onMove = (e: PointerEvent) => {
      mx = e.clientX; my = e.clientY;
      const row = (e.target as Element).closest("li");
      const i = row ? +row.getAttribute("data-i")! : -1;
      if (i !== active) show(i, row); else loop();
    };
    const onLeave = () => show(-1, null);
    const onScroll = () => { if (active >= 0) show(-1, null); };
    list.addEventListener("pointermove", onMove);
    list.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    const links = Array.from(list.querySelectorAll<HTMLElement>("a"));
    const onFocus = (a: HTMLElement) => () => {
      const b = a.getBoundingClientRect();
      mx = b.left + b.width * 0.5; my = b.top + b.height / 2;
      const row = a.closest("li");
      show(+row!.getAttribute("data-i")!, row);
    };
    const handlers = links.map((a) => { const f = onFocus(a); a.addEventListener("focus", f); a.addEventListener("blur", onLeave); return f; });
    return () => {
      cancelAnimationFrame(raf);
      list.removeEventListener("pointermove", onMove);
      list.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      links.forEach((a, k) => { a.removeEventListener("focus", handlers[k]); a.removeEventListener("blur", onLeave); });
    };
  }, [mounted]);

  return (
    <>
      <ul className="pc-index" ref={ul}>
        {items.map(({ s }, i) => (
          <li key={s.id} data-i={i} className="pc-reveal" style={vars({ "--i": Math.min(i, 3) })}>
            <Link href={svcHref(s.id)}>
              <span className="pc-index__k">boost your</span>
              <ViewTransition name={`svc-title-${s.id}`} share="pc-morph" default="none">
                <span className="pc-index__t">{s.name}</span>
              </ViewTransition>
            </Link>
          </li>
        ))}
      </ul>
      {mounted &&
        createPortal(
          <div className="pc-svc-prev" aria-hidden="true" ref={prev}>
            {items.map(({ s, img, acc }) => (
              <div key={s.id} className={"pc-svc-prev__i " + (img ? "" : acc[0])}>
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt="" />
                ) : (
                  <b>{acc[1]}</b>
                )}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
