"use client";

import { useEffect, useRef } from "react";
import { motionOff, prefersReduced } from "@/lib/ui";

type GridNode = { x: number; y: number; ox: number; oy: number; vx: number; vy: number };

/** Griglia elastica di sfondo: i nodi si spostano al passaggio del mouse. */
export function ElasticGrid() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const host = cv?.parentElement;
    const ctx = cv?.getContext("2d");
    if (!cv || !host || !ctx) return;

    const STEP = 48, R = 200, PUSH = 38, K = 0.06, DAMP = 0.72;
    const reduce = prefersReduced();
    let W = 0, H = 0, cols = 0, rows = 0, dpr = 1;
    let nodes: GridNode[] = [];
    let color = "#D6D6D6";
    let raf: number | null = null;
    const mouse = { x: -9999, y: -9999, on: false };

    const readColor = () => {
      const cs = getComputedStyle(host);
      return cs.getPropertyValue("--grid-line").trim() || cs.getPropertyValue("--line").trim() || "#D6D6D6";
    };
    function build() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = host!.clientWidth;
      H = host!.clientHeight;
      cv!.width = W * dpr;
      cv!.height = H * dpr;
      cv!.style.width = W + "px";
      cv!.style.height = H + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(W / STEP) + 2;
      rows = Math.ceil(H / STEP) + 2;
      nodes = [];
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) nodes.push({ x: (i - 1) * STEP, y: (j - 1) * STEP, ox: 0, oy: 0, vx: 0, vy: 0 });
      color = readColor();
    }
    const nd = (i: number, j: number) => nodes[j * cols + i];
    const px = (n: GridNode) => n.x + n.ox;
    const py = (n: GridNode) => n.y + n.oy;
    function line(get: (k: number) => GridNode, count: number) {
      ctx!.beginPath();
      const a = get(0);
      ctx!.moveTo(px(a), py(a));
      for (let k = 1; k < count - 1; k++) {
        const b = get(k), c = get(k + 1);
        ctx!.quadraticCurveTo(px(b), py(b), (px(b) + px(c)) / 2, (py(b) + py(c)) / 2);
      }
      const z = get(count - 1);
      ctx!.lineTo(px(z), py(z));
      ctx!.stroke();
    }
    function frame() {
      let moving = false;
      for (const n of nodes) {
        let tx = 0, ty = 0;
        if (mouse.on && !motionOff()) {
          const dx = n.x - mouse.x, dy = n.y - mouse.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < R && d > 0.01) {
            const f = Math.pow(1 - d / R, 2) * PUSH;
            tx = (dx / d) * f;
            ty = (dy / d) * f;
          }
        }
        n.vx = (n.vx + (tx - n.ox) * K) * DAMP;
        n.vy = (n.vy + (ty - n.oy) * K) * DAMP;
        n.ox += n.vx;
        n.oy += n.vy;
        if (Math.abs(n.vx) > 0.02 || Math.abs(n.vy) > 0.02 || Math.abs(n.ox - tx) > 0.05) moving = true;
      }
      ctx!.clearRect(0, 0, W, H);
      ctx!.strokeStyle = color;
      ctx!.lineWidth = 1;
      for (let i = 0; i < cols; i++) line((k) => nd(i, k), rows);
      for (let j = 0; j < rows; j++) line((k) => nd(k, j), cols);
      raf = moving || mouse.on ? requestAnimationFrame(frame) : null;
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    build();
    frame();
    if (reduce) {
      return () => {
        if (raf) cancelAnimationFrame(raf);
      };
    }

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.on = true;
      kick();
    };
    const onLeave = () => {
      mouse.on = false;
      kick();
    };
    const onResize = () => {
      build();
      kick();
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    const mo = new MutationObserver(() => {
      color = readColor();
      kick();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      mo.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="egrid" aria-hidden="true" />;
}
