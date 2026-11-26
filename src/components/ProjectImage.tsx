/* eslint-disable @next/next/no-img-element */
import Image, { getImageProps } from "next/image";
import { pImg } from "@/data/projects";

type Props = Omit<React.ComponentProps<typeof Image>, "src" | "width" | "height" | "alt"> & {
  src: string;
  alt: string;
  /** [larghezza, altezza] del file originale. Senza (dati locali di riserva) resta un <img> semplice. */
  dim?: [number, number];
  /** L'immagine tiene la sua larghezza naturale (CSS width: auto): vedi sotto. */
  natural?: boolean;
};

/**
 * "srcset" con le larghezze vere. L'ottimizzatore non ingrandisce: oltre la larghezza del file restituisce il file
 * com'e', ma il descrittore dichiara di piu' e un'immagine con width: auto verrebbe disegnata piu' piccola.
 */
function realWidths(srcSet: string, max: number) {
  const byWidth = new Map<number, string>();
  for (const c of srcSet.split(", ")) {
    const [url, d] = c.split(" ");
    const w = Math.min(parseInt(d, 10), max);
    if (!byWidth.has(w)) byWidth.set(w, url);
  }
  return Array.from(byWidth, ([w, url]) => `${url} ${w}w`).join(", ");
}

/** Immagine di un progetto, ridimensionata da next/image quando se ne conoscono le misure. */
export function ProjectImage({ src, alt, dim, natural, sizes, loading, fetchPriority, ...rest }: Props) {
  if (!dim) return <img src={pImg(src)} alt={alt} loading={loading} fetchPriority={fetchPriority} />;
  if (natural) {
    const { props } = getImageProps({ src: pImg(src), alt, width: dim[0], height: dim[1], sizes, quality: 80, loading });
    return <img {...props} alt={alt} srcSet={realWidths(props.srcSet!, dim[0])} />;
  }
  return <Image src={pImg(src)} alt={alt} width={dim[0]} height={dim[1]} sizes={sizes} quality={80} loading={loading} fetchPriority={fetchPriority} {...rest} />;
}
