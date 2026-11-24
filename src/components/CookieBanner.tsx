"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { PRIVACY_URL } from "@/data/contact";

/**
 * Banner del consenso ai cookie di analisi e pubblicità (Google Tag Manager, Consent Mode).
 * - "Accetta" e "Rifiuta" hanno lo stesso peso: rifiutare costa un clic come accettare.
 * - La scelta resta nel browser (localStorage "pc-consent") per 6 mesi, poi viene richiesta di nuovo.
 * - Al caricamento lo script in layout.tsx rilegge la scelta e aggiorna il consenso prima che parta GTM.
 * - "Gestisci cookie" nel footer riapre il banner.
 */
const KEY = "pc-consent";
const MONTHS6 = 1000 * 60 * 60 * 24 * 182;
const OPEN_EVENT = "pc-consent-open";
const CHANGE_EVENT = "pc-consent-change";

type Choice = "granted" | "denied";

function read(): Choice | null {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) || "null") as { v?: string; t?: number } | null;
    if (c && (c.v === "granted" || c.v === "denied") && typeof c.t === "number" && Date.now() - c.t < MONTHS6) return c.v;
  } catch {}
  return null;
}

function apply(v: Choice) {
  const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof g === "function") {
    g("consent", "update", {
      ad_storage: v,
      ad_user_data: v,
      ad_personalization: v,
      analytics_storage: v,
    });
  }
}

let reopen = false;
const subscribe = (cb: () => void) => {
  const open = () => {
    reopen = true;
    cb();
  };
  window.addEventListener(CHANGE_EVENT, cb);
  window.addEventListener(OPEN_EVENT, open);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CHANGE_EVENT, cb);
    window.removeEventListener(OPEN_EVENT, open);
    window.removeEventListener("storage", cb);
  };
};
// 0 = non mostrare, 1 = mostra. Sul server non si mostra nulla: il banner compare dopo l'idratazione.
const snapshot = () => (read() === null || reopen ? 1 : 0);

export function CookieBanner() {
  const show = useSyncExternalStore(subscribe, snapshot, () => 0);
  if (!show) return null;

  const choose = (v: Choice) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ v, t: Date.now() }));
    } catch {}
    reopen = false;
    apply(v);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return (
    <section className="cc" role="region" aria-labelledby="cc-t">
      <h2 id="cc-t" className="cc__t">
        Cookie, ma solo se vuoi
      </h2>
      <p className="cc__p">
        Usiamo cookie di analisi e di marketing, tramite Google, per capire come viene usato il sito. Sono spenti finché non scegli. I
        cookie tecnici, invece, ci servono per farlo funzionare. Dettagli nella{" "}
        <Link href={`${PRIVACY_URL}#cookie`}>cookie policy</Link>.
      </p>
      <div className="cc__btns">
        <button type="button" className="pc-btn pc-btn--ghost" onClick={() => choose("denied")}>
          Rifiuta
        </button>
        <button type="button" className="pc-btn pc-btn--accent" onClick={() => choose("granted")}>
          Accetta
        </button>
      </div>
    </section>
  );
}

/** Pulsante del footer: riapre il banner per cambiare scelta. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      Gestisci cookie
    </button>
  );
}
