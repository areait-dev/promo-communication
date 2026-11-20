"use client";

import { useEffect } from "react";
import { MobileControls } from "./Controls";
import { initMagnet, initMarquee } from "@/lib/fx";
import { initReveal } from "@/lib/reveal";

/**
 * Va messo nella prima sezione di ogni pagina.
 * Sta dentro l'albero della pagina (non accanto a <main>), quindi il suo effect parte solo dopo che
 * il contenuto e' stato idratato: aggiungere classi prima di allora causerebbe un errore di hydration.
 * Avvia reveal, marquee reattiva allo scroll e pulsanti magnetici, e mostra i controlli animazioni/tema su mobile.
 */
export function PageFx() {
  useEffect(() => {
    const stops = [initReveal(), initMarquee(), initMagnet()];
    return () => stops.forEach((stop) => stop());
  }, []);
  return <MobileControls />;
}
