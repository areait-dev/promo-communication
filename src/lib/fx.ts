import { motionOff, prefersReduced } from "@/lib/ui";

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
 * Marquee reattiva allo scroll: un solo listener + un solo rAF.
 * La velocita' dell'animazione CSS esistente cresce con la velocita' di scroll (playbackRate: l'animazione non viene
 * ricreata) e le voci si inclinano (skewX, massimo 4 gradi, via --sk) nella direzione dello scroll.
 * Tutto torna gradualmente alla normalita'. La pausa al passaggio del mouse resta quella del CSS.
 */
export function initMarquee(): () => void {
  if (prefersReduced()) return () => {};
  const tracks = Array.from(document.querySelectorAll<HTMLElement>(".pc-marquee__track"));
  if (!tracks.length) return () => {};

  const anims = tracks
    .map((t) => ({ t, a: t.getAnimations().find((x) => (x as CSSAnimation).animationName === "pc-marquee") }))
    .filter((x): x is { t: HTMLElement; a: Animation } => !!x.a);
  if (!anims.length) return () => {};

  let last = window.scrollY;
  let vel = 0; // px per frame, livellata
  let raf = 0;

  const apply = (rate: number, skew: number) => {
    anims.forEach(({ t, a }) => {
      a.playbackRate = rate;
      t.style.setProperty("--sk", skew.toFixed(2) + "deg");
    });
  };
  const frame = () => {
    raf = 0;
    const y = window.scrollY;
    const dy = y - last;
    last = y;
    vel += (dy - vel) * 0.18;
    if (motionOff()) {
      apply(1, 0);
    } else {
      const rate = 1 + Math.min(Math.abs(vel) * 0.45, 7);
      const skew = Math.max(-4, Math.min(4, vel * 0.3));
      apply(rate, skew);
    }
    if (Math.abs(vel) > 0.05 || Math.abs(dy) > 0) raf = requestAnimationFrame(frame);
    else apply(1, 0);
  };
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => {
    window.removeEventListener("scroll", onScroll);
    cancelAnimationFrame(raf);
    apply(1, 0);
  };
}
