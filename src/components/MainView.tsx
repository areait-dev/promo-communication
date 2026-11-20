"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

function viewOf(pathname: string) {
  const [first, second] = pathname.split("/").filter(Boolean);
  if (!first) return "home";
  if (first === "servizi" && second) return "service";
  if (first === "portfolio" && second) return "project";
  return first;
}

/** Contenitore principale: ricrea l'animazione di ingresso a ogni pagina e sposta il focus. */
export function MainView({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    ref.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <main id="main" tabIndex={-1} ref={ref} key={pathname} data-view={viewOf(pathname)} className="view-enter">
      {children}
    </main>
  );
}
