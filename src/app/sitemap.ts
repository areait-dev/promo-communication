import type { MetadataRoute } from "next";
import { isPreview } from "@/lib/env";
import { SITE_URL } from "@/lib/seo";
import { SERVICES } from "@/data/services";
import { PROJECTS } from "@/data/projects";

/** sitemap.xml: elenca solo le pagine pubblicate. Sullo stage (Preview) è vuota, come robots.txt blocca tutto. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (isPreview) return [];
  const fixed = ["", "/chi-siamo", "/servizi", "/portfolio", "/team", "/contatti", "/lavora-con-noi", "/privacy"];
  const paths = [...fixed, ...SERVICES.map((s) => `/servizi/${s.id}`), ...PROJECTS.map((p) => `/portfolio/${p.id}`)];
  return paths.map((p) => ({ url: SITE_URL + p, priority: p === "" ? 1 : p.split("/").length > 2 ? 0.6 : 0.8 }));
}
