import { timingSafeEqual } from "node:crypto";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { wpGet } from "@/lib/wordpress";

/**
 * Anteprima delle bozze. Il tasto "Anteprima" di WordPress apre
 *   /api/preview?secret=…&type=progetto&id=123&slug=…
 * (il link lo costruisce il mu-plugin con PC_PREVIEW_SECRET, uguale a PREVIEW_SECRET su Vercel).
 * Si controlla il segreto, si legge il contenuto da WordPress con la password applicazione (anche se è una bozza),
 * si attiva il Draft Mode e si apre la pagina del sito che lo mostra. Per uscire: /api/preview/esci.
 */

/** Tipo di contenuto WordPress → rest_base e percorso pubblico. */
const TIPI: Record<string, { rest: string; path: (slug: string) => string }> = {
  progetto: { rest: "progetti", path: (s) => `/portfolio/${s}` },
  servizio: { rest: "servizi", path: (s) => `/servizi/${s}` },
  membro: { rest: "membri", path: () => "/team" },
  posizione: { rest: "posizioni", path: () => "/lavora-con-noi" },
  page: { rest: "pages", path: (s) => PAGINE[s] ?? "/" },
};

/** Pagine WordPress (slug) → percorso del sito. Le stesse di pc_pagine() nel mu-plugin. */
const PAGINE: Record<string, string> = {
  home: "/",
  "chi-siamo": "/chi-siamo",
  servizi: "/servizi",
  portfolio: "/portfolio",
  team: "/team",
  contatti: "/contatti",
  "lavora-con-noi": "/lavora-con-noi",
  privacy: "/privacy",
  "pagina-non-trovata": "/",
  impostazioni: "/",
};

function sameSecret(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const expected = process.env.PREVIEW_SECRET || "";
  const tipo = TIPI[searchParams.get("type") || ""];
  const id = Number(searchParams.get("id"));

  if (!expected || !sameSecret(searchParams.get("secret") || "", expected)) {
    return new Response("Link di anteprima non valido.", { status: 401 });
  }
  if (!tipo || !Number.isInteger(id) || id <= 0) {
    return new Response("Contenuto da mostrare non indicato.", { status: 400 });
  }

  // Il percorso nasce dallo slug letto da WordPress, non dall'indirizzo: niente redirect verso pagine arbitrarie.
  const post = await wpGet<{ slug: string }>(`${tipo.rest}/${id}`, { _fields: "slug", context: "edit" }, true);
  if (!post) {
    return new Response("Contenuto non trovato in WordPress, o utente di anteprima non configurato.", { status: 404 });
  }

  const draft = await draftMode();
  draft.enable();
  redirect(tipo.path(post.slug));
}
