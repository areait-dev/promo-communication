import type { MetadataRoute } from "next";
import { isPreview } from "@/lib/env";
import { SITE_URL } from "@/lib/seo";

/** robots.txt: sullo stage (deploy Preview di Vercel) blocca tutto; in produzione lascia indicizzare e indica la sitemap. */
export default function robots(): MetadataRoute.Robots {
  return isPreview
    ? { rules: { userAgent: "*", disallow: "/" } }
    : { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` };
}
