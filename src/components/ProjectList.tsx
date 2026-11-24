"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, ViewTransition } from "react";
import { createPortal } from "react-dom";
import { PROJECTS, pImg, type Project } from "@/data/projects";
import { prefersReduced, projHref, vars } from "@/lib/ui";

const CHIPS = ["Tutti", "Brand Identity", "Digital & Web", "Social Media", "Shooting foto/video", "Event Management"];

// dimensioni della miniatura (mobile / touch): fisse, per non causare CLS
const THUMB_W = 128;
const THUMB_H = 97;

const alt = (p: Project) => `Anteprima del progetto ${p.name}`;

function Preview({ p, i }: { p: Project; i: number }) {
  return (
    <div className="pl-img" data-i={i}>
      {/* sfondo sfocato: decorativo, l'alt descrittivo sta sull'immagine in primo piano */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="pl-img-bg" src={pImg(p.img!)} alt="" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="pl-img-fg" src={pImg(p.img!)} alt={alt(p)} />
    </div>
  );
}

/**
 * Elenco progetti. Su desktop con mouse: anteprima che segue il cursore (sempre a destra del nome).
 * Su mobile / touch: miniatura sempre visibile in ogni riga.
 * `portfolio` aggiunge filtri e ordinamento; `service` è l'elenco compatto nelle pagine dei servizi.
 */
export function ProjectList({ list, mode }: { list: Project[]; mode: "portfolio" | "service" }) {
  const ul = useRef<HTMLUListElement>(null);
  const prevEl = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false); // true solo sul client
  const [cat, setCat] = useState("");
  const [sort, setSort] = useState("new");
  const portfolio = mode === "portfolio";
  const Heading = portfolio ? "h2" : "h3"; // nelle pagine servizio il titolo di sezione è già un h2
  const items = portfolio ? PROJECTS : list;
  // categorie del filtro: nel portfolio quelle fisse; nella pagina di un servizio solo quelle dei suoi lavori
  const chips = portfolio ? CHIPS : ["Tutti", ...Array.from(new Set(list.flatMap((p) => p.cats))).filter((c) => CHIPS.includes(c))];
  const showFilters = portfolio || chips.length > 2;

  // anteprima agganciata al cursore
  useEffect(() => {
    const listEl = ul.current, prev = prevEl.current;
    if (!mounted || !listEl || !prev) return;
    const imgs = prev.querySelectorAll<HTMLElement>(".pl-img");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = prefersReduced();
    const W = 320, H = 243, GAP = 28;
    let mx = 0, my = 0, x = 0, y = 0, vx = 0, rot = 0, s = 0.85, ts = 0.85, op = 0, top = 0, active = -1;
    let nameRight = 0; // bordo destro del nome del progetto in hover: la scheda non lo supera mai a sinistra
    let raf: number | null = null;
    const target = () => {
      const maxX = Math.max(8, window.innerWidth - W - 16);
      return {
        x: Math.min(maxX, Math.max(mx + GAP, nameRight + GAP)),
        y: Math.max(8, Math.min(window.innerHeight - H - 8, my - H / 2)),
      };
    };
    const measure = (row: Element | null) => {
      const name = row?.querySelector(".pl-name");
      if (name) nameRight = name.getBoundingClientRect().right + 14; // + scarto dell'animazione del nome
    };
    const loop = () => { if (!raf) raf = requestAnimationFrame(frame); };
    function show(i: number, row: Element | null) {
      const was = active;
      active = i;
      measure(row);
      listEl!.classList.toggle("has-hover", i >= 0);
      listEl!.querySelectorAll(".pl-row").forEach((r) => r.classList.toggle("is-on", +r.getAttribute("data-i")! === i));
      imgs.forEach((im) => im.classList.toggle("is-on", +im.getAttribute("data-i")! === i));
      if (i >= 0 && fine) {
        top = 1;
        ts = 1;
        if (was < 0) { const tg = target(); x = tg.x; y = tg.y; s = 0.85; }
        else s = 0.96; // cambio progetto: piccolo "pop"
      } else { top = 0; ts = 0.85; }
      loop();
    }
    function frame() {
      raf = null;
      const tg = target(), k = reduce ? 1 : 0.22;
      const nx = x + (tg.x - x) * k;
      vx = nx - x;
      x = nx;
      y += (tg.y - y) * k;
      s += (ts - s) * (reduce ? 1 : 0.2);
      op += (top - op) * (reduce ? 1 : 0.25);
      rot += ((reduce ? 0 : Math.max(-6, Math.min(6, vx * 0.5))) - rot) * 0.2;
      prev!.style.transform = `translate3d(${x}px,${y}px,0) rotate(${rot}deg) scale(${s})`;
      prev!.style.opacity = String(op);
      if (Math.abs(tg.x - x) > 0.3 || Math.abs(tg.y - y) > 0.3 || Math.abs(ts - s) > 0.003 || Math.abs(top - op) > 0.01 || Math.abs(rot) > 0.05) loop();
    }
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const r = (e.target as Element).closest(".pl-row");
      const i = r ? +r.getAttribute("data-i")! : -1;
      if (i !== active) show(i, r);
      else { measure(r); loop(); }
    };
    const onLeave = () => show(-1, null);
    const onScroll = () => { if (active >= 0) show(-1, null); };
    listEl.addEventListener("pointermove", onMove);
    listEl.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    const rows = Array.from(listEl.querySelectorAll<HTMLElement>(".pl-row"));
    const handlers = rows.map((r) => {
      const f = () => {
        const b = r.getBoundingClientRect();
        mx = b.left + b.width * 0.55;
        my = b.top + b.height / 2;
        show(+r.getAttribute("data-i")!, r);
      };
      r.addEventListener("focus", f);
      r.addEventListener("blur", onLeave);
      return f;
    });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      listEl.removeEventListener("pointermove", onMove);
      listEl.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      rows.forEach((r, k) => {
        r.removeEventListener("focus", handlers[k]);
        r.removeEventListener("blur", onLeave);
      });
    };
  }, [mounted]);

  // animazione di riordino
  useEffect(() => {
    const el = ul.current;
    if (!portfolio || !el) return;
    el.classList.remove("pl-resort");
    void el.offsetWidth;
    el.classList.add("pl-resort");
  }, [sort, portfolio]);

  const shown = portfolio
    ? PROJECTS.map((p, i) => ({ p, i })).sort((a, b) => {
        if (sort === "name" || sort === "name-desc") {
          const c = a.p.name.localeCompare(b.p.name, "it");
          return sort === "name" ? c : -c;
        }
        const d = a.p.o - b.p.o;
        return sort === "new" ? -d : d;
      })
    : list.map((p, i) => ({ p, i }));

  return (
    <>
      {showFilters && (
        <div className="pl-filters pc-reveal" role="toolbar" aria-label="Filtra i progetti per categoria">
          <div className="pl-chips">
            {chips.map((c, i) => {
              const val = i === 0 ? "" : c;
              const on = cat === val;
              return (
                <button key={c} type="button" className={"pl-chip" + (on ? " is-on" : "")} aria-pressed={on} onClick={() => setCat(val)}>
                  {c}
                </button>
              );
            })}
          </div>
          {portfolio && <label className="pl-sort">
            <span>Ordina per</span>
            <select aria-label="Ordina i progetti" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="new">Più recenti</option>
              <option value="old">Meno recenti</option>
              <option value="name">Nome A-Z</option>
              <option value="name-desc">Nome Z-A</option>
            </select>
          </label>}
        </div>
      )}
      <ul className="pl pc-reveal" style={portfolio ? vars({ "--i": 1 }) : undefined} ref={ul}>
        {shown.map(({ p, i }) => {
          const out = !!cat && !p.cats.includes(cat);
          return (
            <li key={p.id} className={out ? "is-out" : undefined} inert={out}>
              <Link className="pl-row" href={projHref(p.id)} data-i={i}>
                <span className="pl-thumb">
                  <ViewTransition name={`pf-img-${p.id}`} share="pc-morph" default="none">
                    <Image src={pImg(p.img!)} alt={alt(p)} width={THUMB_W} height={THUMB_H} sizes={`${THUMB_W}px`} />
                  </ViewTransition>
                </span>
                <span className="pl-info">
                  <ViewTransition name={`pf-title-${p.id}`} share="pc-morph" default="none">
                    <Heading className="pl-name">{p.name}</Heading>
                  </ViewTransition>
                  {p.settore && <span className="pl-sector">{p.settore}</span>}
                </span>
                <span className="pl-cats">
                  {p.cats.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      {mounted &&
        createPortal(
          <div className="pl-prev" aria-hidden="true" ref={prevEl}>
            {items.map((p, i) => (
              <Preview key={p.id} p={p} i={i} />
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
