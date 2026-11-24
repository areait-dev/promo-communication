import { onReducedMotionChange, prefersReduced } from "@/lib/ui";

const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * Pulsanti magnetici: .pc-btn si sposta di al massimo 6px verso il cursore (custom property --mx/--my, applicate
 * con transform nel CSS) e torna al suo posto con var(--ease-out). Solo con puntatore fine e senza movimento ridotto.
 */
export function initMagnet(): () => void {
  if (prefersReduced() || !finePointer()) return () => {};
  const MAX = 6; // px
  const ZONE = 24; // px oltre il bordo in cui il pulsante "sente" il cursore
  let raf = 0;
  let px = 0;
  let py = 0;
  const active = new Set<HTMLElement>();

  const frame = () => {
    raf = 0;
    const near = new Set<HTMLElement>();
    document.querySelectorAll<HTMLElement>(".pc-btn").forEach((b) => {
      const r = b.getBoundingClientRect();
      if (px < r.left - ZONE || px > r.right + ZONE || py < r.top - ZONE || py > r.bottom + ZONE) return;
      near.add(b);
      const dx = (px - (r.left + r.width / 2)) / (r.width / 2 + ZONE);
      const dy = (py - (r.top + r.height / 2)) / (r.height / 2 + ZONE);
      b.style.setProperty("--mx", Math.max(-1, Math.min(1, dx)) * MAX + "px");
      b.style.setProperty("--my", Math.max(-1, Math.min(1, dy)) * MAX + "px");
    });
    active.forEach((b) => {
      if (near.has(b)) return;
      b.style.removeProperty("--mx");
      b.style.removeProperty("--my");
    });
    active.clear();
    near.forEach((b) => active.add(b));
  };
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    px = e.clientX;
    py = e.clientY;
    if (!raf) raf = requestAnimationFrame(frame);
  };
  const onLeave = () => {
    px = py = -9999;
    if (!raf) raf = requestAnimationFrame(frame);
  };
  document.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  return () => {
    document.removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("pointerleave", onLeave);
    cancelAnimationFrame(raf);
    document.querySelectorAll<HTMLElement>(".pc-btn").forEach((b) => {
      b.style.removeProperty("--mx");
      b.style.removeProperty("--my");
    });
  };
}

/**
 * Illustrazioni e stelle decorative: aggiunge/toglie .is-live quando entrano/escono dallo schermo.
 * Il CSS tiene in pausa (animation-play-state) quelle senza .is-live e fa partire il giro d'ingresso delle stelle.
 */
export function initLive(): () => void {
  const els = Array.from(document.querySelectorAll<HTMLElement>(".acc-img--ill, .big-bubble, .pc-star--spin"));
  if (!els.length) return () => {};

  // Stella grande dell'hero (WCAG 2.2.2): .is-live parte UNA volta per caricamento di pagina e non viene piu' tolta
  // (altrimenti il giro ripartirebbe a ogni rientro). Con prefers-reduced-motion non viene mai aggiunta.
  const heroStar = (e: HTMLElement) => e.matches(".hero .bigstar, .about-hero .bigstar");
  let reduced = false;
  const stopMq = onReducedMotionChange((r) => {
    reduced = r;
    if (r) els.filter(heroStar).forEach((e) => e.classList.remove("is-live"));
  });
  const setLive = (e: HTMLElement, on: boolean) => {
    if (!heroStar(e)) return e.classList.toggle("is-live", on);
    if (on && !reduced && !e.classList.contains("is-live")) {
      e.classList.add("is-live");
      io?.unobserve(e);
    }
  };

  if (!("IntersectionObserver" in window)) {
    els.forEach((e) => setLive(e, true));
    return stopMq;
  }
  const io: IntersectionObserver | undefined = new IntersectionObserver(
    (entries) => {
      for (const e of entries) setLive(e.target as HTMLElement, e.isIntersecting);
    },
    { threshold: 0.15 },
  );
  els.forEach((e) => io.observe(e));
  return () => {
    stopMq();
    io.disconnect();
    els.forEach((e) => e.classList.remove("is-live"));
  };
}
