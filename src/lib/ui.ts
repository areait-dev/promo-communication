import type { CSSProperties } from "react";

/** Style con custom property CSS (es. `--i`). */
export const vars = (o: Record<string, string | number>) => o as CSSProperties;

export const motionOff = () =>
  typeof document !== "undefined" &&
  document.documentElement.classList.contains("motion-off");

export const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Ascolta prefers-reduced-motion anche a runtime (WCAG 2.2.2 / 2.3.3): `cb` parte subito col valore attuale
 * e a ogni cambio. Restituisce la funzione per smettere di ascoltare.
 */
export function onReducedMotionChange(cb: (reduced: boolean) => void): () => void {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fire = () => cb(mq.matches);
  mq.addEventListener("change", fire);
  fire();
  return () => mq.removeEventListener("change", fire);
}

export const svcHref = (id: string) => `/servizi/${id}`;
export const projHref = (id: string) => `/portfolio/${id}`;
