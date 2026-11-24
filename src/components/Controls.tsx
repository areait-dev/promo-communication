"use client";

import { useSyncExternalStore } from "react";

const MOBILE = "(max-width: 960px)";

/** Legge uno stato dall'elemento <html> (il tema), impostato prima del paint dallo script in <head>. */
function useHtml(get: () => boolean) {
  return useSyncExternalStore(
    (cb) => {
      const mo = new MutationObserver(cb);
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });
      return () => mo.disconnect();
    },
    get,
    () => false,
  );
}

export function useMobile() {
  return useSyncExternalStore(
    (cb) => {
      const q = window.matchMedia(MOBILE);
      q.addEventListener("change", cb);
      return () => q.removeEventListener("change", cb);
    },
    () => window.matchMedia(MOBILE).matches,
    () => false,
  );
}

function store(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

/** Interruttore tema giorno/notte. */
export function Controls() {
  const dark = useHtml(() => document.documentElement.getAttribute("data-theme") === "dark");

  function toggleTheme() {
    const next = !dark;
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    store("pc-theme", next ? "dark" : "light");
  }

  // Un normale pulsante, non role="switch": l'etichetta dice cosa farà il clic ("Attiva tema scuro" / "Attiva tema chiaro"),
  // quindi uno stato aria-checked in piu' verrebbe letto due volte e in modo contraddittorio.
  const label = dark ? "Attiva tema chiaro" : "Attiva tema scuro";
  return (
    <button className="sw" type="button" aria-label={label} title={label} onClick={toggleTheme}>
      <span className="sw-k" aria-hidden="true">
        <svg className="sw-i sw-sun" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
        </svg>
        <svg className="sw-i sw-moon" viewBox="0 0 24 24">
          <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
        </svg>
      </span>
    </button>
  );
}

/**
 * Su mobile i controlli (animazioni / tema) stanno nella prima sezione di ogni pagina.
 * È JSX normale, senza modifiche manuali al DOM: sul server non rende nulla, sul client appare dopo l'idratazione.
 */
export function MobileControls() {
  const mobile = useMobile();
  if (!mobile) return null;
  return (
    <div className="ctl-m" role="group" aria-label="Animazioni e tema">
      <Controls />
    </div>
  );
}
