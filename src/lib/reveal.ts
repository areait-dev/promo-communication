import { prefersReduced } from "@/lib/ui";

/**
 * Reveal allo scroll: assegna a ogni `.pc-reveal` la variante giusta e aggiunge `is-in` quando entra nello schermo.
 *
 * Varianti (classi aggiunte qui, DOPO l'idratazione, mai nell'HTML del server):
 * - `pc-reveal--title`: titoli (h1-h6, o un contenitore che contiene solo un titolo) -> maschera riga per riga
 * - `pc-reveal--media`: figure, copertine, card con immagine, slider -> clip-path + scale dell'immagine
 * - nessuna classe: testo e blocchi generici -> opacity + blur + translate
 * - `is-intro`: elemento gia' visibile al caricamento -> niente timeline di scroll, entra con la transizione
 */

const MEDIA_SELECTOR = "figure, .pj-cover, .pj-img, .pc-team, .slider";

function headingOf(el: HTMLElement): HTMLElement | null {
  if (/^H[1-6]$/.test(el.tagName)) return el;
  const h = el.querySelector<HTMLElement>(":scope > h1, :scope > h2, :scope > div > h1, :scope > div > h2");
  if (h && (el.textContent ?? "").trim() === (h.textContent ?? "").trim()) return h;
  return null;
}

/** Solo testo, <br> e <span> senza classi: niente <em>, <strong>, link o parole animate (Boost). */
function isSplittable(h: HTMLElement) {
  if (h.querySelector("[class]")) return false;
  for (const n of Array.from(h.querySelectorAll("*"))) if (n.tagName !== "BR" && n.tagName !== "SPAN") return false;
  return (h.textContent ?? "").trim().length > 0;
}

/**
 * Divide il titolo in righe reali (misurate nel layout attuale): ogni riga e' una maschera con dentro il testo.
 * Il nome accessibile resta il testo originale (aria-label); le righe sono aria-hidden, quindi nessun testo duplicato.
 * Restituisce l'HTML originale per poterlo ripristinare.
 */
function split(h: HTMLElement): string {
  const html = h.innerHTML;
  const tokens: (string | null)[] = []; // null = <br>
  const walk = (n: Node) =>
    n.childNodes.forEach((c) => {
      if (c.nodeType === 3) (c.textContent ?? "").split(/\s+/).filter(Boolean).forEach((w) => tokens.push(w));
      else if ((c as Element).tagName === "BR") tokens.push(null);
      else walk(c);
    });
  walk(h);

  // misura: ogni parola in uno span inline, il browser decide dove va a capo
  h.textContent = "";
  const spans = tokens.map((t, i) => {
    if (t === null) {
      h.appendChild(document.createElement("br"));
      return null;
    }
    const s = document.createElement("span");
    s.textContent = t;
    h.appendChild(s);
    if (i < tokens.length - 1) h.appendChild(document.createTextNode(" "));
    return s;
  });
  const lines: string[][] = [[]];
  let top = NaN;
  tokens.forEach((t, i) => {
    const s = spans[i];
    if (!s || t === null) {
      lines.push([]);
      top = NaN;
      return;
    }
    const y = Math.round(s.getBoundingClientRect().top);
    if (Number.isNaN(top)) top = y;
    else if (Math.abs(y - top) > 2) {
      lines.push([]);
      top = y;
    }
    lines[lines.length - 1].push(t);
  });

  h.textContent = "";
  lines
    .filter((l) => l.length)
    .forEach((l, k) => {
      const mask = document.createElement("span");
      mask.className = "pc-line";
      mask.setAttribute("aria-hidden", "true");
      const inner = document.createElement("span");
      inner.className = "pc-line__in";
      inner.style.setProperty("--l", String(k));
      inner.textContent = l.join(" ");
      mask.appendChild(inner);
      h.appendChild(mask);
    });
  h.setAttribute("aria-label", tokens.filter(Boolean).join(" "));
  return html;
}

type Title = { el: HTMLElement; h: HTMLElement; html: string; width: number };

export function initReveal(): () => void {
  const main = document.getElementById("main");
  const root = document.documentElement;
  if (!main) return () => {};

  const reduce = prefersReduced();
  const all = () => Array.from(main.querySelectorAll<HTMLElement>(".pc-reveal"));

  // Senza IntersectionObserver o con movimento ridotto: tutto subito visibile (le illustrazioni partono comunque da is-in)
  if (reduce || !("IntersectionObserver" in window)) {
    all().forEach((e) => e.classList.add("is-in"));
    root.setAttribute("data-reveal", "ready");
    (window as unknown as { __pcReveal?: boolean }).__pcReveal = true;
    return () => {
      root.removeAttribute("data-reveal");
      all().forEach((e) => e.classList.remove("is-in"));
    };
  }

  let alive = true;
  const seen = new WeakSet<HTMLElement>();
  const titles: Title[] = [];
  const touched = new Set<HTMLElement>();

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );

  // I media partono con clip-path chiuso al 100%: IntersectionObserver considera il clip dell'elemento e non li vedrebbe mai.
  // Per loro si controlla la posizione a ogni scroll (sono pochi, il costo e' trascurabile).
  const mediaPending = new Set<HTMLElement>();
  let rafId = 0;
  const checkMedia = () => {
    rafId = 0;
    const vh = window.innerHeight;
    mediaPending.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.9 && r.bottom > 0) {
        el.classList.add("is-in");
        mediaPending.delete(el);
      }
    });
  };
  const scheduleMedia = () => {
    if (!rafId && mediaPending.size) rafId = requestAnimationFrame(checkMedia);
  };
  window.addEventListener("scroll", scheduleMedia, { passive: true });

  const doneOnEnd = (el: HTMLElement) => {
    const onEnd = (ev: TransitionEvent) => {
      if (ev.target === el && ev.propertyName === "clip-path") {
        el.classList.add("is-done"); // a fine animazione il clip-path viene tolto: nessun ritaglio di ombre o hover
        el.removeEventListener("transitionend", onEnd);
      }
    };
    el.addEventListener("transitionend", onEnd);
  };

  const pendingTitles: HTMLElement[] = [];
  const classify = (el: HTMLElement) => {
    if (seen.has(el)) return;
    seen.add(el);
    touched.add(el);
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.98 && r.bottom > 0) el.classList.add("is-intro");
    const h = headingOf(el);
    if (h && isSplittable(h)) {
      pendingTitles.push(el); // resta nascosto finche' non e' diviso (dopo il caricamento dei font)
      return;
    }
    if (el.matches(MEDIA_SELECTOR) || el.querySelector(":scope > img")) {
      el.classList.add("pc-reveal--media");
      doneOnEnd(el);
      mediaPending.add(el);
      return;
    }
    io.observe(el);
  };
  all().forEach(classify);
  scheduleMedia();

  const sleep = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));
  const applyTitles = () => {
    if (!alive) return;
    for (const el of pendingTitles.splice(0)) {
      const h = headingOf(el);
      if (!h || !isSplittable(h)) {
        io.observe(el);
        continue;
      }
      const width = h.getBoundingClientRect().width;
      const html = split(h);
      titles.push({ el, h, html, width });
      el.classList.add("pc-reveal--title");
      io.observe(el);
    }
  };
  const fontsReady = document.fonts ? Promise.race([document.fonts.ready, sleep(800)]) : Promise.resolve();
  fontsReady.then(applyTitles);

  // nuovi .pc-reveal inseriti dopo l'avvio (es. React che ricostruisce una parte della pagina)
  const mo = new MutationObserver(() => {
    all().forEach(classify);
    scheduleMedia();
    if (pendingTitles.length) fontsReady.then(applyTitles);
  });
  mo.observe(main, { childList: true, subtree: true });

  // le righe dipendono dalla larghezza: al resize si ricalcolano (gli elementi gia' rivelati restano rivelati)
  let timer: ReturnType<typeof setTimeout> | undefined;
  const onResize = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      for (const t of titles) {
        const probe = t.h.getBoundingClientRect().width;
        if (Math.abs(probe - t.width) < 1) continue;
        t.h.innerHTML = t.html;
        t.h.removeAttribute("aria-label");
        t.width = t.h.getBoundingClientRect().width;
        split(t.h);
      }
    }, 150);
  };
  window.addEventListener("resize", onResize);
  window.addEventListener("resize", scheduleMedia);

  root.setAttribute("data-reveal", "ready");
  (window as unknown as { __pcReveal?: boolean }).__pcReveal = true;

  return () => {
    alive = false;
    root.removeAttribute("data-reveal"); // al cambio pagina gli elementi tornano nascosti finche' non riparte l'init
    io.disconnect();
    mo.disconnect();
    clearTimeout(timer);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("resize", scheduleMedia);
    window.removeEventListener("scroll", scheduleMedia);
    cancelAnimationFrame(rafId);
    for (const t of titles) {
      t.h.innerHTML = t.html;
      t.h.removeAttribute("aria-label");
    }
    touched.forEach((e) => e.classList.remove("is-in", "is-intro", "is-done", "pc-reveal--title", "pc-reveal--media"));
  };
}
