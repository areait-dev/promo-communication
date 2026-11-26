/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { pImg } from "@/data/projects";

type Props = Omit<React.ComponentProps<typeof Image>, "src" | "width" | "height" | "alt"> & {
  src: string;
  alt: string;
  /** [larghezza, altezza] del file originale. Senza (dati locali di riserva) resta un <img> semplice. */
  dim?: [number, number];
};

/** Immagine di un progetto, ridimensionata da next/image quando se ne conoscono le misure. */
export function ProjectImage({ src, alt, dim, sizes, loading, fetchPriority, ...rest }: Props) {
  if (!dim) return <img src={pImg(src)} alt={alt} loading={loading} fetchPriority={fetchPriority} />;
  return <Image src={pImg(src)} alt={alt} width={dim[0]} height={dim[1]} sizes={sizes} quality={80} loading={loading} fetchPriority={fetchPriority} {...rest} />;
}
