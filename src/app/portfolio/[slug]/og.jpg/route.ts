import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { pImg } from "@/data/projects";
import { getPublishedContent } from "@/lib/content";

/**
 * Immagine di condivisione di un progetto: la copertina in JPG 1200×630 (le copertine sono webp e piu' panoramiche,
 * e non tutti i social leggono il webp). La copertina sta intera nel riquadro, con bande blu notte sopra e sotto.
 */
export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const p = (await getPublishedContent()).projects.find((x) => x.id === slug);
  if (!p?.cover) return new Response("Immagine non trovata.", { status: 404 });

  // l'indirizzo viene solo dai contenuti (WordPress o dati locali), mai dalla richiesta
  const src = pImg(p.cover);
  let input: Buffer;
  if (src.startsWith("/")) input = await readFile(join(process.cwd(), "public", src));
  else {
    const res = await fetch(src, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return new Response("Immagine non disponibile.", { status: 502 });
    input = Buffer.from(await res.arrayBuffer());
  }
  const jpg = await sharp(input)
    .flatten({ background: "#ccd1e2" })
    .resize(1200, 630, { fit: "contain", background: "#000a33" })
    .jpeg({ quality: 82 })
    .toBuffer();
  return new Response(new Uint8Array(jpg), {
    headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=86400, s-maxage=604800" },
  });
}
