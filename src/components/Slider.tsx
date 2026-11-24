"use client";

import Link from "next/link";
import { useRef, ViewTransition } from "react";
import { REAL, pImg } from "@/data/projects";
import { prefersReduced, projHref } from "@/lib/ui";

export function Slider() {
  const track = useRef<HTMLDivElement>(null);

  const step = (d: number) => {
    const tr = track.current;
    const first = tr?.querySelector(".slide");
    if (!tr || !first) return;
    const w = first.getBoundingClientRect().width + 24;
    tr.scrollBy({ left: d * w, behavior: prefersReduced() ? "auto" : "smooth" });
  };

  return (
    <div className="slider pc-reveal">
      <div className="slider-track" ref={track}>
        {REAL.slice(0, 6).map((p, i) => (
          <Link
            key={p.id}
            className={"slide " + (i % 3 === 1 ? "slide-r" : i % 3 === 2 ? "slide-l" : "")}
            href={projHref(p.id)}
          >
            <ViewTransition name={`pf-img-${p.id}`} share="pc-morph" default="none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="slide-img" src={pImg(p.img!)} alt={p.name} loading="lazy" />
            </ViewTransition>
            <span className="slide-cap">
              <b>{p.name}</b>
              <small>{p.kind}</small>
            </span>
          </Link>
        ))}
      </div>
      <div className="slider-ctl">
        <span></span>
        <div className="sarrows">
          <button className="sbtn" type="button" aria-label="Progetto precedente" onClick={() => step(-1)}>←</button>
          <button className="sbtn" type="button" aria-label="Progetto successivo" onClick={() => step(1)}>→</button>
        </div>
        <Link className="pc-btn pc-btn--ghost" href="/portfolio">
          Vai al portfolio <span className="pc-btn__arrow">→</span>
        </Link>
      </div>
    </div>
  );
}
