"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, ViewTransition } from "react";
import { pImg, type Project } from "@/data/projects";
import { prefersReduced, projHref } from "@/lib/ui";

export function Slider({ projects }: { projects: Project[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0);
  const slides = projects.slice(0, 6);

  // posizione nel carosello: la prima scheda visibile (IntersectionObserver, nessun listener di scroll)
  useEffect(() => {
    const tr = track.current;
    if (!tr || !("IntersectionObserver" in window)) return;
    const seen = new Set<number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = Number((e.target as HTMLElement).dataset.i);
          if (e.isIntersecting) seen.add(i);
          else seen.delete(i);
        }
        if (seen.size) setPos(Math.min(...seen));
      },
      { root: tr, threshold: 0.6 },
    );
    tr.querySelectorAll(".slide").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const step = (d: number) => {
    const tr = track.current;
    const first = tr?.querySelector(".slide");
    if (!tr || !first) return;
    const w = first.getBoundingClientRect().width + 24;
    tr.scrollBy({ left: d * w, behavior: prefersReduced() ? "auto" : "smooth" });
  };

  return (
    <div className="slider pc-reveal">
      <div className="slider-track" ref={track} role="group" aria-label="Progetti">
        {slides.map((p, i) => (
          <Link
            key={p.id}
            data-i={i}
            className={"slide " + (i % 3 === 1 ? "slide-r" : i % 3 === 2 ? "slide-l" : "")}
            href={projHref(p.id)}
          >
            <ViewTransition name={`pf-img-${p.id}`} share="pc-morph" default="none">
              <Image
                className="slide-img"
                src={pImg(p.img!)}
                alt={p.name}
                fill
                sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 960px) 45vw, 33vw"
              />
            </ViewTransition>
            <span className="slide-cap">
              <b>{p.name}</b>
              <small>{p.kind}</small>
            </span>
          </Link>
        ))}
      </div>
      <div className="slider-pos" aria-hidden="true">
        <span className="slider-dots">
          {slides.map((p, i) => (
            <i key={p.id} className={i === pos ? "on" : undefined}></i>
          ))}
        </span>
        <span className="slider-count">
          {pos + 1} / {slides.length}
        </span>
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
