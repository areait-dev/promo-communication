"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, ViewTransition, type ReactNode } from "react";

function viewOf(pathname: string) {
  const [first, second] = pathname.split("/").filter(Boolean);
  // "index": cosi' il server chiama la home quando la rigenera su Vercel; senza, la pagina perdeva gli stili [data-view="home"]
  if (!first || first === "index") return "home";
  if (first === "servizi" && second) return "service";
  if (first === "portfolio" && second) return "project";
  return first;
}

/** Contenitore principale: ricrea l'animazione di ingresso a ogni pagina e sposta il focus. */
export function MainView({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);
  const first = useRef(true);
  const fromHistory = useRef(false);
  const mounted = useRef(false);

  // Tasto indietro/avanti: lo scroll lo ripristina il router, non va toccato.
  useEffect(() => {
    const onPop = () => {
      fromHistory.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Nuova pagina: scroll a 0 nello stesso commit del cambio route. Cosi' la View Transition cattura gia' l'hero di
  // destinazione dentro il viewport e l'elemento condiviso (card -> hero) puo' formare la coppia anche se si partiva scrollati.
  useLayoutEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (fromHistory.current) {
      fromHistory.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    ref.current?.focus({ preventScroll: true });
  }, [pathname]);

  // Il cambio pagina e' una View Transition del browser (cross-fade della pagina, definito in site.css).
  // Il marcatore e' un elemento minuscolo dentro il viewport: cambia chiave a ogni pagina e fa partire la transizione
  // senza dover catturare come immagine l'intera pagina (che puo' essere alta migliaia di pixel).
  return (
    <>
      <ViewTransition key={"vt:" + pathname} enter="pc-vt-marker" exit="pc-vt-marker" default="none">
        <span className="pc-vt-marker" aria-hidden="true" />
      </ViewTransition>
      <main id="main" tabIndex={-1} ref={ref} key={"main:" + pathname} data-view={viewOf(pathname)}>
        {children}
      </main>
    </>
  );
}
