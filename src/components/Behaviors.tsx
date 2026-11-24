"use client";

import { useEffect, useRef } from "react";
import { onReducedMotionChange, prefersReduced } from "@/lib/ui";

/**
 * Comportamenti globali:
 * - avviso per i link ancora da inserire (href="#" con data-soon)
 * - scroll morbido solo per le ancore interne (#...), attivato al clic
 */
export function Behaviors() {
  const toast = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // prefers-reduced-motion anche a runtime: tiene allineata la classe .motion-off (impostata all'avvio da layout.tsx)
  useEffect(
    () => onReducedMotionChange((r) => document.documentElement.classList.toggle("motion-off", r)),
    [],
  );

  useEffect(() => {
    let smoothTimer: ReturnType<typeof setTimeout> | undefined;
    const root = document.documentElement;
    const endSmooth = () => {
      root.style.removeProperty("scroll-behavior");
      window.removeEventListener("scrollend", endSmooth);
      clearTimeout(smoothTimer);
    };

    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t || !t.closest) return;

      if (t.closest("[data-soon]")) {
        e.preventDefault();
        const el = toast.current!;
        el.textContent = "Collegamento da inserire nella versione definitiva.";
        el.classList.add("show");
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => el.classList.remove("show"), 2600);
        return;
      }

      // Ancora interna (es. "Vai al contenuto"): scroll morbido solo per questo salto.
      // Lo smooth NON e' globale: con "Indietro" il ripristino dello scroll deve essere immediato.
      const a = t.closest("a");
      const href = a?.getAttribute("href");
      if (!a || !href || href.length < 2 || href[0] !== "#" || prefersReduced()) return;
      root.style.setProperty("scroll-behavior", "smooth");
      window.addEventListener("scrollend", endSmooth, { once: true });
      clearTimeout(smoothTimer);
      smoothTimer = setTimeout(endSmooth, 1500); // rete di sicurezza dove scrollend non esiste
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      endSmooth();
    };
  }, []);

  return <div className="toast" ref={toast} role="status"></div>;
}
