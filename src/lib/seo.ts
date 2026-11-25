import type { Metadata } from "next";
import { getContent } from "./content";
import type { WpSeo } from "./wordpress";

/** Indirizzo pubblico del sito: quello con www, su cui Vercel reindirizza il dominio senza www. Serve per canonical, Open Graph e sitemap. */
export const SITE_URL = "https://www.promocommunication.it";
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

/** Titolo e descrizione della home (anche nel layout e nei dati strutturati). */
export const HOME_TITLE = "Boost your brand | PromoCommunication";
export const HOME_DESC =
  "PromoCommunication, la Unit di Comunicazione & Marketing di Promotergroup. Diamo forma, voce e spazio a quello che la tua impresa fa ogni giorno.";

type PageMetaInput = {
  /** Titolo breve: il template del layout aggiunge " | PromoCommunication". Con `absolute` è già completo. */
  title: string;
  description: string;
  path: string;
  absolute?: boolean;
  /** Testi scritti in Yoast per questa pagina: dove ci sono, prendono il posto di quelli del codice. */
  seo?: WpSeo;
};

/** Metadati di una pagina: titolo, descrizione, canonical, Open Graph, Twitter card e, se scelto in Yoast, noindex. */
export function pageMeta({ title, description, path, absolute, seo }: PageMetaInput): Metadata {
  // Il titolo di Yoast è già completo (di solito "Titolo | PromoCommunication"): niente template.
  const full = seo?.title || (absolute ? title : `${title} | ${SITE_NAME}`);
  const desc = seo?.description || description;
  const ogTitle = seo?.og_title || full;
  const ogDesc = seo?.og_description || desc;
  const image = seo?.og_image ? { url: seo.og_image.url, width: seo.og_image.width, height: seo.og_image.height, alt: ogTitle } : OG_IMAGE;
  return {
    title: (seo?.title || absolute) ? { absolute: full } : title,
    description: desc,
    alternates: { canonical: path },
    ...(seo?.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: { type: "website", siteName: SITE_NAME, locale: "it_IT", url: path, title: ogTitle, description: ogDesc, images: [image] },
    twitter: { card: "summary_large_image", title: ogTitle, description: ogDesc, images: [image.url] },
  };
}

/** Come pageMeta, con i testi di Yoast della pagina (per le pagine fisse, in generateMetadata). */
export async function seoMeta(input: Omit<PageMetaInput, "seo">): Promise<Metadata> {
  const { seo } = await getContent();
  return pageMeta({ ...input, seo: seo[input.path] });
}
