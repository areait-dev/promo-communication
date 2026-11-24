"use client";

import { useEffect } from "react";
import { onReducedMotionChange } from "@/lib/ui";

const MAX_SHIFT = 0.16; // frazione della larghezza della striscia: stessa del CSS (pc-marquee)

/**
 * Fallback per i browser senza `animation-timeline` (vedi "Nastro" in site.css).
 * La striscia si sposta solo mentre l'utente scorre la pagina: nessun timer, nessun loop.
 * Con prefers-reduced-motion resta ferma (ascolta anche il cambio a runtime).
 */
export function MarqueeScroll() {
  useEffect(() => {
    if (typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()")) return; // ci pensa il CSS
    const tracks = Array.from(document.querySelectorAll<HTMLElement>(".pc-marquee__track"));
    if (!tracks.length) return;

    let reduced = false;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const t of tracks) {
        const band = t.parentElement!.getBoundingClientRect();
        const p = reduced ? 0 : Math.min(1, Math.max(0, (vh - band.top) / (vh + band.height)));
        t.style.transform = `translateX(${(-MAX_SHIFT * p * 100).toFixed(2)}%)`;
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const stopMq = onReducedMotionChange((r) => {
      reduced = r;
      schedule();
    });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      stopMq();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
      tracks.forEach((t) => t.style.removeProperty("transform"));
    };
  }, []);
  return null;
}
