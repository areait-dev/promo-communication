/**
 * Client della REST API di WordPress headless (wp.promocommunication.it).
 *
 * - Senza WORDPRESS_URL, o se WordPress non risponde, le funzioni restituiscono null: chi le usa ricade sui dati di
 *   src/data, così il build non si rompe mai.
 * - Con `draft` legge anche le bozze, autenticandosi con la password applicazione dell'utente di anteprima
 *   (WORDPRESS_USER / WORDPRESS_APP_PASSWORD, solo lato server).
 * - I campi ACF arrivano già formattati (acf_format=standard): le immagini sono oggetti con url, alt, width, height.
 */

const BASE = (process.env.WORDPRESS_URL || "").replace(/\/+$/, "");

/** Tempo massimo di attesa: oltre, si usano i dati locali. */
const TIMEOUT_MS = 8000;

export const wpConfigured = () => BASE !== "";

function authHeader(): Record<string, string> {
  const user = process.env.WORDPRESS_USER;
  const pass = process.env.WORDPRESS_APP_PASSWORD;
  if (!user || !pass) return {};
  return { Authorization: "Basic " + Buffer.from(`${user}:${pass.replace(/\s+/g, "")}`).toString("base64") };
}

/**
 * GET su /wp-json/wp/v2/<path>. `query` viene aggiunta all'indirizzo; con `draft` include le bozze.
 * Restituisce null in caso di errore (e lo scrive nel log), mai un'eccezione.
 */
export async function wpGet<T>(path: string, query: Record<string, string | number> = {}, draft = false): Promise<T | null> {
  if (!BASE) return null;
  const params = new URLSearchParams({ acf_format: "standard", ...Object.fromEntries(Object.entries(query).map(([k, v]) => [k, String(v)])) });
  if (draft) params.set("status", "publish,draft,pending,future,private");
  const url = `${BASE}/wp-json/wp/v2/${path}?${params}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", ...(draft ? authHeader() : {}) },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      console.warn(`[wordpress] ${res.status} su ${path}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (e) {
    console.warn(`[wordpress] ${path} non raggiungibile: ${e instanceof Error ? e.message : e}`);
    return null;
  }
}

/* ---------------------------------------------------------------------------------------------------------------
 * Tipi delle risposte (solo i campi usati)
 * ------------------------------------------------------------------------------------------------------------- */

export type WpImage = { url: string; alt?: string; width?: number; height?: number } | false | null | undefined;

export type WpPost<A> = {
  id: number;
  slug: string;
  status: string;
  title: { rendered: string };
  acf: A | [];
  /** Categorie progetto: la REST usa il rest_base della tassonomia come nome del campo. */
  "categorie-progetto"?: number[];
};

export type WpTerm = { id: number; name: string; slug: string };

/** Il titolo di WordPress arriva con le entità HTML (&#8217; ecc.): qui torna testo semplice. */
export function decode(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

/** I campi ACF di un contenuto, o un oggetto vuoto se non ce ne sono (WordPress restituisce [] quando sono vuoti). */
export const acfOf = <A>(p: { acf: A | [] }): Partial<A> => (Array.isArray(p.acf) ? {} : p.acf);

/** "una voce per riga" → elenco, senza righe vuote. */
export const lines = (s: string | null | undefined): string[] =>
  (s || "")
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);

export const imgUrl = (i: WpImage): string | undefined => (i && typeof i === "object" && i.url ? i.url : undefined);
