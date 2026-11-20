"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Star } from "./Star";
import { prefersReduced } from "@/lib/ui";

/** Comportamenti globali: tendina a stella tra le pagine, toast dei link da inserire. */
export function Behaviors() {
  const pathname = usePathname();
  const router = useRouter();
  const wipe = useRef<HTMLDivElement>(null);
  const toast = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const path = useRef(pathname);
  useEffect(() => {
    path.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t || !t.closest) return;

      const soon = t.closest("[data-soon]");
      if (soon) {
        e.preventDefault();
        const el = toast.current!;
        el.textContent = "Collegamento da inserire nella versione definitiva.";
        el.classList.add("show");
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => el.classList.remove("show"), 2600);
        return;
      }

      // tendina a stella: la pagina cambia a metà animazione
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = t.closest("a");
      const href = a?.getAttribute("href");
      if (!a || !href || !href.startsWith("/") || a.target === "_blank" || a.hasAttribute("download")) return;
      const w = wipe.current;
      if (!w || prefersReduced() || getComputedStyle(w).display === "none") return;
      if (new URL(href, location.href).pathname === path.current) return;
      e.preventDefault();
      e.stopPropagation();
      w.classList.remove("go");
      void w.offsetWidth;
      w.classList.add("go");
      setTimeout(() => router.push(href), 510);
      setTimeout(() => w.classList.remove("go"), 1100);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return (
    <>
      <div className="wipe" ref={wipe} aria-hidden="true">
        <Star />
      </div>
      <div className="toast" ref={toast} role="status"></div>
    </>
  );
}
