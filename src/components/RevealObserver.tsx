"use client";

import { useEffect } from "react";
import { prefersReduced } from "@/lib/ui";

/**
 * Aggiunge `is-in` agli elementi `.pc-reveal` quando entrano nello schermo.
 * La classe viene aggiunta solo lato client, dopo il mount: l'HTML del server e il primo render del client coincidono.
 * Va montato dentro <main>, nella stessa idratazione del contenuto che osserva.
 */
export function RevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll(".pc-reveal");
    if (prefersReduced() || !("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  return null;
}
