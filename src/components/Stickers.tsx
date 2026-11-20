"use client";

import { useEffect, useRef } from "react";
import { STAR } from "@/data/brand";
import { vars } from "@/lib/ui";

const STK = [
  { fill: "var(--blu-700)", ink: undefined as string | undefined, x: "80%", y: "330px", s: 140, r: 14 },
  { fill: "var(--blu-300)", ink: "var(--blu-notte)", x: "64%", y: "120px", s: 150, r: -10 },
];

/** Sticker a stella staccabili (pagina Team). */
export function Stickers() {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const B = 900, REST = 385;
    const cleanups: (() => void)[] = [];
    layer.current?.querySelectorAll<HTMLElement>(".stk").forEach((el) => {
      const cm = el.querySelector(".stk-cm")!;
      const cf = el.querySelector(".stk-cf")!;
      const flap = el.querySelector(".stk-flap")!;
      let c = REST, v = 0, target = REST;
      let raf: number | null = null;
      let drag: { x: number; y: number; l: number; t: number } | null = null;
      const draw = () => {
        cm.setAttribute("points", [-c + B, -B, 3 * B, -B, 3 * B, 3 * B, -B, 3 * B, -B, -c + B].join(" "));
        cf.setAttribute("points", [-c + B, -B, -B, -c + B, -3 * B, -3 * B].join(" "));
        flap.setAttribute("transform", `matrix(0,-1,-1,0,${-c},${-c})`);
      };
      const tick = () => {
        v = (v + (target - c) * 0.08) * 0.74;
        c += v;
        draw();
        raf = Math.abs(v) > 0.05 || Math.abs(target - c) > 0.3 ? requestAnimationFrame(tick) : null;
      };
      const go = (t: number) => {
        target = t;
        if (!raf) raf = requestAnimationFrame(tick);
      };
      draw();
      const onEnter = () => { if (!drag) go(300); };
      const onLeave = () => { if (!drag) go(REST); };
      const onDown = (e: PointerEvent) => {
        e.preventDefault();
        el.setPointerCapture(e.pointerId);
        drag = { x: e.clientX, y: e.clientY, l: el.offsetLeft, t: el.offsetTop };
        el.classList.add("is-lifted");
        go(160);
      };
      const onMove = (e: PointerEvent) => {
        if (!drag) return;
        const m = el.offsetParent as HTMLElement;
        let nx = drag.l + e.clientX - drag.x;
        let ny = drag.t + e.clientY - drag.y;
        nx = Math.max(-el.offsetWidth / 3, Math.min(m.clientWidth - (el.offsetWidth * 2) / 3, nx));
        ny = Math.max(0, Math.min(m.clientHeight - el.offsetHeight, ny));
        el.style.left = nx + "px";
        el.style.top = ny + "px";
      };
      const drop = () => {
        if (!drag) return;
        drag = null;
        el.classList.remove("is-lifted");
        go(REST);
      };
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", onLeave);
      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", drop);
      el.addEventListener("pointercancel", drop);
      cleanups.push(() => {
        if (raf) cancelAnimationFrame(raf);
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointerleave", onLeave);
        el.removeEventListener("pointerdown", onDown);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerup", drop);
        el.removeEventListener("pointercancel", drop);
      });
    });
    return () => cleanups.forEach((f) => f());
  }, []);

  return (
    <div className="stk-layer" ref={layer}>
      {STK.map((k, i) => (
        <div
          key={i}
          className="stk"
          data-i={i}
          style={{ left: k.x, top: k.y, width: k.s, height: k.s, ...vars({ "--r": k.r + "deg" }) }}
        >
          <svg viewBox="-300 -300 600 600" aria-hidden="true">
            <defs>
              <path id={`stkp${i}`} d={STAR} />
              <clipPath id={`stkm${i}`}>
                <polygon className="stk-cm" />
              </clipPath>
              <clipPath id={`stkf${i}`}>
                <polygon className="stk-cf" />
              </clipPath>
              <linearGradient id={`stkg${i}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="1" stopColor="#E6E6E6" />
              </linearGradient>
            </defs>
            <g clipPath={`url(#stkm${i})`}>
              <use href={`#stkp${i}`} fill={k.fill} stroke="#fff" strokeWidth="34" strokeLinejoin="round" paintOrder="stroke" />
              <text x="0" y="16" textAnchor="middle" className="stk-hand" transform="rotate(-8)" fill={k.ink || "#fff"}>
                staccami
              </text>
            </g>
            <g className="stk-flap">
              <use
                href={`#stkp${i}`}
                clipPath={`url(#stkf${i})`}
                fill={`url(#stkg${i})`}
                stroke="#E6E6E6"
                strokeWidth="34"
                strokeLinejoin="round"
                paintOrder="stroke"
              />
            </g>
          </svg>
        </div>
      ))}
    </div>
  );
}
