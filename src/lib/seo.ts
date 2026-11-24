import type { Metadata } from "next";

/** Indirizzo pubblico del sito (dominio di produzione). Serve per canonical, Open Graph e sitemap. */
export const SITE_URL = "https://promocommunication.it";
export const SITE_NAME = "PromoCommunication";
/** Immagine di condivisione (1200×630) in /public. */
export const OG_IMAGE = { url: "/og.png", width: 1200, height: 630, alt: "PromoCommunication, Boost your brand" };

/** Accorcia un testo a max `n` caratteri, chiudendo a fine frase o, se non c'è, a fine parola. */
export function snip(text: string, n = 158): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= n) return t;
  const cut = t.slice(0, n);
  const dot = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  if (dot > n * 0.5) return cut.slice(0, dot + 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:–-]$/, "") + "…";
}

/**
 * Metadati di una pagina: titolo, descrizione, canonical, Open Graph e Twitter card.
 * `title` è il titolo breve (il template del layout aggiunge " | PromoCommunication").
 */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const full = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE_NAME, locale: "it_IT", url: path, title: full, description, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title: full, description, images: [OG_IMAGE.url] },
  };
}
