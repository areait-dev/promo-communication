import type { CSSProperties } from "react";

/** Style con custom property CSS (es. `--i`). */
export const vars = (o: Record<string, string | number>) => o as CSSProperties;

export const motionOff = () =>
  typeof document !== "undefined" &&
  document.documentElement.classList.contains("motion-off");

export const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const svcHref = (id: string) => `/servizi/${id}`;
export const projHref = (id: string) => `/portfolio/${id}`;
