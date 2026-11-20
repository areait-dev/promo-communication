import type { CSSProperties } from "react";
import { STAR } from "@/data/brand";

export function Star({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={`pc-star ${className}`} viewBox="-272 -272 544 544" aria-hidden="true" style={style}>
      <path d={STAR} />
    </svg>
  );
}
