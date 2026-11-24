import type { MetadataRoute } from "next";
import { isPreview } from "@/lib/env";

/** robots.txt: sullo stage (deploy Preview di Vercel) blocca tutto; in produzione lascia indicizzare. */
export default function robots(): MetadataRoute.Robots {
  return isPreview ? { rules: { userAgent: "*", disallow: "/" } } : { rules: { userAgent: "*", allow: "/" } };
}
