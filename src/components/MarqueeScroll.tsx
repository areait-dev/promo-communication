"use client";

import { useEffect } from "react";
import { onReducedMotionChange } from "@/lib/ui";

const MAX_SHIFT = 0.16; // frazione della larghezza della striscia: stessa del CSS (pc-marquee)

/**
 * Nastro dei servizi (WCAG 2.2.2): nessun loop automatico.
 *  1. Alla prima entrata nello schermo la striscia scivola piano per 4,5 s e si ferma (classe .is-drift, vedi "Nastro" in site.css).
 *     Una sola volta per caricamento di pagina; con prefers-reduced-motion non parte.
 *  2. Poi si muove solo mentre l'utente scorre la pagina. Lo fa il CSS (animation-timeline); questo componente
 *     lo fa a mano solo nei browser che non lo supportano, senza timer e senza loop.
 */
export function MarqueeScroll() {
  useEffect(() => {
    const tracks = Array.from(document.querySelectorAll<HTMLElement>(".pc-marquee__track"));
    if (!tracks.length) return;

    const native = typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()");
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
      // con movimento ridotto il nastro e' una riga ferma che si scorre a mano: serve raggiungibile da tastiera
      tracks.forEach((t) => {
        const band = t.parentElement!;
        if (r) band.setAttribute("tabindex", "0");
        else band.removeAttribute("tabindex");
      });
      if (!native) schedule();
    });

    // scivolata d'ingresso: una volta sola, alla prima entrata
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || reduced) continue;
          e.target.querySelector(".pc-marquee__track")?.classList.add("is-drift");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.3 },
    );
    tracks.forEach((t) => io.observe(t.parentElement!));

    // fallback dello scroll-driven
    if (!native) {
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      schedule();
    }
    return () => {
      stopMq();
      io.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
      tracks.forEach((t) => {
        t.parentElement?.removeAttribute("tabindex");
        t.style.removeProperty("transform");
        t.classList.remove("is-drift");
      });
    };
  }, []);
  return null;
}
