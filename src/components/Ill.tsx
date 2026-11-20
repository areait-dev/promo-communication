import { ILLUSTRATIONS } from "@/data/illustrations";

/** Illustrazioni SVG animate (statiche, dal design). */
export function Ill({ name }: { name: "teamico" | "bulb" | "wand" }) {
  const { cls, viewBox, inner } = ILLUSTRATIONS[name];
  return <svg className={cls} viewBox={viewBox} aria-hidden="true" dangerouslySetInnerHTML={{ __html: inner }} />;
}
