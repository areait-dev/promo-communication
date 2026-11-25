import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

/**
 * Aggiornamento immediato dei contenuti di WordPress (come in Cultivar).
 *
 * Il mu-plugin, quando si pubblica o si modifica un contenuto pubblicato, chiama
 *   POST /api/revalidate  con l'intestazione  X-WP-Revalidate-Token: <PC_REVALIDATE_TOKEN>
 * Se il codice coincide con REVALIDATE_TOKEN (Vercel), i dati con etichetta "wp" (src/lib/content.ts) scadono subito:
 * la visita successiva di ogni pagina li rilegge da WordPress. Nessun nuovo deploy.
 */

function sameSecret(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function POST(request: Request) {
  const expected = process.env.REVALIDATE_TOKEN || "";
  const token = request.headers.get("x-wp-revalidate-token") || "";
  if (!expected || !sameSecret(token, expected)) {
    return Response.json({ ok: false, message: "Codice non valido." }, { status: 401 });
  }

  // Facoltativo, solo per il log: cosa è cambiato in WordPress.
  let cosa = "";
  try {
    const body = (await request.json()) as { post_type?: string; slug?: string };
    cosa = [body.post_type, body.slug].filter(Boolean).join("/");
  } catch {
    // corpo assente o non JSON: si aggiorna comunque tutto
  }

  // { expire: 0 }: niente contenuto vecchio, la prossima richiesta rilegge subito WordPress.
  revalidateTag("wp", { expire: 0 });
  console.log(`[revalidate] contenuti WordPress aggiornati${cosa ? ` (${cosa})` : ""}`);
  return Response.json({ ok: true, now: Date.now() });
}
