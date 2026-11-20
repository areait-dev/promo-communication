"use client";

import { useEffect, useRef } from "react";

/** Comportamenti globali: avviso per i link ancora da inserire (href="#" con data-soon). */
export function Behaviors() {
  const toast = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t || !t.closest || !t.closest("[data-soon]")) return;
      e.preventDefault();
      const el = toast.current!;
      el.textContent = "Collegamento da inserire nella versione definitiva.";
      el.classList.add("show");
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => el.classList.remove("show"), 2600);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return <div className="toast" ref={toast} role="status"></div>;
}
