import type { MetadataRoute } from "next";
import { isPreview } from "@/lib/env";
import { SITE_URL } from "@/lib/seo";
import { getPublishedContent } from "@/lib/content";

/** sitemap.xml: elenca solo le pagine pubblicate. Sullo stage (Preview) è vuota, come robots.txt blocca tutto. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (isPreview) return [];
  const { services, projects } = await getPublishedContent();
  const fixed = ["", "/chi-siamo", "/servizi", "/portfolio", "/team", "/contatti", "/lavora-con-noi", "/privacy"];
  const paths = [...fixed, ...services.list.map((s) => `/servizi/${s.id}`), ...projects.map((p) => `/portfolio/${p.id}`)];
  return paths.map((p) => ({ url: SITE_URL + p, priority: p === "" ? 1 : p.split("/").length > 2 ? 0.6 : 0.8 }));
}
